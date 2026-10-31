import { expect, test, type Page } from '@playwright/test';
import { center, glide, item, pickUp, trackErrors, trackVueWarnings, waitForIdle } from './helpers';

const INITIAL = 'motion-todo:t1,t2,t3,t4 | motion-doing:g1,g2';
const state = (page: Page) => page.getByTestId('state');
const drops = (page: Page) => page.getByTestId('motion-drops');

test.describe('motion-v recipe (overlay-motion)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/#overlay-motion');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('lifts on pickup and lands with a custom drop animation, without errors', async ({ page }) => {
    const errors = trackErrors(page);
    const warnings = trackVueWarnings(page);
    await pickUp(page, item(page, 't1'));
    const card = page.locator('[data-dnd-overlay] [data-overlay-kind="motion"]');
    await expect(card).toBeVisible();
    // The spring lift: motion transforms the component, never the overlay box.
    await expect.poll(() => card.evaluate((element) => getComputedStyle(element).transform)).not.toBe('none');

    await glide(page, await center(item(page, 'g1'), 0.75));
    await expect(page.getByTestId('motion-doing').locator('[data-id="t1"]')).toHaveCount(1);
    await page.mouse.up();
    await expect(card).toHaveAttribute('data-status', 'dropping');
    await waitForIdle(page);
    await expect(drops(page)).toHaveText('1');
    await expect(state(page)).toHaveText(/^motion-todo:t2,t3,t4 \| motion-doing:[\w,]*t1[\w,]*$/);

    // Cancelling runs the same hook (the overlay flies back). The hook waits on motion's
    // frame loop, which a loaded Firefox runs slowly: allow it more time than usual.
    await pickUp(page, item(page, 't2'));
    await page.keyboard.press('Escape');
    await page.mouse.up();
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(0, { timeout: 15_000 });
    await expect(drops(page)).toHaveText('2');
    await expect(state(page)).toHaveText(/^motion-todo:t2,t3,t4 \| /);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });
});
