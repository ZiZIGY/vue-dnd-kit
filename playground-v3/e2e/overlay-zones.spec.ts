import { expect, test, type Page } from '@playwright/test';
import { center, glide, item, pickUp, trackErrors, waitForIdle } from './helpers';

const INITIAL = 'backlog:b1,b2,b3,b4 | sprint:s1,s2 | frozen:f1';
const state = (page: Page) => page.getByTestId('state');
const look = (page: Page) => page.locator('[data-dnd-overlay] [data-overlay-kind="zone"]');
const hint = (page: Page) => page.getByTestId('overlay-hint');
const badge = (page: Page) => page.getByTestId('copy-badge');

/** Expects the overlay to show `zone` in `state` ('accepted' or 'rejected'). */
const expectLook = async (page: Page, zone: string, verdict: 'accepted' | 'rejected') => {
  await expect(look(page)).toHaveAttribute('data-zone', zone);
  await expect(look(page)).toHaveAttribute('data-state', verdict);
};

test.describe('overlay over zones (overlay-zones)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#overlay-zones');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('names each zone and turns red where the card is not allowed', async ({ page }) => {
    const errors = trackErrors(page);
    await pickUp(page, item(page, 'b1'));
    await expectLook(page, 'backlog', 'accepted');

    await glide(page, await center(item(page, 's1')));
    await expectLook(page, 'sprint', 'accepted');
    await expect(hint(page)).toHaveText('Move to Sprint');

    // A list whose group takes nothing (`put: false`).
    await glide(page, await center(item(page, 'f1')));
    await expectLook(page, 'frozen', 'rejected');
    await expect(hint(page)).toHaveText('Not allowed in Frozen');

    // Plain droppables tell the overlay about themselves through `data`.
    await glide(page, await center(page.getByTestId('zone-trash')));
    await expectLook(page, 'trash', 'accepted');
    await expect(look(page)).toHaveAttribute('data-tone', 'danger');
    await expect(hint(page)).toHaveText('Release to delete');

    await glide(page, await center(page.getByTestId('zone-locked')));
    await expectLook(page, 'locked', 'rejected');
    await expect(hint(page)).toHaveText('Not allowed in Archive');

    // Released over a refusing zone: the card goes back.
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(INITIAL);
    expect(errors).toEqual([]);
  });

  test('the trash zone deletes the card', async ({ page }) => {
    await pickUp(page, item(page, 'b2'));
    await glide(page, await center(page.getByTestId('zone-trash')));
    await expect(look(page)).toHaveAttribute('data-tone', 'danger');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText('backlog:b1,b3,b4 | sprint:s1,s2 | frozen:f1');
  });

  test('a copy badge while Alt is held over another list', async ({ page }) => {
    await pickUp(page, item(page, 'b1'));
    await glide(page, await center(item(page, 's1'), 0.25));
    await expectLook(page, 'sprint', 'accepted');
    await expect(badge(page)).toHaveCount(0);

    // (Reading Alt live, press and release mid-drag, is covered by sortable-modes.spec.ts.)
    await page.keyboard.down('Alt');
    await expect(badge(page)).toBeVisible();
    await expect(hint(page)).toHaveText('Copy to Sprint');
    await page.mouse.up();
    await page.keyboard.up('Alt');
    await waitForIdle(page);
    await expect(state(page)).toHaveText(/^backlog:b1,b2,b3,b4 \| sprint:[\w,-]*b1-copy\d+[\w,-]* \| frozen:f1$/);
  });
});
