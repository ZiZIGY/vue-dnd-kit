import { expect, test, type Locator, type Page } from '@playwright/test';
import { center, dragTo, trackErrors, waitForIdle, type Point } from './helpers';

const overlay = (page: Page) => page.locator('[data-dnd-overlay]');

/** Real touch input through CDP: goes through Chromium's gesture pipeline, so swipes scroll. */
const touchscreen = async (page: Page) => {
  const cdp = await page.context().newCDPSession(page);
  const send = (type: 'touchStart' | 'touchMove' | 'touchEnd' | 'touchCancel', point?: Point) =>
    cdp.send('Input.dispatchTouchEvent', { type, touchPoints: point ? [{ x: point.x, y: point.y }] : [] });
  let last: Point = { x: 0, y: 0 };
  return {
    start: (point: Point) => send('touchStart', (last = point)),
    async move(to: Point, steps = 10, stepDelay = 0) {
      const from = last;
      for (let i = 1; i <= steps; i++) {
        await send('touchMove', {
          x: from.x + ((to.x - from.x) * i) / steps,
          y: from.y + ((to.y - from.y) * i) / steps,
        });
        if (stepDelay) await page.waitForTimeout(stepDelay);
      }
      last = to;
    },
    end: () => send('touchEnd'),
    cancel: () => send('touchCancel'),
  };
};

const scrollTop = (locator: Locator) => locator.evaluate((element) => element.scrollTop);
const maxScrollTop = (locator: Locator) =>
  locator.evaluate((element) => element.scrollHeight - element.clientHeight);
const windowScrollY = (page: Page) => page.evaluate(() => window.scrollY);

test.describe('auto-scroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#autoscroll');
    await expect(page.getByTestId('scroll').locator('.row')).toHaveCount(60);
  });

  test('scrolls a scroller from its bottom edge and drops at the end', async ({ page }) => {
    const errors = trackErrors(page);
    const scroller = page.getByTestId('scroll-scroller');
    const box = (await scroller.boundingBox())!;
    const first = page.locator('[data-id="s1"]');
    await dragTo(page, first, { x: box.x + box.width / 2, y: box.y + box.height - 4 }, { release: false });
    await expect(page.getByTestId('autoscrolling')).toHaveText('true');
    const max = await maxScrollTop(scroller);
    await expect.poll(() => scrollTop(scroller), { timeout: 15_000 }).toBeGreaterThanOrEqual(max - 1);

    // Settle on the lower half of the last row, then drop.
    const last = await center(page.locator('[data-id="s60"]'), 0.8);
    await page.mouse.move(last.x, last.y, { steps: 3 });
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('autoscrolling')).toHaveText('false');
    await expect(page.getByTestId('scroll-order')).toHaveText(
      [...Array.from({ length: 59 }, (_, i) => `s${i + 2}`), 's1'].join(','),
    );
    expect(errors).toEqual([]);
  });

  test('scrolls the window from the viewport edge', async ({ page }) => {
    const first = page.locator('[data-id="p1"]');
    const start = await center(first);
    const viewport = page.viewportSize()!;
    await dragTo(page, first, { x: start.x, y: viewport.height - 2 }, { release: false });
    const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    expect(max).toBeGreaterThan(300);
    await expect.poll(() => windowScrollY(page), { timeout: 15_000 }).toBeGreaterThanOrEqual(max - 1);

    const last = await center(page.locator('[data-id="p40"]'), 0.8);
    await page.mouse.move(last.x, last.y, { steps: 3 });
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('page-order')).toHaveText(/,p40,p1$/);
  });

  test('an item picked up inside the edge zone does not scroll until moved toward the edge', async ({ page }) => {
    const scroller = page.getByTestId('scroll-scroller');
    const box = (await scroller.boundingBox())!;
    const zoneTop = box.y + box.height - 0.2 * box.height;
    // First fully visible row whose center lies in the bottom edge zone.
    let row: Locator | null = null;
    for (let i = 1; i <= 8 && !row; i++) {
      const candidate = page.locator(`[data-id="s${i}"]`);
      const point = await center(candidate);
      if (point.y > zoneTop + 4 && point.y < box.y + box.height - 12) row = candidate;
    }
    expect(row).not.toBeNull();

    const point = await center(row!);
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    // Activate sideways: no vertical intent yet.
    await page.mouse.move(point.x + 10, point.y, { steps: 3 });
    await expect(overlay(page)).toHaveCount(1);
    await page.waitForTimeout(500);
    expect(await scrollTop(scroller)).toBe(0);
    await expect(page.getByTestId('autoscrolling')).toHaveText('false');

    // Moving toward the edge unlocks it.
    await page.mouse.move(point.x + 10, point.y + 12, { steps: 3 });
    await expect.poll(() => scrollTop(scroller)).toBeGreaterThan(0);
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('scroll-order')).toHaveText(/^s1,s2,s3,/);
  });

  test('a list with autoScroll: false is not scrolled', async ({ page }) => {
    const scroller = page.getByTestId('noscroll-scroller');
    const box = (await scroller.boundingBox())!;
    await dragTo(page, page.locator('[data-id="n1"]'), { x: box.x + box.width / 2, y: box.y + box.height - 4 }, {
      release: false,
    });
    await page.waitForTimeout(600);
    expect(await scrollTop(scroller)).toBe(0);
    expect(await windowScrollY(page)).toBe(0);
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await waitForIdle(page);
  });
});

