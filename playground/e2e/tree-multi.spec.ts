import { expect, test, type Page } from '@playwright/test';
import { center, layoutSettled, trackErrors, trackVueWarnings, waitForIdle, type Point } from './helpers';

/**
 * Multi-drag in a tree: the selected nodes travel as one block, each with its subtree,
 * and land side by side at one place and depth, in document order. The overlay shows
 * them as a column, like lists in `multiple: 'group'`.
 */

// Every folder is expanded: src(0) components(1) ui(2) button(2) main(1) docs(0) intro(1) guide(1) assets(0) package(0) readme(0).
const INITIAL = 'src(components(ui,button),main),docs(intro,guide),assets,package,readme';
const ROWS = ['src', 'components', 'ui', 'button', 'main', 'docs', 'intro', 'guide', 'assets', 'package', 'readme'];

const row = (page: Page, id: string) => page.locator(`[data-testid="tree-root"] [data-id="${id}"]`);
const structure = (page: Page) => page.getByTestId('tree');
const projected = (page: Page) => page.getByTestId('projected');
const overlay = (page: Page) => page.locator('[data-dnd-overlay]');
const rowOrder = (page: Page) =>
  page
    .locator('[data-testid="tree-root"] > [data-id]')
    .evaluateAll((elements) => elements.map((element) => (element as HTMLElement).dataset.id));

const select = async (page: Page, ...ids: string[]) => {
  for (const id of ids) await row(page, id).click({ modifiers: ['ControlOrMeta'] });
};

/** A point in a row: `yRatio` of its height, `dx` px right of its center. */
const at = async (page: Page, id: string, yRatio = 0.5, dx = 0): Promise<Point> => {
  const point = await center(row(page, id), yRatio);
  return { x: point.x + dx, y: point.y };
};

/** Presses on a row and moves past the activation distance. */
const pick = async (page: Page, id: string): Promise<Point> => {
  const start = await center(row(page, id));
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 6, { steps: 2 });
  await expect(overlay(page)).toHaveCount(1);
  return start;
};

const glide = (page: Page, to: Point, steps = 25) => page.mouse.move(to.x, to.y, { steps });

/** Placeholders outside the overlay in DOM order, and whether they are siblings in one run. */
const placeholders = (page: Page) =>
  page.evaluate(() => {
    const marked = [...document.querySelectorAll('[data-dnd-placeholder]')].filter((element) => !element.closest('[data-dnd-overlay]'));
    const contiguous = marked.every((element, index) => index === 0 || element.previousElementSibling === marked[index - 1]);
    return { ids: marked.map((element) => element.getAttribute('data-id')), contiguous };
  });

/** Ids of the clones in the overlay's column (not the grabbed one, which fills the box). */
const columnIds = (page: Page) =>
  overlay(page)
    .locator('[data-dnd-overlay-item] [data-id]')
    .evaluateAll((clones) => clones.map((clone) => clone.getAttribute('data-id')));

/** Fails the test on page errors, console errors and Vue warnings. */
const guard = (page: Page) => {
  const errors = trackErrors(page);
  const warnings = trackVueWarnings(page);
  return () => {
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  };
};

type Frame = Record<string, string | number | null>;
type Landing = { id: string | null; frames: Frame[] };
type AnimationLog = { box: Frame[] | null; items: Landing[]; rows: string[] };
type WatchWindow = Window & { __animations?: AnimationLog; __animationWatch?: boolean };

/**
 * Records the keyframes of the overlay box's animation and of each clone in its column
 * (they animate relative to the box): the gather at pickup, the landing at the drop. Also
 * the tree rows a layout animation (`translate`) slid. Hooking `animate()` can't miss a
 * short animation that ends before a poll of `getAnimations()` would start on a loaded
 * browser.
 */
const watchAnimations = async (page: Page) => {
  await page.evaluate(() => {
    const win = window as WatchWindow;
    win.__animations = { box: null, items: [], rows: [] };
    if (win.__animationWatch) return;
    win.__animationWatch = true;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (this: Element, keyframes, options) {
      const frames = (Array.isArray(keyframes) ? keyframes : [keyframes]) as Frame[];
      const log = win.__animations;
      if (log && keyframes) {
        if (this.hasAttribute('data-dnd-overlay')) log.box = frames;
        else if (this.hasAttribute('data-dnd-overlay-item')) {
          log.items.push({ id: this.querySelector('[data-id]')?.getAttribute('data-id') ?? null, frames });
        } else if (this.closest('[data-testid="tree-root"]') && frames[0] && 'translate' in frames[0]) {
          log.rows.push(this.getAttribute('data-id') ?? '');
        }
      }
      return animate.call(this, keyframes, options);
    };
  });
  return {
    items: () => page.evaluate(() => (window as WatchWindow).__animations!.items),
    rows: () => page.evaluate(() => (window as WatchWindow).__animations!.rows),
    landings: async () => {
      await page.waitForFunction(() => (window as WatchWindow).__animations?.box);
      return page.evaluate(() => (window as WatchWindow).__animations!);
    },
  };
};

