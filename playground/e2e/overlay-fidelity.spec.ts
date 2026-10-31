import { expect, test, type Locator, type Page } from '@playwright/test';
import { center, item, trackErrors } from './helpers';

/**
 * The overlay's clone looks like the element it was taken from. The overlay is rendered
 * in <body>, outside the list: rules that match through ancestors (`.grid .row`,
 * `table.sortable-table td`, a UI kit's table styles) don't reach it, so the clone
 * carries what it would lose (core/snapshot.ts). Checked at pickup, before the pointer
 * moves anywhere: the clone's elements compute the source's styles, sit at the same
 * places in its box, its text too, and it looks the same within a tolerance.
 */

/** Styles that place content in a box and draw its text. */
const PROPERTIES = [
  'display',
  'flex-direction',
  'align-items',
  'justify-content',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-width',
  'border-left-width',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'color',
  'text-align',
  'white-space',
  'vertical-align',
];

interface Look {
  /** The root and every element in it, in document order. */
  elements: Array<{ name: string; styles: Record<string, string>; box: number[] }>;
  /** Where each text is drawn. */
  texts: Array<{ text: string; box: number[] }>;
}

/** Boxes relative to the root's, so the overlay's offset from the source doesn't count. */
const look = (root: Locator): Promise<Look> =>
  root.evaluate((element, properties) => {
    const origin = element.getBoundingClientRect();
    const relative = ({ left, top, width, height }: DOMRect) => [left - origin.left, top - origin.top, width, height];
    const elements = [element, ...element.querySelectorAll('*')].map((node) => {
      const style = getComputedStyle(node);
      return {
        name: `${node.localName}.${node.getAttribute('class')?.split(' ')[0] ?? ''}`,
        styles: Object.fromEntries(properties.map((name) => [name, style.getPropertyValue(name)])),
        box: relative(node.getBoundingClientRect()),
      };
    });
    const texts: Look['texts'] = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.textContent?.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      texts.push({ text: node.textContent.trim(), box: relative(range.getBoundingClientRect()) });
    }
    return { elements, texts };
  }, PROPERTIES);

/**
 * Boxes match within this: a row in the overlay's table wrapper is a pixel narrower, the
 * halves of the table's collapsed outer borders.
 */
const TOLERANCE = 1.5;

const expectBoxes = (label: string, actual: number[], expected: number[]) =>
  expected.forEach((value, index) => {
    const message = `${label}: [${actual.join(', ')}] ≈ [${expected.join(', ')}]`;
    expect(Math.abs(actual[index]! - value), message).toBeLessThanOrEqual(TOLERANCE);
  });

const expectSameLook = (clone: Look, source: Look) => {
  expect(clone.elements.map(({ name }) => name)).toEqual(source.elements.map(({ name }) => name));
  source.elements.forEach(({ name, styles, box }, index) => {
    const shown = clone.elements[index]!;
    expect(shown.styles, name).toEqual(styles);
    expectBoxes(name, shown.box, box);
  });
  expect(clone.texts.map(({ text }) => text)).toEqual(source.texts.map(({ text }) => text));
  source.texts.forEach(({ text, box }, index) => expectBoxes(`"${text}"`, clone.texts[index]!.box, box));
};

/**
 * Share of the ink (pixels off the background: text, icons, dark lines) of either
 * screenshot that the other doesn't show within two pixels of the same place: the
 * overlay sits at other sub-pixel offsets than its source, and screenshots crop to whole
 * pixels, which moves glyph edges by up to a pixel and a half. Compared by luminance,
 * blurred over 3×3 pixels: Chromium draws the page's text with sharp colored (LCD) edges
 * and the overlay's, on a layer of its own, in softer gray. Decoded in the page: no
 * image library.
 */
