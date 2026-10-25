import { afterEach, describe, expect, it } from 'vitest';
import { clonePreview, isTransparent } from './clone';

const mount = (html: string): HTMLElement => {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  return host;
};

describe('isTransparent', () => {
  it('recognizes a zero alpha in computed color formats', () => {
    for (const color of ['', 'transparent', 'rgba(0, 0, 0, 0)', 'rgba(12, 34, 56, 0.0)', 'oklch(0.5 0.1 200 / 0)', 'color(srgb 0 0 0 / 0)']) {
      expect(isTransparent(color), color).toBe(true);
    }
    for (const color of ['rgb(255, 0, 0)', 'rgba(0, 0, 0, 0.05)', 'rgb(0 0 0 / 0.5)', 'oklch(0.372 0.044 257.287)']) {
      expect(isTransparent(color), color).toBe(false);
    }
  });
});

describe('clonePreview', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  // A UI kit list item (<v-list-item> in <v-list>, a table row): the list paints the background.
  const KIT_LIST = `
    <div style="background-color: rgb(30, 30, 30)">
      <div id="list">
        <div id="item" style="border-radius: 8px">Item</div>
        <div id="card" style="background-color: rgb(1, 2, 3)">Card</div>
      </div>
    </div>`;

  it('gives a transparent sortable item the background painted behind it', () => {
    const host = mount(KIT_LIST);
    const clone = clonePreview(host.querySelector<HTMLElement>('#item')!, { opaque: true });
    expect(clone.style.backgroundColor).toBe('rgb(30, 30, 30)');
    expect(clone.style.borderRadius).toBe('8px');
  });

  it('keeps an own background, and leaves free draggables transparent', () => {
    const host = mount(KIT_LIST);
    expect(clonePreview(host.querySelector<HTMLElement>('#card')!, { opaque: true }).style.backgroundColor).toBe(
      'rgb(1, 2, 3)',
    );
    expect(isTransparent(clonePreview(host.querySelector<HTMLElement>('#item')!).style.backgroundColor)).toBe(true);
  });

  it('wraps a table row and gives it the table background', () => {
    const host = mount(`
      <table style="background-color: rgb(250, 250, 250)">
        <tbody><tr id="row"><td>Ada</td><td>Analyst</td></tr></tbody>
      </table>`);
    const wrapper = clonePreview(host.querySelector<HTMLElement>('#row')!, { opaque: true });
    expect(wrapper.tagName).toBe('TABLE');
    const row = wrapper.querySelector('tr')!;
    expect(row.style.backgroundColor).toBe('rgb(250, 250, 250)');
    expect(row.hasAttribute('id')).toBe(false);
  });
});
