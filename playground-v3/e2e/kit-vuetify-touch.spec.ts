import type { Page } from '@playwright/test';
import { center } from './helpers';
import { at, byId, centerOnScreen, expect, fitsScreen, test, waitForIdle } from './kit-helpers';
import { longPress, overlay, scrollLeft, swipe, touchscreen, windowScrollY } from './touch-helpers';

// Vuetify page (kits/vuetify.html) on a phone: the `mobile` project (Pixel 7, real
// touch input through CDP). Items without a handle pick up after a long press; the
// kit's v-btn handles have no `touch-action: none`, so they also wait for the long
// press, and a swipe that starts on one scrolls the page.

const PAGE = '/kits/vuetify.html';

test.describe('Vuetify on a phone @touch', () => {
  test('every demo fits the screen: no sideways page scroll, no zoom-out', async ({ page }) => {
    for (const [demo, state] of [
      ['list', 'tasks-state'],
      ['kanban', 'board'],
      ['tree', 'tree'],
    ] as const) {
      await page.goto(`${PAGE}#${demo}`);
      await page.reload();
      await expect(page.getByTestId(state)).not.toBeEmpty();
      expect(await fitsScreen(page), demo).toBe(true);
    }
  });
});

test.describe('Vuetify on a phone: lists @touch', () => {
  const tasks = (page: Page) => page.getByTestId('tasks');
  const task = (page: Page, id: string) => byId(tasks(page), id);
  const handle = (page: Page, id: string) => task(page, id).getByTestId('handle');

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#list`);
    await expect(page.getByTestId('tasks-state')).toHaveText('t1,t2,t3,t4,t5');
  });

  test('a long press on the v-btn handle picks the task up; it sorts without scrolling the page', async ({ page }) => {
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

  test('a long press on a v-tooltip chip (fragment root) sorts it horizontally', async ({ page }) => {
    const tags = page.getByTestId('tags');
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, byId(tags, 'vue'));
    await finger.move(await at(byId(tags, 'vite'), 0.85), { steps: 12 });
    await finger.up();
    await waitForIdle(page);
    await expect(page.getByTestId('tags-state')).toHaveText('nuxt,vite,vue,pinia');
  });

  test('v-data-table: a long press on the row handle drags the row', async ({ page }) => {
    const table = page.getByTestId('people');
    // In the middle of the screen: the bottom edge would auto-scroll the page.
    await centerOnScreen(table);
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, byId(table, 'p1').getByTestId('row-handle'));
    await finger.move(await at(byId(table, 'p3'), 0.5, 0.8), { steps: 12 });
    await finger.up();
    await waitForIdle(page);
    await expect(page.getByTestId('people-state')).toHaveText('p2,p3,p1,p4');
  });

  test('in a v-dialog: a tap clicks an item, a long press drags it, the dialog stays open', async ({ page }) => {
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
    // The drop is not a click on the item, and the dialog stays open.
    await expect(state).toHaveText('f2,f3,f1 opened:f2');
    await expect(list).toBeVisible();

    // A long press lifted in place drops the item where it was, without clicking it.
    await longPress(page, finger, byId(list, 'f3'));
    await finger.up();
    await waitForIdle(page);
    await page.waitForTimeout(300);
    await expect(state).toHaveText('f2,f3,f1 opened:f2');
    await expect(list).toBeVisible();
  });
});

test.describe('Vuetify on a phone: kanban @touch', () => {
  const card = (page: Page, id: string) => byId(page, id);
  const board = (page: Page) => page.getByTestId('board');
  const scroller = (page: Page) => page.getByTestId('board-scroller');

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#kanban`);
    await expect(board(page)).toHaveText('todo:c1,c2,c3 | doing:c4,c5 | done:c6');
  });

  test('a v-card held at the right edge scrolls the board and drops into the last column', async ({ page }) => {
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

  test('a quick sideways swipe on a v-card scrolls the board and does not drag', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    // From the right part of the first card, the only column fully on screen.
    const start = await at(card(page, 'c1'), 0.9);
    await swipe(finger, start, { x: start.x - 220, y: start.y });
    await expect.poll(() => scrollLeft(scroller(page))).toBeGreaterThan(100);
    await page.waitForTimeout(300);
    await expect(overlay(page)).toHaveCount(0);
    await expect(board(page)).toHaveText('todo:c1,c2,c3 | doing:c4,c5 | done:c6');
  });

  test('a tap on the v-menu button opens the menu instead of dragging', async ({ page }) => {
    await card(page, 'c2').getByTestId('menu').tap();
    const remove = page.locator('.v-overlay--active .v-list-item', { hasText: 'Delete' });
    await expect(remove).toBeVisible();
    await expect(overlay(page)).toHaveCount(0);
    await remove.tap();
    await expect(board(page)).toHaveText('todo:c1,c3 | doing:c4,c5 | done:c6');
  });
});

test.describe('Vuetify on a phone: tree @touch', () => {
  const root = (page: Page) => page.getByTestId('tree-root');
  const row = (page: Page, id: string) => byId(root(page), id);
  const structure = (page: Page) => page.getByTestId('tree');
  const INITIAL = 'src(components(ui,button),main),docs(intro,guide),assets,package,readme';

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#tree`);
    await expect(structure(page)).toHaveText(INITIAL);
  });

  test('a long press picks a v-list-item row up; sliding right nests it into the folder above', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    const start = await longPress(page, finger, row(page, 'package'));
    await finger.move({ x: start.x + 34, y: start.y + 8 }, { steps: 8 });
    await expect(page.getByTestId('projected')).toHaveText('1:assets');
    await finger.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets(package),readme');
  });

  test('a tap on the v-btn toggle expands a folder without dragging', async ({ page }) => {
    await expect(row(page, 'intro')).toHaveCount(0);
    await page.locator('[data-toggle="docs"]').tap();
    await expect(row(page, 'intro')).toBeVisible();
    await expect(overlay(page)).toHaveCount(0);
    await expect(structure(page)).toHaveText(INITIAL);
  });
});
