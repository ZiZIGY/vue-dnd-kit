import { expect, test, type Locator, type Page } from '@playwright/test';
import { trackErrors, waitForIdle, type Point } from './helpers';

const ORDER = Array.from({ length: 24 }, (_, index) => `c${index + 1}`).join(',');

const card = (page: Page, id: string) => page.locator(`[data-testid="grid"] [data-id="${id}"]`);
const selected = (page: Page) => page.getByTestId('selected');

const box = async (locator: Locator) => {
  const value = await locator.boundingBox();
  if (!value) throw new Error('Element is not visible');
  return value;
};

/** Empty space in the padding of an area, near its top-left corner. */
const corner = async (area: Locator): Promise<Point> => {
  const { x, y } = await box(area);
  return { x: x + 8, y: y + 8 };
};

/** A point in the gap just past the bottom-right corner of a card. */
const past = async (locator: Locator): Promise<Point> => {
  const { x, y, width, height } = await box(locator);
  return { x: x + width + 4, y: y + height + 4 };
};

/** Presses at `from` and draws a band to `to`. */
const band = async (
  page: Page,
  from: Point,
  to: Point,
  { release = true }: { release?: boolean } = {},
): Promise<void> => {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 10 });
  if (release) await page.mouse.up();
};

const ctrlClick = async (page: Page, locator: Locator) => {
  await locator.click({ modifiers: ['ControlOrMeta'] });
};

const expectNear = (actual: number, expected: number) => expect(Math.abs(actual - expected)).toBeLessThan(1.5);

