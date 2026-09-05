/**
 * NerveSynapse — Local storage service (AsyncStorage-backed)
 * v0.0.1: local-only persistence.
 * Future: SyncAdapter implementations will wrap this layer.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {ChatMessage, Conversation, AppSettings} from '../types';

const K_CONVOS = 'ns.conversations';
const K_MSGS = 'ns.messages';
const K_SETTINGS = 'ns.settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  mockLatencyMs: 750,
  sidebarDefaultOpen: true,
};

/** Generate a stable unique id without external deps */
export function uuid(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 10);
  return `${t}-${r}`;
}

export async function loadConversations(): Promise<Conversation[]> {
  const raw = await AsyncStorage.getItem(K_CONVOS);
  if (!raw) {
    return [];
  }
  try {
    const list = JSON.parse(raw) as Conversation[];
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export async function saveConversations(list: Conversation[]): Promise<void> {
  await AsyncStorage.setItem(K_CONVOS, JSON.stringify(list));
}

export async function loadMessages(): Promise<ChatMessage[]> {
  const raw = await AsyncStorage.getItem(K_MSGS);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export async function saveMessages(list: ChatMessage[]): Promise<void> {
  await AsyncStorage.setItem(K_MSGS, JSON.stringify(list));
}

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(K_SETTINGS);
  if (!raw) {
    return DEFAULT_SETTINGS;
  }
  try {
    return {...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>)};
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(s: AppSettings): Promise<void> {
  await AsyncStorage.setItem(K_SETTINGS, JSON.stringify(s));
}

export async function clearAll(): Promise<void> {
  await AsyncStorage.multiRemove([K_CONVOS, K_MSGS]);
}
