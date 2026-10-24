import { expect, test, type Page } from '@playwright/test';
import { center, trackErrors, waitForIdle, type Point } from './helpers';

// Visible rows: src(0) components(1) ui(2) button(2) main(1) docs(0, collapsed) assets(0) package(0) readme(0).
// maxDepth is 2 and only folders take children.
const INITIAL = 'src(components(ui,button),main),docs(intro,guide),assets,package,readme';
const ROWS = ['src', 'components', 'ui', 'button', 'main', 'docs', 'assets', 'package', 'readme'];

const row = (page: Page, id: string) => page.locator(`[data-testid="tree-root"] [data-id="${id}"]`);
const structure = (page: Page) => page.getByTestId('tree');
const projected = (page: Page) => page.getByTestId('projected');
const rowOrder = (page: Page) =>
  page
    .locator('[data-testid="tree-root"] [data-id]')
    .evaluateAll((elements) => elements.map((element) => (element as HTMLElement).dataset.id));

/** A point in a row: `yRatio` of its height, `dx` px right of its center. */
const at = async (page: Page, id: string, yRatio = 0.5, dx = 0): Promise<Point> => {
  const point = await center(row(page, id), yRatio);
  return { x: point.x + dx, y: point.y };
};

/** Presses on a row and moves past the activation distance; returns the press point. */
const pick = async (page: Page, id: string): Promise<Point> => {
  const start = await center(row(page, id));
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 6, { steps: 2 });
  await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
  return start;
};

const glide = (page: Page, to: Point, steps = 25) => page.mouse.move(to.x, to.y, { steps });

const drop = async (page: Page) => {
  await page.mouse.up();
  await waitForIdle(page);
};

/** Waits for FLIP animations, so measured rects are final. */
const settle = (page: Page) =>
  page.waitForFunction(() => document.getAnimations().every((animation) => animation.playState !== 'running'));

