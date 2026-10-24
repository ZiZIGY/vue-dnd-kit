import { expect, test, type Page } from '@playwright/test';
import { center, frames, glide, item, pickUp, trackErrors, waitForIdle } from './helpers';

const INITIAL = 'left:l1,l2,l3,l4 | right:r1,r2,r3,r4 | top:u1,u2,u3 | bottom:d1,d2,d3';

const moves = async (page: Page) => Number(await page.getByTestId('moves').textContent());

test.describe('stability guards (rfcs/0001-v3.md §6)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#stability');
    await expect(page.getByTestId('state')).toHaveText(INITIAL);
  });

  test('jitter across the boundary of touching columns moves the item once', async ({ page }) => {
    const errors = trackErrors(page);
    const right = page.getByTestId('right');
    const boundary = (await right.boundingBox())!.x;
    const y = (await center(item(page, 'r2'), 0.3)).y;

    await pickUp(page, item(page, 'l1'));
    // Approach horizontally so the crossing point is well defined.
    await glide(page, { x: boundary - 30, y });
    await glide(page, { x: boundary + 4, y }, 6);
    await expect(right.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'l1');
    await frames(page, 3);

    const before = await moves(page);
    for (let i = 0; i < 12; i++) {
      await page.mouse.move(boundary + (i % 2 ? 4 : -4), y);
      await frames(page);
    }
    // Back over the left list within 10px of the move: the hysteresis keeps the item where it is.
    expect(await moves(page)).toBe(before);
    await expect(right.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'l1');

    // A deliberate move releases the guard.
    await glide(page, { x: boundary - 60, y }, 6);
    await expect(page.getByTestId('left').locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'l1');
    await page.mouse.up();
    await waitForIdle(page);
    expect(errors).toEqual([]);
  });

  test('dropping right after crossing lands in the new column', async ({ page }) => {
    const right = page.getByTestId('right');
    const boundary = (await right.boundingBox())!.x;
    const y = (await center(item(page, 'r2'), 0.3)).y;
    await pickUp(page, item(page, 'l1'));
    await glide(page, { x: boundary - 30, y });
    await glide(page, { x: boundary + 4, y }, 6);
    await page.mouse.move(boundary - 3, y);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('state')).toHaveText(
      'left:l2,l3,l4 | right:r1,l1,r2,r3,r4 | top:u1,u2,u3 | bottom:d1,d2,d3',
    );
  });

  test('jitter at the boundary of stacked lists does not oscillate', async ({ page }) => {
    const bottom = page.getByTestId('bottom');
    const boundary = (await bottom.boundingBox())!.y;
    const x = (await center(item(page, 'd1'))).x;

    await pickUp(page, item(page, 'u3'));
    await glide(page, { x, y: boundary - 20 });
    await glide(page, { x, y: boundary + 3 }, 6);
    await expect(bottom.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'u3');
    await frames(page, 3);

    const before = await moves(page);
    for (let i = 0; i < 12; i++) {
      await page.mouse.move(x, boundary + (i % 2 ? 3 : -3));
      await frames(page);
    }
    expect(await moves(page)).toBe(before);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('state')).toHaveText(
      'left:l1,l2,l3,l4 | right:r1,r2,r3,r4 | top:u1,u2 | bottom:u3,d1,d2,d3',
    );
  });

  test('normal sorting is not slowed down by the hysteresis', async ({ page }) => {
    // Small steps through every neighbour: each crossing still moves the slot.
    await pickUp(page, item(page, 'l1'));
    const target = await center(item(page, 'l4'), 0.8);
    await glide(page, target, 30);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('state')).toHaveText(
      'left:l2,l3,l4,l1 | right:r1,r2,r3,r4 | top:u1,u2,u3 | bottom:d1,d2,d3',
    );
  });
});
