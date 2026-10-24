import { expect, test, type Locator, type Page } from '@playwright/test';
import { center, item, trackErrors, waitForIdle, type Point } from './helpers';
import { longPress, overlay, scrollLeft, scrollTop, swipe, touchscreen, type Finger } from './touch-helpers';

// One column per screen in a horizontal scroller with `scroll-snap-type: x mandatory`;
// every column scrolls vertically on its own.
const TODO = Array.from({ length: 16 }, (_, i) => `a${i + 1}`).join(',');
const INITIAL = `todo:${TODO} | doing:b1,b2,b3 | done:`;

const boardState = (page: Page) => page.getByTestId('board');
const board = (page: Page) => page.getByTestId('board-scroller');
const column = (page: Page, id: string) => page.getByTestId(`scroller-${id}`);

const columnIds = async (page: Page, id: string): Promise<string[]> => {
  const text = (await boardState(page).textContent())!;
  const part = text.split(' | ').find((entry) => entry.startsWith(`${id}:`))!;
  return part.slice(id.length + 1).split(',').filter(Boolean);
};

/** Resolves as soon as `scrollLeft` reaches `value`: checked every frame, so the board doesn't overshoot by much. */
const waitForScrollLeft = (locator: Locator, value: number) =>
  locator.evaluate(
    (element, target) =>
      new Promise<void>((resolve, reject) => {
        const deadline = performance.now() + 15_000;
        const check = () => {
          if (element.scrollLeft >= target) resolve();
          else if (performance.now() > deadline) reject(new Error(`scrollLeft stuck at ${element.scrollLeft}`));
          else requestAnimationFrame(check);
        };
        check();
      }),
    value,
  );

