import type { Page } from '@playwright/test';
import { center, scrollElement } from './helpers';
import { at, byId, centerOnScreen, expect, fitsScreen, test, waitForIdle } from './kit-helpers';
import { longPress, overlay, scrollLeft, scrollTop, swipe, touchscreen, windowScrollY } from './touch-helpers';

// Nuxt UI page (kits/nuxt-ui.html) on a phone: the `mobile` project (Pixel 7, real
// touch input through CDP). Items without a handle pick up after a long press; the
// kit's UButton handles have no `touch-action: none`, so they also wait for the long
// press, and a swipe that starts on one scrolls the page.

const PAGE = '/kits/nuxt-ui.html';

test.describe('Nuxt UI on a phone @touch', () => {
  test('every demo fits the screen: no sideways page scroll, no zoom-out', async ({ page }) => {
    for (const [demo, state] of [
      ['list', 'tasks-state'],
      ['kanban', 'board'],
      ['tree', 'tree'],
      ['virtual', 'virtual-order'],
    ] as const) {
      await page.goto(`${PAGE}#${demo}`);
      await page.reload();
      await expect(page.getByTestId(state)).not.toBeEmpty();
      expect(await fitsScreen(page), demo).toBe(true);
    }
  });
});

test.describe('Nuxt UI on a phone: lists @touch', () => {
  const tasks = (page: Page) => page.getByTestId('tasks');
  const task = (page: Page, id: string) => byId(tasks(page), id);
  const handle = (page: Page, id: string) => task(page, id).getByTestId('handle');

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#list`);
    await expect(page.getByTestId('tasks-state')).toHaveText('t1,t2,t3,t4,t5');
  });

  test('a long press on the UButton handle picks the task up; it sorts without scrolling the page', async ({
    page,
  }) => {
    const finger = (await touchscreen(page)).finger();
    const scrolled = await windowScrollY(page);
    await longPress(page, finger, handle(page, 't1'));
    await finger.move(await at(task(page, 't3'), 0.5, 0.8), { steps: 12 });
    await expect(task(page, 't1')).toHaveAttribute('data-dnd-placeholder', '');
    await finger.up();
    await waitForIdle(page);
    await expect(page.getByTestId('tasks-state')).toHaveText('t2,t3,t1,t4,t5');
    expect(await windowScrollY(page)).toBe(scrolled);
  });

  test('a quick swipe on a task, or on its handle, scrolls the page and does not drag', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    const start = await center(task(page, 't4').getByText('Add e2e tests'));
    await swipe(finger, start, { x: start.x, y: start.y - 300 });
    await expect.poll(() => windowScrollY(page)).toBeGreaterThan(100);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => windowScrollY(page)).toBe(0);
    const onHandle = await center(handle(page, 't5'));
    await swipe(finger, onHandle, { x: onHandle.x, y: onHandle.y - 300 });
    await expect.poll(() => windowScrollY(page)).toBeGreaterThan(100);

    await page.waitForTimeout(300);
    await expect(overlay(page)).toHaveCount(0);
    await expect(page.getByTestId('tasks-state')).toHaveText('t1,t2,t3,t4,t5');
  });

  test('a long press on a UTooltip badge (fragment root) sorts it horizontally', async ({ page }) => {
    const tags = page.getByTestId('tags');
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, byId(tags, 'vue'));
    await finger.move(await at(byId(tags, 'vite'), 0.85), { steps: 12 });
    await finger.up();
    await waitForIdle(page);
    await expect(page.getByTestId('tags-state')).toHaveText('nuxt,vite,vue,pinia');
  });

  test('UTable: a long press on the handle in a cell slot drags the row', async ({ page }) => {
    const rows = page.getByTestId('people').locator('tbody tr');
    // In the middle of the screen: the bottom edge would auto-scroll the page.
    await centerOnScreen(page.getByTestId('people'));
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, rows.filter({ hasText: 'Ada Lovelace' }).getByTestId('row-handle'));
    await finger.move(await at(rows.filter({ hasText: 'Grace Hopper' }), 0.5, 0.8), { steps: 12 });
    await finger.up();
    await waitForIdle(page);
    await expect(page.getByTestId('people-state')).toHaveText('p2,p3,p1,p4');
  });

  test('in a UModal: a tap clicks an item, a long press drags it, the modal stays open', async ({ page }) => {
    await page.getByTestId('open-modal').tap();
    const list = page.getByTestId('modal-list');
    const state = page.getByTestId('modal-state');
    await expect(list).toBeVisible();

    await byId(list, 'f2').tap();
    await expect(state).toHaveText('f1,f2,f3 opened:f2');

    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, byId(list, 'f1'));
    await finger.move(await at(byId(list, 'f3'), 0.5, 0.8), { steps: 12 });
    await finger.up();
    await waitForIdle(page);
    // The drop is not a click on the button, and the modal stays open.
    await expect(state).toHaveText('f2,f3,f1 opened:f2');
    await expect(list).toBeVisible();

    // A long press lifted in place drops the button where it was, without clicking it.
    await longPress(page, finger, byId(list, 'f3'));
    await finger.up();
    await waitForIdle(page);
    await page.waitForTimeout(300);
    await expect(state).toHaveText('f2,f3,f1 opened:f2');
    await expect(list).toBeVisible();
  });
});