const pixelDifference = (page: Page, a: Buffer, b: Buffer): Promise<number> =>
  page.evaluate(
    async ([first, second]) => {
      const decode = async (base64: string) => {
        const image = new Image();
        image.src = `data:image/png;base64,${base64}`;
        await image.decode();
        return image;
      };
      const [x, y] = await Promise.all([decode(first!), decode(second!)]);
      const width = Math.min(x.width, y.width);
      const height = Math.min(x.height, y.height);
      const luminance = (image: HTMLImageElement) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d')!;
        context.drawImage(image, 0, 0);
        const { data } = context.getImageData(0, 0, width, height);
        const values = Array.from(
          { length: width * height },
          (_, i) => 0.3 * data[i * 4]! + 0.59 * data[i * 4 + 1]! + 0.11 * data[i * 4 + 2]!,
        );
        return values.map((_, i) => {
          const row = Math.floor(i / width);
          const column = i % width;
          let sum = 0;
          let count = 0;
          for (let r = Math.max(row - 1, 0); r <= Math.min(row + 1, height - 1); r++) {
            for (let c = Math.max(column - 1, 0); c <= Math.min(column + 1, width - 1); c++) {
              sum += values[r * width + c]!;
              count++;
            }
          }
          return sum / count;
        });
      };
      const NEAR = 48;
      /** Ink of `p`, and how much of it `q` doesn't show. */
      const lost = (p: number[], q: number[]) => {
        const counts = new Map<number, number>();
        for (const value of p) counts.set(Math.round(value / 8), (counts.get(Math.round(value / 8)) ?? 0) + 1);
        const background = [...counts].sort((m, n) => n[1] - m[1])[0]![0] * 8;
        let ink = 0;
        let missing = 0;
        for (let row = 0; row < height; row++) {
          for (let column = 0; column < width; column++) {
            const value = p[row * width + column]!;
            if (Math.abs(value - background) <= NEAR) continue;
            ink++;
            let found = false;
            for (let r = Math.max(row - 2, 0); r <= Math.min(row + 2, height - 1) && !found; r++) {
              for (let c = Math.max(column - 2, 0); c <= Math.min(column + 2, width - 1) && !found; c++) {
                found = Math.abs(value - q[r * width + c]!) <= NEAR;
              }
            }
            if (!found) missing++;
          }
        }
        return [ink, missing] as const;
      };
      const p = luminance(x);
      const q = luminance(y);
      const [inkA, missingA] = lost(p, q);
      const [inkB, missingB] = lost(q, p);
      return (missingA + missingB) / Math.max(inkA + inkB, 1);
    },
    [a.toString('base64'), b.toString('base64')],
  );

/** The default overlay's clone: the element itself, or the row in its table wrapper. */
const overlayClone = (page: Page, row = false): Locator =>
  row ? page.locator('[data-dnd-overlay] tr') : page.locator('[data-dnd-overlay] > div > div > *').first();

interface Case {
  page: string;
  source: (page: Page) => Locator;
  /** Where the drag starts: the source, or its handle. */
  grip?: (source: Locator) => Locator;
  row?: boolean;
}

/**
 * Hovers the grip, takes the source's look and screenshot, picks the item up (the
 * activation distance, nothing more) and returns both looks and screenshots.
 */
const pickUp = async (page: Page, { source: find, grip = (source) => source, row }: Case) => {
  const source = find(page);
  const start = await center(grip(source));
  await page.mouse.move(start.x, start.y);
  const before = { look: await look(source), image: await source.screenshot() };
  await page.mouse.down();
  await page.mouse.move(start.x, start.y + 8, { steps: 2 });
  const clone = overlayClone(page, row);
  await expect(clone).toBeVisible();
  // The overlay box has the source's size: a row's wrapper draws the table's outer borders.
  const image = await page.locator('[data-dnd-overlay]').screenshot();
  return { before, after: { look: await look(clone), image } };
};

