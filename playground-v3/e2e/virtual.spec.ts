import { expect, test, type Locator, type Page } from '@playwright/test';
import {
  center,
  dragTo,
  dropAnimationKind,
  nextFrames,
  scrollElement,
  trackErrors,
  trackVueWarnings,
  waitForIdle,
  type Point,
} from './helpers';

/**
 * The virtualization contract (rfcs/0001-v3.md §9, rfcs/0001-v3/virtualization.md):
 * TanStack Virtual with the active row pinned through `rangeExtractor`, VueUse
 * `useVirtualList` where the active row unmounts when it leaves the range, and a
 * kanban of TanStack-virtualized columns. Scrolling is driven programmatically
 * (`scrollTop`), independent of the library's auto-scroll.
 */

const ROW = 40;
const HEAD_10 = (prefix: string) => Array.from({ length: 10 }, (_, i) => `${prefix}${i}`).join(',');

/** Watches for errors and Vue warnings; asserts there were none at the end of the test. */
const guard = (page: Page) => {
  const errors = trackErrors(page);
  const warnings = trackVueWarnings(page);
  return () => {
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  };
};

/** Presses on `row` and activates the drag without leaving the row (no reorder). */
const grab = async (page: Page, row: Locator): Promise<Point> => {
  const start = await center(row, 0.3);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 8, { steps: 2 });
  await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
  return { x: start.x, y: start.y + 8 };
};

/**
 * Moves the pointer sideways until the overlay no longer overlaps the scroller:
 * `pointerFirst` falls back to overlay intersection, so merely leaving with the
 * pointer would still hover the list.
 */
const leaveSideways = async (page: Page, scroller: Locator, from: Point) => {
  const box = (await scroller.boundingBox())!;
  await page.mouse.move(box.x + 2 * box.width + 40, from.y, { steps: 6 });
};

test.describe('TanStack Virtual list (10k rows)', () => {
  const row = (page: Page, id: string) =>
    page.locator(`[data-testid="tanstack-scroller"] [data-id="${id}"]`);

  test.beforeEach(async ({ page }) => {
    await page.goto('/#virtual-tanstack');
    await expect(page.getByTestId('tanstack-order')).toHaveText(HEAD_10('r'));
    await expect(row(page, 'r0')).toBeVisible();
  });

  test('reorders within the viewport and writes the order to the data', async ({ page }) => {
    const check = guard(page);
    await dragTo(page, row(page, 'r1'), await center(row(page, 'r4'), 0.8));
    await waitForIdle(page);
    await expect(page.getByTestId('tanstack-order')).toHaveText('r0,r2,r3,r4,r1,r5,r6,r7,r8,r9');
    await expect(page.getByTestId('tanstack-drop')).toHaveText('r1@4:r4,r1,r5');
    // Rendered rows follow the data (keys and positions are not stale).
    await expect(page.locator('[data-testid="tanstack-scroller"] [data-index="4"] [data-id]')).toHaveAttribute(
      'data-id',
      'r1',
    );
    check();
  });

  test('the pinned active row survives being scrolled out of range', async ({ page }) => {
    const check = guard(page);
    const scroller = page.getByTestId('tanstack-scroller');
    const point = await grab(page, row(page, 'r2'));
    await leaveSideways(page, scroller, point);

    await scrollElement(scroller, 100 * ROW);
    // Out of the visible range, but pinned by `rangeExtractor`, so still mounted.
    await expect(row(page, 'r2')).toHaveCount(1);
    await expect(row(page, 'r2')).not.toBeInViewport();
    await expect(row(page, 'r110')).toBeVisible();

    const target = await center(row(page, 'r110'), 0.8);
    await page.mouse.move(target.x, target.y, { steps: 10 });
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'r2');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('tanstack-drop')).toHaveText('r2@110:r110,r2,r111');
    await expect(page.getByTestId('tanstack-order')).toHaveText('r0,r1,r3,r4,r5,r6,r7,r8,r9,r10');
    check();
  });

  test('drops into a slot far down the list after scrolling', async ({ page }) => {
    const check = guard(page);
    const scroller = page.getByTestId('tanstack-scroller');
    const point = await grab(page, row(page, 'r1'));
    await leaveSideways(page, scroller, point);
    await scrollElement(scroller, 5_000 * ROW);
    const target = await center(row(page, 'r5005'), 0.8);
    await page.mouse.move(target.x, target.y, { steps: 10 });
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('tanstack-drop')).toHaveText('r1@5005:r5005,r1,r5006');
    check();
  });

  test('the overlay fades out when the dropped row is mounted but scrolled out of view', async ({
    page,
  }) => {
    const check = guard(page);
    const scroller = page.getByTestId('tanstack-scroller');
    const point = await grab(page, row(page, 'r2'));
    await leaveSideways(page, scroller, point);
    // r2 leaves the visible area but stays in the overscan, so it stays mounted after drop.
    await scrollElement(scroller, 5 * ROW);
    await expect(row(page, 'r2')).not.toBeInViewport();
    await page.mouse.up();
    expect(await dropAnimationKind(page)).toBe('fade');
    await waitForIdle(page);
    await expect(row(page, 'r2')).toHaveCount(1);
    await expect(page.getByTestId('tanstack-order')).toHaveText(HEAD_10('r'));
    check();
  });

  test('overscan rows outside the visible area are not sorting targets', async ({ page }) => {
    const check = guard(page);
    const scroller = page.getByTestId('tanstack-scroller');
    const point = await grab(page, row(page, 'r2'));
    await leaveSideways(page, scroller, point);
    await scrollElement(scroller, 100 * ROW);
    // Up while far to the right, then left to just above the scroller, never crossing
    // a visible row. There the overlay overlaps the list (so the list is hovered) and
    // the pointer is in the band of a mounted overscan row that is clipped away.
    const box = (await scroller.boundingBox())!;
    const far = box.x + 2 * box.width + 40;
    await page.mouse.move(far, box.y - 12, { steps: 4 });
    await page.mouse.move(box.x + box.width / 2, box.y - 12, { steps: 10 });
    await nextFrames(page);
    await expect(page.locator('[data-testid="tanstack-scroller"] [data-index="2"] [data-id]')).toHaveAttribute(
      'data-id',
      'r2',
    );
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('tanstack-order')).toHaveText(HEAD_10('r'));
    await expect(page.getByTestId('tanstack-drop')).toHaveText('');
    check();
  });

  test('the overlay flies to a visible dropped row', async ({ page }) => {
    const check = guard(page);
    await dragTo(page, row(page, 'r1'), await center(row(page, 'r3'), 0.8), { release: false });
    await page.mouse.up();
    expect(await dropAnimationKind(page)).toBe('fly');
    await waitForIdle(page);
    check();
  });

  test('Escape restores the order, also after scrolling the active row away', async ({ page }) => {
    const check = guard(page);
    const scroller = page.getByTestId('tanstack-scroller');
    await dragTo(page, row(page, 'r1'), await center(row(page, 'r5'), 0.8), { release: false });
    await expect(page.locator('[data-testid="tanstack-scroller"] [data-index="5"] [data-id]')).toHaveAttribute(
      'data-id',
      'r1',
    );
    await leaveSideways(page, scroller, await center(row(page, 'r1')));
    await scrollElement(scroller, 300 * ROW);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(page.getByTestId('tanstack-order')).toHaveText(HEAD_10('r'));
    await expect(page.getByTestId('tanstack-drop')).toHaveText('');
    await scrollElement(scroller, 0);
    await expect(page.locator('[data-testid="tanstack-scroller"] [data-index="1"] [data-id]')).toHaveAttribute(
      'data-id',
      'r1',
    );
    check();
  });
});