/** Records the board's scrollLeft every frame; returns the largest single-frame jump. */
const recordBoardSteps = (page: Page) =>
  board(page).evaluate((element) => {
    const w = window as unknown as { __steps: number[] };
    w.__steps = [];
    let last = element.scrollLeft;
    const tick = () => {
      w.__steps.push(Math.abs(element.scrollLeft - last));
      last = element.scrollLeft;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
const largestBoardStep = (page: Page) =>
  page.evaluate(() => Math.max(0, ...(window as unknown as { __steps: number[] }).__steps));

/** Holds the card at the right screen edge until the board has scrolled `columns` columns, then comes back to the middle. */
const carryRight = async (page: Page, finger: Finger, columns: number): Promise<Point> => {
  const viewport = page.viewportSize()!;
  const width = (await board(page).boundingBox())!.width;
  const y = finger.position.y;
  await recordBoardSteps(page);
  await finger.move({ x: viewport.width - 6, y }, { steps: 12 });
  await waitForScrollLeft(board(page), width * (columns - 0.25));
  const middle = { x: viewport.width / 2, y };
  await finger.move(middle, { steps: 4, stepDelay: 0 });
  // Auto-scroll glides: scroll snapping must not turn each step into a whole column.
  expect(await largestBoardStep(page)).toBeLessThan(width / 3);
  return middle;
};

test.describe('touch: kanban @touch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#touch-kanban');
    await expect(boardState(page)).toHaveText(INITIAL);
  });

  test('one column per screen, snapped to the first one', async ({ page }) => {
    const viewport = page.viewportSize()!;
    const box = (await board(page).boundingBox())!;
    expect(box.x).toBe(0);
    expect(box.width).toBe(viewport.width);
    const todo = (await page.getByTestId('column-todo').boundingBox())!;
    expect(todo.width).toBeGreaterThan(viewport.width - 40);
    expect(await scrollLeft(board(page))).toBe(0);
    // The first column is taller than the screen: it scrolls on its own.
    const scroller = column(page, 'todo');
    expect(await scroller.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  });

  test('a sideways swipe on a card scrolls the board and does not drag', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    const start = await center(item(page, 'a2'));
    await swipe(finger, { x: start.x + 120, y: start.y }, { x: start.x - 120, y: start.y });
    // Whether the board then snaps is up to the browser: emulated swipes in headless
    // Chromium snap only sometimes, even on a plain scroller without any drag and drop.
    await expect.poll(() => scrollLeft(board(page))).toBeGreaterThan(150);
    await page.waitForTimeout(200);
    await expect(overlay(page)).toHaveCount(0);
    await expect(page.getByTestId('status')).toHaveText('idle');
    await expect(boardState(page)).toHaveText(INITIAL);
  });

  test('a card held at the right edge scrolls to the next column and drops into it', async ({ page }) => {
    const errors = trackErrors(page);
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, item(page, 'a1'));
    await expect(page.getByTestId('autoscrolling')).toHaveText('false');
    await carryRight(page, finger, 1);
    // Over the second column, between its cards.
    await finger.move(await center(item(page, 'b2'), 0.2), { steps: 6 });
    await expect(item(page, 'a1')).toHaveAttribute('data-dnd-placeholder', '');
    expect(await columnIds(page, 'doing')).toEqual(['b1', 'b2', 'b3']);
    await finger.up();
    await waitForIdle(page);

    expect(await columnIds(page, 'todo')).toEqual(TODO.split(',').slice(1));
    expect(await columnIds(page, 'doing')).toEqual(['b1', 'a1', 'b2', 'b3']);
    // The board snaps to the column the card was dropped into.
    const width = (await board(page).boundingBox())!.width;
    await expect.poll(() => scrollLeft(board(page))).toBe(width);
    const card = (await item(page, 'a1').boundingBox())!;
    expect(card.x).toBeGreaterThan(0);
    expect(card.x + card.width).toBeLessThan(width);
    expect(errors).toEqual([]);
  });

  test('a card reaches the empty last column across two screens', async ({ page }) => {
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, item(page, 'a3'));
    await carryRight(page, finger, 2);
    await finger.move(await center(column(page, 'done')), { steps: 6 });
    await finger.up();
    await waitForIdle(page);
    expect(await columnIds(page, 'done')).toEqual(['a3']);
    const width = (await board(page).boundingBox())!.width;
    await expect.poll(() => scrollLeft(board(page))).toBe(2 * width);
  });

  test('a card held at the left edge scrolls back to the previous column', async ({ page }) => {
    const width = (await board(page).boundingBox())!.width;
    await board(page).evaluate((element, left) => element.scrollTo({ left, behavior: 'instant' }), width);
    await expect.poll(() => scrollLeft(board(page))).toBe(width);
    const finger = (await touchscreen(page)).finger();
    const start = await longPress(page, finger, item(page, 'b3'));
    await finger.move({ x: 6, y: start.y }, { steps: 12 });
    await expect.poll(() => scrollLeft(board(page)), { timeout: 15_000 }).toBe(0);
    await finger.move(await center(item(page, 'a2'), 0.8), { steps: 6 });
    await finger.up();
    await waitForIdle(page);
    expect((await columnIds(page, 'todo')).slice(0, 3)).toEqual(['a1', 'a2', 'b3']);
    expect(await columnIds(page, 'doing')).toEqual(['b1', 'b2']);
    await expect.poll(() => scrollLeft(board(page))).toBe(0);
  });

  test('a card held at the bottom of a column scrolls the column', async ({ page }) => {
    const errors = trackErrors(page);
    const finger = (await touchscreen(page)).finger();
    const scroller = column(page, 'todo');
    const box = (await scroller.boundingBox())!;
    const start = await longPress(page, finger, item(page, 'a2'));
    await finger.move({ x: start.x, y: box.y + box.height - 6 }, { steps: 15 });
    await expect.poll(() => scrollTop(scroller), { timeout: 15_000 }).toBeGreaterThan(400);
    // The board itself doesn't move sideways meanwhile.
    expect(await scrollLeft(board(page))).toBe(0);
    await finger.move({ x: start.x, y: box.y + box.height / 2 }, { steps: 6 });
    await finger.up();
    await waitForIdle(page);
    const todo = await columnIds(page, 'todo');
    expect(todo.indexOf('a2')).toBeGreaterThan(6);
    expect(todo).toHaveLength(16);
    expect(errors).toEqual([]);
  });
});
