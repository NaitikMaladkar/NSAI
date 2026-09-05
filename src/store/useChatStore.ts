/**
 * NerveSynapse — Zustand store for chat state.
 * Owns conversations + messages, persists to AsyncStorage on every mutation.
 */
import {create} from 'zustand';
import type {ChatMessage, Conversation} from '../types';
import {
  loadConversations,
  loadMessages,
  saveConversations,
  saveMessages,
  uuid,
  clearAll,
} from '../services/storage';
import {getAIService} from '../services/aiService';
import {getSyncAdapter} from '../services/syncService';

interface ChatState {
  conversations: Conversation[];
  messages: ChatMessage[];
  activeConversationId: string | null;
  loading: boolean;
  sending: boolean;
  error: string | null;

  init: () => Promise<void>;
  newConversation: () => Promise<string>;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => Promise<void>;
  renameConversation: (id: string, title: string) => Promise<void>;

  sendMessage: (content: string) => Promise<void>;
  editUserMessage: (messageId: string, newContent: string) => Promise<void>;
  regenerateAssistantReply: (assistantMessageId: string) => Promise<void>;

  clearEverything: () => Promise<void>;
}

let abortController: AbortController | null = null;

export const useChatStore = create<ChatState>((set, get) => {
  const persist = async () => {
    const {conversations, messages} = get();
    await saveConversations(conversations);
    await saveMessages(messages);
    // Fire-and-forget sync push (no-op in v0.0.1)
    getSyncAdapter()
      .push(conversations, messages)
      .catch(() => {});
  };

  return {
    conversations: [],
    messages: [],
    activeConversationId: null,
    loading: false,
    sending: false,
    error: null,

    init: async () => {
      set({loading: true});
      try {
        const [convos, msgs] = await Promise.all([
          loadConversations(),
          loadMessages(),
        ]);
        set({
          conversations: convos,
          messages: msgs,
          activeConversationId: convos[0]?.id ?? null,
          loading: false,
        });
      } catch (e: any) {
        set({loading: false, error: e?.message ?? 'Failed to load'});
      }
    },

    newConversation: async () => {
      const convo: Conversation = {
        id: uuid(),
        title: 'New chat',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      set(state => ({
        conversations: [convo, ...state.conversations],
        activeConversationId: convo.id,
      }));
      await persist();
      return convo.id;
    },

    selectConversation: (id: string) => {
      set({activeConversationId: id});
    },

    deleteConversation: async (id: string) => {
      set(state => {
        const conversations = state.conversations.filter(c => c.id !== id);
        const messages = state.messages.filter(m => m.chatId !== id);
        const activeConversationId =
          state.activeConversationId === id
            ? (conversations[0]?.id ?? null)
            : state.activeConversationId;
        return {conversations, messages, activeConversationId};
      });
      await persist();
    },

    renameConversation: async (id: string, title: string) => {
      set(state => ({
        conversations: state.conversations.map(c =>
          c.id === id ? {...c, title, updatedAt: Date.now()} : c,
        ),
      }));
      await persist();
    },

    sendMessage: async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) {
        return;
      }
      const state = get();
      let chatId = state.activeConversationId;
      if (!chatId) {
        chatId = await get().newConversation();
      }

      const now = Date.now();
      const userMsg: ChatMessage = {
        id: uuid(),
        chatId: chatId!,
        role: 'user',
        content: trimmed,
        createdAt: now,
        updatedAt: now,
      };
      const assistantMsg: ChatMessage = {
        id: uuid(),
        chatId: chatId!,
        role: 'assistant',
        content: '',
        createdAt: now + 1,
        updatedAt: now + 1,
      };

      // If conversation is still named "New chat", suggest a title
      const convo = get().conversations.find(c => c.id === chatId);
      const shouldRetitle = convo && convo.title === 'New chat';

      set(s => ({
        messages: [...s.messages, userMsg, assistantMsg],
        sending: true,
        error: null,
      }));

      try {
        abortController?.abort();
        abortController = new AbortController();
        const ai = getAIService();
        const historyForAI = [...get().messages.filter(m => m.id !== assistantMsg.id && m.id !== userMsg.id), userMsg];
        const reply = await ai.generateReply(historyForAI, abortController.signal);

        // Update assistant message
        set(s => ({
          messages: s.messages.map(m =>
            m.id === assistantMsg.id ? {...m, content: reply, updatedAt: Date.now()} : m,
          ),
          conversations: shouldRetitle
            ? s.conversations.map(async c => {
                if (c.id === chatId) {
                  const title = await ai.suggestTitle(trimmed);
                  return {...c, title, updatedAt: Date.now()};
                }
                return c;
              }).then ? s.conversations : s.conversations // (the async map above is a guard; we run a separate sync retitling below)
            : s.conversations.map(c =>
                c.id === chatId ? {...c, updatedAt: Date.now()} : c,
              ),
        }));

        // Sync retitling (since map+async doesn't work synchronably in set)
        if (shouldRetitle) {
          try {
            const title = await ai.suggestTitle(trimmed);
            set(s => ({
              conversations: s.conversations.map(c =>
                c.id === chatId ? {...c, title, updatedAt: Date.now()} : c,
              ),
            }));
          } catch (e) {
            // ignore title errors
          }
        }

        await persist();
      } catch (e: any) {
        const errMsg =
          e?.name === 'AbortError'
            ? 'Cancelled'
            : e?.message ?? 'Something went wrong';
        set(s => ({
          messages: s.messages.map(m =>
            m.id === assistantMsg.id
              ? {...m, content: `_Error: ${errMsg}_`, updatedAt: Date.now()}
              : m,
          ),
          error: errMsg,
        }));
      } finally {
        set({sending: false});
        abortController = null;
      }
    },

    editUserMessage: async (messageId: string, newContent: string) => {
      const trimmed = newContent.trim();
      if (!trimmed) {
        return;
      }
      // 1. Update the user message
      set(s => ({
        messages: s.messages.map(m =>
          m.id === messageId
            ? {...m, content: trimmed, edited: true, updatedAt: Date.now()}
            : m,
        ),
      }));
      // 2. Find the immediately-following assistant message and regenerate it
      const state = get();
      const idx = state.messages.findIndex(m => m.id === messageId);
      if (idx < 0) {
        return;
      }
      const followingAssistant = state.messages
        .slice(idx + 1)
        .find(m => m.role === 'assistant');
      if (followingAssistant) {
        await get().regenerateAssistantReply(followingAssistant.id);
      } else {
        // No assistant reply yet — just send
        await get().sendMessage(trimmed);
      }
    },

    regenerateAssistantReply: async (assistantMessageId: string) => {
      const state = get();
      const target = state.messages.find(m => m.id === assistantMessageId);
      if (!target || target.role !== 'assistant') {
        return;
      }
      // Build history: everything before target
      const history = state.messages.filter(m => m.createdAt < target.createdAt);
      set(s => ({
        messages: s.messages.map(m =>
          m.id === assistantMessageId
            ? {...m, content: '', updatedAt: Date.now()}
            : m,
        ),
        sending: true,
        error: null,
      }));
      try {
        abortController?.abort();
        abortController = new AbortController();
        const ai = getAIService();
        const reply = await ai.generateReply(history, abortController.signal);
        set(s => ({
          messages: s.messages.map(m =>
            m.id === assistantMessageId
              ? {...m, content: reply, updatedAt: Date.now()}
              : m,
          ),
        }));
        await persist();
      } catch (e: any) {
        const errMsg =
          e?.name === 'AbortError'
            ? 'Cancelled'
            : e?.message ?? 'Something went wrong';
        set(s => ({
          messages: s.messages.map(m =>
            m.id === assistantMessageId
              ? {...m, content: `_Error: ${errMsg}_`, updatedAt: Date.now()}
              : m,
          ),
          error: errMsg,
        }));
      } finally {
        set({sending: false});
        abortController = null;
      }
    },

    clearEverything: async () => {
      await clearAll();
      set({
        conversations: [],
        messages: [],
        activeConversationId: null,
        error: null,
      });
    },
  };
});
