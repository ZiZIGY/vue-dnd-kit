import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';

// Must match vite.config.ts; parallel worktrees use different ports.
const port = Number(process.env.PLAYGROUND_PORT ?? 4100);
// An explicit IPv4 host: Vite binds `localhost` to ::1 only on some systems, and
// Firefox intermittently resolves `localhost` to 127.0.0.1 (connection refused).
const host = '127.0.0.1';
const url = `http://${host}:${port}`;
const viewport = { width: 1200, height: 900 };
const ci = !!process.env.CI;

/**
 * Desktop browsers skip benchmarks (`yarn bench`, playwright.bench.config.ts) and
 * touch specs: tag a test `@touch` and it runs only in the `mobile` project,
 * which has a touchscreen.
 */
const desktop = { testIgnore: '**/bench.spec.ts', grepInvert: /@touch/ };

export const baseConfig: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  reporter: ci ? [['github'], ['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: url,
    viewport,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: `yarn dev --host ${host}`,
    url,
    reuseExistingServer: !ci,
    timeout: 120_000,
  },
};

export default defineConfig({
  ...baseConfig,
  projects: [
    { name: 'chromium', ...desktop, use: { ...devices['Desktop Chrome'], viewport } },
    { name: 'firefox', ...desktop, use: { ...devices['Desktop Firefox'], viewport } },
    { name: 'webkit', ...desktop, use: { ...devices['Desktop Safari'], viewport } },
    {
      name: 'mobile',
      testIgnore: '**/bench.spec.ts',
      grep: /@touch/,
      // Chromium with touch and a mobile viewport (Pixel 7 runs on Chromium).
      use: { ...devices['Pixel 7'] },
    },
  ],
});