test.describe('touch', () => {
  test.use({ hasTouch: true });
  // Touch input is driven through CDP (Input.dispatchTouchEvent), which only Chromium has.
  test.skip(({ browserName }) => browserName !== 'chromium', 'CDP touch events are Chromium-only');

  test('a long press drags, and touchmove is prevented while dragging', async ({ page }) => {
    await page.goto('/#autoscroll');
    const errors = trackErrors(page);
    await page.evaluate(() => {
      const log: boolean[] = ((window as unknown as { __touchmoves: boolean[] }).__touchmoves = []);
      // Added after the sensor's listener, so it sees its verdict.
      window.addEventListener('touchmove', (event) => {
        if (document.querySelector('[data-dnd-overlay]')) log.push(event.defaultPrevented);
      });
    });
    const touch = await touchscreen(page);
    await touch.start(await center(page.locator('[data-id="p1"]')));
    await page.waitForTimeout(350);
    await expect(overlay(page)).toHaveCount(1);
    await touch.move(await center(page.locator('[data-id="p4"]'), 0.8), 12, 16);
    await touch.end();
    await waitForIdle(page);

    await expect(page.getByTestId('page-order')).toHaveText(/^p2,p3,p4,p1,p5,/);
    expect(await windowScrollY(page)).toBe(0);
    const prevented = await page.evaluate(() => (window as unknown as { __touchmoves: boolean[] }).__touchmoves);
    expect(prevented.length).toBeGreaterThan(0);
    expect(prevented.every(Boolean)).toBe(true);
    expect(errors).toEqual([]);
  });

  test('a quick swipe scrolls the page and does not drag', async ({ page }) => {
    await page.goto('/#autoscroll');
    const touch = await touchscreen(page);
    const start = await center(page.locator('[data-id="p8"]'));
    await touch.start(start);
    await touch.move({ x: start.x, y: start.y - 300 }, 10);
    await touch.end();
    await expect.poll(() => windowScrollY(page)).toBeGreaterThan(100);
    await page.waitForTimeout(300);
    await expect(overlay(page)).toHaveCount(0);
    await expect(page.getByTestId('page-order')).toHaveText(/^p1,p2,p3,/);
  });

  test('touchcancel (pointercancel) cancels the drag', async ({ page }) => {
    await page.goto('/#autoscroll');
    const touch = await touchscreen(page);
    await touch.start(await center(page.locator('[data-id="p1"]')));
    await page.waitForTimeout(350);
    await touch.move(await center(page.locator('[data-id="p4"]'), 0.8), 8, 16);
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'p1');
    await touch.cancel();
    await waitForIdle(page);
    await expect(page.getByTestId('page-order')).toHaveText(/^p1,p2,p3,p4,/);
  });

  test('the long press reports activation progress', async ({ page }) => {
    await page.goto('/#free');
    // Record every rendered value: a fixed wait could land past the 200ms delay on a busy machine.
    await page.getByTestId('progress').evaluate((output) => {
      const values: number[] = ((window as unknown as { __progress: number[] }).__progress = []);
      new MutationObserver(() => values.push(Number(output.textContent))).observe(output, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    });
    const touch = await touchscreen(page);
    await touch.start(await center(page.locator('[data-id="blue"]')));
    await expect(overlay(page)).toHaveCount(1);
    const values = await page.evaluate(() => (window as unknown as { __progress: number[] }).__progress);
    expect(values.some((value) => value > 0 && value < 1)).toBe(true);
    expect(values.at(-1)).toBe(1);
    await touch.end();
    await waitForIdle(page);
    await expect(page.getByTestId('progress')).toHaveText('0.00');
  });
});

