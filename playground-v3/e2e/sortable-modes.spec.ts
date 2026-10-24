import { expect, test, type Locator, type Page } from '@playwright/test';
import { center, dragTo, glide, item, pickUp, trackErrors, waitForIdle } from './helpers';

const state = (page: Page) => page.getByTestId('state');
const list = (page: Page, id: string) => page.locator(`[data-testid="${id}"]:not([data-dnd-overlay] *)`);
const order = (locator: Locator) =>
  locator.locator(':scope > [data-id]').evaluateAll((rows) => rows.map((row) => row.getAttribute('data-id')));

const select = async (page: Page, ...ids: string[]) => {
  for (const id of ids) await item(page, id).click({ modifiers: ['ControlOrMeta'] });
};

/** First `translate` keyframe of a layout animation on the item, within ~20 frames. */
const flyIn = (page: Page, id: string) =>
  page.evaluate(
    (key) =>
      new Promise<string | null>((resolve) => {
        let frames = 0;
        const check = () => {
          const element = document.querySelector(`[data-id="${key}"]:not([data-dnd-overlay] *)`);
          for (const animation of element?.getAnimations() ?? []) {
            const frame = (animation.effect as KeyframeEffect | null)?.getKeyframes()[0];
            if (frame && 'translate' in frame) return resolve(String(frame.translate));
          }
          if (++frames > 20) return resolve(null);
          requestAnimationFrame(check);
        };
        check();
      }),
    id,
  );

test.describe('copy', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#copy');
    await expect(state(page)).toHaveText('palette:p1,p2,p3 | target:t1,t2,t3 | other:o1,o2');
  });

  test("a palette (pull: 'clone') inserts a copy and stays unchanged", async ({ page }) => {
    const errors = trackErrors(page);
    await dragTo(page, item(page, 'p1'), await center(item(page, 't2'), 0.25), { release: false });
    await expect(page.getByTestId('mode')).toHaveText('copy');
    const placeholder = page.locator('[data-dnd-placeholder]');
    await expect(placeholder).toHaveAttribute('data-id', /^p1-\d+$/);
    expect(await order(list(page, 'palette'))).toEqual(['p1', 'p2', 'p3']);
    const copy = await placeholder.getAttribute('data-id');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(`palette:p1,p2,p3 | target:t1,${copy},t2,t3 | other:o1,o2`);
    expect(errors).toEqual([]);
  });

  test("a palette with sort: false can't be reordered", async ({ page }) => {
    await dragTo(page, item(page, 'p1'), await center(item(page, 'p3'), 0.8), { release: false });
    expect(await order(list(page, 'palette'))).toEqual(['p1', 'p2', 'p3']);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText('palette:p1,p2,p3 | target:t1,t2,t3 | other:o1,o2');
  });

  test('taking a copy back over the palette removes it', async ({ page }) => {
    const home = await center(item(page, 'p2'));
    await dragTo(page, item(page, 'p2'), await center(item(page, 't1'), 0.25), { release: false });
    expect(await order(list(page, 'target'))).toHaveLength(4);
    await glide(page, home);
    await expect.poll(() => order(list(page, 'target'))).toEqual(['t1', 't2', 't3']);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText('palette:p1,p2,p3 | target:t1,t2,t3 | other:o1,o2');
  });

  test('holding Alt copies between regular lists', async ({ page }) => {
    await pickUp(page, item(page, 't1'));
    await page.keyboard.down('Alt');
    await glide(page, await center(item(page, 'o1'), 0.25));
    await expect(page.getByTestId('mode')).toHaveText('copy');
    await page.mouse.up();
    await page.keyboard.up('Alt');
    await waitForIdle(page);
    await expect(state(page)).toHaveText(/^palette:p1,p2,p3 \| target:t1,t2,t3 \| other:t1-\d+,o1,o2$/);
  });

  test('the copy modifier is read live: pressing and releasing Alt switches in place', async ({ page }) => {
    await pickUp(page, item(page, 't2'));
    await glide(page, await center(item(page, 'o2'), 0.25));
    await expect(page.getByTestId('mode')).toHaveText('move');
    expect(await order(list(page, 'target'))).toEqual(['t1', 't3']);

    await page.keyboard.down('Alt');
    await expect(page.getByTestId('mode')).toHaveText('copy');
    await expect.poll(() => order(list(page, 'target'))).toEqual(['t1', 't2', 't3']);
    const copied = await order(list(page, 'other'));
    expect(copied[0]).toBe('o1');
    expect(copied[1]).toMatch(/^t2-\d+$/);
    expect(copied[2]).toBe('o2');

    await page.keyboard.up('Alt');
    await expect(page.getByTestId('mode')).toHaveText('move');
    await expect.poll(() => order(list(page, 'other'))).toEqual(['o1', 't2', 'o2']);
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText('palette:p1,p2,p3 | target:t1,t3 | other:o1,t2,o2');
  });
});

