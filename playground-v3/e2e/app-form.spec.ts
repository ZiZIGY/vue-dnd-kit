import { expect, test, type Page } from '@playwright/test';
import { trackErrors } from './helpers';
import { at, byId, byTestId, drag, glideTo, hold, settled } from './app-helpers';

const INITIAL = 'name,email,address(street,city),message';
const outline = (page: Page) => page.getByTestId('form-outline');
const schema = async (page: Page) => JSON.parse((await page.getByTestId('form-json').textContent())!) as {
  title: string;
  fields: Array<{ type: string; id: string; label?: string; title?: string; fields?: Array<{ id: string }> }>;
};
const ghost = (page: Page) => page.locator('[data-dnd-overlay] [data-testid="form-ghost"]');

type LandWindow = Window & { __landing?: Record<string, string> | null };

/** Call before releasing: records the last keyframe of the overlay's drop animation. */
const watchLanding = (page: Page) =>
  page.evaluate(() => {
    const win = window as LandWindow;
    win.__landing = null;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (this: Element, keyframes, options) {
      if (this.hasAttribute('data-dnd-overlay') && Array.isArray(keyframes)) {
        win.__landing = keyframes.at(-1) as Record<string, string>;
      }
      return animate.call(this, keyframes, options);
    };
  });

/** The overlay flew to where the field `id` ended up (within a pixel or two). */
const expectLandedOn = async (page: Page, id: string) => {
  const landing = await page.evaluate(() => (window as LandWindow).__landing);
  expect(landing, 'the overlay flew to a slot').not.toBeNull();
  const [x = 0, y = 0] = [...landing!.transform!.matchAll(/-?[\d.]+(?=px)/g)].map((match) => Number(match[0]));
  const box = (await byId(page, id).boundingBox())!;
  expect(Math.abs(x - box.x)).toBeLessThan(2);
  expect(Math.abs(y - box.y)).toBeLessThan(2);
};
/** The type badge in a field's header: a spot that starts a drag (the label input doesn't). */
const grip = (page: Page, id: string) => byId(page, id).locator(':scope > header .fb-kind');

