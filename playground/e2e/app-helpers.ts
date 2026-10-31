import { expect, type Locator, type Page } from '@playwright/test';
import { center, frames, type Point } from './helpers';

/**
 * Helpers for the example apps (`#app-*`). They build on `helpers.ts`, which stays
 * untouched. Points are always taken inside elements, away from their edges and
 * centers, so subpixel layout differences between browsers can't flip a result.
 */

/** Element by `data-id`, outside the drag overlay. */
export const byId = (page: Page, id: string): Locator => page.locator(`[data-id="${id}"]:not([data-dnd-overlay] *)`);

/** Element by `data-testid`, outside the drag overlay. */
export const byTestId = (page: Page, id: string): Locator =>
  page.locator(`[data-testid="${id}"]:not([data-dnd-overlay] *)`);

/** A point at the given fractions of the element's box (0.5/0.5 is the center). */
export const at = async (locator: Locator, xRatio: number, yRatio: number): Promise<Point> => {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Element is not visible');
  return { x: box.x + box.width * xRatio, y: box.y + box.height * yRatio };
};

/**
 * Glides the held pointer through `path` and comes to rest like a hand does: one
 * more pixel at the end, a couple of frames apart, so the last position is surely
 * processed before the next step of the test.
 */
export const glideTo = async (page: Page, path: Point | Point[], steps = 16): Promise<void> => {
  const points = Array.isArray(path) ? path : [path];
  for (const point of points) await page.mouse.move(point.x, point.y, { steps });
  const last = points[points.length - 1]!;
  await frames(page, 2);
  await page.mouse.move(last.x + 1, last.y);
  await frames(page, 2);
};

/** Presses on `from`, moves past the activation distance and glides along `path`, without releasing. */
export const hold = async (page: Page, from: Locator | Point, path: Point | Point[], steps = 16): Promise<void> => {
  const start = 'x' in from ? from : await center(from);
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 8, { steps: 2 });
  await glideTo(page, path, steps);
};

/** `hold`, then release. */
export const drag = async (page: Page, from: Locator | Point, path: Point | Point[], steps = 16): Promise<void> => {
  await hold(page, from, path, steps);
  await page.mouse.up();
};

/** A point level with `target` but `dx` px beside it: approach a list sideways, at the height you want. */
export const beside = (target: Point, dx: number): Point => ({ x: target.x + dx, y: target.y });

/** Ctrl/Cmd+clicks each element (multi-select recipe of the apps). */
export const ctrlClick = async (...locators: Locator[]): Promise<void> => {
  for (const locator of locators) await locator.click({ modifiers: ['ControlOrMeta'] });
};

/** Presses keys one by one, letting the keyboard sensor resolve each move. */
export const press = async (page: Page, ...keys: string[]): Promise<void> => {
  for (const key of keys) {
    await page.keyboard.press(key);
    await frames(page, 3);
  }
};

/** Waits until no drag session is left: no overlay, no placeholder. */
export const settled = async (page: Page): Promise<void> => {
  await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
  await expect(page.locator('[data-dnd-placeholder]')).toHaveCount(0);
};

type CommitWatchWindow = Window & { __afterCommit?: { frames: number; seen: string[] } };

/**
 * Call before releasing. From the frame the drop commits (the text of `state` changes)
 * until the overlay is gone, records the elements matching `feedback`: drag feedback
 * that would be computed against the data the drop has just changed. Returns how many
 * such frames ran and what was seen.
 */
export const watchAfterCommit = async (
  page: Page,
  state: string,
  feedback: string,
): Promise<() => Promise<{ frames: number; seen: string[] }>> => {
  await page.evaluate(
    ([state, feedback]) => {
      const win = window as CommitWatchWindow;
      const record = (win.__afterCommit = { frames: 0, seen: [] as string[] });
      const before = document.querySelector(state)?.textContent;
      const tick = () => {
        const committed = document.querySelector(state)?.textContent !== before;
        const flying = !!document.querySelector('[data-dnd-overlay]');
        if (committed && !flying) return;
        if (committed) {
          record.frames++;
          for (const element of document.querySelectorAll(feedback)) record.seen.push(element.outerHTML.slice(0, 120));
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    [state, feedback] as const,
  );
  return async () => {
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
    return page.evaluate(() => (window as CommitWatchWindow).__afterCommit!);
  };
};

/** Text of the live region of the provider that holds `within` (or the only one with text). */
export const liveRegion = (page: Page): Locator => page.locator('[role="status"][aria-live]');
