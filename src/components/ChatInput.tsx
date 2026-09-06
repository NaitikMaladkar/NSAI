/**
 * NerveSynapse — Chat input bar.
 */
import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../theme/ThemeContext';

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export function ChatInput({onSend, disabled, placeholder}: Props) {
  const {theme} = useTheme();
  const [value, setValue] = useState('');

  const handleSend = () => {
    const v = value.trim();
    if (!v || disabled) {
      return;
    }
    onSend(v);
    setValue('');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.chatArea,
          borderTopColor: theme.border,
        },
      ]}>
      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.inputBorder,
          },
        ]}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder ?? 'Message NerveSynapse...'}
          placeholderTextColor={theme.textMuted}
          multiline
          editable={!disabled}
          style={[styles.input, {color: theme.textPrimary}]}
          onSubmitEditing={e => {
            const v = e.nativeEvent.text.trim();
            if (v && !disabled) {
              onSend(v);
              setValue('');
            }
          }}
          blurOnSubmit={false}
          returnKeyType="send"
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={disabled || !value.trim()}
          style={[
            styles.sendBtn,
            {
              backgroundColor: disabled || !value.trim() ? theme.inputBorder : theme.accent,
            },
          ]}>
          <Icon name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 140,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginBottom: 2,
  },
});
