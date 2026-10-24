import { expect, test, type Page } from '@playwright/test';
import { center, dragTo, trackErrors, waitForIdle } from './helpers';

const card = (page: Page, id: string) => page.locator(`[data-id="${id}"]`);

test.describe('kanban (lists sharing a group)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#kanban');
    await expect(page.getByTestId('board')).toHaveText('todo:a1,a2,a3,a4 | doing:b1,b2 | done:');
  });

  test('moves a card into an empty column', async ({ page }) => {
    const errors = trackErrors(page);
    await dragTo(page, card(page, 'a1'), await center(page.getByTestId('done')));
    await waitForIdle(page);
    await expect(page.getByTestId('board')).toHaveText('todo:a2,a3,a4 | doing:b1,b2 | done:a1');
    expect(errors).toEqual([]);
  });

  test('inserts a card between cards of another column', async ({ page }) => {
    await dragTo(page, card(page, 'b2'), await center(card(page, 'a2'), 0.25));
    await waitForIdle(page);
    await expect(page.getByTestId('board')).toHaveText('todo:a1,b2,a2,a3,a4 | doing:b1 | done:');
  });

  test('Escape after crossing columns restores both columns', async ({ page }) => {
    await dragTo(page, card(page, 'a3'), await center(page.getByTestId('doing'), 0.9), { release: false });
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(page.getByTestId('board')).toHaveText('todo:a1,a2,a3,a4 | doing:b1,b2 | done:');
  });
});