test.describe('app: form builder', () => {
  let errors: string[];

  test.beforeEach(async ({ page }) => {
    errors = trackErrors(page);
    await page.goto('/#app-form');
    await expect(outline(page)).toHaveText(INITIAL);
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
  });

  test('a palette field is inserted at the indicator line; the palette keeps it', async ({ page }) => {
    await hold(page, byId(page, 'tpl-email'), await at(byId(page, 'message'), 0.5, 0.25));
    await expect(ghost(page)).toContainText('Email');
    await expect(page.getByTestId('ghost-action')).toHaveText('New field');
    await expect(byId(page, 'message')).toHaveAttribute('data-indicator', 'before');
    // Indicator mode: nothing moves until the drop.
    await expect(outline(page)).toHaveText(INITIAL);
    await page.mouse.up();
    await settled(page);
    await expect(outline(page)).toHaveText('name,email,address(street,city),f1,message');
    await expect(byTestId(page, 'palette').locator('[data-id]')).toHaveCount(8);
    const { fields } = await schema(page);
    expect(fields[3]).toEqual({ type: 'email', id: 'f1', label: 'Email', required: false });
  });

  test('the overlay lands where the field ends up: into a section the form slides, and from the palette', async ({
    page,
  }) => {
    // email leaves the form above the section: the section card slides up a row as the
    // field lands in it. The overlay goes where the field settles, not where it starts.
    await watchLanding(page);
    await drag(page, grip(page, 'email'), await at(byId(page, 'city'), 0.5, 0.8));
    await settled(page);
    await expect(outline(page)).toHaveText('name,address(street,city,email),message');
    await expectLandedOn(page, 'email');

    // A palette field (a copy): the overlay lands on the new field, not back on the palette.
    await watchLanding(page);
    await drag(page, byId(page, 'tpl-email'), await at(byId(page, 'message'), 0.5, 0.25));
    await settled(page);
    await expect(outline(page)).toHaveText('name,address(street,city,email),f1,message');
    await expectLandedOn(page, 'f1');
  });

  test('fields move into a section and back out', async ({ page }) => {
    await drag(page, grip(page, 'message'), await at(byId(page, 'city'), 0.5, 0.3));
    await settled(page);
    await expect(outline(page)).toHaveText('name,email,address(street,message,city)');

    await drag(page, grip(page, 'street'), await at(byId(page, 'name'), 0.5, 0.3));
    await settled(page);
    await expect(outline(page)).toHaveText('street,name,email,address(message,city)');
    const { fields } = await schema(page);
    expect(fields[3]!.fields!.map((item) => item.id)).toEqual(['message', 'city']);
  });

  test('a section only takes fields, never another section', async ({ page }) => {
    // A new section from the palette, over the Address section: refused.
    await hold(page, byId(page, 'tpl-section'), await at(byId(page, 'street'), 0.5, 0.3));
    await expect(byTestId(page, 'list-section-address')).toHaveAttribute('data-refusing');
    await expect(page.locator('[data-indicator]')).toHaveCount(0);
    // Below "Message", on the form itself: accepted.
    await glideTo(page, await at(byId(page, 'message'), 0.5, 0.8));
    await expect(byId(page, 'message')).toHaveAttribute('data-indicator', 'after');
    await page.mouse.up();
    await settled(page);
    await expect(outline(page)).toHaveText('name,email,address(street,city),message,f1()');
    await expect(byTestId(page, 'list-section-f1')).toContainText('Drop fields into this section');

    // The new empty section takes a field...
    await drag(page, grip(page, 'city'), await at(byTestId(page, 'list-section-f1'), 0.5, 0.5));
    await settled(page);
    await expect(outline(page)).toHaveText('name,email,address(street),message,f1(city)');
    // ...but the Address section can't be dropped into it.
    await hold(page, grip(page, 'address'), await at(byId(page, 'city'), 0.5, 0.4));
    await expect(ghost(page)).toContainText('Address');
    await expect(byTestId(page, 'list-section-f1')).toHaveAttribute('data-refusing');
    await page.mouse.up();
    await settled(page);
    await expect(outline(page)).toHaveText('name,email,address(street),message,f1(city)');
  });

  test('holding Alt duplicates a field, and a section with its fields', async ({ page }) => {
    await hold(page, grip(page, 'email'), await at(byId(page, 'message'), 0.5, 0.3));
    await page.keyboard.down('Alt');
    await expect(ghost(page)).toHaveAttribute('data-mode', 'copy');
    await expect(page.getByTestId('ghost-action')).toHaveText('Duplicate');
    await page.mouse.up();
    await page.keyboard.up('Alt');
    await settled(page);
    await expect(outline(page)).toHaveText('name,email,address(street,city),f1,message');
    expect((await schema(page)).fields[3]).toMatchObject({ type: 'email', id: 'f1', label: 'Email (copy)' });

    // A section is copied deeply, with fresh ids for its fields.
    await hold(page, grip(page, 'address'), await at(byId(page, 'message'), 0.5, 0.8));
    await page.keyboard.down('Alt');
    await expect(ghost(page)).toHaveAttribute('data-mode', 'copy');
    await page.mouse.up();
    await page.keyboard.up('Alt');
    await settled(page);
    await expect(outline(page)).toHaveText('name,email,address(street,city),f1,message,f2(f3,f4)');
  });

  test('editing and removing fields update the live schema; dropping outside cancels', async ({ page }) => {
    await page.getByTestId('label-name').fill('Your name');
    await page.getByTestId('required-email').uncheck();
    await page.getByTestId('form-title').fill('Support request');
    let current = await schema(page);
    expect(current.title).toBe('Support request');
    expect(current.fields[0]).toMatchObject({ id: 'name', label: 'Your name', required: true });
    expect(current.fields[1]).toMatchObject({ id: 'email', required: false });

    await page.getByTestId('remove-street').click();
    await expect(outline(page)).toHaveText('name,email,address(city),message');

    // Indicator lists cancel a drop outside every list (dropOutside: 'cancel').
    const viewport = page.viewportSize()!;
    await drag(page, grip(page, 'message'), { x: viewport.width - 20, y: viewport.height - 20 });
    await settled(page);
    await expect(outline(page)).toHaveText('name,email,address(city),message');
    current = await schema(page);
    expect(current.fields.map((item) => item.id)).toEqual(['name', 'email', 'address', 'message']);
  });
});
