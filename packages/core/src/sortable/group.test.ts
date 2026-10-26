import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type Component, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MultipleMode, OverlayProps, SortableDropEvent, SortableListOptions } from '../types';
import { containsPoint, createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { DragPreview } from '../core/DragPreview';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeDraggable } from '../core/makeDraggable';
import { layoutColumn, layoutPile } from './column';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';

let manager: DnDManager;
let unmount: (() => void) | null = null;

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    const { isPlaceholder } = makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('li', { ref: 'el', 'data-id': props.rowId, 'data-slot': isPlaceholder.value || undefined }, props.rowId);
  },
});

const mountList = (ids: string[], options: { multiple?: MultipleMode; overlay?: Component } = {}) => {
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
                items: ref(ids.map((id) => ({ id }))),
                ...options,
              });
              return () => h('ul', { ref: 'list' }, items.value.map((task) => h(Row, { key: task.id, rowId: task.id })));
            },
          }),
      }),
  });
  app.mount(container);
  unmount = () => {
    app.unmount();
    container.remove();
  };
  return container;
};

const rows = (container: HTMLElement) => [...container.querySelectorAll('ul > li')].map((row) => row.getAttribute('data-id'));
const slots = (container: HTMLElement) => [...container.querySelectorAll('ul > li[data-slot]')].map((row) => row.getAttribute('data-id'));
const overlay = () => document.querySelector('[data-dnd-overlay]');

/** Selects `others`, picks `id` up with the pointer, and lets the drafts render. */
const pickUp = async (id: string, ...others: string[]) => {
  for (const key of [id, ...others]) manager.selection.add(key);
  expect(manager.start(id, { x: 1, y: 1 }, 'pointer')).toBe(true);
  await nextTick();
};

const cancel = async () => {
  manager.cancel();
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  await nextTick();
};

describe('multi-drag modes', () => {
  afterEach(() => {
    unmount?.();
    unmount = null;
  });

  it("'group' (default): the others join the active item in drop order, as placeholders", async () => {
    const container = mountList(['x1', 'x2', 'x3', 'x4', 'x5']);
    await nextTick();
    await pickUp('x3', 'x5', 'x1');
    expect(rows(container)).toEqual(['x2', 'x1', 'x3', 'x5', 'x4']);
    expect(slots(container)).toEqual(['x1', 'x3', 'x5']);
    // The default overlay shows the others in a column around the active item, in drop order.
    const column = [...overlay()!.querySelectorAll('[data-dnd-overlay-item] [data-id]')].map((clone) => clone.getAttribute('data-id'));
    expect(column).toEqual(['x1', 'x5']);
    await cancel();
    expect(rows(container)).toEqual(['x1', 'x2', 'x3', 'x4', 'x5']);
    expect(slots(container)).toEqual([]);
  });

  it("'gaps' leaves the others in place, still with a column overlay", async () => {
    const container = mountList(['x1', 'x2', 'x3'], { multiple: 'gaps' });
    await nextTick();
    await pickUp('x1', 'x3');
    expect(rows(container)).toEqual(['x1', 'x2', 'x3']);
    expect(slots(container)).toEqual(['x1']);
    expect(overlay()!.querySelectorAll('[data-dnd-overlay-item]')).toHaveLength(1);
    await cancel();
  });

  it("'stack' collapses the others; the overlay shows one clone and a count", async () => {
    const container = mountList(['x1', 'x2', 'x3'], { multiple: 'stack' });
    await nextTick();
    await pickUp('x1', 'x3');
    expect(rows(container)).toEqual(['x1', 'x2']);
    expect(overlay()!.querySelectorAll('[data-dnd-overlay-item]')).toHaveLength(0);
    expect(overlay()!.textContent).toContain('2');
    await cancel();
    expect(rows(container)).toEqual(['x1', 'x2', 'x3']);
  });

  it('DragPreview renders the clone of a dragged item, or its slot for one without a clone', async () => {
    const Custom = defineComponent({
      props: ['active', 'items', 'over', 'accepted', 'status', 'mode'],
      setup: (props) => () =>
        h('div', [
          ...(props as unknown as OverlayProps).items.map((entry) =>
            h(DragPreview, { key: entry.id, id: entry.id, class: 'preview' }, () => h('i', 'fallback')),
          ),
          h(DragPreview, { id: 'nowhere' }, () => h('i', { class: 'fallback' }, 'fallback')),
        ]),
    });
    mountList(['x1', 'x2', 'x3'], { overlay: Custom });
    await nextTick();
    await pickUp('x2', 'x3');
    const previews = [...overlay()!.querySelectorAll('.preview')];
    expect(previews.map((preview) => preview.querySelector('[data-id]')?.getAttribute('data-id'))).toEqual(['x2', 'x3']);
    expect(overlay()!.querySelectorAll('.fallback')).toHaveLength(1);
    // The other item's preview is its clone in the overlay: it lands on its own slot. The
    // grabbed one rides in the box.
    expect([...manager.overlayItems.keys()]).toEqual(['x3']);
    expect(manager.overlayItems.get('x3')).toBe(previews[1]);
    expect(previews.map((preview) => preview.hasAttribute('data-dnd-overlay-item'))).toEqual([false, true]);
    await cancel();
    expect(manager.overlayItems.size).toBe(0);
  });
});

