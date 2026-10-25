import { computed, createApp, defineComponent, h, nextTick, ref, shallowRef, useTemplateRef, type PropType } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DnDEvent, DropAnimationContext, Key, SortableDropEvent, SortableListOptions } from '../types';
import { containsPoint, createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useDnDMonitor, useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeDraggable } from '../core/makeDraggable';
import { makeDroppable } from '../core/makeDroppable';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';

/**
 * Controlled drops (rfcs/0001-v3.md §5): `onBeforeDrop` → `onDrop` → the write →
 * the animation, `event.result`, `preventDefault()` and read-only sources.
 *
 * Lists `a` and `b` sit side by side, 300px apart, with 40px rows; the plain draggable
 * `chip` sits to their right. Rows whose id starts with `g` are drop targets too: their
 * `onDrop` removes the dragged items from their list (`e.source.remove()`).
 */

type Item = { id: string; applied?: boolean };

const ROW = 40;
const LEFT: Record<string, number> = { a: 0, b: 300 };

let manager: DnDManager;
let unmount: (() => void) | null = null;
let animations: DropAnimationContext[];
/** What the monitor registered before the lists saw on `onDragEnd`: both lists' ids. */
let notified: string[];

const ids = (items: readonly Item[] | undefined) => (items ?? []).map((item) => item.id).join(',');

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    const el = useTemplateRef<HTMLElement>('el');
    makeSortableItem(el, { id: () => props.rowId });
    if (props.rowId.startsWith('g')) {
      makeDroppable(el, { id: `zone:${props.rowId}`, onDrop: (event: DnDEvent) => event.source?.remove() });
    }
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

const Chip = defineComponent({
  setup() {
    makeDraggable(useTemplateRef<HTMLElement>('el'), { id: 'chip' });
    return () => h('span', { ref: 'el', 'data-chip': '' }, 'chip');
  },
});

