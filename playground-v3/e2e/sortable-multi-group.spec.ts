import { expect, test, type Locator, type Page } from '@playwright/test';
import {
  center,
  dragTo,
  frames,
  glide,
  item,
  layoutSettled,
  pickUp,
  trackErrors,
  trackVueWarnings,
  waitForIdle,
} from './helpers';

/**
 * Multi-drag `'group'` (the default): the other selected items leave their places and
 * travel with the dragged one as contiguous placeholders, so while hovering the list
 * already shows the drop result; the overlay shows every item in a column along the
 * list, and on drop each clone lands on its own slot.
 */

const INITIAL = 'group-a:a1,a2,a3,a4,a5,a6,a7,a8 | group-b:b1,b2,b3 | bugs: | first: | row:x1,x2,x3,x4,x5,x6 | cells:c1,c2,c3,c4,c5,c6,c7,c8,c9';
const state = (page: Page) => page.getByTestId('state');
const list = (page: Page, id: string) => page.locator(`[data-testid="${id}"]:not([data-dnd-overlay] *)`);
const overlay = (page: Page) => page.locator('[data-dnd-overlay]');

const select = async (page: Page, ...ids: string[]) => {
  for (const id of ids) await item(page, id).click({ modifiers: ['ControlOrMeta'] });
};

/** Item ids of a list in DOM order (what is rendered, drafts included). */
const order = (locator: Locator) =>
  locator.locator(':scope > [data-id]').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-id')));

/** Placeholders outside the overlay in DOM order, and whether they are siblings in one run. */
const placeholders = (page: Page) =>
  page.evaluate(() => {
    const marked = [...document.querySelectorAll('[data-dnd-placeholder]')].filter((element) => !element.closest('[data-dnd-overlay]'));
    const contiguous = marked.every((element, index) => index === 0 || element.previousElementSibling === marked[index - 1]);
    return { ids: marked.map((element) => element.getAttribute('data-id')), contiguous };
  });

/** Ids of the clones in the overlay's column (not the active one, which fills the box). */
const columnIds = (page: Page) =>
  overlay(page)
    .locator('[data-dnd-overlay-item] [data-id]')
    .evaluateAll((clones) => clones.map((clone) => clone.getAttribute('data-id')));

/** Guards a test against page errors, console errors and Vue warnings. */
const guard = (page: Page) => {
  const errors = trackErrors(page);
  const warnings = trackVueWarnings(page);
  return () => {
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  };
};

type Frame = Record<string, string | number | null>;
type Landing = { id: string | null; frames: Frame[] };
type LandingWindow = Window & { __landings?: { box: Frame[] | null; items: Landing[] }; __landingWatch?: boolean };

/**
 * Call before releasing. Records the keyframes of the overlay box's drop animation and
 * of each clone in its column (they animate relative to the box).
 */
const watchLandings = async (page: Page) => {
  await page.evaluate(() => {
    const win = window as LandingWindow;
    win.__landings = { box: null, items: [] };
    if (win.__landingWatch) return;
    win.__landingWatch = true;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (this: Element, keyframes, options) {
      const frames = (Array.isArray(keyframes) ? keyframes : [keyframes]) as Frame[];
      if (win.__landings && keyframes) {
        if (this.hasAttribute('data-dnd-overlay')) win.__landings.box = frames;
        else if (this.hasAttribute('data-dnd-overlay-item') && win.__landings.box) {
          win.__landings.items.push({ id: this.querySelector('[data-id]')?.getAttribute('data-id') ?? null, frames });
        }
      }
      return animate.call(this, keyframes, options);
    };
  });
  return async () => {
    await page.waitForFunction(() => (window as LandingWindow).__landings?.box);
    return page.evaluate(() => (window as LandingWindow).__landings!);
  };
};

const numbers = (value: unknown) => [...String(value).matchAll(/-?[\d.]+(?=px)/g)].map((match) => Number(match[0]));

