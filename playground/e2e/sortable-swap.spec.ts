import { expect, test, type Page } from '@playwright/test';
import {
  center,
  frames,
  glide,
  item,
  layoutSettled,
  pickUp,
  trackErrors,
  trackVueWarnings,
  waitForIdle,
  type Point,
} from './helpers';

const INITIAL = 'swap-left:l1,l2,l3,l4 | swap-right:r1,r2,r3,r4';
const state = (page: Page) => page.getByTestId('state');
const lastDrop = (page: Page) => page.getByTestId('swap-event');
const order = (page: Page, list: string) =>
  page.locator(`[data-testid="${list}"] > *`).evaluateAll((rows) => rows.map((row) => row.getAttribute('data-id')));
const orders = async (page: Page) => ({ left: await order(page, 'swap-left'), right: await order(page, 'swap-right') });

/** Fails the test on page errors, console errors and Vue warnings. */
const guard = (page: Page) => {
  const errors = trackErrors(page);
  const warnings = trackVueWarnings(page);
  return () => {
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  };
};

type SlideWindow = Window & { __slides?: Record<string, number>; __slideWatch?: boolean };

/**
 * Call before the change. Records where layout animations (FLIP `translate`) of list items
 * start, by id; the returned function waits for the item's and gives its horizontal start.
 * Hooking `animate()` can't miss a short animation on a loaded browser, as polling could.
 */
const watchSlide = async (page: Page, id: string) => {
  await page.evaluate(() => {
    const win = window as SlideWindow;
    win.__slides = {};
    if (win.__slideWatch) return;
    win.__slideWatch = true;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (this: Element, keyframes, options) {
      const first = Array.isArray(keyframes) ? keyframes[0] : undefined;
      const key = this.closest('[data-dnd-overlay]') ? null : this.getAttribute('data-id');
      if (key && first && 'translate' in first) win.__slides![key] ??= parseFloat(String(first.translate));
      return animate.call(this, keyframes, options);
    };
  });
  return async () => {
    const handle = await page.waitForFunction((key) => (window as SlideWindow).__slides?.[key] ?? false, id);
    return (await handle.jsonValue()) as number;
  };
};

/** Moves the held pointer in steps a couple of frames apart, so every step is hit-tested mid-animation. */
const walk = async (page: Page, from: Point, to: Point, steps: number) => {
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(from.x + ((to.x - from.x) * i) / steps, from.y + ((to.y - from.y) * i) / steps);
    await frames(page, 2);
  }
};

