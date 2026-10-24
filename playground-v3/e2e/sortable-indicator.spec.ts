import { expect, test, type Page } from '@playwright/test';
import { center, dragTo, glide, item, pickUp, trackErrors, waitForIdle } from './helpers';

const state = (page: Page) => page.getByTestId('state');
const list = (page: Page, id: string) => page.locator(`[data-testid="${id}"]:not([data-dnd-overlay] *)`);
const order = (page: Page, id: string) =>
  list(page, id).locator(':scope > [data-id]').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-id')));

test.describe("placeholder: 'indicator'", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#lists');
    await expect(state(page)).toContainText('indicator:i1,i2,i3,i4,i5,i6 | indicator-b:j1,j2,j3');
  });

  test('the list does not move; the line follows the pointer', async ({ page }) => {
    const errors = trackErrors(page);
    await dragTo(page, item(page, 'i1'), await center(item(page, 'i4'), 0.8), { release: false });
    expect(await order(page, 'indicator')).toEqual(['i1', 'i2', 'i3', 'i4', 'i5', 'i6']);
    await expect(item(page, 'i4')).toHaveAttribute('data-indicator', 'after');
    await expect(list(page, 'indicator')).toHaveAttribute('data-indicator-index', '4');
    await expect(item(page, 'i1')).toHaveAttribute('data-dnd-placeholder', '');

    await glide(page, await center(item(page, 'i3'), 0.2), 5);
    await expect(item(page, 'i3')).toHaveAttribute('data-indicator', 'before');
    await expect(item(page, 'i4')).not.toHaveAttribute('data-indicator');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('indicator:i2,i1,i3,i4,i5,i6');
    expect(errors).toEqual([]);
  });

  test('commits below the line when moving down and above it when moving up', async ({ page }) => {
    await dragTo(page, item(page, 'i1'), await center(item(page, 'i4'), 0.8));
    await waitForIdle(page);
    await expect(state(page)).toContainText('indicator:i2,i3,i4,i1,i5,i6');
    await dragTo(page, item(page, 'i5'), await center(item(page, 'i2'), 0.2));
    await waitForIdle(page);
    await expect(state(page)).toContainText('indicator:i5,i2,i3,i4,i1,i6');
  });

  test('below the last item means the end of the list', async ({ page }) => {
    const last = (await item(page, 'i6').boundingBox())!;
    await dragTo(page, item(page, 'i2'), { x: last.x + last.width / 2, y: last.y + last.height + 4 });
    await waitForIdle(page);
    await expect(state(page)).toContainText('indicator:i1,i3,i4,i5,i6,i2');
  });

  test('no line over the active item, and dropping there changes nothing', async ({ page }) => {
    await dragTo(page, item(page, 'i3'), await center(item(page, 'i3'), 0.6), { release: false });
    await expect(page.locator('[data-indicator]')).toHaveCount(0);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('indicator:i1,i2,i3,i4,i5,i6');
  });

  test("dropping outside cancels by default (dropOutside: 'cancel')", async ({ page }) => {
    await pickUp(page, item(page, 'i1'));
    await glide(page, await center(item(page, 'i4'), 0.8));
    await expect(item(page, 'i4')).toHaveAttribute('data-indicator', 'after');
    await glide(page, { x: 900, y: 120 });
    await expect(page.locator('[data-indicator]')).toHaveCount(0);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('indicator:i1,i2,i3,i4,i5,i6');
  });

  test('moves into another indicator list; neither list moves during the drag', async ({ page }) => {
    await dragTo(page, item(page, 'i2'), await center(item(page, 'j2'), 0.3), { release: false });
    expect(await order(page, 'indicator')).toEqual(['i1', 'i2', 'i3', 'i4', 'i5', 'i6']);
    expect(await order(page, 'indicator-b')).toEqual(['j1', 'j2', 'j3']);
    await expect(item(page, 'j2')).toHaveAttribute('data-indicator', 'before');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toContainText('indicator:i1,i3,i4,i5,i6 | indicator-b:j1,i2,j2,j3');
  });

  test('multi-drag: moved keys before the line are accounted for', async ({ page }) => {
    await item(page, 'i1').click({ modifiers: ['ControlOrMeta'] });
    await item(page, 'i3').click({ modifiers: ['ControlOrMeta'] });
    await dragTo(page, item(page, 'i1'), await center(item(page, 'i5'), 0.8));
    await waitForIdle(page);
    await expect(state(page)).toContainText('indicator:i2,i4,i5,i1,i3,i6');
  });
});
