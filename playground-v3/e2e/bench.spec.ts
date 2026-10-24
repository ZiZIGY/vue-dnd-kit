import { expect, test } from '@playwright/test';
import { center, waitForIdle } from './helpers';

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

/**
 * Go/no-go for the draft-order design (rfcs/0001-v3.md §15, phase A): 500 rows,
 * the active row swept up and down across ~20 neighbours, i.e. hundreds of reorders,
 * each a Vue patch of a 500-item v-for plus a FLIP pass.
 */
test('500 rows: reorder cost and frame times while dragging', async ({ page }) => {
  // BENCH_CPU=4 emulates a mid-range phone (Chromium CPU throttling).
  const throttle = Number(process.env.BENCH_CPU ?? 1);
  if (throttle > 1) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
  }
  await page.goto('/#bench');
  const rows = page.locator('[data-testid="bench"] .row');
  await expect(rows).toHaveCount(500);

  const start = await center(rows.nth(0));
  const bottom = await center(rows.nth(20));
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 8, { steps: 2 });
  await page.evaluate(() => {
    window.__bench!.reorders.length = 0;
    window.__bench!.frames.length = 0;
    window.__bench!.recording = true;
  });

  const STEPS = 90;
  for (let sweep = 0; sweep < 4; sweep++) {
    const [from, to] = sweep % 2 ? [bottom.y, start.y] : [start.y, bottom.y];
    for (let i = 1; i <= STEPS; i++) {
      await page.mouse.move(start.x, from + ((to - from) * i) / STEPS);
      await page.waitForTimeout(16);
    }
  }

  const result = await page.evaluate(() => {
    window.__bench!.recording = false;
    return { reorders: [...window.__bench!.reorders], frames: [...window.__bench!.frames] };
  });
  await page.mouse.up();
  await waitForIdle(page);

  const report = {
    reorderMs: stats(result.reorders),
    frameMs: stats(result.frames),
    framesOver20ms: result.frames.filter((ms) => ms > 20).length,
  };
  console.log('BENCH', JSON.stringify(report));
  test.info().annotations.push({ type: 'bench', description: JSON.stringify(report) });
  expect(result.reorders.length).toBeGreaterThan(50);
});