/** Waits for the live region (moves are debounced 500 ms) to say exactly `text`. */
const announced = (page: Page, text: string) =>
  expect(
    page
      .locator('[role="status"]')
      .filter({ hasText: new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\u00A0?$`) }),
  ).toHaveCount(1, { timeout: 8000 });

test.describe('swap between two lists', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#swap');
    await expect(state(page)).toContainText(INITIAL);
  });

  test('hovering an item of the other list exchanges the two live; the drop writes both lists', async ({ page }) => {
    const check = guard(page);
    await pickUp(page, item(page, 'l1'));
    const partnerFrom = (await item(page, 'r2').boundingBox())!;
    const slide = await watchSlide(page, 'r2');
    await glide(page, await center(item(page, 'r2')));
    // The partner slides over into the dragged item's place (FLIP from the other list).
    expect(await slide()).toBeGreaterThan(100);
    await expect.poll(() => orders(page)).toEqual({ left: ['r2', 'l2', 'l3', 'l4'], right: ['r1', 'l1', 'r3', 'r4'] });
    await expect(page.getByTestId('mode')).toHaveText('swap');
    await layoutSettled(page);
    const partnerTo = (await item(page, 'r2').boundingBox())!;
    expect(partnerTo.x).toBeLessThan(partnerFrom.x - 100);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('swap-left:r2,l2,l3,l4 | swap-right:r1,l1,r3,r4');
    // The event describes both moves.
    await expect(lastDrop(page)).toHaveText('swap l1 swap-left@0>swap-right@1 | r2 swap-right@1>swap-left@0');
    check();
  });

  test('moving back onto the partner reverts the exchange, and so does leaving the lists', async ({ page }) => {
    const check = guard(page);
    const origin = await center(item(page, 'l1'));
    const partner = await center(item(page, 'r2'));
    await pickUp(page, item(page, 'l1'));
    await glide(page, partner);
    await expect.poll(() => orders(page)).toEqual({ left: ['r2', 'l2', 'l3', 'l4'], right: ['r1', 'l1', 'r3', 'r4'] });
    // The partner now sits where l1 started. Hovering it sends it back: it slides over the
    // left list, but the pointer there still means the left list (not r1 above it).
    await walk(page, partner, origin, 15);
    await expect.poll(() => orders(page)).toEqual({ left: ['l1', 'l2', 'l3', 'l4'], right: ['r1', 'r2', 'r3', 'r4'] });
    // Back over r2 (in its own list again), then on to r3: the exchange follows the hovered item.
    await glide(page, await center(item(page, 'r2')), 15);
    await expect.poll(() => orders(page)).toEqual({ left: ['r2', 'l2', 'l3', 'l4'], right: ['r1', 'l1', 'r3', 'r4'] });
    await glide(page, await center(item(page, 'r3')), 10);
    await expect.poll(() => orders(page)).toEqual({ left: ['r3', 'l2', 'l3', 'l4'], right: ['r1', 'r2', 'l1', 'r4'] });
    // Off every list (the overlay too, which would still hit one): both go back.
    const box = (await page.getByTestId('swap-right').boundingBox())!;
    await glide(page, { x: box.x + box.width / 2, y: box.y + box.height + 60 }, 10);
    await expect.poll(() => orders(page)).toEqual({ left: ['l1', 'l2', 'l3', 'l4'], right: ['r1', 'r2', 'r3', 'r4'] });
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText(INITIAL);
    await expect(lastDrop(page)).toHaveText('');
    check();
  });

  test('a partner sliding back across the lists does not take the pointer from the list it crosses', async ({ page }) => {
    const check = guard(page);
    const origin = await center(item(page, 'l1'));
    await pickUp(page, item(page, 'l1'));
    await glide(page, await center(item(page, 'r2')));
    await expect.poll(() => orders(page)).toEqual({ left: ['r2', 'l2', 'l3', 'l4'], right: ['r1', 'l1', 'r3', 'r4'] });
    await layoutSettled(page);
    // Freeze r2's slide back home where it starts: on the left list's top row, level with r1.
    await page.evaluate(() => {
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (this: Element, keyframes, options) {
        const animation = animate.call(this, keyframes, options);
        if (this.matches('[data-testid="swap-right"] [data-id="r2"]')) animation.pause();
        return animation;
      };
    });
    await glide(page, origin, 10);
    await expect.poll(() => orders(page)).toEqual({ left: ['l1', 'l2', 'l3', 'l4'], right: ['r1', 'r2', 'r3', 'r4'] });
    // Over r2 where it shows (inside the left list): still the left list, whose l1 is hovered.
    const shown = (await item(page, 'r2').boundingBox())!;
    const l1 = (await item(page, 'l1').boundingBox())!;
    const over = { x: shown.x + shown.width * 0.75, y: shown.y + shown.height / 2 };
    expect(over.x).toBeLessThan(l1.x + l1.width);
    expect(Math.abs(over.y - (l1.y + l1.height / 2))).toBeLessThan(10);
    await glide(page, over, 3);
    await frames(page, 3);
    expect(await orders(page)).toEqual({ left: ['l1', 'l2', 'l3', 'l4'], right: ['r1', 'r2', 'r3', 'r4'] });
    await page.evaluate(() => document.getAnimations().forEach((animation) => animation.play()));
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText(INITIAL);
    check();
  });

  test('Escape restores both lists; the partner slides back', async ({ page }) => {
    const check = guard(page);
    await pickUp(page, item(page, 'l2'));
    await glide(page, await center(item(page, 'r3')));
    await expect.poll(() => orders(page)).toEqual({ left: ['l1', 'r3', 'l3', 'l4'], right: ['r1', 'r2', 'l2', 'r4'] });
    await layoutSettled(page);
    const slide = await watchSlide(page, 'r3');
    await page.keyboard.press('Escape');
    expect(await slide()).toBeLessThan(-100);
    await page.mouse.up();
    await waitForIdle(page);
    await expect.poll(() => orders(page)).toEqual({ left: ['l1', 'l2', 'l3', 'l4'], right: ['r1', 'r2', 'r3', 'r4'] });
    await expect(state(page)).toContainText(INITIAL);
    check();
  });

  test('a rejected drop (onBeforeDrop: false) restores both lists', async ({ page }) => {
    const check = guard(page);
    await page.getByTestId('reject-swaps').check();
    await pickUp(page, item(page, 'r1'));
    await glide(page, await center(item(page, 'l3')));
    await expect.poll(() => orders(page)).toEqual({ left: ['l1', 'l2', 'r1', 'l4'], right: ['l3', 'r2', 'r3', 'r4'] });
    await page.mouse.up();
    await waitForIdle(page);
    await expect.poll(() => orders(page)).toEqual({ left: ['l1', 'l2', 'l3', 'l4'], right: ['r1', 'r2', 'r3', 'r4'] });
    await expect(state(page)).toContainText(INITIAL);
    await expect(lastDrop(page)).toHaveText('');
    check();
  });

  test('a list that refuses the dragged item takes no part in a swap', async ({ page }) => {
    const check = guard(page);
    // l4 stays left: the right list refuses it.
    await pickUp(page, item(page, 'l4'));
    await glide(page, await center(item(page, 'r2')));
    const right = page.getByTestId('swap-right');
    await expect(right).toHaveAttribute('data-over', 'true');
    await expect(right).not.toHaveAttribute('data-accepting');
    expect(await orders(page)).toEqual({ left: ['l1', 'l2', 'l3', 'l4'], right: ['r1', 'r2', 'r3', 'r4'] });
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText(INITIAL);
    check();
  });

  test("an item the dragged item's list refuses is not swapped in; the others are", async ({ page }) => {
    const check = guard(page);
    // r4 stays right: the left list refuses it, so l1 can't take its place.
    await pickUp(page, item(page, 'l1'));
    await glide(page, await center(item(page, 'r3')));
    await expect.poll(() => orders(page)).toEqual({ left: ['r3', 'l2', 'l3', 'l4'], right: ['r1', 'r2', 'l1', 'r4'] });
    await glide(page, await center(item(page, 'r4')), 10);
    // Hovering it reverts the exchange with r3 and makes none with r4.
    await expect.poll(() => orders(page)).toEqual({ left: ['l1', 'l2', 'l3', 'l4'], right: ['r1', 'r2', 'r3', 'r4'] });
    await expect(page.getByTestId('swap-right')).toHaveAttribute('data-accepting', 'true');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText(INITIAL);
    await expect(lastDrop(page)).toHaveText('');
    check();
  });

  test('announcements name both items and their lists', async ({ page }) => {
    await pickUp(page, item(page, 'l1'));
    await glide(page, await center(item(page, 'r2')));
    await announced(
      page,
      'Item l1 moved to position 2 of 4 in list swap-right, swapped with item r2 (now at position 1 of 4 in list swap-left).',
    );
    await page.mouse.up();
    await announced(
      page,
      'Item l1 dropped at position 2 of 4 in list swap-right, swapped with item r2 (now at position 1 of 4 in list swap-left).',
    );
    await waitForIdle(page);
  });

  test('multi-drag across the lists falls back to sorting (swap is single-item)', async ({ page }) => {
    const check = guard(page);
    for (const id of ['l1', 'l2']) await item(page, id).click({ modifiers: ['ControlOrMeta'] });
    await pickUp(page, item(page, 'l1'));
    await glide(page, await center(item(page, 'r2'), 0.8));
    await layoutSettled(page);
    await expect(page.getByTestId('mode')).toHaveText('move');
    await page.mouse.up();
    await waitForIdle(page);
    // The block was inserted, nothing went the other way.
    await expect(state(page)).toHaveText(/swap-left:l3,l4 \| swap-right:(r\d,)*l1,l2(,r\d)*$/);
    expect(await order(page, 'swap-right')).toHaveLength(6);
    await expect(lastDrop(page)).toHaveText(/^move l1,l2 /);
    check();
  });
});

test.describe('swap inside one list', () => {
  test('the drop event names the partner and where it went', async ({ page }) => {
    await page.goto('/demo/#swap');
    await pickUp(page, item(page, 's2'));
    await glide(page, await center(item(page, 's5')));
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('swap-list:s1,s5,s3,s4,s2,s6');
    await expect(lastDrop(page)).toHaveText('swap s2 swap-list@1>swap-list@4 | s5 swap-list@4>swap-list@1');
  });

  test('announcements name the partner', async ({ page }) => {
    await page.goto('/demo/#swap');
    await pickUp(page, item(page, 's1'));
    await glide(page, await center(item(page, 's3')));
    await announced(
      page,
      'Item s1 moved to position 3 of 6 in list swap-list, swapped with item s3 (now at position 1 of 6 in list swap-list).',
    );
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await waitForIdle(page);
  });
});
