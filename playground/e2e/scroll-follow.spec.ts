import { expect, test, type Page } from '@playwright/test';
import { center, frames, glide, item, pickUp, trackErrors, waitForIdle } from './helpers';

// The overlay box is `position: fixed`, the lists scroll with the page: scrolling under a
// drag must not tear them apart, neither while dragging nor while the drop lands.

const state = (page: Page) => page.getByTestId('state');

/** Room to scroll the page by a few hundred pixels whatever the viewport. */
const makeRoom = (page: Page) => page.evaluate(() => (document.body.style.paddingBottom = '2000px'));

type Box = { left: number; top: number; width: number; height: number };
type Landing = { overlay: Box; slot: Box } | null;

/**
 * On release, scrolls the page by `by` once the overlay is flying (its drop animation
 * runs: the slot was measured before), and records the overlay and the dropped item's
 * element every frame until the overlay is gone. The returned function gives the last
 * frame the overlay was seen in.
 */
const scrollWhileLanding = async (page: Page, id: string, by: number): Promise<() => Promise<Landing>> => {
  await page.evaluate(
    ({ id, by }) => {
      const win = window as Window & { __landing?: unknown; __landed?: boolean };
      win.__landing = null;
      win.__landed = false;
      const box = (element: Element) => {
        const { left, top, width, height } = element.getBoundingClientRect();
        return { left, top, width, height };
      };
      let scrolled = false;
      const record = () => {
        const overlay = document.querySelector('[data-dnd-overlay]');
        const slot = document.querySelector(`[data-id="${id}"]:not([data-dnd-overlay] *)`);
        if (!overlay) {
          win.__landed = true;
          return;
        }
        if (!scrolled && overlay.getAnimations().some((animation) => animation.playState === 'running')) {
          scrolled = true;
          scrollBy(0, by);
        }
        if (slot && scrolled) win.__landing = { overlay: box(overlay), slot: box(slot) };
        requestAnimationFrame(record);
      };
      addEventListener('pointerup', () => requestAnimationFrame(record), { once: true, capture: true });
    },
    { id, by },
  );
  return async () => {
    await page.waitForFunction(() => (window as Window & { __landed?: boolean }).__landed);
    return page.evaluate(() => (window as Window & { __landing?: Landing }).__landing ?? null);
  };
};

test.describe('scrolling under a drag', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#lists');
    await makeRoom(page);
  });

  test('scrolled mid-flight, the dropped item lands on its slot where it is now', async ({ page }) => {
    const errors = trackErrors(page);
    await pickUp(page, item(page, 'h1'));
    const target = await center(item(page, 'h4'));
    await glide(page, { x: target.x + 30, y: target.y }, 15);
    const landed = await scrollWhileLanding(page, 'h1', 150);
    await page.mouse.up();
    const last = await landed();
    await waitForIdle(page);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThanOrEqual(150);
    // Its last frame is on the slot, which went 150px up mid-flight.
    expect(last).not.toBeNull();
    expect(Math.abs(last!.overlay.left - last!.slot.left)).toBeLessThan(4);
    expect(Math.abs(last!.overlay.top - last!.slot.top)).toBeLessThan(4);
    await expect(state(page)).toContainText('horizontal:h2,h3,h4,h1,h5,h6');
    expect(errors).toEqual([]);
  });

  test("`axis: 'x'`: the page scrolls, the drag stays on its row and keeps sorting", async ({ page }) => {
    const errors = trackErrors(page);
    await pickUp(page, item(page, 'h1'));
    await glide(page, { x: (await center(item(page, 'h1'))).x + 20, y: (await center(item(page, 'h1'))).y }, 4);
    await page.evaluate(() => scrollBy(0, 120));
    await frames(page, 3);
    // The overlay went up with the row: it covers the slot's row, not the old place on screen.
    const overlay = (await page.locator('[data-dnd-overlay]').boundingBox())!;
    const slot = (await page.locator('[data-dnd-placeholder]').boundingBox())!;
    expect(Math.abs(overlay.y - slot.y)).toBeLessThan(2);
    // The pointer is now 120px below the row; moving it along x still sorts.
    const target = await center(item(page, 'h4'));
    await glide(page, { x: target.x + 30, y: target.y + 120 }, 15);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('horizontal:h2,h3,h4,h1,h5,h6');
    expect(errors).toEqual([]);
  });
});