/** The layout happy-dom doesn't have. */
const rectOf = (element: Element) => {
  if (element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
  if (element.hasAttribute('data-chip')) return createRect(600, 0, 100, ROW);
  const list = element.closest('[data-list]');
  if (!list) return createRect(0, 0, 0, 0);
  const left = LEFT[list.getAttribute('data-list')!]!;
  if (element === list) return createRect(left, 0, 200, Math.max(list.children.length, 1) * ROW);
  return createRect(left, [...list.children].indexOf(element) * ROW, 200, ROW);
};

/** Mounts the lists `a` and `b` (when given) and the chip. */
const mount = (lists: { a: SortableListOptions<Item>; b?: SortableListOptions<Item> }) => {
  animations = [];
  notified = [];
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(
        DnDProvider,
        { animation: false, dropAnimation: (context: DropAnimationContext) => void animations.push(context) },
        {
          default: () => [
            h({
              setup() {
                manager = useManager();
                // Registered before the lists: told after they wrote the drop all the same.
                useDnDMonitor({ onDragEnd: () => notified.push(rows(container, 'a').join(',')) });
                return () => null;
              },
            }),
            h(List, { listId: 'a', options: lists.a }),
            lists.b && h(List, { listId: 'b', options: lists.b }),
            h(Chip),
          ],
        },
      ),
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

const rows = (container: HTMLElement, list: string) =>
  [...container.querySelectorAll(`[data-list="${list}"] > li`)].map((row) => row.getAttribute('data-id')!);
/** A point on row `index` of `list`, `fraction` of the way down it (its center by default). */
const at = (list: string, index: number, fraction = 0.5) => ({ x: LEFT[list]! + 100, y: (index + fraction) * ROW });
const tasks = (...keys: string[]) => keys.map((id): Item => ({ id }));

const start = async (id: string, point: { x: number; y: number }, ...others: string[]) => {
  manager.selection.clear();
  if (others.length) for (const key of [id, ...others]) manager.selection.add(key);
  expect(manager.start(id, point, 'pointer')).toBe(true);
  await nextTick();
};

const moveTo = async (point: { x: number; y: number }) => {
  manager.move(point);
  manager.flushFrame();
  await nextTick();
  await nextTick();
};

const drop = async () => {
  await manager.drop();
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  await nextTick();
};

/** `result` as `list:ids` pairs, in list order. */
const resultOf = (event: SortableDropEvent<Item>) =>
  Object.fromEntries([...event.result].map(([list, items]) => [list, ids(items)]));

afterEach(() => {
  unmount?.();
  unmount = null;
  vi.restoreAllMocks();
});

describe('the order of a drop', () => {
  it('onDrop comes before the write: the ref still holds the old order, result the new one', async () => {
    const a = ref(tasks('a1', 'a2', 'a3'));
    const seen: string[] = [];
    const container = mount({
      a: {
        items: a,
        onBeforeDrop: (event) => void seen.push(`before:${ids(a.value)}>${resultOf(event).a}`),
        onDrop: (event) => void seen.push(`drop:${ids(a.value)}>${resultOf(event).a}:${event.defaultPrevented}`),
      },
    });
    await nextTick();
    await start('a1', at('a', 0));
    await moveTo(at('a', 2, 0.75));
    expect(rows(container, 'a')).toEqual(['a2', 'a3', 'a1']);
    await drop();
    expect(seen).toEqual(['before:a1,a2,a3>a2,a3,a1', 'drop:a1,a2,a3>a2,a3,a1:false']);
    expect(ids(a.value)).toBe('a2,a3,a1');
    // useDnDMonitor().onDragEnd is a notification after everything.
    expect(notified).toEqual(['a2,a3,a1']);
  });

  it("the user's monitors decide before the lists: a later veto never strands an applied result", async () => {
    const a = ref(tasks('a1', 'a2', 'a3'));
    const seen: string[] = [];
    const container = mount({ a: { items: a, onBeforeDrop: () => void seen.push('list') } });
    await nextTick();
    // Registered after the list, like a useDnDMonitor in a component rendered later.
    manager.addMonitor({ onBeforeDrop: () => (seen.push('monitor'), false) });
    await start('a1', at('a', 0));
    await moveTo(at('a', 2, 0.75));
    await drop();
    expect(seen).toEqual(['monitor']);
    expect(ids(a.value)).toBe('a1,a2,a3');
    expect(rows(container, 'a')).toEqual(['a1', 'a2', 'a3']);
  });

  it('writes the very arrays result holds, and only the lists in it', async () => {
    const a = shallowRef(tasks('a1', 'a2'));
    const b = shallowRef(tasks('b1'));
    const bBefore = b.value;
    let result: ReadonlyMap<Key, Item[]> | null = null;
    mount({ a: { items: a, group: 'g', onDrop: (event) => (result = event.result) }, b: { items: b, group: 'g' } });
    await nextTick();
    await start('a2', at('a', 1));
    await moveTo(at('a', 0, 0.25));
    await drop();
    expect([...result!.keys()]).toEqual(['a']);
    expect(a.value).toBe(result!.get('a'));
    expect(b.value).toBe(bBefore);
  });
});

describe('preventDefault', () => {
  it('in onDrop: nothing is written; the result applied there lands in the new order', async () => {
    const a = ref(tasks('a1', 'a2', 'a3'));
    const b = ref(tasks('b1', 'b2'));
    let prevented: boolean | null = null;
    const container = mount({
      a: { items: a, group: 'g' },
      b: {
        items: b,
        group: 'g',
        onDrop: (event) => {
          event.preventDefault();
          prevented = event.defaultPrevented;
          // A store of its own: it marks what it applied.
          a.value = event.result.get('a')!.map((item) => ({ ...item, applied: true }));
          b.value = event.result.get('b')!.map((item) => ({ ...item, applied: true }));
        },
      },
    });
    await nextTick();
    await start('a1', at('a', 0));
    await moveTo(at('b', 1, 0.25));
    expect(rows(container, 'b')).toEqual(['b1', 'a1', 'b2']);
    await drop();
    expect(prevented).toBe(true);
    // The library didn't write over it.
    expect(a.value.every((item) => item.applied) && b.value.every((item) => item.applied)).toBe(true);
    expect([ids(a.value), ids(b.value)]).toEqual(['a2,a3', 'b1,a1,b2']);
    expect(rows(container, 'b')).toEqual(['b1', 'a1', 'b2']);
    // The overlay landed on a1 in list b, second row, as the user's update rendered it.
    expect(animations.at(-1)).toMatchObject({ reason: 'drop', to: createRect(300, ROW, 200, ROW) });
  });

  it('in an async onBeforeDrop: the result applied before it resolves lands, nothing else is written', async () => {
    const a = ref(tasks('a1', 'a2', 'a3'));
    const container = mount({
      a: {
        items: a,
        onBeforeDrop: async (event) => {
          event.preventDefault();
          await new Promise((resolve) => setTimeout(resolve, 10));
          a.value = event.result.get('a')!.map((item) => ({ ...item, applied: true }));
          return true;
        },
        onDrop: (event) => expect(event.defaultPrevented).toBe(true),
      },
    });
    await nextTick();
    await start('a3', at('a', 2));
    await moveTo(at('a', 0, 0.25));
    await drop();
    expect(ids(a.value)).toBe('a3,a1,a2');
    expect(a.value.every((item) => item.applied)).toBe(true);
    expect(rows(container, 'a')).toEqual(['a3', 'a1', 'a2']);
    expect(animations.at(-1)).toMatchObject({ reason: 'drop', to: createRect(0, 0, 200, ROW) });
  });

  it('applied nowhere: the lists stay as they were and the overlay flies back', async () => {
    const a = ref(tasks('a1', 'a2', 'a3'));
    const before = a.value;
    const container = mount({ a: { items: a, onBeforeDrop: (event) => event.preventDefault() } });
    await nextTick();
    await start('a1', at('a', 0));
    await moveTo(at('a', 2, 0.75));
    expect(rows(container, 'a')).toEqual(['a2', 'a3', 'a1']);
    await drop();
    expect(a.value).toBe(before);
    expect(rows(container, 'a')).toEqual(['a1', 'a2', 'a3']);
    expect(animations.at(-1)).toMatchObject({ reason: 'drop', to: createRect(0, 0, 200, ROW) });
  });
});

describe('event.result', () => {
  const capture = () => {
    const events: Array<{ phase: 'before' | 'drop'; event: SortableDropEvent<Item> }> = [];
    return {
      events,
      hooks: {
        onBeforeDrop: (event: SortableDropEvent<Item>) => void events.push({ phase: 'before', event }),
        onDrop: (event: SortableDropEvent<Item>) => void events.push({ phase: 'drop', event }),
      },
    };
  };

  it('a move between lists: both lists', async () => {
    const a = ref(tasks('a1', 'a2', 'a3'));
    const b = ref(tasks('b1', 'b2'));
    const { events, hooks } = capture();
    mount({ a: { items: a, group: 'g' }, b: { items: b, group: 'g', ...hooks } });
    await nextTick();
    await start('a2', at('a', 1));
    await moveTo(at('b', 1, 0.75));
    await drop();
    const dropped = events.find((entry) => entry.phase === 'drop')!.event;
    expect(dropped).toMatchObject({ mode: 'move', from: { list: 'a', index: 1 }, to: { list: 'b', index: 2 } });
    expect(resultOf(dropped)).toEqual({ a: 'a1,a3', b: 'b1,b2,a2' });
    expect([ids(a.value), ids(b.value)]).toEqual(['a1,a3', 'b1,b2,a2']);
  });

  it('a copy: the target only, with the copy', async () => {
    const a = ref(tasks('a1', 'a2'));
    const b = ref(tasks('b1'));
    const { events, hooks } = capture();
    mount({
      a: { items: a, group: { name: 'g', pull: 'clone' }, clone: (item) => ({ id: `${item.id}-copy` }) },
      b: { items: b, group: 'g', ...hooks },
    });
    await nextTick();
    await start('a1', at('a', 0));
    await moveTo(at('b', 0, 0.75));
    await drop();
    const dropped = events.at(-1)!.event;
    expect(dropped.mode).toBe('copy');
    expect(resultOf(dropped)).toEqual({ b: 'b1,a1-copy' });
    expect([ids(a.value), ids(b.value)]).toEqual(['a1,a2', 'b1,a1-copy']);
  });

  it('an item created for a plain draggable', async () => {
    const a = ref(tasks('a1', 'a2'));
    const { events, hooks } = capture();
    mount({ a: { items: a, createItem: () => ({ id: 'created' }), ...hooks } });
    await nextTick();
    expect(manager.start('chip', { x: 650, y: 20 }, 'pointer')).toBe(true);
    await nextTick();
    await moveTo(at('a', 1, 0.25));
    await drop();
    const dropped = events.at(-1)!.event;
    expect(dropped.mode).toBe('insert');
    expect(resultOf(dropped)).toEqual({ a: 'a1,created,a2' });
    expect(ids(a.value)).toBe('a1,created,a2');
  });

  it('a partial accept: onBeforeDrop sees the whole drop, onDrop what it took', async () => {
    const a = ref(tasks('a1', 'a2', 'a3'));
    const b = ref(tasks('b1'));
    const { events } = capture();
    mount({
      a: { items: a, group: 'g' },
      b: {
        items: b,
        group: 'g',
        onBeforeDrop: (event) => {
          events.push({ phase: 'before', event });
          return ['a1'];
        },
        onDrop: (event) => void events.push({ phase: 'drop', event }),
      },
    });
    await nextTick();
    await start('a1', at('a', 0), 'a3');
    await moveTo(at('b', 0, 0.75));
    await drop();
    const [before, dropped] = events.map((entry) => entry.event);
    expect(resultOf(before!)).toEqual({ a: 'a2', b: 'b1,a1,a3' });
    expect(dropped).toMatchObject({ accepted: ['a1'], rejected: ['a3'] });
    expect(resultOf(dropped!)).toEqual({ a: 'a2,a3', b: 'b1,a1' });
    expect([ids(a.value), ids(b.value)]).toEqual(['a2,a3', 'b1,a1']);
  });

  it('a swap: both sides, in one list or across two', async () => {
    const a = ref(tasks('a1', 'a2', 'a3'));
    const b = ref(tasks('b1', 'b2', 'b3'));
    const { events, hooks } = capture();
    mount({
      a: { items: a, group: 'g', behavior: 'swap', ...hooks },
      b: { items: b, group: 'g', behavior: 'swap', ...hooks },
    });
    await nextTick();
    await start('a1', at('a', 0));
    await moveTo(at('a', 2));
    await drop();
    expect(resultOf(events.at(-1)!.event)).toEqual({ a: 'a3,a2,a1' });

    await start('a2', at('a', 1));
    await moveTo(at('b', 0));
    await drop();
    const dropped = events.at(-1)!.event;
    expect(dropped).toMatchObject({ mode: 'swap', partner: { key: 'b1', to: { list: 'a', index: 1 } } });
    expect(resultOf(dropped)).toEqual({ a: 'a3,b1,a1', b: 'a2,b2,b3' });
    expect([ids(a.value), ids(b.value)]).toEqual(['a3,b1,a1', 'a2,b2,b3']);
  });

  it('a drop into an item: the list keeps its order; e.source.remove() is in it, and can be prevented', async () => {
    const a = ref(tasks('a1', 'g1', 'a2'));
    const { events, hooks } = capture();
    let prevent = true;
    mount({
      a: {
        items: a,
        onBeforeDrop: hooks.onBeforeDrop,
        onDrop: (event) => {
          hooks.onDrop(event);
          if (prevent) event.preventDefault();
        },
      },
    });
    await nextTick();
    // The middle of g1 (40–80): into it, nothing reorders.
    await start('a1', at('a', 0));
    await moveTo(at('a', 1));
    expect(manager.over.value?.id).toBe('zone:g1');
    await drop();
    // The zone decides, not the list: onDrop only, the items leaving it.
    expect(events.map((entry) => entry.phase)).toEqual(['drop']);
    const dropped = events[0]!.event;
    expect(dropped).toMatchObject({ keys: ['a1'], to: { list: 'a', index: -1 } });
    expect(resultOf(dropped)).toEqual({ a: 'g1,a2' });
    expect(ids(a.value)).toBe('a1,g1,a2');

    prevent = false;
    await start('a1', at('a', 0));
    await moveTo(at('a', 1));
    await drop();
    expect(ids(a.value)).toBe('g1,a2');
  });

  it("dropOutside: 'remove' asks the list the items leave", async () => {
    const a = ref(tasks('a1', 'a2'));
    const { events, hooks } = capture();
    mount({ a: { items: a, dropOutside: 'remove', ...hooks } });
    await nextTick();
    await start('a2', at('a', 1));
    await moveTo({ x: 100, y: 500 });
    await drop();
    expect(events.map((entry) => `${entry.phase}:${resultOf(entry.event).a}:${entry.event.to.index}`)).toEqual([
      'before:a1:-1',
      'drop:a1:-1',
    ]);
    expect(ids(a.value)).toBe('a1');
  });
});

describe('read-only sources', () => {
  it('a computed or getter source is never written: development builds warn', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const store = shallowRef({ a: tasks('a1', 'a2'), b: tasks('b1') });
    const container = mount({
      a: { items: computed(() => store.value.a), group: 'g' },
      // A writable list in the same drop isn't written either: items would be duplicated.
      b: { items: ref(store.value.b), group: 'g' },
    });
    await nextTick();
    await start('a1', at('a', 0));
    await moveTo(at('b', 0, 0.75));
    expect(rows(container, 'b')).toEqual(['b1', 'a1']);
    await drop();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]![0]).toContain('"a"');
    expect([rows(container, 'a'), rows(container, 'b')]).toEqual([['a1', 'a2'], ['b1']]);
    expect(animations.at(-1)).toMatchObject({ to: createRect(0, 0, 200, ROW) });
  });

  it('prevented and applied through the store: no warning, the new order', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const store = shallowRef<Record<string, Item[]>>({ a: tasks('a1', 'a2', 'a3') });
    const apply = (result: ReadonlyMap<Key, Item[]>) => {
      store.value = { ...store.value, ...Object.fromEntries(result) };
    };
    const container = mount({
      a: {
        items: () => store.value.a!,
        onDrop: (event) => {
          event.preventDefault();
          apply(event.result);
        },
      },
    });
    await nextTick();
    await start('a1', at('a', 0));
    await moveTo(at('a', 2, 0.75));
    await drop();
    expect(warn).not.toHaveBeenCalled();
    expect(ids(store.value.a)).toBe('a2,a3,a1');
    expect(rows(container, 'a')).toEqual(['a2', 'a3', 'a1']);
    expect(animations.at(-1)).toMatchObject({ to: createRect(0, 2 * ROW, 200, ROW) });
  });
});
