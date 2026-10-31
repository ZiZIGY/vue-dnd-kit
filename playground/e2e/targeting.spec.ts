import { expect, test, type Locator, type Page } from '@playwright/test';
import { center, dragTo, trackErrors, waitForIdle, type Point } from './helpers';

/** Presses on `from` and moves past the activation distance. */
const grab = async (page: Page, from: Locator): Promise<Point> => {
  const start = await center(from);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 8, { steps: 2 });
  return start;
};

const box = async (locator: Locator) => {
  const result = await locator.boundingBox();
  if (!result) throw new Error('Element is not visible');
  return result;
};

/** Overlay positions on every frame until it is removed. */
const recordOverlay = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<Array<[number, number]>>((resolve) => {
        const samples: Array<[number, number]> = [];
        const tick = () => {
          const overlay = document.querySelector('[data-dnd-overlay]');
          if (!overlay) return resolve(samples);
          const { left, top } = overlay.getBoundingClientRect();
          samples.push([left, top]);
          requestAnimationFrame(tick);
        };
        tick();
      }),
  );

test.describe('free drop targets', () => {
  const zone = (page: Page, id: string) => page.getByTestId(`zone-${id}`);
  // The overlay clone keeps `data-piece`: always scope to where the piece lies.
  const inTray = (page: Page, id: string) => page.getByTestId('tray').locator(`[data-piece="${id}"]`);
  const over = (page: Page) => page.getByTestId('over');

  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#nested-zones');
    await expect(inTray(page, 'r1')).toBeVisible();
  });

  test('the deepest zone under the pointer wins and receives the drop', async ({ page }) => {
    const errors = trackErrors(page);
    await grab(page, inTray(page, 'r1'));
    const deep = await center(zone(page, 'deep'));
    await page.mouse.move(deep.x, deep.y, { steps: 10 });
    await expect(over(page)).toHaveText('deep:accepted');
    await expect(zone(page, 'deep')).toHaveAttribute('data-over', 'accepted');
    await expect(zone(page, 'inner')).not.toHaveAttribute('data-over');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('log')).toHaveText('drop r1 -> deep');
    await expect(zone(page, 'deep').locator('[data-piece="r1"]')).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('a higher priority beats nesting depth', async ({ page }) => {
    await grab(page, inTray(page, 'r1'));
    const child = await center(zone(page, 'shadowed'));
    await page.mouse.move(child.x, child.y, { steps: 10 });
    await expect(over(page)).toHaveText('catch:accepted');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('log')).toHaveText('drop r1 -> catch');
  });

  test('a zone that does not accept the item is the target, and dropping on it returns the item', async ({
    page,
  }) => {
    const origin = await box(inTray(page, 'b1'));
    await grab(page, inTray(page, 'b1'));
    const red = await center(zone(page, 'red'));
    await page.mouse.move(red.x, red.y, { steps: 10 });
    await expect(over(page)).toHaveText('red:rejected');
    await expect(zone(page, 'red')).toHaveAttribute('data-over', 'rejected');

    await page.mouse.up();
    const samples = await recordOverlay(page);
    await waitForIdle(page);
    await expect(page.getByTestId('log')).toHaveText('cancel b1');
    await expect(inTray(page, 'b1')).toHaveCount(1);
    await expect(zone(page, 'red').locator('[data-piece]')).toHaveCount(0);

    // Animated: several distinct positions, from the drop point back to the tray.
    const distance = ([left, top]: [number, number]) => Math.hypot(left - origin.x, top - origin.y);
    expect(new Set(samples.map(([left, top]) => `${Math.round(left)},${Math.round(top)}`)).size).toBeGreaterThan(3);
    expect(distance(samples[0]!)).toBeGreaterThan(100);
    expect(distance(samples[samples.length - 1]!)).toBeLessThan(3);
  });

  test('keeps the last nested zone while the pointer crosses a gap of its parent', async ({ page }) => {
    await grab(page, inTray(page, 'r1'));
    const red = await box(zone(page, 'red'));
    const inner = await box(zone(page, 'inner'));
    const y = red.y + red.height / 2;
    await page.mouse.move(red.x + red.width / 2, y, { steps: 10 });
    await expect(over(page)).toHaveText('red:accepted');

    // The 24px gap between the two zones belongs to the board.
    await page.mouse.move(red.x + red.width + 12, y, { steps: 4 });
    await page.waitForTimeout(50);
    await expect(over(page)).toHaveText('red:accepted');

    // Into the next nested zone: its deepest zone.
    await page.mouse.move(inner.x + 30, y, { steps: 4 });
    await expect(over(page)).toHaveText('deep:accepted');

    // Outside the nested zones (the board's header): the board itself.
    await page.mouse.move(inner.x + 30, inner.y - 6, { steps: 4 });
    await expect(over(page)).toHaveText('outer:accepted');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('log')).toHaveText('drop r1 -> outer');
  });

  test('a zone that was just left needs 10px of pointer travel to win again', async ({ page }) => {
    await grab(page, inTray(page, 'r1'));
    const red = await box(zone(page, 'red'));
    const x = red.x + red.width / 2;
    // Deep inside first: the board, left on the way in, must not be blocked any more.
    await page.mouse.move(x, red.y + red.height / 2, { steps: 10 });
    await page.mouse.move(x, red.y + 5, { steps: 3 });
    await expect(over(page)).toHaveText('red:accepted');

    // Out of the red zone into the board's header.
    await page.mouse.move(x, red.y - 4);
    await expect(over(page)).toHaveText('outer:accepted');

    // Jitter back 7px: still the board.
    await page.mouse.move(x, red.y + 3);
    await page.waitForTimeout(50);
    await expect(over(page)).toHaveText('outer:accepted');

    // 14px away from where the red zone was left: it wins again.
    await page.mouse.move(x, red.y + 10);
    await expect(over(page)).toHaveText('red:accepted');
    await page.mouse.up();
    await waitForIdle(page);
  });

  test('scrolling during a drag retargets and keeps the cached rects in sync', async ({ page }) => {
    const shelf = page.getByTestId('shelf');
    await grab(page, inTray(page, 'r1'));
    const slot = await center(zone(page, 'slot-1'));
    await page.mouse.move(slot.x, slot.y, { steps: 10 });
    await expect(over(page)).toHaveText('slot-1:accepted');

    // One slot pitch (80px + 8px gap), the pointer standing still.
    await shelf.evaluate((element) => (element.scrollTop = 88));
    await expect(over(page)).toHaveText('slot-2:accepted');
    // The target rect comes from the cache plus the scroll delta: it must match the DOM.
    const top = Number(await page.getByTestId('over-top').textContent());
    expect(Math.abs(top - (await box(zone(page, 'slot-2'))).y)).toBeLessThanOrEqual(1);

    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('log')).toHaveText('drop r1 -> slot-2');
  });

  test('a zone scrolled out of its container is not a target', async ({ page }) => {
    const shelf = await box(page.getByTestId('shelf'));
    await grab(page, inTray(page, 'r1'));
    // 100px below the shelf: geometrically inside the hidden slot 4 (264–344px).
    await page.mouse.move(shelf.x + shelf.width / 2, shelf.y + 300, { steps: 10 });
    await page.waitForTimeout(100);
    await expect(over(page)).toHaveText('-');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('log')).toHaveText('drop r1 -> none');
    await expect(inTray(page, 'r1')).toHaveCount(1);
  });
});

