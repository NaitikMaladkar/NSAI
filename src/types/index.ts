/**
 * NerveSynapse — Shared type definitions
 */

export type Role = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  chatId: string;
  role: Role;
  content: string;
  createdAt: number;
  updatedAt: number;
  /** True when user has edited the original message */
  edited?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  /** Optional pinned flag for future v0.0.2 features */
  pinned?: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: ThemeMode;
  /** Mock AI latency in ms — used by MockAIService */
  mockLatencyMs: number;
  /** When true the sidebar opens on app launch */
  sidebarDefaultOpen: boolean;
}

/** Sync adapter interface — local-only v0.0.1, future backend plugs in here */
export interface SyncAdapter {
  /** Push local conversations/messages to remote */
  push(
    conversations: Conversation[],
    messages: ChatMessage[],
  ): Promise<void>;
  /** Pull remote conversations/messages and replace local */
  pull(): Promise<{
    conversations: Conversation[];
    messages: ChatMessage[];
  }>;
  /** Human-readable name for UI display */
  readonly name: string;
}

/** AI service interface — mock now, real LLM later */
export interface AIService {
  /** Stream or return a single reply */
  generateReply(
    history: ChatMessage[],
    signal?: AbortSignal,
  ): Promise<string>;
  /** Suggested title for a new conversation based on first user message */
  suggestTitle(firstUserMessage: string): Promise<string>;
  readonly name: string;
}
