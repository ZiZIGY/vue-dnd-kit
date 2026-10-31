import { expect, test, type Page } from '@playwright/test';
import { center, item, waitForIdle, type Point } from './helpers';

/**
 * The browser's own auto-scroll must stay out of a drag. WebKit scrolls the scroll
 * container a mouse press started in while the button is held and the pointer is
 * outside it (its text-selection auto-scroll), even with the library's auto-scroll
 * off. It fights the library's own auto-scroll and moves targets under the pointer.
 */

const scroller = (page: Page) => page.getByTestId('noscroll-scroller');
const scrollTop = (page: Page) => scroller(page).evaluate((element) => element.scrollTop);
const windowScroll = (page: Page) => page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }));

/** Presses on the item and moves just past the activation distance. */
const pickUp = async (page: Page, id: string): Promise<Point> => {
  const start = await center(item(page, id));
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 8, { steps: 2 });
  await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
  return start;
};

test.describe('native auto-scroll during a mouse drag', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#autoscroll');
    await expect(scroller(page).locator('.row')).toHaveCount(20);
  });

  test('a scroller with autoScroll: false stays put when the pointer leaves it below', async ({ page }) => {
    const box = (await scroller(page).boundingBox())!;
    await pickUp(page, 'n1');
    await page.mouse.move(box.x + box.width / 2, box.y + box.height + 12, { steps: 10 });
    await page.waitForTimeout(800);
    expect(await scrollTop(page)).toBe(0);
    expect(await windowScroll(page)).toEqual({ x: 0, y: 0 });
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await waitForIdle(page);
  });

  test('it stays put when the pointer leaves it above or beside', async ({ page }) => {
    await scroller(page).evaluate((element) => (element.scrollTop = 150));
    const box = (await scroller(page).boundingBox())!;
    const visible = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.closest('[data-id]')?.getAttribute('data-id'),
      { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    );
    await pickUp(page, visible!);
    await page.mouse.move(box.x + box.width / 2, box.y - 10, { steps: 10 });
    await page.waitForTimeout(600);
    expect(await scrollTop(page)).toBe(150);
    // Beside it, past the right edge.
    await page.mouse.move(box.x + box.width + 14, box.y + box.height / 2, { steps: 6 });
    await page.waitForTimeout(600);
    expect(await scrollTop(page)).toBe(150);
    expect(await windowScroll(page)).toEqual({ x: 0, y: 0 });
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await waitForIdle(page);
  });

  test('items with user-select: none (no selectstart in WebKit) are covered as well', async ({ page }) => {
    await page.addStyleTag({ content: '.row, .row * { -webkit-user-select: none; user-select: none; }' });
    const box = (await scroller(page).boundingBox())!;
    await pickUp(page, 'n2');
    await page.mouse.move(box.x + box.width / 2, box.y + box.height + 12, { steps: 10 });
    await page.waitForTimeout(800);
    expect(await scrollTop(page)).toBe(0);
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await waitForIdle(page);
    // The inline style that made the press selectable is gone again.
    expect(await item(page, 'n2').evaluate((element) => element.style.cssText)).toBe('');
    await expect(item(page, 'n2')).toHaveCSS('user-select', 'none');
  });

  test('a click on an item keeps the focus and drops a selection elsewhere, as without the library', async ({
    page,
  }) => {
    await page.evaluate(() => {
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('h2')!);
      document.getSelection()!.addRange(range);
    });
    expect(await page.evaluate(() => document.getSelection()?.toString())).toContain('Auto-scroll');
    await item(page, 'n3').click();
    expect(await page.evaluate(() => document.getSelection()?.toString())).toBe('');
    await expect(item(page, 'n3')).toBeFocused();
  });

  for (const unselectable of [false, true]) {
    test(`a double click selects no text in an item${unselectable ? ' with user-select: none' : ''}`, async ({
      page,
    }) => {
      if (unselectable) await page.addStyleTag({ content: '.row { -webkit-user-select: none; user-select: none; }' });
      await item(page, 'n4').dblclick();
      expect(await page.evaluate(() => document.getSelection()?.toString() ?? '')).toBe('');
      await item(page, 'n4').click({ clickCount: 3 });
      expect(await page.evaluate(() => document.getSelection()?.toString() ?? '')).toBe('');
      expect(await item(page, 'n4').evaluate((element) => element.style.cssText)).toBe('');
    });
  }

  test('a press that ends without a drag leaves text selection to the browser', async ({ page }) => {
    // The suppression only lasts while a press on a draggable is ours: elsewhere a
    // mouse drag still selects text.
    const hint = page.locator('h2');
    const box = (await hint.boundingBox())!;
    await page.mouse.move(box.x + 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width - 2, box.y + box.height / 2, { steps: 6 });
    await page.mouse.up();
    expect(await page.evaluate(() => document.getSelection()?.toString())).toContain('Auto-scroll');
  });
});
