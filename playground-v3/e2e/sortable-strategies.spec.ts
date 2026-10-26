import { expect, test, type Page } from '@playwright/test';
import { center, dragTo, frames, glide, item, pickUp, trackErrors, waitForIdle } from './helpers';

const state = (page: Page) => page.getByTestId('state');

test.describe('horizontal lists', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#lists');
  });

  test('reorders along x', async ({ page }) => {
    const errors = trackErrors(page);
    await dragTo(page, item(page, 'h1'), await center(item(page, 'h4')).then((p) => ({ x: p.x + 30, y: p.y })));
    await waitForIdle(page);
    await expect(state(page)).toContainText('horizontal:h2,h3,h4,h1,h5,h6');
    expect(errors).toEqual([]);
  });

  test('keeps sorting when the pointer drifts off the row', async ({ page }) => {
    await pickUp(page, item(page, 'h5'));
    const target = await center(item(page, 'h2'));
    // Move far below the row first, then sideways: the band test is on x only.
    await glide(page, { x: (await center(item(page, 'h5'))).x, y: target.y + 25 }, 4);
    await glide(page, { x: target.x - 30, y: target.y + 25 }, 15);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('horizontal:h1,h5,h2,h3,h4,h6');
  });
});

test.describe('custom placeholder', () => {
  test('user CSS overrides the zero-specificity default', async ({ page }) => {
    await page.goto('/#lists');
    // Mid-screen, away from the page's bottom auto-scroll zone however tall the nav grows.
    await page.getByTestId('custom').evaluate((element) => element.scrollIntoView({ block: 'center' }));
    await dragTo(page, item(page, 'c1'), await center(item(page, 'c3'), 0.8), { release: false });
    const placeholder = page.locator('[data-dnd-placeholder]');
    await expect(placeholder).toHaveAttribute('data-id', 'c1');
    await expect(placeholder).toHaveCSS('opacity', '1');
    await expect(placeholder).toHaveCSS('border-top-style', 'dashed');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('custom:c2,c3,c1,c4,c5');
  });
});

test.describe('grids', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#grid');
  });

  test('moves a cell into the hovered cell of a uniform grid', async ({ page }) => {
    await dragTo(page, item(page, 'g1'), await center(item(page, 'g6')));
    await waitForIdle(page);
    await expect(state(page)).toContainText('uniform:g2,g3,g4,g5,g6,g1,g7,g8,g9,g10');
  });

  test('the empty space after the last cell means "to the end"', async ({ page }) => {
    const last = (await item(page, 'g10').boundingBox())!;
    await dragTo(page, item(page, 'g2'), { x: last.x + last.width + 60, y: last.y + last.height / 2 });
    await waitForIdle(page);
    await expect(state(page)).toContainText('uniform:g1,g3,g4,g5,g6,g7,g8,g9,g10,g2');
  });

  test('variable-size cells do not ping-pong under a jittering pointer', async ({ page }) => {
    const errors = trackErrors(page);
    const target = await center(item(page, 'm5'));
    await pickUp(page, item(page, 'm4'));
    await glide(page, target, 12);
    await frames(page, 4);
    const moves = Number(await page.getByTestId('moves').textContent());
    for (let i = 0; i < 12; i++) {
      await page.mouse.move(target.x + (i % 2 ? 4 : -4), target.y + (i % 3) - 1);
      await frames(page);
    }
    expect(Number(await page.getByTestId('moves').textContent())).toBe(moves);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('masonry:m1,m2,m3,m5,m4,m6,m7,m8,m9');
    expect(errors).toEqual([]);
  });

  test('a big cell moves past small ones and back', async ({ page }) => {
    await pickUp(page, item(page, 'm5'));
    await glide(page, await center(item(page, 'm9')), 15);
    await glide(page, await center(item(page, 'm1')), 15);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('masonry:m5,m1,m2,m3,m4,m6,m7,m8,m9');
  });
});

test.describe('swap', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#swap');
  });

  test('exchanges the active item with the hovered one; the rest stay put', async ({ page }) => {
    await dragTo(page, item(page, 's1'), await center(item(page, 's4')), { release: false });
    // Live preview: the DOM shows the exchange before the drop.
    const order = () =>
      page.locator('[data-testid="swap-list"] > *').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-id')));
    await expect.poll(order).toEqual(['s4', 's2', 's3', 's1', 's5', 's6']);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('swap-list:s4,s2,s3,s1,s5,s6');
  });

  test('moving back over the original slot reverts the swap', async ({ page }) => {
    const origin = await center(item(page, 's1'));
    await dragTo(page, item(page, 's1'), await center(item(page, 's5')), { release: false });
    await expect(page.locator('[data-testid="swap-list"] > *').first()).toHaveAttribute('data-id', 's5');
    await glide(page, origin, 15);
    await expect(page.locator('[data-testid="swap-list"] > *').first()).toHaveAttribute('data-id', 's1');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('swap-list:s1,s2,s3,s4,s5,s6');
  });

  test('swaps cells in a grid', async ({ page }) => {
    await dragTo(page, item(page, 'w1'), await center(item(page, 'w7')));
    await waitForIdle(page);
    await expect(state(page)).toContainText('swap-grid:w7,w2,w3,w4,w5,w6,w1,w8');
  });

  test('the overlay slot gets mode "swap"', async ({ page }) => {
    await dragTo(page, item(page, 's2'), await center(item(page, 's3')), { release: false });
    await expect(page.getByTestId('mode')).toHaveText('swap');
    await page.mouse.up();
    await waitForIdle(page);
  });
});