test.describe('pointer sensor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#free');
    await expect(page.getByTestId('free-state')).toHaveText('red:40,40 blue:160,40 free:30,150 shift:240,200');
  });

  const piece = (page: Page, id: string) => page.locator(`[data-id="${id}"]`);

  test('distance activation reports progress, captures the pointer on body', async ({ page }) => {
    await page.evaluate(() => {
      document.addEventListener('pointerdown', (event) => {
        (window as unknown as { __pointerId: number }).__pointerId = event.pointerId;
      });
    });
    const capture = () =>
      page.evaluate(() =>
        document.body.hasPointerCapture((window as unknown as { __pointerId: number }).__pointerId),
      );
    const point = await center(piece(page, 'blue'));
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    await page.mouse.move(point.x + 2, point.y);
    await expect(page.getByTestId('progress')).toHaveText('0.50');
    await expect(overlay(page)).toHaveCount(0);
    await page.mouse.move(point.x + 6, point.y);
    await expect(overlay(page)).toHaveCount(1);
    expect(await capture()).toBe(true);
    await page.mouse.up();
    await waitForIdle(page);
    expect(await capture()).toBe(false);
  });

  test('a press on an interactive child does not drag', async ({ page }) => {
    const button = page.getByTestId('piece-button');
    const point = await center(button);
    await page.mouse.move(point.x, point.y);
    await page.mouse.down();
    await page.mouse.move(point.x + 40, point.y + 40, { steps: 5 });
    await expect(overlay(page)).toHaveCount(0);
    await page.mouse.up();
    await expect(page.getByTestId('free-state')).toHaveText(/free:30,150/);
  });

  test('canDrag gates the drag (Shift held)', async ({ page }) => {
    const target = await center(page.getByTestId('board'), 0.2);
    await dragTo(page, piece(page, 'shift'), target, { release: false });
    await expect(overlay(page)).toHaveCount(0);
    await page.mouse.up();

    await page.keyboard.down('Shift');
    await dragTo(page, piece(page, 'shift'), target, { release: false });
    await expect(overlay(page)).toHaveCount(1);
    await page.mouse.up();
    await page.keyboard.up('Shift');
    await waitForIdle(page);
    await expect(page.getByTestId('free-state')).not.toHaveText(/shift:240,200/);
  });

  test('the click after a drop is swallowed, a plain click is not', async ({ page }) => {
    await page.evaluate(() => {
      const w = window as unknown as { __clicks: number };
      w.__clicks = 0;
      document.addEventListener('click', () => w.__clicks++);
    });
    const clicks = () => page.evaluate(() => (window as unknown as { __clicks: number }).__clicks);

    await piece(page, 'free').click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId('clicks')).toHaveText('1');
    expect(await clicks()).toBe(1);

    // Drop, and a drag cancelled with Escape: neither ends in a click.
    await dragTo(page, piece(page, 'free'), await center(page.getByTestId('board'), 0.8));
    await waitForIdle(page);
    await dragTo(page, piece(page, 'red'), await center(page.getByTestId('board'), 0.8), { release: false });
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await waitForIdle(page);
    expect(await clicks()).toBe(1);
    await expect(page.getByTestId('clicks')).toHaveText('1');

    await piece(page, 'blue').click();
    expect(await clicks()).toBe(2);
  });

  test('hiding the tab cancels the drag', async ({ page }) => {
    await dragTo(page, piece(page, 'red'), await center(page.getByTestId('zone-any')), { release: false });
    await expect(page.getByTestId('zone-any')).toHaveClass(/over/);
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));
      delete (document as unknown as { visibilityState?: string }).visibilityState;
    });
    await waitForIdle(page);
    await page.mouse.up();
    await expect(page.getByTestId('free-state')).toHaveText(/red:40,40/);
  });
});