describe('keyboard: a plain draggable over a list with createItem', () => {
  const ROW = 40;

  /** A list `inbox` (n1, n2, n3; 200px wide, 40px rows) and the plain draggable `chip` 300px below it. */
  const mountInbox = () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const Chip = defineComponent({
      setup() {
        makeDraggable(useTemplateRef<HTMLElement>('el'), { id: 'chip', data: { title: 'New' } });
        return () => h('span', { ref: 'el', 'data-chip': '' }, 'chip');
      },
    });
    const app = createApp({
      setup: () => () =>
        h(DnDProvider, { dropAnimation: false, animation: false }, {
          default: () => [
            h({
              setup() {
                manager = useManager();
                const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
                  id: 'inbox',
                  items: ref(['n1', 'n2', 'n3'].map((id) => ({ id }))),
                  createItem: () => ({ id: 'created' }),
                });
                return () =>
                  h('ul', { ref: 'list', 'data-list': '' }, items.value.map((task) => h(Row, { key: task.id, rowId: task.id })));
              },
            }),
            h(Chip),
          ],
      }),
    });
    app.mount(container);
    unmount = () => {
      app.unmount();
      container.remove();
    };
    return container;
  };

  /** The layout happy-dom doesn't have: the list's rows stack from the top, the chip sits below. */
  const rectOf = (element: Element) => {
    if (element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
    if (element.hasAttribute('data-list')) return createRect(0, 0, 200, element.children.length * ROW);
    if (element.parentElement?.hasAttribute('data-list')) {
      return createRect(0, [...element.parentElement.children].indexOf(element) * ROW, 200, ROW);
    }
    if (element.hasAttribute('data-chip')) return createRect(0, 300, 200, ROW);
    return createRect(0, 0, 0, 0);
  };

  const press = async (key: string) => {
    const before = manager.pointer.value;
    document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    // The move resolves after a render; the sensor then moves the drag there.
    await vi.waitFor(() => expect(manager.pointer.value).not.toBe(before));
    await nextTick();
  };

  afterEach(() => {
    unmount?.();
    unmount = null;
    vi.restoreAllMocks();
  });

  it('Up enters the list level with the drag, the arrows move the created item by slots, the drop inserts it', async () => {
    const container = mountInbox();
    await nextTick();
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return rectOf(this) as DOMRect;
    });
    vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
      const list = container.querySelector('[data-list]')!;
      const rect = rectOf(list);
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom ? list : null;
    });

    expect(manager.start('chip', { x: 100, y: 320 }, 'keyboard')).toBe(true);
    await nextTick();
    // The chip is below the rows: it enters after the last one.
    await press('ArrowUp');
    expect(rows(container)).toEqual(['n1', 'n2', 'n3', 'created']);
    expect(slots(container)).toEqual(['created']);
    expect(manager.mode.value).toBe('insert');
    expect(manager.pointer.value).toEqual({ x: 100, y: 3.5 * ROW });

    await press('ArrowUp');
    await press('ArrowUp');
    expect(rows(container)).toEqual(['n1', 'created', 'n2', 'n3']);
    await press('ArrowDown');
    expect(rows(container)).toEqual(['n1', 'n2', 'created', 'n3']);

    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    await nextTick();
    expect(rows(container)).toEqual(['n1', 'n2', 'created', 'n3']);
  });

  it('with no list in the arrow direction it moves as a plain draggable', async () => {
    const container = mountInbox();
    await nextTick();
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return rectOf(this) as DOMRect;
    });
    manager.start('chip', { x: 100, y: 320 }, 'keyboard');
    await nextTick();
    await press('ArrowDown');
    expect(manager.pointer.value).toEqual({ x: 100, y: 345 });
    expect(rows(container)).toEqual(['n1', 'n2', 'n3']);
    await cancel();
  });
});

