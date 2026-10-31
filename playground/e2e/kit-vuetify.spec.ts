import type { Page } from '@playwright/test';
import { center, frames, nextFrames, scrollElement, type Point } from './helpers';
import {
  at,
  byId,
  cssVariable,
  drag,
  expect,
  focusedId,
  grab,
  leaveSideways,
  look,
  overlayClone,
  press,
  pressAndMove,
  settle,
  test,
  waitForIdle,
} from './kit-helpers';

// Vuetify 4 page: kits/vuetify.html. Dark mode is the `theme` prop of <v-app> only, so
// the page root keeps the light theme's variables: anything teleported out of <v-app>
// (the drag overlay) has to carry the dark theme itself.

const PAGE = '/kits/vuetify.html';

const enableDark = async (page: Page) => {
  await page.getByTestId('theme').click();
  await expect(page.locator('.v-application')).toHaveClass(/\bv-theme--dark\b/);
  // Cards transition their background to the new theme.
  await settle(page);
};

test.describe('Vuetify: sortable lists', () => {
  const tasks = (page: Page) => page.getByTestId('tasks');
  const task = (page: Page, id: string) => byId(tasks(page), id);
  const handle = (page: Page, id: string) => task(page, id).getByTestId('handle');

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#list`);
    await expect(page.getByTestId('tasks-state')).toHaveText('t1,t2,t3,t4,t5');
  });

  test('sorts v-list-items by their v-btn handle', async ({ page }) => {
    await drag(page, handle(page, 't1'), await at(task(page, 't3'), 0.5, 0.8));
    await waitForIdle(page);
    await expect(page.getByTestId('tasks-state')).toHaveText('t2,t3,t1,t4,t5');
  });

  test('a drag starts only from the handle', async ({ page }) => {
    await pressAndMove(page, task(page, 't2').getByText('Review the API'), 0, 80);
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
    await page.mouse.up();
    await expect(page.getByTestId('tasks-state')).toHaveText('t1,t2,t3,t4,t5');
  });

  test('component refs resolve to the kit elements, which get the attributes', async ({ page }) => {
    // makeSortableItem(useTemplateRef('handle')) on a v-btn: its <button>.
    await expect(handle(page, 't1')).toHaveAttribute('aria-roledescription', 'sortable');
    // The kit's own role on the item is kept.
    await expect(task(page, 't1')).toHaveAttribute('role', 'listitem');
    // v-tooltip renders a fragment: the ref resolves to its activator, the chip.
    const chip = byId(page.getByTestId('tags'), 'vue');
    await expect(chip).toHaveAttribute('aria-roledescription', 'sortable');
    await expect(chip).toHaveAttribute('tabindex', '0');
  });

  test('a v-tooltip activator is described by the tooltip and by the drag instructions', async ({ page }) => {
    // v-tooltip puts its own aria-describedby on the chip; the instructions join it.
    const chip = byId(page.getByTestId('tags'), 'vue');
    const ids = (await chip.getAttribute('aria-describedby'))?.split(' ') ?? [];
    expect(ids).toHaveLength(2);
    const [tooltip, instructions] = ids as [string, string];
    expect(tooltip).not.toMatch(/^dnd-kit-/);
    expect(instructions).toMatch(/^dnd-kit-instructions-/);
    await expect(page.locator(`[id="${instructions}"]`)).toHaveCount(1);
    await chip.hover();
    await expect(page.locator(`[id="${tooltip}"]`)).toContainText('#vue');
    await expect(chip).toHaveAttribute('aria-describedby', `${tooltip} ${instructions}`);
    await expect(chip).toHaveAccessibleDescription(/^#vue To pick up a draggable item/);
  });

  test('the overlay clone keeps the kit styling; [data-dnd-overlay] CSS gives it the list background', async ({ page }) => {
    const source = await look(task(page, 't1'));
    // <v-list-item> is transparent: <v-list> paints its background, and the demo's CSS
    // paints it on the copy (the library doesn't guess backgrounds).
    const list = await look(tasks(page));
    await drag(page, handle(page, 't1'), await at(task(page, 't2')), { release: false });
    await expect(overlayClone(page)).toBeVisible();
    expect(await look(overlayClone(page))).toEqual({ ...source, background: list.background });
    expect(source.radius).not.toBe('0px');
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
  });

  test('dark mode: the clone outside <v-app> keeps the dark theme variables', async ({ page }) => {
    const light = await look(tasks(page));
    await enableDark(page);
    const dark = await look(tasks(page));
    expect(dark.background).not.toBe(light.background);
    const surface = await cssVariable(task(page, 't1'), '--v-theme-surface');
    // The page root still has the light theme.
    expect(await cssVariable(page.locator('html'), '--v-theme-surface')).not.toBe(surface);
    await drag(page, handle(page, 't1'), await at(task(page, 't2')), { release: false });
    const clone = overlayClone(page);
    expect((await look(clone)).background).toBe(dark.background);
    expect((await look(clone)).color).toBe((await look(task(page, 't1'))).color);
    expect(await cssVariable(clone, '--v-theme-surface')).toBe(surface);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
  });

  test('a teleported tooltip inside an item does not get in the way', async ({ page }) => {
    await task(page, 't1').getByTestId('tag').hover();
    const tooltip = page.locator('.v-tooltip .v-overlay__content', { hasText: 'Tag: docs' });
    await expect(tooltip).toBeVisible();
    await drag(page, handle(page, 't1'), await at(task(page, 't2'), 0.5, 0.8));
    await waitForIdle(page);
    await expect(page.getByTestId('tasks-state')).toHaveText('t2,t1,t3,t4,t5');
    await expect(tooltip).toBeHidden();
  });

  test('keyboard: Space on the handle, arrows, Space; the focus stays on the handle', async ({ page }) => {
    await handle(page, 't1').focus();
    await press(page, 'Space');
    await expect(task(page, 't1')).toHaveAttribute('data-dnd-placeholder');
    await press(page, 'ArrowDown', 2);
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(page.getByTestId('tasks-state')).toHaveText('t2,t3,t1,t4,t5');
    expect(await focusedId(page)).toBe('t1');
  });

  test('v-tooltip-wrapped chips (fragment roots) sort horizontally', async ({ page }) => {
    const tags = page.getByTestId('tags');
    await drag(page, byId(tags, 'vue'), await at(byId(tags, 'vite'), 0.85));
    await waitForIdle(page);
    await expect(page.getByTestId('tags-state')).toHaveText('nuxt,vite,vue,pinia');
  });

  test('v-data-table rows (v-data-table-row refs) sort by a handle', async ({ page }) => {
    const table = page.getByTestId('people');
    await drag(page, byId(table, 'p1').getByTestId('row-handle'), await at(byId(table, 'p3'), 0.5, 0.8), {
      release: false,
    });
    // The row is cloned into a table of its own; the demo's [data-dnd-overlay] CSS gives it
    // the table's background.
    const clone = overlayClone(page);
    await expect(clone).toHaveJSProperty('tagName', 'TABLE');
    expect((await look(clone.locator('tr'))).background).toBe((await look(table)).background);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('people-state')).toHaveText('p2,p3,p1,p4');
  });

  test('in a v-dialog, with clickable v-list-items: pointer, keyboard, click and Escape', async ({ page }) => {
    await page.getByTestId('open-modal').click();
    const list = page.getByTestId('modal-list');
    const state = page.getByTestId('modal-state');
    await expect(list).toBeVisible();

    // A draggable clickable item still clicks.
    await byId(list, 'f2').click();
    await expect(state).toHaveText('f1,f2,f3 opened:f2');

    await drag(page, byId(list, 'f1'), await at(byId(list, 'f3'), 0.5, 0.8));
    await waitForIdle(page);
    await expect(state).toHaveText('f2,f3,f1 opened:f2');

    // Vuetify turns Enter/Space on a clickable item into a click and stops the event;
    // <v-list> moves the focus on arrows. The drag gets the keys first.
    await byId(list, 'f3').focus();
    await press(page, 'Space');
    await press(page, 'ArrowUp');
    await press(page, 'Enter');
    await waitForIdle(page);
    await expect(state).toHaveText('f3,f2,f1 opened:f2');
    expect(await focusedId(page)).toBe('f3');

    // Escape cancels the drag, not the dialog; the next one closes the dialog.
    await byId(list, 'f1').focus();
    await press(page, 'Enter');
    await press(page, 'ArrowUp');
    await press(page, 'Escape');
    await waitForIdle(page);
    await expect(state).toHaveText('f3,f2,f1 opened:f2');
    await expect(list).toBeVisible();
    expect(await focusedId(page)).toBe('f1');
    await page.keyboard.press('Escape');
    await expect(list).toBeHidden();
  });

  test("the press's ripple doesn't freeze: neither in the item nor in the overlay", async ({ page }) => {
    await page.getByTestId('open-modal').click();
    const list = page.getByTestId('modal-list');
    await expect(list).toBeVisible();
    // The dialog scales in: press where the item is once it stands still.
    await page.waitForFunction(() => document.getAnimations().every((animation) => animation.playState !== 'running'));
    const item = byId(list, 'f1');
    // The press starts Vuetify's ripple; the drag then holds the pointer on <body>, so the
    // item hears no mouseup: the library tells it the pointer left, and the clone leaves
    // the ripple out.
    await grab(page, item);
    await expect(page.locator('[data-dnd-overlay] .v-ripple__container')).toHaveCount(0);
    await expect(item.locator('.v-ripple__container')).toHaveCount(0, { timeout: 2000 });
    await page.mouse.up();
    await waitForIdle(page);
  });
});

