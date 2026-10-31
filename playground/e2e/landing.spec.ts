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

type Step = { box: number; at: number; x: number; y: number; landing: boolean };

/** Records every overlay box's position every frame; returns the largest step a landing box made in one frame. */
const watchSteps = (page: Page) =>
  page.evaluate(() => {
    const win = window as Window & { __steps?: Step[] };
    const ids = new WeakMap<Element, number>();
    let next = 0;
    win.__steps = [];
    const tick = () => {
      for (const box of document.querySelectorAll('[data-dnd-overlay]')) {
        if (!ids.has(box)) ids.set(box, next++);
        const { left, top } = box.getBoundingClientRect();
        win.__steps!.push({ box: ids.get(box)!, at: performance.now(), x: left, y: top, landing: box.getAttribute('data-dnd-overlay') === 'dropping' });
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
const largestLandingStep = async (page: Page) => {
  const steps = await page.evaluate(() => (window as Window & { __steps?: Step[] }).__steps!);
  const last = new Map<number, Step>();
  let largest = 0;
  for (const step of steps) {
    const before = last.get(step.box);
    if (before?.landing) largest = Math.max(largest, Math.hypot(step.x - before.x, step.y - before.y));
    last.set(step.box, step);
  }
  return largest;
};

/**
 * Quick drags one after another, each past a neighbour or two: every landing box glides to its
 * slot while the next drags reorder the list. None jumps: not when the list reorders under it
 * (it slides along with its slot), not when another box comes or goes (a re-render doesn't
 * write its style back over an animation library's).
 */
for (const { name, page: url, list } of [
  { name: 'the default drop animation', page: '/demo/#sortable', list: '[data-testid="list"] [data-id]' },
  { name: 'GSAP', page: '/demo/#animation-libs', list: '[data-testid="gsap-list"] > *' },
  { name: 'motion', page: '/demo/#animation-libs', list: '[data-testid="motion-list"] > *' },
]) {
  test(`landing boxes glide while quick drags reorder the list (${name})`, async ({ page, browserName }) => {
    // Headless WebKit paints irregularly (a frame may take 40ms, and a box glides farther in
    // it), and motion's `translate` doesn't slide there: the rows themselves jump.
    test.skip(browserName === 'webkit', 'frame-by-frame steps need regular frames');
    const errors = trackErrors(page);
    await page.goto(url);
    const items = page.locator(list);
    await items.first().waitFor();
    await watchSteps(page);
    const count = await items.count();
    for (let i = 0; i < 10; i++) {
      const at = await center(items.nth((i * 2) % count));
      const way = i % 2 ? -1 : 1;
      await page.mouse.move(at.x, at.y);
      await page.mouse.down();
      await page.mouse.move(at.x + 3, at.y + 6 * way, { steps: 2 });
      await page.mouse.move(at.x + 8, at.y + 110 * way, { steps: 4 });
      await page.mouse.up();
      await page.waitForTimeout(30 + (i % 3) * 40);
    }
    await waitForIdle(page);
    // A row is ~40–70px: a jump to another slot (or back to where a box was dropped) is far
    // more than a landing box glides in one frame.
    expect(await largestLandingStep(page)).toBeLessThan(35);
    expect(errors).toEqual([]);
  });
}
