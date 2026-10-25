import { expect, test, type Page } from '@playwright/test';
import { center, item, trackErrors, waitForIdle } from './helpers';
import {
  longPress,
  overlay,
  overlayOrigin,
  recordOutput,
  swipe,
  touchscreen,
  windowScrollY,
} from './touch-helpers';

// Phone viewport (the `mobile` project): a long list in a page that scrolls.
const INITIAL = Array.from({ length: 40 }, (_, i) => `t${i + 1}`).join(',');

const order = (page: Page) => page.getByTestId('touch-list-order');
const status = (page: Page) => page.getByTestId('status');
const ids = async (page: Page) => (await order(page).textContent())!.split(',');

/**
 * Scrolls the page so the list starts near the top of the screen and returns the
 * scroll position. Targets a few rows down then stay out of the bottom auto-scroll
 * zone, however tall the playground nav above the demo grows.
 */
const listNearTop = async (page: Page): Promise<number> => {
  await item(page, 't1').evaluate((element) => window.scrollBy(0, element.getBoundingClientRect().top - 120));
  return windowScrollY(page);
};

test.describe('touch: long list @touch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#touch-list');
    await expect(order(page)).toHaveText(INITIAL);
  });

  test('a long press picks the item up and reports the progress', async ({ page }) => {
    const errors = trackErrors(page);
    const progress = await recordOutput(page.getByTestId('progress'), '__progress');
    const statuses = await recordOutput(status(page), '__status');
    const touch = await touchscreen(page);
    const finger = touch.finger();

    await finger.down(await center(item(page, 't2')));
    // The bar fills during the press; `activation.progress` reaches 1 when the drag starts.
    await expect(overlay(page)).toHaveCount(1);
    const values = (await progress()).map(Number);
    expect(values.some((value) => value > 0 && value < 1)).toBe(true);
    expect(values.at(-1)).toBe(1);
    expect((await statuses()).slice(0, 2)).toEqual(['activating', 'dragging']);
    await expect(page.getByTestId('active')).toHaveText('t2');

    // Lifting the finger without moving drops the item where it was.
    await finger.up();
    await waitForIdle(page);
    await expect(page.getByTestId('progress')).toHaveText('0.00');
    await expect(order(page)).toHaveText(INITIAL);
    expect(errors).toEqual([]);
  });

  test('after the long press the item follows the finger and reorders without scrolling', async ({ page }) => {
    const errors = trackErrors(page);
    const touchmoves = page.evaluate(() => {
      const log: boolean[] = ((window as unknown as { __touchmoves: boolean[] }).__touchmoves = []);
      // Added after the sensor's listener, so it sees its verdict.
      window.addEventListener('touchmove', (event) => {
        if (document.querySelector('[data-dnd-overlay]')) log.push(event.defaultPrevented);
      });
    });
    await touchmoves;
    const scrolled = await listNearTop(page);
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, item(page, 't1'));
    await finger.move(await center(item(page, 't4'), 0.8), { steps: 12 });
    await expect(item(page, 't1')).toHaveAttribute('data-dnd-placeholder', '');
    await finger.up();
    await waitForIdle(page);

    await expect(order(page)).toHaveText(/^t2,t3,t4,t1,t5,/);
    expect(await windowScrollY(page)).toBe(scrolled);
    const prevented = await page.evaluate(() => (window as unknown as { __touchmoves: boolean[] }).__touchmoves);
    expect(prevented.length).toBeGreaterThan(0);
    expect(prevented.every(Boolean)).toBe(true);
    expect(errors).toEqual([]);
  });

  test('a finger trembling within the tolerance still picks the item up', async ({ page }) => {
    const scrolled = await listNearTop(page);
    const finger = (await touchscreen(page)).finger();
    const start = await center(item(page, 't2'));
    await finger.down(start);
    // A real finger is never quite still: a few px of jitter during the press.
    await finger.moveBy(2, 1, { steps: 2, stepDelay: 30 });
    await finger.moveBy(-1, 2, { steps: 2, stepDelay: 30 });
    await expect(overlay(page)).toHaveCount(1);
    // The moves before the drag were not prevented, yet the page must not scroll now.
    await finger.move(await center(item(page, 't5'), 0.8), { steps: 12 });
    await finger.up();
    await waitForIdle(page);
    await expect(order(page)).toHaveText(/^t1,t3,t4,t5,t2,t6,/);
    expect(await windowScrollY(page)).toBe(scrolled);
  });

  test('a quick swipe scrolls the page and does not drag', async ({ page }) => {
    const statuses = await recordOutput(status(page), '__status');
    const finger = (await touchscreen(page)).finger();
    const start = await center(item(page, 't6'));
    await swipe(finger, start, { x: start.x, y: start.y - 300 });
    await expect.poll(() => windowScrollY(page)).toBeGreaterThan(100);
    await page.waitForTimeout(300);
    await expect(overlay(page)).toHaveCount(0);
    // The press began an activation, which the swipe aborted.
    expect(await statuses()).not.toContain('dragging');
    await expect(status(page)).toHaveText('idle');
    await expect(order(page)).toHaveText(INITIAL);
  });

  test('holding the item at the bottom edge scrolls the page, and it lands under the finger', async ({ page }) => {
    const errors = trackErrors(page);
    const finger = (await touchscreen(page)).finger();
    const viewport = page.viewportSize()!;
    const start = await longPress(page, finger, item(page, 't1'));
    await finger.move({ x: start.x, y: viewport.height - 8 }, { steps: 20 });
    await expect(page.getByTestId('autoscrolling')).toHaveText('true');
    await expect.poll(() => windowScrollY(page), { timeout: 15_000 }).toBeGreaterThan(1200);

    // Back to the middle of the screen: the scrolling stops, the item is dropped there.
    await finger.move({ x: start.x, y: viewport.height / 2 }, { steps: 10 });
    await expect(page.getByTestId('autoscrolling')).toHaveText('false');
    const scrolled = await windowScrollY(page);
    await page.waitForTimeout(200);
    expect(await windowScrollY(page)).toBe(scrolled);
    // Targets were hit-tested against the scrolled page: the slot is at the finger, at
    // most one row away (over a neighbour's half, the slot goes next to that neighbour).
    await expect
      .poll(async () => {
        const slot = (await item(page, 't1').boundingBox())!;
        return Math.abs(slot.y + slot.height / 2 - finger.position.y) / (slot.height + 8);
      })
      .toBeLessThanOrEqual(1);
    await finger.up();
    await waitForIdle(page);
    const result = await ids(page);
    expect(result.indexOf('t1')).toBeGreaterThan(15);
    expect([...result].sort()).toEqual(INITIAL.split(',').sort());
    expect(errors).toEqual([]);
  });

  test('holding the item at the top edge scrolls the page back up', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 1500));
    const finger = (await touchscreen(page)).finger();
    // The row in the middle of the screen.
    const viewport = page.viewportSize()!;
    const target = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.closest('[data-id]')?.getAttribute('data-id'),
      { x: viewport.width / 2, y: viewport.height / 2 },
    );
    expect(target).toMatch(/^t\d+$/);
    const start = await longPress(page, finger, item(page, target!));
    await finger.move({ x: start.x, y: 6 }, { steps: 20 });
    // Auto-scroll keeps 1px of slack for fractional offsets (device pixel ratio 2.625).
    await expect.poll(() => windowScrollY(page), { timeout: 15_000 }).toBeLessThanOrEqual(1);
    await finger.up();
    await waitForIdle(page);
    expect((await ids(page)).indexOf(target!)).toBeLessThan(3);
  });

  test('the overlay follows the finger', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, item(page, 't3'));
    const origin = await overlayOrigin(page);
    const press = finger.position;
    for (const [dx, dy] of [
      [0, 40],
      [60, 90],
      [-80, 150],
      [20, -30],
      [-20, 10],
    ] as const) {
      await finger.move({ x: press.x + dx, y: press.y + dy }, { steps: 6 });
      await expect
        .poll(async () => {
          const now = await overlayOrigin(page);
          return Math.max(Math.abs(now.x - origin.x - dx), Math.abs(now.y - origin.y - dy));
        })
        .toBeLessThan(1);
    }
    await finger.up();
    await waitForIdle(page);
  });

  test('a system gesture (pointercancel) cancels with an animated return', async ({ page }) => {
    const errors = trackErrors(page);
    const statuses = await recordOutput(status(page), '__status');
    const touch = await touchscreen(page);
    const finger = touch.finger();
    await longPress(page, finger, item(page, 't1'));
    await finger.move(await center(item(page, 't4'), 0.8), { steps: 10 });
    await expect(order(page)).toHaveText(INITIAL);
    const before = await overlayOrigin(page);

    await touch.cancel();
    // The overlay flies back to the item's original slot instead of vanishing.
    const animation = await page.waitForFunction(() => {
      const animations = document.querySelector('[data-dnd-overlay]')?.getAnimations() ?? [];
      return animations.length ? animations[0]!.playState : null;
    });
    expect(await animation.jsonValue()).toBe('running');
    await waitForIdle(page);
    const slot = (await item(page, 't1').boundingBox())!;
    expect(slot.y).toBeLessThan(before.y);
    await expect(order(page)).toHaveText(INITIAL);
    expect(await statuses()).toEqual(expect.arrayContaining(['dragging', 'dropping', 'idle']));
    expect(errors).toEqual([]);
  });

  test('a long press opens no context menu and selects no text', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    const point = await center(item(page, 't2').locator('.note'));
    // Android fires `contextmenu` on a long press; it is cancelled while the press is ours.
    const contextMenu = () =>
      page.evaluate(({ x, y }) => {
        const target = document.elementFromPoint(x, y)!;
        const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: x, clientY: y });
        return { prevented: !target.dispatchEvent(event), status: document.querySelector('[data-testid="status"]')?.textContent };
      }, point);
    const selectStart = () =>
      page.evaluate(({ x, y }) => {
        const target = document.elementFromPoint(x, y)!.firstChild ?? document.elementFromPoint(x, y)!;
        return !target.dispatchEvent(new Event('selectstart', { bubbles: true, cancelable: true }));
      }, point);

    await finger.down(point);
    // During the press (before the drag) as well as after it started.
    const early = await contextMenu();
    expect(early.prevented).toBe(true);
    await expect(overlay(page)).toHaveCount(1);
    // Held well past the platform's long-press time.
    await page.waitForTimeout(700);
    expect((await contextMenu()).prevented).toBe(true);
    expect(await selectStart()).toBe(true);
    await expect(item(page, 't2').locator('.note')).toHaveCSS('user-select', 'none');
    expect(await page.evaluate(() => document.getSelection()?.toString() ?? '')).toBe('');

    await finger.up();
    await waitForIdle(page);
    expect(await page.evaluate(() => document.getSelection()?.toString() ?? '')).toBe('');
    // Nothing is blocked once the finger is gone.
    expect((await contextMenu()).prevented).toBe(false);
    await expect(item(page, 't2').locator('.note')).not.toHaveCSS('user-select', 'none');
  });

  test('a second finger does not start a second drag', async ({ page }) => {
    const errors = trackErrors(page);
    const touch = await touchscreen(page);
    const first = touch.finger();
    const second = touch.finger();
    await longPress(page, first, item(page, 't1'));
    const origin = await overlayOrigin(page);

    // A second finger held on another item, longer than the long press.
    await second.down(await center(item(page, 't6')));
    await page.waitForTimeout(400);
    await expect(overlay(page)).toHaveCount(1);
    await expect(page.getByTestId('active')).toHaveText('t1');
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 't1');

    // It doesn't move the overlay either.
    await second.moveBy(0, 120, { steps: 6 });
    await page.waitForTimeout(100);
    expect(await overlayOrigin(page)).toEqual(origin);

    // The first finger still drives the drag, also after the second one lifts.
    await first.move(await center(item(page, 't3'), 0.8), { steps: 10 });
    await second.up();
    await expect(status(page)).toHaveText('dragging');
    await first.move(await center(item(page, 't4'), 0.8), { steps: 6 });
    await first.up();
    await waitForIdle(page);
    await expect(order(page)).toHaveText(/^t2,t3,t4,t1,t5,t6,/);
    expect(await windowScrollY(page)).toBe(0);
    expect(errors).toEqual([]);
  });

  test('a second finger landing during the long press does not take it over', async ({ page }) => {
    const touch = await touchscreen(page);
    const first = touch.finger();
    const second = touch.finger();
    await first.down(await center(item(page, 't2')));
    await second.down(await center(item(page, 't5')));
    await expect(overlay(page)).toHaveCount(1);
    await expect(page.getByTestId('active')).toHaveText('t2');
    await second.up();
    await first.up();
    await waitForIdle(page);
    await expect(order(page)).toHaveText(INITIAL);
  });
});
