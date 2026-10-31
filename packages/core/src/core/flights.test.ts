/**
 * Drags don't wait for landings: a decided drop hands its overlay to a flight, which
 * lands in its own box while the next drag runs, and settles (`onDragSettle`) once it is
 * there. `status` reads `'dragging'`, else `'dropping'` while anything lands, else `'idle'`.
 */

import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, watch, type PropType, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Coordinates, DnDEvent, DnDStatus, DropAnimation, Rect } from '../types';
import { createRect } from '../animation/layout';
import { DnDProvider } from './DnDProvider';
import { useManager } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';
import { makeSortableItem } from '../sortable/makeSortableItem';
import { makeSortableList } from '../sortable/makeSortableList';

/** The layout happy-dom lacks: containers (`data-col`) sit side by side 300px apart, their children stack 40px high. */
const ROW = 40;
const rectOf = (element: Element): Rect => {
  // A box is where its style puts it.
  if (element.hasAttribute('data-dnd-overlay')) {
    const { style } = element as HTMLElement;
    const [, x = '0', y = '0'] = /translate3d\(([-\d.]+)px, ([-\d.]+)px/.exec(style.transform) ?? [];
    return createRect(Number(x), Number(y), parseFloat(style.width) || 0, parseFloat(style.height) || 0);
  }
  if (element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
  const column = element.getAttribute('data-col');
  if (column != null) return createRect(Number(column) * 300, 0, 200, Math.max(element.children.length, 1) * ROW);
  const parent = element.parentElement;
  const parentColumn = parent?.getAttribute('data-col');
  if (parent && parentColumn != null) {
    return createRect(Number(parentColumn) * 300, [...parent.children].indexOf(element) * ROW, 200, ROW);
  }
  return createRect(0, 0, 0, 0);
};

const at = (column: number, row = 0) => ({ x: column * 300 + 100, y: row * ROW + ROW / 2 });

let manager: DnDManager;
let unmount: (() => void) | null = null;

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('div', { ref: 'el', 'data-id': props.rowId }, props.rowId);
  },
});

const List = defineComponent({
  props: {
    listId: { type: String, required: true },
    rows: { type: Object as PropType<Ref<Array<{ id: string }>>>, required: true },
    column: { type: Number, required: true },
  },
  setup(props) {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), { id: props.listId, items: props.rows, group: 'g' });
    return () => h('div', { ref: 'list', 'data-col': props.column }, items.value.map((row) => h(Row, { key: row.id, rowId: row.id })));
  },
});

/** Whether the plain draggable reads itself dragged, as its component sees it. */
let freeDragging: Readonly<Ref<boolean>>;
const Free = defineComponent({
  props: { column: { type: Number, required: true } },
  setup(props) {
    freeDragging = makeDraggable(useTemplateRef<HTMLElement>('el'), { id: 'free' }).isDragging;
    return () => h('div', { 'data-col': props.column }, [h('span', { ref: 'el' }, 'free')]);
  },
});

/** Drop animations held until released by hand, per dragged id. */
let held: Map<string, () => void>;
const holding =
  (...ids: string[]): DropAnimation =>
  ({ active }) =>
    ids.includes(String(active.id)) ? new Promise<void>((resolve) => held.set(String(active.id), resolve)) : undefined;

/** Column 0: list A, 1: list B, 4: a plain draggable. */
const mount = (dropAnimation: DropAnimation) => {
  held = new Map();
  const settled: DnDEvent[] = [];
  const container = document.createElement('div');
  document.body.appendChild(container);
  const a = ref([{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }]);
  const b = ref([{ id: 'b1' }, { id: 'b2' }]);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { animation: false, dropAnimation, onDragSettle: (event: DnDEvent) => settled.push(event) }, {
        default: () => [
          h({ setup: () => () => ((manager = useManager()), null) }),
          h(List, { listId: 'A', rows: a, column: 0 }),
          h(List, { listId: 'B', rows: b, column: 1 }),
          h(Free, { column: 4 }),
        ],
      }),
  });
  app.mount(container);
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this) as DOMRect;
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    for (const column of container.querySelectorAll('[data-col]')) {
      const rect = rectOf(column);
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return column;
    }
    return null;
  });
  unmount = () => {
    app.unmount();
    container.remove();
  };
  return { a, b, settled, container };
};

const settle = async () => {
  for (let i = 0; i < 4; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();
  }
};

const start = async (id: string, point: Coordinates) => {
  expect(manager.start(id, point, 'pointer')).toBe(true);
  await settle();
};

const pointTo = async (point: Coordinates) => {
  manager.move(point);
  manager.flushFrame();
  await settle();
};

/** Releases the held landing of `id` once it has started. */
const land = async (id: string) => {
  await vi.waitFor(() => expect(held.has(id)).toBe(true));
  held.get(id)!();
  await settle();
};