/** Where each clone ends: the box's final translate plus the clone's own, with its final size. */
const landedRects = (landings: { box: Frame[] | null; items: Landing[] }) => {
  const box = landings.box!.at(-1)!;
  const [boxX = 0, boxY = 0] = numbers(box.transform);
  return landings.items.map(({ id, frames }) => {
    const last = frames.at(-1)!;
    const [x = 0, y = 0] = numbers(last.transform);
    return { id, x: boxX + x, y: boxY + y, width: parseFloat(String(last.width)), height: parseFloat(String(last.height)) };
  });
};

/** Every clone ended exactly on its item's final rect, sized by width/height (never `scale()`). */
const expectLanded = async (page: Page, landings: { box: Frame[] | null; items: Landing[] }, ids: string[]) => {
  const all = [...landings.box!, ...landings.items.flatMap((landing) => landing.frames)];
  expect(all.map((frame) => String(frame.transform ?? ''))).not.toContainEqual(expect.stringContaining('scale'));
  const landed = landedRects(landings);
  expect(landed.map((rect) => rect.id).sort()).toEqual([...ids].sort());
  await layoutSettled(page);
  for (const rect of landed) {
    const box = (await item(page, rect.id!).boundingBox())!;
    expect(Math.abs(rect.x - box.x), `${rect.id} x`).toBeLessThan(1.5);
    expect(Math.abs(rect.y - box.y), `${rect.id} y`).toBeLessThan(1.5);
    expect(Math.abs(rect.width - box.width), `${rect.id} width`).toBeLessThan(1.5);
    expect(Math.abs(rect.height - box.height), `${rect.id} height`).toBeLessThan(1.5);
  }
};

/** First `translate` keyframe of a layout animation on the item, within ~20 frames; null if none ran. */
const flyIn = (page: Page, id: string) =>
  page.evaluate(
    (key) =>
      new Promise<string | null>((resolve) => {
        let count = 0;
        const check = () => {
          const element = document.querySelector(`[data-id="${key}"]:not([data-dnd-overlay] *)`);
          for (const animation of element?.getAnimations() ?? []) {
            const frame = (animation.effect as KeyframeEffect | null)?.getKeyframes()[0];
            if (frame && 'translate' in frame) return resolve(String(frame.translate));
          }
          if (++count > 20) return resolve(null);
          requestAnimationFrame(check);
        };
        check();
      }),
    id,
  );

