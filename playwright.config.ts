import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:8085',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'mobile-chromium', use: { ...devices['Pixel 7'] } }],
  webServer: {
    command: 'npx expo start --web --port 8085 --offline',
    url: 'http://127.0.0.1:8085',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { CI: '1', EXPO_NO_TELEMETRY: '1' },
  },
});
