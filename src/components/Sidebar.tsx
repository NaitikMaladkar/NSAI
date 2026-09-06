/**
 * NerveSynapse — Sidebar component
 * ChatGPT-style collapsible list of conversations.
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useChatStore} from '../store/useChatStore';
import {useTheme} from '../theme/ThemeContext';

interface Props {
  open: boolean;
  onOpenSettings: () => void;
  onClose: () => void;
}

export function Sidebar({open, onOpenSettings, onClose}: Props) {
  const {theme} = useTheme();
  const conversations = useChatStore(s => s.conversations);
  const activeId = useChatStore(s => s.activeConversationId);
  const selectConversation = useChatStore(s => s.selectConversation);
  const newConversation = useChatStore(s => s.newConversation);
  const deleteConversation = useChatStore(s => s.deleteConversation);
  const renameConversation = useChatStore(s => s.renameConversation);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const handleNew = async () => {
    await newConversation();
    onClose();
  };

  const handleLongPress = (id: string, currentTitle: string) => {
    Alert.alert(
      'Conversation',
      undefined,
      [
        {
          text: 'Rename',
          onPress: () => {
            setRenamingId(id);
            setRenameValue(currentTitle);
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteConversation(id),
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const submitRename = async () => {
    if (renamingId && renameValue.trim()) {
      await renameConversation(renamingId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  if (!open) {
    return null;
  }

  return (
    <View
      style={[styles.container, {backgroundColor: theme.sidebar, borderRightColor: theme.border}]}
    >
      {/* New chat button */}
      <TouchableOpacity
        style={[styles.newChatBtn, {backgroundColor: theme.sidebarActive}]}
        onPress={handleNew}
        activeOpacity={0.7}>
        <Icon name="plus" size={20} color={theme.textPrimary} />
        <Text style={[styles.newChatText, {color: theme.textPrimary}]}>
          New chat
        </Text>
      </TouchableOpacity>

      {/* Conversation list */}
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => {
          const isActive = item.id === activeId;
          return (
            <TouchableOpacity
              style={[
                styles.convoItem,
                {
                  backgroundColor: isActive ? theme.sidebarActive : 'transparent',
                },
              ]}
              onPress={() => {
                selectConversation(item.id);
                onClose();
              }}
              onLongPress={() => handleLongPress(item.id, item.title)}>
              <Icon
                name="chatbubbles-outline"
                size={18}
                color={theme.textSecondary}
                style={{marginRight: 10}}
              />
              <Text
                style={[styles.convoTitle, {color: theme.textPrimary}]}
                numberOfLines={1}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, {color: theme.textMuted}]}>
            No conversations yet.
          </Text>
        }
      />

      {/* Footer */}
      <View style={[styles.footer, {borderTopColor: theme.border}]}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={onOpenSettings}
          activeOpacity={0.6}>
          <Icon name="cog-outline" size={20} color={theme.textSecondary} />
          <Text style={[styles.footerText, {color: theme.textSecondary}]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rename modal */}
      <Modal visible={renamingId !== null} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={submitRename}>
          <View
            style={[styles.modalCard, {backgroundColor: theme.sidebar}]}
            onStartShouldSetResponder={() => true}>
            <Text style={[styles.modalTitle, {color: theme.textPrimary}]}>
              Rename conversation
            </Text>
            <TextInput
              autoFocus
              value={renameValue}
              onChangeText={setRenameValue}
              style={[
                styles.modalInput,
                {
                  color: theme.textPrimary,
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                },
              ]}
              placeholder="Conversation title"
              placeholderTextColor={theme.textMuted}
              onSubmitEditing={submitRename}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setRenamingId(null)}>
                <Text style={[styles.modalAction, {color: theme.textSecondary}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitRename}>
                <Text style={[styles.modalAction, {color: theme.accent}]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    borderRightWidth: 1,
    paddingTop: 16,
    zIndex: 10,
  },
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  newChatText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  convoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 8,
    marginVertical: 2,
  },
  convoTitle: {
    fontSize: 14,
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 13,
  },
  footer: {
    borderTopWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  footerText: {
    marginLeft: 12,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 12,
    padding: 18,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 18,
  },
  modalAction: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