test.describe('Nuxt UI on a phone: kanban @touch', () => {
  const card = (page: Page, id: string) => byId(page, id);
  const board = (page: Page) => page.getByTestId('board');
  const scroller = (page: Page) => page.getByTestId('board-scroller');

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#kanban`);
    await expect(board(page)).toHaveText('todo:c1,c2,c3 | doing:c4,c5 | done:c6');
  });

  test('a UCard held at the right edge scrolls the board and drops into the last column', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    const viewport = page.viewportSize()!;
    const start = await longPress(page, finger, card(page, 'c1'));
    await finger.move({ x: viewport.width - 10, y: start.y }, { steps: 12 });
    // The board scrolls to its end; the page itself never scrolls sideways.
    const end = await scroller(page).evaluate((element) => element.scrollWidth - element.clientWidth);
    expect(end).toBeGreaterThan(200);
    await expect.poll(() => scrollLeft(scroller(page)), { timeout: 10_000 }).toBeGreaterThanOrEqual(end - 1);
    await finger.move(await center(page.getByTestId('done')), { steps: 8 });
    await finger.up();
    await waitForIdle(page);
    await expect(board(page)).toHaveText(/^todo:c2,c3 \| doing:c4,c5 \| done:(c1,c6|c6,c1)$/);
    expect(await page.evaluate(() => window.scrollX)).toBe(0);
  });

  test('a quick sideways swipe on a UCard scrolls the board and does not drag', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    // From the right part of the first card, the only column fully on screen.
    const start = await at(card(page, 'c1'), 0.9);
    await swipe(finger, start, { x: start.x - 220, y: start.y });
    await expect.poll(() => scrollLeft(scroller(page))).toBeGreaterThan(100);
    await page.waitForTimeout(300);
    await expect(overlay(page)).toHaveCount(0);
    await expect(board(page)).toHaveText('todo:c1,c2,c3 | doing:c4,c5 | done:c6');
  });

  test('a tap on the UDropdownMenu button opens the menu instead of dragging', async ({ page }) => {
    await card(page, 'c2').getByTestId('menu').tap();
    const remove = page.getByRole('menuitem', { name: 'Delete' });
    await expect(remove).toBeVisible();
    await expect(overlay(page)).toHaveCount(0);
    await remove.tap();
    await expect(board(page)).toHaveText('todo:c1,c3 | doing:c4,c5 | done:c6');
  });
});

test.describe('Nuxt UI on a phone: tree @touch', () => {
  const root = (page: Page) => page.getByTestId('tree-root');
  const row = (page: Page, id: string) => byId(root(page), id);
  const structure = (page: Page) => page.getByTestId('tree');
  const INITIAL = 'src(components(ui,button),main),docs(intro,guide),assets,package,readme';

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#tree`);
    await expect(structure(page)).toHaveText(INITIAL);
  });

  test('a long press picks a UCard row up; sliding right nests it into the folder above', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    const start = await longPress(page, finger, row(page, 'package'));
    await finger.move({ x: start.x + 34, y: start.y + 8 }, { steps: 8 });
    await expect(page.getByTestId('projected')).toHaveText('1:assets');
    await finger.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets(package),readme');
  });

  test('a tap on the UButton toggle expands a folder without dragging', async ({ page }) => {
    await expect(row(page, 'intro')).toHaveCount(0);
    await page.locator('[data-toggle="docs"]').tap();
    await expect(row(page, 'intro')).toBeVisible();
    await expect(overlay(page)).toHaveCount(0);
    await expect(structure(page)).toHaveText(INITIAL);
  });
});

