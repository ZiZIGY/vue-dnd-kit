import { expect, test, type Page } from '@playwright/test';
import { trackErrors } from './helpers';
import { at, beside, byId, byTestId, ctrlClick, drag, glideTo, hold, press, settled } from './app-helpers';

const INITIAL = 'backlog:c1,c2 | todo:c3,c4,c5 | doing:c6,c7 | review:c8,c9 | done:c10';
const state = (page: Page) => page.getByTestId('board-state');
const cards = (page: Page, column: string) => byTestId(page, `cards-${column}`);
const activity = (page: Page) => page.getByTestId('activity');
const overlay = (page: Page) => page.locator('[data-dnd-overlay] [data-testid="board-overlay"]');

test.describe('app: trello board', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = trackErrors(page);
    await page.goto('/#app-board');
    await expect(state(page)).toHaveText(INITIAL);
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
  });

  test('a card moves to another column under a tilted custom overlay', async ({ page }) => {
    // Into the upper part of "Export to CSV", coming from the side: the card goes in before it.
    const target = await at(byId(page, 'c7'), 0.5, 0.25);
    await hold(page, byId(page, 'c5'), [beside(target, -130), target]);
    await expect(overlay(page)).toHaveAttribute('data-kind', 'card');
    await expect(overlay(page)).toContainText('Fix login redirect');
    const transform = await overlay(page).evaluate((element) => getComputedStyle(element).transform);
    expect(transform).not.toBe('none');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toHaveText('backlog:c1,c2 | todo:c3,c4 | doing:c6,c5,c7 | review:c8,c9 | done:c10');
    await expect(activity(page).locator('li').first()).toHaveText('Moved “Fix login redirect” to In progress');
    await expect(byTestId(page, 'count-doing')).toHaveText('3 / 3');
  });

  test('Ctrl/Cmd+click selects cards; WIP limits (group.put) count the whole selection', async ({ page }) => {
    await ctrlClick(byId(page, 'c3'), byId(page, 'c5'));
    await expect(page.getByTestId('selection')).toContainText('2 cards selected');
    // Review is full...
    await hold(page, byId(page, 'c3'), await at(cards(page, 'review'), 0.5, 0.85));
    await expect(overlay(page)).toHaveAttribute('data-count', '2');
    await expect(byTestId(page, 'limit-review')).toHaveText('WIP limit of 2 reached');
    await expect(overlay(page)).toHaveAttribute('data-refused');
    // ...and two cards don't fit into "In progress" (2 of 3 taken)...
    await glideTo(page, await at(cards(page, 'doing'), 0.5, 0.85), 12);
    await expect(cards(page, 'doing')).toHaveAttribute('data-refusing');
    // ...but they do into the backlog, in their board order.
    await glideTo(page, await at(cards(page, 'backlog'), 0.5, 0.9), 12);
    await expect(cards(page, 'backlog')).toHaveAttribute('data-accepting');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toHaveText('backlog:c1,c2,c3,c5 | todo:c4 | doing:c6,c7 | review:c8,c9 | done:c10');
    await expect(activity(page).locator('li').first()).toHaveText('Moved 2 cards to Backlog');
  });

  test('moving into Done waits for the confirmation dialog', async ({ page }) => {
    await drag(page, byId(page, 'c6'), await at(cards(page, 'done'), 0.5, 0.8));
    const dialog = page.getByTestId('confirm');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('“Dark mode” will be marked as finished.');
    // The drop is pending: nothing is committed yet and the overlay waits in place.
    await expect(state(page)).toHaveText(INITIAL);
    await expect(overlay(page)).toBeVisible();
    await page.getByTestId('confirm-accept').click();
    await settled(page);
    await expect(dialog).toHaveCount(0);
    await expect(state(page)).toHaveText('backlog:c1,c2 | todo:c3,c4,c5 | doing:c7 | review:c8,c9 | done:c10,c6');
    await expect(activity(page).locator('li').first()).toHaveText('Moved “Dark mode” to Done');
  });

  test('cancelling the dialog flies the card back', async ({ page }) => {
    await drag(page, byId(page, 'c8'), await at(byId(page, 'c10'), 0.5, 0.25));
    await expect(page.getByTestId('confirm')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('confirm')).toHaveCount(0);
    // A rejected drop is a cancel: the overlay flies home and the board is unchanged.
    await settled(page);
    await expect(state(page)).toHaveText(INITIAL);
    await expect(activity(page).locator('li').first()).toHaveText('Kept “Billing webhooks” out of Done');
  });

  test('cards go to the trash, alone or as a selection', async ({ page }) => {
    await drag(page, byId(page, 'c1'), await at(page.getByTestId('trash'), 0.3, 0.6));
    await settled(page);
    await expect(state(page)).toHaveText('backlog:c2 | todo:c3,c4,c5 | doing:c6,c7 | review:c8,c9 | done:c10');

    await ctrlClick(byId(page, 'c4'), byId(page, 'c9'));
    await hold(page, byId(page, 'c9'), await at(page.getByTestId('trash'), 0.7, 0.4));
    await expect(page.getByTestId('trash')).toHaveAttribute('data-over');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toHaveText('backlog:c2 | todo:c3,c5 | doing:c6,c7 | review:c8 | done:c10');
    await expect(activity(page).locator('li').first()).toHaveText('Deleted 2 cards');
    await expect(page.getByTestId('selection')).toContainText('Ctrl/Cmd+click');
  });

  test('a new card is added, then columns are reordered by their header', async ({ page }) => {
    await page.getByTestId('add-backlog').click();
    await page.getByTestId('new-title-backlog').fill('Write release notes');
    await page.keyboard.press('Enter');
    await expect(state(page)).toHaveText('backlog:c1,c2,n1 | todo:c3,c4,c5 | doing:c6,c7 | review:c8,c9 | done:c10');
    await page.keyboard.press('Escape');
    const target = await at(byId(page, 'c3'), 0.5, 0.25);
    await drag(page, byId(page, 'n1'), [beside(target, -150), target]);
    await settled(page);
    await expect(state(page)).toHaveText('backlog:c1,c2 | todo:n1,c3,c4,c5 | doing:c6,c7 | review:c8,c9 | done:c10');

    // The column overlay shows the column with its cards.
    await hold(page, byTestId(page, 'header-done'), await at(byTestId(page, 'column-backlog'), 0.2, 0.1));
    await expect(overlay(page)).toHaveAttribute('data-kind', 'column');
    await expect(overlay(page)).toContainText('Landing page copy');
    await page.mouse.up();
    await settled(page);
    await expect(state(page)).toHaveText('done:c10 | backlog:c1,c2 | todo:n1,c3,c4,c5 | doing:c6,c7 | review:c8,c9');
  });

  test('keyboard: a card is moved to Done and confirmed without the mouse', async ({ page }) => {
    await byId(page, 'c8').focus();
    await press(page, 'Space', 'ArrowRight');
    await expect(cards(page, 'done').locator('[data-dnd-placeholder]')).toHaveAttribute('data-id', 'c8');
    await press(page, 'Space');
    await expect(page.getByTestId('confirm-accept')).toBeFocused();
    await press(page, 'Enter');
    await settled(page);
    await expect(state(page)).toHaveText('backlog:c1,c2 | todo:c3,c4,c5 | doing:c6,c7 | review:c9 | done:c8,c10');
    await expect(byId(page, 'c8')).toBeFocused();
  });
});
