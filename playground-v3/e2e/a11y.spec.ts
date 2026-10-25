import { expect, test, type Locator, type Page } from '@playwright/test';
import { center, dragTo, trackErrors, waitForIdle } from './helpers';

const DEFAULT_INSTRUCTIONS =
  'To pick up a draggable item, press space or enter. While dragging, use the arrow keys to move the item. Press space or enter again to drop the item in its new position, or press escape to cancel.';

/** The live region of the provider that describes `item`: it follows the instructions element. */
const liveRegionOf = async (page: Page, item: Locator): Promise<Locator> => {
  const id = await item.getAttribute('aria-describedby');
  expect(id).toBeTruthy();
  return page.locator(`[id="${id}"] + [role="status"]`);
};

const pickUp = async (item: Locator) => {
  await item.focus();
  await item.press('Space');
};

/** Waits for a rendered frame, so the drag loop applies one key press before the next. */
const nextFrame = (page: Page) =>
  page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));

/** Keyboard drag: 100px right per press (Shift), one frame apart so each press is applied. */
const moveRight = async (page: Page, presses: number) => {
  for (let i = 0; i < presses; i++) {
    await page.keyboard.press('Shift+ArrowRight');
    await nextFrame(page);
  }
};

/** Items of the attributes row (the overlay clone carries the same test ids). */
const fixture = (page: Page, testId: string) => page.getByTestId('attributes').getByTestId(testId);

test.describe('accessibility attributes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#a11y');
  });

  test('draggables get role, tabindex, role description and instructions', async ({ page }) => {
    const plain = fixture(page, 'plain');
    await expect(plain).toHaveRole('button');
    await expect(plain).toHaveAttribute('tabindex', '0');
    await expect(plain).toHaveAttribute('aria-roledescription', 'draggable');
    await expect(plain).toHaveAttribute('aria-disabled', 'false');
    await expect(plain).not.toHaveAttribute('aria-pressed');
    await expect(plain).toHaveAccessibleDescription(DEFAULT_INSTRUCTIONS);
    await expect(page.getByRole('button', { name: 'Plain draggable' })).toHaveCount(1);
    await expect(fixture(page, 'locked')).toHaveAttribute('aria-disabled', 'true');
  });

  test('attributes provided by the user are never overridden', async ({ page }) => {
    const custom = fixture(page, 'custom');
    const expectUserAttributes = async () => {
      await expect(custom).toHaveAttribute('role', 'option');
      await expect(custom).toHaveAttribute('tabindex', '-1');
      await expect(custom).toHaveAttribute('aria-roledescription', 'custom card');
      await expect(custom).toHaveAttribute('aria-describedby', 'custom-help');
      await expect(custom).toHaveAttribute('aria-disabled', 'true');
    };
    await expectUserAttributes();
    await expect(custom).toHaveAccessibleDescription('Custom help text');

    // Not a button: no aria-pressed while it is being dragged.
    await pickUp(custom);
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await expect(custom).not.toHaveAttribute('aria-pressed');
    await expectUserAttributes();
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await expectUserAttributes();
  });

  test('a handle is the focusable button, not the item', async ({ page }) => {
    const item = fixture(page, 'handled');
    const grip = item.getByTestId('grip');
    await expect(item).not.toHaveAttribute('tabindex');
    await expect(item).not.toHaveAttribute('role');
    await expect(grip).toHaveAttribute('tabindex', '0');
    await expect(grip).toHaveRole('button');
    await expect(grip).toHaveAccessibleName('Drag handle');
    await expect(grip).toHaveAttribute('aria-roledescription', 'draggable');
    await expect(grip).toHaveAccessibleDescription(DEFAULT_INSTRUCTIONS);

    await pickUp(grip);
    await expect(grip).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await expect(grip).toBeFocused();
    await expect(grip).not.toHaveAttribute('aria-pressed');
  });

  test('while dragging: aria-pressed, and the overlay is hidden from assistive tech', async ({ page }) => {
    const plain = fixture(page, 'plain');
    await pickUp(plain);
    const overlay = page.locator('[data-dnd-overlay]');
    await expect(overlay).toHaveCount(1);
    await expect(plain).toHaveAttribute('aria-pressed', 'true');
    await expect(overlay).toHaveAttribute('aria-hidden', 'true');
    await expect(overlay).toHaveAttribute('inert', '');
    // The clone inside the overlay doesn't add a second button.
    await expect(page.getByRole('button', { name: 'Plain draggable' })).toHaveCount(1);

    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await expect(plain).not.toHaveAttribute('aria-pressed');
    await expect(plain).toBeFocused();
  });

  test('sortable items are described as sortable', async ({ page }) => {
    await page.goto('/#sortable');
    const row = page.locator('[data-testid="list"] [data-id="t1"]');
    await expect(row).toHaveAttribute('aria-roledescription', 'sortable');
    await expect(row).toHaveRole('button');
    await expect(row).toHaveAccessibleDescription(DEFAULT_INSTRUCTIONS);
  });
});

