import type { Page } from '@playwright/test';
import { center } from './helpers';
// The kit fixture fails a test on page errors, console errors and Vue warnings.
import { at, byId, centerOnScreen, drag, expect, fitsScreen, test, waitForIdle } from './kit-helpers';
import { longPress, touchscreen } from './touch-helpers';

// The manual checklist for real phones (#device-check): a smoke test of the page itself.
// The checks are for a human with a device; here only the page has to work.

const CHECK_COUNT = 11;
const check = (page: Page, id: string) => page.getByTestId(`check-${id}`);
const progress = (page: Page) => page.getByTestId('progress');
const summary = (page: Page) => page.getByTestId('summary');

test.describe('device check page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#device-check');
    await expect(page.getByRole('heading', { name: 'Device check' })).toBeVisible();
  });

  test('renders every check with its area, verdict buttons, and how to open it on a phone', async ({ page }) => {
    // Its own header instead of the playground nav.
    await expect(page.locator('nav')).toHaveCount(0);
    await expect(page.getByTestId('how-to-open')).toContainText('yarn dev:host');
    await expect(page.getByTestId('localhost-warning')).toBeVisible();
    const cards = page.locator('[data-testid^="check-"]');
    await expect(cards).toHaveCount(CHECK_COUNT);
    for (const card of await cards.all()) {
      await expect(card.getByTestId('pass')).toHaveAttribute('aria-pressed', 'false');
      await expect(card.getByTestId('fail')).toHaveAttribute('aria-pressed', 'false');
      await expect(card.getByTestId('probe')).not.toBeEmpty();
      await expect(card.locator('[data-id]').first()).toBeVisible();
    }
    await expect(progress(page)).toHaveText(`0 of ${CHECK_COUNT} checked: 0 passed, 0 failed`);
    await expect(summary(page)).toHaveValue(/^vue-dnd-kit device check, /);
  });

  test('verdicts and notes are kept across reloads and listed in the summary; reset takes two taps', async ({
    page,
  }) => {
    await check(page, 'basics').getByTestId('pass').click();
    await check(page, 'pen').getByTestId('fail').click();
    await check(page, 'pen').getByTestId('note').fill('no pen here');
    await check(page, 'pen').getByTestId('note').press('Tab');
    await expect(progress(page)).toHaveText(`2 of ${CHECK_COUNT} checked: 1 passed, 1 failed`);
    await expect(summary(page)).toHaveValue(/^1\. Long press drags, a swipe scrolls: PASS$/m);
    await expect(summary(page)).toHaveValue(/^11\. Pen: FAIL \(no pen here\)$/m);
    await expect(summary(page)).toHaveValue(/^2\. No callout menu or magnifier: not run$/m);

    await page.reload();
    await expect(check(page, 'basics').getByTestId('pass')).toHaveAttribute('aria-pressed', 'true');
    await expect(check(page, 'pen').getByTestId('fail')).toHaveAttribute('aria-pressed', 'true');
    await expect(check(page, 'pen').getByTestId('note')).toHaveValue('no pen here');
    await expect(progress(page)).toHaveText(`2 of ${CHECK_COUNT} checked: 1 passed, 1 failed`);

    // Pressing the chosen verdict again clears it.
    await check(page, 'basics').getByTestId('pass').click();
    await expect(check(page, 'basics').getByTestId('pass')).toHaveAttribute('aria-pressed', 'false');
    await expect(progress(page)).toHaveText(`1 of ${CHECK_COUNT} checked: 0 passed, 1 failed`);

    const reset = page.getByTestId('reset');
    await reset.click();
    await expect(reset).toHaveText('Tap again to reset');
    await expect(progress(page)).toHaveText(`1 of ${CHECK_COUNT} checked: 0 passed, 1 failed`);
    await reset.click();
    await expect(progress(page)).toHaveText(`0 of ${CHECK_COUNT} checked: 0 passed, 0 failed`);
    await page.reload();
    await expect(progress(page)).toHaveText(`0 of ${CHECK_COUNT} checked: 0 passed, 0 failed`);
    await expect(check(page, 'pen').getByTestId('note')).toHaveValue('');
  });

  test('copy puts the summary on the clipboard, or selects it for copying', async ({ page }) => {
    await page.getByTestId('copy').click();
    await expect(page.getByTestId('copy-status')).toHaveText(/^(Copied|Selected: copy it from the system menu)$/);
  });

  test('the areas are live: a drag in a check is reported under its area', async ({ page }) => {
    const area = check(page, 'basics');
    await drag(page, byId(area, 'b1'), await at(byId(area, 'b3'), 0.5, 0.8));
    await waitForIdle(page);
    await expect(area.getByTestId('probe')).toContainText('drags 1, last dropped');
    await expect(area.getByTestId('probe')).toContainText('pointers: mouse');
    await expect(summary(page)).toHaveValue(/pointers seen: mouse/);
  });

  test('Arm adds a history step: going back stays on the page and is reported', async ({ page }) => {
    const area = check(page, 'edge-back');
    await area.getByTestId('arm').click();
    await expect(area).toContainText('Armed: going back stays on this page.');
    await expect(check(page, 'system-back')).not.toContainText('Armed');
    await page.goBack();
    await expect(page.getByRole('heading', { name: 'Device check' })).toBeVisible();
    await expect(area.getByTestId('probe')).toContainText('back caught 1');
  });
});

test.describe('device check page on a phone @touch', () => {
  test('fits the screen; a tap gives a verdict, a long press drags in an area', async ({ page }) => {
    await page.goto('/#device-check');
    await expect(page.getByRole('heading', { name: 'Device check' })).toBeVisible();
    expect(await fitsScreen(page)).toBe(true);

    const area = check(page, 'basics');
    // Mid-screen: near the bottom edge the page would auto-scroll (legitimately).
    await centerOnScreen(byId(area, 'b2'));
    const finger = (await touchscreen(page)).finger();
    await longPress(page, finger, byId(area, 'b1'));
    await finger.move(await center(byId(area, 'b3'), 0.8), { steps: 12 });
    await finger.up();
    await waitForIdle(page);
    await expect(area.getByTestId('probe')).toContainText('drags 1, last dropped');
    await expect(area.getByTestId('probe')).toContainText('page scrolled 0px in the last drag');
    await expect(area.getByTestId('probe')).toContainText('pointers: touch');

    await area.getByTestId('pass').tap();
    await expect(area.getByTestId('pass')).toHaveAttribute('aria-pressed', 'true');
    await expect(progress(page)).toHaveText(`1 of ${CHECK_COUNT} checked: 1 passed, 0 failed`);
  });
});
