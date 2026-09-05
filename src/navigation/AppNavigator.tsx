/**
 * NerveSynapse — App navigation.
 * Simple state-based navigation (no NavContainer needed for single-stack).
 */
import React, {useState} from 'react';
import {ChatScreen} from '../screens/ChatScreen';
import {SettingsScreen} from '../screens/SettingsScreen';

type Screen = 'chat' | 'settings';

export function AppNavigator() {
  const [screen, setScreen] = useState<Screen>('chat');

  if (screen === 'settings') {
    return <SettingsScreen onBack={() => setScreen('chat')} />;
  }
  return <ChatScreen onOpenSettings={() => setScreen('settings')} />;
}
