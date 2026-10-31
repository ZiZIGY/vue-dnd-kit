import { expect, test, type Locator, type Page } from '@playwright/test';
import { center, item, layoutSettled, trackErrors, waitForIdle, type Point } from './helpers';

type Box = { x: number; y: number; width: number; height: number };

/** Overlay box size as laid out (transforms excluded). */
const overlaySize = (page: Page) =>
  page.locator('[data-dnd-overlay]').evaluate((element) => ({
    width: (element as HTMLElement).offsetWidth,
    height: (element as HTMLElement).offsetHeight,
  }));

const rowWidth = (page: Page, id: string) =>
  page.locator(`[data-id="${id}"]:not([data-dnd-overlay] *)`).evaluate((element) => (element as HTMLElement).offsetWidth);

/** Overlay box as shown (transforms included). */
const overlayBox = (page: Page): Promise<Box> =>
  page.locator('[data-dnd-overlay]').evaluate((element) => {
    const { x, y, width, height } = element.getBoundingClientRect();
    return { x, y, width, height };
  });

/** The overlay box on each of the next `count` frames. */
const overlayFrames = (page: Page, count: number): Promise<Box[]> =>
  page.evaluate(
    (count) =>
      new Promise<Box[]>((resolve) => {
        const element = document.querySelector('[data-dnd-overlay]')!;
        const boxes: Box[] = [];
        const tick = () => {
          const { x, y, width, height } = element.getBoundingClientRect();
          boxes.push({ x, y, width, height });
          if (boxes.length < count) requestAnimationFrame(tick);
          else resolve(boxes);
        };
        requestAnimationFrame(tick);
      }),
    count,
  );

const within = (actual: number, expected: number, tolerance: number) =>
  expect(Math.abs(actual - expected), `${actual} ≈ ${expected}`).toBeLessThanOrEqual(tolerance);

/**
 * The point at `ratio` of the box is under the pointer. Checked in pixels, not as a
 * fraction: WebKit rounds mouse coordinates, which a fraction of a small box magnifies.
 */
const expectHeldAt = (box: Box, ratio: Point, pointer: Point, tolerance = 1.5) => {
  within(box.x + box.width * ratio.x, pointer.x, tolerance);
  within(box.y + box.height * ratio.y, pointer.y, tolerance);
};

/** Presses at `ratio` of the element's box and moves past the activation distance; returns the press point. */
const grabAt = async (page: Page, locator: Locator, ratio: Point): Promise<Point> => {
  const box = (await locator.boundingBox())!;
  const point = { x: box.x + box.width * ratio.x, y: box.y + box.height * ratio.y };
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await page.mouse.move(point.x, point.y + 8, { steps: 2 });
  return point;
};

type DropStart = { first: Record<string, string>; before: Box; after: Box };

/**
 * Call before releasing. Records the overlay's drop animation as it starts: its first
 * keyframe, and the overlay box just before and just after the animation took over.
 */
const watchDropStart = (page: Page) =>
  page.evaluate(() => {
    const win = window as unknown as { __dropStart: DropStart | null };
    win.__dropStart = null;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (this: Element, keyframes, options) {
      if (!this.hasAttribute('data-dnd-overlay')) return animate.call(this, keyframes, options);
      const box = () => {
        const { x, y, width, height } = this.getBoundingClientRect();
        return { x, y, width, height };
      };
      const before = box();
      const animation = animate.call(this, keyframes, options);
      win.__dropStart = { first: (keyframes as Array<Record<string, string>>)[0]!, before, after: box() };
      return animation;
    };
  });

