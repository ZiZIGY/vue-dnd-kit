import { expect, test, type Page } from '@playwright/test';
import { trackErrors, trackVueWarnings, waitForIdle } from './helpers';

// The devtools tab, end to end. The playground's Vite plugin (vite.config.ts) serves the tab
// at /__vue-dnd-kit-devtools/ and makes every page report to it. The app and the tab are
// two pages of one browser context: same origin, the page's channel between them, as in
// the DevTools (an iframe) or a window of its own.

const TAB = '/__vue-dnd-kit-devtools/';

/** The app on the kanban demo, and the tab watching it. */
const open = async (page: Page) => {
  await page.goto('/#kanban');
  await expect(page.getByTestId('board')).toHaveText('todo:a1,a2,a3,a4 | doing:b1,b2 | done:');
  const tab = await page.context().newPage();
  await tab.goto(TAB);
  // The mini-map shows the lists, with copies of their cards.
  await expect(tab.locator('[data-testid="zone-todo"] [data-devtools-item]')).toHaveCount(4);
  return tab;
};

/** An item's copy in the mini-map: the first one with this text, in the zone of `list`. */
const copy = (tab: Page, list: string, text: string) =>
  tab.locator(`[data-testid="zone-${list}"] [data-devtools-item]`).filter({ hasText: text });

/**
 * Pushes the joystick's knob to `dx`, `dy` (pixels from the center, the rim is 43 away)
 * until `until` holds for the tab's drag status, then lets it go.
 */
const steer = async (tab: Page, dx: number, dy: number, until: RegExp) => {
  const ring = (await tab.getByTestId('joystick').boundingBox())!;
  const x = ring.x + ring.width / 2;
  const y = ring.y + ring.height / 2;
  await tab.mouse.move(x, y);
  await tab.mouse.down();
  await tab.mouse.move(x + dx, y + dy, { steps: 4 });
  await expect(tab.getByTestId('drag-status')).toHaveText(until, { timeout: 10_000 });
  await tab.mouse.move(x, y);
  await tab.mouse.up();
};

test('the tab: a card chosen in the mini-map is steered with the joystick and dropped in another list', async ({ page }) => {
  const errors = trackErrors(page);
  const warnings = trackVueWarnings(page);
  const tab = await open(page);
  const tabErrors = trackErrors(tab);

  // The registry, as the former inspector showed it.
  await expect(tab.locator('[data-label="list todo"]')).toBeVisible();
  await expect(tab.locator('[data-label="b2"]')).toBeVisible();

  await copy(tab, 'todo', 'Card A1').click();
  await expect(tab.getByTestId('chosen-item')).toHaveText('a1');
  // Right, at half tilt: over the next column.
  await steer(tab, 22, 0, /over doing \(accepts\)/);
  // The mini-map follows: the placeholder is in `doing`, the overlay shows the card.
  await expect(tab.locator('[data-testid="zone-doing"] [data-devtools-item][data-placeholder]')).toHaveCount(1);
  await expect(tab.getByTestId('drag-preview')).toContainText('Card A1');
  await tab.getByTestId('drop').click();
  await waitForIdle(page);
  await expect(page.getByTestId('board')).toHaveText(/^todo:a2,a3,a4 \| doing:(a1,b1,b2|b1,a1,b2|b1,b2,a1) \| done:$/);
  await expect(tab.locator('[data-testid="zone-doing"] [data-devtools-item]')).toHaveCount(3);

  // The log names the drag's sensor.
  await tab.getByTestId('tab-log').click();
  await expect(tab.locator('[data-testid="log"] [data-title="drag start"]')).toContainText('a1 · devtools (pointer) · from todo');
  await expect(tab.locator('[data-testid="log"] [data-title="drop"]')).toContainText('on doing');

  expect(errors).toEqual([]);
  expect(warnings).toEqual([]);
  expect(tabErrors).toEqual([]);
});

test('the tab: a list disabled from its options refuses the drag; reset, it drags again', async ({ page }) => {
  const errors = trackErrors(page);
  const tab = await open(page);

  await tab.locator('[data-label="list todo"]').click();
  await tab.getByTestId('tab-options').click();
  await expect(tab.getByTestId('options-title')).toHaveText('list todo');
  await tab.getByTestId('option-disabled').locator('[data-choice="true"]').click();
  await expect(tab.getByTestId('option-disabled')).toHaveAttribute('data-overridden', 'true');
  await expect(tab.locator('[data-testid="zone-todo"]')).toContainText('disabled');

  // The joystick can't pick a card of the list up.
  await tab.getByTestId('tab-drive').click();
  await copy(tab, 'todo', 'Card A2').click();
  await tab.getByTestId('grab').click();
  // And neither can the mouse in the app.
  const card = page.locator('[data-id="a2"]');
  const target = page.locator('[data-id="b1"]');
  const from = (await card.boundingBox())!;
  const to = (await target.boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect(tab.getByTestId('drag-status')).toHaveText('No drag');
  await expect(page.getByTestId('board')).toHaveText('todo:a1,a2,a3,a4 | doing:b1,b2 | done:');

  // Reset: the code's options again, and the card drags.
  await tab.getByTestId('tab-options').click();
  await tab.getByTestId('reset-all').click();
  await expect(tab.getByTestId('option-disabled')).not.toHaveAttribute('data-overridden', 'true');
  await tab.getByTestId('tab-drive').click();
  await steer(tab, 22, 0, /over doing \(accepts\)/);
  await tab.keyboard.press('Space');
  await waitForIdle(page);
  await expect(page.getByTestId('board')).toHaveText(/^todo:a1,a3,a4 \| doing:.*a2.* \| done:$/);
  expect(errors).toEqual([]);
});

test('the tab: an item picked on the page is chosen, and cancelled drags fly back', async ({ page }) => {
  const tab = await open(page);
  await tab.getByTestId('pick').click();
  await expect(tab.getByTestId('pick')).toHaveText('Picking…');
  // The press picks: no drag starts in the app.
  await page.locator('[data-id="b2"]').click();
  await expect(tab.getByTestId('chosen-item')).toHaveText('b2');
  await expect(tab.getByTestId('pick')).toHaveText('Pick on page');

  await steer(tab, -22, 0, /over todo \(accepts\)/);
  await tab.getByTestId('cancel').click();
  await waitForIdle(page);
  await expect(page.getByTestId('board')).toHaveText('todo:a1,a2,a3,a4 | doing:b1,b2 | done:');
});
