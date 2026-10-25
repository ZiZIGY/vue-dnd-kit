import { expect, test, type Locator, type Page } from '@playwright/test';
import { layoutSettled, trackErrors, trackVueWarnings, watchDropAnimation } from './helpers';
import { at, byId, ctrlClick, drag, glideTo, hold, liveRegion, press, settled } from './app-helpers';

const LIST = 'combine-list:a1,a2,g1[],a3,g2[],a4,gl[],a5';
const GRID = 'combine-grid:b1,b2,h1[],b3,b4,h2[],b5,b6';
const state = (page: Page) => page.getByTestId('state');
/** Ids of a list's rows, in the order shown. */
const order = async (page: Page, list: string) =>
  (
    await page
      .getByTestId(list)
      .locator(':scope > [data-id]')
      .evaluateAll((elements) => elements.map((element) => element.getAttribute('data-id')))
  ).join(',');

type IntoWindow = Window & { __into?: { transform: string; opacity: string; width: number; height: number } | null };

/**
 * Call before releasing: records the last keyframe of the overlay's drop animation and
 * the overlay's size. Resolves to where the overlay ends (its scaled box's center) and how.
 */
const watchInto = async (page: Page) => {
  await page.evaluate(() => {
    const win = window as IntoWindow;
    win.__into = null;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (this: HTMLElement, keyframes, options) {
      if (this.hasAttribute('data-dnd-overlay') && Array.isArray(keyframes)) {
        const last = keyframes[keyframes.length - 1] as Keyframe;
        win.__into = {
          transform: String(last.transform ?? ''),
          opacity: String(last.opacity ?? ''),
          width: this.offsetWidth,
          height: this.offsetHeight,
        };
      }
      return animate.call(this, keyframes, options);
    };
  });
  return async () => {
    const handle = await page.waitForFunction(() => (window as IntoWindow).__into);
    const into = (await handle.jsonValue())!;
    const match = /translate3d\(([-\d.e]+)px, ([-\d.e]+)px, 0(?:px)?\)(?: scale\(([\d.]+)\))?/.exec(into.transform)!;
    const scale = Number(match[3] ?? 1);
    return {
      opacity: into.opacity,
      scale,
      center: { x: Number(match[1]) + (into.width * scale) / 2, y: Number(match[2]) + (into.height * scale) / 2 },
    };
  };
};

const expectInside = async (locator: Locator, point: { x: number; y: number }) => {
  const box = (await locator.boundingBox())!;
  expect(point.x).toBeGreaterThan(box.x);
  expect(point.x).toBeLessThan(box.x + box.width);
  expect(point.y).toBeGreaterThan(box.y);
  expect(point.y).toBeLessThan(box.y + box.height);
};