test.describe('instructions and live regions', () => {
  test('exist exactly once per provider', async ({ page }) => {
    await page.goto('/#sortable');
    await expect(page.locator('[role="status"][aria-live]')).toHaveCount(1);

    await page.goto('/#a11y');
    // The app's provider plus the two nested ones.
    await expect(page.locator('[role="status"][aria-live]')).toHaveCount(3);
    const ids = await Promise.all(
      ['plain', 'announce-custom', 'announce-silent'].map((name) =>
        page.getByTestId(name).getAttribute('aria-describedby'),
      ),
    );
    expect(new Set(ids).size).toBe(3);
    for (const id of ids) {
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
      await expect(page.locator(`[id="${id}"] + [role="status"]`)).toHaveCount(1);
    }
    await expect(page.getByTestId('announce-custom')).toHaveAccessibleDescription(
      'Custom instructions for this provider.',
    );

    // Leaving the demo unmounts the nested providers and their elements.
    await page.goto('/#kanban');
    await expect(page.locator('[role="status"][aria-live]')).toHaveCount(1);
  });
});

test.describe('announcements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#a11y');
  });

  test('default announcements for pick up and cancel', async ({ page }) => {
    const plain = fixture(page, 'plain');
    const live = await liveRegionOf(page, plain);
    await pickUp(plain);
    await expect(live).toHaveText('Picked up draggable item plain.');
    await page.keyboard.press('Escape');
    await expect(live).toHaveText('Dragging was cancelled. Draggable item plain was dropped.');
    await waitForIdle(page);
  });

  test('the announcements prop overrides per event and falls back to the defaults', async ({ page }) => {
    const item = page.getByTestId('announce-custom');
    const live = await liveRegionOf(page, item);
    await pickUp(item);
    await expect(live).toHaveText('Custom pickup of announce-custom.');
    await page.keyboard.press('Escape');
    await expect(live).toHaveText('Custom cancel of announce-custom.');
    await waitForIdle(page);

    await pickUp(item);
    await page.keyboard.press('Space');
    // The custom onDragEnd returns undefined without a target: the default one is used.
    await expect(live).toHaveText('Draggable item announce-custom was dropped.');
    await waitForIdle(page);
  });

  test('picking up an item that rests on a drop target announces no move', async ({ page }) => {
    const errors = trackErrors(page);
    const movable = page.getByTestId('zone-c').getByTestId('movable');
    const live = await liveRegionOf(page, movable);
    await pickUp(movable);
    await expect(live).toHaveText('Picked up draggable item movable.');
    // Moves are spoken once the drag rests for 500 ms: the target found at pickup isn't one.
    await page.waitForTimeout(900);
    await expect(live).toHaveText('Picked up draggable item movable.');
    // A real move still is.
    await moveRight(page, 2);
    await expect(page.getByTestId('zone-d')).toHaveClass(/over/);
    await expect(live).toHaveText('Draggable item movable was moved over droppable area zone-d.');
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    expect(errors).toEqual([]);
  });

  test('announcements: false keeps the live region silent', async ({ page }) => {
    const item = page.getByTestId('announce-silent');
    const live = await liveRegionOf(page, item);
    await pickUp(item);
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await expect(live).toHaveText('');
  });

  test('over announcements are debounced by 500ms: only the settled target is spoken', async ({ page }) => {
    const errors = trackErrors(page);
    const plain = fixture(page, 'plain');
    const live = await liveRegionOf(page, plain);
    await live.evaluate((element) => {
      const log: Array<{ text: string; at: number }> = [];
      (window as unknown as { __announcements: typeof log }).__announcements = log;
      new MutationObserver(() => log.push({ text: element.textContent ?? '', at: performance.now() })).observe(
        element,
        { childList: true, characterData: true, subtree: true },
      );
    });

    await dragTo(page, plain, await center(page.getByTestId('zone-a')), { release: false });
    await page.mouse.move(...(Object.values(await center(page.getByTestId('zone-b'))) as [number, number]), {
      steps: 4,
    });
    const settledAt = await page.evaluate(() => performance.now());
    await expect(live).toHaveText('Draggable item plain was moved over droppable area zone-b.');

    const log = await page.evaluate(
      () => (window as unknown as { __announcements: Array<{ text: string; at: number }> }).__announcements,
    );
    expect(log.map((entry) => entry.text)).toEqual([
      'Picked up draggable item plain.',
      'Draggable item plain was moved over droppable area zone-b.',
    ]);
    expect(log[1]!.at - settledAt).toBeGreaterThan(400);

    await page.mouse.up();
    await expect(live).toHaveText('Draggable item plain was dropped over droppable area zone-b.');
    await waitForIdle(page);
    expect(errors).toEqual([]);
  });
});