test.describe('shadow DOM', () => {
  const INITIAL = 's1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12';
  // Playwright's CSS engine pierces open shadow roots.
  const row = (page: Page, id: string) => page.locator(`[data-testid="shadow-list"] [data-id="${id}"]`);
  const rows = (page: Page) => page.locator('[data-testid="shadow-list"] .row');
  const order = (page: Page) => page.getByTestId('shadow-order');

  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#shadow');
    await expect(order(page)).toHaveText(INITIAL);
    await expect(row(page, 's1')).toBeVisible();
  });

  test('sorts a list rendered inside a shadow root', async ({ page }) => {
    const errors = trackErrors(page);
    await dragTo(page, row(page, 's1'), await center(row(page, 's3'), 0.8));
    await waitForIdle(page);
    await expect(order(page)).toHaveText('s2,s3,s1,s4,s5,s6,s7,s8,s9,s10,s11,s12');
    expect(errors).toEqual([]);
  });

  test('scrolling the list inside the shadow root keeps the projection right', async ({ page }) => {
    const first = await box(row(page, 's1'));
    const pitch = (await box(row(page, 's2'))).y - first.y;
    const start = await grab(page, row(page, 's1'));
    await page.mouse.move(start.x, first.y + pitch + first.height * 0.75, { steps: 6 });
    await expect(rows(page).nth(1)).toHaveAttribute('data-id', 's1');

    // Two rows' worth of scrolling under the still pointer: it is now over s4.
    await page.getByTestId('shadow-scroller').evaluate((element, by) => (element.scrollTop = by), pitch * 2);
    await expect(rows(page).nth(3)).toHaveAttribute('data-id', 's1');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(order(page)).toHaveText('s2,s3,s4,s1,s5,s6,s7,s8,s9,s10,s11,s12');
  });

  test('dropping onto a slot scrolled out of view fades the overlay instead of flying', async ({ page }) => {
    const scroller = await box(page.getByTestId('shadow-scroller'));
    const start = await grab(page, row(page, 's1'));
    // Off the list (no target: the item stays in its slot), then scroll that slot away.
    await page.mouse.move(scroller.x + scroller.width + 200, start.y, { steps: 6 });
    await page.getByTestId('shadow-scroller').evaluate((element) => (element.scrollTop = 300));
    await expect(row(page, 's1')).toHaveAttribute('data-dnd-placeholder', '');

    await page.mouse.up();
    const samples = await recordOverlay(page);
    await waitForIdle(page);
    await expect(order(page)).toHaveText(INITIAL);
    // The overlay faded where it was dropped (it would fly up to the hidden slot).
    const [first] = samples;
    for (const [left, top] of samples) {
      expect(Math.hypot(left - first![0], top - first![1])).toBeLessThan(2);
    }
  });

  test('rows clipped by the scroll container are not targeted', async ({ page }) => {
    const scroller = await box(page.getByTestId('shadow-scroller'));
    // A hidden row far enough below the scroller that the overlay (one row tall)
    // stays clear of the visible area. Its lower half would move s1 past it.
    let hidden: { y: number; height: number } | null = null;
    for (const id of ['s6', 's7', 's8', 's9']) {
      const rect = await box(row(page, id));
      if (rect.y > scroller.y + scroller.height + rect.height) {
        hidden = rect;
        break;
      }
    }
    if (!hidden) throw new Error('No hidden row below the scroller');
    const start = await grab(page, row(page, 's1'));
    // Around the list, not across its visible rows: out to the right, down, then
    // back under the scroller.
    const aside = scroller.x + scroller.width + 200;
    const below = hidden.y + hidden.height * 0.75;
    await page.mouse.move(aside, start.y + 8, { steps: 6 });
    await page.mouse.move(aside, below, { steps: 6 });
    await page.mouse.move(scroller.x + scroller.width / 2, below, { steps: 6 });
    await page.waitForTimeout(100);
    await expect(rows(page).first()).toHaveAttribute('data-id', 's1');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(order(page)).toHaveText(INITIAL);
  });
});
