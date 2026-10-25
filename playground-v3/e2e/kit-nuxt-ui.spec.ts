import type { Locator, Page } from '@playwright/test';
import { center, frames } from './helpers';
import {
  byId,
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

// Nuxt UI 4 (Reka UI) page: kits/nuxt-ui.html. Dark mode is the `dark` class on <html>.

const PAGE = '/kits/nuxt-ui.html';

const enableDark = async (page: Page) => {
  await page.getByTestId('theme').click();
  await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  // Some components transition their colors to the new theme.
  await settle(page);
};

/** A point inside `locator`: `x`/`y` ratios of its box. */
const at = async (locator: Locator, x = 0.5, y = 0.5) => {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Element is not visible');
  return { x: box.x + box.width * x, y: box.y + box.height * y };
};

test.describe('Nuxt UI: sortable lists', () => {
  const tasks = (page: Page) => page.getByTestId('tasks');
  const task = (page: Page, id: string) => byId(tasks(page), id);
  const handle = (page: Page, id: string) => task(page, id).getByTestId('handle');

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#list`);
    await expect(page.getByTestId('tasks-state')).toHaveText('t1,t2,t3,t4,t5');
  });

  test('sorts UCard items by their UButton handle', async ({ page }) => {
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
    // makeSortableItem(useTemplateRef('handle')) on a UButton: its <button>.
    await expect(handle(page, 't1')).toHaveAttribute('aria-roledescription', 'sortable');
    await expect(task(page, 't1')).not.toHaveAttribute('aria-roledescription');
    // UTooltip renders a fragment: the ref resolves to its trigger, the badge.
    const badge = byId(page.getByTestId('tags'), 'vue');
    await expect(badge).toHaveAttribute('aria-roledescription', 'sortable');
    await expect(badge).toHaveAttribute('tabindex', '0');
  });

  test('the overlay clone keeps the kit styling', async ({ page }) => {
    const source = await look(task(page, 't1'));
    await drag(page, handle(page, 't1'), await at(task(page, 't2')), { release: false });
    await expect(overlayClone(page)).toBeVisible();
    expect(await look(overlayClone(page))).toEqual(source);
    expect(source.radius).not.toBe('0px');
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
  });

  test('dark mode: the clone keeps the dark theme', async ({ page }) => {
    const light = await look(task(page, 't1'));
    await enableDark(page);
    const dark = await look(task(page, 't1'));
    expect(dark.background).not.toBe(light.background);
    await drag(page, handle(page, 't1'), await at(task(page, 't2')), { release: false });
    expect(await look(overlayClone(page))).toEqual(dark);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
  });

  test('a teleported tooltip inside an item does not get in the way', async ({ page }) => {
    await task(page, 't1').getByTestId('tag').hover();
    const tooltip = page.locator('[data-slot="content"]', { hasText: 'Tag: docs' });
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

  test('UTooltip-wrapped badges (fragment roots) sort horizontally', async ({ page }) => {
    const tags = page.getByTestId('tags');
    await drag(page, byId(tags, 'vue'), await at(byId(tags, 'vite'), 0.85));
    await waitForIdle(page);
    await expect(page.getByTestId('tags-state')).toHaveText('nuxt,vite,vue,pinia');
  });

  test('UTable rows sort by a handle in a cell slot', async ({ page }) => {
    const rows = page.getByTestId('people').locator('tbody tr');
    const ada = rows.filter({ hasText: 'Ada Lovelace' });
    await drag(page, ada.getByTestId('row-handle'), await at(rows.filter({ hasText: 'Grace Hopper' }), 0.5, 0.8), {
      release: false,
    });
    // The row is cloned into a table of its own, with the background behind the row.
    const clone = overlayClone(page);
    await expect(clone).toHaveJSProperty('tagName', 'TABLE');
    const row = await look(clone.locator('tr'));
    expect(row.background).toBe((await look(page.locator('body'))).background);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('people-state')).toHaveText('p2,p3,p1,p4');
  });

  test('in a modal (Reka focus trap): pointer, keyboard, click and Escape', async ({ page }) => {
    await page.getByTestId('open-modal').click();
    const list = page.getByTestId('modal-list');
    const state = page.getByTestId('modal-state');
    await expect(list).toBeVisible();

    // A draggable UButton still clicks.
    await byId(list, 'f2').click();
    await expect(state).toHaveText('f1,f2,f3 opened:f2');

    // Pointer: <body> has `pointer-events: none` while the modal is open.
    await drag(page, byId(list, 'f1'), await at(byId(list, 'f3'), 0.5, 0.8));
    await waitForIdle(page);
    await expect(state).toHaveText('f2,f3,f1 opened:f2');

    // Keyboard: the keys don't click the button, the focus comes back to it.
    await byId(list, 'f3').focus();
    await press(page, 'Space');
    await press(page, 'ArrowUp');
    await press(page, 'Enter');
    await waitForIdle(page);
    await expect(state).toHaveText('f3,f2,f1 opened:f2');
    expect(await focusedId(page)).toBe('f3');

    // Escape cancels the drag, not the modal; the next one closes the modal.
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

test.describe('Nuxt UI: kanban', () => {
  const card = (page: Page, id: string) => byId(page, id);
  const board = (page: Page) => page.getByTestId('board');

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#kanban`);
    await expect(board(page)).toHaveText('todo:c1,c2,c3 | doing:c4,c5 | done:c6');
  });

  test('moves a UCard to another column', async ({ page }) => {
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

  test('the custom #overlay renders a UCard styled like the source', async ({ page }) => {
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

  test('dark mode: the custom overlay keeps the dark theme', async ({ page }) => {
    const light = await look(card(page, 'c2'));
    await enableDark(page);
    const dark = await look(card(page, 'c2'));
    expect(dark.background).not.toBe(light.background);
    await drag(page, card(page, 'c2'), await at(page.getByTestId('doing')), { release: false });
    expect((await look(page.getByTestId('kanban-overlay'))).background).toBe(dark.background);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
  });

  test('the UDropdownMenu button inside a card clicks instead of dragging', async ({ page }) => {
    const button = card(page, 'c2').getByTestId('menu');
    // Past the activation distance, still on the button.
    await pressAndMove(page, button, 8, 0);
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
    await page.mouse.up();
    // The menu teleports to <body>, outside the card.
    await page.getByRole('menuitem', { name: 'Delete' }).click();
    await expect(board(page)).toHaveText('todo:c1,c3 | doing:c4,c5 | done:c6');
    await card(page, 'c1').getByTestId('menu').click();
    await page.getByRole('menuitem', { name: 'Move to next column' }).click();
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

test.describe('Nuxt UI: tree', () => {
  const INITIAL = 'src(components(ui,button),main),docs(intro,guide),assets,package,readme';
  const root = (page: Page) => page.getByTestId('tree-root');
  const row = (page: Page, id: string) => byId(root(page), id);
  const structure = (page: Page) => page.getByTestId('tree');

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#tree`);
    await expect(structure(page)).toHaveText(INITIAL);
  });

  test('nests a UCard row into a folder by horizontal offset', async ({ page }) => {
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

  test('the UButton toggle expands a folder without dragging', async ({ page }) => {
    await expect(row(page, 'intro')).toHaveCount(0);
    await page.locator('[data-toggle="docs"]').click();
    await expect(row(page, 'intro')).toBeVisible();
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
    await expect(structure(page)).toHaveText(INITIAL);
  });

  test('keyboard: sorts a row and keeps its focus', async ({ page }) => {
    await row(page, 'readme').focus();
    await press(page, 'Space');
    await press(page, 'ArrowUp');
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets,readme,package');
    expect(await focusedId(page)).toBe('readme');
  });
});
