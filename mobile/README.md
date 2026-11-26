# quitt — mobile app

React Native + Expo app (TypeScript, Expo Router) for collecting receipts, trips and deadlines.

## Requirements

- Node.js (current LTS version)
- [Expo Go](https://expo.dev/go) app on your phone (iOS or Android)
- Phone and computer in the same Wi-Fi network

## Getting started

Run all commands in the `mobile/` folder.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Scan the QR code from the terminal: with the camera app on iPhone, or with Expo Go on Android.

If the app cannot connect (for example, the network blocks it), use tunnel mode:

```bash
npx expo start --tunnel
```

## Code quality

```bash
npm run lint          # check the code with ESLint
npm run format        # format all files with Prettier
npm run format:check  # check formatting without changing files
```

Run `npm run lint` and `npm run format` before opening a pull request.

## Accessibility

Every screen follows the requirements in [docs/overview_en.md](../docs/overview_en.md#accessibility). The short version for writing components:

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Beleg scannen"
  onPress={openCamera}
  style={{ minWidth: 44, minHeight: 44 }}
>
  {/* camera icon */}
</Pressable>
```

- Icon-only buttons need an `accessibilityLabel` (in German, like the UI). A button with visible text gets its label from the text.
- Tab icons get their label in the tab options: `tabBarAccessibilityLabel` (see the camera button in `src/app/(tabs)/_layout.tsx`).
- Every `TextInput` gets an `accessibilityLabel` that matches its visible label (for example "E-Mail"). A placeholder alone is not a label.
- Set `accessibilityRole` (`button`, `link`, `header`, `switch`, `checkbox`). For toggles and checkboxes also set `accessibilityState={{ checked }}`. Good reference: the checkbox with role and state in `src/app/onboarding.tsx`.
- Tap targets are at least 44 × 44 pt. Use `hitSlop` for small icons.
- Do not turn off font scaling (`allowFontScaling={false}`) and avoid fixed heights on text containers.
- Do not use colour as the only signal: errors and status also get text.
- Test on a real phone: turn on VoiceOver (iPhone: Settings → Accessibility) or TalkBack (Android) and swipe through the screen. Set the system font size to the largest value and check that nothing is cut off.
- Pull requests with UI changes use the accessibility checklist from [docs/git-workflow.md](../docs/git-workflow.md#accessibility-checklist).

## Project structure

- `src/app/` — screens (Expo Router: every file is a screen)
