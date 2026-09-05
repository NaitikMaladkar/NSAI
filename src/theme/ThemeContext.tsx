import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useColorScheme} from 'react-native';
import {themes, ThemeMode} from './colors';
import type {Theme} from './colors';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  effectiveMode: 'light' | 'dark';
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'ns.settings.theme';

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('dark'); // default dark like ChatGPT

  useEffect(() => {
    // Lazy-load AsyncStorage to avoid circular deps on first render
    (async () => {
      try {
        const AsyncStorage =
          require('@react-native-async-storage/async-storage').default;
        const stored = (await AsyncStorage.getItem(STORAGE_KEY)) as ThemeMode | null;
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const setMode = async (m: ThemeMode) => {
    setModeState(m);
    try {
      const AsyncStorage =
        require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(STORAGE_KEY, m);
    } catch (e) {
      // ignore
    }
  };

  const effectiveMode: 'light' | 'dark' =
    mode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : mode;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: themes[effectiveMode],
      mode,
      effectiveMode,
      setMode,
      toggle: () => setMode(effectiveMode === 'dark' ? 'light' : 'dark'),
    }),
    [mode, effectiveMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