test.describe('sortable tree', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#tree');
    await expect(structure(page)).toHaveText(INITIAL);
  });

  test('sorts among siblings', async ({ page }) => {
    const errors = trackErrors(page);
    const target = await at(page, 'package', 0.2);
    await pick(page, 'readme');
    await glide(page, target);
    await expect(row(page, 'readme')).toHaveAttribute('data-depth', '0');
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets,readme,package');
    // Indices are among siblings, not in the flat list.
    await expect(page.getByTestId('drop')).toHaveText('readme tree:root[4] -> root[3]');
    expect(errors).toEqual([]);
  });

  test('nests into a folder by horizontal offset', async ({ page }) => {
    const errors = trackErrors(page);
    const start = await pick(page, 'package');
    await glide(page, { x: start.x + 34, y: start.y });
    await expect(projected(page)).toHaveText('1:assets');
    await expect(row(page, 'package')).toHaveAttribute('data-depth', '1');
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets(package),readme');
    await expect(page.getByTestId('drop')).toHaveText('package tree:root[3] -> assets[0]');
    expect(errors).toEqual([]);
  });

  test('nests into a folder by hovering the middle of its row', async ({ page }) => {
    const target = await at(page, 'assets', 0.5);
    await pick(page, 'readme');
    await glide(page, target);
    await expect(projected(page)).toHaveText('1:assets');
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets(readme),package');
    await expect(page.getByTestId('drop')).toHaveText('readme tree:root[4] -> assets[0]');
  });

  test('hovering an expanded folder makes the node its first child', async ({ page }) => {
    const target = await at(page, 'components', 0.5);
    await pick(page, 'package');
    await glide(page, target, 40);
    await expect(projected(page)).toHaveText('2:components');
    await drop(page);
    await expect(structure(page)).toHaveText(
      'src(components(package,ui,button),main),docs(intro,guide),assets,readme',
    );
  });

  test('un-nests by moving left', async ({ page }) => {
    const start = await pick(page, 'main');
    await glide(page, { x: start.x - 34, y: start.y });
    await expect(projected(page)).toHaveText('0:root');
    await expect(row(page, 'main')).toHaveAttribute('data-depth', '0');
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,button)),main,docs(intro,guide),assets,package,readme');
    await expect(page.getByTestId('drop')).toHaveText('main tree:src[1] -> root[1]');
  });

  test('respects canNest: files take no children', async ({ page }) => {
    const start = await pick(page, 'readme');
    // Right of package.json the offset asks for depth 1, but its parent would be a file.
    await glide(page, { x: start.x + 60, y: start.y });
    await expect(projected(page)).toHaveText('0:root');
    // The middle of a file sorts instead of nesting.
    await glide(page, await at(page, 'package', 0.4));
    await expect(projected(page)).toHaveText('0:root');
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets,readme,package');
  });

  test('respects maxDepth by hover and by offset', async ({ page }) => {
    // ui/ is at depth 2 = maxDepth: hovering its middle 60px to the right still can't go inside.
    const target = await at(page, 'ui', 0.6, 60);
    await pick(page, 'readme');
    await glide(page, target, 40);
    await expect(projected(page)).toHaveText('2:components');
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,readme,button),main),docs(intro,guide),assets,package');
  });

  test('maxDepth counts the descendants of the dragged folder', async ({ page }) => {
    // docs/ has children: inside components/ they would be at depth 3, so it stops above main.ts.
    // 0.6, not 0.5: the exact center is the sort boundary and subpixel layout differs per browser.
    const target = await at(page, 'components', 0.6);
    await pick(page, 'docs');
    await glide(page, target, 40);
    await expect(projected(page)).toHaveText('1:src');
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),docs(intro,guide),main),assets,package,readme');
  });

  test('a collapsed folder keeps its hidden children', async ({ page }) => {
    const target = await at(page, 'docs', 0.5);
    await pick(page, 'readme');
    await glide(page, target, 30);
    await expect(projected(page)).toHaveText('1:docs');
    await drop(page);
    // Dropped as the first child; the folder stays collapsed, so the row is hidden.
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(readme,intro,guide),assets,package');
    await expect(row(page, 'readme')).toHaveCount(0);
    await page.locator('[data-toggle="docs"]').click();
    await expect(row(page, 'readme')).toHaveAttribute('data-depth', '1');
    expect(await rowOrder(page)).toEqual([
      'src', 'components', 'ui', 'button', 'main', 'docs', 'readme', 'intro', 'guide', 'assets', 'package',
    ]);
  });

  test('dragging a folder carries its subtree', async ({ page }) => {
    const errors = trackErrors(page);
    await pick(page, 'components');
    // The descendants travel with the folder: their rows leave the list during the drag.
    await expect(row(page, 'ui')).toHaveCount(0);
    await expect(row(page, 'button')).toHaveCount(0);
    await settle(page);
    await glide(page, await at(page, 'package', 0.15, -34), 40);
    await expect(projected(page)).toHaveText('0:root');
    await drop(page);
    await expect(structure(page)).toHaveText('src(main),docs(intro,guide),assets,components(ui,button),package,readme');
    await expect(row(page, 'ui')).toHaveAttribute('data-depth', '1');
    expect(errors).toEqual([]);
  });

  test('Escape restores the tree, the depths and the hidden descendants', async ({ page }) => {
    const start = await pick(page, 'components');
    await settle(page);
    await glide(page, { ...(await at(page, 'assets', 0.5)), x: start.x - 34 }, 30);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(structure(page)).toHaveText(INITIAL);
    await expect(projected(page)).toHaveText('');
    expect(await rowOrder(page)).toEqual(ROWS);
    await expect(row(page, 'components')).toHaveAttribute('data-depth', '1');
    await expect(row(page, 'ui')).toHaveAttribute('data-depth', '2');
  });

  test('a rejected drop restores the tree', async ({ page }) => {
    await page.getByTestId('reject').check();
    const start = await pick(page, 'package');
    await glide(page, { x: start.x + 34, y: start.y });
    await expect(projected(page)).toHaveText('1:assets');
    await drop(page);
    await expect(structure(page)).toHaveText(INITIAL);
    await expect(row(page, 'package')).toHaveAttribute('data-depth', '0');
    await expect(projected(page)).toHaveText('');
    await expect(page.getByTestId('drop')).toHaveText('');
  });

  test("nesting 'hover': the offset is ignored, rows decide the level", async ({ page }) => {
    await page.getByTestId('nesting-hover').check();
    const start = await pick(page, 'package');
    await glide(page, { x: start.x + 60, y: start.y });
    await expect(projected(page)).toHaveText('0:root');
    await glide(page, await at(page, 'assets', 0.5), 10);
    await expect(projected(page)).toHaveText('1:assets');
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets(package),readme');
  });

  test("nesting 'hover': the edge band of the next row un-nests", async ({ page }) => {
    await page.getByTestId('nesting-hover').check();
    const target = await at(page, 'docs', 0.15);
    await pick(page, 'main');
    await glide(page, target, 10);
    await expect(projected(page)).toHaveText('0:root');
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,button)),main,docs(intro,guide),assets,package,readme');
  });

  test("nesting 'offset': hovering the middle of a folder does not nest", async ({ page }) => {
    await page.getByTestId('nesting-offset').check();
    const target = await at(page, 'assets', 0.6);
    await pick(page, 'readme');
    await glide(page, target);
    await expect(projected(page)).toHaveText('0:root');
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets,readme,package');
  });

  test('keyboard: up/down move by rows, right nests', async ({ page }) => {
    const errors = trackErrors(page);
    await row(page, 'readme').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    // package.json is a file: no level to the right.
    await page.keyboard.press('ArrowRight');
    await expect(projected(page)).toHaveText('0:root');
    await page.keyboard.press('ArrowUp');
    await expect.poll(() => rowOrder(page)).toEqual([...ROWS.slice(0, 7), 'readme', 'package']);
    await page.keyboard.press('ArrowRight');
    await expect(projected(page)).toHaveText('1:assets');
    await expect(row(page, 'readme')).toHaveAttribute('data-depth', '1');
    await page.keyboard.press('Space');
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets(readme),package');
    await expect(row(page, 'readme')).toBeFocused();
    expect(errors).toEqual([]);
  });

  test('keyboard: the level follows the new neighbours, left un-nests', async ({ page }) => {
    await row(page, 'button').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await page.keyboard.press('ArrowDown');
    // Below main.ts (a file) the deepest level left is a child of src/.
    await expect(projected(page)).toHaveText('1:src');
    await page.keyboard.press('ArrowLeft');
    await expect(projected(page)).toHaveText('0:root');
    await page.keyboard.press('Enter');
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui),main),button,docs(intro,guide),assets,package,readme');
  });

  test('keyboard: Escape restores', async ({ page }) => {
    await row(page, 'main').focus();
    await page.keyboard.press('Space');
    await page.keyboard.press('ArrowLeft');
    await expect(projected(page)).toHaveText('0:root');
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => rowOrder(page)).not.toEqual(ROWS);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await expect(structure(page)).toHaveText(INITIAL);
    expect(await rowOrder(page)).toEqual(ROWS);
  });
});