test.describe('drop into an item', () => {
  let errors: string[];
  let warnings: string[];

  test.beforeEach(async ({ page }) => {
    errors = trackErrors(page);
    warnings = trackVueWarnings(page);
    await page.goto('/#combine');
    await expect(state(page)).toHaveText(`${LIST} | ${GRID}`);
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  test("a group's middle takes the task: the list doesn't reorder for it, the overlay shrinks into it", async ({
    page,
  }) => {
    // Down from a1 into g1's middle: a1 passes a2 on the way (unless the browser
    // coalesced the glide into one frame there), but never g1.
    await hold(page, byId(page, 'a1'), await at(byId(page, 'g1'), 0.5, 0.5));
    await expect(byId(page, 'g1')).toHaveAttribute('data-target');
    expect(await order(page, 'combine-list')).toMatch(/^(a2,a1|a1,a2),g1,a3,g2,a4,gl,a5$/);
    // Every group that takes tasks shows it; the locked one doesn't.
    await expect(byId(page, 'g2')).toHaveAttribute('data-accepting');
    await expect(byId(page, 'gl')).not.toHaveAttribute('data-accepting');

    const landing = await watchInto(page);
    await page.mouse.up();
    const into = await landing();
    expect(into.opacity).toBe('0');
    expect(into.scale).toBeLessThan(0.5);
    await settled(page);
    await expect(state(page)).toHaveText(`combine-list:a2,g1[a1],a3,g2[],a4,gl[],a5 | ${GRID}`);
    // Into g1, where it is after the drop (one row up), as the animation measured it.
    await expectInside(byId(page, 'g1'), into.center);
  });

  test('near the edges of a group the list sorts past it', async ({ page }) => {
    // Through g1's middle on to its bottom edge: after it.
    await drag(page, byId(page, 'a1'), [await at(byId(page, 'g1'), 0.5, 0.5), await at(byId(page, 'g1'), 0.5, 0.88)]);
    await settled(page);
    await expect(state(page)).toHaveText(`combine-list:a2,g1[],a1,a3,g2[],a4,gl[],a5 | ${GRID}`);
    // Up from a4 to the top edge of g2: before it, through its middle.
    await hold(page, byId(page, 'a4'), await at(byId(page, 'g2'), 0.5, 0.12));
    await expect(byId(page, 'g2')).not.toHaveAttribute('data-target');
    expect(await order(page, 'combine-list')).toBe('a2,g1,a1,a3,a4,g2,gl,a5');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toHaveText(`combine-list:a2,g1[],a1,a3,a4,g2[],gl[],a5 | ${GRID}`);
  });

  test('a group that takes nothing, or a group dragged over one, just sorts', async ({ page }) => {
    // a5 up into the middle of the locked group, just above its center: before it.
    await hold(page, byId(page, 'a5'), await at(byId(page, 'gl'), 0.5, 0.4));
    await expect(byId(page, 'gl')).not.toHaveAttribute('data-target');
    expect(await order(page, 'combine-list')).toBe('a1,a2,g1,a3,g2,a4,a5,gl');
    await page.mouse.up();
    await settled(page);
    // g1 down over the middle of g2, below its center: groups take tasks only.
    await hold(page, byId(page, 'g1'), await at(byId(page, 'g2'), 0.5, 0.6));
    await expect(byId(page, 'g2')).not.toHaveAttribute('data-accepting');
    await expect(byId(page, 'g2')).not.toHaveAttribute('data-target');
    expect(await order(page, 'combine-list')).toBe('a1,a2,a3,g2,g1,a4,a5,gl');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toHaveText(`combine-list:a1,a2,a3,g2[],g1[],a4,a5,gl[] | ${GRID}`);
  });

  test('a selection goes in whole, in list order', async ({ page }) => {
    await ctrlClick(byId(page, 'a5'), byId(page, 'a2'));
    // The selection gathers at a5 on pickup: aim at g1 once the list has settled.
    await hold(page, byId(page, 'a5'), await at(byId(page, 'a5'), 0.5, 0.2));
    await layoutSettled(page);
    await glideTo(page, await at(byId(page, 'g1'), 0.5, 0.5));
    await expect(byId(page, 'g1')).toHaveAttribute('data-target');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toHaveText(`combine-list:a1,g1[a2,a5],a3,g2[],a4,gl[] | ${GRID}`);
  });

  test('cancelling over a group, or a group refusing the drop, flies the task back', async ({ page }) => {
    await hold(page, byId(page, 'a1'), await at(byId(page, 'g1'), 0.5, 0.5));
    await expect(byId(page, 'g1')).toHaveAttribute('data-target');
    const cancelled = await watchDropAnimation(page);
    await page.keyboard.press('Escape');
    expect(await cancelled()).toBe('fly');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toHaveText(`${LIST} | ${GRID}`);

    // H2 holds one task: a second one is refused on drop.
    await drag(page, byId(page, 'b1'), await at(byId(page, 'h2'), 0.5, 0.5));
    await settled(page);
    await expect(state(page)).toContainText('combine-grid:b2,h1[],b3,b4,h2[b1],b5,b6');
    await hold(page, byId(page, 'b6'), await at(byId(page, 'h2'), 0.5, 0.5));
    await expect(byId(page, 'h2')).toHaveAttribute('data-target');
    const refused = await watchDropAnimation(page);
    await page.mouse.up();
    expect(await refused()).toBe('fly');
    await settled(page);
    await expect(state(page)).toContainText('combine-grid:b2,h1[],b3,b4,h2[b1],b5,b6');
  });

  test("grid: a group's left and right edges put the item beside it, so its middle never runs away", async ({
    page,
  }) => {
    // b1 onto h1's left edge: right before it; h1 stays where it is.
    await hold(page, byId(page, 'b1'), await at(byId(page, 'h1'), 0.12, 0.5));
    expect(await order(page, 'combine-grid')).toBe('b2,b1,h1,b3,b4,h2,b5,b6');
    // On into its middle.
    await glideTo(page, await at(byId(page, 'h1'), 0.5, 0.5));
    await expect(byId(page, 'h1')).toHaveAttribute('data-target');
    expect(await order(page, 'combine-grid')).toBe('b2,b1,h1,b3,b4,h2,b5,b6');
    // Its right edge: after it.
    await glideTo(page, await at(byId(page, 'h1'), 0.9, 0.5));
    await expect(byId(page, 'h1')).not.toHaveAttribute('data-target');
    expect(await order(page, 'combine-grid')).toBe('b2,h1,b1,b3,b4,h2,b5,b6');
    // Back into its middle from the right, and drop.
    await layoutSettled(page);
    await glideTo(page, await at(byId(page, 'h1'), 0.5, 0.5));
    await expect(byId(page, 'h1')).toHaveAttribute('data-target');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toContainText('combine-grid:b2,h1[b1],b3,b4,h2[],b5,b6');
  });

  test('keyboard: an arrow stops on a group before passing it, Enter drops into it; both are announced', async ({
    page,
  }) => {
    await byId(page, 'a2').focus();
    await press(page, 'Space');
    await press(page, 'ArrowDown');
    await expect(byId(page, 'g1')).toHaveAttribute('data-target');
    await expect(liveRegion(page)).toHaveText('Over into:g1: dropping puts item a2 inside.');
    // Back up: out of the group, where it was.
    await press(page, 'ArrowUp');
    await expect(byId(page, 'g1')).not.toHaveAttribute('data-target');
    await expect(liveRegion(page)).toHaveText('Item a2 moved to position 2 of 8 in list combine-list.');
    // Down twice: onto the group, then past it.
    await press(page, 'ArrowDown', 'ArrowDown');
    await expect(byId(page, 'g1')).not.toHaveAttribute('data-target');
    expect(await order(page, 'combine-list')).toBe('a1,g1,a2,a3,g2,a4,gl,a5');
    // Up onto it from below, and drop.
    await press(page, 'ArrowUp');
    await expect(byId(page, 'g1')).toHaveAttribute('data-target');
    await press(page, 'Enter');
    await settled(page);
    await expect(state(page)).toHaveText(`combine-list:a1,g1[a2],a3,g2[],a4,gl[],a5 | ${GRID}`);
    await expect(liveRegion(page)).toHaveText('Item a2 dropped into into:g1.');
  });
});