const numbers = (value: unknown) => [...String(value).matchAll(/-?[\d.]+(?=px)/g)].map((match) => Number(match[0]));

/** Every clone ended exactly on its row's final rect (the box's final translate plus its own). */
const expectLanded = async (page: Page, log: AnimationLog, ids: string[]) => {
  const [boxX = 0, boxY = 0] = numbers(log.box!.at(-1)!.transform);
  const landed = log.items.map(({ id, frames }) => {
    const last = frames.at(-1)!;
    const [x = 0, y = 0] = numbers(last.transform);
    return { id, x: boxX + x, y: boxY + y, width: parseFloat(String(last.width)), height: parseFloat(String(last.height)) };
  });
  expect(landed.map((rect) => rect.id).sort()).toEqual([...ids].sort());
  await layoutSettled(page);
  for (const rect of landed) {
    const box = (await row(page, rect.id!).boundingBox())!;
    expect(Math.abs(rect.x - box.x), `${rect.id} x`).toBeLessThan(1.5);
    expect(Math.abs(rect.y - box.y), `${rect.id} y`).toBeLessThan(1.5);
    expect(Math.abs(rect.width - box.width), `${rect.id} width`).toBeLessThan(1.5);
    expect(Math.abs(rect.height - box.height), `${rect.id} height`).toBeLessThan(1.5);
  }
};

