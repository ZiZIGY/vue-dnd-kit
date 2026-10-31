import { expect, test, type Locator, type Page } from '@playwright/test';
import { center, frames, glide, item, pickUp, waitForIdle } from './helpers';

/** Layout size (transforms excluded). */
const size = (locator: Locator) =>
  locator.evaluate((element) => ({
    width: (element as HTMLElement).offsetWidth,
    height: (element as HTMLElement).offsetHeight,
  }));

const overlay = (page: Page) => page.locator('[data-dnd-overlay]');
const within = (actual: number, expected: number, tolerance = 1.5) =>
  expect(Math.abs(actual - expected), `${actual} ≈ ${expected}`).toBeLessThanOrEqual(tolerance);

/** Records the keyframes of the overlay's drop animation as it starts. */
const watchDropKeyframes = (page: Page) =>
  page.evaluate(() => {
    const win = window as unknown as { __dropFrames: string | null };
    win.__dropFrames = null;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (this: Element, keyframes, options) {
      if (this.hasAttribute('data-dnd-overlay')) win.__dropFrames = JSON.stringify(keyframes);
      return animate.call(this, keyframes, options);
    };
  });

const dropKeyframes = async (page: Page): Promise<Array<Record<string, string>>> => {
  const handle = await page.waitForFunction(() => (window as unknown as { __dropFrames: string | null }).__dropFrames);
  return JSON.parse((await handle.jsonValue()) as string);
};

test.describe('overlay box size: slot vs source (overlay-fit)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#overlay-fit');
    await expect(page.getByTestId('state-slot')).toHaveText('slot-narrow:sn1,sn2,sn3,sn4 | slot-wide:sw1,sw2,sw3');
  });

  test("'slot': the overlay takes the size of the target list's items", async ({ page }) => {
    const source = await size(item(page, 'sn1'));
    const wide = await size(item(page, 'sw1'));
    expect(wide.width - source.width).toBeGreaterThan(60);
    expect(wide.height - source.height).toBeGreaterThan(20);

    await pickUp(page, item(page, 'sn1'));
    within((await size(overlay(page))).width, source.width);
    await glide(page, await center(item(page, 'sw2')));
    await expect(page.getByTestId('slot-wide').locator('[data-id="sn1"]')).toHaveCount(1);
    await expect.poll(async () => (await size(overlay(page))).width).toBe(wide.width);
    await expect.poll(async () => (await size(overlay(page))).height).toBe(wide.height);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('state-slot')).toHaveText(/^slot-narrow:sn2,sn3,sn4 \| slot-wide:[\w,]*sn1[\w,]*$/);
  });

  test("'source': the overlay keeps the dragged element's size", async ({ page }) => {
    const source = await size(item(page, 'on1'));
    await pickUp(page, item(page, 'on1'));
    await glide(page, await center(item(page, 'ow2')));
    const slot = page.getByTestId('source-wide').locator('[data-id="on1"]');
    await expect(slot).toHaveCount(1);
    expect((await size(slot)).width - source.width).toBeGreaterThan(60);
    // Longer than the 150ms resize transition would take.
    await frames(page, 20);
    const box = await size(overlay(page));
    within(box.width, source.width);
    within(box.height, source.height);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('state-source')).toHaveText(/^source-narrow:on2,on3,on4 \| source-wide:[\w,]*on1[\w,]*$/);
  });

  test('an overlay component follows the box by filling it, and lands without scale', async ({ page }) => {
    const narrow = await size(item(page, 'sn2'));
    await pickUp(page, item(page, 'sw1'));
    const component = overlay(page).locator('[data-overlay-kind="fit"]');
    await expect(component).toBeVisible();
    await glide(page, await center(item(page, 'sn2')));
    await expect(page.getByTestId('slot-narrow').locator('[data-id="sw1"]')).toHaveCount(1);
    await expect.poll(async () => (await size(overlay(page))).width).toBe(narrow.width);
    expect(await size(component)).toEqual(await size(overlay(page)));

    await watchDropKeyframes(page);
    await page.mouse.up();
    const keyframes = await dropKeyframes(page);
    expect(keyframes.length).toBeGreaterThan(1);
    for (const frame of keyframes) {
      expect(frame.width).toBeTruthy();
      expect(String(frame.transform)).not.toContain('scale');
    }
    await waitForIdle(page);
  });
});
