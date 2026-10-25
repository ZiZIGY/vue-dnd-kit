import { expect, test, type Page } from '@playwright/test';
import { center, dragTo, glide, item, pickUp, trackErrors, waitForIdle } from './helpers';

const INITIAL = 'stack-a:a1,a2,a3,a4,a5,a6 | stack-b:b1,b2,b3 | gaps-a:g1,g2,g3,g4,g5,g6 | gaps-b:k1,k2,k3';
const state = (page: Page) => page.getByTestId('state');

const select = async (page: Page, ...ids: string[]) => {
  for (const id of ids) await item(page, id).click({ modifiers: ['ControlOrMeta'] });
};

/** Counts the clones that fly into the overlay when a stack collapses. */
const watchGhosts = (page: Page) =>
  page.evaluate(() => {
    const target = window as unknown as { __ghosts: number };
    target.__ghosts = 0;
    new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof Element && node.hasAttribute('data-dnd-ghost')) target.__ghosts++;
        }
      }
    }).observe(document.body, { childList: true });
  });

const ghosts = (page: Page) => page.evaluate(() => (window as unknown as { __ghosts: number }).__ghosts);

/** First `translate` keyframe of a layout animation on the item, within ~20 frames; null if none ran. */
const flyIn = (page: Page, id: string) =>
  page.evaluate(
    (key) =>
      new Promise<string | null>((resolve) => {
        let frames = 0;
        const check = () => {
          const element = document.querySelector(`[data-id="${key}"]:not([data-dnd-overlay] *)`);
          for (const animation of element?.getAnimations() ?? []) {
            const frame = (animation.effect as KeyframeEffect | null)?.getKeyframes()[0];
            if (frame && 'translate' in frame) return resolve(String(frame.translate));
          }
          if (++frames > 20) return resolve(null);
          requestAnimationFrame(check);
        };
        check();
      }),
    id,
  );

test.describe('multi-drag', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#multi');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test("'stack': the others collapse into the overlay and land after the active item", async ({ page }) => {
    const errors = trackErrors(page);
    await select(page, 'a2', 'a4');
    await watchGhosts(page);
    await pickUp(page, item(page, 'a2'));
    await expect(item(page, 'a4')).toHaveCount(0);
    expect(await ghosts(page)).toBe(1);
    // One card and a count, no column.
    await expect(page.locator('[data-dnd-overlay]')).toContainText('2');
    await expect(page.locator('[data-dnd-overlay] [data-dnd-overlay-item]')).toHaveCount(0);
    await glide(page, await center(item(page, 'a5'), 0.8));
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('stack-a:a1,a3,a5,a2,a4,a6');
    expect(errors).toEqual([]);
  });

  test("'stack': cancel flies the others back out of the overlay", async ({ page }) => {
    await select(page, 'a1', 'a3');
    await dragTo(page, item(page, 'a1'), await center(item(page, 'a5')), { release: false });
    await expect(item(page, 'a3')).toHaveCount(0);
    await page.keyboard.press('Escape');
    const from = await flyIn(page, 'a3');
    expect(from).not.toBeNull();
    expect(from).not.toBe('0px 0px');
    await waitForIdle(page);
    await page.mouse.up();
    await expect(state(page)).toHaveText(INITIAL);
  });

  test("'stack': several source lists insert in document order", async ({ page }) => {
    await select(page, 'b1', 'a2');
    await pickUp(page, item(page, 'a2'));
    // b1 collapsed out of list B: measure b2 once it has slid into place.
    await page.waitForTimeout(300);
    await glide(page, await center(item(page, 'b2'), 0.8));
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('stack-a:a1,a3,a4,a5,a6 | stack-b:b2,a2,b1,b3');
  });

  test("'gaps': the others stay put, dimmed, and gather at the drop", async ({ page }) => {
    await select(page, 'g1', 'g3');
    await dragTo(page, item(page, 'g1'), await center(item(page, 'g5'), 0.8), { release: false });
    await expect(item(page, 'g3')).toHaveAttribute('data-dnd-dragging', '');
    await expect(item(page, 'g1')).toHaveAttribute('data-dnd-placeholder', '');
    // The overlay shows both, in a column: g3 below the grabbed g1.
    const column = page.locator('[data-dnd-overlay] [data-dnd-overlay-item]');
    await expect(column).toHaveCount(1);
    await expect(column.locator('[data-id]')).toHaveAttribute('data-id', 'g3');
    const box = (await page.locator('[data-dnd-overlay]').boundingBox())!;
    const clone = (await column.boundingBox())!;
    expect(clone.y).toBeGreaterThan(box.y + box.height);
    expect(Math.abs(clone.x - box.x)).toBeLessThan(1);
    const order = () =>
      page.locator('[data-testid="gaps-a"] > [data-id]').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-id')));
    await expect.poll(order).toEqual(['g2', 'g3', 'g4', 'g5', 'g1', 'g6']);
    await page.mouse.up();
    // g3 slides to its new slot (FLIP), it isn't recreated.
    expect(await flyIn(page, 'g3')).not.toBeNull();
    await waitForIdle(page);
    await expect(state(page)).toContainText('gaps-a:g2,g4,g5,g1,g3,g6');
    await expect(item(page, 'g3')).not.toHaveAttribute('data-dnd-dragging');
  });

  test("'gaps': a selection across lists gathers in document order", async ({ page }) => {
    await select(page, 'k2', 'g4');
    await dragTo(page, item(page, 'k2'), await center(item(page, 'g1'), 0.2));
    await waitForIdle(page);
    await expect(state(page)).toContainText('gaps-a:g4,k2,g1,g2,g3,g5,g6 | gaps-b:k1,k3');
  });

  test('dragging an item outside the selection drags it alone', async ({ page }) => {
    await select(page, 'a1', 'a2');
    await dragTo(page, item(page, 'a5'), await center(item(page, 'a6'), 0.8));
    await waitForIdle(page);
    await expect(state(page)).toContainText('stack-a:a1,a2,a3,a4,a6,a5');
  });
});

test.describe('multi-drag with swap', () => {
  test("falls back to sorting (swap is single-item)", async ({ page }) => {
    await page.goto('/#swap');
    await select(page, 's1', 's3');
    await pickUp(page, item(page, 's1'));
    await page.waitForTimeout(300);
    await glide(page, await center(item(page, 's5'), 0.8));
    await page.mouse.up();
    await waitForIdle(page);
    // Multi-drag 'group' (the default): s3 travels with s1, which lands under the pointer.
    await expect(state(page)).toContainText('swap-list:s2,s4,s5,s6,s1,s3');
  });
});
