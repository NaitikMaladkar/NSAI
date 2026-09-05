/**
 * React Native CLI config.
 * Registers react-native-windows commands ONLY on Windows so the
 * Linux/Android autolink (`npx @react-native-community/cli config`) doesn't
 * try to load @react-native-windows/cli (which needs pwsh.exe to initialize).
 */
const isWindows = process.platform === 'win32';

const config = {
  project: {
    ios: {},
    android: {},
  },
};

if (isWindows) {
  try {
    config.commands = require('@react-native-windows/cli').commands;
  } catch (e) {
    console.warn('Failed to load @react-native-windows/cli commands:', e.message);
  }
}

module.exports = config;
