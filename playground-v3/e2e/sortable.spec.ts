import { expect, test } from '@playwright/test';
import { center, dragTo, trackErrors, waitForIdle } from './helpers';

const INITIAL = 't1,t2,t3,t4,t5,t6,t7,t8';

test.describe('vertical sortable list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#sortable');
    await expect(page.getByTestId('order')).toHaveText(INITIAL);
  });

  const row = (page: import('@playwright/test').Page, id: string) =>
    page.locator(`[data-testid="list"] [data-id="${id}"]`);

  test('reorders the list and writes the result into the Ref', async ({ page }) => {
    const errors = trackErrors(page);
    await dragTo(page, row(page, 't1'), await center(row(page, 't4'), 0.8));
    await waitForIdle(page);
    await expect(page.getByTestId('order')).toHaveText('t2,t3,t4,t1,t5,t6,t7,t8');
    expect(errors).toEqual([]);
  });

  test('shows the overlay and a placeholder while dragging', async ({ page }) => {
    await dragTo(page, row(page, 't2'), await center(row(page, 't6')), { release: false });
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 't2');
    // Data is untouched until the drop.
    await expect(page.getByTestId('order')).toHaveText(INITIAL);
    await page.mouse.up();
    await waitForIdle(page);
  });

  test('Escape cancels and returns the item', async ({ page }) => {
    await dragTo(page, row(page, 't1'), await center(row(page, 't5')), { release: false });
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(page.getByTestId('order')).toHaveText(INITIAL);
  });

  test('a click without movement does not start a drag', async ({ page }) => {
    const point = await center(row(page, 't3'));
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    await page.mouse.move(point.x, point.y + 2);
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
    await page.mouse.up();
    await expect(page.getByTestId('order')).toHaveText(INITIAL);
  });

  test('the right mouse button does not drag', async ({ page }) => {
    const start = await center(row(page, 't1'));
    await page.mouse.move(start.x, start.y);
    await page.mouse.down({ button: 'right' });
    await page.mouse.move(start.x, start.y + 150, { steps: 10 });
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
    await page.mouse.up({ button: 'right' });
    await expect(page.getByTestId('order')).toHaveText(INITIAL);
  });

  test('crossing a taller item does not oscillate when the pointer jitters', async ({ page }) => {
    // t3 is tall: crossing its center moves t2 below it. The layout then shifts
    // under the still pointer; jitter at that spot must not swap them back.
    const point = await center(row(page, 't3'), 0.75);
    await dragTo(page, row(page, 't2'), point, { release: false });
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 't2');
    for (let i = 0; i < 6; i++) {
      await page.mouse.move(point.x, point.y + (i % 2 ? 3 : -3));
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('order')).toHaveText('t1,t3,t2,t4,t5,t6,t7,t8');
  });

  test('moving back up over the upper half of the taller item returns the slot', async ({ page }) => {
    await dragTo(page, row(page, 't2'), await center(row(page, 't3'), 0.75), { release: false });
    await page.mouse.move(...Object.values(await center(row(page, 't3'), 0.2)) as [number, number], { steps: 5 });
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('order')).toHaveText(INITIAL);
  });
});
