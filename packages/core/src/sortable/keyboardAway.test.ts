import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { containsPoint, createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeDroppable } from '../core/makeDroppable';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';

const ROW = 40;
let manager: DnDManager;
let unmount: (() => void) | null = null;
let tasks: Ref<Array<{ id: string }>>;
let later: Ref<Array<{ id: string }>>;

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('li', { ref: 'el', 'data-row': '' }, props.rowId);
  },
});

/** A list of rows `x`, `y` at y 120–200 (`data-later`), in the group of the first one. */
const Later = defineComponent({
  props: { indicator: Boolean },
  setup(props) {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
      items: later,
      group: 'tasks',
      placeholder: props.indicator ? 'indicator' : 'item',
    });
    return () => h('ul', { ref: 'list', 'data-later': '' }, items.value.map((task) => h(Row, { key: task.id, rowId: task.id })));
  },
});

/**
 * A list of three 40px rows at the top, and a trash zone at y 200–260 below it; with
 * `stacked`, another list of the group between them (`Later`).
 */
const mount = ({ indicator = false, stacked = false } = {}) => {
  tasks = ref(['a', 'b', 'c'].map((id) => ({ id })));
  later = ref(['x', 'y'].map((id) => ({ id })));
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
                group: 'tasks',
                placeholder: indicator ? 'indicator' : 'item',
              });
              makeDroppable(useTemplateRef<HTMLElement>('trash'), { id: 'trash', onDrop: (e) => e.source?.remove() });
              return () => [
                h('ul', { ref: 'list' }, items.value.map((task) => h(Row, { key: task.id, rowId: task.id }))),
                stacked ? h(Later, { indicator }) : null,
                h('div', { ref: 'trash', 'data-trash': '' }),
              ];
            },
          }),
      }),
  });
  app.mount(container);
  const rectOf = (element: Element) => {
    if (element.hasAttribute('data-trash')) return createRect(0, 200, 200, 60);
    const top = (list: Element) => (list.hasAttribute('data-later') ? 120 : 0);
    if (element.tagName === 'UL') return createRect(0, top(element), 200, element.children.length * ROW);
    if (element.hasAttribute('data-row')) {
      const list = element.parentElement!;
      return createRect(0, top(list) + [...list.children].indexOf(element) * ROW, 200, ROW);
    }
    return createRect(0, 0, 0, 0);
  };
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this) as DOMRect;
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    const candidates = [...container.querySelectorAll('[data-row], ul, [data-trash]')];
    return candidates.find((element) => containsPoint(rectOf(element), { x, y })) ?? null;
  });
  unmount = () => {
    app.unmount();
    container.remove();
  };
};

const press = async (key: string) => {
  const before = manager.pointer.value;
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  await vi.waitFor(() => expect(manager.pointer.value).not.toBe(before));
  await nextTick();
};

/** A key press that may leave the overlay where it is. */
const tap = async (key: string) => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  for (let i = 0; i < 4; i++) await new Promise((resolve) => setTimeout(resolve, 0));
  await nextTick();
};

afterEach(() => {
  unmount?.();
  unmount = null;
  vi.restoreAllMocks();
});

describe('keyboard: past the end of a list, a plain drop target', () => {
  it('the arrow goes on to the trash and back to the slot; dropping there removes the item', async () => {
    mount();
    await nextTick();
    manager.start('b', { x: 100, y: 1.5 * ROW }, 'keyboard');
    await nextTick();
    await press('ArrowDown');
    await press('ArrowDown');
    expect(manager.over.value?.id).toBe('trash');
    // Over the trash the slot went home, as with the pointer: a drop there leaves the list
    // as it was (unless the trash takes the item out). Up from it: back to the slot, home.
    const rows = [...document.querySelectorAll('[data-row]')].filter((row) => !row.closest('[data-dnd-overlay]'));
    expect(rows.map((row) => row.textContent)).toEqual(['a', 'b', 'c']);
    await press('ArrowUp');
    expect(manager.pointer.value).toEqual({ x: 100, y: 1.5 * ROW });
    // From home, down passes `c` again before it reaches the trash.
    await press('ArrowDown');
    await press('ArrowDown');
    expect(manager.over.value?.id).toBe('trash');
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(tasks.value.map((task) => task.id)).toEqual(['a', 'c']);
  });
});

describe('keyboard in an indicator list', () => {
  it('past the first position, with nothing that way, the overlay stays on the line', async () => {
    mount({ indicator: true });
    await nextTick();
    manager.start('c', { x: 100, y: 2.5 * ROW }, 'keyboard');
    await nextTick();
    await press('ArrowUp');
    await press('ArrowUp');
    expect(manager.pointer.value).toEqual({ x: 100, y: 0.5 * ROW });
    // Nothing above: the line stays before `a`, and so does the overlay (not back home at `c`).
    await tap('ArrowUp');
    expect(manager.pointer.value).toEqual({ x: 100, y: 0.5 * ROW });
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(tasks.value.map((task) => task.id)).toEqual(['c', 'a', 'b']);
  });
});

describe('keyboard: lists stacked along their axis', () => {
  it('down past the end of a list goes into the list below, before its first item', async () => {
    mount({ stacked: true });
    await nextTick();
    manager.start('c', { x: 100, y: 2.5 * ROW }, 'keyboard');
    await nextTick();
    await press('ArrowDown');
    expect(later.value.map((task) => task.id)).toEqual(['x', 'y']);
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(tasks.value.map((task) => task.id)).toEqual(['a', 'b']);
    expect(later.value.map((task) => task.id)).toEqual(['c', 'x', 'y']);
  });

  it('in indicator lists the line goes there', async () => {
    mount({ stacked: true, indicator: true });
    await nextTick();
    manager.start('a', { x: 100, y: 0.5 * ROW }, 'keyboard');
    await nextTick();
    // Before `c`, after it (the end), then on into the list below.
    await tap('ArrowDown');
    await tap('ArrowDown');
    expect(manager.pointer.value).toEqual({ x: 100, y: 2.5 * ROW });
    await tap('ArrowDown');
    // The line before `x`: the overlay on it.
    expect(manager.pointer.value).toEqual({ x: 100, y: 120 + 0.5 * ROW });
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(tasks.value.map((task) => task.id)).toEqual(['b', 'c']);
    expect(later.value.map((task) => task.id)).toEqual(['a', 'x', 'y']);
  });
});
