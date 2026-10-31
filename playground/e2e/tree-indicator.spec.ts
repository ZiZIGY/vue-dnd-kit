import { expect, test, type Page } from '@playwright/test';
import { center, frames, trackErrors, trackVueWarnings, waitForIdle, type Point } from './helpers';

/**
 * `placeholder: 'indicator'` on a tree: the rows never move; `indicator` (on the tree and
 * on each row) says where the drop goes, with its depth and parent, and the row draws
 * the line itself, from the indentation of that depth (TreeLineRow).
 */

// Visible rows: src(0) components(1) ui(2) button(2) main(1) docs(0, collapsed) assets(0) package(0) readme(0).
const INITIAL = 'src(components(ui,button),main),docs(intro,guide),assets,package,readme';
const ROWS = ['src', 'components', 'ui', 'button', 'main', 'docs', 'assets', 'package', 'readme'];
const INDENTATION = 24;

const row = (page: Page, id: string) => page.locator(`[data-testid="tree-root"] [data-id="${id}"]`);
const structure = (page: Page) => page.getByTestId('tree');
const line = (page: Page) => page.getByTestId('line');
const lines = (page: Page) => page.locator('[data-testid="tree-root"] [data-drop-line]');
const rowOrder = (page: Page) =>
  page
    .locator('[data-testid="tree-root"] > [data-id]')
    .evaluateAll((elements) => elements.map((element) => (element as HTMLElement).dataset.id));
const inboxOrder = (page: Page) =>
  page
    .locator('[data-testid="inbox-list"] > [data-id]')
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

const glide = (page: Page, to: Point, steps = 20) => page.mouse.move(to.x, to.y, { steps });

const drop = async (page: Page) => {
  await page.mouse.up();
  await waitForIdle(page);
};

/** Presses `key`, letting the async keyboard move and the frame run. */
const press = async (page: Page, key: string) => {
  await page.keyboard.press(key);
  await frames(page, 2);
};

/** Fails the test on page errors, console errors and Vue warnings. */
const guard = (page: Page) => {
  const errors = trackErrors(page);
  const warnings = trackVueWarnings(page);
  return () => {
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  };
};

/** The line drawn in a row: its side, depth, parent and left offset in the row. */
const drawnLine = (page: Page, id: string) =>
  row(page, id).evaluate((element) => {
    const drawn = element.querySelector<HTMLElement>('[data-drop-line]');
    if (!drawn) return null;
    return {
      side: drawn.dataset.side,
      depth: Number(drawn.dataset.depth),
      parent: drawn.dataset.parent,
      left: Math.round(drawn.getBoundingClientRect().left - element.getBoundingClientRect().left - element.clientLeft),
    };
  });

