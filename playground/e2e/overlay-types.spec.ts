import { expect, test, type Page } from '@playwright/test';
import { center, glide, item, pickUp, trackErrors, trackVueWarnings, waitForIdle } from './helpers';

const INITIAL = 'mixed:m1,m2,m3,m4,m5,m6,m7 | pinned:p1,p2,p3,p4';
const state = (page: Page) => page.getByTestId('state');
const overlay = (page: Page) => page.locator('[data-dnd-overlay]');
const look = (page: Page) => overlay(page).locator('[data-overlay-kind]');

/** Picks `id` up and tells which overlay shows: a component's kind, or `clone`. */
const overlayOf = async (page: Page, id: string): Promise<string | null> => {
  await pickUp(page, item(page, id));
  await expect(overlay(page)).toHaveCount(1);
  const result = (await look(page).count())
    ? await look(page).getAttribute('data-overlay-kind')
    : (await overlay(page).locator(`[data-id="${id}"]`).count())
      ? 'clone'
      : null;
  await page.mouse.up();
  await waitForIdle(page);
  return result;
};

test.describe('overlay per source (overlay-types)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#overlay-types');
    await expect(state(page)).toHaveText(INITIAL);
  });

  // Precedence: item option > list option > provider slot > clone. Mixed has no list
  // overlay: notes and photos have their own, tasks use the provider slot, links get
  // nothing from the slot and fall back to the clone. Pinned has a list overlay; the
  // item option still wins there.
  const cases: Array<[source: string, id: string, overlay: string]> = [
    ['an item option', 'm1', 'note'],
    ['an item option', 'm2', 'photo'],
    ['the provider slot', 'm3', 'slot'],
    ['the clone (empty slot)', 'm4', 'clone'],
    ['the list option', 'p1', 'list'],
    ['the list option', 'p2', 'list'],
    ['an item option over the list option', 'p3', 'note'],
    ['an item option over the list option', 'p4', 'photo'],
  ];
  for (const [source, id, expected] of cases) {
    test(`${id}: ${source} (${expected})`, async ({ page }) => {
      const errors = trackErrors(page);
      const warnings = trackVueWarnings(page);
      expect(await overlayOf(page, id)).toBe(expected);
      await expect(state(page)).toHaveText(INITIAL);
      expect(errors).toEqual([]);
      expect(warnings).toEqual([]);
    });
  }

  test('the overlay chosen at drag start stays over another list, where the row is recreated', async ({ page }) => {
    await pickUp(page, item(page, 'p1'));
    await expect(look(page)).toHaveAttribute('data-overlay-kind', 'list');
    await glide(page, await center(item(page, 'm2'), 0.75));
    // The slot now renders in Mixed (no list overlay, and a task there would use the slot).
    await expect(page.getByTestId('mixed').locator('[data-id="p1"]')).toHaveCount(1);
    await expect(look(page)).toHaveAttribute('data-overlay-kind', 'list');
    await expect(overlay(page)).toContainText('Task P1');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(/^mixed:m1,.*p1.* \| pinned:p2,p3,p4$/);
  });

  test('the clone fallback copies the dragged row', async ({ page }) => {
    await pickUp(page, item(page, 'm4'));
    await expect(look(page)).toHaveCount(0);
    await expect(overlay(page)).toContainText('Link M4');
    await page.mouse.up();
    await waitForIdle(page);
  });
});
