import { expect, test, type Page } from '@playwright/test';
import { center, glide, item, layoutSettled, pickUp, trackErrors, trackVueWarnings, waitForIdle } from './helpers';

const INITIAL = 'deck-inbox:i1,i2,i3,i4,i5,i6,i7 | deck-done:d1,d2';
const state = (page: Page) => page.getByTestId('state');
const overlay = (page: Page) => page.locator('[data-dnd-overlay]');
const deck = (page: Page) => overlay(page).locator('[data-overlay-kind="deck"]');

const select = async (page: Page, ...ids: string[]) => {
  for (const id of ids) await item(page, id).click({ modifiers: ['ControlOrMeta'] });
};

type Frame = { transform: string; width: string; height: string };
type Landed = { id: string | null; x: number; y: number; width: number; height: number; frames: Frame[] };
type DeckWindow = Window & {
  __deck?: { box: Animation | null; cards: Array<{ element: Element; animation: Animation; frames: Keyframe[] }> };
  __deckWatch?: boolean;
};

/**
 * Call before the drop (or cancel). Records the box's landing and each card's (the
 * `DragPreview`s that land by themselves); the returned function seeks them all to
 * their last moment and reads where each card is then, with its keyframes.
 */
const watchLanding = async (page: Page) => {
  await page.evaluate(() => {
    const win = window as DeckWindow;
    win.__deck = { box: null, cards: [] };
    if (win.__deckWatch) return;
    win.__deckWatch = true;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (this: Element, keyframes, options) {
      const animation = animate.call(this, keyframes, options);
      const deck = win.__deck;
      if (deck && Array.isArray(keyframes)) {
        if (this.hasAttribute('data-dnd-overlay')) deck.box = animation;
        else if (this.hasAttribute('data-dnd-overlay-item')) deck.cards.push({ element: this, animation, frames: keyframes });
      }
      return animation;
    };
  });
  return () =>
    page.evaluate(
      () =>
        new Promise<Landed[]>((resolve) => {
          const deck = (window as DeckWindow).__deck!;
          const seek = () => {
            if (!deck.box) return requestAnimationFrame(seek);
            for (const animation of [deck.box, ...deck.cards.map((card) => card.animation)]) {
              animation.currentTime = Number(animation.effect!.getComputedTiming().endTime) - 1;
            }
            resolve(
              deck.cards.map(({ element, frames }) => {
                const rect = element.getBoundingClientRect();
                return {
                  id: element.querySelector('[data-id]')?.getAttribute('data-id') ?? null,
                  x: rect.x,
                  y: rect.y,
                  width: rect.width,
                  height: rect.height,
                  frames: frames.map((frame) => ({
                    transform: String(frame.transform ?? ''),
                    width: String(frame.width ?? ''),
                    height: String(frame.height ?? ''),
                  })),
                };
              }),
            );
          };
          seek();
        }),
    );
};

/** Each card ended on `rects` (its item's slot), within a pixel and a half. */
const expectOn = (landed: Landed[], rects: Record<string, { x: number; y: number; width: number; height: number }>) => {
  expect(landed.map((card) => card.id).sort()).toEqual(Object.keys(rects).sort());
  for (const card of landed) {
    const rect = rects[card.id!]!;
    for (const side of ['x', 'y', 'width', 'height'] as const) {
      expect(Math.abs(card[side] - rect[side]), `${card.id} ${side}`).toBeLessThan(1.5);
    }
  }
};

const rectsOf = async (page: Page, ids: string[]) =>
  Object.fromEntries(await Promise.all(ids.map(async (id) => [id, (await item(page, id).boundingBox())!] as const)));

