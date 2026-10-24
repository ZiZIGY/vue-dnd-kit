import { expect, test, type Page } from '@playwright/test';
import { item, trackErrors, waitForIdle } from './helpers';
import { longPress, touchscreen } from './touch-helpers';

// Rows: inbox(0) today(1) projects(0) app(1) design(2) site(1) archive(0) ideas(0) groceries(0).
// Indentation 32px, nesting by horizontal offset only, notes take no children.
const INITIAL = 'inbox(today),projects(app(design),site),archive,ideas,groceries';
const INDENTATION = 32;

const structure = (page: Page) => page.getByTestId('touch-tree-structure');
const projected = (page: Page) => page.getByTestId('touch-tree-projected');
const row = (page: Page, id: string) => item(page, id);

test.describe('touch: tree @touch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#touch-tree');
    await expect(structure(page)).toHaveText(INITIAL);
  });

  test('the tree fits a narrow screen', async ({ page }) => {
    const viewport = page.viewportSize()!;
    const deepest = (await row(page, 'design').boundingBox())!;
    expect(deepest.x + deepest.width).toBeLessThanOrEqual(viewport.width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
  });

  test('sliding right nests under the folder above', async ({ page }) => {
    const errors = trackErrors(page);
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, row(page, 'ideas'));
    await finger.moveBy(INDENTATION + 8, 0, { steps: 10 });
    await expect(projected(page)).toHaveText('1:archive');
    await expect(row(page, 'ideas')).toHaveAttribute('data-depth', '1');
    await finger.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('inbox(today),projects(app(design),site),archive(ideas),groceries');
    expect(errors).toEqual([]);
  });

  test('sliding two steps right nests two levels deep', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    // Below `site` (depth 1, empty folder): one step would make it a sibling of site, two a child.
    await longPress(page, finger, row(page, 'archive'));
    await finger.moveBy(2 * INDENTATION + 8, 0, { steps: 12 });
    await expect(projected(page)).toHaveText('2:site');
    await finger.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('inbox(today),projects(app(design),site(archive)),ideas,groceries');
  });

  test('sliding left moves out of the folder', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, row(page, 'today'));
    await finger.moveBy(-(INDENTATION + 8), 0, { steps: 10 });
    await expect(projected(page)).toHaveText('0:root');
    await finger.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('inbox,today,projects(app(design),site),archive,ideas,groceries');
  });

  test('notes take no children', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, row(page, 'groceries'));
    // Right of `ideas`, a note: the depth stays at the root.
    await finger.moveBy(INDENTATION + 8, 0, { steps: 10 });
    await expect(projected(page)).toHaveText('0:root');
    await finger.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText(INITIAL);
  });

  test('moving up a row and right in one gesture nests into the folder there', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, row(page, 'groceries'));
    const archive = (await row(page, 'archive').boundingBox())!;
    // Into the upper half of `archive`: the node goes before it, its parent would be `projects`.
    await finger.move({ x: finger.position.x + INDENTATION + 8, y: archive.y + archive.height * 0.25 }, { steps: 14 });
    await expect(projected(page)).toHaveText('1:projects');
    await finger.up();
    await waitForIdle(page);
    await expect(structure(page)).toHaveText('inbox(today),projects(app(design),site,groceries),archive,ideas');
  });
});