test.describe("tree placeholder: 'indicator'", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#tree-indicator');
    await expect(structure(page)).toHaveText(INITIAL);
  });

  test('the tree does not move; the line starts at the indentation of the drop level', async ({ page }) => {
    const check = guard(page);
    const start = await pick(page, 'readme');
    await glide(page, { ...(await at(page, 'main', 0.85)), x: start.x + INDENTATION + 4 });
    // After main.ts, one level in from README.md's: a child of src/.
    await expect(line(page)).toHaveText('after:main:1:src');
    expect(await drawnLine(page, 'main')).toEqual({ side: 'after', depth: 1, parent: 'src', left: 8 + INDENTATION });
    expect(await rowOrder(page)).toEqual(ROWS);
    await expect(row(page, 'readme')).toHaveAttribute('data-dnd-placeholder', '');
    // Back left: the root level.
    await glide(page, { ...(await at(page, 'main', 0.85)), x: start.x - 4 }, 5);
    await expect(line(page)).toHaveText('after:main:0:root');
    expect(await drawnLine(page, 'main')).toEqual({ side: 'after', depth: 0, parent: 'root', left: 8 });
    await expect(lines(page)).toHaveCount(1);
    await glide(page, { ...(await at(page, 'main', 0.85)), x: start.x + INDENTATION + 4 }, 5);
    await expect(line(page)).toHaveText('after:main:1:src');
    expect(await rowOrder(page)).toEqual(ROWS);
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main,readme),docs(intro,guide),assets,package');
    await expect(page.getByTestId('drop')).toHaveText('readme -> src[2]');
    check();
  });

  test('hovering the middle of a folder highlights it; the drop goes inside', async ({ page }) => {
    const check = guard(page);
    await pick(page, 'readme');
    await glide(page, await at(page, 'assets', 0.5));
    await expect(row(page, 'assets')).toHaveAttribute('data-into');
    await expect(line(page)).toHaveText('inside:assets:1:assets');
    // A highlight, no line.
    await expect(lines(page)).toHaveCount(0);
    // The top edge is before the folder again.
    await glide(page, await at(page, 'assets', 0.1), 5);
    await expect(row(page, 'assets')).not.toHaveAttribute('data-into');
    await expect(line(page)).toHaveText('before:assets:0:root');
    await glide(page, await at(page, 'assets', 0.5), 5);
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(intro,guide),assets(readme),package');
    await expect(page.getByTestId('drop')).toHaveText('readme -> assets[0]');
    check();
  });

  test("nesting 'hover': the line keeps the level of the row it is on", async ({ page }) => {
    await page.getByTestId('nesting-hover').check();
    const start = await pick(page, 'package');
    await glide(page, { ...(await at(page, 'button', 0.85)), x: start.x + 80 });
    await expect(line(page)).toHaveText('after:button:2:components');
    await glide(page, { ...(await at(page, 'button', 0.85)), x: start.x - 80 }, 5);
    await expect(line(page)).toHaveText('after:button:2:components');
    // The middle of a folder still means inside.
    await glide(page, await at(page, 'components', 0.5), 10);
    await expect(line(page)).toHaveText('inside:components:2:components');
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(package,ui,button),main),docs(intro,guide),assets,readme');
  });

  test('no line over the dragged node and its subtree; dropping there changes nothing', async ({ page }) => {
    const check = guard(page);
    await pick(page, 'src');
    // Nothing hides: the subtree stays where it is.
    expect(await rowOrder(page)).toEqual(ROWS);
    await glide(page, await at(page, 'components', 0.5));
    await expect(line(page)).toHaveText('');
    await expect(lines(page)).toHaveCount(0);
    await expect(page.locator('[data-into]')).toHaveCount(0);
    await drop(page);
    await expect(structure(page)).toHaveText(INITIAL);
    await expect(page.getByTestId('drop')).toHaveText('');
    check();
  });

  test('dropping outside cancels, and so does Escape', async ({ page }) => {
    await pick(page, 'readme');
    await glide(page, await at(page, 'assets', 0.5));
    await expect(line(page)).toHaveText('inside:assets:1:assets');
    await glide(page, { x: 1000, y: 500 });
    await expect(line(page)).toHaveText('');
    await drop(page);
    await expect(structure(page)).toHaveText(INITIAL);
    await expect(page.getByTestId('drop')).toHaveText('');

    await pick(page, 'package');
    await glide(page, await at(page, 'docs', 0.5));
    await expect(line(page)).toHaveText('inside:docs:1:docs');
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(structure(page)).toHaveText(INITIAL);
    await expect(page.getByTestId('drop')).toHaveText('');
  });

  test('several selected nodes land at the line in document order; the tree does not move', async ({ page }) => {
    const check = guard(page);
    await row(page, 'package').click({ modifiers: ['ControlOrMeta'] });
    await row(page, 'main').click({ modifiers: ['ControlOrMeta'] });
    await pick(page, 'package');
    expect(await rowOrder(page)).toEqual(ROWS);
    // The overlay shows both, in a column.
    await expect(page.locator('[data-dnd-overlay] [data-dnd-overlay-item]')).toHaveCount(1);
    await glide(page, await at(page, 'assets', 0.5));
    await expect(line(page)).toHaveText('inside:assets:1:assets');
    expect(await rowOrder(page)).toEqual(ROWS);
    await drop(page);
    await expect(structure(page)).toHaveText('src(components(ui,button)),docs(intro,guide),assets(main,package),readme');
    await expect(page.getByTestId('drop')).toHaveText('main+package -> assets[0]');
    check();
  });

  test('keyboard: up/down move the line through the gaps, left/right change its level', async ({ page }) => {
    const check = guard(page);
    await row(page, 'readme').focus();
    await press(page, 'Space');
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await press(page, 'ArrowUp');
    await expect(line(page)).toHaveText('before:package:0:root');
    await press(page, 'ArrowUp');
    await expect(line(page)).toHaveText('before:assets:0:root');
    // Right: into the collapsed docs/ above.
    await press(page, 'ArrowRight');
    await expect(line(page)).toHaveText('before:assets:1:docs');
    expect(await drawnLine(page, 'assets')).toMatchObject({ side: 'before', depth: 1, left: 8 + INDENTATION });
    expect(await rowOrder(page)).toEqual(ROWS);
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),main),docs(readme,intro,guide),assets,package');
    check();
  });

  test('keyboard: Right from the list takes only the line into the tree, at the level there', async ({ page }) => {
    const check = guard(page);
    const inbox = page.locator('[data-testid="inbox-list"] [data-id="logo"]');
    await inbox.focus();
    await press(page, 'Space');
    await press(page, 'ArrowRight');
    // Level with logo.svg (the third row): before Button.vue, its sibling.
    await expect(line(page)).toHaveText('before:button:2:components');
    expect(await rowOrder(page)).toEqual(ROWS);
    expect(await inboxOrder(page)).toEqual(['notes', 'todo', 'logo']);
    await press(page, 'ArrowDown');
    await expect(line(page)).toHaveText('before:main:2:components');
    await press(page, 'ArrowLeft');
    await expect(line(page)).toHaveText('before:main:1:src');
    expect(await rowOrder(page)).toEqual(ROWS);
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('src(components(ui,button),logo,main),docs(intro,guide),assets,package,readme');
    await expect(page.getByTestId('inbox')).toHaveText('notes,todo');
    check();
  });
});
