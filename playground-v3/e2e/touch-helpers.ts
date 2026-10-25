import { expect, type Locator, type Page } from '@playwright/test';
import { center, type Point } from './helpers';

/**
 * Real touch input through CDP (`Input.dispatchTouchEvent`). Unlike synthetic DOM
 * events it goes through Chromium's input pipeline: a swipe scrolls, `touch-action`
 * applies, a prevented touchmove stops the scroll and `touchcancel` becomes
 * `pointercancel`. Chromium only, so specs using it run in the `mobile` project
 * (tag them `@touch`).
 *
 * Every finger has its own touch id: CDP diffs the points of each call by id, so a
 * finger can go down, move and lift while the others stay where they are.
 */

export interface MoveOptions {
  /** Touchmoves to send. Default 10. */
  steps?: number;
  /** Pause after each touchmove in ms. Default 16, about one per frame like a real finger. */
  stepDelay?: number;
}

export interface Finger {
  readonly id: number;
  /** Current (or last) position of the finger. */
  readonly position: Point;
  readonly isDown: boolean;
  down(at: Point): Promise<void>;
  move(to: Point, options?: MoveOptions): Promise<void>;
  moveBy(dx: number, dy: number, options?: MoveOptions): Promise<void>;
  up(): Promise<void>;
}

export interface Touchscreen {
  /** A new finger. The first one to go down is the primary pointer. */
  finger(): Finger;
  /** `touchcancel` for every finger: the system took the gesture over (pointercancel). */
  cancel(): Promise<void>;
}

type TouchType = 'touchStart' | 'touchMove' | 'touchEnd' | 'touchCancel';

export const touchscreen = async (page: Page): Promise<Touchscreen> => {
  const cdp = await page.context().newCDPSession(page);
  const fingers = new Set<{ isDown: boolean }>();
  let nextId = 1;

  const send = (type: TouchType, points: Array<Point & { id: number }>) =>
    cdp.send('Input.dispatchTouchEvent', {
      type,
      touchPoints: points.map(({ x, y, id }) => ({ x, y, id })),
    });

  const finger = (): Finger => {
    const id = nextId++;
    let position: Point = { x: 0, y: 0 };
    const self: Finger & { isDown: boolean } = {
      id,
      isDown: false,
      get position() {
        return position;
      },
      async down(at) {
        if (self.isDown) throw new Error(`Finger ${id} is already down`);
        position = at;
        self.isDown = true;
        await send('touchStart', [{ ...at, id }]);
      },
      async move(to, { steps = 10, stepDelay = 16 } = {}) {
        if (!self.isDown) throw new Error(`Finger ${id} is not down`);
        const from = position;
        for (let i = 1; i <= steps; i++) {
          position = {
            x: from.x + ((to.x - from.x) * i) / steps,
            y: from.y + ((to.y - from.y) * i) / steps,
          };
          await send('touchMove', [{ ...position, id }]);
          if (stepDelay) await page.waitForTimeout(stepDelay);
        }
      },
      moveBy(dx, dy, options) {
        return self.move({ x: position.x + dx, y: position.y + dy }, options);
      },
      async up() {
        if (!self.isDown) throw new Error(`Finger ${id} is not down`);
        self.isDown = false;
        await send('touchEnd', [{ ...position, id }]);
      },
    };
    fingers.add(self);
    return self;
  };

  return {
    finger,
    async cancel() {
      for (const one of fingers) one.isDown = false;
      await send('touchCancel', []);
    },
  };
};

export const overlay = (page: Page): Locator => page.locator('[data-dnd-overlay]');

/** Puts the finger on `target` and holds it still until the drag has started. */
export const longPress = async (page: Page, finger: Finger, target: Locator | Point): Promise<Point> => {
  // A touch only lands inside the viewport (the playground nav can push rows below the fold).
  if (!('x' in target)) await target.scrollIntoViewIfNeeded();
  const point = 'x' in target ? target : await center(target);
  await finger.down(point);
  await expect(overlay(page)).toHaveCount(1);
  return point;
};

/** A quick swipe: no pause before moving, so it scrolls instead of dragging. */
export const swipe = async (finger: Finger, from: Point, to: Point, steps = 8): Promise<void> => {
  await finger.down(from);
  await finger.move(to, { steps, stepDelay: 8 });
  await finger.up();
};

export const windowScrollY = (page: Page): Promise<number> => page.evaluate(() => window.scrollY);

export const scrollTop = (locator: Locator): Promise<number> => locator.evaluate((element) => element.scrollTop);

export const scrollLeft = (locator: Locator): Promise<number> => locator.evaluate((element) => element.scrollLeft);

/**
 * Records every value an `<output>` shows from now on (a MutationObserver), so a test
 * can check intermediate states without racing them with fixed waits.
 */
export const recordOutput = async (locator: Locator, name: string): Promise<() => Promise<string[]>> => {
  await locator.evaluate((element, key) => {
    const values: string[] = [];
    (window as unknown as Record<string, string[]>)[key] = values;
    new MutationObserver(() => values.push(element.textContent ?? '')).observe(element, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }, name);
  return () => locator.page().evaluate((key) => [...(window as unknown as Record<string, string[]>)[key]!], name);
};

/** Position of the overlay's top-left corner, rounded to 0.1px. */
export const overlayOrigin = async (page: Page): Promise<Point> => {
  const box = await overlay(page).boundingBox();
  if (!box) throw new Error('No overlay');
  return { x: Math.round(box.x * 10) / 10, y: Math.round(box.y * 10) / 10 };
};