test.describe('Vuetify: kanban', () => {
  const card = (page: Page, id: string) => byId(page, id);
  const board = (page: Page) => page.getByTestId('board');
  const menuItem = (page: Page, title: string) => page.locator('.v-overlay--active .v-list-item', { hasText: title });

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#kanban`);
    await expect(board(page)).toHaveText('todo:c1,c2,c3 | doing:c4,c5 | done:c6');
  });

  test('moves a v-card to another column', async ({ page }) => {
    // Below the last card of the column; held a moment before the drop.
    await drag(page, card(page, 'c1'), await at(page.getByTestId('done'), 0.5, 0.85), { release: false });
    await frames(page, 3);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(board(page)).toHaveText('todo:c2,c3 | doing:c4,c5 | done:c6,c1');
  });

  test('sorts within a column', async ({ page }) => {
    await drag(page, card(page, 'c3'), await at(card(page, 'c1'), 0.5, 0.2));
    await waitForIdle(page);
    await expect(board(page)).toHaveText('todo:c3,c1,c2 | doing:c4,c5 | done:c6');
  });

  test('the custom #overlay renders a v-card styled like the source', async ({ page }) => {
    const source = await look(card(page, 'c2'));
    await drag(page, card(page, 'c2'), await at(page.getByTestId('doing')), { release: false });
    const overlay = page.getByTestId('kanban-overlay');
    await expect(overlay).toContainText('Login form');
    const shown = await look(overlay);
    expect(shown.background).toBe(source.background);
    expect(shown.radius).toBe(source.radius);
    await page.mouse.up();
    await waitForIdle(page);
  });

  test('dark mode: the custom overlay outside <v-app> keeps the dark theme', async ({ page }) => {
    const light = await look(card(page, 'c2'));
    await enableDark(page);
    const dark = await look(card(page, 'c2'));
    expect(dark.background).not.toBe(light.background);
    await drag(page, card(page, 'c2'), await at(page.getByTestId('doing')), { release: false });
    const overlay = page.getByTestId('kanban-overlay');
    // The theme reaches the teleported card through provide/inject: it gets its own theme class.
    await expect(overlay).toHaveClass(/\bv-theme--dark\b/);
    expect((await look(overlay)).background).toBe(dark.background);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
  });

  test('the v-menu button inside a card clicks instead of dragging', async ({ page }) => {
    const button = card(page, 'c2').getByTestId('menu');
    // Past the activation distance, still on the button.
    await pressAndMove(page, button, 8, 0);
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
    await page.mouse.up();
    // The menu teleports out of the card.
    await menuItem(page, 'Delete').click();
    await expect(board(page)).toHaveText('todo:c1,c3 | doing:c4,c5 | done:c6');
    await card(page, 'c1').getByTestId('menu').click();
    await menuItem(page, 'Move to next column').click();
    await expect(board(page)).toHaveText('todo:c3 | doing:c4,c5,c1 | done:c6');
  });

  test('keyboard: an arrow moves a card to the adjacent column', async ({ page }) => {
    await card(page, 'c1').focus();
    await press(page, 'Space');
    await press(page, 'ArrowRight');
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(board(page)).toHaveText(/^todo:c2,c3 \| doing:[^|]*c1[^|]* \| done:c6$/);
    expect(await focusedId(page)).toBe('c1');
  });
});

