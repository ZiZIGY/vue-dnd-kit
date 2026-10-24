import { expect, type Locator, type Page } from '@playwright/test';

export type Point = { x: number; y: number };

/** Collects uncaught errors and console errors for the whole test. */
export const trackErrors = (page: Page): string[] => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
};

export const center = async (locator: Locator, yRatio = 0.5): Promise<Point> => {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Element is not visible');
  return { x: box.x + box.width / 2, y: box.y + box.height * yRatio };
};

/** Presses on `from`, moves past the activation distance, then glides to `to`. */
export const dragTo = async (
  page: Page,
  from: Locator,
  to: Point,
  { steps = 20, release = true }: { steps?: number; release?: boolean } = {},
): Promise<void> => {
  const start = await center(from);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 8, { steps: 2 });
  await page.mouse.move(to.x, to.y, { steps });
  if (release) await page.mouse.up();
};

/** Waits until the drop/return animation finished and the session is idle. */
export const waitForIdle = async (page: Page): Promise<void> => {
  await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
  await expect(page.locator('[data-dnd-placeholder]')).toHaveCount(0);
};

/** Collects `[Vue warn]` messages (duplicate keys, failed renders) for the whole test. */
export const trackVueWarnings = (page: Page): string[] => {
  const warnings: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'warning' && message.text().startsWith('[Vue warn]')) {
      warnings.push(message.text());
    }
  });
  return warnings;
};

/** Resolves after `count` animation frames: lets scroll events and virtualizers settle. */
export const nextFrames = (page: Page, count = 2): Promise<void> =>
  page.evaluate(
    (frames) =>
      new Promise<void>((resolve) => {
        const tick = (left: number) =>
          left ? requestAnimationFrame(() => tick(left - 1)) : resolve();
        tick(frames);
      }),
    count,
  );

/** Scrolls an element programmatically (no wheel events), then waits for a re-render. */
export const scrollElement = async (locator: Locator, top: number): Promise<void> => {
  await locator.evaluate((element, value) => (element.scrollTop = value), top);
  await nextFrames(locator.page(), 3);
};

/**
 * Waits for the overlay's drop animation and tells whether it flies to the dropped
 * item or fades out (the item isn't rendered or is scrolled out of view).
 */
export const dropAnimationKind = async (page: Page): Promise<'fly' | 'fade'> => {
  const handle = await page.waitForFunction(() => {
    const animation = document.querySelector('[data-dnd-overlay]')?.getAnimations()[0];
    if (!animation) return null;
    const frames = (animation.effect as KeyframeEffect | null)?.getKeyframes() ?? [];
    return frames.some((frame) => frame.opacity !== undefined) ? 'fade' : 'fly';
  });
  return (await handle.jsonValue()) as 'fly' | 'fade';
};
/** Element of a demo item by id (not its copy inside the overlay clone). */
export const item = (page: Page, id: string): Locator =>
  page.locator(`[data-id="${id}"]:not([data-dnd-overlay] *)`);

/** Presses on `from` and moves just past the activation distance, without going anywhere yet. */
export const pickUp = async (page: Page, from: Locator): Promise<Point> => {
  const start = await center(from);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 8, { steps: 2 });
  return { x: start.x, y: start.y + 8 };
};

/** Moves the held pointer to `to` in small steps (one per frame or so). */
export const glide = async (page: Page, to: Point, steps = 10): Promise<void> => {
  await page.mouse.move(to.x, to.y, { steps });
};

/** Lets a couple of frames run (rAF-batched collision, FLIP). */
export const frames = (page: Page, count = 2): Promise<void> =>
  page.evaluate(
    (n) =>
      new Promise<void>((resolve) => {
        let left = n;
        const tick = () => (--left <= 0 ? resolve() : requestAnimationFrame(tick));
        requestAnimationFrame(tick);
      }),
    count,
  );
