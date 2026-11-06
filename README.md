# Senda Segura

Senda Segura is a mobile app designed to help hikers and cyclists explore **Bosque La Primavera, Jalisco**, more safely. Developed with **Fundación Más Bosque Manu**, the project brings together trail information, offline navigation, and access to emergency assistance in areas with limited cellular coverage.

The planned system connects visitors with park rangers through a mobile app, Bluetooth/LoRa communication beacons, and an emergency monitoring dashboard.

## Features

- **Map and navigation:** explore an illustrated forest map and view location indicators.
- **Routes and safety:** browse trail details and recommendations before a trip.
- **Offline map management:** preview map preparation and update flows.
- **Emergency profile:** manage the name and contact information associated with an alert.
- **SOS flow:** select an emergency, review the details, and follow its delivery status.

**Status:** this repository contains an interactive mobile prototype. Maps, permissions, and emergency delivery are simulated, and data is kept in memory for the current session. Backend services and device integrations are planned for future development.

## Built with

- React Native and Expo SDK 58
- TypeScript
- Expo Router
- React Native SVG
- Playwright, ESLint, and Prettier

## Getting started

Use a supported Node.js release (22.13+, 24.3+, or 26+) and npm. Exact version requirements are listed in `package.json`.

```sh
npm ci
npm start
```

Open the app in an Expo SDK 58-compatible client, or run it on a specific platform:

```sh
npm run android
npm run ios
npm run web
```

Android and iOS require the corresponding emulator or simulator setup. The iOS simulator requires macOS. No API keys or backend configuration are needed for the prototype.

## Project structure

```text
src/
├── app/          # Routes and layouts
├── screens/      # Screen implementations
├── navigation/   # Stack and tab navigation
├── components/   # Shared interface components
├── hooks/        # Session state
├── data/         # Demo content
├── constants/    # Theme and shared styles
└── types/        # Domain types
docs/             # Project and technical documentation
tests/            # Navigation tests
```

## Development

```sh
npm run typecheck
npm run lint
npm run format:check
npm run export:web
```

To run the browser navigation tests:

```sh
npx playwright install chromium
npm run test:e2e
```

## Documentation

- [Product requirements](PRD.md)
- [Architecture and navigation](docs/architecture.md)
- [Testing guide](docs/testing.md)
- [Project background and requirements](docs/project-context.md)
