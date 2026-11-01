import { afterEach, describe, expect, it, vi } from 'vitest';
import { clonePreview } from './clone';

/** The copy itself: `clonePreview` gives it in the box that carries its custom properties. */
const cloneOf = (...args: Parameters<typeof clonePreview>) => clonePreview(...args).firstElementChild as HTMLElement;

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
    const clone = cloneOf(host.querySelector<HTMLElement>('#item')!);
    expect(clone.style.backgroundColor).toBe('');
    expect(clone.style.borderRadius).toBe('8px');
  });

  it('keeps an own background', () => {
    const host = mount(KIT_LIST);
    expect(cloneOf(host.querySelector<HTMLElement>('#card')!).style.backgroundColor).toBe('rgb(1, 2, 3)');
  });

  it('carries the custom properties the item inherits in a box around it, not inline on it', () => {
    const host = mount('<div style="--accent: rgb(1, 2, 3)"><div id="item">Item</div></div>');
    const item = host.querySelector<HTMLElement>('#item')!;
    // Browsers list custom properties among the computed ones and inherit them; happy-dom
    // does neither. Here everything inherits `--accent`, and the item lists it.
    const computed = window.getComputedStyle;
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudo) => {
      const style = computed(element, pseudo);
      const listed = element === item;
      return new Proxy(style, {
        get: (target, name) => {
          if (name === 'length') return target.length + +listed;
          if (name === 'item') return (index: number) => (listed && index === target.length ? '--accent' : target.item(index));
          if (name === 'getPropertyValue') {
            return (property: string) => (property === '--accent' ? 'rgb(1, 2, 3)' : target.getPropertyValue(property));
          }
          const value = Reflect.get(target, name, target);
          return typeof value === 'function' ? value.bind(target) : value;
        },
      });
    });
    const box = clonePreview(item);
    expect(box.style.getPropertyValue('--accent')).toBe('rgb(1, 2, 3)');
    // Inline on the copy, they would beat its own rules in the overlay (`in-data-[dnd-overlay]:ring-2`).
    expect((box.firstElementChild as HTMLElement).style.getPropertyValue('--accent')).toBe('');
  });

  it('wraps a table row in a table of its own, without painting it', () => {
    const host = mount(`
      <table style="background-color: rgb(250, 250, 250)">
        <tbody><tr id="row"><td>Ada</td><td>Analyst</td></tr></tbody>
      </table>`);
    const wrapper = cloneOf(host.querySelector<HTMLElement>('#row')!);
    expect(wrapper.tagName).toBe('TABLE');
    const row = wrapper.querySelector('tr')!;
    expect(row.style.backgroundColor).toBe('');
    expect(row.hasAttribute('id')).toBe(false);
  });
});
