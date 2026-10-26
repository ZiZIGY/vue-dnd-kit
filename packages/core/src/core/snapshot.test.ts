import { afterEach, describe, expect, it, vi } from 'vitest';
import { clonePreview } from './clone';

// happy-dom computes the cascade (descendant selectors, inheritance, shorthands) but no
// layout: what the layout resolves is mocked where a test needs it.

const mount = (css: string, html: string): HTMLElement => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  return host;
};

const styled = (element: Element | undefined) => (element as HTMLElement).getAttribute('style');

describe('clone style snapshot', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    delete (Element.prototype as Partial<Element>).computedStyleMap;
  });

  it('inlines what the clone loses outside its list, and nothing else', () => {
    const host = mount(
      `.grid .card { display: flex; gap: 6px; padding: 8px 12px }
       .grid .card b { color: rgb(200, 0, 0) }
       .card i { color: rgb(0, 0, 200) }`,
      `<ul class="grid"><li id="card" class="card"><b>Title</b><i>Own</i><span>Plain</span></li></ul>`,
    );
    const clone = clonePreview(host.querySelector<HTMLElement>('#card')!);
    expect(clone.style.display).toBe('flex');
    expect(clone.style.gap).toBe('6px');
    expect(clone.style.padding).toBe('8px 12px');
    const [title, own, plain] = clone.children;
    expect((title as HTMLElement).style.color).toBe('rgb(200, 0, 0)');
    // `.card i` matches the clone wherever it is; `span` has nothing to lose.
    expect(styled(own)).toBeNull();
    expect(styled(plain)).toBeNull();
  });

  it('lets children inherit what is written on their parent', () => {
    const host = mount(
      `.list .item { color: rgb(1, 2, 3); font-size: 20px }`,
      `<ul class="list"><li id="item" class="item"><span>Text</span></li></ul>`,
    );
    const clone = clonePreview(host.querySelector<HTMLElement>('#item')!);
    expect(clone.style.color).toBe('rgb(1, 2, 3)');
    expect(clone.style.fontSize).toBe('20px');
    expect(styled(clone.children[0])).toBeNull();
  });

  it("gives a table row's cells the table's cell styles", () => {
    const host = mount(
      `table.people td { padding: 8px 12px; text-align: left }`,
      `<table class="people"><tbody><tr id="row"><td>Ada</td><td>Analyst</td></tr></tbody></table>`,
    );
    const wrapper = clonePreview(host.querySelector<HTMLElement>('#row')!);
    for (const cell of wrapper.querySelectorAll('td')) {
      expect(cell.style.padding).toBe('8px 12px');
      expect(cell.style.textAlign).toBe('left');
    }
  });

  it('writes margins as the source computes them', () => {
    const host = mount(
      `.list .row b { margin: 0 0 0 auto }`,
      `<ul class="list"><li id="row" class="row"><b>1</b></li></ul>`,
    );
    const clone = clonePreview(host.querySelector<HTMLElement>('#row')!);
    expect((clone.children[0] as HTMLElement).style.margin).toBe('0px 0px 0px auto');
  });

  it('snapshots the first elements breadth first, up to a cap', () => {
    const spans = Array.from({ length: 250 }, (_, index) => `<span>${index}</span>`).join('');
    const host = mount(
      `.list .row span { color: rgb(9, 9, 9) }`,
      `<ul class="list"><li id="row" class="row">${spans}</li></ul>`,
    );
    const clone = clonePreview(host.querySelector<HTMLElement>('#row')!);
    // The root and 199 children.
    expect((clone.children[198] as HTMLElement).style.color).toBe('rgb(9, 9, 9)');
    expect(styled(clone.children[199])).toBeNull();
  });

  it('lays the clone out where the overlay goes, and leaves nothing there', () => {
    const host = mount(`.list .row { padding: 4px }`, `<ul class="list"><li id="row" class="row">Row</li></ul>`);
    const container = document.createElement('section');
    document.body.appendChild(container);
    const appended = vi.spyOn(container, 'appendChild');
    const clone = clonePreview(host.querySelector<HTMLElement>('#row')!, { container });
    expect(appended).toHaveBeenCalledOnce();
    expect(container.childNodes).toHaveLength(0);
    expect(clone.isConnected).toBe(false);
    expect(clone.style.padding).toBe('4px');
  });

  it('writes the sizes the source sets first: content sized by them follows', () => {
    const host = mount(
      `.list .icon { width: 16px }`,
      `<ul class="list"><li id="row" class="row"><div class="box"><i class="icon"></i></div></li></ul>`,
    );
    // The box is as wide as its icon: 100px in the list, 300px in the clone until the icon has its width.
    const original = globalThis.getComputedStyle;
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementation((element, pseudo) => {
      const style = original(element, pseudo);
      if (!element.matches('.box')) return style;
      const icon = element.querySelector<HTMLElement>('.icon')!;
      const width = element.closest('.list') ? '100.2px' : icon.style.width ? '100px' : '300px';
      return new Proxy(style, {
        get: (target, key) =>
          key === 'getPropertyValue'
            ? (name: string) => (name === 'width' ? width : target.getPropertyValue(name))
            : Reflect.get(target, key),
      });
    });
    // Typed OM: the icon's width is set, the box's left to the layout.
    (Element.prototype as Partial<Element>).computedStyleMap = function (this: Element) {
      const value = this.matches('.icon') ? '16px' : 'auto';
      return { get: (name: string) => (name === 'width' ? { toString: () => value } : undefined) } as never;
    };
    const clone = clonePreview(host.querySelector<HTMLElement>('#row')!);
    const box = clone.children[0] as HTMLElement;
    expect((box.children[0] as HTMLElement).style.width).toBe('16px');
    // 100px in the clone once the icon has its width: within half a pixel of the source's.
    expect(box.style.width).toBe('');
  });
});
