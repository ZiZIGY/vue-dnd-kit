import { afterEach, describe, expect, it } from 'vitest';
import { clonePreview } from './clone';

const mount = (html: string): HTMLElement => {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  return host;
};

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

  it("doesn't guess a background: a transparent item gives a transparent clone", () => {
    const host = mount(KIT_LIST);
    const clone = clonePreview(host.querySelector<HTMLElement>('#item')!);
    expect(clone.style.backgroundColor).toBe('');
    expect(clone.style.borderRadius).toBe('8px');
  });

  it('keeps an own background', () => {
    const host = mount(KIT_LIST);
    expect(clonePreview(host.querySelector<HTMLElement>('#card')!).style.backgroundColor).toBe('rgb(1, 2, 3)');
  });

  it('wraps a table row in a table of its own, without painting it', () => {
    const host = mount(`
      <table style="background-color: rgb(250, 250, 250)">
        <tbody><tr id="row"><td>Ada</td><td>Analyst</td></tr></tbody>
      </table>`);
    const wrapper = clonePreview(host.querySelector<HTMLElement>('#row')!);
    expect(wrapper.tagName).toBe('TABLE');
    const row = wrapper.querySelector('tr')!;
    expect(row.style.backgroundColor).toBe('');
    expect(row.hasAttribute('id')).toBe(false);
  });
});