test.describe('custom overlay layout with DragPreview (overlay-deck)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#overlay-deck');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('fans out the default clones of every dragged card', async ({ page }) => {
    const errors = trackErrors(page);
    const warnings = trackVueWarnings(page);
    await select(page, 'i2', 'i3', 'i5');
    await pickUp(page, item(page, 'i3'));
    await expect(deck(page)).toHaveAttribute('data-count', '3');
    await expect(deck(page).getByTestId('deck-card')).toHaveCount(3);
    // Each card holds a clone of its item (the clone keeps the row's data-id).
    for (const id of ['i2', 'i3', 'i5']) await expect(deck(page).locator(`[data-id="${id}"]`)).toHaveCount(1);
    await expect(deck(page).getByTestId('deck-fallback')).toHaveCount(0);
    await expect(deck(page).getByTestId('deck-count')).toHaveText('3');
    // The cards are fanned: the ones behind are turned.
    const turned = await deck(page)
      .getByTestId('deck-card')
      .evaluateAll(
        (cards) =>
          cards.filter((card) => !['none', 'matrix(1, 0, 0, 1, 0, 0)'].includes(getComputedStyle(card).transform)).length,
      );
    expect(turned).toBe(2);

    await glide(page, await center(item(page, 'd1'), 0.75));
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(/^deck-inbox:i1,i4,i6,i7 \| deck-done:[\w,]*i2,i3,i5[\w,]*$/);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  test("cards past the clone limit render the preview's slot", async ({ page }) => {
    await select(page, 'i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7');
    // Clones are taken around the grabbed card in drop order: i3-i7. The deck shows the
    // grabbed i7 and the first four others, i1 and i2 without a clone.
    await pickUp(page, item(page, 'i7'));
    await expect(deck(page).getByTestId('deck-card')).toHaveCount(5);
    await expect(deck(page).getByTestId('deck-fallback')).toHaveCount(2);
    await expect(deck(page).getByTestId('deck-fallback').first()).toContainText(/Task I1|Note I2/);
    await expect(deck(page).getByTestId('deck-count')).toHaveText('7');
    // Only the cards with a clone land by themselves (i3, i4); the others fade in where they land.
    await expect(deck(page).locator('[data-dnd-overlay-item]')).toHaveCount(2);
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('every card lands on its own slot, turning straight; sized by width and height, never scaled', async ({
    page,
  }) => {
    const errors = trackErrors(page);
    const warnings = trackVueWarnings(page);
    await select(page, 'i2', 'i3', 'i5');
    await pickUp(page, item(page, 'i3'));
    await glide(page, await center(item(page, 'd1'), 0.75));
    await layoutSettled(page);
    const landing = await watchLanding(page);
    await page.mouse.up();
    const landed = await landing();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(/^deck-inbox:i1,i4,i6,i7 \| deck-done:[\w,]*i2,i3,i5[\w,]*$/);
    await layoutSettled(page);
    // The grabbed i3 rides in the box; i2 and i5 fly from the fan to their own slots.
    expectOn(landed, await rectsOf(page, ['i2', 'i5']));
    for (const { id, frames } of landed) {
      expect(frames.map((frame) => frame.transform).join(' '), `${id}`).not.toContain('scale');
      expect(frames.every((frame) => frame.width.endsWith('px') && frame.height.endsWith('px')), `${id}`).toBe(true);
      // The fan turned it: the landing turns it back, a pure turn (no scale in the matrix).
      const [a = 0, b = 0, c = 0, d = 0] = [...frames.at(-1)!.transform.matchAll(/matrix\(([^)]*)\)/g)][0]![1]!
        .split(',')
        .map(Number);
      expect(Math.abs(b), `${id} turns`).toBeGreaterThan(0.1);
      expect(Math.hypot(a, b), `${id}`).toBeCloseTo(1, 3);
      expect(Math.hypot(c, d), `${id}`).toBeCloseTo(1, 3);
    }
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  test('cancelled, every card flies back to its own place', async ({ page }) => {
    const errors = trackErrors(page);
    const warnings = trackVueWarnings(page);
    const home = await rectsOf(page, ['i2', 'i5']);
    await select(page, 'i2', 'i3', 'i5');
    await pickUp(page, item(page, 'i3'));
    await glide(page, await center(item(page, 'd2'), 0.75));
    await layoutSettled(page);
    const landing = await watchLanding(page);
    await page.keyboard.press('Escape');
    const landed = await landing();
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(INITIAL);
    expectOn(landed, home);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });
});
