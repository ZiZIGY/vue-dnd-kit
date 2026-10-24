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