test.describe('VueUse useVirtualList (10k rows)', () => {
  const row = (page: Page, id: string) =>
    page.locator(`[data-testid="vueuse-scroller"] [data-id="${id}"]`);

  test.beforeEach(async ({ page }) => {
    await page.goto('/#virtual-vueuse');
    await expect(page.getByTestId('vueuse-order')).toHaveText(HEAD_10('v'));
    await expect(row(page, 'v0')).toBeVisible();
  });

  test('reorders within the viewport and writes the order to the data', async ({ page }) => {
    const check = guard(page);
    await dragTo(page, row(page, 'v1'), await center(row(page, 'v4'), 0.8));
    await waitForIdle(page);
    await expect(page.getByTestId('vueuse-order')).toHaveText('v0,v2,v3,v4,v1,v5,v6,v7,v8,v9');
    await expect(page.getByTestId('vueuse-drop')).toHaveText('v1@4:v4,v1,v5');
    check();
  });

  test('the active row unmounts when scrolled out of range and the drop still works', async ({
    page,
  }) => {
    const check = guard(page);
    const scroller = page.getByTestId('vueuse-scroller');
    const point = await grab(page, row(page, 'v2'));
    await leaveSideways(page, scroller, point);

    await scrollElement(scroller, 100 * ROW);
    // No pinning in VueUse: the active row is gone; the drag goes on by key.
    await expect(row(page, 'v2')).toHaveCount(0);
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);

    const target = await center(row(page, 'v110'), 0.8);
    await page.mouse.move(target.x, target.y, { steps: 10 });
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'v2');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('vueuse-drop')).toHaveText('v2@110:v110,v2,v111');
    await expect(page.getByTestId('vueuse-order')).toHaveText('v0,v1,v3,v4,v5,v6,v7,v8,v9,v10');
    check();
  });

  test('the overlay fades out when the dropped row is not rendered', async ({ page }) => {
    const check = guard(page);
    const scroller = page.getByTestId('vueuse-scroller');
    const point = await grab(page, row(page, 'v2'));
    await leaveSideways(page, scroller, point);
    await scrollElement(scroller, 100 * ROW);
    await expect(row(page, 'v2')).toHaveCount(0);
    // Dropped outside every list: the item stays in its slot (dropOutside: 'placeholder').
    await page.mouse.up();
    expect(await dropAnimationKind(page)).toBe('fade');
    await waitForIdle(page);
    await expect(page.getByTestId('vueuse-order')).toHaveText(HEAD_10('v'));
    check();
  });

  test('Escape restores the order after the active row unmounted', async ({ page }) => {
    const check = guard(page);
    const scroller = page.getByTestId('vueuse-scroller');
    await dragTo(page, row(page, 'v1'), await center(row(page, 'v5'), 0.8), { release: false });
    await leaveSideways(page, scroller, await center(row(page, 'v1')));
    await scrollElement(scroller, 300 * ROW);
    await expect(row(page, 'v1')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(page.getByTestId('vueuse-order')).toHaveText(HEAD_10('v'));
    await scrollElement(scroller, 0);
    await expect(row(page, 'v1')).toBeVisible();
    check();
  });
});

