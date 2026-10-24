import { defineConfig, devices } from '@playwright/test';

// Must match vite.config.ts; parallel worktrees use different ports.
const port = Number(process.env.PLAYGROUND_PORT ?? 4100);
const url = `http://localhost:${port}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  use: {
    baseURL: url,
    viewport: { width: 1200, height: 900 },
  },
  webServer: {
    command: 'yarn dev',
    url,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1200, height: 900 } } }],
});
