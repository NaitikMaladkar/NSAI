/**
 * NerveSynapse — Chat screen.
 * Full chat UI: header with menu button, message list, input bar.
 */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ChatMessage} from '../components/ChatMessage';
import {ChatInput} from '../components/ChatInput';
import {Sidebar} from '../components/Sidebar';
import {useChatStore} from '../store/useChatStore';
import {useTheme} from '../theme/ThemeContext';

interface Props {
  onOpenSettings: () => void;
}

export function ChatScreen({onOpenSettings}: Props) {
  const {theme} = useTheme();
  const messages = useChatStore(s => s.messages);
  const conversations = useChatStore(s => s.conversations);
  const activeId = useChatStore(s => s.activeConversationId);
  const sending = useChatStore(s => s.sending);
  const init = useChatStore(s => s.init);
  const sendMessage = useChatStore(s => s.sendMessage);
  const editUserMessage = useChatStore(s => s.editUserMessage);
  const regenerateAssistant = useChatStore(s => s.regenerateAssistantReply);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    init();
  }, [init]);

  const activeConversation = conversations.find(c => c.id === activeId);

  const convoMessages = useMemo(() => {
    if (!activeId) {
      return [];
    }
    return messages
      .filter(m => m.chatId === activeId)
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [messages, activeId]);

  useEffect(() => {
    if (convoMessages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({animated: true}), 50);
    }
  }, [convoMessages.length, sending]);

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditingValue(content);
  };

  const submitEdit = async () => {
    if (editingId && editingValue.trim()) {
      await editUserMessage(editingId, editingValue.trim());
    }
    setEditingId(null);
    setEditingValue('');
  };

  const isWide = Platform.OS === 'windows' || Platform.OS === 'macos' || Platform.OS === 'web';

  return (
    <SafeAreaView
      style={[styles.root, {backgroundColor: theme.chatArea}]}>
      <View style={[styles.root, {flexDirection: isWide ? 'row' : 'column'}]}>
        {/* Sidebar (inline on desktop, overlay on mobile) */}
        {isWide ? (
          <View style={{width: 280, height: '100%'}}>
            <Sidebar
              open
              onOpenSettings={onOpenSettings}
              onClose={() => {}}
            />
          </View>
        ) : (
          <Sidebar
            open={sidebarOpen}
            onOpenSettings={onOpenSettings}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Main column */}
        <View style={{flex: 1}}>
          {/* Header */}
          <View
            style={[styles.header, {backgroundColor: theme.chatArea, borderBottomColor: theme.border}]}>
            {!isWide && (
              <TouchableOpacity
                onPress={() => setSidebarOpen(true)}
                style={styles.iconBtn}>
                <Icon name="menu" size={24} color={theme.textPrimary} />
              </TouchableOpacity>
            )}
            <Text style={[styles.title, {color: theme.textPrimary}]} numberOfLines={1}>
              {activeConversation?.title ?? 'NerveSynapse'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (!isWide) {
                  setSidebarOpen(false);
                }
              }}
              style={styles.iconBtn}>
              <Icon name="plus" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <FlatList
            ref={listRef}
            data={convoMessages}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messageList}
            renderItem={({item, index}) => (
              <ChatMessage
                message={item}
                isLast={index === convoMessages.length - 1}
                sending={sending}
                onEditUserMessage={startEdit}
                onRegenerateAssistant={regenerateAssistant}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon name="brain" size={48} color={theme.accent} />
                <Text style={[styles.emptyTitle, {color: theme.textPrimary}]}>
                  NerveSynapse
                </Text>
                <Text style={[styles.emptySub, {color: theme.textSecondary}]}>
                  Ask anything to start a conversation.
                </Text>
              </View>
            }
          />

          {/* Input */}
          <ChatInput onSend={sendMessage} disabled={sending} />
        </View>
      </View>

      {/* Edit modal */}
      <Modal visible={editingId !== null} transparent animationType="fade">
        <View style={styles.editOverlay}>
          <View style={[styles.editCard, {backgroundColor: theme.sidebar}]}>
            <Text style={[styles.editTitle, {color: theme.textPrimary}]}>
              Edit message
            </Text>
            <TextInput
              autoFocus
              value={editingValue}
              onChangeText={setEditingValue}
              multiline
              style={[
                styles.editInput,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                },
              ]}
              placeholder="Edit your message..."
              placeholderTextColor={theme.textMuted}
            />
            <View style={styles.editActions}>
              <TouchableOpacity onPress={() => setEditingId(null)}>
                <Text style={[styles.editAction, {color: theme.textSecondary}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitEdit}>
                <Text style={[styles.editAction, {color: theme.accent}]}>
                  Save & resend
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  iconBtn: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  messageList: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 14,
    marginTop: 6,
  },
  editOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  editCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 12,
    padding: 18,
  },
  editTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
    gap: 18,
  },
  editAction: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