test.describe('trash', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#trash');
    await expect(state(page)).toHaveText('bin-list:x1,x2,x3,x4,x5 | remove-list:y1,y2,y3');
  });

  test('e.source.remove() in a zone removes the item; the overlay fades out', async ({ page }) => {
    const errors = trackErrors(page);
    await dragTo(page, item(page, 'x2'), await center(page.getByTestId('trash')), { release: false });
    await expect(page.getByTestId('trash')).toHaveAttribute('data-over');
    await page.mouse.up();
    // The item is gone, so the overlay has nowhere to fly: it fades out in place.
    const fades = await page.evaluate(
      () =>
        new Promise<boolean>((resolve) => {
          const check = () => {
            const overlay = document.querySelector('[data-dnd-overlay]');
            if (!overlay) return resolve(false);
            const fade = overlay.getAnimations().some((animation) =>
              (animation.effect as KeyframeEffect | null)?.getKeyframes().some((frame) => frame.opacity === '0' || frame.opacity === 0),
            );
            if (fade) return resolve(true);
            requestAnimationFrame(check);
          };
          check();
        }),
    );
    expect(fades).toBe(true);
    await waitForIdle(page);
    await expect(state(page)).toHaveText('bin-list:x1,x3,x4,x5 | remove-list:y1,y2,y3');
    expect(errors).toEqual([]);
  });

  test('a multi-drag goes to the trash together', async ({ page }) => {
    await select(page, 'x1', 'x4');
    await dragTo(page, item(page, 'x1'), await center(page.getByTestId('trash')));
    await waitForIdle(page);
    await expect(state(page)).toHaveText('bin-list:x2,x3,x5 | remove-list:y1,y2,y3');
  });

  test("dropOutside: 'remove' removes an item dropped outside every target", async ({ page }) => {
    await dragTo(page, item(page, 'y2'), { x: 1100, y: 700 });
    await waitForIdle(page);
    await expect(state(page)).toHaveText('bin-list:x1,x2,x3,x4,x5 | remove-list:y1,y3');
  });
});

test.describe('external draggables (createItem)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#external');
    await expect(state(page)).toHaveText('inbox:n1,n2,n3 | plain:q1,q2');
  });

  test('a temporary item follows the pointer in the list and becomes real on drop', async ({ page }) => {
    const errors = trackErrors(page);
    await pickUp(page, item(page, 'chip-task'));
    await glide(page, await center(item(page, 'n2'), 0.25));
    await expect(page.getByTestId('mode')).toHaveText('insert');
    const placeholder = list(page, 'inbox').locator('[data-dnd-placeholder]');
    await expect(placeholder).toHaveAttribute('data-id', /^created-\d+$/);
    await expect(placeholder).toHaveText('New task');
    const created = await placeholder.getAttribute('data-id');

    // Leaving the list takes the temporary item out again.
    await glide(page, { x: 1100, y: 700 });
    await expect.poll(() => order(list(page, 'inbox'))).toEqual(['n1', 'n2', 'n3']);

    await glide(page, await center(item(page, 'n2'), 0.25));
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText(`inbox:n1,${created},n2,n3 | plain:q1,q2`);
    expect(errors).toEqual([]);
  });

  test('a list without createItem ignores plain draggables', async ({ page }) => {
    await dragTo(page, item(page, 'chip-note'), await center(item(page, 'q1')), { release: false });
    expect(await order(list(page, 'plain'))).toEqual(['q1', 'q2']);
    await expect(list(page, 'plain')).not.toHaveAttribute('data-accepting');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText('inbox:n1,n2,n3 | plain:q1,q2');
  });
});