test.describe('selection area', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#selection');
    await expect(page.getByTestId('order')).toHaveText(ORDER);
  });

  test('a band from empty space selects the cards it crosses', async ({ page }) => {
    const errors = trackErrors(page);
    const from = await corner(page.getByTestId('area'));
    const to = await past(card(page, 'c6'));
    await band(page, from, to, { release: false });

    await expect(page.getByTestId('status')).toHaveText('selecting');
    const rect = await box(page.getByTestId('band'));
    expectNear(rect.x, from.x);
    expectNear(rect.y, from.y);
    expectNear(rect.width, to.x - from.x);
    expectNear(rect.height, to.y - from.y);
    await expect(selected(page)).toHaveText('c1,c2,c5,c6');
    await expect(page.getByTestId('on-selected')).toHaveText('');

    await page.mouse.up();
    await expect(page.getByTestId('band')).toHaveCount(0);
    await expect(page.getByTestId('status')).toHaveText('idle');
    await expect(card(page, 'c1')).toHaveClass(/selected/);
    await expect(card(page, 'c3')).not.toHaveClass(/selected/);
    // onSelected fires once, at the end, with the whole selection.
    await expect(page.getByTestId('on-selected')).toHaveText('c1,c2,c5,c6');
    expect(errors).toEqual([]);
  });

  test('toggle strategy XORs with the selection at band start', async ({ page }) => {
    await ctrlClick(page, card(page, 'c1'));
    await ctrlClick(page, card(page, 'c3'));
    await expect(selected(page)).toHaveText('c1,c3');

    const from = await corner(page.getByTestId('area'));
    await band(page, from, await past(card(page, 'c6')), { release: false });
    await expect(selected(page)).toHaveText('c2,c3,c5,c6');

    // Shrinking the band gives the items it leaves their original state back.
    await page.mouse.move(from.x + 2, from.y + 2, { steps: 5 });
    await expect(selected(page)).toHaveText('c1,c3');
    await page.mouse.move(...(Object.values(await past(card(page, 'c1'))) as [number, number]), { steps: 5 });
    await page.mouse.up();
    await expect(selected(page)).toHaveText('c3');
  });

  test('select strategy keeps only the cards inside the band, a click clears', async ({ page }) => {
    await page.getByTestId('strategy').selectOption('select');
    await ctrlClick(page, card(page, 'c8'));
    await expect(selected(page)).toHaveText('c8');

    const from = await corner(page.getByTestId('area'));
    await band(page, from, await past(card(page, 'c6')));
    await expect(selected(page)).toHaveText('c1,c2,c5,c6');

    // A click on empty space is a band that crosses nothing.
    await page.mouse.click(from.x, from.y);
    await expect(selected(page)).toHaveText('');
    await expect(page.getByTestId('on-selected')).toHaveText('');
  });

  test('a modifier gates the band', async ({ page }) => {
    await page.getByTestId('modifier').selectOption('Shift');
    const from = await corner(page.getByTestId('area'));
    const to = await past(card(page, 'c6'));

    await band(page, from, to, { release: false });
    await expect(page.getByTestId('band')).toHaveCount(0);
    await expect(page.getByTestId('status')).toHaveText('idle');
    await page.mouse.up();
    await expect(selected(page)).toHaveText('');

    await page.keyboard.down('Shift');
    await band(page, from, to);
    await page.keyboard.up('Shift');
    await expect(selected(page)).toHaveText('c1,c2,c5,c6');
  });

  test('scrolling the area while selecting keeps the anchor on the content', async ({ page }) => {
    const area = page.getByTestId('area');
    const areaBox = await box(area);
    const from = await corner(area);
    const c2 = await box(card(page, 'c2'));
    const to = { x: c2.x + c2.width + 4, y: areaBox.y + areaBox.height - 30 };
    await band(page, from, to, { release: false });
    await expect(selected(page)).toHaveText('c1,c2,c5,c6,c9,c10,c13,c14');

    const scrolled = await area.evaluate((element) => {
      element.scrollTop = 1000;
      return element.scrollTop;
    });
    expect(scrolled).toBeGreaterThan(100);
    await expect(selected(page)).toHaveText('c1,c2,c5,c6,c9,c10,c13,c14,c17,c18,c21,c22');
    // The band starts where it started on the content, now scrolled out of view.
    const rect = await box(page.getByTestId('band'));
    expectNear(rect.y, from.y - scrolled);
    expectNear(rect.y + rect.height, to.y);

    await page.mouse.up();
    await expect(page.getByTestId('on-selected')).toHaveText('c1,c2,c5,c6,c9,c10,c13,c14,c17,c18,c21,c22');
  });

  test('page scroll before and during the band is accounted for', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 40));
    const from = await corner(page.getByTestId('area'));
    const to = await past(card(page, 'c6'));
    await band(page, from, to, { release: false });
    let rect = await box(page.getByTestId('band'));
    expectNear(rect.y, from.y);
    expectNear(rect.height, to.y - from.y);
    await expect(selected(page)).toHaveText('c1,c2,c5,c6');

    const before = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollBy(0, 100));
    const delta = (await page.evaluate(() => window.scrollY)) - before;
    expect(delta).toBe(100);
    await expect(selected(page)).toHaveText('c1,c2,c5,c6,c9,c10,c13,c14');
    rect = await box(page.getByTestId('band'));
    expectNear(rect.y, from.y - delta);
    expectNear(rect.y + rect.height, to.y);
    await page.mouse.up();
  });

  test('a band in a nested area selects only its own items, into its own Ref', async ({ page }) => {
    const inner = page.getByTestId('inner-area');
    const n2 = page.locator('[data-testid="inner-area"] [data-id="n2"]');
    await band(page, await corner(inner), await past(n2), { release: false });
    await expect(page.getByTestId('inner-band')).toHaveCount(1);
    await expect(page.getByTestId('band')).toHaveCount(0);
    await expect(page.getByTestId('inner-selected')).toHaveText('n1,n2');
    await page.mouse.up();

    await expect(page.getByTestId('inner-on-selected')).toHaveText('n1,n2');
    await expect(page.getByTestId('all-selected')).toHaveText('');
  });

  test('the outer band skips items owned by a nested area', async ({ page }) => {
    const n4 = await box(page.locator('[data-testid="inner-area"] [data-id="n4"]'));
    const innerBox = await box(page.getByTestId('inner-area'));
    await band(page, await corner(page.getByTestId('area')), {
      x: innerBox.x + innerBox.width + 4,
      y: n4.y + n4.height + 4,
    });
    // The band covers the whole grid width and the nested cards.
    await expect(selected(page)).toContainText('c1,c2,c3,c4,c5,c6,c7,c8');
    await expect(page.getByTestId('all-selected')).not.toContainText('n');
    await expect(page.getByTestId('inner-selected')).toHaveText('');
  });

  test('no drag starts while selecting', async ({ page }) => {
    await band(page, await corner(page.getByTestId('area')), await past(card(page, 'c6')), { release: false });
    await expect(page.getByTestId('status')).toHaveText('selecting');
    // The band passed over draggable cards: still no drag.
    await page.mouse.move(...(Object.values(await past(card(page, 'c11'))) as [number, number]), { steps: 5 });
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
    // Keyboard pickup is blocked too.
    await card(page, 'c1').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0);
    await expect(page.getByTestId('status')).toHaveText('selecting');

    await page.mouse.up();
    await expect(page.getByTestId('status')).toHaveText('idle');
    await expect(page.getByTestId('order')).toHaveText(ORDER);
  });

  test('Escape and pointercancel cancel the band and restore the selection', async ({ page }) => {
    await ctrlClick(page, card(page, 'c1'));
    const from = await corner(page.getByTestId('area'));
    const to = await past(card(page, 'c6'));

    await band(page, from, to, { release: false });
    await expect(selected(page)).toHaveText('c2,c5,c6');
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('band')).toHaveCount(0);
    await expect(selected(page)).toHaveText('c1');
    await expect(page.getByTestId('status')).toHaveText('idle');
    await page.mouse.up();

    await band(page, from, to, { release: false });
    await expect(selected(page)).toHaveText('c2,c5,c6');
    await page.evaluate(() =>
      document.dispatchEvent(new PointerEvent('pointercancel', { pointerId: 1, isPrimary: true })),
    );
    await expect(page.getByTestId('band')).toHaveCount(0);
    await expect(selected(page)).toHaveText('c1');
    await page.mouse.up();
    // A cancelled band never reports a selection.
    await expect(page.getByTestId('on-selected')).toHaveText('');
  });

  test('clearing the selection', async ({ page }) => {
    await band(page, await corner(page.getByTestId('area')), await past(card(page, 'c6')));
    await expect(selected(page)).toHaveText('c1,c2,c5,c6');
    await page.getByTestId('clear').click();
    await expect(selected(page)).toHaveText('');
    await expect(card(page, 'c1')).not.toHaveClass(/selected/);
  });

  test('selected cards are dragged together and stay selected after a cancel', async ({ page }) => {
    await band(page, await corner(page.getByTestId('area')), await past(card(page, 'c2')));
    await expect(selected(page)).toHaveText('c1,c2');

    const start = await box(card(page, 'c1'));
    await page.mouse.move(start.x + 20, start.y + 20);
    await page.mouse.down();
    await page.mouse.move(start.x + 20, start.y + 60, { steps: 5 });
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await expect(page.locator('[data-dnd-overlay]')).toContainText('2');
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await page.mouse.up();

    await expect(page.getByTestId('order')).toHaveText(ORDER);
    await expect(selected(page)).toHaveText('c1,c2');
  });
});
