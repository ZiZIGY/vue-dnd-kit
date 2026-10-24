import { expect, test, type Page } from '@playwright/test';
import { trackErrors } from './helpers';
import { at, byId, byTestId, ctrlClick, drag, hold, settled } from './app-helpers';

const TREE = 'documents(invoices,contracts),photos(trips),projects(website),archive';
const files = (page: Page) => page.getByTestId('fs-files');
/** `folder:file,file` line of the data dump. */
const folder = (id: string, ...ids: string[]) => new RegExp(`^${id}:${ids.join(',')}$`, 'm');
const summary = (page: Page) => page.getByTestId('fs-summary');
const row = (page: Page, id: string) => byId(page, id).and(page.locator('.fm-row'));

test.describe('app: file manager', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = trackErrors(page);
    await page.goto('/#app-files');
    await expect(page.getByTestId('fs-tree')).toHaveText(TREE);
    await expect(files(page)).toContainText(folder('documents', 'cv', 'budget', 'notes', 'report', 'slides', 'letter', 'plan'));
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
  });

  test('a rubber band selects files that then move together onto a tree folder', async ({ page }) => {
    // From the empty space above-left of the first file to the middle of the third.
    const cv = (await byId(page, 'cv').boundingBox())!;
    await drag(page, { x: cv.x - 8, y: cv.y - 8 }, await at(byId(page, 'notes'), 0.5, 0.6), 8);
    await expect(summary(page)).toHaveText('7 files · 3 selected');
    await expect(page.locator('.fm-file[data-selected]')).toHaveCount(3);

    await hold(page, byId(page, 'budget'), await at(row(page, 'archive'), 0.5, 0.5));
    await expect(row(page, 'archive')).toHaveAttribute('data-target');
    await page.mouse.up();
    await settled(page);
    await expect(files(page)).toContainText(folder('archive', 'cv', 'budget', 'notes'));
    await expect(files(page)).toContainText(folder('documents', 'report', 'slides', 'letter', 'plan'));
    await expect(page.getByTestId('fs-last')).toHaveText('Moved 3 files to Archive');
    await expect(summary(page)).toHaveText('4 files');
  });

  test('Ctrl/Cmd+click adds files to the selection; a breadcrumb takes them', async ({ page }) => {
    await byId(page, 'cv').click();
    await ctrlClick(byId(page, 'plan'));
    await expect(summary(page)).toHaveText('7 files · 2 selected');
    await hold(page, byId(page, 'plan'), await at(byTestId(page, 'crumb-home'), 0.5, 0.5));
    await expect(byTestId(page, 'crumb-home')).toHaveAttribute('data-target');
    await page.mouse.up();
    await settled(page);
    await expect(files(page)).toContainText(folder('home', 'readme', 'cv', 'plan'));
    await expect(files(page)).toContainText(folder('documents', 'budget', 'notes', 'report', 'slides', 'letter'));

    await byTestId(page, 'crumb-home').click();
    await expect(page.getByTestId('crumb-current')).toHaveText('Home');
    await expect(page.getByTestId('file-grid').locator('[data-id]')).toHaveText([/README/, /cv/, /plan/]);
  });

  test('files reorder inside the grid (strategy: grid)', async ({ page }) => {
    await drag(page, byId(page, 'cv'), await at(byId(page, 'plan'), 0.6, 0.6));
    await settled(page);
    await expect(files(page)).toContainText(folder('documents', 'budget', 'notes', 'report', 'slides', 'letter', 'plan', 'cv'));
    // Back up onto the third file: along the empty rest of the second row, then straight up
    // (a diagonal would pass over "notes" first).
    const report = await at(byId(page, 'report'), 0.4, 0.6);
    const below = await at(byId(page, 'cv'), 0.5, 0.5);
    await drag(page, byId(page, 'cv'), [{ x: report.x, y: below.y }, report]);
    await settled(page);
    await expect(files(page)).toContainText(folder('documents', 'budget', 'notes', 'cv', 'report', 'slides', 'letter', 'plan'));
  });

  test('opening a folder clears the selection; folder tiles take files too', async ({ page }) => {
    await ctrlClick(byId(page, 'cv'), byId(page, 'notes'));
    await expect(summary(page)).toHaveText('7 files · 2 selected');
    await row(page, 'photos').click();
    await expect(page.getByTestId('crumb-current')).toHaveText('Photos');
    await expect(summary(page)).toHaveText('3 files');

    await drag(page, byId(page, 'beach'), await at(byTestId(page, 'tile-trips'), 0.5, 0.5));
    await settled(page);
    await expect(files(page)).toContainText(folder('trips', 'alps', 'beach'));
    await expect(files(page)).toContainText(folder('photos', 'sunset', 'cat'));
    await expect(row(page, 'trips').locator('.fm-count')).toHaveText('2');
  });

  test('the open folder does not take its own files', async ({ page }) => {
    await hold(page, byId(page, 'cv'), await at(row(page, 'documents'), 0.5, 0.5));
    await expect(row(page, 'documents')).not.toHaveAttribute('data-target');
    // Other folders accept meanwhile.
    await expect(row(page, 'invoices')).toHaveClass(/accepting/);
    await page.mouse.up();
    await settled(page);
    await expect(files(page)).toContainText(folder('documents', 'cv', 'budget', 'notes', 'report', 'slides', 'letter', 'plan'));
  });

  test('folders are reorganized in the tree, without file targets in the way', async ({ page }) => {
    // Up to the upper part of "Photos" at the same level: Archive goes before it.
    await hold(page, row(page, 'archive'), await at(row(page, 'photos'), 0.3, 0.2));
    await expect(page.locator('[data-target]')).toHaveCount(0);
    await page.mouse.up();
    await settled(page);
    await expect(page.getByTestId('fs-tree')).toHaveText(
      'documents(invoices,contracts),archive,photos(trips),projects(website)',
    );
    // Into the middle of "Projects": Archive becomes its first child.
    await drag(page, row(page, 'archive'), await at(row(page, 'projects'), 0.3, 0.5));
    await settled(page);
    await expect(page.getByTestId('fs-tree')).toHaveText(
      'documents(invoices,contracts),photos(trips),projects(archive,website)',
    );
    await expect(row(page, 'archive')).toHaveAttribute('data-depth', '1');
    await expect(page.getByTestId('fs-last')).toHaveText('Moved folder Archive into Projects');
  });
});
