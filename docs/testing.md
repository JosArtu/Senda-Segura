# Reviewing the navigation skeleton

[README](../README.md) · [Architecture](architecture.md)

## Automated checks

```sh
npm run typecheck
npm run lint
npx expo install --check
npm run export:web
npx playwright install chromium
npm run test:e2e
```

The Playwright configuration starts an Expo web server on port 8085 and uses a mobile-sized Chromium viewport. Browser installation is a one-time download. Tests use fake profile values and cover:

- Onboarding validation, all four tabs, route details and back navigation.
- Map preparation and profile/permission changes shared across screens.
- Disabled progression before category selection, SOS cancellation without creating an alert, pending requests, and retry without duplication or false receipt.
- Absence of prototype/demo UI labels, no external HTTP requests during SOS, loss of session data after reload, and recovery from invalid category, trail, alert, or screen links.

Browser tests exercise the React Native Web rendition. Passing them is not evidence of Android/iOS device behavior, offline map availability, GPS accuracy, radio delivery, or project acceptance metrics.

## Manual review on a device

1. Start the app with `npm start` and open it in an Expo SDK 58-compatible client. Check safe areas and readable content on a small screen.
2. Open setup, submit an empty form, enter a fictional name and 10–15-digit phone, and save. Verify that the map greets the entered name. Also try skipping the profile from a fresh launch.
3. Open each tab. Open a route detail and use both the onscreen back button and the device's native back behavior. Verify that routes can still be reached afterward.
4. Simulate map download, check for an update, and remove it. Verify that the map tab's preparation indicator changes.
5. Edit the profile and toggle a connection preference. Verify shared state and keyboard/scroll behavior without any actual OS permission prompt.
6. Open SOS. Confirm that Continue is disabled until a category is selected. Cancel from both steps and verify that no alert is created.
7. Create a pending request. Return to the map, reopen it, and retry. Verify a single request remains, the service-unavailable message appears, and no receipt is claimed.
8. Rapidly press the confirmation button. Verify that there is only one new pending request and no real SMS, external network request, or Bluetooth operation occurs.
9. Reload. Verify that profile, download state, and alerts reset. A restored result URL should explain that the session has no such alert.
10. Check screen-reader labels, touch controls, larger system font sizes, and keyboard navigation in the web preview.

Native device/simulator execution and accessibility checks must be recorded separately; Metro bundle generation alone does not establish that they passed.

## Recorded validation — November 6, 2026

- TypeScript and ESLint checks passed.
- Dependency versions matched Expo SDK 58's bundled compatibility map (the CLI used its local/offline map).
- Production JavaScript bundles were generated for web, Android, and iOS.
- All three mobile Chromium navigation tests passed.
- Native device/simulator execution, real permissions/transports, and field measurements were not performed.