test.describe('Vuetify: tree', () => {
  const INITIAL = 'src(components(ui,button),main),docs(intro,guide),assets,package,readme';
  const root = (page: Page) => page.getByTestId('tree-root');
  const row = (page: Page, id: string) => byId(root(page), id);
  const structure = (page: Page) => page.getByTestId('tree');

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#tree`);
    await expect(structure(page)).toHaveText(INITIAL);
  });

  test('nests a v-list-item row into a folder by horizontal offset', async ({ page }) => {
    const start = await center(row(page, 'package'));
    await drag(page, row(page, 'package'), { x: start.x + 34, y: start.y + 8 }, { release: false });
    await expect(page.getByTestId('projected')).toHaveText('1:assets');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets(package),readme');
  });

  test('sorts among siblings', async ({ page }) => {
    await drag(page, row(page, 'readme'), await at(row(page, 'package'), 0.5, 0.2));
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets,readme,package');
  });

  test('the v-btn toggle expands a folder without dragging', async ({ page }) => {
    await expect(row(page, 'intro')).toHaveCount(0);
    await page.locator('[data-toggle="docs"]').click();
    await expect(row(page, 'intro')).toBeVisible();
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
    await expect(structure(page)).toHaveText(INITIAL);
  });

  test('keyboard: <v-list> arrow navigation does not take the focus from the dragged row', async ({ page }) => {
    await row(page, 'readme').focus();
    await press(page, 'Space');
    await press(page, 'ArrowUp');
    expect(await focusedId(page)).not.toBe('package');
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets,readme,package');
    expect(await focusedId(page)).toBe('readme');
  });
});

