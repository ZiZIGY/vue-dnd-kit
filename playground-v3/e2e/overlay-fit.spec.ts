import { expect, test, type Page } from '@playwright/test';
import { center } from './helpers';

/** Overlay box size as laid out (transforms excluded). */
const overlaySize = (page: Page) =>
  page.locator('[data-dnd-overlay]').evaluate((element) => ({
    width: (element as HTMLElement).offsetWidth,
    height: (element as HTMLElement).offsetHeight,
  }));

const rowWidth = (page: Page, id: string) =>
  page.locator(`[data-id="${id}"]:not([data-dnd-overlay] *)`).evaluate((element) => (element as HTMLElement).offsetWidth);

test.describe('overlay fits the slot (overlayFit: slot)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#tree');
  });

  test('takes the width of the tree rows while hovering the tree, and drops without scaling', async ({
    page,
  }) => {
    const source = page.locator('[data-testid="clipboard-list"] [data-id="notes"]');
    const sourceWidth = await source.evaluate((element) => (element as HTMLElement).offsetWidth);
    const treeWidth = await rowWidth(page, 'src');
    expect(Math.abs(treeWidth - sourceWidth)).toBeGreaterThan(20);

    const start = await center(source);
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + 8, start.y, { steps: 2 });
    expect((await overlaySize(page)).width).toBeCloseTo(sourceWidth, 0);

    // Into the tree, between two rows: the slot is a tree row now.
    const target = await center(page.locator('[data-id="main"]:not([data-dnd-overlay] *)'), 0.8);
    await page.mouse.move(target.x, target.y, { steps: 15 });
    await expect.poll(async () => (await overlaySize(page)).width, { timeout: 2000 }).toBeCloseTo(treeWidth, 0);

    // The drop animation changes position and size, never `scale()`.
    await page.mouse.up();
    const keyframes = await page.waitForFunction(() => {
      const animation = document.querySelector('[data-dnd-overlay]')?.getAnimations()[0];
      return animation ? (animation.effect as KeyframeEffect).getKeyframes().map((frame) => String(frame.transform)) : null;
    });
    for (const transform of (await keyframes.jsonValue()) as string[]) expect(transform).not.toContain('scale');
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
  });
});

test('a thin custom placeholder passes its width, not its height', async ({ page }) => {
  // The kanban cards are the same size everywhere, so the overlay keeps the source size.
  await page.goto('/#kanban');
  const card = page.locator('[data-id="a1"]');
  const size = await card.evaluate((element) => ({
    width: (element as HTMLElement).offsetWidth,
    height: (element as HTMLElement).offsetHeight,
  }));
  const start = await center(card);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 8, { steps: 2 });
  await page.mouse.move(start.x + 340, start.y + 20, { steps: 10 });
  await expect.poll(async () => (await overlaySize(page)).width).toBeCloseTo(size.width, 0);
  expect((await overlaySize(page)).height).toBeCloseTo(size.height, 0);
  await page.mouse.up();
  await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
});
