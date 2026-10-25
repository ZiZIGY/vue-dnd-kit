import type { Page } from '@playwright/test';
import { center, frames } from './helpers';
import {
  at,
  byId,
  cssVariable,
  drag,
  expect,
  focusedId,
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

  test('the overlay clone keeps the kit styling, with the background of its list', async ({ page }) => {
    const source = await look(task(page, 't1'));
    // <v-list-item> is transparent: <v-list> paints its background.
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
    // The row is cloned into a table of its own, with the table's background.
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