test.describe('Vuetify: v-virtual-scroll (3,000 rows)', () => {
  // v-virtual-scroll can't pin a row (kits/vuetify/components/VirtualList.vue): the
  // active row unmounts when it is scrolled out of range, and the drag goes on by key.
  const ROW = 48;
  const HEAD = 'r0,r1,r2,r3,r4,r5,r6,r7,r8,r9';
  const scroller = (page: Page) => page.getByTestId('virtual-scroller');
  const row = (page: Page, id: string) => byId(scroller(page), id);
  const order = (page: Page) => page.getByTestId('virtual-order');
  const dropped = (page: Page) => page.getByTestId('virtual-drop');

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#virtual`);
    await expect(order(page)).toHaveText(HEAD);
    await expect(row(page, 'r0')).toBeVisible();
  });

  test('reorders v-list-items within the viewport; the rendered rows follow the data', async ({ page }) => {
    await drag(page, row(page, 'r1'), await at(row(page, 'r4'), 0.5, 0.8));
    await waitForIdle(page);
    await expect(order(page)).toHaveText('r0,r2,r3,r4,r1,r5,r6,r7,r8,r9');
    await expect(dropped(page)).toHaveText('r1@4:r4,r1,r5');
    // Keyed by id: the fifth rendered row is r1, at the fifth slot.
    await expect(scroller(page).locator('[data-id]').nth(4)).toHaveAttribute('data-id', 'r1');
    const box = (await scroller(page).boundingBox())!;
    expect((await row(page, 'r1').boundingBox())!.y - box.y).toBeCloseTo(4 * ROW, 0);
  });

  test('held at the bottom edge, a row auto-scrolls the list far down and lands under the pointer', async ({
    page,
  }) => {
    const box = (await scroller(page).boundingBox())!;
    const start = await grab(page, row(page, 'r1'));
    await page.mouse.move(start.x, box.y + box.height - 4, { steps: 10 });
    await expect
      .poll(() => scroller(page).evaluate((element) => element.scrollTop), { timeout: 15_000 })
      .toBeGreaterThan(40 * ROW);
    // Back to the middle: the scrolling stops, and r1 sits under the pointer.
    const middle = box.y + box.height / 2;
    await page.mouse.move(start.x, middle, { steps: 6 });
    const scrolled = await scroller(page).evaluate((element) => element.scrollTop);
    await nextFrames(page, 4);
    expect(await scroller(page).evaluate((element) => element.scrollTop)).toBe(scrolled);
    await expect
      .poll(async () => {
        const slot = (await row(page, 'r1').boundingBox())!;
        return Math.abs(slot.y + slot.height / 2 - middle);
      })
      .toBeLessThanOrEqual(ROW);
    await page.mouse.up();
    await waitForIdle(page);
    const index = Number((await dropped(page).textContent())!.match(/^r1@(\d+):/)![1]);
    expect(index).toBeGreaterThan(40);
    await expect(order(page)).toHaveText('r0,r2,r3,r4,r5,r6,r7,r8,r9,r10');
  });

  test('the active row unmounts when scrolled out of range, and the drop still lands', async ({ page }) => {
    const point = await grab(page, row(page, 'r2'));
    await leaveSideways(page, scroller(page), point);
    await scrollElement(scroller(page), 100 * ROW);
    // No pinning in v-virtual-scroll: the active row is gone; the overlay stays.
    await expect(row(page, 'r2')).toHaveCount(0);
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await expect(row(page, 'r105')).toBeInViewport();

    const target = await at(row(page, 'r105'), 0.5, 0.8);
    await page.mouse.move(target.x, target.y, { steps: 10 });
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'r2');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(dropped(page)).toHaveText('r2@105:r105,r2,r106');
    await expect(order(page)).toHaveText('r0,r1,r3,r4,r5,r6,r7,r8,r9,r10');
  });

  test('keyboard: arrows carry a row past the bottom of the viewport; the list follows, the focus stays', async ({
    page,
  }) => {
    await row(page, 'r1').focus();
    await press(page, 'Space');
    await press(page, 'ArrowDown', 25);
    await expect(row(page, 'r1')).toBeInViewport();
    expect(await focusedId(page)).toBe('r1');
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(dropped(page)).toHaveText('r1@26:r26,r1,r27');
    expect(await focusedId(page)).toBe('r1');
  });

  test('Escape restores the order after the active row unmounted', async ({ page }) => {
    await drag(page, row(page, 'r1'), await at(row(page, 'r5'), 0.5, 0.8), { release: false });
    await expect(scroller(page).locator('[data-id]').nth(5)).toHaveAttribute('data-id', 'r1');
    await leaveSideways(page, scroller(page), await center(row(page, 'r1')));
    await scrollElement(scroller(page), 300 * ROW);
    await expect(row(page, 'r1')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(order(page)).toHaveText(HEAD);
    await expect(dropped(page)).toHaveText('');
    await scrollElement(scroller(page), 0);
    await expect(scroller(page).locator('[data-id]').nth(1)).toHaveAttribute('data-id', 'r1');
  });
});