const boxes = () => [...document.querySelectorAll<HTMLElement>('[data-dnd-overlay]')];
const row = (id: string) => document.querySelector<HTMLElement>(`[data-col] > [data-id="${id}"]`)!;

afterEach(() => {
  unmount?.();
  unmount = null;
  vi.restoreAllMocks();
});

describe('the next drag starts while the last one lands', () => {
  it('starts at once; each overlay lands in its own box and settles in turn', async () => {
    const { a, b, settled } = mount(holding('a1'));
    await settle();
    await start('a1', at(0, 0));
    await pointTo(at(1, 1));
    const first = manager.drop();
    await vi.waitFor(() => expect(held.has('a1')).toBe(true));
    // The drop is written, the drag state gone; the overlay lands on.
    expect(b.value.map((item) => item.id)).toEqual(['b1', 'b2', 'a1']);
    expect(manager.active.value).toBeNull();
    expect(manager.status.value).toBe('dropping');
    expect(boxes()).toHaveLength(1);
    expect(row('a1').hasAttribute('data-dnd-placeholder')).toBe(true);

    // The next drag doesn't wait.
    await start('b2', at(1, 2));
    expect(manager.status.value).toBe('dragging');
    expect(boxes()).toHaveLength(2);
    expect(row('a1').hasAttribute('data-dnd-placeholder')).toBe(true);
    await pointTo({ x: at(0).x, y: 3 * ROW - 5 });
    await manager.drop();
    // Its landing (not held) settled first, the other still lands.
    expect(settled.map((event) => event.active.id)).toEqual(['b2']);
    expect(a.value.map((item) => item.id)).toEqual(['a2', 'a3', 'b2']);
    expect(manager.status.value).toBe('dropping');
    expect(boxes()).toHaveLength(1);

    await land('a1');
    await first;
    expect(settled.map((event) => event.active.id)).toEqual(['b2', 'a1']);
    expect('dropped' in settled[1]! && settled[1].dropped).toBe(true);
    expect(manager.status.value).toBe('idle');
    expect(boxes()).toHaveLength(0);
    expect(row('a1').hasAttribute('data-dnd-placeholder')).toBe(false);
  });

  it("the drag's box goes on as its flight's: the same element lands", async () => {
    mount(holding('a1'));
    await settle();
    await start('a1', at(0, 0));
    const box = boxes()[0];
    await pointTo(at(0, 2));
    const drop = manager.drop();
    await vi.waitFor(() => expect(held.has('a1')).toBe(true));
    expect(boxes()).toEqual([box]);
    expect(box!.getAttribute('data-dnd-overlay')).toBe('dropping');
    await land('a1');
    await drop;
  });

  it("status: 'dragging', else 'dropping' while anything lands, else 'idle'", async () => {
    mount(holding('a1'));
    await settle();
    const seen: DnDStatus[] = [];
    const stop = watch(manager.status, (status) => seen.push(status), { flush: 'sync' });
    await start('a1', at(0, 0));
    const drop = manager.drop();
    await vi.waitFor(() => expect(held.has('a1')).toBe(true));
    await start('a2', at(0, 1));
    manager.cancel();
    await settle();
    await land('a1');
    await drop;
    stop();
    expect(seen).toEqual(['dragging', 'dropping', 'dragging', 'dropping', 'idle']);
  });

  it('a plain draggable reads itself dragged until its overlay is home', async () => {
    mount(holding('free'));
    await settle();
    await start('free', { x: at(4).x, y: 10 });
    expect(freeDragging.value).toBe(true);
    const drop = manager.drop();
    await vi.waitFor(() => expect(held.has('free')).toBe(true));
    expect(manager.active.value).toBeNull();
    expect(freeDragging.value).toBe(true);
    await land('free');
    await drop;
    expect(freeDragging.value).toBe(false);
  });

  it('a press during a landing activates a drag through the pointer sensor', async () => {
    mount(holding('a1'));
    await settle();
    await start('a1', at(0, 0));
    const drop = manager.drop();
    await vi.waitFor(() => expect(held.has('a1')).toBe(true));
    // happy-dom's pointer events lack `getModifierState` (the copy key listens while anything moves).
    const pointer = (type: string, init: PointerEventInit) =>
      Object.assign(new PointerEvent(type, init), { getModifierState: () => false });
    row('a3').dispatchEvent(pointer('pointerdown', { bubbles: true, composed: true, isPrimary: true, button: 0, pointerType: 'mouse' }));
    expect(manager.status.value).toBe('activating');
    document.dispatchEvent(pointer('pointerup', { pointerId: 0, bubbles: true }));
    // Let go before the drag started: back at rest, the landing still going.
    expect(manager.status.value).toBe('dropping');
    await land('a1');
    await drop;
    expect(manager.status.value).toBe('idle');
  });

  it("a drag of an item that still lands catches it in flight: its box goes on from where it is", async () => {
    const { settled } = mount(holding('a1'));
    await settle();
    await start('a1', at(0, 0));
    await pointTo({ x: at(1).x + 40, y: at(1, 1).y + 15 });
    const drop = manager.drop();
    await vi.waitFor(() => expect(held.has('a1')).toBe(true));
    const flying = rectOf(boxes()[0]!);
    // Pressed inside the box, a little off its corner.
    const press = { x: flying.left + 30, y: flying.top + 10 };
    await start('a1', press);
    // Its landing is over: it settled where it was caught.
    expect(settled.map((event) => event.active.id)).toEqual(['a1']);
    expect(manager.flights.value).toHaveLength(0);
    expect(boxes()).toHaveLength(1);
    const box = rectOf(boxes()[0]!);
    expect([box.left, box.top]).toEqual([flying.left, flying.top]);
    // It follows the pointer from there.
    await pointTo({ x: press.x + 20, y: press.y + 5 });
    const moved = rectOf(boxes()[0]!);
    expect([moved.left, moved.top]).toEqual([flying.left + 20, flying.top + 5]);
    manager.cancel();
    await drop;
  });

  it('a press on a landing box catches its item, whatever is under the pointer', async () => {
    mount(holding('a1'));
    await settle();
    await start('a1', at(0, 0));
    await pointTo({ x: at(1).x, y: at(1, 0).y + 5 });
    const drop = manager.drop();
    await vi.waitFor(() => expect(held.has('a1')).toBe(true));
    const flying = rectOf(boxes()[0]!);
    const point = { x: flying.left + 10, y: flying.top + 10 };
    const pointer = (type: string, init: PointerEventInit) =>
      Object.assign(new PointerEvent(type, init), { getModifierState: () => false });
    // The event goes to the row under the box (b1): the box lets the pointer through.
    row('b1').dispatchEvent(
      pointer('pointerdown', { bubbles: true, composed: true, isPrimary: true, button: 0, pointerType: 'mouse', clientX: point.x, clientY: point.y }),
    );
    document.dispatchEvent(pointer('pointermove', { bubbles: true, pointerId: 0, clientX: point.x + 20, clientY: point.y }));
    await settle();
    expect(manager.active.value?.id).toBe('a1');
    manager.cancel();
    await settle();
    document.dispatchEvent(pointer('pointerup', { pointerId: 0, bubbles: true }));
    await drop;
  });

  it('the provider going away ends the landings', async () => {
    const { settled } = mount(holding('a1'));
    await settle();
    await start('a1', at(0, 0));
    void manager.drop();
    await vi.waitFor(() => expect(held.has('a1')).toBe(true));
    unmount!();
    unmount = null;
    expect(manager.flights.value).toHaveLength(0);
    expect(settled).toHaveLength(0);
  });
});