test.describe('sortable tree and a list in one group', () => {
  const clipboard = (page: Page) => page.getByTestId('clipboard');
  const clipped = (page: Page, id: string) => page.locator(`[data-testid="clipboard-list"] [data-id="${id}"]`);

  /** Picks notes.txt from the clipboard (left of the tree) and enters the tree over package.json. */
  const enterTree = async (page: Page) => {
    const from = await center(clipped(page, 'notes'));
    const entry = await at(page, 'package', 0.3);
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(from.x, from.y + 6, { steps: 2 });
    await glide(page, entry, 30);
    await expect(row(page, 'notes')).toHaveCount(1);
    // Rows below the entry point moved down: measure targets after the layout settled.
    await settle(page);
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/#tree');
    await expect(structure(page)).toHaveText(INITIAL);
    await expect(clipboard(page)).toHaveText('notes');
  });

  test('a list item nests into a hovered folder', async ({ page }) => {
    const errors = trackErrors(page);
    await enterTree(page);
    await glide(page, await at(page, 'assets', 0.5), 10);
    await expect(projected(page)).toHaveText('1:assets');
    await drop(page);
    await expect(structure(page)).toHaveText(
      'src(components(ui,button),main),docs(intro,guide),assets(notes),package,readme',
    );
    await expect(clipboard(page)).toHaveText('');
    await expect(page.getByTestId('drop')).toHaveText('notes clipboard:root[0] -> assets[0]');
    expect(errors).toEqual([]);
  });

  test('the offset from the other list does not push the item deep', async ({ page }) => {
    // The clipboard is on the left: the drag offset is several indentations to the right.
    await enterTree(page);
    await glide(page, await at(page, 'docs', 0.15), 15);
    await expect(projected(page)).toHaveText('0:root');
    await drop(page);
    await expect(structure(page)).toHaveText(
      'src(components(ui,button),main),notes,docs(intro,guide),assets,package,readme',
    );
  });

  test('a folder leaves the tree for the list with its subtree', async ({ page }) => {
    await pick(page, 'components');
    await glide(page, await center(page.getByTestId('clipboard-list'), 0.9), 30);
    await expect(projected(page)).toHaveText('');
    await drop(page);
    await expect(structure(page)).toHaveText('src(main),docs(intro,guide),assets,package,readme');
    await expect(clipboard(page)).toHaveText('notes,components(ui,button)');
  });

  test('Escape after entering the tree restores both', async ({ page }) => {
    await enterTree(page);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(structure(page)).toHaveText(INITIAL);
    await expect(clipboard(page)).toHaveText('notes');
  });
});
