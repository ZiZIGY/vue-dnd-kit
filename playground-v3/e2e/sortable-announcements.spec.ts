import { expect, test, type Page } from '@playwright/test';
import { center, dragTo, frames, item, waitForIdle } from './helpers';

/** Waits for the live region (debounced 500 ms for moves) to say exactly `text`. */
const announced = (page: Page, text: string) =>
  expect(page.locator('[role="status"]').filter({ hasText: new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) })).toHaveCount(1, {
    timeout: 3000,
  });

const press = async (page: Page, key: string, times = 1) => {
  for (let i = 0; i < times; i++) {
    await page.keyboard.press(key);
    await frames(page, 2);
  }
};

test.describe('position-aware announcements (rfcs/0001-v3.md §10)', () => {
  test('pick up, move and drop in a list', async ({ page }) => {
    await page.goto('/#sortable');
    await page.locator('[data-testid="list"] [data-id="t1"]').focus();
    await press(page, 'Space');
    await announced(page, 'Picked up item t1 at position 1 of 8 in list list.');
    await press(page, 'ArrowDown', 2);
    await announced(page, 'Item t1 moved to position 3 of 8 in list list.');
    await press(page, 'Space');
    await announced(page, 'Item t1 dropped at position 3 of 8 in list list.');
    await waitForIdle(page);
  });

  test('cancel names the position the item returned to', async ({ page }) => {
    await page.goto('/#sortable');
    await page.locator('[data-testid="list"] [data-id="t2"]').focus();
    await press(page, 'Space');
    await press(page, 'ArrowDown', 3);
    await press(page, 'Escape');
    await announced(page, 'Dragging was cancelled. Item t2 returned to position 2 of 8 in list list.');
    await waitForIdle(page);
  });

  test('moves across lists name the new list', async ({ page }) => {
    await page.goto('/#kanban');
    await item(page, 'a1').focus();
    await press(page, 'Space');
    await press(page, 'ArrowRight');
    await announced(page, 'Item a1 moved to position 1 of 3 in list doing.');
    await press(page, 'Space');
    await announced(page, 'Item a1 dropped at position 1 of 3 in list doing.');
  });

  test('pointer drags announce positions too, and multi-drag counts the items', async ({ page }) => {
    await page.goto('/#multi');
    await item(page, 'a2').click({ modifiers: ['ControlOrMeta'] });
    await item(page, 'a3').click({ modifiers: ['ControlOrMeta'] });
    await dragTo(page, item(page, 'a2'), await center(item(page, 'a1'), 0.2), { release: false });
    await announced(page, '2 items moved to position 1 of 5 in list stack-a.');
    await page.mouse.up();
    await announced(page, '2 items dropped at position 1 of 6 in list stack-a.');
  });

  test("the provider's announcements override the defaults per event", async ({ page }) => {
    await page.goto('/#announce');
    await item(page, 'a1').focus();
    await press(page, 'Space');
    await announced(page, 'Picked up item a1 at position 1 of 5 in list tasks.');
    await press(page, 'ArrowDown', 2);
    await announced(page, 'Item a1 moved to position 3 of 5 in list tasks.');
    await press(page, 'Space');
    await announced(page, 'Custom: a1 is down.');
  });

  test('drags outside sortable lists keep the generic texts', async ({ page }) => {
    await page.goto('/#announce');
    await dragTo(page, item(page, 'free'), await center(page.getByTestId('zone')), { release: false });
    await announced(page, 'Draggable item free was moved over droppable area zone.');
    await page.mouse.up();
    await announced(page, 'Custom: free is down.');
  });
});
