import type { Page } from '@playwright/test';
import { center, frames, nextFrames, scrollElement } from './helpers';
import {
  at,
  byId,
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

// Nuxt UI 4 (Reka UI) page: kits/nuxt-ui.html. Dark mode is the `dark` class on <html>.

const PAGE = '/kits/nuxt-ui.html';

const enableDark = async (page: Page) => {
  await page.getByTestId('theme').click();
  await expect(page.locator('html')).toHaveClass(/\bdark\b/);
  // Some components transition their colors to the new theme.
  await settle(page);
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

  test('a UTooltip trigger keeps the drag instructions while its tooltip opens and closes', async ({ page }) => {
    // Reka describes the trigger by the tooltip only while it is open, rewriting
    // aria-describedby both ways: the instructions id goes back on each time.
    const badge = byId(page.getByTestId('tags'), 'vue');
    const instructions = await badge.getAttribute('aria-describedby');
    expect(instructions).toMatch(/^dnd-kit-instructions-\S+$/);
    await badge.hover();
    const tooltip = page.locator('[data-slot="content"]', { hasText: '#vue' });
    await expect(tooltip).toBeVisible();
    await expect(badge).toHaveAttribute('aria-describedby', new RegExp(`^(?!dnd-kit-)\\S+ ${instructions}$`));
    await page.mouse.move(0, 0);
    await expect(tooltip).toBeHidden();
    await expect(badge).toHaveAttribute('aria-describedby', instructions!);
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

test.describe('Nuxt UI: UTable virtualize (3,000 rows)', () => {
  // UTable's virtualizer can't pin a row (kits/nuxt-ui/components/VirtualTable.vue): the
  // active row unmounts when it is scrolled out of range, and the drag goes on by key.
  const ROW = 58;
  const HEAD = 'r0,r1,r2,r3,r4,r5,r6,r7,r8,r9';
  const scroller = (page: Page) => page.getByTestId('virtual-scroller');
  /** The <tr> of row `r<n>` (UTable rows carry no id: found by the title cell). */
  const row = (page: Page, id: string) =>
    scroller(page)
      .locator('tbody tr')
      .filter({ has: page.getByRole('cell', { name: `Row ${id.slice(1)}`, exact: true }) });
  const handle = (page: Page, id: string) => row(page, id).getByTestId('row-handle');
  /** The rendered row at virtual index `index`. */
  const slot = (page: Page, index: number) => scroller(page).locator(`tbody tr[data-index="${index}"]`);
  const placeholder = (page: Page) => page.locator('[data-dnd-placeholder]');
  const order = (page: Page) => page.getByTestId('virtual-order');
  const dropped = (page: Page) => page.getByTestId('virtual-drop');

  test.beforeEach(async ({ page }) => {
    await page.goto(`${PAGE}#virtual`);
    await expect(order(page)).toHaveText(HEAD);
    await expect(row(page, 'r0')).toBeVisible();
  });

  test('reorders UTable rows within the viewport; the rendered rows follow the data', async ({ page }) => {
    await drag(page, handle(page, 'r1'), await at(row(page, 'r4'), 0.5, 0.8));
    await waitForIdle(page);
    await expect(order(page)).toHaveText('r0,r2,r3,r4,r1,r5,r6,r7,r8,r9');
    await expect(dropped(page)).toHaveText('r1@4:r4,r1,r5');
    // Keyed by id: the virtualizer's slot 4 holds r1, right below r4.
    await expect(slot(page, 4)).toContainText('Row 1');
    const above = (await row(page, 'r4').boundingBox())!;
    expect((await row(page, 'r1').boundingBox())!.y - above.y).toBeCloseTo(ROW, -1);
  });

  test('held at the bottom edge, a row auto-scrolls the table far down and lands under the pointer', async ({
    page,
  }) => {
    const box = (await scroller(page).boundingBox())!;
    const start = await grab(page, handle(page, 'r1'));
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
    const point = await grab(page, handle(page, 'r2'));
    await leaveSideways(page, scroller(page), point);
    await scrollElement(scroller(page), 100 * ROW);
    // No pinning in UTable: the active row is gone; the overlay stays.
    await expect(row(page, 'r2')).toHaveCount(0);
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await expect(row(page, 'r104')).toBeInViewport();

    const target = await at(row(page, 'r104'), 0.5, 0.8);
    await page.mouse.move(target.x, target.y, { steps: 10 });
    await expect(placeholder(page)).toHaveCount(1);
    await expect(placeholder(page).getByRole('cell', { name: 'Row 2', exact: true })).toHaveCount(1);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(dropped(page)).toHaveText('r2@104:r104,r2,r105');
    await expect(order(page)).toHaveText('r0,r1,r3,r4,r5,r6,r7,r8,r9,r10');
  });

  test('keyboard: arrows carry a row past the bottom of the viewport; the table follows, the focus stays', async ({
    page,
  }) => {
    const focused = () => page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    await handle(page, 'r1').focus();
    await press(page, 'Space');
    await press(page, 'ArrowDown', 25);
    await expect(row(page, 'r1')).toBeInViewport();
    expect(await focused()).toBe('Drag Row 1');
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(dropped(page)).toHaveText('r1@26:r26,r1,r27');
    expect(await focused()).toBe('Drag Row 1');
  });

  test('Escape restores the order after the active row unmounted', async ({ page }) => {
    await drag(page, handle(page, 'r1'), await at(row(page, 'r5'), 0.5, 0.8), { release: false });
    await expect(slot(page, 5)).toContainText('Row 1');
    await leaveSideways(page, scroller(page), await center(row(page, 'r1')));
    await scrollElement(scroller(page), 300 * ROW);
    await expect(row(page, 'r1')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(order(page)).toHaveText(HEAD);
    await expect(dropped(page)).toHaveText('');
    await scrollElement(scroller(page), 0);
    await expect(slot(page, 1)).toContainText('Row 1');
  });
});
