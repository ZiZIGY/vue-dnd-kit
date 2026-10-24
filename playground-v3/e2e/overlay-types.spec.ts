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
    await page.goto('/#overlay-types');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('item option > list option > provider slot > clone', async ({ page }) => {
    const errors = trackErrors(page);
    const warnings = trackVueWarnings(page);
    // Mixed has no list overlay: notes and photos have their own, tasks use the
    // provider slot, links get nothing from the slot and fall back to the clone.
    expect(await overlayOf(page, 'm1')).toBe('note');
    expect(await overlayOf(page, 'm2')).toBe('photo');
    expect(await overlayOf(page, 'm3')).toBe('slot');
    expect(await overlayOf(page, 'm4')).toBe('clone');
    // Pinned has a list overlay; the item option still wins.
    expect(await overlayOf(page, 'p1')).toBe('list');
    expect(await overlayOf(page, 'p2')).toBe('list');
    expect(await overlayOf(page, 'p3')).toBe('note');
    expect(await overlayOf(page, 'p4')).toBe('photo');
    await expect(state(page)).toHaveText(INITIAL);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

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
