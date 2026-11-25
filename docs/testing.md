# Reviewing the navigation skeleton and backend

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
- The offline tab explains that map download and updates are not available, and profile/permission changes stay shared across screens.
- Disabled progression before category selection, SOS cancellation without creating an alert, pending requests, and retry without duplication or false receipt.
- Trail-event cancellation without saving, placement at the current location, local-only visibility, and recovery from an unknown event link. No packaged example reports and no external HTTP during the flow.
- Absence of prototype/demo UI labels, no external HTTP requests during SOS, loss of session data after reload, and recovery from invalid category, trail, alert, event, or screen links.

Browser tests exercise the React Native Web rendition. Passing them is not evidence of Android/iOS device behavior, offline map availability, GPS accuracy, radio delivery, or project acceptance metrics.

## Backend checks

The downlink proxy in `backend/` has no automated test suite yet. Test it without contacting TTN by preloading a stub that replaces `fetch`. Save it outside the repository, for example as `/tmp/mock-fetch.mjs`:

```js
globalThis.fetch = async (url, init = {}) => {
  console.log('TTN stub', url, init.headers?.Authorization, init.body);
  if (process.env.MOCK_MODE === 'reject') return new Response('{"code":7}', { status: 403 });
  if (process.env.MOCK_MODE === 'network') throw new TypeError('fetch failed');
  return new Response('{}', { status: 200 });
};
```

```sh
cd backend
npm ci
TTN_APP_ID=app-ficticia TTN_API_KEY=clave-ficticia node --import /tmp/mock-fetch.mjs server.js
```

Then post requests with fictional IDs, for example:

```sh
curl -s -X POST http://localhost:3000/api/downlink \
  -H 'Content-Type: application/json' \
  -d '{"devId":"prueba-abp","command":"setInterval","value":60}'
```

Cover, at minimum: each allowlisted command and its hex payload, boundary values (0, 65535, 65536, negative, missing, non-numeric), unknown and inherited command names (`borrar`, `toString`), missing or malformed `devId`, a non-JSON body, TTN rejecting the request (403), and a network failure. Check that the TTN URL, `Authorization` header, FPort, and base64 payload are correct in the stub's log.

A test against the real TTN needs a registered device and a key in `backend/.env` (see `backend/.env.example`). Record it separately from the stubbed results. A 202 only proves that TTN queued the downlink; device receipt must be checked in the TTN console or on the device after its next uplink.

## Manual review on a device

1. Start the app with `npm start` and open it in an Expo SDK 58-compatible client. Check safe areas and readable content on a small screen.
2. Open setup, submit an empty form, enter a fictional name and 10–15-digit phone, and save. Verify that the map greets the entered name. Also try skipping the profile from a fresh launch.
3. Open each tab. Open a route detail and use both the onscreen back button and the device's native back behavior. Verify that routes can still be reached afterward.
4. Open the offline map tab. Verify that it does not offer a sample download, version, or update, and that the map tab stays unprepared.
5. Edit the profile and toggle a connection preference. Verify shared state and keyboard/scroll behavior without any actual OS permission prompt.
6. Open SOS. Confirm that Continue is disabled until a category is selected. Cancel from both steps and verify that no alert is created.
7. Create a pending request. Return to the map, reopen it, and retry. Verify a single request remains, the service-unavailable message appears, and no receipt is claimed.
8. Rapidly press the confirmation button. Verify that there is only one new pending request and no real SMS, external network request, or Bluetooth operation occurs.
9. From the map, open “Reportar un evento”. Confirm that Continue stays disabled until a type is selected, and that a name and description are required only for “Otro”. Cancel and verify that no event is saved. Create one, place it at the current location or by tapping the map, and verify that it appears on the map as saved on this device. Tap its icon and verify the cause appears in a bubble. Confirm that visitor and rescue sample reports do not appear.
10. Reload. Verify that profile, download state, alerts, and local trail events reset. A restored result URL should explain that the session has no such alert. An unknown event link should explain that the notice is unavailable.
11. Check screen-reader labels, touch controls, larger system font sizes, and keyboard navigation in the web preview.

Native device/simulator execution and accessibility checks must be recorded separately; Metro bundle generation alone does not establish that they passed.

## Recorded validation — November 25, 2026

Branch `feature/backend` at `0f3db37`, Node 26.0.0, Express 5.3.0. The backend was run with TTN replaced by a fetch stub, so no request reached TTN.

**Backend — working as intended**

- `reboot` → 202, payload `ff10ff` (base64 `/xD/`), FPort 85, confirmed, correct TTN URL and bearer header.
- `setInterval` 60 → `ff033c00`; 65535 → `ff03ffff`.
- An unknown command (`borrar`) → 400 `Comando no permitido`.
- TTN 403 → 502 with `queued: false`, and the TTN response is logged.
- `npm audit`: 0 vulnerabilities.

**Backend — defects found**

| #   | Input                                                   | Result                                                                                                                                                                                 |
| --- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | `command: "toString"` (any `Object.prototype` key)      | Passes the allowlist. Returns 202 with `hex: "[object Object]"` and queues an **empty** payload. Use `Object.hasOwn` or a `Map`.                                                       |
| B2  | `setInterval` with missing or non-numeric `value`       | Returns 202 and queues an interval of **0 seconds** (`ff030000`).                                                                                                                      |
| B3  | `setInterval` 70000 or −5                               | Unhandled `RangeError` → 500 HTML page with a stack trace.                                                                                                                             |
| B4  | `devId` missing, or `devId: "../../otra-app/devices/x"` | Not validated or URL-encoded. A missing ID becomes `devices/undefined`. Dot segments are normalized, so the request can target **another application's** device with the server's key. |
| B5  | Non-JSON body, or TTN unreachable                       | Unhandled error → 500 HTML with a stack trace and local file paths. The app's `res.json()` then fails and shows a JSON parse error.                                                    |
| B6  | CORS preflight from `http://localhost:8081`             | No `Access-Control-Allow-Origin`, so the web preview cannot use the proxy.                                                                                                             |
| B7  | `npm start` without `backend/.env`                      | `node: .env: not found`. Now documented in `backend/.env.example`.                                                                                                                     |

**Frontend**

- `npm run typecheck` passed.
- `npm run lint` **failed**: the root Expo ESLint config also lints `backend/server.js` (`expo/no-env-var-destructuring` ×3, `Buffer` undefined ×2). `backend/` needs a Node config or an ignore entry.
- `prettier --check` flags `backend/package.json`, `backend/server.js`, `downlinkApi.ts`, `SendDownlink.tsx`, and `SetupScreen.tsx`.
- Playwright: 3 passed, **1 failed** (`profile setup validates input…`). In `SetupScreen.tsx`, the space before `{/* NUEVO… */}` after `<SendDownlink … />` renders a stray text node. React Native Web raises "Unexpected text node", and the error overlay covers the tab bar, so the `Rutas` tab click times out. The SOS "no external HTTP" check still passed because the button sends nothing until pressed.
- No real TTN request, device downlink, or native device run was performed.

## Recorded validation — November 6, 2026

- TypeScript and ESLint checks passed.
- Dependency versions matched Expo SDK 58's bundled compatibility map (the CLI used its local/offline map).
- Production JavaScript bundles were generated for web, Android, and iOS.
- All three mobile Chromium navigation tests passed.
- Native device/simulator execution, real permissions/transports, and field measurements were not performed.
