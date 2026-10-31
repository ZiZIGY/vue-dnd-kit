/**
 * The page scrolling under a drag: the box is `position: fixed`, the content isn't. A
 * dropped overlay lands where its slot is now, a locked axis stays on its row of the
 * content, and an element dragged without an overlay stays under the pointer.
 */

import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type PropType, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Coordinates, DropAnimation, Rect } from '../types';
import { createRect } from '../animation/layout';
import { DnDProvider } from './DnDProvider';
import { useManager } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';
import { makeSortableItem } from '../sortable/makeSortableItem';
import { makeSortableList } from '../sortable/makeSortableList';

/**
 * The layout happy-dom lacks: containers (`data-col`) sit side by side 300px apart, their
 * children stack 40px high; the page is scrolled by `scroll`.
 */
const ROW = 40;
const scroll = { x: 0, y: 0 };
const rectOf = (element: Element): Rect => {
  if (element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
  const column = element.getAttribute('data-col');
  if (column != null) {
    return createRect(Number(column) * 300 - scroll.x, -scroll.y, 200, Math.max(element.children.length, 1) * ROW);
  }
  const parent = element.parentElement;
  const parentColumn = parent?.getAttribute('data-col');
  if (parent && parentColumn != null) {
    return createRect(Number(parentColumn) * 300 - scroll.x, [...parent.children].indexOf(element) * ROW - scroll.y, 200, ROW);
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
    options: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
      id: props.listId,
      items: props.rows,
      group: 'g',
      ...props.options,
    });
    return () => h('div', { ref: 'list', 'data-col': props.column }, items.value.map((row) => h(Row, { key: row.id, rowId: row.id })));
  },
});

/** The transform a draggable without an overlay gets, as its component sees it. */
let ownTransform: Readonly<Ref<Coordinates | null>>;
const Free = defineComponent({
  props: { column: { type: Number, required: true } },
  setup(props) {
    ownTransform = makeDraggable(useTemplateRef<HTMLElement>('el'), { id: 'free', overlay: false }).transform;
    return () => h('div', { 'data-col': props.column }, [h('span', { ref: 'el' }, 'free')]);
  },
});

/** Column 0: list A, 1: list B, 4: a draggable without an overlay. */
const mount = (provider: Record<string, unknown> = {}, listA: Record<string, unknown> = {}) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const a = ref([{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }]);
  const b = ref([{ id: 'b1' }, { id: 'b2' }]);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { animation: false, ...provider }, {
        default: () => [
          h({ setup: () => () => ((manager = useManager()), null) }),
          h(List, { listId: 'A', rows: a, column: 0, options: listA }),
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
  return { a, b };
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

/** Scrolls the page: the content moves, the pointer stays. */
const scrollTo = async (x: number, y: number) => {
  scroll.x = x;
  scroll.y = y;
  document.dispatchEvent(new Event('scroll'));
  manager.flushFrame();
  await settle();
};

const idle = async () => {
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  await settle();
};

const overlay = () => document.querySelector<HTMLElement>('[data-dnd-overlay]');

afterEach(() => {
  unmount?.();
  unmount = null;
  scroll.x = scroll.y = 0;
  vi.restoreAllMocks();
});

describe('a dropped overlay lands where its slot is now', () => {
  it('scrolled mid-flight, the box moves with the slot', async () => {
    let land!: () => void;
    const hold: DropAnimation = () => new Promise<void>((resolve) => (land = resolve));
    const { b } = mount({ dropAnimation: hold });
    await settle();
    await start('a1', at(0, 0));
    await pointTo(at(1, 1));
    const drop = manager.drop();
    await vi.waitFor(() => expect(land).toBeTypeOf('function'));
    expect(overlay()!.style.translate).toBe('');
    await scrollTo(0, 100);
    // The box follows every frame: the slot went 100px up.
    await vi.waitFor(() => expect(overlay()!.style.translate).toBe('0px -100px'));
    land();
    await drop;
    await idle();
    expect(b.value.map((row) => row.id)).toEqual(['b1', 'b2', 'a1']);
  });

  it('while `onBeforeDrop` decides, the box stays on the target it was dropped on', async () => {
    let decide!: (verdict: boolean) => void;
    mount({}, { onBeforeDrop: () => new Promise<boolean>((resolve) => (decide = resolve)) });
    await settle();
    await start('a1', at(0, 0));
    await pointTo(at(0, 2));
    const drop = manager.drop();
    await vi.waitFor(() => expect(decide).toBeTypeOf('function'));
    await scrollTo(0, 60);
    await vi.waitFor(() => expect(overlay()!.style.translate).toBe('0px -60px'));
    decide(true);
    await drop;
    await idle();
  });
});

describe('a locked axis stays on its row of the content', () => {
  it("`axis: 'y'`: the page scrolls sideways, the drag stays on its column and in its list", async () => {
    const { a } = mount({}, { axis: 'y' });
    await settle();
    await start('a1', at(0, 0));
    await pointTo(at(0, 1));
    // List A goes from x 0–200 to x -250–-50: the pointer at x 100 is no longer over it.
    await scrollTo(250, 0);
    expect(manager.pointer.value!.x).toBe(at(0).x - 250);
    expect(manager.over.value?.id).toBe('A');
    await pointTo({ x: at(0).x, y: at(0, 2).y + 15 });
    expect(manager.over.value?.id).toBe('A');
    await manager.drop();
    await idle();
    expect(a.value.map((row) => row.id)).toEqual(['a2', 'a3', 'a1']);
  });
});

describe('an element dragged without an overlay', () => {
  it('stays under the pointer when the page scrolls', async () => {
    mount();
    await settle();
    await start('free', { x: at(4).x, y: 10 });
    await pointTo({ x: at(4).x + 30, y: 10 });
    expect(ownTransform.value).toEqual({ x: 30, y: 0 });
    // The element went 100px up with the page: its transform brings it back under the pointer.
    await scrollTo(0, 100);
    expect(ownTransform.value).toEqual({ x: 30, y: 100 });
    manager.cancel();
    await idle();
  });
});