test.describe('keyboard free drag', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#free');
    await expect(page.getByTestId('free-state')).toHaveText('red:40,40 blue:160,40 free:30,150 shift:240,200');
  });

  test("'droppables' mode jumps between accepting zones and restores focus", async ({ page }) => {
    const errors = trackErrors(page);
    const red = page.locator('[data-id="red"]');
    await red.focus();
    await page.keyboard.press('Space');
    await expect(overlay(page)).toHaveCount(1);
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('zone-red')).toHaveClass(/over/);
    // Blues only doesn't accept red: the jump skips it.
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('zone-any')).toHaveClass(/over/);
    await page.keyboard.press('ArrowUp');
    await expect(page.getByTestId('zone-red')).toHaveClass(/over/);
    await page.keyboard.press('ArrowDown');
    await expect(page.getByTestId('zone-any')).toHaveClass(/over/);
    await page.keyboard.press('Enter');
    await waitForIdle(page);
    await expect(page.getByTestId('free-state')).toHaveText(/red:zone-any/);
    // The element was recreated inside the zone; focus follows the id.
    await expect(page.locator('[data-id="red"]')).toBeFocused();
    expect(errors).toEqual([]);
  });

  test("'pixels' mode moves by the step and snaps to the grid", async ({ page }) => {
    await page.locator('[data-id="free"]').focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');
    await waitForIdle(page);
    const [, x, y] = (await page.getByTestId('free-state').textContent())!.match(/free:(-?\d+),(-?\d+)/)!.map(Number);
    expect(x! % 20).toBe(0);
    expect(y! % 20).toBe(0);
    expect(x).toBeGreaterThanOrEqual(70);
    // The piece starts at y=150, exactly half a 20px cell: subpixel layout differences
    // make browsers round the start to 140 or 160, so only require one cell down.
    expect(y).toBeGreaterThanOrEqual(160);
    await expect(page.locator('[data-id="free"]')).toBeFocused();
  });

  test('rebound start key, repeated keydown ignored, Escape cancels', async ({ page }) => {
    const blue = page.locator('[data-id="blue"]');
    // An auto-repeated start key never picks up.
    await blue.evaluate((element) =>
      element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', repeat: true, bubbles: true })),
    );
    await expect(overlay(page)).toHaveCount(0);

    await blue.focus();
    await page.keyboard.press('g');
    await expect(overlay(page)).toHaveCount(1);
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('zone-blue')).toHaveClass(/over/);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await expect(page.getByTestId('free-state')).toHaveText(/blue:160,40/);
    await expect(blue).toBeFocused();
  });
});

test.describe('snap to grid', () => {
  test('the overlay glides along the board grid and lands on it', async ({ page }) => {
    await page.goto('/#free');
    const board = (await page.getByTestId('board').boundingBox())!;
    const start = await center(page.locator('[data-id="free"]'));
    await dragTo(page, page.locator('[data-id="free"]'), { x: start.x + 33, y: start.y + 47 }, { release: false });
    await expect(overlay(page)).toHaveCSS('transition-property', /(^|, )transform(,|$)/);
    await page.waitForTimeout(150);
    const box = (await overlay(page).boundingBox())!;
    expect(Math.round(box.x - board.x) % 20).toBe(0);
    expect(Math.round(box.y - board.y) % 20).toBe(0);
    await page.mouse.up();
    // The glide is gone before the drop animation starts.
    await expect(overlay(page)).not.toHaveCSS('transition-property', /(^|, )transform(,|$)/);
    await waitForIdle(page);
    await expect(page.getByTestId('free-state')).toHaveText(/free:60,200/);
  });
});
