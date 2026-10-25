import { expect, test, type Page } from '@playwright/test';
import { center, glide, item, pickUp, trackErrors, trackVueWarnings, waitForIdle } from './helpers';

const INITIAL = 'deck-inbox:i1,i2,i3,i4,i5,i6,i7 | deck-done:d1,d2';
const state = (page: Page) => page.getByTestId('state');
const overlay = (page: Page) => page.locator('[data-dnd-overlay]');
const deck = (page: Page) => overlay(page).locator('[data-overlay-kind="deck"]');

const select = async (page: Page, ...ids: string[]) => {
  for (const id of ids) await item(page, id).click({ modifiers: ['ControlOrMeta'] });
};

test.describe('custom overlay layout with DragPreview (overlay-deck)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#overlay-deck');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('fans out the default clones of every dragged card', async ({ page }) => {
    const errors = trackErrors(page);
    const warnings = trackVueWarnings(page);
    await select(page, 'i2', 'i3', 'i5');
    await pickUp(page, item(page, 'i3'));
    await expect(deck(page)).toHaveAttribute('data-count', '3');
    await expect(deck(page).getByTestId('deck-card')).toHaveCount(3);
    // Each card holds a clone of its item (the clone keeps the row's data-id).
    for (const id of ['i2', 'i3', 'i5']) await expect(deck(page).locator(`[data-id="${id}"]`)).toHaveCount(1);
    await expect(deck(page).getByTestId('deck-fallback')).toHaveCount(0);
    await expect(deck(page).getByTestId('deck-count')).toHaveText('3');
    // The cards are fanned: the ones behind are turned.
    const turned = await deck(page)
      .getByTestId('deck-card')
      .evaluateAll(
        (cards) =>
          cards.filter((card) => !['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(card).transform)).length,
      );
    expect(turned).toBe(2);

    await glide(page, await center(item(page, 'd1'), 0.75));
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(/^deck-inbox:i1,i4,i6,i7 \| deck-done:[\w,]*i2,i3,i5[\w,]*$/);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  test("cards past the clone limit render the preview's slot", async ({ page }) => {
    await select(page, 'i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7');
    // Clones are taken around the grabbed card in drop order: i3-i7. The deck shows the
    // grabbed i7 and the first four others, i1 and i2 without a clone.
    await pickUp(page, item(page, 'i7'));
    await expect(deck(page).getByTestId('deck-card')).toHaveCount(5);
    await expect(deck(page).getByTestId('deck-fallback')).toHaveCount(2);
    await expect(deck(page).getByTestId('deck-fallback').first()).toContainText(/Task I1|Note I2/);
    await expect(deck(page).getByTestId('deck-count')).toHaveText('7');
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(INITIAL);
  });
});
