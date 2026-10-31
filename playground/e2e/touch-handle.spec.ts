import { expect, test, type Page } from '@playwright/test';
import { center, item, trackErrors, waitForIdle } from './helpers';
import { overlay, recordOutput, swipe, touchscreen, windowScrollY } from './touch-helpers';

// The handle has `touch-action: none` and drags after 4px; the rest of the item scrolls.
const INITIAL = Array.from({ length: 30 }, (_, i) => `h${i + 1}`).join(',');

const order = (page: Page) => page.getByTestId('touch-handle-order');
const handle = (page: Page, id: string) => item(page, id).getByTestId('handle');
const body = (page: Page, id: string) => item(page, id).locator('.title');

test.describe('touch: drag handle @touch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#touch-handle');
    await expect(order(page)).toHaveText(INITIAL);
  });

  test('the handle drags at once, without a long press, and the page does not scroll', async ({ page }) => {
    const errors = trackErrors(page);
    const statuses = await recordOutput(page.getByTestId('status'), '__status');
    const finger = (await touchscreen(page)).finger();
    await finger.down(await center(handle(page, 'h1')));
    // Straight into the move: a swipe on anything else would scroll.
    await finger.move(await center(item(page, 'h4'), 0.8), { steps: 12, stepDelay: 8 });
    await expect(overlay(page)).toHaveCount(1);
    await finger.up();
    await waitForIdle(page);
    await expect(order(page)).toHaveText(/^h2,h3,h4,h1,h5,/);
    expect(await windowScrollY(page)).toBe(0);
    expect((await statuses()).slice(0, 2)).toEqual(['activating', 'dragging']);
    expect(errors).toEqual([]);
  });

  test('a swipe on the item body scrolls the page and never starts an activation', async ({ page }) => {
    const statuses = await recordOutput(page.getByTestId('status'), '__status');
    const finger = (await touchscreen(page)).finger();
    const start = await center(body(page, 'h5'));
    await swipe(finger, start, { x: start.x, y: start.y - 300 });
    await expect.poll(() => windowScrollY(page)).toBeGreaterThan(100);
    await page.waitForTimeout(200);
    expect(await statuses()).toEqual([]);
    await expect(overlay(page)).toHaveCount(0);
    await expect(order(page)).toHaveText(INITIAL);
  });

  test('a long press on the item body does not drag; moving then scrolls', async ({ page }) => {
    const statuses = await recordOutput(page.getByTestId('status'), '__status');
    const finger = (await touchscreen(page)).finger();
    const start = await center(body(page, 'h4'));
    await finger.down(start);
    await page.waitForTimeout(500);
    await expect(overlay(page)).toHaveCount(0);
    await finger.move({ x: start.x, y: start.y - 250 }, { steps: 8, stepDelay: 8 });
    await finger.up();
    await expect.poll(() => windowScrollY(page)).toBeGreaterThan(100);
    expect(await statuses()).toEqual([]);
    await expect(order(page)).toHaveText(INITIAL);
  });

  test('a swipe right after a handle drag still scrolls the page', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    await finger.down(await center(handle(page, 'h2')));
    await finger.move(await center(item(page, 'h3'), 0.8), { steps: 8, stepDelay: 8 });
    await finger.up();
    await waitForIdle(page);
    await expect(order(page)).toHaveText(/^h1,h3,h2,h4,/);

    // Nothing of the drag lingers: touchmoves are no longer prevented.
    const start = await center(body(page, 'h6'));
    await swipe(finger, start, { x: start.x, y: start.y - 300 });
    await expect.poll(() => windowScrollY(page)).toBeGreaterThan(100);
  });

  test('holding the handle at the bottom edge scrolls the page', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    const viewport = page.viewportSize()!;
    const start = await center(handle(page, 'h1'));
    await finger.down(start);
    await finger.move({ x: start.x, y: viewport.height - 8 }, { steps: 20, stepDelay: 8 });
    await expect.poll(() => windowScrollY(page), { timeout: 15_000 }).toBeGreaterThan(600);
    await finger.move({ x: start.x, y: viewport.height / 2 }, { steps: 8 });
    await finger.up();
    await waitForIdle(page);
    const result = (await order(page).textContent())!.split(',');
    expect(result.indexOf('h1')).toBeGreaterThan(8);
  });
});
