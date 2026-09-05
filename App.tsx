/**
 * NerveSynapse — Root App component.
 */
import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider, useTheme} from './src/theme/ThemeContext';
import {AppNavigator} from './src/navigation/AppNavigator';

function Inner() {
  const {theme, effectiveMode} = useTheme();
  return (
    <>
      <StatusBar
        barStyle={effectiveMode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Inner />
    </ThemeProvider>
  );
}
