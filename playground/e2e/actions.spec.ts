import { expect, test, type Page } from '@playwright/test';
import { trackErrors, waitForIdle } from './helpers';

/**
 * `@vue-dnd-kit/actions` (#actions): move buttons (`moveItem`), an item picked up for the
 * keyboard (`startDrag` with `type: 'keyboard'`) and a scripted pointer drag. Done
 * refuses locked tasks in its `onBeforeDrop`.
 */

const order = (page: Page) => page.getByTestId('actions-order');
const result = (page: Page) => page.getByTestId('actions-result');
const row = (page: Page, id: string) => page.locator(`[data-id="${id}"]:not([data-dnd-overlay] *)`);
const button = (page: Page, id: string, name: string) => row(page, id).getByRole('button', { name, exact: true });

test.describe('@vue-dnd-kit/actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#actions');
    await expect(order(page)).toHaveText('todo:t1,t2,t3,t4 | done:d1,d2');
  });

  test('up, down and to the top', async ({ page }) => {
    const errors = trackErrors(page);
    await button(page, 't2', 'Up').click();
    await expect(result(page)).toHaveText('t2 up: moved');
    await expect(order(page)).toHaveText('todo:t2,t1,t3,t4 | done:d1,d2');
    await waitForIdle(page);

    await button(page, 't2', 'Down').click();
    await expect(order(page)).toHaveText('todo:t1,t2,t3,t4 | done:d1,d2');
    await waitForIdle(page);

    await button(page, 't4', 'To the top').click();
    await expect(result(page)).toHaveText('t4 top: moved');
    await expect(order(page)).toHaveText('todo:t4,t1,t2,t3 | done:d1,d2');
    await waitForIdle(page);
    expect(errors).toEqual([]);
  });

  test('to another list; a refused move flies back', async ({ page }) => {
    await button(page, 't1', 'To Done').click();
    await expect(result(page)).toHaveText('t1 to done: moved');
    await expect(order(page)).toHaveText('todo:t2,t3,t4 | done:t1,d1,d2');
    await waitForIdle(page);

    await button(page, 't3', 'To Done').click();
    await expect(result(page)).toHaveText('t3 to done: refused');
    await waitForIdle(page);
    await expect(order(page)).toHaveText('todo:t2,t3,t4 | done:t1,d1,d2');

    // Back again, from the other list's buttons.
    await button(page, 't1', 'To Todo').click();
    await expect(order(page)).toHaveText('todo:t1,t2,t3,t4 | done:d1,d2');
  });

  test('the move is announced', async ({ page }) => {
    await button(page, 't1', 'Down').click();
    await expect(page.locator('[role="status"]')).toContainText('item t1 dropped at position 2 of 4 in list todo', {
      ignoreCase: true,
    });
  });

  test('an item picked up for the keyboard: the arrows move it, Enter drops it', async ({ page }) => {
    await button(page, 't1', 'Move with keys').click();
    await expect(result(page)).toHaveText('t1: picked up');
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await waitForIdle(page);
    await expect(order(page)).toHaveText('todo:t2,t3,t1,t4 | done:d1,d2');
  });

  test('a scripted pointer drag glides the first task to the top of Done', async ({ page }) => {
    const errors = trackErrors(page);
    await page.getByTestId('scripted').click();
    await expect(result(page)).toHaveText('scripted: moved');
    await waitForIdle(page);
    await expect(order(page)).toHaveText('todo:t2,t3,t4 | done:t1,d1,d2');
    expect(errors).toEqual([]);
  });
});
