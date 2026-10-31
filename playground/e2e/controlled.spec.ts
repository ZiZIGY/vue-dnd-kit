import { expect, test, type Locator, type Page } from '@playwright/test';
import { center, dragTo, item, trackErrors, waitForIdle, type Point } from './helpers';

// The lists read a frozen store; each drop is applied from `event.result` after
// `event.preventDefault()`, once the pretend server (400 ms) saved it.
const INITIAL = 'todo:t1,t2,t3 | done:d1,d2 | archive:a1';

const state = (page: Page) => page.getByTestId('state');
const list = (page: Page, id: string) => page.locator(`[data-testid="${id}"]:not([data-dnd-overlay] *)`);
const order = (locator: Locator) =>
  locator.locator(':scope > [data-id]').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-id')));

/** `[vue-dnd-kit]` warnings for the whole test. */
const trackLibraryWarnings = (page: Page): string[] => {
  const warnings: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'warning' && message.text().startsWith('[vue-dnd-kit]')) warnings.push(message.text());
  });
  return warnings;
};

type LandingWindow = Window & { __landing?: Point | null; __landingWatch?: boolean };

/**
 * Call before releasing: records where the overlay's drop animation ends (its last
 * keyframe's translate, viewport px). The returned function waits for it.
 */
const watchLanding = async (page: Page): Promise<() => Promise<Point>> => {
  await page.evaluate(() => {
    const win = window as LandingWindow;
    win.__landing = null;
    if (win.__landingWatch) return;
    win.__landingWatch = true;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (this: Element, keyframes, options) {
      if (this.hasAttribute('data-dnd-overlay') && Array.isArray(keyframes)) {
        const last = String(keyframes[keyframes.length - 1]?.transform ?? '');
        const match = /translate3d\(([-\d.]+)px, ([-\d.]+)px/.exec(last);
        if (match) win.__landing = { x: Number(match[1]), y: Number(match[2]) };
      }
      return animate.call(this, keyframes, options);
    };
  });
  return async () => {
    const handle = await page.waitForFunction(() => (window as LandingWindow).__landing);
    return (await handle.jsonValue()) as Point;
  };
};

/** The overlay landed on `locator` as it is laid out now. */
const expectLandedOn = async (landing: Point, locator: Locator) => {
  const box = (await locator.boundingBox())!;
  expect(Math.abs(landing.x - box.x)).toBeLessThan(2);
  expect(Math.abs(landing.y - box.y)).toBeLessThan(2);
};

test.describe('controlled lists', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#controlled');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('a move between lists: result names both; applied before onBeforeDrop resolves, it lands in the new order', async ({
    page,
  }) => {
    const errors = trackErrors(page);
    const warnings = trackLibraryWarnings(page);
    await dragTo(page, item(page, 't1'), await center(item(page, 'd2'), 0.25), { release: false });
    await expect.poll(() => order(list(page, 'done'))).toEqual(['d1', 't1', 'd2']);
    const landed = await watchLanding(page);
    await page.mouse.up();
    // The drop waits for the server; the store hasn't changed yet.
    await expect(page.getByTestId('status')).toHaveText('dropping');
    await expect(page.getByTestId('result')).toHaveText('todo:t2,t3 | done:d1,t1,d2');
    await expect(state(page)).toHaveText(INITIAL);
    await waitForIdle(page);
    await expect(page.getByTestId('server')).toHaveText('saved: t1 to done');
    await expect(state(page)).toHaveText('todo:t2,t3 | done:d1,t1,d2 | archive:a1');
    expect(await order(list(page, 'done'))).toEqual(['d1', 't1', 'd2']);
    expect(await order(list(page, 'todo'))).toEqual(['t2', 't3']);
    await expectLandedOn(await landed(), item(page, 't1'));
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  test('prevented and never applied (the request failed): the lists stay and the card flies back', async ({ page }) => {
    const warnings = trackLibraryWarnings(page);
    await page.getByTestId('server-fails').check();
    await dragTo(page, item(page, 't1'), await center(item(page, 'd2'), 0.25), { release: false });
    await expect.poll(() => order(list(page, 'done'))).toEqual(['d1', 't1', 'd2']);
    const landed = await watchLanding(page);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('server')).toHaveText('failed: t1 to done');
    await expect(state(page)).toHaveText(INITIAL);
    expect(await order(list(page, 'todo'))).toEqual(['t1', 't2', 't3']);
    expect(await order(list(page, 'done'))).toEqual(['d1', 'd2']);
    await expectLandedOn(await landed(), item(page, 't1'));
    expect(warnings).toEqual([]);
  });

  test('a read-only list that never prevents: development builds warn and nothing changes', async ({ page }) => {
    const warnings = trackLibraryWarnings(page);
    await dragTo(page, item(page, 't2'), await center(item(page, 'a1'), 0.75), { release: false });
    await expect.poll(() => order(list(page, 'archive'))).toEqual(['a1', 't2']);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(INITIAL);
    expect(await order(list(page, 'todo'))).toEqual(['t1', 't2', 't3']);
    expect(await order(list(page, 'archive'))).toEqual(['a1']);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("A drop wasn't written");
    expect(warnings[0]).toContain('"archive"');
  });
});

test.describe('controlled tree', () => {
  const row = (page: Page, id: string) => page.locator(`[data-testid="folders"] [data-id="${id}"]`);

  test('withChildren keeps the class; the store takes the new tree in onDrop', async ({ page }) => {
    const errors = trackErrors(page);
    const warnings = trackLibraryWarnings(page);
    await page.goto('/demo/#controlled');
    await expect(page.getByTestId('tree')).toHaveText('src(components,main),docs(intro),assets,readme');
    // The tree sits below the lists: centered in the viewport, away from the auto-scroll edges.
    await page.getByTestId('folders').evaluate((element) => element.scrollIntoView({ block: 'center' }));
    // Into the middle of assets/.
    const target = await center(row(page, 'assets'));
    const start = await center(row(page, 'readme'));
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x, start.y + 6, { steps: 2 });
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await page.mouse.move(target.x, target.y, { steps: 25 });
    await expect(row(page, 'readme')).toHaveAttribute('data-depth', '1');
    const landed = await watchLanding(page);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('tree')).toHaveText('src(components,main),docs(intro),assets(readme)');
    await expect(page.getByTestId('tree-classes')).toHaveText('folders');
    await expect(row(page, 'readme')).toHaveAttribute('data-depth', '1');
    await expectLandedOn(await landed(), row(page, 'readme'));
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });
});
