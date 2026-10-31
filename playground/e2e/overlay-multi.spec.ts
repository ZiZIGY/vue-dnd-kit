import { expect, test, type Page } from '@playwright/test';
import { center, glide, item, pickUp, trackErrors, waitForIdle } from './helpers';

const INITIAL = 'inbox:i1,i2,i3,i4,i5,i6 | done:d1,d2';
const state = (page: Page) => page.getByTestId('state');
const overlay = (page: Page) => page.locator('[data-dnd-overlay]');
const stack = (page: Page) => overlay(page).locator('[data-overlay-kind="stack"]');

const select = async (page: Page, ...ids: string[]) => {
  for (const id of ids) await item(page, id).click({ modifiers: ['ControlOrMeta'] });
};

test.describe('stacked multi-drag overlay (overlay-multi)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#overlay-multi');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('one overlay component draws every selected card with a count', async ({ page }) => {
    const errors = trackErrors(page);
    await select(page, 'i2', 'i3', 'i5');
    await pickUp(page, item(page, 'i2'));
    await expect(overlay(page)).toHaveCount(1);
    await expect(stack(page)).toHaveAttribute('data-count', '3');
    await expect(overlay(page).getByTestId('stack-count')).toHaveText('3');
    await expect(overlay(page).getByTestId('stack-sheet')).toHaveCount(2);
    await expect(stack(page)).toContainText('Note I2');
    await expect(stack(page)).toContainText('Photo I3, Task I5');

    await glide(page, await center(item(page, 'd1'), 0.75));
    await expect(page.getByTestId('done').locator('[data-id="i2"]')).toHaveCount(1);
    await expect(overlay(page).getByTestId('stack-count')).toHaveText('3');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(/^inbox:i1,i4,i6 \| done:[\w,]*i2,i3,i5[\w,]*$/);
    expect(errors).toEqual([]);
  });

  test('a single card has no count and no sheets', async ({ page }) => {
    await pickUp(page, item(page, 'i1'));
    await expect(stack(page)).toHaveAttribute('data-count', '1');
    await expect(overlay(page).getByTestId('stack-count')).toHaveCount(0);
    await expect(overlay(page).getByTestId('stack-sheet')).toHaveCount(0);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(INITIAL);
  });
});
