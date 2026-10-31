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
    // A frame must have seen the pointer in the right list: WebKit can deliver the
    // whole glide and the move back within one frame, and then no crossing happened.
    await expect(right.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'l1');
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

  test('the frame right after a cross-list move is not dropped when the pointer stops there', async ({ page }) => {
    // Some engines (WebKit) deliver a whole pointer glide within a frame or two. If the
    // frame after a cross-list move carries the final position and is skipped, nothing
    // re-evaluates it: the target only follows pointer movement.
    await page.evaluate(() => {
      document.addEventListener(
        'pointerdown',
        (event) => ((window as unknown as { __pointerId: number }).__pointerId = event.pointerId),
        { capture: true, once: true },
      );
    });
    await pickUp(page, item(page, 'l1'));
    const entry = await center(item(page, 'r1'), 0.3);
    const final = await center(item(page, 'r3'), 0.8);
    await page.evaluate(
      async ({ entry, final }) => {
        const pointerId = (window as unknown as { __pointerId: number }).__pointerId;
        const move = (x: number, y: number) =>
          document.dispatchEvent(
            new PointerEvent('pointermove', { pointerId, clientX: x, clientY: y, bubbles: true, isPrimary: true, pointerType: 'mouse' }),
          );
        const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
        // Frame N: the item enters the right list.
        move(entry.x, entry.y);
        await frame();
        // Frame N+1: the final position, in one burst; the pointer then stays still.
        move(final.x, (entry.y + final.y) / 2);
        move(final.x, final.y);
        await frame();
        await frame();
      },
      { entry, final },
    );
    await expect(page.locator('[data-testid="right"] [data-dnd-placeholder]')).toHaveAttribute('data-id', 'l1');
    // `final` was measured before l1 entered at the top and pushed the rows down one
    // slot, so it is now in r2's lower half: l1 follows to after r2. Had frame N+1
    // been dropped, l1 would still be first.
    const order = await page
      .locator('[data-testid="right"] > [data-id]')
      .evaluateAll((rows) => rows.map((row) => row.getAttribute('data-id')));
    expect(order).toEqual(['r1', 'r2', 'l1', 'r3', 'r4']);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('state')).toHaveText(
      'left:l2,l3,l4 | right:r1,r2,l1,r3,r4 | top:u1,u2,u3 | bottom:d1,d2,d3',
    );
  });

  test('a pointer that skips items within one frame still lands next to the hovered item', async ({ page }) => {
    await page.evaluate(() => {
      document.addEventListener(
        'pointerdown',
        (event) => ((window as unknown as { __pointerId: number }).__pointerId = event.pointerId),
        { capture: true, once: true },
      );
    });
    const target = await center(item(page, 'l1'), 0.75);
    await pickUp(page, item(page, 'l4'));
    await page.evaluate(async (to) => {
      const pointerId = (window as unknown as { __pointerId: number }).__pointerId;
      const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
      // The whole upward glide arrives before the next frame (as in WebKit).
      document.dispatchEvent(
        new PointerEvent('pointermove', { pointerId, clientX: to.x, clientY: to.y, bubbles: true, isPrimary: true, pointerType: 'mouse' }),
      );
      await frame();
      await frame();
    }, target);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('state')).toHaveText(
      'left:l1,l4,l2,l3 | right:r1,r2,r3,r4 | top:u1,u2,u3 | bottom:d1,d2,d3',
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
