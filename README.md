# NerveSynapse

> Cross-platform AI chat app for **Android** and **Windows**.

NerveSynapse is a simple, ChatGPT-style chat client built with React Native + react-native-windows. v0.0.1 ships with a local-only mock AI service so the UI is fully testable without any API key. A real LLM backend is planned for a later release.

## Status

**Pre-launch · v0.0.x**

This is an early, pre-launch release. Things will break between versions.

## Downloads

Latest release: <https://github.com/NaitikMaladkar/NSAI/releases>

- **Android** (`*.apk`): tap the file on your device to sideload. Enable "Install from unknown sources" if prompted.
- **Windows** (`*.msix` or `*.msixbundle`): sideload after enabling Developer Mode in Windows Settings → Privacy & security → For developers.

## Features (v0.0.1)

- ChatGPT-style collapsible sidebar with chat history
- New chat button (auto-titled from your first message)
- Edit your message → automatic regenerate of the AI reply
- Regenerate any AI reply
- Copy any AI message
- Markdown rendering for AI messages
- Dark/Light/System theme toggle
- Settings page (theme, mock latency, clear data)
- Local-only persistence via AsyncStorage
- Sync abstraction layer (`SyncAdapter` interface) — future backend plugs in without UI changes
- AI service abstraction (`AIService` interface) — swap mock for OpenAI/Gemini/Anthropic later

## Tech stack

- [React Native 0.87](https://reactnative.dev/)
- [react-native-windows 0.87](https://microsoft.github.io/react-native-windows/)
- [Zustand](https://github.com/pmndrs/zustand) for state
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage) for persistence
- [react-native-markdown-display](https://github.com/iamacup/react-native-markdown-display)
- TypeScript

## Project structure

```
NerveSynapse/
├── src/
│   ├── components/    # Sidebar, ChatMessage, ChatInput, Markdown
│   ├── screens/       # ChatScreen, SettingsScreen
│   ├── services/      # aiService, mockAIService, storage, syncService
│   ├── store/         # useChatStore (Zustand)
│   ├── theme/         # colors, ThemeContext
│   ├── navigation/    # AppNavigator
│   └── types/          # shared TS types
├── android/           # Android native project (Gradle)
├── windows/           # react-native-windows native project (MSBuild)
└── .github/workflows/ # CI + per-platform build pipelines
```

## Local development

### Prerequisites

- Node.js 20+
- For Android: Android Studio (with SDK 35, NDK 27.1.12297006)
- For Windows: Visual Studio 2022 with WinUI 3 workload, .NET 8 SDK

### Run on Android

```bash
npm install --legacy-peer-deps
npm start
# in another shell:
npm run android
```

### Run on Windows

```bash
npm install --legacy-peer-deps
npx react-native-windows-init --overwrite --language cs
npm start
# in another shell:
npm run windows
```

## Releases

Releases are triggered by pushing a tag matching `v*.*.*`. GitHub Actions builds both APK and MSIX and attaches them to the GitHub Release automatically.

```bash
git tag v0.0.1
git push origin v0.0.1
```

## Author

**NaitikMaladkar** — <naitikmaladkar2009x@gmail.com>

## License

MIT
