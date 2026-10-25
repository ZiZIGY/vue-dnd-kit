import { expect, test, type Page } from '@playwright/test';
import { center, dragTo, trackErrors, waitForIdle } from './helpers';

/**
 * A custom sensor (#sensors): an on-screen joystick built with `defineSensor`, next to
 * the built-in pointer and keyboard sensors. The provider runs the checks, the hold
 * (activation delay), sorting under the cursor and Escape for it.
 */

const order = (page: Page) => page.getByTestId('sensors-order');
const overlay = (page: Page) => page.locator('[data-dnd-overlay]');
const status = (page: Page) => page.getByTestId('joystick-status');

/** Presses the pad's A button for `ms`. */
const holdA = async (page: Page, ms: number) => {
  const point = await center(page.getByTestId('pad-a'));
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
};

const pad = async (page: Page, arrow: 'up' | 'down' | 'left' | 'right', times = 1) => {
  for (let i = 0; i < times; i++) await page.getByTestId(`pad-${arrow}`).click();
};

test.describe('custom sensor: on-screen joystick', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#sensors');
    await expect(order(page)).toHaveText('joy:j1,j2,j3,j4,j5');
  });

  test('holding A picks up the item under the cursor, the arrows sort the list, A drops', async ({ page }) => {
    const errors = trackErrors(page);
    await holdA(page, 450);
    await expect(overlay(page)).toHaveCount(1);
    await expect(status(page)).toHaveText('dragging');
    // A pointer drag: the list sorts under the cursor.
    await expect(page.getByTestId('joystick-sensor')).toHaveText('pointer');
    // Rows are 48px apart and a press moves 24px from the center of j1: three presses take
    // the cursor past j2, five past j3.
    await pad(page, 'down', 3);
    await expect(page.getByTestId('joy').locator('[data-id]')).toHaveText(['J2', 'J1', 'J3', 'J4', 'J5']);
    await pad(page, 'down', 2);
    await expect(page.locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'j1');
    await expect(page.getByTestId('joy').locator('[data-id]')).toHaveText(['J2', 'J3', 'J1', 'J4', 'J5']);
    await page.getByTestId('pad-a').click();
    await waitForIdle(page);
    await expect(order(page)).toHaveText('joy:j2,j3,j1,j4,j5');
    expect(errors).toEqual([]);
  });

  test('releasing A before the hold is over picks up nothing', async ({ page }) => {
    await holdA(page, 80);
    await page.waitForTimeout(400);
    await expect(overlay(page)).toHaveCount(0);
    await expect(status(page)).toHaveText('idle');
    // The hold starts over next time.
    await holdA(page, 450);
    await expect(overlay(page)).toHaveCount(1);
    await page.getByTestId('pad-b').click();
    await waitForIdle(page);
  });

  test('B and Escape cancel: the item goes back', async ({ page }) => {
    await holdA(page, 450);
    await pad(page, 'down', 4);
    await expect(page.getByTestId('joy').locator('[data-id]').first()).toHaveText('J2');
    await page.getByTestId('pad-b').click();
    await waitForIdle(page);
    await expect(order(page)).toHaveText('joy:j1,j2,j3,j4,j5');

    // The keyboard sensor cancels every drag with Escape, the joystick's too.
    await page.getByTestId('joystick-aim').click();
    await holdA(page, 450);
    await pad(page, 'down', 4);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await expect(order(page)).toHaveText('joy:j1,j2,j3,j4,j5');
  });

  test('the cursor over nothing draggable picks up nothing; the mouse still drags', async ({ page }) => {
    await pad(page, 'up', 4);
    await holdA(page, 450);
    await expect(overlay(page)).toHaveCount(0);
    await expect(status(page)).toHaveText('idle');

    const target = await center(page.locator('[data-id="j3"]'), 0.8);
    await dragTo(page, page.locator('[data-id="j1"]'), target);
    await waitForIdle(page);
    await expect(order(page)).toHaveText('joy:j2,j3,j1,j4,j5');
  });
});