test.describe("multi-drag 'group'", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#multi-group');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('on pickup the others travel into a block at the dragged item; the overlay shows them all', async ({ page }) => {
    const check = guard(page);
    await select(page, 'a2', 'a5');
    await pickUp(page, item(page, 'a2'));
    // a5 slides up next to a2 (same element, FLIP), in drop order.
    expect(await flyIn(page, 'a5')).not.toBeNull();
    await expect.poll(() => order(list(page, 'group-a'))).toEqual(['a1', 'a2', 'a5', 'a3', 'a4', 'a6', 'a7', 'a8']);
    expect(await placeholders(page)).toEqual({ ids: ['a2', 'a5'], contiguous: true });
    expect(await columnIds(page)).toEqual(['a5']);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('group-a:a1,a2,a5,a3,a4,a6,a7,a8');
    check();
  });

  test('while hovering the list shows exactly the drop result; every clone lands on its slot', async ({ page }) => {
    const check = guard(page);
    await select(page, 'a1', 'a3', 'a4');
    await pickUp(page, item(page, 'a3'));
    await layoutSettled(page);
    await glide(page, await center(item(page, 'a7'), 0.8));
    // The grabbed a3 sits under the pointer (where a7 was), a1 and a4 around it. Polled: a
    // loaded run may render the last move a frame after the glide.
    const hovered = ['a2', 'a5', 'a6', 'a7', 'a8', 'a1', 'a3', 'a4'];
    await expect.poll(() => order(list(page, 'group-a'))).toEqual(hovered);
    await layoutSettled(page);
    const marked = await placeholders(page);
    expect(marked.contiguous).toBe(true);
    expect(marked.ids).toEqual(['a1', 'a3', 'a4']);
    expect(await columnIds(page)).toEqual(['a1', 'a4']);
    const landings = await watchLandings(page);
    await page.mouse.up();
    const recorded = await landings();
    await waitForIdle(page);
    await expect(state(page)).toContainText(`group-a:${hovered.join(',')}`);
    await expectLanded(page, recorded, ['a1', 'a4']);
    check();
  });

  test('the block moves to another list and lands there in document order', async ({ page }) => {
    const check = guard(page);
    await select(page, 'b1', 'a2');
    await pickUp(page, item(page, 'a2'));
    await layoutSettled(page);
    await glide(page, await center(item(page, 'b3'), 0.3));
    // Polled: a loaded run may render the move into the other list a frame after the glide.
    await expect.poll(() => order(list(page, 'group-b'))).toEqual(['b2', 'a2', 'b1', 'b3']);
    await layoutSettled(page);
    const hovered = { a: await order(list(page, 'group-a')), b: await order(list(page, 'group-b')) };
    expect(await placeholders(page)).toEqual({ ids: ['a2', 'b1'], contiguous: true });
    const landings = await watchLandings(page);
    await page.mouse.up();
    const recorded = await landings();
    await waitForIdle(page);
    await expect(state(page)).toContainText(`group-a:${hovered.a.join(',')} | group-b:${hovered.b.join(',')}`);
    await expectLanded(page, recorded, ['b1']);
    check();
  });

  test('a horizontal list shows the overlay as a row; every clone lands on its slot', async ({ page }) => {
    const check = guard(page);
    await select(page, 'x1', 'x4');
    await pickUp(page, item(page, 'x4'));
    await expect.poll(() => order(list(page, 'row'))).toEqual(['x2', 'x3', 'x1', 'x4', 'x5', 'x6']);
    await layoutSettled(page);
    // The clone of x1 sits left of the box, one gap away, at the same height.
    const box = (await overlay(page).boundingBox())!;
    const clone = (await overlay(page).locator('[data-dnd-overlay-item]').boundingBox())!;
    expect(Math.abs(clone.y - box.y)).toBeLessThan(1);
    expect(clone.x + clone.width).toBeLessThan(box.x);
    const x6 = (await item(page, 'x6').boundingBox())!;
    await glide(page, { x: x6.x + x6.width * 0.8, y: x6.y + x6.height / 2 });
    await layoutSettled(page);
    const hovered = await order(list(page, 'row'));
    expect(hovered).toEqual(['x2', 'x3', 'x5', 'x6', 'x1', 'x4']);
    expect(await placeholders(page)).toEqual({ ids: ['x1', 'x4'], contiguous: true });
    const landings = await watchLandings(page);
    await page.mouse.up();
    const recorded = await landings();
    await waitForIdle(page);
    await expect(state(page)).toContainText(`row:${hovered.join(',')}`);
    await expectLanded(page, recorded, ['x1']);
    check();
  });

  test('a grid moves the block cell by cell; every clone lands on its cell', async ({ page }) => {
    const check = guard(page);
    await select(page, 'c2', 'c3', 'c6');
    await pickUp(page, item(page, 'c3'));
    await expect.poll(() => order(list(page, 'cells'))).toEqual(['c1', 'c2', 'c3', 'c6', 'c4', 'c5', 'c7', 'c8', 'c9']);
    await layoutSettled(page);
    const pointer = await center(item(page, 'c8'));
    await glide(page, pointer);
    await layoutSettled(page);
    const hovered = await order(list(page, 'cells'));
    expect(hovered).toEqual(['c1', 'c4', 'c5', 'c7', 'c8', 'c9', 'c2', 'c3', 'c6']);
    const marked = await placeholders(page);
    expect(marked).toEqual({ ids: ['c2', 'c3', 'c6'], contiguous: true });
    // The grabbed cell sits under the pointer, the others around it.
    const c3 = (await item(page, 'c3').boundingBox())!;
    expect(pointer.x).toBeGreaterThan(c3.x);
    expect(pointer.x).toBeLessThan(c3.x + c3.width);
    expect(pointer.y).toBeGreaterThan(c3.y);
    expect(pointer.y).toBeLessThan(c3.y + c3.height);
    const landings = await watchLandings(page);
    await page.mouse.up();
    const recorded = await landings();
    await waitForIdle(page);
    await expect(state(page)).toContainText(`cells:${hovered.join(',')}`);
    expect(hovered.join(',')).not.toBe('c1,c2,c3,c6,c4,c5,c7,c8,c9');
    await expectLanded(page, recorded, ['c2', 'c6']);
    check();
  });

  test("a list taking only some items (group.put, acceptMode 'some') shows that while hovering", async ({ page }) => {
    const check = guard(page);
    // a2 is a bug, a3 isn't.
    await select(page, 'a2', 'a3');
    await dragTo(page, item(page, 'a2'), await center(list(page, 'bugs')), { release: false });
    await expect(list(page, 'bugs')).toHaveAttribute('data-accepting');
    await expect.poll(() => order(list(page, 'bugs'))).toEqual(['a2']);
    // a3 is back where it started, still dragged (dimmed), and still in the overlay.
    await expect.poll(() => order(list(page, 'group-a'))).toEqual(['a1', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8']);
    await expect(item(page, 'a3')).toHaveAttribute('data-dnd-dragging', '');
    expect(await placeholders(page)).toEqual({ ids: ['a2'], contiguous: true });
    expect(await columnIds(page)).toEqual(['a3']);
    const landings = await watchLandings(page);
    await page.mouse.up();
    const recorded = await landings();
    await waitForIdle(page);
    await expect(state(page)).toContainText('group-a:a1,a3,a4,a5,a6,a7,a8 | group-b:b1,b2,b3 | bugs:a2 |');
    await expect(page.getByTestId('last')).toHaveText('to:bugs accepted:a2 rejected:a3');
    // a3's clone flies back to a3.
    await expectLanded(page, recorded, ['a3']);
    check();
  });

  test('onBeforeDrop accepting a subset sends the rest flying back', async ({ page }) => {
    const check = guard(page);
    await select(page, 'a1', 'a3');
    await dragTo(page, item(page, 'a1'), await center(list(page, 'first')), { release: false });
    await expect.poll(() => order(list(page, 'first'))).toEqual(['a1', 'a3']);
    const landings = await watchLandings(page);
    await page.mouse.up();
    const recorded = await landings();
    await waitForIdle(page);
    await expect(state(page)).toContainText('group-a:a2,a3,a4,a5,a6,a7,a8 | group-b:b1,b2,b3 | bugs: | first:a1 |');
    await expect(page.getByTestId('last')).toHaveText('to:first accepted:a1 rejected:a3');
    await expectLanded(page, recorded, ['a3']);
    check();
  });

  test('the keyboard moves the whole block by items', async ({ page }) => {
    const check = guard(page);
    await select(page, 'a2', 'a4');
    await item(page, 'a2').focus();
    await page.keyboard.press('Space');
    await expect.poll(() => order(list(page, 'group-a'))).toEqual(['a1', 'a2', 'a4', 'a3', 'a5', 'a6', 'a7', 'a8']);
    await page.keyboard.press('ArrowDown');
    await frames(page, 3);
    await expect.poll(() => order(list(page, 'group-a'))).toEqual(['a1', 'a3', 'a2', 'a4', 'a5', 'a6', 'a7', 'a8']);
    await page.keyboard.press('ArrowDown');
    await frames(page, 3);
    await expect.poll(() => order(list(page, 'group-a'))).toEqual(['a1', 'a3', 'a5', 'a2', 'a4', 'a6', 'a7', 'a8']);
    await page.keyboard.press('ArrowUp');
    await frames(page, 3);
    await expect.poll(() => order(list(page, 'group-a'))).toEqual(['a1', 'a3', 'a2', 'a4', 'a5', 'a6', 'a7', 'a8']);
    // Right: into the next list, the block whole.
    await page.keyboard.press('ArrowRight');
    await frames(page, 3);
    await expect.poll(() => order(list(page, 'group-b'))).toContain('a4');
    await page.keyboard.press('Space');
    await waitForIdle(page);
    const b = await order(list(page, 'group-b'));
    expect(b.indexOf('a4') - b.indexOf('a2')).toBe(1);
    await expect(state(page)).toContainText('group-a:a1,a3,a5,a6,a7,a8 |');
    check();
  });

  test('Alt copies the whole block; releasing it moves the originals in its place', async ({ page }) => {
    const check = guard(page);
    await select(page, 'a1', 'a3');
    await pickUp(page, item(page, 'a1'));
    await layoutSettled(page);
    await page.keyboard.down('Alt');
    await glide(page, await center(item(page, 'b2'), 0.3));
    // Copying: the originals stay where they are; two copies travel together.
    await expect.poll(() => order(list(page, 'group-a'))).toEqual(['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8']);
    await expect.poll(async () => (await order(list(page, 'group-b'))).length).toBe(5);
    const copies = await placeholders(page);
    expect(copies.contiguous).toBe(true);
    expect(copies.ids).toHaveLength(2);
    expect(copies.ids.every((id) => /^a[13]-\d+$/.test(id!))).toBe(true);
    await expect(item(page, 'a1')).not.toHaveAttribute('data-dnd-dragging');
    // Moving again: the originals take the copies' place.
    await page.keyboard.up('Alt');
    await expect.poll(() => order(list(page, 'group-b'))).toEqual(['b1', 'a1', 'a3', 'b2', 'b3']);
    await expect.poll(() => order(list(page, 'group-a'))).toEqual(['a2', 'a4', 'a5', 'a6', 'a7', 'a8']);
    await page.keyboard.down('Alt');
    await expect.poll(() => order(list(page, 'group-a'))).toEqual(['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8']);
    await page.mouse.up();
    await page.keyboard.up('Alt');
    await waitForIdle(page);
    await expect(state(page)).toContainText('group-a:a1,a2,a3,a4,a5,a6,a7,a8 |');
    await expect(state(page)).toHaveText(/group-b:b1,a1-\d+,a3-\d+,b2,b3 \|/);
    check();
  });

  test('big selections clone five items and count the rest; those fade in instead of popping', async ({ page }) => {
    const check = guard(page);
    await select(page, 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7');
    await pickUp(page, item(page, 'a4'));
    await layoutSettled(page);
    // The grabbed a4 and the four nearest to it in drop order; a1 and a7 are counted, each
    // at the end of the column where it drops: before a2, after a6.
    expect(await columnIds(page)).toEqual(['a2', 'a3', 'a5', 'a6']);
    await expect(page.locator('[data-dnd-overlay] > div > span')).toHaveText(['+1', '+1']);
    expect(await placeholders(page)).toEqual({ ids: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'], contiguous: true });
    await page.evaluate(() => {
      const win = window as Window & { __fades?: string[] };
      win.__fades = [];
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (this: Element, keyframes, options) {
        const frames = (Array.isArray(keyframes) ? keyframes : [keyframes]) as Keyframe[];
        if (frames.some((frame) => 'opacity' in frame) && !this.closest('[data-dnd-overlay]')) {
          win.__fades!.push(this.getAttribute('data-id') ?? '');
        }
        return animate.call(this, keyframes, options);
      };
    });
    await glide(page, await center(item(page, 'b2')));
    await page.mouse.up();
    await waitForIdle(page);
    const fades = await page.evaluate(() => (window as Window & { __fades?: string[] }).__fades ?? []);
    expect(fades.sort()).toEqual(['a1', 'a7']);
    await expect(item(page, 'a1')).toHaveCSS('opacity', '1');
    await expect(item(page, 'a7')).toHaveCSS('opacity', '1');
    const b = await order(list(page, 'group-b'));
    expect(b.join(',')).toContain('a1,a2,a3,a4,a5,a6,a7');
    check();
  });

  test('with reduced motion nothing animates, and the result is the same', async ({ page }) => {
    const check = guard(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => {
      const win = window as Window & { __animated?: number };
      win.__animated = 0;
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (this: Element, keyframes, options) {
        win.__animated!++;
        return animate.call(this, keyframes, options);
      };
    });
    await select(page, 'a2', 'a5');
    await pickUp(page, item(page, 'a2'));
    await expect.poll(() => order(list(page, 'group-a'))).toEqual(['a1', 'a2', 'a5', 'a3', 'a4', 'a6', 'a7', 'a8']);
    await glide(page, await center(item(page, 'b2'), 0.3));
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('group-a:a1,a3,a4,a6,a7,a8 | group-b:b1,a2,a5,b2,b3 |');
    expect(await page.evaluate(() => (window as Window & { __animated?: number }).__animated)).toBe(0);
    check();
  });

  test('cancel puts every item back and the clones fly home', async ({ page }) => {
    const check = guard(page);
    await select(page, 'a2', 'a6');
    await dragTo(page, item(page, 'a2'), await center(item(page, 'b2')), { release: false });
    await expect.poll(() => order(list(page, 'group-b'))).toContain('a6');
    const landings = await watchLandings(page);
    await page.keyboard.press('Escape');
    const recorded = await landings();
    await waitForIdle(page);
    await page.mouse.up();
    await expect(state(page)).toHaveText(INITIAL);
    await expectLanded(page, recorded, ['a6']);
    check();
  });
});

/**
 * Virtual lists pin and size the slot through `activeIndex`/`activeSize`; the rest of a
 * block renders like any other row, and selected rows that are scrolled away (not
 * mounted) still travel with it.
 */
test.describe("multi-drag 'group' in virtual lists", () => {
  const row = (page: Page, scroller: string, id: string) => page.locator(`[data-testid="${scroller}"] [data-id="${id}"]`);
  const ctrlClick = (locator: Locator) => locator.click({ modifiers: ['ControlOrMeta'] });

  test('TanStack: a block with a row that is scrolled away moves and lands together', async ({ page }) => {
    const check = guard(page);
    await page.goto('/#virtual-tanstack');
    const scroller = page.getByTestId('tanstack-scroller');
    await ctrlClick(row(page, 'tanstack-scroller', 'r1'));
    await scroller.evaluate((element) => (element.scrollTop = 40 * 60));
    await ctrlClick(row(page, 'tanstack-scroller', 'r64'));
    await scroller.evaluate((element) => (element.scrollTop = 0));
    await frames(page, 3);
    await expect(row(page, 'tanstack-scroller', 'r64')).toHaveCount(0);
    await pickUp(page, row(page, 'tanstack-scroller', 'r1'));
    // r64 joins the block right after r1, so it renders there.
    await expect(row(page, 'tanstack-scroller', 'r64')).toHaveCount(1);
    await layoutSettled(page);
    // r5 is the 7th row now (r1, r64 above it): r1 lands there, r64 after it.
    await glide(page, await center(row(page, 'tanstack-scroller', 'r5'), 0.8));
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('tanstack-order')).toHaveText('r0,r2,r3,r4,r5,r6,r1,r64,r7,r8');
    check();
  });

  test('TanStack kanban: a block crosses columns', async ({ page }) => {
    const check = guard(page);
    await page.goto('/#virtual-kanban');
    await ctrlClick(row(page, 'column-todo', 'a1'));
    await ctrlClick(row(page, 'column-todo', 'a3'));
    await pickUp(page, row(page, 'column-todo', 'a1'));
    await layoutSettled(page);
    await glide(page, await center(row(page, 'column-doing', 'b2'), 0.3));
    await expect(page.locator('[data-testid="column-doing"] [data-dnd-placeholder]')).toHaveCount(2);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(page.getByTestId('virtual-board')).toContainText('todo(1998):a0,a2,a4,a5,a6');
    await expect(page.getByTestId('virtual-board')).toContainText('doing(2002):b0,b1,a1,a3,b2');
    check();
  });
});
