/**
 * NerveSynapse — ChatMessage component.
 * Renders a single user or assistant message with appropriate bubble styling.
 * Long-press actions: edit (user), regenerate/copy (assistant).
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import {MarkdownView} from './Markdown';
import {useTheme} from '../theme/ThemeContext';
import type {ChatMessage as ChatMessageType} from '../types';

interface Props {
  message: ChatMessageType;
  isLast: boolean;
  sending: boolean;
  onEditUserMessage: (id: string, currentContent: string) => void;
  onRegenerateAssistant: (id: string) => void;
}

export function ChatMessage({
  message,
  isLast,
  sending,
  onEditUserMessage,
  onRegenerateAssistant,
}: Props) {
  const {theme} = useTheme();
  const isUser = message.role === 'user';
  const [showActions, setShowActions] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(message.content);
    setShowActions(false);
  };

  const handleLongPress = () => {
    if (isUser) {
      onEditUserMessage(message.id, message.content);
    } else {
      Alert.alert(
        'AI message',
        undefined,
        [
          {text: 'Copy', onPress: handleCopy},
          {text: 'Regenerate', onPress: () => onRegenerateAssistant(message.id)},
          {text: 'Cancel', style: 'cancel'},
        ],
        {cancelable: true},
      );
    }
  };

  const showLoading = !isUser && sending && isLast && !message.content;

  return (
    <View style={[styles.wrapper, isUser ? styles.userWrap : styles.aiWrap]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={handleLongPress}
        onPress={() => setShowActions(!showActions)}
        style={[
          styles.bubble,
          isUser
            ? {backgroundColor: theme.userBubble}
            : {backgroundColor: theme.assistantBubble},
        ]}>
        {showLoading ? (
          <View style={styles.loadingRow}>
            <Text style={[styles.loadingDots, {color: theme.assistantBubbleText}]}>
              ...
            </Text>
            <Text style={[styles.loadingText, {color: theme.textMuted}]}>
              Thinking
            </Text>
          </View>
        ) : isUser ? (
          <Text style={[styles.userText, {color: theme.userBubbleText}]}>
            {message.content}
          </Text>
        ) : (
          <MarkdownView content={message.content} />
        )}

        {message.edited && (
          <Text style={[styles.editedLabel, {color: theme.textMuted}]}>
            edited
          </Text>
        )}
      </TouchableOpacity>

      {/* Inline action row (visible on tap) */}
      {showActions && !showLoading && (
        <View
          style={[styles.actions, {backgroundColor: theme.inputBg}]}>
          <TouchableOpacity onPress={handleCopy} style={styles.actionBtn}>
            <Icon name="content-copy" size={16} color={theme.textSecondary} />
            <Text style={[styles.actionText, {color: theme.textSecondary}]}>
              Copy
            </Text>
          </TouchableOpacity>
          {isUser ? (
            <TouchableOpacity
              onPress={() => onEditUserMessage(message.id, message.content)}
              style={styles.actionBtn}>
              <Icon name="pencil" size={16} color={theme.textSecondary} />
              <Text style={[styles.actionText, {color: theme.textSecondary}]}>
                Edit
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => onRegenerateAssistant(message.id)}
              style={styles.actionBtn}>
              <Icon name="refresh" size={16} color={theme.textSecondary} />
              <Text style={[styles.actionText, {color: theme.textSecondary}]}>
                Regenerate
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    marginVertical: 4,
    maxWidth: '100%',
  },
  userWrap: {
    alignItems: 'flex-end',
  },
  aiWrap: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  userText: {
    fontSize: 15,
    lineHeight: 21,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loadingDots: {
    fontSize: 18,
    fontWeight: '700',
  },
  loadingText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 14,
    alignSelf: 'flex-start',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
  },
  editedLabel: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'right',
  },
});
