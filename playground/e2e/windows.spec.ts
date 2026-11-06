import { expect, test, type Page } from '@playwright/test';
import { center, dragTo, trackErrors, waitForIdle } from './helpers';

/**
 * Another window (#windows): a list mounted on the page moves into a popup with a
 * teleport (it isn't mounted again), under the page's provider (`useDnD().addWindow`).
 * The popup is a window of its own: its events, viewport, styles and frames. Drags there
 * start, sort and land there; closing it brings the list back to the page.
 */

const order = (page: Page) => page.getByTestId('windows-order');
const rowsOf = (page: Page) => page.getByTestId('window-list').locator('[data-id]');

/** Drags the first row past the third one, in `page`. */
const sortFirstPastThird = async (page: Page) => {
  const rows = rowsOf(page);
  await dragTo(page, rows.nth(0), await center(rows.nth(2), 0.7));
  await waitForIdle(page);
};

const openPopup = async (page: Page): Promise<Page> => {
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.getByTestId('open-window').click()]);
  await popup.setViewportSize({ width: 420, height: 560 });
  await expect(rowsOf(popup)).toHaveCount(5);
  await expect(rowsOf(page)).toHaveCount(0);
  return popup;
};

test.describe('a list moved into another window of the app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#windows');
    await expect(order(page)).toHaveText('w1,w2,w3,w4,w5');
  });

  test('sorts by mouse in the popup, with the overlay in the popup', async ({ page }) => {
    const errors = trackErrors(page);
    const popup = await openPopup(page);
    const popupErrors = trackErrors(popup);
    const rows = rowsOf(popup);
    await dragTo(popup, rows.nth(0), await center(rows.nth(2), 0.7), { release: false });
    // The drag runs in the popup: its overlay and drag mode are there, not on the page.
    await expect(popup.locator('[data-dnd-overlay]')).toHaveCount(1);
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
    await expect(popup.locator('html')).toHaveAttribute('data-dnd-dragging', 'pointer');
    await expect(popup.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'w1');
    await popup.mouse.up();
    await waitForIdle(popup);
    await expect(order(page)).toHaveText('w2,w3,w1,w4,w5');
    expect(errors).toEqual([]);
    expect(popupErrors).toEqual([]);
  });

  test('sorts by keyboard in the popup', async ({ page }) => {
    const popup = await openPopup(page);
    await rowsOf(popup).first().focus();
    await popup.keyboard.press('Space');
    await popup.keyboard.press('ArrowDown');
    await popup.keyboard.press('Space');
    await waitForIdle(popup);
    await expect(order(page)).toHaveText('w2,w1,w3,w4,w5');
  });

  test('sorts on the page before and after its time in the popup', async ({ page }) => {
    const errors = trackErrors(page);
    await sortFirstPastThird(page);
    await expect(order(page)).toHaveText('w2,w3,w1,w4,w5');
    const popup = await openPopup(page);
    await sortFirstPastThird(popup);
    await expect(order(page)).toHaveText('w3,w1,w2,w4,w5');
    await popup.close();
    // Back on the page: its own drags as before.
    await expect(rowsOf(page)).toHaveCount(5);
    await sortFirstPastThird(page);
    await expect(order(page)).toHaveText('w1,w2,w3,w4,w5');
    expect(errors).toEqual([]);
  });
});
