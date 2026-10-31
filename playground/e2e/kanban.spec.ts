import { expect, test, type Page } from '@playwright/test';
import { center, dragTo, trackErrors, waitForIdle } from './helpers';

const card = (page: Page, id: string) => page.locator(`[data-id="${id}"]`);

test.describe('kanban (lists sharing a group)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#kanban');
    await expect(page.getByTestId('board')).toHaveText('todo:a1,a2,a3,a4 | doing:b1,b2 | done:');
  });

  test('moves a card into an empty column', async ({ page }) => {
    const errors = trackErrors(page);
    await dragTo(page, card(page, 'a1'), await center(page.getByTestId('done')));
    await waitForIdle(page);
    await expect(page.getByTestId('board')).toHaveText('todo:a2,a3,a4 | doing:b1,b2 | done:a1');
    expect(errors).toEqual([]);
  });

  test('a list takes drops anywhere in its column (dropzone): below its cards, at its end', async ({ page }) => {
    const errors = trackErrors(page);
    await page.getByTestId('whole-columns').check();
    const column = (await page.getByTestId('column-doing').boundingBox())!;
    const list = (await page.getByTestId('doing').boundingBox())!;
    const point = { x: column.x + column.width / 2, y: column.y + column.height - 24 };
    // Well below the list element: only the column's dropzone is there.
    expect(point.y).toBeGreaterThan(list.y + list.height + 40);
    await dragTo(page, card(page, 'a1'), point);
    await waitForIdle(page);
    await expect(page.getByTestId('board')).toHaveText('todo:a2,a3,a4 | doing:b1,b2,a1 | done:');
    // The empty column takes it too, anywhere.
    const done = (await page.getByTestId('column-done').boundingBox())!;
    await dragTo(page, card(page, 'a2'), { x: done.x + done.width / 2, y: done.y + done.height - 24 });
    await waitForIdle(page);
    await expect(page.getByTestId('board')).toHaveText('todo:a3,a4 | doing:b1,b2,a1 | done:a2');
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
