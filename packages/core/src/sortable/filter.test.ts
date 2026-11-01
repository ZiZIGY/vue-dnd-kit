import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Key } from '../types';
import { containsPoint, createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList, withHidden } from './makeSortableList';

describe('withHidden: a drop into a filtered list, as the whole array', () => {
  const merge = (all: string, shown: string, next: string, inserted = '') =>
    withHidden([...all], [...shown], [...next], [...inserted], (key: string) => key, (key: Key) => key).join('');

  it('keeps each hidden item after the shown one it followed', () => {
    // a 1 b 2 c, 1 and 2 hidden: c to the front.
    expect(merge('a1b2c', 'abc', 'cab', 'c')).toBe('ca1b2');
  });

  it("follows the nearest shown item that stayed when its own moved, or comes first", () => {
    // `a` moves to the end: 1 had followed it, it stays first.
    expect(merge('a1b2c', 'abc', 'bca', 'a')).toBe('1b2ca');
    expect(merge('ab1c', 'abc', 'acb', 'b')).toBe('a1cb');
  });

  it('takes items that left out, and puts those that came in where the shown order says', () => {
    // b leaves: 2, which followed it, now follows a.
    expect(merge('a1b2c', 'abc', 'ac')).toBe('a12c');
    // x came in between a and b: 1 still right after a.
    expect(merge('a1b', 'ab', 'axb', 'x')).toBe('a1xb');
  });
});

describe('filter: a list that shows some of its items', () => {
  const ROW = 40;
  let manager: DnDManager;
  let unmount: (() => void) | null = null;

  const Row = defineComponent({
    props: { rowId: { type: String, required: true } },
    setup(props) {
      makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
      return () => h('li', { ref: 'el', 'data-row': '' }, props.rowId);
    },
  });

  /** Rows `a1 a2 b1 b2 a3`; the list shows those that start with `query`. */
  const mount = (query: Ref<string>) => {
    const tasks = ref(['a1', 'a2', 'b1', 'b2', 'a3'].map((id) => ({ id })));
    const container = document.createElement('div');
    document.body.appendChild(container);
    const app = createApp({
      setup: () => () =>
        h(DnDProvider, { dropAnimation: false, animation: false }, {
          default: () =>
            h({
              setup() {
                manager = useManager();
                const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
                  items: tasks,
                  filter: (task) => task.id.startsWith(query.value),
                });
                return () => h('ul', { ref: 'list' }, items.value.map((task) => h(Row, { key: task.id, rowId: task.id })));
              },
            }),
        }),
    });
    app.mount(container);
    const rectOf = (element: Element) => {
      if (element.tagName === 'UL') return createRect(0, 0, 200, element.children.length * ROW);
      if (element.hasAttribute('data-row')) return createRect(0, [...element.parentElement!.children].indexOf(element) * ROW, 200, ROW);
      return createRect(0, 0, 0, 0);
    };
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return rectOf(this) as DOMRect;
    });
    vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
      const candidates = [...container.querySelectorAll('[data-row], ul')];
      return candidates.find((element) => containsPoint(rectOf(element), { x, y })) ?? null;
    });
    unmount = () => {
      app.unmount();
      container.remove();
    };
    const rows = () => [...container.querySelectorAll('ul > [data-row]')].map((row) => row.textContent);
    return { tasks, rows };
  };

  afterEach(() => {
    unmount?.();
    unmount = null;
    vi.restoreAllMocks();
  });

  it('shows the matching items, follows the query, and writes a drop around the hidden ones', async () => {
    const query = ref('a');
    const { tasks, rows } = mount(query);
    await nextTick();
    expect(rows()).toEqual(['a1', 'a2', 'a3']);
    // a3 to the top, by keyboard.
    manager.start('a3', { x: 100, y: 2.5 * ROW }, 'keyboard');
    await nextTick();
    for (const key of ['ArrowUp', 'ArrowUp']) {
      const before = manager.pointer.value;
      document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      await vi.waitFor(() => expect(manager.pointer.value).not.toBe(before));
      await nextTick();
    }
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    // b1 b2 still follow a2.
    expect(tasks.value.map((task) => task.id)).toEqual(['a3', 'a1', 'a2', 'b1', 'b2']);
    query.value = '';
    await nextTick();
    expect(rows()).toEqual(['a3', 'a1', 'a2', 'b1', 'b2']);
  });
});
