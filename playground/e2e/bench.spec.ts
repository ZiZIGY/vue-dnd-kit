import type { Page } from '@playwright/test';
import { expect, startRecording, stopRecording, test } from './bench-fixture';
import { center, scrollElement, waitForIdle, type Point } from './helpers';

// The sweep covers rows 0–20, which must be on screen: rows clipped by the viewport
// are not drop targets (rfcs/0001-v3.md §6).
test.use({ viewport: { width: 1200, height: 1200 } });

/**
 * Benchmarks (rfcs/0001-v3.md §12): `yarn bench` (playwright.bench.config.ts), never
 * part of the default run. Each scenario logs `BENCH {…}` with:
 * - reorderMs: one draft change through the end of its Vue flush (patch + FLIP);
 * - frameMs: rAF intervals while recording (16.7 at 60 Hz), framesOver20ms;
 * - longTasks: tasks over 50 ms.
 */

/** Presses on `point` and moves past the activation distance. */
const grabAt = async (page: Page, point: Point) => {
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await page.mouse.move(point.x, point.y + 8, { steps: 2 });
  await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
};

/** Moves along the points one 16 ms frame at a time, like a hand would. */
const glide = async (page: Page, points: Point[]) => {
  for (const point of points) {
    await page.mouse.move(point.x, point.y);
    await page.waitForTimeout(16);
  }
};

/** `sweeps` passes between two y coordinates (alternating direction) at a fixed x. */
const verticalSweep = (x: number, top: number, bottom: number, sweeps: number, steps: number) =>
  Array.from({ length: sweeps * steps }, (_, i) => {
    const sweep = Math.floor(i / steps);
    const t = ((i % steps) + 1) / steps;
    const [from, to] = sweep % 2 ? [bottom, top] : [top, bottom];
    return { x, y: from + (to - from) * t };
  });

/**
 * Go/no-go for the draft-order design (phase A): 500 rows, the active row swept
 * up and down across ~20 neighbours, i.e. hundreds of reorders, each a Vue patch
 * of a 500-item v-for plus a FLIP pass.
 */
test('500 rows: reorder cost and frame times while dragging', async ({ page, cpuThrottle }) => {
  await page.goto('/#bench');
  const rows = page.locator('[data-testid="bench"] .row');
  await expect(rows).toHaveCount(500);

  const start = await center(rows.nth(0));
  const bottom = await center(rows.nth(20));
  await grabAt(page, start);
  await startRecording(page);
  await glide(page, verticalSweep(start.x, start.y, bottom.y, 4, 90));
  const report = await stopRecording(page, '500 rows', cpuThrottle);
  await page.mouse.up();
  await waitForIdle(page);
  expect(report.reorderMs.count).toBeGreaterThan(50);
});

/**
 * 5 columns × 1,000 cards, all mounted: the active card crosses every column
 * and back while zig-zagging, so each column entry moves it between two
 * 1,000-key drafts (plus FLIP over 5k registered items).
 */
test('kanban 5 × 1,000 cards: cross-column drag sweep', async ({ page, cpuThrottle }) => {
  await page.goto('/#bench-kanban');
  const columns = ['k1', 'k2', 'k3', 'k4', 'k5'].map((id) => page.getByTestId(`bench-${id}`));
  for (const column of columns) await expect(column.locator('.row')).toHaveCount(1_000);

  const boxes = await Promise.all(columns.map(async (column) => (await column.boundingBox())!));
  const first = await center(columns[0]!.locator('.row').nth(1));
  const rowHeight = (await columns[0]!.locator('.row').nth(1).boundingBox())!.height + 6;
  const left = boxes[0]!.x + boxes[0]!.width / 2;
  const right = boxes[4]!.x + boxes[4]!.width / 2;

  await grabAt(page, first);
  await startRecording(page);
  const STEPS = 120;
  const points = Array.from({ length: 4 * STEPS }, (_, i) => {
    const sweep = Math.floor(i / STEPS);
    const t = ((i % STEPS) + 1) / STEPS;
    const [from, to] = sweep % 2 ? [right, left] : [left, right];
    // Zig-zag over rows 1–7 while crossing, so cards also reorder inside columns.
    const y = first.y + rowHeight * 3 * (1 - Math.cos(t * Math.PI * 6));
    return { x: from + (to - from) * t, y };
  });
  await glide(page, points);
  const report = await stopRecording(page, 'kanban 5k', cpuThrottle);
  await page.mouse.up();
  await waitForIdle(page);
  expect(report.reorderMs.count).toBeGreaterThan(20);
});

/**
 * 50,000 rows in TanStack Virtual: a drag sweep over the visible rows, then the
 * scroller moving under a still pointer (20 px per frame, like auto-scroll), so
 * the active row follows into freshly mounted rows on every frame.
 */
test('TanStack 50,000 rows: drag sweep and scroll', async ({ page, cpuThrottle }) => {
  await page.goto('/#bench-virtual');
  const scroller = page.getByTestId('tanstack-scroller');
  const row = (id: string) => scroller.locator(`[data-id="${id}"]`);
  await expect(row('r0')).toBeVisible();

  const start = await center(row('r1'));
  const bottom = await center(row('r12'));
  await grabAt(page, start);
  await startRecording(page);
  await glide(page, verticalSweep(start.x, start.y, bottom.y, 4, 90));
  const sweep = await stopRecording(page, 'tanstack 50k: sweep', cpuThrottle);
  expect(sweep.reorderMs.count).toBeGreaterThan(30);

  await startRecording(page);
  await scroller.evaluate(
    (element) =>
      new Promise<void>((resolve) => {
        let frames = 120;
        const step = () => {
          element.scrollTop += 20;
          if (--frames) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      }),
  );
  await scrollElement(scroller, await scroller.evaluate((element) => element.scrollTop));
  const scroll = await stopRecording(page, 'tanstack 50k: scroll', cpuThrottle);
  await page.mouse.up();
  await waitForIdle(page);
  expect(scroll.reorderMs.count).toBeGreaterThan(10);
});