describe('swap between two lists of a group', () => {
  const ROW = 40;
  /** Left edge of each list: `a` and `b` side by side, 200px wide, 40px rows. */
  const LEFT: Record<string, number> = { a: 0, b: 300 };
  type Item = { id: string };
  let data: Record<string, Ref<Item[]>>;
  let drops: SortableDropEvent[];

  const List = defineComponent({
    props: { listId: { type: String, required: true }, options: { type: Object, default: () => ({}) } },
    setup(props) {
      const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
        id: props.listId,
        items: data[props.listId]!,
        behavior: 'swap',
        group: 'pair',
        onDrop: (event) => drops.push(event),
        ...(props.options as Partial<SortableListOptions<Item>>),
      });
      return () =>
        h('ul', { ref: 'list', 'data-list': props.listId }, items.value.map((task) => h(Row, { key: task.id, rowId: task.id })));
    },
  });

  const rectOf = (element: Element) => {
    const list = element.closest('[data-list]');
    if (!list || element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
    const left = LEFT[list.getAttribute('data-list')!]!;
    if (element === list) return createRect(left, 0, 200, list.children.length * ROW);
    return createRect(left, [...list.children].indexOf(element) * ROW, 200, ROW);
  };

  const mountPair = (a: Partial<SortableListOptions<Item>> = {}, b: Partial<SortableListOptions<Item>> = {}) => {
    data = { a: ref(['a1', 'a2', 'a3'].map((id) => ({ id }))), b: ref(['b1', 'b2', 'b3'].map((id) => ({ id }))) };
    drops = [];
    const container = document.createElement('div');
    document.body.appendChild(container);
    const app = createApp({
      setup: () => () =>
        h(DnDProvider, { dropAnimation: false, animation: false }, {
          default: () => [
            h({
              setup() {
                manager = useManager();
                return () => null;
              },
            }),
            h(List, { listId: 'a', options: a }),
            h(List, { listId: 'b', options: b }),
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

  const keys = (container: HTMLElement, list: string) =>
    [...container.querySelectorAll(`[data-list="${list}"] > li`)].map((row) => row.getAttribute('data-id'));
  const at = (list: string, index: number) => ({ x: LEFT[list]! + 100, y: index * ROW + ROW / 2 });
  const moveTo = async (point: { x: number; y: number }) => {
    manager.move(point);
    manager.flushFrame();
    await nextTick();
  };
  const drop = async () => {
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    await nextTick();
  };

  afterEach(() => {
    unmount?.();
    unmount = null;
    vi.restoreAllMocks();
  });

  it('exchanges with the hovered item of the other list, reverts over the partner; the drop writes both lists', async () => {
    const container = mountPair();
    await nextTick();
    expect(manager.start('a1', at('a', 0), 'pointer')).toBe(true);
    await nextTick();
    await moveTo(at('b', 1));
    expect(keys(container, 'a')).toEqual(['b2', 'a2', 'a3']);
    expect(keys(container, 'b')).toEqual(['b1', 'a1', 'b3']);
    expect(manager.mode.value).toBe('swap');
    // b2 now sits where a1 started: hovering it undoes the exchange.
    await moveTo(at('a', 0));
    expect(keys(container, 'a')).toEqual(['a1', 'a2', 'a3']);
    expect(keys(container, 'b')).toEqual(['b1', 'b2', 'b3']);
    await moveTo(at('b', 2));
    expect(keys(container, 'a')).toEqual(['b3', 'a2', 'a3']);
    expect(keys(container, 'b')).toEqual(['b1', 'b2', 'a1']);
    await drop();
    expect(data.a!.value.map((item) => item.id)).toEqual(['b3', 'a2', 'a3']);
    expect(data.b!.value.map((item) => item.id)).toEqual(['b1', 'b2', 'a1']);
    expect(drops).toHaveLength(1);
    expect(drops[0]).toMatchObject({
      keys: ['a1'],
      from: { list: 'a', index: 0 },
      to: { list: 'b', index: 2 },
      sameList: false,
      mode: 'swap',
      partner: { key: 'b3', item: { id: 'b3' }, from: { list: 'b', index: 2 }, to: { list: 'a', index: 0 } },
    });
  });

  it("an item the dragged item's list refuses (group.put) is not swapped in; another one is", async () => {
    const container = mountPair({ group: { name: 'pair', put: ({ keys: incoming }) => !incoming.includes('b2') } });
    await nextTick();
    manager.start('a1', at('a', 0), 'pointer');
    await nextTick();
    await moveTo(at('b', 1));
    expect(keys(container, 'a')).toEqual(['a1', 'a2', 'a3']);
    expect(keys(container, 'b')).toEqual(['b1', 'b2', 'b3']);
    expect(manager.over.value?.accepted).toBe(true);
    await moveTo(at('b', 0));
    expect(keys(container, 'a')).toEqual(['b1', 'a2', 'a3']);
    // Moving on to the refused item reverts the exchange.
    await moveTo(at('b', 1));
    expect(keys(container, 'a')).toEqual(['a1', 'a2', 'a3']);
    expect(keys(container, 'b')).toEqual(['b1', 'b2', 'b3']);
    await drop();
    expect(drops).toEqual([]);
  });

  it("items of a list they can't leave (group.pull: false) are not swapped out", async () => {
    const container = mountPair({}, { group: { name: 'pair', pull: false } });
    await nextTick();
    manager.start('a2', at('a', 1), 'pointer');
    await nextTick();
    await moveTo(at('b', 0));
    expect(keys(container, 'a')).toEqual(['a1', 'a2', 'a3']);
    expect(keys(container, 'b')).toEqual(['b1', 'b2', 'b3']);
    await cancel();
  });

  it('a list that only sorts sends its items into a swap list by insertion, not exchange', async () => {
    const container = mountPair({ behavior: 'sort' });
    await nextTick();
    manager.start('a1', at('a', 0), 'pointer');
    await nextTick();
    await moveTo({ x: 400, y: 25 });
    expect(keys(container, 'a')).toEqual(['a2', 'a3']);
    expect(keys(container, 'b')).toEqual(['b1', 'a1', 'b2', 'b3']);
    expect(manager.mode.value).toBe('move');
    await drop();
    expect(drops[0]).toMatchObject({ mode: 'move', to: { list: 'b', index: 1 } });
    expect(drops[0]!.partner).toBeUndefined();
  });
});

describe('layoutColumn', () => {
  const size = (width: number, height: number) => ({ width, height });

  it('stacks items along the axis around the active one, a gap apart', () => {
    const cells = layoutColumn(
      [
        { id: 'a', size: size(100, 40) },
        { id: 'b', size: size(100, 60) },
        { id: 'c', size: size(100, 40) },
      ],
      'b',
      size(100, 60),
      size(100, 60),
      'y',
      6,
    );
    expect(cells).toEqual([
      { id: 'a', x: 0, y: -46, width: 100, height: 40 },
      { id: 'b', x: 0, y: 0, width: 100, height: 60 },
      { id: 'c', x: 0, y: 66, width: 100, height: 40 },
    ]);
  });

  it('runs along x for rows, scaled like the active item to the box', () => {
    // The box doubled the active item's width (overlayFit: 'slot'): the others follow.
    const cells = layoutColumn(
      [
        { id: 'a', size: size(50, 40) },
        { id: 'b', size: size(30, 40) },
      ],
      'a',
      size(100, 20),
      size(50, 40),
      'x',
      8,
    );
    expect(cells).toEqual([
      { id: 'a', x: 0, y: 0, width: 100, height: 20 },
      { id: 'b', x: 108, y: 0, width: 60, height: 20 },
    ]);
  });
});

describe('layoutPile', () => {
  it('puts the active item on top, up to three others fanned out behind it at the box size', () => {
    const cells = layoutPile([{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }], 'c', { width: 80, height: 60 });
    // Behind first (painted under), the active one last; a fifth item doesn't show.
    expect(cells.map((cell) => cell.id)).toEqual(['a', 'b', 'd', 'c']);
    expect(cells.at(-1)).toEqual({ id: 'c', x: 0, y: 0, width: 80, height: 60 });
    for (const cell of cells.slice(0, -1)) {
      expect(cell).toMatchObject({ width: 80, height: 60 });
      expect(cell.rotate).not.toBe(0);
    }
  });
});