describe('the keyboard while an overlay lands', () => {
  // happy-dom's key events lack `getModifierState` (the copy key listens while anything moves).
  const space = () =>
    Object.assign(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true, cancelable: true, composed: true }), {
      getModifierState: () => false,
    });

  it('picks an item up, as a press does, and keeps the key from the page', async () => {
    mount(holding('a1'));
    await settle();
    await start('a1', at(0, 0));
    const drop = manager.drop();
    await vi.waitFor(() => expect(held.has('a1')).toBe(true));
    expect(manager.status.value).toBe('dropping');
    const key = space();
    row('a2').dispatchEvent(key);
    expect(manager.status.value).toBe('dragging');
    expect(manager.active.value?.id).toBe('a2');
    expect(key.defaultPrevented).toBe(true);
    manager.cancel();
    await land('a1');
    await drop;
  });

  it('picks up an item still landing at the item, not where its box is', async () => {
    mount(holding('a1'));
    await settle();
    await start('a1', at(0, 0));
    await pointTo(at(1, 1));
    const drop = manager.drop();
    await vi.waitFor(() => expect(held.has('a1')).toBe(true));
    const flying = rectOf(boxes()[0]!);
    // a1 went to the end of list B; its box is still where it was let go.
    const slot = rectOf(row('a1'));
    const center = { x: slot.left + slot.width / 2, y: slot.top + slot.height / 2 };
    expect(center.y < flying.top || center.y > flying.bottom).toBe(true);
    row('a1').dispatchEvent(space());
    await settle();
    expect(manager.active.value?.id).toBe('a1');
    const box = rectOf(boxes().at(-1)!);
    expect([box.left, box.top]).toEqual([slot.left, slot.top]);
    manager.cancel();
    await settle();
    await drop;
  });
});
