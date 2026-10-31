import { test as base, expect, type Locator, type Page } from '@playwright/test';
import { center, frames, type Point } from './helpers';

/**
 * Specs of the UI kit pages (kits/*.html). Every test fails on an uncaught error, a
 * console error, or a Vue or kit warning.
 */
export const test = base.extend<{ issues: string[] }>({
  issues: [
    async ({ page }, use) => {
      const issues: string[] = [];
      page.on('pageerror', (error) => issues.push(`pageerror: ${error.message}`));
      page.on('console', (message) => {
        const text = message.text();
        if (message.type() === 'error') issues.push(`error: ${text}`);
        if (message.type() === 'warning' && /^\[(Vue warn|Vuetify)\]/.test(text)) issues.push(`warning: ${text}`);
      });
      await use(issues);
      expect(issues).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** An element of the page by `data-id`, not its copy inside the overlay clone. */
export const byId = (scope: Page | Locator, id: string): Locator =>
  scope.locator(`[data-id="${id}"]:not([data-dnd-overlay] *)`);

/** A point inside `locator`: `x`/`y` ratios of its box. */
export const at = async (locator: Locator, x = 0.5, y = 0.5): Promise<Point> => {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Element is not visible');
  return { x: box.x + box.width * x, y: box.y + box.height * y };
};

/** Scrolls the page so that `locator` is in the middle of the screen, away from the auto-scroll edges. */
export const centerOnScreen = async (locator: Locator): Promise<void> => {
  await locator.evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await frames(locator.page(), 2);
};

/**
 * True when the page is no wider than the screen. A wider page makes a phone zoom out
 * to show all of it: everything gets tiny, and the page pans sideways under a finger.
 */
export const fitsScreen = (page: Page): Promise<boolean> =>
  page.evaluate(
    ({ width }) => window.innerWidth === width && document.documentElement.scrollWidth <= width,
    page.viewportSize()!,
  );

/** The default overlay content: the clone taken at drag start (a <table> wrapper for rows). */
export const overlayClone = (page: Page): Locator => page.locator('[data-dnd-overlay] > div > div > *').first();

/** Presses on `from`, moves past the activation distance, then glides to `to`. */
export const drag = async (
  page: Page,
  from: Locator,
  to: Point,
  { release = true, steps = 20 }: { release?: boolean; steps?: number } = {},
): Promise<void> => {
  const start = await center(from);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 8, { steps: 2 });
  await page.mouse.move(to.x, to.y, { steps });
  if (release) await page.mouse.up();
};

/** Presses on `from` and moves it by (dx, dy) without releasing: never far enough to land elsewhere. */
export const pressAndMove = async (page: Page, from: Locator, dx: number, dy: number): Promise<void> => {
  const start = await center(from);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + dx, start.y + dy, { steps: 6 });
};

/** Presses on `from` and activates the drag without leaving it (no reorder yet). */
export const grab = async (page: Page, from: Locator): Promise<Point> => {
  const start = await center(from);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 8, { steps: 2 });
  await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
  return { x: start.x, y: start.y + 8 };
};

/**
 * Moves the held pointer sideways until the overlay no longer overlaps `list`: the
 * list falls back to overlay intersection, so merely leaving it with the pointer
 * would still hover it.
 */
export const leaveSideways = async (page: Page, list: Locator, from: Point): Promise<void> => {
  const box = (await list.boundingBox())!;
  await page.mouse.move(box.x + 2 * box.width + 40, from.y, { steps: 6 });
};

/** Waits for the drop/return animation and the end of the session. */
export const waitForIdle = async (page: Page): Promise<void> => {
  await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
  await expect(page.locator('[data-dnd-placeholder]')).toHaveCount(0);
};

/** Presses `key` `times` times, one rendered frame apart (keyboard moves are async). */
export const press = async (page: Page, key: string, times = 1): Promise<void> => {
  for (let i = 0; i < times; i++) {
    await page.keyboard.press(key);
    await frames(page, 2);
  }
};

/** Waits for running CSS transitions and animations (kits animate colors on a theme switch). */
export const settle = async (page: Page): Promise<void> => {
  await page.waitForFunction(() => document.getAnimations().every((animation) => animation.playState !== 'running'));
};

/** `data-id` of the closest item around the focused element. */
export const focusedId = (page: Page): Promise<string | null> =>
  page.evaluate(() => document.activeElement?.closest('[data-id]')?.getAttribute('data-id') ?? null);

export interface Look {
  background: string;
  radius: string;
  color: string;
  font: string;
}

/** The computed styles that make a kit component look like itself. */
export const look = (locator: Locator): Promise<Look> =>
  locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      background: style.backgroundColor,
      radius: style.borderTopLeftRadius,
      color: style.color,
      font: style.fontFamily,
    };
  });

export const cssVariable = (locator: Locator, name: string): Promise<string> =>
  locator.evaluate((element, property) => getComputedStyle(element).getPropertyValue(property).trim(), name);