const CASES: Record<string, Case> = {
  // `.grid .row { display: flex; align-items: center; justify-content: center }`: the
  // title is centered in the card, not in its top left corner.
  'a grid card': { page: '/#grid', source: (page) => item(page, 'g2') },
  // `table.sortable-table td { padding; border; text-align }`.
  'a table row': { page: '/#table', source: (page) => item(page, 'p2'), row: true },
  // `.list.horizontal .row { width; text-align: center }`.
  'a list item': { page: '/#lists', source: (page) => item(page, 'h2') },
  // Scoped styles: they match the clone too, and stay as they are.
  'a tree row': { page: '/#tree', source: (page) => item(page, 'src') },
  // Vuetify's styles keyed on the list and the item; the chip's unitless line height.
  'a Vuetify list item': {
    page: '/kits/vuetify.html#list',
    source: (page) => page.getByTestId('tasks').locator('[data-id="t2"]'),
    grip: (source) => source.getByTestId('handle'),
  },
  // `.v-table > .v-table__wrapper > table > tbody > tr > td { padding; height }`.
  'a Vuetify table row': {
    page: '/kits/vuetify.html#list',
    source: (page) => page.getByTestId('people').locator('[data-id="p2"]'),
    grip: (source) => source.getByTestId('row-handle'),
    row: true,
  },
  // Utility classes on every element: nothing to carry.
  'a Nuxt UI card': {
    page: '/kits/nuxt-ui.html#list',
    source: (page) => page.getByTestId('tasks').locator('[data-id="t2"]'),
    grip: (source) => source.getByTestId('handle'),
  },
};

test.describe('the overlay clone looks like its source', () => {
  for (const [name, spec] of Object.entries(CASES)) {
    test(name, async ({ page }) => {
      const errors = trackErrors(page);
      await page.goto(spec.page);
      await expect(spec.source(page)).toBeVisible();
      const { before, after } = await pickUp(page, spec);
      expectSameLook(after.look, before.look);
      // Without the snapshot: a grid card's whole title (~98%), a table row's text (14–36%).
      expect(await pixelDifference(page, before.image, after.image)).toBeLessThan(0.05);
      await page.keyboard.press('Escape');
      await page.mouse.up();
      expect(errors).toEqual([]);
    });
  }
});

test.describe('multi-drag clones look like their sources', () => {
  // A rule keyed on the lists: no clone in the overlay (or flying into it) is in one.
  const LIST_RULE = `
    :is([data-testid="stack-a"], [data-testid="gaps-a"]) .row {
      display: flex;
      justify-content: flex-end;
      padding-right: 40px;
    }`;
  const LOOK = { display: 'flex', justifyContent: 'flex-end', paddingRight: '40px' };

  const lookOf = (element: Element) => {
    const { display, justifyContent, paddingRight } = getComputedStyle(element);
    return { display, justifyContent, paddingRight };
  };

  test.beforeEach(async ({ page }) => {
    await page.goto('/#multi');
    await page.addStyleTag({ content: LIST_RULE });
  });

  const select = async (page: Page, ...ids: string[]) => {
    for (const id of ids) await item(page, id).click({ modifiers: ['ControlOrMeta'] });
  };

  test("'gaps': every clone in the overlay column", async ({ page }) => {
    await select(page, 'g2', 'g4');
    const start = await center(item(page, 'g2'));
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x, start.y + 8, { steps: 2 });
    const clones = page.locator('[data-dnd-overlay] .row');
    await expect(clones).toHaveCount(2);
    for (const clone of await clones.all()) expect(await clone.evaluate(lookOf)).toEqual(LOOK);
    await page.keyboard.press('Escape');
    await page.mouse.up();
  });

  test("'stack': the clones that fly into the overlay, and the overlay's", async ({ page }) => {
    await select(page, 'a2', 'a4');
    // Ghosts live for the length of their flight: their looks are taken as they appear.
    await page.evaluate(() => {
      const target = window as unknown as { __ghostLooks: unknown[] };
      target.__ghostLooks = [];
      new MutationObserver((records) => {
        for (const record of records) {
          for (const node of record.addedNodes) {
            if (!(node instanceof Element) || !node.hasAttribute('data-dnd-ghost')) continue;
            const { display, justifyContent, paddingRight } = getComputedStyle(node);
            target.__ghostLooks.push({ display, justifyContent, paddingRight });
          }
        }
      }).observe(document.body, { childList: true });
    });
    const start = await center(item(page, 'a2'));
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x, start.y + 8, { steps: 2 });
    await expect(page.locator('[data-dnd-overlay] .row')).toHaveCount(1);
    expect(await page.locator('[data-dnd-overlay] .row').evaluate(lookOf)).toEqual(LOOK);
    expect(await page.evaluate(() => (window as unknown as { __ghostLooks: unknown[] }).__ghostLooks)).toEqual([LOOK]);
    await page.keyboard.press('Escape');
    await page.mouse.up();
  });
});
