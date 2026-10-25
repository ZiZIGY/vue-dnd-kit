import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type PropType } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { SensorContext, SensorType, SortableDropEvent, SortableListOptions } from '../types';
import { containsPoint, createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { defineSensor } from '../core/sensors/host';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';

/**
 * `SensorDrag.place()`: a sensor puts the dragged item at a position of a list, the way
 * keyboard moves take it there, and the drop goes through the normal pipeline. Lists
 * `a`, `b` and `c` sit side by side, 300px apart, with 40px rows.
 */

type Item = { id: string };

const ROW = 40;
const LEFT: Record<string, number> = { a: 0, b: 300, c: 600 };

let manager: DnDManager;
let context: SensorContext;
let unmount: (() => void) | null = null;

const probe = defineSensor({
  setup: (ctx) => {
    context = ctx;
  },
});

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('li', { ref: 'el', 'data-id': props.rowId }, props.rowId);
  },
});

const List = defineComponent({
  props: {
    listId: { type: String, required: true },
    options: { type: Object as PropType<SortableListOptions<Item>>, required: true },
  },
  setup(props) {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), { id: props.listId, ...props.options });
    return () => h('ul', { ref: 'list', 'data-list': props.listId }, items.value.map((item) => h(Row, { key: item.id, rowId: item.id })));
  },
});

const rectOf = (element: Element) => {
  const list = element.closest('[data-list]');
  if (!list || element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
  const left = LEFT[list.getAttribute('data-list')!]!;
  if (element === list) return createRect(left, 0, 200, Math.max(list.children.length, 1) * ROW);
  return createRect(left, [...list.children].indexOf(element) * ROW, 200, ROW);
};

const mount = (lists: Record<string, SortableListOptions<Item>>) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { animation: false, dropAnimation: false, sensors: [probe] }, {
        default: () => [
          h({
            setup() {
              manager = useManager();
              return () => null;
            },
          }),
          ...Object.entries(lists).map(([id, options]) => h(List, { listId: id, options })),
        ],
      }),
  });
  app.mount(container);
  unmount = () => {
    app.unmount();
    container.remove();
  };
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this) as DOMRect;
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    const candidates = [...container.querySelectorAll('[data-list] > li'), ...container.querySelectorAll('[data-list]')];
    return candidates.find((element) => containsPoint(rectOf(element), { x, y })) ?? null;
  });
  return container;
};

const tasks = (...keys: string[]) => keys.map((id): Item => ({ id }));
const ids = (items: readonly Item[]) => items.map((item) => item.id).join(',');
const rows = (container: HTMLElement, list: string) =>
  [...container.querySelectorAll(`[data-list="${list}"] > li`)].map((row) => row.getAttribute('data-id')).join(',');

afterEach(() => {
  unmount?.();
  unmount = null;
  vi.restoreAllMocks();
});

describe.each<SensorType>(['keyboard', 'pointer'])('place() in %s drags', (type) => {
  it('moves the item within its list, clamped to it, and the drop writes it', async () => {
    const a = ref(tasks('a1', 'a2', 'a3', 'a4'));
    const container = mount({ a: { items: a } });
    await nextTick();
    const drag = context.activate({ target: 'a1', type })!;
    expect(await drag.place({ index: 2 })).toBe(true);
    expect(rows(container, 'a')).toBe('a2,a3,a1,a4');
    // The drag went to the item's new place.
    expect(manager.over.value?.id).toBe('a');
    expect(manager.pointer.value).toEqual({ x: 100, y: 2.5 * ROW });
    expect(await drag.place({ index: 99 })).toBe(true);
    expect(rows(container, 'a')).toBe('a2,a3,a4,a1');
    expect(await drag.drop()).toBe(true);
    expect(ids(a.value)).toBe('a2,a3,a4,a1');
  });

  it('into another list that accepts it, through onBeforeDrop and onDrop', async () => {
    const a = ref(tasks('a1', 'a2'));
    const b = ref(tasks('b1', 'b2'));
    const seen: string[] = [];
    const container = mount({
      a: { items: a, group: 'g' },
      b: {
        items: b,
        group: 'g',
        onBeforeDrop: (event) => void seen.push(`before:${event.to.list}:${event.to.index}`),
        onDrop: (event: SortableDropEvent<Item>) => void seen.push(`drop:${ids(event.result.get('b')!)}`),
      },
      c: { items: ref(tasks('c1')), group: { name: 'g', put: false } },
    });
    await nextTick();
    const drag = context.activate({ target: 'a2', type })!;
    // `c` takes nothing, and no list has this id.
    expect(await drag.place({ list: 'c', index: 0 })).toBe(false);
    expect(await drag.place({ list: 'nowhere' })).toBe(false);
    expect(await drag.place({ list: 'b', index: 1 })).toBe(true);
    expect(rows(container, 'b')).toBe('b1,a2,b2');
    expect(await drag.drop()).toBe(true);
    expect(seen).toEqual(['before:b:1', 'drop:b1,a2,b2']);
    expect(ids(a.value)).toBe('a1');
    expect(ids(b.value)).toBe('b1,a2,b2');
  });

  it('to the end of a list by default; a refused drop goes back', async () => {
    const a = ref(tasks('a1', 'a2'));
    const b = ref(tasks('b1'));
    mount({ a: { items: a, group: 'g' }, b: { items: b, group: 'g', onBeforeDrop: () => false } });
    await nextTick();
    const drag = context.activate({ target: 'a1', type })!;
    expect(await drag.place({ list: 'b' })).toBe(true);
    expect(await drag.drop()).toBe(false);
    expect(ids(a.value)).toBe('a1,a2');
    expect(ids(b.value)).toBe('b1');
  });
});
