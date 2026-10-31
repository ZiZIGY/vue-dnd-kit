import { expect, test, type Page } from '@playwright/test';
import { trackErrors } from './helpers';
import { at, beside, byId, byTestId, drag, hold, press, settled } from './app-helpers';

const INITIAL = 'midnight,ocean,neon,glass';
const state = (page: Page) => page.getByTestId('queue-state');
const entry = (page: Page, track: string) => byTestId(page, 'queue').locator(`[data-track="${track}"]`);
const track = (page: Page, id: string) => byId(page, `lib-${id}`);
const log = (page: Page) => page.getByTestId('announcements').locator('li');

/** The newest log line says `text`, and the provider's live region says the same. */
const announced = async (page: Page, text: string) => {
  await expect(log(page).first()).toHaveText(text);
  await expect(page.locator('[role="status"]').filter({ hasText: text })).toHaveCount(1);
};

test.describe('app: playlist', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = trackErrors(page);
    await page.goto('/demo/#app-playlist');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
  });

  test('a library track is added where it is dropped (createItem)', async ({ page }) => {
    // Up into the queue, onto the left part of "Neon Lights".
    const target = await at(entry(page, 'neon'), 0.3, 0.5);
    await hold(page, track(page, 'ember'), [{ x: target.x, y: target.y + 90 }, target]);
    const slot = byTestId(page, 'queue').locator('[data-dnd-placeholder]');
    await expect(slot).toHaveAttribute('data-track', 'ember');
    await expect(byTestId(page, 'queue')).toHaveAttribute('data-accepting');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toHaveText('midnight,ocean,ember,neon,glass');
    await announced(page, '“Ember” by Northbound added to the queue at position 3 of 5.');
    await expect(track(page, 'ember')).toContainText('queued');
  });

  test('queued tracks reorder by pointer and leave the queue on the library', async ({ page }) => {
    const first = await at(entry(page, 'midnight'), 0.25, 0.5);
    await drag(page, entry(page, 'neon'), [beside(first, 400), first]);
    await settled(page);
    await expect(state(page)).toHaveText('neon,midnight,ocean,glass');
    await expect(page.getByTestId('now-playing')).toHaveText('Neon Lights');

    await hold(page, entry(page, 'glass'), await at(page.getByTestId('library'), 0.5, 0.4));
    await expect(page.getByTestId('library')).toHaveAttribute('data-over');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toHaveText('neon,midnight,ocean');
    await announced(page, '“Glass Houses” by Paper Kites Club removed from the queue.');
    await expect(track(page, 'glass')).not.toContainText('queued');
  });

  test('keyboard: a queued track is moved, every position announced', async ({ page }) => {
    await entry(page, 'neon').focus();
    await press(page, 'Space');
    await announced(page, 'Picked up “Neon Lights” by Aurora Lane, position 3 of 4 in the queue.');
    await press(page, 'ArrowLeft');
    await announced(page, '“Neon Lights” by Aurora Lane moved to position 2 of 4 in the queue.');
    await press(page, 'ArrowLeft');
    await announced(page, '“Neon Lights” by Aurora Lane moved to position 1 of 4 in the queue.');
    await press(page, 'Space');
    await announced(page, '“Neon Lights” by Aurora Lane dropped at position 1 of 4 in the queue.');
    await settled(page);
    await expect(state(page)).toHaveText('neon,midnight,ocean,glass');
    await expect(entry(page, 'neon')).toBeFocused();
    // Pick up, two moves (each spoken once the drag rests) and the drop.
    await expect(log(page)).toHaveCount(4);
  });

  test('keyboard: a library track goes up into the queue and along it', async ({ page }) => {
    await track(page, 'ember').focus();
    await press(page, 'Space');
    await announced(page, 'Picked up “Ember” by Northbound from the library.');
    // Up enters the queue level with the track (its center is past Ocean Static's), as
    // keyboard moves between lists do: the library behaviour, no app code.
    await press(page, 'ArrowUp');
    await expect(byTestId(page, 'queue').locator('[data-dnd-placeholder]')).toHaveAttribute('data-track', 'ember');
    await announced(page, '“Ember” by Northbound will be added at position 3 of 5 in the queue.');
    // Along the queue the arrows move the entry it made for the track, one slot each.
    await press(page, 'ArrowRight', 'ArrowRight');
    await announced(page, '“Ember” by Northbound will be added at position 5 of 5 in the queue.');
    await press(page, 'ArrowLeft', 'ArrowLeft');
    await announced(page, '“Ember” by Northbound will be added at position 3 of 5 in the queue.');
    await press(page, 'Space');
    await announced(page, '“Ember” by Northbound added to the queue at position 3 of 5.');
    await settled(page);
    await expect(state(page)).toHaveText('midnight,ocean,ember,neon,glass');
    // The track never left the library: it keeps the focus.
    await expect(track(page, 'ember')).toBeFocused();
  });

  test('keyboard: Escape cancels, Delete removes, and the buttons work too', async ({ page }) => {
    await entry(page, 'ocean').focus();
    await press(page, 'Space', 'ArrowRight', 'ArrowRight');
    await press(page, 'Escape');
    await announced(page, 'Cancelled. “Ocean Static” by Low Tide returned to position 2 of 4 in the queue.');
    await settled(page);
    await expect(state(page)).toHaveText(INITIAL);

    // Focus is back on the entry: Delete takes it out and focus moves on.
    await expect(entry(page, 'ocean')).toBeFocused();
    await press(page, 'Delete');
    await expect(state(page)).toHaveText('midnight,neon,glass');
    await expect(entry(page, 'neon')).toBeFocused();

    await page.getByTestId('add-tides').click();
    await page.getByTestId('skip').click();
    await expect(state(page)).toHaveText('neon,glass,tides');
    await expect(page.getByTestId('now-playing')).toHaveText('Neon Lights');
  });
});
