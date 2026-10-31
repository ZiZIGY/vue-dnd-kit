import { expect, test, type Page } from '@playwright/test';
import { center, trackErrors, waitForIdle } from './helpers';

// Drags don't wait for landings: the next drag starts while the last overlay still flies
// home, each in its own box.

const INITIAL = 't1,t2,t3,t4,t5,t6,t7,t8';
const row = (page: Page, id: string) => page.locator(`[data-testid="list"] [data-id="${id}"]`);

/** The next landing runs ten times slower: it is still in flight on any machine. */
const slowNextLanding = (page: Page) =>
  page.evaluate(() =>
    addEventListener(
      'pointerup',
      () => {
        const slow = () => {
          const box = document.querySelector('[data-dnd-overlay]');
          const flying = box?.getAnimations() ?? [];
          if (!flying.length) return requestAnimationFrame(slow);
          flying.forEach((animation) => (animation.playbackRate = 0.1));
        };
        requestAnimationFrame(slow);
      },
      { once: true, capture: true },
    ),
  );
const isSlowed = (page: Page) =>
  page.waitForFunction(() => document.querySelector('[data-dnd-overlay]')?.getAnimations()[0]?.playbackRate === 0.1);

test.describe('the next drag during a landing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#sortable');
    await expect(page.getByTestId('order')).toHaveText(INITIAL);
  });

  test('starts at once, and both drops land where they go', async ({ page }) => {
    const errors = trackErrors(page);
    await slowNextLanding(page);
    // t1 below t4.
    const from = await center(row(page, 't1'));
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(from.x, from.y + 8, { steps: 2 });
    const below = await center(row(page, 't4'), 0.8);
    await page.mouse.move(below.x, below.y, { steps: 12 });
    await page.mouse.up();
    await isSlowed(page);
    // While t1 lands: t8 above t6, in a box of its own.
    const next = await center(row(page, 't8'));
    await page.mouse.move(next.x, next.y);
    await page.mouse.down();
    await page.mouse.move(next.x, next.y - 8, { steps: 2 });
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(2);
    const above = await center(row(page, 't6'), 0.2);
    await page.mouse.move(above.x, above.y, { steps: 12 });
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('order')).toHaveText('t2,t3,t4,t1,t5,t8,t6,t7');
    expect(errors).toEqual([]);
  });

  test('a press on the landing box catches it in flight, and it goes on from there', async ({ page }) => {
    const errors = trackErrors(page);
    await slowNextLanding(page);
    const from = await center(row(page, 't1'));
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(from.x, from.y + 8, { steps: 2 });
    const target = await center(row(page, 't6'), 0.8);
    await page.mouse.move(target.x + 120, target.y, { steps: 12 });
    await page.mouse.up();
    // Paused a fifth of the way home: it stays where it is measured until the press.
    await page.waitForFunction(() => {
      const flying = document.querySelector('[data-dnd-overlay]')?.getAnimations() ?? [];
      if (flying[0]?.playbackRate !== 0.1 || Number(flying[0].currentTime ?? 0) < 50) return false;
      flying.forEach((animation) => animation.pause());
      return true;
    });
    // Caught a little off the box's corner, mid-flight.
    const flying = (await page.locator('[data-dnd-overlay]').boundingBox())!;
    const press = { x: flying.x + 20, y: flying.y + 10 };
    await page.mouse.move(press.x, press.y);
    await page.mouse.down();
    await page.mouse.move(press.x + 10, press.y, { steps: 2 });
    // The same item, in a box that went on from where it was: no jump back to its slot.
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 't1');
    const caught = (await page.locator('[data-dnd-overlay]').boundingBox())!;
    expect(Math.abs(caught.x - (flying.x + 10))).toBeLessThan(4);
    expect(Math.abs(caught.y - flying.y)).toBeLessThan(4);
    // Dropped again, at the top.
    const top = await center(row(page, 't2'), 0.2);
    await page.mouse.move(top.x, top.y, { steps: 12 });
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('order')).toHaveText('t1,t2,t3,t4,t5,t6,t7,t8');
    expect(errors).toEqual([]);
  });
});