/** The drop animation starts exactly where the box was, and takes over without a jump. */
const expectDropFrom = async (page: Page, release: Box) => {
  const handle = await page.waitForFunction(() => (window as unknown as { __dropStart: DropStart | null }).__dropStart);
  const { first, before, after } = (await handle.jsonValue()) as DropStart;
  const [, left, top] = first.transform!.match(/translate3d\((-?[\d.]+)px, (-?[\d.]+)px/)!.map(Number);
  within(left!, release.x, 0.5);
  within(top!, release.y, 0.5);
  within(parseFloat(first.width!), release.width, 0.5);
  within(parseFloat(first.height!), release.height, 0.5);
  for (const key of ['x', 'y', 'width', 'height'] as const) {
    within(before[key], release[key], 0.5);
    within(after[key], release[key], 0.5);
  }
};

test.describe('overlay fits the slot (overlayFit: slot)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#tree');
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

test.describe('the overlay resizes around the pointer (overlayFit: slot)', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = trackErrors(page);
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
  });

  test('grabbed near the right edge of a wide card, the pointer keeps its place in a narrow box', async ({
    page,
  }) => {
    await page.goto('/demo/#overlay-fit');
    await expect(page.getByTestId('state-slot')).toHaveText('slot-narrow:sn1,sn2,sn3,sn4 | slot-wide:sw1,sw2,sw3');
    const source = (await item(page, 'sw1').boundingBox())!;
    const narrow = (await item(page, 'sn2').boundingBox())!;
    expect(source.width - narrow.width).toBeGreaterThan(100);

    const grab = { x: 0.9, y: 0.3 };
    await grabAt(page, item(page, 'sw1'), grab);
    const target = await center(item(page, 'sn2'));
    await page.mouse.move(target.x, target.y, { steps: 12 });
    await expect(page.getByTestId('slot-narrow').locator('[data-id="sw1"]')).toHaveCount(1);
    // On every frame of the resize, not only once it has settled.
    for (const box of await overlayFrames(page, 15)) expectHeldAt(box, grab, target);
    await expect.poll(async () => (await overlaySize(page)).width).toBe(Math.round(narrow.width));
    const release = await overlayBox(page);
    within(release.width, narrow.width, 1);
    within(release.height, narrow.height, 1);
    expectHeldAt(release, grab, target);

    await watchDropStart(page);
    await page.mouse.up();
    await expectDropFrom(page, release);
    await waitForIdle(page);
    await expect(page.getByTestId('state-slot')).toHaveText(/^slot-narrow:[\w,]*sw1[\w,]* \| slot-wide:sw2,sw3$/);
  });

  test('a multi-drag column grows around the grabbed card: the pointer stays over it, not the column', async ({
    page,
  }) => {
    await page.goto('/demo/#overlay-fit');
    await expect(page.getByTestId('state-slot')).toHaveText('slot-narrow:sn1,sn2,sn3,sn4 | slot-wide:sw1,sw2,sw3');
    for (const id of ['sn1', 'sn3']) await item(page, id).click({ modifiers: ['ControlOrMeta'] });
    const source = (await item(page, 'sn3').boundingBox())!;
    const tall = (await item(page, 'sw2').boundingBox())!;
    expect(tall.height - source.height).toBeGreaterThan(20);

    const grab = { x: 0.3, y: 0.7 };
    await grabAt(page, item(page, 'sn3'), grab);
    const column = page.locator('[data-dnd-overlay] [data-dnd-overlay-item]');
    await expect(column).toHaveCount(1);
    const target = await center(item(page, 'sw2'));
    await page.mouse.move(target.x, target.y, { steps: 12 });
    await expect(page.getByTestId('slot-wide').locator('[data-id="sn3"]')).toHaveCount(1);
    // The box is the grabbed card's part of the overlay; the column of the others (sn1,
    // above it) is laid out around the box and never shifts the grab point. The fraction
    // is fixed from the pointer as the browser reported it: Firefox and WebKit round it,
    // and the box growing to the taller slot magnifies that by up to ~2px. Holding the
    // column instead would be off by a whole card.
    const tolerance = 2.5;
    for (const box of await overlayFrames(page, 15)) expectHeldAt(box, grab, target, tolerance);
    await expect.poll(async () => (await overlaySize(page)).height).toBeGreaterThan(source.height + 20);
    await layoutSettled(page);
    const box = await overlayBox(page);
    expectHeldAt(box, grab, target, tolerance);
    const clone = (await column.boundingBox())!;
    expect(clone.y + clone.height).toBeLessThan(box.y);
    within(clone.height, box.height, 1);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('state-slot')).toHaveText(/^slot-narrow:sn2,sn4 \| slot-wide:[\w,]*sn1,sn3[\w,]*$/);
  });

  test('a keyboard drag into a list of narrower items puts the box exactly over the slot', async ({ page }) => {
    await page.goto('/demo/#overlay-fit');
    await expect(page.getByTestId('state-slot')).toHaveText('slot-narrow:sn1,sn2,sn3,sn4 | slot-wide:sw1,sw2,sw3');
    await item(page, 'sw1').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await page.keyboard.press('ArrowLeft');
    const slot = page.getByTestId('slot-narrow').locator('[data-id="sw1"]');
    await expect(slot).toHaveCount(1);
    await layoutSettled(page);
    const target = (await slot.boundingBox())!;
    await expect.poll(async () => (await overlaySize(page)).width).toBe(Math.round(target.width));
    const box = await overlayBox(page);
    for (const key of ['x', 'y', 'width', 'height'] as const) within(box[key], target[key], 1.5);
    await page.keyboard.press('Space');
    await waitForIdle(page);
    await expect(page.getByTestId('state-slot')).toHaveText(/^slot-narrow:[\w,]*sw1[\w,]* \| slot-wide:sw2,sw3$/);
  });

  test('entering the tree, the box takes the row width around the pointer; the depth projection is unchanged', async ({
    page,
  }) => {
    await page.goto('/demo/#tree');
    const source = page.locator('[data-testid="clipboard-list"] [data-id="notes"]');
    const sourceWidth = (await source.boundingBox())!.width;
    const treeWidth = await rowWidth(page, 'package');
    expect(Math.abs(treeWidth - sourceWidth)).toBeGreaterThan(20);

    const grab = { x: 0.9, y: 0.5 };
    await grabAt(page, source, grab);
    const entry = await center(page.locator('[data-testid="tree-root"] [data-id="package"]'), 0.3);
    await page.mouse.move(entry.x, entry.y, { steps: 30 });
    await expect(page.locator('[data-testid="tree-root"] [data-id="notes"]')).toHaveCount(1);
    await layoutSettled(page);
    // The same nesting as with a grab at the center (tree.spec.ts).
    const folder = await center(page.locator('[data-testid="tree-root"] [data-id="assets"]'));
    await page.mouse.move(folder.x, folder.y, { steps: 10 });
    await expect(page.getByTestId('projected')).toHaveText('1:assets');
    await expect.poll(async () => (await overlaySize(page)).width).toBe(treeWidth);
    const release = await overlayBox(page);
    expectHeldAt(release, grab, folder);

    await watchDropStart(page);
    await page.mouse.up();
    await expectDropFrom(page, release);
    await waitForIdle(page);
    await expect(page.getByTestId('tree')).toHaveText(
      'src(components(ui,button),main),docs(intro,guide),assets(notes),package,readme',
    );
  });
});

test('a thin custom placeholder passes its width, not its height', async ({ page }) => {
  // The kanban cards are the same size everywhere, so the overlay keeps the source size.
  await page.goto('/demo/#kanban');
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
