/**
 * NerveSynapse — Settings screen.
 * Theme toggle, mock latency, clear data.
 */
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
  SafeAreaView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../theme/ThemeContext';
import {useChatStore} from '../store/useChatStore';
import {listProviders} from '../services/aiService';
import type {ThemeMode} from '../types';

interface Props {
  onBack: () => void;
}

export function SettingsScreen({onBack}: Props) {
  const {theme, mode, setMode, effectiveMode} = useTheme();
  const clearEverything = useChatStore(s => s.clearEverything);
  const [mockLatency, setMockLatency] = useState('750');

  const handleClear = () => {
    Alert.alert(
      'Clear all data',
      'This will delete all conversations and messages on this device. This cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await clearEverything();
            Alert.alert('Done', 'All data cleared.');
          },
        },
      ],
    );
  };

  const themeOptions: Array<{id: ThemeMode; label: string}> = [
    {id: 'dark', label: 'Dark'},
    {id: 'light', label: 'Light'},
    {id: 'system', label: 'System'},
  ];

  return (
    <SafeAreaView style={[styles.root, {backgroundColor: theme.background}]}>
      {/* Header */}
      <View
        style={[styles.header, {backgroundColor: theme.background, borderBottomColor: theme.border}]}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Icon name="arrow-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, {color: theme.textPrimary}]}>Settings</Text>
        <View style={{width: 28}} />
      </View>

      {/* Theme */}
      <Section title="Appearance" theme={theme}>
        <Text style={[styles.label, {color: theme.textSecondary}]}>
          Theme
        </Text>
        <View style={styles.themeRow}>
          {themeOptions.map(opt => {
            const active = mode === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setMode(opt.id)}
                style={[
                  styles.themeBtn,
                  {
                    backgroundColor: active ? theme.accent : theme.inputBg,
                    borderColor: active ? theme.accent : theme.inputBorder,
                  },
                ]}>
                <Text
                  style={{
                    color: active ? '#FFFFFF' : theme.textSecondary,
                    fontSize: 13,
                    fontWeight: '600',
                  }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={[styles.hint, {color: theme.textMuted}]}>
          Currently using: {effectiveMode}
        </Text>
      </Section>

      {/* AI */}
      <Section title="AI provider" theme={theme}>
        <Text style={[styles.label, {color: theme.textSecondary}]}>
          Provider (v0.0.1 — mock only)
        </Text>
        <View style={styles.providerRow}>
          {listProviders().map(p => (
            <View
              key={p.id}
              style={[
                styles.providerPill,
                {
                  backgroundColor: p.id === 'mock' ? theme.accent : theme.inputBg,
                  borderColor: theme.inputBorder,
                },
              ]}>
              <Text
                style={{
                  color: p.id === 'mock' ? '#FFFFFF' : theme.textMuted,
                  fontSize: 12,
                  fontWeight: '600',
                }}>
                {p.name}
              </Text>
            </View>
          ))}
        </View>
        <Text style={[styles.label, {color: theme.textSecondary, marginTop: 14}]}>
          Mock reply delay (ms)
        </Text>
        <TextInput
          value={mockLatency}
          onChangeText={setMockLatency}
          keyboardType="numeric"
          style={[
            styles.input,
            {
              color: theme.textPrimary,
              backgroundColor: theme.inputBg,
              borderColor: theme.inputBorder,
            },
          ]}
        />
      </Section>

      {/* About */}
      <Section title="About" theme={theme}>
        <View style={styles.aboutRow}>
          <Text style={[styles.label, {color: theme.textSecondary}]}>Version</Text>
          <Text style={[styles.value, {color: theme.textPrimary}]}>0.0.1</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={[styles.label, {color: theme.textSecondary}]}>Sync</Text>
          <Text style={[styles.value, {color: theme.textPrimary}]}>Local only</Text>
        </View>
      </Section>

      {/* Danger zone */}
      <Section title="Data" theme={theme}>
        <TouchableOpacity
          onPress={handleClear}
          style={[styles.dangerBtn, {borderColor: theme.danger}]}>
          <Icon name="trash-can-outline" size={18} color={theme.danger} />
          <Text style={[styles.dangerText, {color: theme.danger}]}>
            Clear all conversations
          </Text>
        </TouchableOpacity>
      </Section>

      <View style={{height: 40}} />
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
  theme,
}: {
  title: string;
  children: React.ReactNode;
  theme: any;
}) {
  return (
    <View style={[styles.section, {borderBottomColor: theme.border}]}>
      <Text style={[styles.sectionTitle, {color: theme.textPrimary}]}>
        {title}
      </Text>
      {children}
    </View>
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
    gap: 12,
  },
  iconBtn: {
    padding: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 13,
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
  },
  providerRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  providerPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginTop: 4,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  dangerText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
