import { defineConfig, devices } from '@playwright/test';
import { baseConfig } from './playwright.config';
import type { BenchOptions } from './e2e/bench-fixture';

/**
 * Benchmarks (`yarn bench`), kept out of the default `playwright test` run.
 * Chromium only: CPU throttling goes through CDP. Runs 1× and 4× (a mid-range
 * phone); `BENCH_CPU=6 yarn bench` runs a single project at that rate instead.
 */
const viewport = { width: 1200, height: 900 };
const rates = process.env.BENCH_CPU ? [Number(process.env.BENCH_CPU)] : [1, 4];

export default defineConfig<BenchOptions>({
  ...baseConfig,
  timeout: 180_000,
  retries: 0,
  workers: 1,
  reporter: 'list',
  projects: rates.map((rate) => ({
    name: `bench-${rate}x`,
    testMatch: '**/bench.spec.ts',
    // Tracing snapshots the whole DOM after every action: with 5k cards that alone
    // produces long tasks, so it must stay off here.
    use: { ...devices['Desktop Chrome'], viewport, cpuThrottle: rate, trace: 'off', screenshot: 'off' },
  })),
});
