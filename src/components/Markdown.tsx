/**
 * NerveSynapse — Markdown renderer (lightweight).
 * Uses react-native-markdown-display for full markdown support.
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {useTheme} from '../theme/ThemeContext';

interface Props {
  content: string;
}

export function MarkdownView({content}: Props) {
  const {theme} = useTheme();

  const rules = {
    body: {
      color: theme.assistantBubbleText,
      fontSize: 15,
      lineHeight: 22,
    },
    code_inline: {
      color: theme.accentSoft,
      backgroundColor: theme.inputBg,
      fontFamily: 'Menlo',
      paddingHorizontal: 4,
      paddingVertical: 1,
      borderRadius: 4,
      fontSize: 13,
    },
    code_block: {
      color: theme.textPrimary,
      backgroundColor: theme.inputBg,
      padding: 12,
      borderRadius: 8,
      fontSize: 13,
      fontFamily: 'Menlo',
      marginVertical: 8,
    },
    fence: {
      color: theme.textPrimary,
      backgroundColor: theme.inputBg,
      padding: 12,
      borderRadius: 8,
      fontSize: 13,
      fontFamily: 'Menlo',
      marginVertical: 8,
    },
    link: {
      color: theme.accent,
      textDecorationLine: 'underline' as const,
    },
    strong: {
      fontWeight: 'bold' as const,
      color: theme.textPrimary,
    },
    em: {
      fontStyle: 'italic' as const,
      color: theme.textPrimary,
    },
    list_item: {
      color: theme.textPrimary,
      marginBottom: 4,
    },
    heading1: {
      color: theme.textPrimary,
      fontSize: 22,
      fontWeight: 'bold' as const,
      marginTop: 12,
      marginBottom: 8,
    },
    heading2: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: 'bold' as const,
      marginTop: 10,
      marginBottom: 6,
    },
    heading3: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: 'bold' as const,
      marginTop: 8,
      marginBottom: 4,
    },
    blockquote: {
      backgroundColor: theme.inputBg,
      borderLeftWidth: 3,
      borderLeftColor: theme.accent,
      paddingLeft: 10,
      paddingVertical: 6,
      marginVertical: 6,
      color: theme.textSecondary,
    },
  };

  return <Markdown style={rules}>{content || '...'}</Markdown>;
}