test.describe('table rows', () => {
  test('reorders <tr> items in a <tbody> list, with a table-wrapped overlay', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/#table');
    await dragTo(page, item(page, 'p1'), await center(item(page, 'p3'), 0.8), { release: false });
    await expect(page.locator('[data-dnd-overlay] table tr')).toHaveCount(1);
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'p1');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText('p2,p3,p1,p4,p5');
    expect(errors).toEqual([]);
  });
});

test.describe('a list that keeps its items inside it (restrictToParent)', () => {
  /**
   * Presses on `id` at `yRatio` of its height, pushes the pointer `beyond` px past the
   * list's edge (the overlay stays inside) and drops. Held near the edge it travels away
   * from, the point would stop short of the end item's center: the end must stay in reach.
   */
  const pushPast = async (page: Page, id: string, yRatio: number, beyond: number) => {
    // In the middle of the window: a pointer released outside it ends no drag in Firefox.
    await page.locator('.list.custom-placeholder').evaluate((list) => list.scrollIntoView({ block: 'center' }));
    const list = (await page.locator('.list.custom-placeholder').boundingBox())!;
    const start = await center(item(page, id), yRatio);
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x, start.y + Math.sign(beyond) * 8, { steps: 2 });
    await glide(page, { x: start.x, y: beyond > 0 ? list.y + list.height + beyond : list.y + beyond }, 16);
    await frames(page, 2);
    const overlay = (await page.locator('[data-dnd-overlay]').boundingBox())!;
    await page.mouse.up();
    await waitForIdle(page);
    return { list, overlay };
  };

  test('an item held near its top edge reaches the last place, one held low the first', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/#lists');
    await page.getByTestId('bound-list').check();
    const { list, overlay } = await pushPast(page, 'c1', 0.1, 40);
    // The overlay stayed inside the list.
    expect(overlay.y + overlay.height).toBeLessThanOrEqual(list.y + list.height + 1);
    await expect(state(page)).toContainText('custom:c2,c3,c4,c5,c1');
    await pushPast(page, 'c1', 0.9, -40);
    await expect(state(page)).toContainText('custom:c1,c2,c3,c4,c5');
    expect(errors).toEqual([]);
  });
});

test.describe('axis lock (list modifiers)', () => {
  /** Left edge of the overlay box while dragging `id` 120px right and down to `target`. */
  const overlayLeftAfterDiagonal = async (page: Page, id: string, target: string) => {
    const startLeft = (await item(page, id).boundingBox())!.x;
    const end = await center(item(page, target), 0.8);
    await dragTo(page, item(page, id), { x: end.x + 120, y: end.y }, { release: false });
    await frames(page, 2);
    const left = (await page.locator('[data-dnd-overlay]').boundingBox())!.x;
    await page.mouse.up();
    await waitForIdle(page);
    return left - startLeft;
  };

  test('table rows stay on the y axis; unticked, they follow the pointer', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto('/#table');
    expect(Math.abs(await overlayLeftAfterDiagonal(page, 'p1', 'p3'))).toBeLessThan(1);
    // Sorting follows the pointer as before: only the overlay is kept on the axis.
    await expect(state(page)).toHaveText('p2,p3,p1,p4,p5');
    await page.getByTestId('lock-axis').uncheck();
    expect(await overlayLeftAfterDiagonal(page, 'p2', 'p4')).toBeGreaterThan(100);
    expect(errors).toEqual([]);
  });

  test('the horizontal list stays on the x axis, the indicator lists move freely', async ({ page }) => {
    await page.goto('/#lists');
    await pickUp(page, item(page, 'h1'));
    const top = (await page.locator('[data-dnd-overlay]').boundingBox())!.y;
    const to = await center(item(page, 'h3'));
    await glide(page, { x: to.x, y: to.y + 60 }, 10);
    await frames(page, 2);
    expect(Math.abs((await page.locator('[data-dnd-overlay]').boundingBox())!.y - top)).toBeLessThan(1);
    await page.mouse.up();
    await waitForIdle(page);

    // Indicator lists exchange items side by side: no lock there.
    await pickUp(page, item(page, 'i1'));
    const left = (await page.locator('[data-dnd-overlay]').boundingBox())!.x;
    await glide(page, await center(item(page, 'j2')), 12);
    await frames(page, 2);
    expect((await page.locator('[data-dnd-overlay]').boundingBox())!.x - left).toBeGreaterThan(100);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
  });
});