test.describe('tree multi-drag', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#tree-multi');
    await expect(structure(page)).toHaveText(INITIAL);
  });

  test('on pickup the selected rows travel into a block at the grabbed one; the overlay gathers them in a column', async ({ page }) => {
    const check = guard(page);
    await select(page, 'main', 'package');
    const animations = await watchAnimations(page);
    await pick(page, 'package');
    // main slides down next to package (the same element, FLIP), in document order.
    await expect.poll(() => animations.rows()).toContain('main');
    await expect.poll(() => rowOrder(page)).toEqual([...ROWS.slice(0, 4), ...ROWS.slice(5, 9), 'main', 'package', 'readme']);
    expect(await placeholders(page)).toEqual({ ids: ['main', 'package'], contiguous: true });
    expect(await columnIds(page)).toEqual(['main']);
    // The block takes the grabbed node's level.
    await expect(row(page, 'main')).toHaveAttribute('data-depth', '0');
    // main's clone gathered into the column from where main was: above, one level in.
    const [gather] = (await animations.items()).filter((item) => item.id === 'main');
    const [x = 0, y = 0] = numbers(gather!.frames[0]!.transform);
    expect(y).toBeLessThan(-100);
    expect(Math.abs(x)).toBeLessThan(1);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui,button)),docs(intro,guide),assets,main,package,readme');
    await expect(page.getByTestId('drop')).toHaveText('main+package -> root[3]');
    check();
  });

  test('the block moves as one and every clone lands on its own row', async ({ page }) => {
    const check = guard(page);
    await select(page, 'ui', 'main', 'package');
    await pick(page, 'package');
    await layoutSettled(page);
    // Up to the top: the whole block goes before src, at the root level.
    await glide(page, await at(page, 'src', 0.1));
    await layoutSettled(page);
    await expect.poll(() => rowOrder(page)).toEqual(['ui', 'main', 'package', 'src', 'components', 'button', 'docs', 'intro', 'guide', 'assets', 'readme']);
    await expect(projected(page)).toHaveText('0:root');
    expect(await placeholders(page)).toEqual({ ids: ['ui', 'main', 'package'], contiguous: true });
    const animations = await watchAnimations(page);
    await page.mouse.up();
    const log = await animations.landings();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('ui,main,package,src(components(button)),docs(intro,guide),assets,readme');
    await expectLanded(page, log, ['ui', 'main']);
    check();
  });

  test('cancel puts every row back and the clones fly home', async ({ page }) => {
    const check = guard(page);
    await select(page, 'main', 'readme');
    await pick(page, 'readme');
    await layoutSettled(page);
    await glide(page, await at(page, 'docs', 0.2, 30));
    await expect.poll(() => rowOrder(page)).not.toEqual(ROWS);
    const animations = await watchAnimations(page);
    await page.keyboard.press('Escape');
    const log = await animations.landings();
    await waitForIdle(page);
    await page.mouse.up();
    await expect(structure(page)).toHaveText(INITIAL);
    expect(await rowOrder(page)).toEqual(ROWS);
    await expect(row(page, 'main')).toHaveAttribute('data-depth', '1');
    await expectLanded(page, log, ['main']);
    await expect(page.getByTestId('drop')).toHaveText('');
    check();
  });

  test('maxDepth counts the deepest descendant of the whole block', async ({ page }) => {
    const check = guard(page);
    // docs/ has children: inside components/ they would be at depth 3 > 2, so the block stops above main.ts.
    await select(page, 'docs', 'readme');
    await pick(page, 'readme');
    await expect(row(page, 'intro')).toHaveCount(0);
    await layoutSettled(page);
    await glide(page, await at(page, 'components', 0.6), 40);
    await expect(projected(page)).toHaveText('1:src');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),docs(intro,guide),readme,main),assets,package');
    check();
  });

  test('canNest has to take every node of the block', async ({ page }) => {
    const check = guard(page);
    // docs/ takes only Markdown: package.json in the block keeps it out of docs/.
    await select(page, 'package', 'readme');
    await pick(page, 'readme');
    await layoutSettled(page);
    await glide(page, await at(page, 'docs', 0.5));
    await expect(projected(page)).not.toHaveText(/:docs$/);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    // README.md alone goes in.
    await select(page, 'package');
    await pick(page, 'readme');
    await glide(page, await at(page, 'docs', 0.5));
    await expect(projected(page)).toHaveText('1:docs');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(readme,intro,guide),assets,package');
    check();
  });

  test('a selected node inside a selected folder rides along in its subtree', async ({ page }) => {
    const check = guard(page);
    await select(page, 'src', 'main');
    await pick(page, 'src');
    // src carries main with the rest of its subtree: no column, main isn't dragged on its own.
    await expect(row(page, 'main')).toHaveCount(0);
    expect(await columnIds(page)).toEqual([]);
    await layoutSettled(page);
    const readme = (await row(page, 'readme').boundingBox())!;
    await glide(page, { x: readme.x + readme.width / 2, y: readme.y + readme.height + 6 });
    await page.mouse.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('docs(intro,guide),assets,package,readme,src(components(ui,button),main)');
    await expect(page.getByTestId('drop')).toHaveText('src -> root[4]');
    check();
  });

  test('a grabbed node inside a selected folder stays in it: the folder moves with its subtree (VS Code)', async ({ page }) => {
    const check = guard(page);
    await select(page, 'components', 'button');
    await pick(page, 'button');
    // components carries button (and ui): its subtree leaves the rows, components is the placeholder.
    await expect(row(page, 'button')).toHaveCount(0);
    await expect(row(page, 'ui')).toHaveCount(0);
    expect(await placeholders(page)).toEqual({ ids: ['components'], contiguous: true });
    // The grabbed row stays in the overlay's box under the pointer; components shows above it.
    expect(await columnIds(page)).toEqual(['components']);
    const box = (await overlay(page).locator('[data-id="button"]').boundingBox())!;
    const lead = (await overlay(page).locator('[data-dnd-overlay-item] [data-id="components"]').boundingBox())!;
    expect(lead.y + lead.height).toBeLessThanOrEqual(box.y + 1);
    await layoutSettled(page);
    // The pointer a row into readme: components, a row above it, goes before package.json, inside assets/.
    await glide(page, await at(page, 'readme', 0.2));
    await expect(projected(page)).toHaveText('1:assets');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(main),docs(intro,guide),assets(components(ui,button)),package,readme');
    await expect(page.getByTestId('drop')).toHaveText('components -> assets[0]');
    await expect(row(page, 'button')).toHaveAttribute('data-depth', '2');
    check();
  });

  test('the block leaves for a list with its subtrees, in document order', async ({ page }) => {
    const check = guard(page);
    await select(page, 'components', 'package');
    await pick(page, 'package');
    await layoutSettled(page);
    await glide(page, await center(page.getByTestId('clipboard-list'), 0.9), 30);
    await expect(projected(page)).toHaveText('');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(main),docs(intro,guide),assets,readme');
    // The block lines up with the overlay's column: package at the pointer, components above it.
    await expect(page.getByTestId('clipboard')).toHaveText('components(ui,button),package,notes');
    check();
  });
});
