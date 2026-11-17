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

## Project structure

- `src/app/` — screens (Expo Router: every file is a screen)
