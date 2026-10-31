import { expect, test, type Page } from '@playwright/test';
import { trackErrors, trackVueWarnings, watchDropAnimation } from './helpers';
import { at, byId, byTestId, ctrlClick, drag, glideTo, hold, press, settled } from './app-helpers';

const TREE = 'documents(invoices,contracts),photos(trips),projects(website),archive';
const DOCUMENTS = ['invoices/', 'contracts/', 'cv', 'budget', 'notes', 'report', 'slides', 'letter', 'plan'];
const files = (page: Page) => page.getByTestId('fs-files');
const tree = (page: Page) => page.getByTestId('fs-tree');
/** `folder:entry,folder/,…` line of the data dump (sub-folders end with `/`). */
const folder = (id: string, ...ids: string[]) => new RegExp(`^${id}:${ids.join(',')}$`, 'm');
const summary = (page: Page) => page.getByTestId('fs-summary');
const row = (page: Page, id: string) => byId(page, id).and(page.locator('.fm-row'));
const tile = (page: Page, id: string) => byId(page, id).and(page.locator('.fm-file'));
/** The live region (the app has a provider of its own, beside the playground's) that says `text`. */
const announced = (page: Page, text: string) => page.locator('[role="status"][aria-live]').filter({ hasText: text });

test.describe('app: file manager', () => {
  let errors: string[];
  let warnings: string[];

  test.beforeEach(async ({ page }) => {
    errors = trackErrors(page);
    warnings = trackVueWarnings(page);
    await page.goto('/demo/#app-files');
    await expect(tree(page)).toHaveText(TREE);
    await expect(files(page)).toContainText(folder('documents', ...DOCUMENTS));
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  test('a rubber band selects files that then move together onto a tree folder', async ({ page }) => {
    // From the gap left of the first file (past the folders) to the middle of the third.
    const cv = (await tile(page, 'cv').boundingBox())!;
    await drag(page, { x: cv.x - 8, y: cv.y - 8 }, await at(tile(page, 'notes'), 0.5, 0.6), 8);
    await expect(summary(page)).toHaveText('2 folders, 7 files · 3 selected');
    await expect(page.locator('.fm-file[data-selected]')).toHaveCount(3);

    await hold(page, tile(page, 'budget'), await at(row(page, 'archive'), 0.5, 0.5));
    await expect(row(page, 'archive')).toHaveAttribute('data-target');
    // In a grid the overlay is a pile: the grabbed file on top, the others turned behind
    // it, the whole count on it (a row of tiles would cover the page).
    await expect(page.locator('[data-dnd-overlay] > div > span')).toHaveText('3');
    const behind = page.locator('[data-dnd-overlay] [data-dnd-overlay-item]');
    expect(await behind.evaluateAll((cells) => cells.map((cell) => /rotate/.test((cell as HTMLElement).style.transform)))).toEqual([true, true]);
    await page.mouse.up();
    await settled(page);
    await expect(files(page)).toContainText(folder('archive', 'cv', 'budget', 'notes'));
    await expect(files(page)).toContainText(folder('documents', 'invoices/', 'contracts/', 'report', 'slides', 'letter', 'plan'));
    await expect(page.getByTestId('fs-last')).toHaveText('Moved 3 files to Archive');
    await expect(summary(page)).toHaveText('2 folders, 4 files');
  });

  test('Ctrl/Cmd+click adds files to the selection; a breadcrumb takes them', async ({ page }) => {
    await tile(page, 'cv').click();
    await ctrlClick(tile(page, 'plan'));
    await expect(summary(page)).toHaveText('2 folders, 7 files · 2 selected');
    await hold(page, tile(page, 'plan'), await at(byTestId(page, 'crumb-home'), 0.5, 0.5));
    await expect(byTestId(page, 'crumb-home')).toHaveAttribute('data-target');
    await page.mouse.up();
    await settled(page);
    await expect(files(page)).toContainText(folder('home', 'documents/', 'photos/', 'projects/', 'archive/', 'readme', 'cv', 'plan'));
    await expect(files(page)).toContainText(folder('documents', 'invoices/', 'contracts/', 'budget', 'notes', 'report', 'slides', 'letter'));

    await byTestId(page, 'crumb-home').click();
    await expect(page.getByTestId('crumb-current')).toHaveText('Home');
    await expect(page.getByTestId('file-grid').locator('[data-id]')).toHaveText([
      /Documents/,
      /Photos/,
      /Projects/,
      /Archive/,
      /README/,
      /cv/,
      /plan/,
    ]);
  });

  test('files and folders reorder inside the grid (strategy: grid)', async ({ page }) => {
    await drag(page, tile(page, 'cv'), await at(tile(page, 'plan'), 0.6, 0.6));
    await settled(page);
    await expect(files(page)).toContainText(
      folder('documents', 'invoices/', 'contracts/', 'budget', 'notes', 'report', 'slides', 'letter', 'plan', 'cv'),
    );
    // Back up onto "notes": along the empty rest of the second row, then straight up.
    const notes = await at(tile(page, 'notes'), 0.4, 0.6);
    const below = await at(tile(page, 'cv'), 0.5, 0.5);
    await drag(page, tile(page, 'cv'), [{ x: notes.x, y: below.y }, notes]);
    await settled(page);
    await expect(files(page)).toContainText(
      folder('documents', 'invoices/', 'contracts/', 'budget', 'cv', 'notes', 'report', 'slides', 'letter', 'plan'),
    );
    // A folder tile sorts too: Invoices through Contracts (its middle, then its far edge) onto cv.
    await drag(page, tile(page, 'invoices'), await at(tile(page, 'cv'), 0.5, 0.5));
    await settled(page);
    await expect(files(page)).toContainText(
      folder('documents', 'contracts/', 'budget', 'cv', 'invoices/', 'notes', 'report', 'slides', 'letter', 'plan'),
    );
    await expect(tree(page)).toHaveText('documents(contracts,invoices),photos(trips),projects(website),archive');
  });

  test("a folder tile's middle takes files; near its edges the grid reorders", async ({ page }) => {
    await row(page, 'photos').click();
    await expect(page.getByTestId('crumb-current')).toHaveText('Photos');
    await expect(summary(page)).toHaveText('1 folder, 3 files');

    await hold(page, tile(page, 'beach'), await at(tile(page, 'trips'), 0.5, 0.5));
    await expect(tile(page, 'trips')).toHaveAttribute('data-target');
    const into = await watchDropAnimation(page);
    await page.mouse.up();
    // Not shown in the grid any more: the overlay shrinks into the tile and fades.
    expect(await into()).toBe('fade');
    await settled(page);
    await expect(files(page)).toContainText(folder('trips', 'alps', 'beach'));
    await expect(files(page)).toContainText(folder('photos', 'trips/', 'sunset', 'cat'));
    await expect(row(page, 'trips').locator('.fm-count')).toHaveText('2');
    await expect(page.getByTestId('fs-last')).toHaveText('Moved beach.jpg to Trips');

    // cat through Trips' middle to its left edge: before it, not into it.
    await drag(page, tile(page, 'cat'), [await at(tile(page, 'trips'), 0.5, 0.5), await at(tile(page, 'trips'), 0.1, 0.5)]);
    await settled(page);
    await expect(files(page)).toContainText(folder('photos', 'cat', 'trips/', 'sunset'));
  });

  test('the open folder does not take its own files', async ({ page }) => {
    await hold(page, tile(page, 'cv'), await at(row(page, 'documents'), 0.5, 0.5));
    await expect(row(page, 'documents')).not.toHaveAttribute('data-target');
    // Other folders accept meanwhile.
    await expect(row(page, 'invoices')).toHaveClass(/accepting/);
    await expect(tile(page, 'contracts')).toHaveClass(/accepting/);
    await page.mouse.up();
    await settled(page);
    await expect(files(page)).toContainText(folder('documents', ...DOCUMENTS));
  });

  test('folders are reorganized in the tree, with the rows as targets in the way', async ({ page }) => {
    // Up to the upper part of "Photos" at the same level: Archive goes before it.
    await hold(page, row(page, 'archive'), await at(row(page, 'photos'), 0.3, 0.2));
    await expect(page.locator('[data-target]')).toHaveCount(0);
    await page.mouse.up();
    await settled(page);
    await expect(tree(page)).toHaveText('documents(invoices,contracts),archive,photos(trips),projects(website)');
    // Into the middle of "Projects": Archive becomes its first child (the tree nests it).
    await drag(page, row(page, 'archive'), await at(row(page, 'projects'), 0.3, 0.5));
    await settled(page);
    await expect(tree(page)).toHaveText('documents(invoices,contracts),photos(trips),projects(archive,website)');
    await expect(row(page, 'archive')).toHaveAttribute('data-depth', '1');
    await expect(page.getByTestId('fs-last')).toHaveText('Moved folder Archive into Projects');
    // The tree keeps the files where they were: Projects' sub-folders come first.
    await expect(files(page)).toContainText(folder('projects', 'archive/', 'website/', 'logo', 'bundle'));
  });

  test('a folder tile goes into another folder, never into itself or its own sub-folders', async ({ page }) => {
    await drag(page, tile(page, 'contracts'), await at(tile(page, 'invoices'), 0.5, 0.5));
    await settled(page);
    await expect(tree(page)).toHaveText('documents(invoices(contracts)),photos(trips),projects(website),archive');
    await expect(files(page)).toContainText(folder('invoices', 'inv-01', 'inv-02', 'contracts/'));
    await expect(page.getByTestId('fs-last')).toHaveText('Moved Contracts to Invoices');

    // From Home: Documents over its own sub-folder's row, then its own row: no target.
    await byTestId(page, 'sidebar-home').click();
    await expect(page.getByTestId('crumb-current')).toHaveText('Home');
    await hold(page, tile(page, 'documents'), await at(row(page, 'invoices'), 0.5, 0.5));
    await expect(row(page, 'invoices')).not.toHaveClass(/accepting/);
    await expect(page.locator('[data-target]')).toHaveCount(0);
    await glideTo(page, await at(row(page, 'documents'), 0.5, 0.5));
    await expect(page.locator('[data-target]')).toHaveCount(0);
    // Photos takes it, though.
    await expect(row(page, 'photos')).toHaveClass(/accepting/);
    await page.mouse.up();
    await settled(page);
    await expect(tree(page)).toHaveText('documents(invoices(contracts)),photos(trips),projects(website),archive');

    await drag(page, tile(page, 'documents'), await at(tile(page, 'photos'), 0.5, 0.5));
    await settled(page);
    await expect(tree(page)).toHaveText('photos(trips,documents(invoices(contracts))),projects(website),archive');
  });

  test('a folder tile goes up a breadcrumb; a tree row goes into a folder tile', async ({ page }) => {
    await hold(page, tile(page, 'contracts'), await at(byTestId(page, 'crumb-home'), 0.5, 0.5));
    await expect(byTestId(page, 'crumb-home')).toHaveAttribute('data-target');
    await page.mouse.up();
    await settled(page);
    await expect(tree(page)).toHaveText('documents(invoices),photos(trips),projects(website),archive,contracts');
    await expect(files(page)).toContainText(folder('home', 'documents/', 'photos/', 'projects/', 'archive/', 'readme', 'contracts/'));

    // The grid doesn't sort tree rows, so the whole tile is the target, edges included.
    await hold(page, row(page, 'archive'), await at(tile(page, 'invoices'), 0.15, 0.5));
    await expect(tile(page, 'invoices')).toHaveAttribute('data-target');
    await page.mouse.up();
    await settled(page);
    await expect(tree(page)).toHaveText('documents(invoices(archive)),photos(trips),projects(website),contracts');
    await expect(page.getByTestId('fs-last')).toHaveText('Moved Archive to Invoices');
  });

  test('a selection with a folder goes into another folder whole', async ({ page }) => {
    await ctrlClick(tile(page, 'contracts'), tile(page, 'cv'));
    await drag(page, tile(page, 'cv'), await at(tile(page, 'invoices'), 0.5, 0.5));
    await settled(page);
    await expect(files(page)).toContainText(folder('invoices', 'inv-01', 'inv-02', 'contracts/', 'cv'));
    await expect(files(page)).toContainText(folder('documents', 'invoices/', 'budget', 'notes', 'report', 'slides', 'letter', 'plan'));
    await expect(page.getByTestId('fs-last')).toHaveText('Moved 2 items to Invoices');
  });

  test('keyboard: an arrow stops on a folder before passing it, Enter moves the file inside', async ({ page }) => {
    await tile(page, 'cv').focus();
    await press(page, 'Space', 'ArrowLeft');
    await expect(tile(page, 'contracts')).toHaveAttribute('data-target');
    await expect(announced(page, 'Over tile:contracts: dropping puts item cv inside.')).toHaveCount(1);
    await press(page, 'Enter');
    await settled(page);
    await expect(files(page)).toContainText(folder('contracts', 'cv'));
    await expect(page.getByTestId('fs-last')).toHaveText('Moved cv.pdf to Contracts');
    await expect(announced(page, 'Item cv dropped into tile:contracts.')).toHaveCount(1);
  });
});