test.describe('focus restore after keyboard drags (kanban)', () => {
  const card = (page: Page, column: string, id: string) =>
    page.locator(`[data-testid="${column}"] [data-id="${id}"]`);

  test.beforeEach(async ({ page }) => {
    await page.goto('/#kanban');
    await expect(page.getByTestId('board')).toHaveText('todo:a1,a2,a3,a4 | doing:b1,b2 | done:');
  });

  test('Space picks up, Escape cancels, focus stays on the card', async ({ page }) => {
    await pickUp(card(page, 'todo', 'a2'));
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await expect(card(page, 'todo', 'a2')).toBeFocused();
  });

  test('focus returns to the recreated card after a cancel across columns', async ({ page }) => {
    await pickUp(card(page, 'todo', 'a1'));
    // Sortable keyboard: a perpendicular arrow moves the slot to the adjacent column.
    await moveRight(page, 1);
    // The slot moved to the next column: the focused element was destroyed.
    await expect(page.locator('[data-testid="doing"] [data-dnd-placeholder]')).toHaveAttribute('data-id', 'a1');
    await expect(card(page, 'todo', 'a1')).toHaveCount(0);

    await page.keyboard.press('Escape');
    await waitForIdle(page);
    await expect(page.getByTestId('board')).toHaveText('todo:a1,a2,a3,a4 | doing:b1,b2 | done:');
    await expect(card(page, 'todo', 'a1')).toBeFocused();
  });

  test('focus follows the card into the column it was dropped in', async ({ page }) => {
    await pickUp(card(page, 'todo', 'a1'));
    // Sortable keyboard: a perpendicular arrow moves the slot to the adjacent column.
    await moveRight(page, 1);
    await expect(page.locator('[data-testid="doing"] [data-dnd-placeholder]')).toHaveAttribute('data-id', 'a1');
    await page.keyboard.press('Space');
    await waitForIdle(page);
    await expect(page.getByTestId('board')).toContainText('todo:a2,a3,a4 | doing:');
    await expect(card(page, 'doing', 'a1')).toBeFocused();
  });
});

test('focus restore by id when the app re-renders a draggable without overlay on drop', async ({ page }) => {
  // No overlay means no drop animation to wait for: the session ends before Vue
  // renders the item in its new zone, so the focus must be restored after the render.
  await page.goto('/#a11y');
  await pickUp(page.getByTestId('zone-c').getByTestId('movable'));
  await moveRight(page, 2);
  await expect(page.getByTestId('zone-d')).toHaveClass(/over/);
  await page.keyboard.press('Space');
  await expect(page.getByTestId('zone-c').getByTestId('movable')).toHaveCount(0);
  await expect(page.getByTestId('zone-d').getByTestId('movable')).toBeFocused();
});
