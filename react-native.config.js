/**
 * React Native CLI config — registers react-native-windows commands.
 * Required for `npx react-native init-windows` and `npx react-native run-windows`.
 */
const windowsCommands = require('@react-native-windows/cli').commands;

module.exports = {
  project: {
    ios: {},
    android: {},
  },
  commands: windowsCommands,
};
