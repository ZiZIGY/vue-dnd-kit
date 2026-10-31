import { expect, test, type Page } from '@playwright/test';
import { center, glide, item, pickUp, trackErrors, waitForIdle } from './helpers';

const INITIAL = 'seeds:s1,s2,s3 | garden:g1 | watered:';
const state = (page: Page) => page.getByTestId('state');
const overlay = (page: Page) => page.locator('[data-dnd-overlay]');
/** What the overlay shows: one of the demo's overlay components, by its kind. */
const shown = (page: Page, kind: string) => page.locator(`[data-dnd-overlay] [data-overlay-kind="${kind}"]`);

test.describe('targets shape the overlay (overlay-droplet)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#overlay-droplet');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('over the water a seed becomes a droplet; dropped, it splashes in place and the drop waits for it', async ({ page }) => {
    const errors = trackErrors(page);
    await pickUp(page, item(page, 's1'));
    await expect(shown(page, 'card')).toHaveCount(1);
    await glide(page, await center(page.getByTestId('zone-water')));
    await expect(shown(page, 'droplet')).toHaveCount(1);
    // The water leaves the seed's own overlay out.
    await expect(shown(page, 'card')).toHaveCount(0);

    // Every frame from the release on: how long the overlay stays, and where it is.
    await page.evaluate(() => {
      const frames: Array<{ at: number; left: number; top: number; splash: boolean }> = [];
      (window as unknown as { __frames: typeof frames }).__frames = frames;
      const start = performance.now();
      const tick = () => {
        const box = document.querySelector('[data-dnd-overlay]');
        if (!box) return;
        const rect = box.getBoundingClientRect();
        frames.push({ at: performance.now() - start, left: rect.left, top: rect.top, splash: !!box.querySelector('.ring') });
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await page.mouse.up();
    await waitForIdle(page);
    const frames = await page.evaluate(
      () => (window as unknown as { __frames: Array<{ at: number; left: number; top: number; splash: boolean }> }).__frames,
    );
    // `dropAnimation: false` on the water: no flight, the splash plays where it was dropped,
    // and the drop waits for it (0.45 s) before the overlay goes.
    expect(frames.some((frame) => frame.splash)).toBe(true);
    expect(frames.at(-1)!.at).toBeGreaterThan(380);
    const [first] = frames;
    expect(frames.every((frame) => frame.left === first!.left && frame.top === first!.top)).toBe(true);
    await expect(state(page)).toHaveText('seeds:s2,s3 | garden:g1 | watered:s1');
    expect(errors).toEqual([]);
  });

  test('over the garden the seed grows a sprout around its own overlay, which says the place it would take', async ({ page }) => {
    await pickUp(page, item(page, 's2'));
    await glide(page, await center(item(page, 'g1'), 0.8));
    await expect(shown(page, 'sprout')).toHaveCount(1);
    // The seed's own card is the sprout's slot.
    await expect(page.locator('[data-dnd-overlay] [data-overlay-kind="sprout"] [data-overlay-kind="card"]')).toHaveCount(1);
    await expect(shown(page, 'sprout')).toHaveAttribute('data-to', /^garden:\d$/);
    const index = Number((await shown(page, 'sprout').getAttribute('data-to'))!.split(':')[1]);

    await page.mouse.up();
    await waitForIdle(page);
    // The drop lands where `to` said.
    const garden = (await state(page).textContent())!.split(' | ')[1]!.replace('garden:', '').split(',');
    expect(garden[index]).toBe('s2');
  });

  test('a switched overlay ref (S) swaps the component mid-drag', async ({ page }) => {
    await pickUp(page, item(page, 's3'));
    await expect(shown(page, 'card')).toHaveCount(1);
    await page.keyboard.press('s');
    await expect(shown(page, 'chip')).toHaveCount(1);
    await expect(shown(page, 'card')).toHaveCount(0);
    await page.keyboard.press('s');
    await expect(shown(page, 'card')).toHaveCount(1);
    await expect(shown(page, 'chip')).toHaveCount(0);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('in the beds the overlay names the bed a plant would go into (`to` in a tree)', async ({ page }) => {
    await pickUp(page, item(page, 'rose'));
    await glide(page, await center(item(page, 'mint'), 0.25));
    await expect(page.getByTestId('plant-where')).toHaveText('into herbs');
    await expect(shown(page, 'plant')).toHaveAttribute('data-depth', '1');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('beds')).toHaveText(/^herbs\([^)]*rose[^)]*\),flowers\(\)$/);
  });
});
