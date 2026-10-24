import { expect, test, type Page } from '@playwright/test';
import { center, dragTo, glide, item, pickUp, trackErrors, waitForIdle } from './helpers';

const INITIAL = 'todo:a1,a2,a3 | doing:b1,b2 | review: | done:c1';
const state = (page: Page) => page.getByTestId('state');
// The column overlay is a clone that keeps data-testid: scope to the board.
const header = (page: Page, id: string) => page.locator(`[data-testid="${id}-header"]:not([data-dnd-overlay] *)`);
const cards = (page: Page, id: string) => page.locator(`[data-testid="${id}-cards"]:not([data-dnd-overlay] *)`);

test.describe('nested sortables: kanban with draggable columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#nested');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('dragging a column carries its cards', async ({ page }) => {
    const errors = trackErrors(page);
    const review = (await page.locator('[data-id="review"]').boundingBox())!;
    await dragTo(page, header(page, 'todo'), { x: review.x + review.width * 0.75, y: review.y + 20 });
    await waitForIdle(page);
    await expect(state(page)).toHaveText('doing:b1,b2 | review: | todo:a1,a2,a3 | done:c1');
    expect(errors).toEqual([]);
  });

  test("another column's card list does not capture a dragged column", async ({ page }) => {
    // The pointer ends over doing's cards, left of the column's center: the column
    // still sorts in the columns list.
    const b1 = await center(item(page, 'b1'));
    await dragTo(page, header(page, 'done'), { x: b1.x - 40, y: b1.y });
    await waitForIdle(page);
    await expect(state(page)).toHaveText('todo:a1,a2,a3 | done:c1 | doing:b1,b2 | review:');
  });

  test('the column overlay shows its cards, and no card list accepts a column', async ({ page }) => {
    await pickUp(page, header(page, 'doing'));
    await glide(page, await center(item(page, 'b2')), 5);
    await expect(page.locator('[data-dnd-overlay] [data-id="b1"]')).toHaveCount(1);
    await expect(page.locator('[data-dnd-overlay] [data-id="b2"]')).toHaveCount(1);
    for (const id of ['todo', 'doing', 'review', 'done']) {
      await expect(cards(page, id)).not.toHaveAttribute('data-accepting');
    }
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('a card moves into an empty column', async ({ page }) => {
    await dragTo(page, item(page, 'a1'), await center(cards(page, 'review')));
    await waitForIdle(page);
    await expect(state(page)).toHaveText('todo:a2,a3 | doing:b1,b2 | review:a1 | done:c1');
  });

  test('a card dropped on a column header goes to the top of that column', async ({ page }) => {
    await dragTo(page, item(page, 'a2'), await center(header(page, 'doing')));
    await waitForIdle(page);
    await expect(state(page)).toHaveText('todo:a1,a3 | doing:a2,b1,b2 | review: | done:c1');
  });

  test('a card goes between cards of another column', async ({ page }) => {
    await dragTo(page, item(page, 'c1'), await center(item(page, 'b2'), 0.25));
    await waitForIdle(page);
    await expect(state(page)).toHaveText('todo:a1,a2,a3 | doing:b1,c1,b2 | review: | done:');
  });

  test('Escape during a column drag restores the board', async ({ page }) => {
    await dragTo(page, header(page, 'todo'), await center(header(page, 'done')), { release: false });
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(state(page)).toHaveText(INITIAL);
  });
});
