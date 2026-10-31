import { expect, test, type Page } from '@playwright/test';
import { frames, item, trackErrors, trackVueWarnings, waitForIdle } from './helpers';

/** Presses `key` `times` times, letting the async keyboard move and the frame run in between. */
const press = async (page: Page, key: string, times = 1) => {
  for (let i = 0; i < times; i++) {
    await page.keyboard.press(key);
    await frames(page, 2);
  }
};

const focused = (page: Page) => page.evaluate(() => document.activeElement?.getAttribute('data-id') ?? null);
const placeholderIn = (page: Page, list: string) =>
  page.locator(`[data-testid="${list}"]:not([data-dnd-overlay] *) [data-dnd-placeholder]`);

test.describe('keyboard sorting by items (rfcs/0001-v3.md §10)', () => {
  test('arrows move the item one position at a time in a vertical list', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/demo/#sortable');
    await page.locator('[data-testid="list"] [data-id="t1"]').focus();
    await press(page, 'Space');
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 't1');
    await press(page, 'ArrowDown', 2);
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(page.getByTestId('order')).toHaveText('t2,t3,t1,t4,t5,t6,t7,t8');
    expect(await focused(page)).toBe('t1');
    expect(errors).toEqual([]);
  });

  test('an arrow at the end of the list does nothing (no pixel drift)', async ({ page }) => {
    await page.goto('/demo/#sortable');
    await page.locator('[data-testid="list"] [data-id="t1"]').focus();
    await press(page, 'Space');
    await press(page, 'ArrowUp', 3);
    await press(page, 'ArrowLeft');
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(page.getByTestId('order')).toHaveText('t1,t2,t3,t4,t5,t6,t7,t8');
  });

  test('Escape cancels a keyboard drag and keeps the focus', async ({ page }) => {
    await page.goto('/demo/#sortable');
    await page.locator('[data-testid="list"] [data-id="t2"]').focus();
    await press(page, 'Space');
    await press(page, 'ArrowDown', 3);
    await press(page, 'Escape');
    await waitForIdle(page);
    await expect(page.getByTestId('order')).toHaveText('t1,t2,t3,t4,t5,t6,t7,t8');
    expect(await focused(page)).toBe('t2');
  });

  test('left/right move a card to the adjacent column of a kanban', async ({ page }) => {
    await page.goto('/demo/#kanban');
    await item(page, 'a1').focus();
    await press(page, 'Space');
    await press(page, 'ArrowRight');
    await expect(placeholderIn(page, 'doing')).toHaveAttribute('data-id', 'a1');
    // The element was recreated in the new column: the focus follows it.
    expect(await focused(page)).toBe('a1');
    await press(page, 'ArrowRight');
    await expect(placeholderIn(page, 'done')).toHaveAttribute('data-id', 'a1');
    await press(page, 'ArrowRight');
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(page.getByTestId('board')).toHaveText('todo:a2,a3,a4 | doing:b1,b2 | done:a1');
    expect(await focused(page)).toBe('a1');
  });

  test('a card entering a column lands next to the row it was on', async ({ page }) => {
    await page.goto('/demo/#kanban');
    await item(page, 'a2').focus();
    await press(page, 'Space');
    await press(page, 'ArrowRight');
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(page.getByTestId('board')).toHaveText('todo:a1,a3,a4 | doing:b1,a2,b2 | done:');
  });

  test('up/down in a grid go to the nearest cell of the next row', async ({ page }) => {
    await page.goto('/demo/#grid');
    await item(page, 'g2').focus();
    await press(page, 'Space');
    await press(page, 'ArrowDown');
    // Measure after the FLIP: the rect includes the running translate.
    await page.waitForTimeout(300);
    const [moved, above] = await Promise.all([item(page, 'g2').boundingBox(), item(page, 'g1').boundingBox()]);
    expect(moved!.y).toBeGreaterThan(above!.y + above!.height);
    await press(page, 'ArrowRight');
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(page.getByTestId('state')).toContainText('uniform:g1,g3,g4,g5,g6,g7,g2,g8,g9,g10');
  });

  test('left/right move along a horizontal list', async ({ page }) => {
    await page.goto('/demo/#lists');
    await item(page, 'h1').focus();
    await press(page, 'Space');
    await press(page, 'ArrowRight', 2);
    await press(page, 'ArrowDown');
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(page.getByTestId('state')).toContainText('horizontal:h2,h3,h1,h4,h5,h6');
  });

  test('in an indicator list the arrows move the line, skipping no-op positions', async ({ page }) => {
    await page.goto('/demo/#lists');
    await item(page, 'i1').focus();
    await press(page, 'Space');
    await press(page, 'ArrowDown');
    await expect(item(page, 'i3')).toHaveAttribute('data-indicator', 'before');
    await press(page, 'ArrowDown');
    await expect(item(page, 'i4')).toHaveAttribute('data-indicator', 'before');
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(page.getByTestId('state')).toContainText('indicator:i2,i3,i1,i4,i5,i6');
  });

  test('into an indicator list only the line moves; back out, the list takes the item again', async ({ page }) => {
    const errors = trackErrors(page);
    const warnings = trackVueWarnings(page);
    const order = (list: string) =>
      page.locator(`[data-testid="${list}"]:not([data-dnd-overlay] *) > [data-id]`).evaluateAll((rows) => rows.map((row) => row.getAttribute('data-id')));
    await page.goto('/demo/#lists');
    await item(page, 'm2').focus();
    await press(page, 'Space');
    await press(page, 'ArrowRight');
    // Level with m2: before s2. The indicator list doesn't move, and m2 stays home.
    await expect(item(page, 's2')).toHaveAttribute('data-indicator', 'before');
    expect(await order('still')).toEqual(['s1', 's2', 's3', 's4']);
    expect(await order('moving')).toEqual(['m1', 'm2', 'm3', 'm4']);
    await press(page, 'ArrowDown');
    await expect(item(page, 's3')).toHaveAttribute('data-indicator', 'before');
    expect(await order('still')).toEqual(['s1', 's2', 's3', 's4']);
    // Left: the list that moves takes the item, level with the line; the line goes away.
    await press(page, 'ArrowLeft');
    await expect(page.locator('[data-indicator]')).toHaveCount(0);
    await expect.poll(() => order('moving')).toEqual(['m1', 'm3', 'm2', 'm4']);
    expect(await focused(page)).toBe('m2');
    await press(page, 'ArrowRight');
    await expect(item(page, 's3')).toHaveAttribute('data-indicator', 'before');
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(page.getByTestId('mixed-state')).toHaveText('moving:m1,m3,m4 | still:s1,s2,m2,s3,s4');
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  test('a kanban column moves by keyboard from its handle', async ({ page }) => {
    await page.goto('/demo/#nested');
    await page.locator('[data-testid="todo-header"]').focus();
    await press(page, 'Space');
    await press(page, 'ArrowRight', 2);
    await press(page, 'Space');
    await waitForIdle(page);
    await expect(page.getByTestId('state')).toHaveText('doing:b1,b2 | review: | todo:a1,a2,a3 | done:c1');
  });

  test('moving past the viewport scrolls the slot into view', async ({ page }) => {
    await page.goto('/demo/#bench');
    await page.locator('[data-testid="bench"] [data-id="r0"]').focus();
    await press(page, 'Space');
    await press(page, 'ArrowDown', 30);
    const { scrollY, top, bottom, height } = await page.evaluate(() => {
      const placeholder = document.querySelector('[data-testid="bench"] [data-dnd-placeholder]')!;
      const rect = placeholder.getBoundingClientRect();
      return { scrollY: window.scrollY, top: rect.top, bottom: rect.bottom, height: window.innerHeight };
    });
    expect(scrollY).toBeGreaterThan(0);
    expect(top).toBeGreaterThanOrEqual(0);
    expect(bottom).toBeLessThanOrEqual(height);
    expect(await focused(page)).toBe('r0');
    await press(page, 'Space');
    await waitForIdle(page);
    const index = await page
      .locator('[data-testid="bench"] > [data-id]')
      .evaluateAll((rows) => rows.findIndex((row) => row.getAttribute('data-id') === 'r0'));
    expect(index).toBe(30);
  });
});