test.describe('Vuetify: v-data-table-virtual (3,000 rows)', () => {
  // Vuetify keys each row's measuring wrapper by index (kits/vuetify/components/
  // VirtualTable.vue): rows whose index changed are remounted on every reorder, and no
  // row can be pinned.
  const HEAD = 'd0,d1,d2,d3,d4,d5,d6,d7,d8,d9';
  const table = (page: Page) => page.getByTestId('virtual-table');
  const scroller = (page: Page) => table(page).locator('.v-table__wrapper');
  const row = (page: Page, id: string) => byId(table(page), id);
  const order = (page: Page) => page.getByTestId('virtual-table-order');
  const dropped = (page: Page) => page.getByTestId('virtual-table-drop');
  const rowHeight = async (page: Page) => (await row(page, 'd0').boundingBox())!.height;

  /** Moves the held pointer left of the table, until the overlay (a full row) clears it. */
  const leaveLeft = async (page: Page, from: Point) => {
    const box = (await table(page).boundingBox())!;
    await page.mouse.move(box.x - box.width / 2 - 30, from.y, { steps: 6 });
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#virtual`);
    await expect(order(page)).toHaveText(HEAD);
    await expect(row(page, 'd0')).toBeVisible();
  });

  test('reorders v-data-table-rows within the viewport; the rows whose index changed are remounted', async ({
    page,
  }) => {
    await table(page).evaluate((root) =>
      root.querySelectorAll('[data-id]').forEach((element) => element.setAttribute('data-mounted-before', '')),
    );
    await drag(page, row(page, 'd1'), await at(row(page, 'd4'), 0.5, 0.8));
    await waitForIdle(page);
    await expect(order(page)).toHaveText('d0,d2,d3,d4,d1,d5,d6,d7,d8,d9');
    await expect(dropped(page)).toHaveText('d1@4:d4,d1,d5');
    // d1–d4 changed index: new elements. d0 and d5 kept theirs.
    for (const id of ['d0', 'd5']) await expect(row(page, id)).toHaveAttribute('data-mounted-before', '');
    for (const id of ['d1', 'd2', 'd3', 'd4']) await expect(row(page, id)).not.toHaveAttribute('data-mounted-before');
  });

  test('keyboard: the focus stays on the row while every step remounts it', async ({ page }) => {
    await row(page, 'd1').focus();
    await press(page, 'Space');
    for (let step = 0; step < 3; step++) {
      await press(page, 'ArrowDown');
      expect(await focusedId(page)).toBe('d1');
    }
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(dropped(page)).toHaveText('d1@4:d4,d1,d5');
    expect(await focusedId(page)).toBe('d1');
  });

  test('the active row unmounts when scrolled out of range, and the drop still lands', async ({ page }) => {
    const height = await rowHeight(page);
    const point = await grab(page, row(page, 'd2'));
    await leaveLeft(page, point);
    await scrollElement(scroller(page), 100 * height);
    await expect(row(page, 'd2')).toHaveCount(0);
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await expect(row(page, 'd105')).toBeInViewport();

    const target = await at(row(page, 'd105'), 0.5, 0.8);
    await page.mouse.move(target.x, target.y, { steps: 10 });
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'd2');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(dropped(page)).toHaveText('d2@105:d105,d2,d106');
    await expect(order(page)).toHaveText('d0,d1,d3,d4,d5,d6,d7,d8,d9,d10');
  });

  test('Escape restores the order after the active row unmounted', async ({ page }) => {
    const height = await rowHeight(page);
    await drag(page, row(page, 'd1'), await at(row(page, 'd5'), 0.5, 0.8), { release: false });
    await expect(table(page).locator('tbody [data-id]').nth(5)).toHaveAttribute('data-id', 'd1');
    await leaveLeft(page, await center(row(page, 'd1')));
    await scrollElement(scroller(page), 300 * height);
    await expect(row(page, 'd1')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(order(page)).toHaveText(HEAD);
    await expect(dropped(page)).toHaveText('');
    await scrollElement(scroller(page), 0);
    await expect(table(page).locator('tbody [data-id]').nth(1)).toHaveAttribute('data-id', 'd1');
  });
});
