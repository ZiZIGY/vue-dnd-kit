import { expect, test, type Page } from '@playwright/test';
import { center, item, pickUp, trackErrors, trackVueWarnings, waitForIdle } from './helpers';

/**
 * GSAP and motion-v recipes (#animation-libs): the library's hooks drive another
 * animation library for moves while dragging (`animation`), the drop (`dropAnimation`)
 * and data changes (`animate`: moves, entrances, exits). Each library has its own list.
 */

const LIBS = ['gsap', 'motion'] as const;
type Lib = (typeof LIBS)[number];
type Kind = 'drag' | 'drop' | 'move' | 'enter' | 'leave';

const count = (page: Page, lib: Lib, kind: Kind) => page.getByTestId(`${lib}-${kind}`);
const button = (page: Page, lib: Lib, name: 'add' | 'remove' | 'reverse') => page.getByTestId(`${lib}-${name}`);
const list = (page: Page, lib: Lib) => page.getByTestId(`${lib}-list`);
const card = (page: Page, lib: Lib, n: number) => item(page, `${lib}-${n}`);

/** The cards in the list as rendered (copies of leaving ones aside). */
const rendered = (page: Page, lib: Lib) =>
  list(page, lib).evaluate((element) =>
    [...element.children]
      .filter((child) => !child.hasAttribute('data-dnd-leaving'))
      .map((child) => child.getAttribute('data-id')!.split('-')[1])
      .join(','),
  );

/**
 * Springs and tweens end on their own clock: under a full parallel run WebKit can take a
 * while to finish them, so the polls below wait longer than the default 5s.
 */
const SETTLE = { timeout: 10_000 };

/** No card is offset any more: by `translate` (moves, entrances) or `transform` (GSAP's `scale`). */
const still = (page: Page, lib: Lib) =>
  expect
    .poll(() =>
      list(page, lib).evaluate((element) =>
        [...element.children].every((child) => {
          const style = getComputedStyle(child);
          const transform = new DOMMatrix(style.transform === 'none' ? undefined : style.transform);
          const translate = style.translate === 'none' ? [] : style.translate.split(' ').map(parseFloat);
          return transform.isIdentity && translate.every((value) => value === 0);
        }),
      ),
      SETTLE,
    )
    .toBe(true);

/** Every animation has ended: no card is offset or faded, and the copies of leaving ones are gone. */
const settled = async (page: Page, lib: Lib) => {
  await expect(list(page, lib).locator('[data-dnd-leaving]')).toHaveCount(0, SETTLE);
  await still(page, lib);
  await expect
    .poll(
      () => list(page, lib).evaluate((element) => [...element.children].every((child) => getComputedStyle(child).opacity === '1')),
      SETTLE,
    )
    .toBe(true);
};

/** The list shows `order`, and so does its data. */
const showsOrder = async (page: Page, lib: Lib, order: string) => {
  await expect(page.getByTestId(`${lib}-order`)).toHaveText(order);
  await expect.poll(() => rendered(page, lib)).toBe(order);
};

/** Drags card `n` to the lower part of card `onto`, waits for the list to settle there, and drops. */
const dragCard = async (page: Page, lib: Lib, n: number, onto: number) => {
  await pickUp(page, card(page, lib, n));
  const target = await center(card(page, lib, onto), 0.8);
  await page.mouse.move(target.x, target.y, { steps: 12 });
  await still(page, lib);
  // Once the cards are still, the slot follows the pointer as it is now.
  await page.mouse.move(target.x, target.y + 2, { steps: 2 });
  await page.mouse.up();
  await waitForIdle(page);
};

test.describe('animation libraries through the hooks (animation-libs)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#animation-libs');
    for (const lib of LIBS) await showsOrder(page, lib, '1,2,3,4,5');
  });

  for (const lib of LIBS) {
    test(`${lib}: data changes run the move, enter and leave hooks and end in the right order`, async ({ page }) => {
      const errors = trackErrors(page);
      const warnings = trackVueWarnings(page);

      await button(page, lib, 'reverse').click();
      // 1 and 5, 2 and 4 swap places; 3 stays.
      await expect(count(page, lib, 'move')).toHaveText('4');
      await showsOrder(page, lib, '5,4,3,2,1');
      await settled(page, lib);

      await button(page, lib, 'add').click();
      await expect(count(page, lib, 'enter')).toHaveText('1');
      await showsOrder(page, lib, '5,6,4,3,2,1');
      await settled(page, lib);

      await button(page, lib, 'remove').click();
      await expect(count(page, lib, 'leave')).toHaveText('1');
      // The hook animated the copy of card 6 (`data-dnd-leaving`), recorded by the demo: the
      // copy itself is gone a moment later, too soon to catch under a full parallel run.
      await expect(page.getByTestId(`${lib}-left`)).toHaveText(`${lib}-6`);
      await settled(page, lib);
      await showsOrder(page, lib, '5,4,3,2,1');

      // No drag ran: its hooks weren't called.
      await expect(count(page, lib, 'drag')).toHaveText('0');
      await expect(count(page, lib, 'drop')).toHaveText('0');
      expect(errors).toEqual([]);
      expect(warnings).toEqual([]);
    });

    test(`${lib}: a drag runs the move and drop hooks and lands in the right place`, async ({ page }) => {
      const errors = trackErrors(page);
      await dragCard(page, lib, 1, 3);
      await showsOrder(page, lib, '2,3,1,4,5');
      await settled(page, lib);
      expect(Number(await count(page, lib, 'drag').textContent())).toBeGreaterThan(0);
      await expect(count(page, lib, 'drop')).toHaveText('1');
      // The drop's own changes are the drag's: `animate` doesn't run for them.
      await expect(count(page, lib, 'move')).toHaveText('0');
      expect(errors).toEqual([]);
    });
  }

  test('`animate: false` turns the data-change hooks off; drags still animate', async ({ page }) => {
    await page.getByTestId('animate-changes').uncheck();
    for (const lib of LIBS) {
      await button(page, lib, 'reverse').click();
      await button(page, lib, 'add').click();
      await button(page, lib, 'remove').click();
      await showsOrder(page, lib, '5,4,3,2,1');
      await expect(list(page, lib).locator('[data-dnd-leaving]')).toHaveCount(0);
      for (const kind of ['move', 'enter', 'leave'] as const) await expect(count(page, lib, kind)).toHaveText('0');

      await dragCard(page, lib, 5, 3);
      await showsOrder(page, lib, '4,3,5,2,1');
      await expect(count(page, lib, 'drop')).toHaveText('1');
    }
  });

  test('with reduced motion the hooks are told so: nothing moves, appearing and leaving only fade', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const lib of LIBS) {
      await button(page, lib, 'reverse').click();
      await button(page, lib, 'add').click();
      await button(page, lib, 'remove').click();
      await showsOrder(page, lib, '5,4,3,2,1');
      await settled(page, lib);
      await dragCard(page, lib, 5, 3);
      await showsOrder(page, lib, '4,3,5,2,1');
      await settled(page, lib);
      // The recipes skip movement (they return nothing) and keep a fade for entrances and exits.
      for (const kind of ['drag', 'drop', 'move'] as const) await expect(count(page, lib, kind)).toHaveText('0');
      await expect(count(page, lib, 'enter')).toHaveText('1');
      await expect(count(page, lib, 'leave')).toHaveText('1');
    }
  });
});
