import { expect, test, type Page } from '@playwright/test';
import { center, trackErrors, trackVueWarnings } from './helpers';
import { byId, drag, hold, press, settled } from './app-helpers';

const INITIAL =
  'demo:Fri 15:30-16:30 | design:Tue 10:00-11:00 | lunch:Wed 12:00-13:00 | planning:Thu 14:00-15:30 | standup:Mon 09:00-09:30';
const DAY = 110;
const SLOT = 24;
const state = (page: Page) => page.getByTestId('calendar-state');
const ghostTime = (page: Page) => page.locator('[data-dnd-overlay] [data-testid="ghost-time"]');

/**
 * Where to move the pointer so the event shifts by whole cells. The extra pixels keep
 * the offset well away from the half-cell where snapping would round the other way.
 */
const shifted = async (page: Page, id: string, days: number, slots: number) => {
  const start = await center(byId(page, id));
  return { start, to: { x: start.x + days * DAY + Math.sign(days) * 20, y: start.y + slots * SLOT + 5 } };
};

test.describe('app: calendar', () => {
  let errors: string[];
  let warnings: string[];

  test.beforeEach(async ({ page }) => {
    errors = trackErrors(page);
    warnings = trackVueWarnings(page);
    await page.goto('/#app-calendar');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
  });

  test('an event snaps to the grid and lands on the time the overlay shows', async ({ page }) => {
    const { start, to } = await shifted(page, 'design', 1, 3);
    await hold(page, start, to);
    await expect(ghostTime(page)).toHaveText('Wed 11:30 – 12:30');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toContainText('design:Wed 11:30-12:30');
    await expect(page.getByTestId('calendar-last')).toHaveText('Design review moved to Wed 11:30 – 12:30');
  });

  test('weekends refuse events, and refused or cancelled drags fly back', async ({ page }) => {
    const { start, to } = await shifted(page, 'demo', 1, 0);
    await hold(page, start, to);
    await expect(ghostTime(page)).toHaveText('Weekends are off');
    await expect(page.locator('[data-dnd-overlay] [data-testid="event-ghost"]')).toHaveAttribute('data-accepted', 'false');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toHaveText(INITIAL);

    const move = await shifted(page, 'planning', -1, -2);
    await hold(page, move.start, move.to);
    await expect(ghostTime(page)).toHaveText('Wed 13:00 – 14:30');
    await page.keyboard.press('Escape');
    await settled(page);
    await page.mouse.up();
    await expect(state(page)).toHaveText(INITIAL);
  });

  test('restrictToParent keeps events inside the week', async ({ page }) => {
    // Up and left past the grid: the event stops at Monday 08:00.
    const standup = await center(byId(page, 'standup'));
    await hold(page, standup, { x: standup.x - 96, y: standup.y - 80 });
    await expect(ghostTime(page)).toHaveText('Mon 08:00 – 08:30');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toContainText('standup:Mon 08:00-08:30');

    // Far down: a 90-minute event ends at 18:00 at the latest.
    const planning = await center(byId(page, 'planning'));
    await drag(page, planning, { x: planning.x, y: planning.y + 250 });
    await settled(page);
    await expect(state(page)).toContainText('planning:Thu 16:30-18:00');
  });

  test('keyboard: arrows move a picked-up event by a day or a half-hour', async ({ page }) => {
    await byId(page, 'lunch').focus();
    await press(page, 'Space', 'ArrowRight', 'ArrowDown', 'ArrowDown');
    await expect(ghostTime(page)).toHaveText('Thu 13:00 – 14:00');
    // Saturday is refused, Friday is fine.
    await press(page, 'ArrowRight', 'ArrowRight');
    await expect(ghostTime(page)).toHaveText('Weekends are off');
    await press(page, 'ArrowLeft', 'Space');
    await settled(page);
    await expect(state(page)).toContainText('lunch:Fri 13:00-14:00');
    await expect(byId(page, 'lunch')).toBeFocused();
  });
});