test.describe('reject and partial accept', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#reject');
    await expect(state(page)).toHaveText('source:r1,r2,r3,r4 | confirm: | bugs: | first:');
  });

  test('an async onBeforeDrop returning false flies the item back', async ({ page }) => {
    const errors = trackErrors(page);
    await dragTo(page, item(page, 'r1'), await center(list(page, 'confirm')));
    // The drop waits for the promise: the overlay stays, the data is untouched.
    await expect(page.getByTestId('status')).toHaveText('dropping');
    await expect(page.locator('[data-dnd-overlay]')).toHaveCount(1);
    await expect(state(page)).toHaveText('source:r1,r2,r3,r4 | confirm: | bugs: | first:');
    // Then the overlay animates back to the item's original slot.
    const animated = await page.evaluate(
      () =>
        new Promise<boolean>((resolve) => {
          const started = performance.now();
          const check = () => {
            const overlay = document.querySelector('[data-dnd-overlay]');
            if (overlay?.getAnimations().some((animation) => animation.playState === 'running')) return resolve(true);
            if (!overlay || performance.now() - started > 2000) return resolve(false);
            requestAnimationFrame(check);
          };
          check();
        }),
    );
    expect(animated).toBe(true);
    await waitForIdle(page);
    await expect(page.getByTestId('status')).toHaveText('idle');
    await expect(state(page)).toHaveText('source:r1,r2,r3,r4 | confirm: | bugs: | first:');
    expect(await order(list(page, 'source'))).toEqual(['r1', 'r2', 'r3', 'r4']);
    expect(errors).toEqual([]);
  });

  test('an async onBeforeDrop returning true commits', async ({ page }) => {
    await page.getByTestId('allow').check();
    await dragTo(page, item(page, 'r3'), await center(list(page, 'confirm')));
    await waitForIdle(page);
    await expect(state(page)).toHaveText('source:r1,r2,r4 | confirm:r3 | bugs: | first:');
    await expect(page.getByTestId('last')).toHaveText('to:confirm accepted:r3 rejected: mode:move');
  });

  test("acceptMode 'some': matching items land, the rest fly back", async ({ page }) => {
    await select(page, 'r1', 'r2');
    await dragTo(page, item(page, 'r2'), await center(list(page, 'bugs')), { release: false });
    await expect(list(page, 'bugs')).toHaveAttribute('data-accepting');
    await page.mouse.up();
    expect(await flyIn(page, 'r1')).not.toBeNull();
    await waitForIdle(page);
    await expect(state(page)).toHaveText('source:r1,r3,r4 | confirm: | bugs:r2 | first:');
    await expect(page.getByTestId('last')).toHaveText('to:bugs accepted:r2 rejected:r1 mode:move');
  });

  test('a list refusing every dragged item is not accepting and the drop is cancelled', async ({ page }) => {
    await dragTo(page, item(page, 'r1'), await center(list(page, 'bugs')), { release: false });
    await expect(list(page, 'bugs')).not.toHaveAttribute('data-accepting');
    await expect(page.getByTestId('mode')).toHaveText('move');
    await page.mouse.up();
    await waitForIdle(page);
    await expect(state(page)).toHaveText('source:r1,r2,r3,r4 | confirm: | bugs: | first:');
  });

  test('onBeforeDrop returning a list of keys accepts that subset', async ({ page }) => {
    await select(page, 'r1', 'r3');
    await dragTo(page, item(page, 'r1'), await center(list(page, 'first')));
    await waitForIdle(page);
    await expect(state(page)).toHaveText('source:r2,r3,r4 | confirm: | bugs: | first:r1');
    await expect(page.getByTestId('last')).toHaveText('to:first accepted:r1 rejected:r3 mode:move');
  });
});