test.describe('Nuxt UI on a phone: UTable virtualize @touch', () => {
  const ROW = 58;
  const HEAD = 'r0,r1,r2,r3,r4,r5,r6,r7,r8,r9';
  const scroller = (page: Page) => page.getByTestId('virtual-scroller');
  /** The <tr> of row `r<n>` (UTable rows carry no id: found by the title cell). */
  const row = (page: Page, id: string) =>
    scroller(page)
      .locator('tbody tr')
      .filter({ has: page.getByRole('cell', { name: `Row ${id.slice(1)}`, exact: true }) });
  const handle = (page: Page, id: string) => row(page, id).getByTestId('row-handle');
  const placeholder = (page: Page) => page.locator('[data-dnd-placeholder]');
  const order = (page: Page) => page.getByTestId('virtual-order');
  const dropped = (page: Page) => page.getByTestId('virtual-drop');

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#virtual`);
    await expect(order(page)).toHaveText(HEAD);
    await expect(row(page, 'r0')).toBeVisible();
  });

  test('a quick swipe scrolls the table, not the page, and does not drag; a long press on the handle drags a row', async ({
    page,
  }) => {
    const finger = (await touchscreen(page)).finger();
    const start = await center(handle(page, 'r5'));
    await swipe(finger, start, { x: start.x, y: start.y - 200 });
    await expect.poll(() => scrollTop(scroller(page))).toBeGreaterThan(100);
    await page.waitForTimeout(300);
    await expect(overlay(page)).toHaveCount(0);
    expect(await windowScrollY(page)).toBe(0);

    await scrollElement(scroller(page), 0);
    await longPress(page, finger, handle(page, 'r1'));
    await finger.move(await at(row(page, 'r4'), 0.5, 0.8), { steps: 12 });
    await finger.up();
    await waitForIdle(page);
    await expect(dropped(page)).toHaveText('r1@4:r4,r1,r5');
  });

  test('the touched row unmounts mid-drag (scrolled away): the finger keeps dragging and the drop lands', async ({
    page,
  }) => {
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, handle(page, 'r2'));
    // Above the table, where the overlay no longer overlaps it; then the table scrolls
    // away under the finger. The touch target, r2's handle, leaves the document: its
    // touchmoves no longer reach the window, yet the page must not take the gesture.
    const box = (await scroller(page).boundingBox())!;
    await finger.move({ x: finger.position.x, y: box.y - 2 * ROW }, { steps: 8 });
    await scrollElement(scroller(page), 100 * ROW);
    await expect(row(page, 'r2')).toHaveCount(0);
    await expect(overlay(page)).toHaveCount(1);

    // One jump: a glide down through the table's top edge zone would scroll it back up
    // (the move up has unlocked upward auto-scroll).
    await finger.move(await at(row(page, 'r104'), 0.5, 0.8), { steps: 1 });
    await expect(placeholder(page).getByRole('cell', { name: 'Row 2', exact: true })).toHaveCount(1);
    await finger.up();
    await waitForIdle(page);
    await expect(dropped(page)).toHaveText('r2@104:r104,r2,r105');
    expect(await windowScrollY(page)).toBe(0);
  });

  test('held at the bottom edge of the table, a row auto-scrolls it and lands under the finger', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    const box = (await scroller(page).boundingBox())!;
    const start = await longPress(page, finger, handle(page, 'r1'));
    await finger.move({ x: start.x, y: box.y + box.height - 4 }, { steps: 12 });
    await expect.poll(() => scrollTop(scroller(page)), { timeout: 15_000 }).toBeGreaterThan(20 * ROW);
    const middle = box.y + box.height / 2;
    await finger.move({ x: start.x, y: middle }, { steps: 6 });
    await expect
      .poll(async () => {
        const slot = (await row(page, 'r1').boundingBox())!;
        return Math.abs(slot.y + slot.height / 2 - middle);
      })
      .toBeLessThanOrEqual(ROW);
    await finger.up();
    await waitForIdle(page);
    expect(Number((await dropped(page).textContent())!.match(/^r1@(\d+):/)![1])).toBeGreaterThan(20);
    expect(await windowScrollY(page)).toBe(0);
  });
});
