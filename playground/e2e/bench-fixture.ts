import { test as base, type Page } from '@playwright/test';

export interface BenchOptions {
  /** Chromium CPU throttling rate: 1 is the machine, 4 a mid-range phone. */
  cpuThrottle: number;
}

/** `page` comes throttled to `cpuThrottle` (set per project in playwright.bench.config.ts). */
export const test = base.extend<BenchOptions>({
  cpuThrottle: [1, { option: true }],
  page: async ({ page, cpuThrottle }, use) => {
    if (cpuThrottle > 1) {
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpuThrottle });
    }
    await use(page);
  },
});

export { expect } from '@playwright/test';

const stats = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] ?? 0;
  return {
    count: values.length,
    p50: +at(0.5).toFixed(2),
    p95: +at(0.95).toFixed(2),
    max: +(sorted[sorted.length - 1] ?? 0).toFixed(2),
  };
};

type LongTaskWindow = Window & { __longTasks?: { durations: number[]; observer: PerformanceObserver } };

/** Clears the demo's `window.__bench` buffers and starts recording (plus long tasks). */
export const startRecording = (page: Page): Promise<void> =>
  page.evaluate(() => {
    const bench = window.__bench!;
    bench.reorders.length = 0;
    bench.frames.length = 0;
    bench.recording = true;
    const win = window as LongTaskWindow;
    win.__longTasks?.observer.disconnect();
    const durations: number[] = [];
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) durations.push(entry.duration);
    });
    observer.observe({ type: 'longtask' });
    win.__longTasks = { durations, observer };
  });

export interface BenchReport {
  scenario: string;
  cpu: number;
  reorderMs: ReturnType<typeof stats>;
  frameMs: ReturnType<typeof stats>;
  framesOver20ms: number;
  longTasks: { count: number; totalMs: number; maxMs: number };
}

/** Stops recording and logs the report (`BENCH {…}`), also attached as an annotation. */
export const stopRecording = async (
  page: Page,
  scenario: string,
  cpu: number,
): Promise<BenchReport> => {
  const raw = await page.evaluate(() => {
    const bench = window.__bench!;
    bench.recording = false;
    const longTasks = (window as LongTaskWindow).__longTasks;
    longTasks?.observer.disconnect();
    return {
      reorders: [...bench.reorders],
      frames: [...bench.frames],
      longTasks: [...(longTasks?.durations ?? [])],
    };
  });
  const report: BenchReport = {
    scenario,
    cpu,
    reorderMs: stats(raw.reorders),
    frameMs: stats(raw.frames),
    framesOver20ms: raw.frames.filter((ms) => ms > 20).length,
    longTasks: {
      count: raw.longTasks.length,
      totalMs: Math.round(raw.longTasks.reduce((sum, ms) => sum + ms, 0)),
      maxMs: Math.round(Math.max(0, ...raw.longTasks)),
    },
  };
  console.log('BENCH', JSON.stringify(report));
  test.info().annotations.push({ type: 'bench', description: JSON.stringify(report) });
  return report;
};