test.describe('virtual kanban (3 TanStack columns × 2k cards)', () => {
  const CARD = 56;
  const card = (page: Page, id: string) => page.locator(`[data-testid^="column-"] [data-id="${id}"]`);
  const column = (page: Page, id: string) => page.getByTestId(`column-${id}`);
  const INITIAL = 'todo(2000):a0,a1,a2,a3,a4 | doing(2000):b0,b1,b2,b3,b4 | done(2000):c0,c1,c2,c3,c4';

  /** Moves horizontally to the middle of a column: the pointer keeps its row band. */
  const slideTo = async (page: Page, id: string, y: number) => {
    const box = (await column(page, id).boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, y, { steps: 12 });
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/#virtual-kanban');
    await expect(page.getByTestId('virtual-board')).toHaveText(INITIAL);
    await expect(card(page, 'c0')).toBeVisible();
  });

  test('moves a card across columns', async ({ page }) => {
    const check = guard(page);
    // Grabbed in the upper half of a1; sliding right enters `doing` above b1's center.
    const point = await grab(page, card(page, 'a1'));
    await slideTo(page, 'doing', point.y);
    await expect(page.locator('[data-testid="column-doing"] [data-dnd-placeholder]')).toHaveAttribute(
      'data-id',
      'a1',
    );
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('virtual-board')).toHaveText(
      'todo(1999):a0,a2,a3,a4,a5 | doing(2001):b0,a1,b1,b2,b3 | done(2000):c0,c1,c2,c3,c4',
    );
    await expect(page.getByTestId('virtual-board-drop')).toHaveText('doing:a1@1:b0,a1,b1');
    check();
  });

  test('moves a card into a scrolled column', async ({ page }) => {
    const check = guard(page);
    await scrollElement(column(page, 'done'), 1_000 * CARD);
    await expect(card(page, 'c1001')).toBeVisible();
    // Passes through `doing` (a1 enters it, then leaves it) on its way to `done`.
    const point = await grab(page, card(page, 'a1'));
    await slideTo(page, 'done', point.y);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('virtual-board-drop')).toHaveText('done:a1@1001:c1000,a1,c1001');
    await expect(page.getByTestId('virtual-board')).toHaveText(
      'todo(1999):a0,a2,a3,a4,a5 | doing(2000):b0,b1,b2,b3,b4 | done(2001):c0,c1,c2,c3,c4',
    );
    check();
  });

  test('the card survives its new column being scrolled mid-drag', async ({ page }) => {
    const check = guard(page);
    const doing = column(page, 'doing');
    const point = await grab(page, card(page, 'a1'));
    await slideTo(page, 'doing', point.y);
    await expect(page.locator('[data-testid="column-doing"] [data-dnd-placeholder]')).toHaveAttribute(
      'data-id',
      'a1',
    );
    // Up over the column titles, until the overlay clears the column too, then
    // scroll the pinned card out of range.
    const box = (await doing.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y - 2 * CARD, { steps: 6 });
    await scrollElement(doing, 500 * CARD);
    await expect(card(page, 'a1')).toHaveCount(1);
    await expect(card(page, 'a1')).not.toBeInViewport();
    // Back down to the lower part of the 6th visible slot: a1 follows the pointer there.
    await page.mouse.move(box.x + box.width / 2, box.y + 5.8 * CARD, { steps: 10 });
    await page.mouse.up();
    await waitForIdle(page);
    // [b0, a1, b1, …] scrolled by 500 slots: slot 5 is index 505.
    await expect(page.getByTestId('virtual-board-drop')).toHaveText('doing:a1@505:b504,a1,b505');
    check();
  });

  test('Escape after crossing columns restores both columns', async ({ page }) => {
    const check = guard(page);
    await dragTo(page, card(page, 'a2'), await center(card(page, 'b1'), 0.25), { release: false });
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'a2');
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await nextFrames(page);
    await expect(page.getByTestId('virtual-board')).toHaveText(INITIAL);
    await expect(card(page, 'a2')).toBeVisible();
    await expect(page.locator('[data-testid="column-doing"] [data-id="a2"]')).toHaveCount(0);
    check();
  });
});
