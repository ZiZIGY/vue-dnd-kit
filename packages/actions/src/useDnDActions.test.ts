import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type PropType, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DnDProvider,
  makeDraggable,
  makeDroppable,
  makeSortableItem,
  makeSortableList,
  useDnD,
  type DnDState,
  type SortableListOptions,
} from '@vue-dnd-kit/core';
import { useDnDActions, type DnDActions } from './index';

/**
 * Lists `a`, `b` and `c` sit side by side, 300px apart, with 40px rows (happy-dom has no
 * layout: rects and hit tests are mocked). The plain draggable `chip` and the drop target
 * `zone` sit below them.
 */

type Item = { id: string };

const ROW = 40;
const LEFT: Record<string, number> = { a: 0, b: 300, c: 600 };

let actions: DnDActions;
let otherActions: DnDActions;
let dnd: DnDState;
let unmount: (() => void) | null = null;

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId, disabled: () => props.rowId.endsWith('!') });
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

const Extras = defineComponent({
  props: { onZoneDrop: { type: Function as PropType<(id: unknown) => void>, required: true } },
  setup(props) {
    makeDraggable(useTemplateRef<HTMLElement>('chip'), { id: 'chip' });
    makeDroppable(useTemplateRef<HTMLElement>('zone'), { id: 'zone', onDrop: (event) => props.onZoneDrop(event.active.id) });
    return () => [h('span', { ref: 'chip', 'data-chip': '' }, 'chip'), h('div', { ref: 'zone', 'data-zone': '' }, 'zone')];
  },
});

const rectOf = (element: Element) => {
  if (element.closest('[data-dnd-overlay]')) return new DOMRect(0, 0, 0, 0);
  if (element.hasAttribute('data-chip')) return new DOMRect(0, 400, 100, ROW);
  if (element.hasAttribute('data-zone')) return new DOMRect(300, 400, 200, 200);
  const list = element.closest('[data-list]');
  if (!list) return new DOMRect(0, 0, 0, 0);
  const left = LEFT[list.getAttribute('data-list')!]!;
  if (element === list) return new DOMRect(left, 0, 200, Math.max(list.children.length, 1) * ROW);
  return new DOMRect(left, [...list.children].indexOf(element) * ROW, 200, ROW);
};

const contains = (rect: DOMRect, x: number, y: number) => x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;

const mount = (lists: Record<string, SortableListOptions<Item>>, onZoneDrop: (id: unknown) => void = () => {}) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { animation: false, dropAnimation: false }, {
        default: () => [
          h({
            setup() {
              actions = useDnDActions();
              dnd = useDnD();
              return () => null;
            },
          }),
          h({
            setup() {
              // Another component of the same provider, like a row with its own buttons.
              otherActions = useDnDActions();
              return () => null;
            },
          }),
          ...Object.entries(lists).map(([id, options]) => h(List, { listId: id, options })),
          h(Extras, { onZoneDrop }),
        ],
      }),
  });
  app.mount(container);
  unmount = () => {
    app.unmount();
    container.remove();
  };
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this);
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    const candidates = [
      ...container.querySelectorAll('[data-list] > li'),
      ...container.querySelectorAll('[data-list], [data-zone]'),
    ];
    return candidates.find((element) => contains(rectOf(element), x, y)) ?? null;
  });
  return container;
};

const tasks = (...keys: string[]) => keys.map((id): Item => ({ id }));
const ids = (items: Ref<Item[]>) => items.value.map((item) => item.id).join(',');
const settle = () => vi.waitFor(() => expect(dnd.status.value).toBe('idle'));

afterEach(() => {
  unmount?.();
  unmount = null;
  vi.restoreAllMocks();
});

describe('moveItem', () => {
  it('moves an item within its list: up, to the top, to the end', async () => {
    const a = ref(tasks('a1', 'a2', 'a3', 'a4'));
    mount({ a: { items: a } });
    await nextTick();
    expect(await actions.moveItem('a3', { index: 1 })).toBe(true);
    expect(ids(a)).toBe('a1,a3,a2,a4');
    expect(await actions.moveItem('a4', { index: 0 })).toBe(true);
    expect(ids(a)).toBe('a4,a1,a3,a2');
    expect(await actions.moveItem('a4', {})).toBe(true);
    expect(ids(a)).toBe('a1,a3,a2,a4');
  });

  it('into another list, through the whole drop pipeline', async () => {
    const a = ref(tasks('a1', 'a2'));
    const b = ref(tasks('b1', 'b2'));
    const seen: string[] = [];
    mount({
      a: { items: a, group: 'g' },
      b: {
        items: b,
        group: 'g',
        onBeforeDrop: (event) => void seen.push(`before:${event.from.list}>${event.to.list}:${event.to.index}`),
        onDrop: (event) => {
          seen.push(`drop:${event.result.get('b')!.map((item) => item.id).join(',')}`);
          // The user applies the result: nothing is written for them.
          event.preventDefault();
          b.value = [...event.result.get('b')!];
        },
      },
    });
    await nextTick();
    expect(await actions.moveItem('a1', { list: 'b', index: 1 })).toBe(true);
    expect(seen).toEqual(['before:a>b:1', 'drop:b1,a1,b2']);
    expect(ids(b)).toBe('b1,a1,b2');
    // Prevented: only what the user applied changed.
    expect(ids(a)).toBe('a1,a2');
  });

  it('resolves false when no list takes the item there, or the drop is refused', async () => {
    const a = ref(tasks('a1', 'a2', 'a!'));
    const b = ref(tasks('b1'));
    const c = ref(tasks('c1'));
    mount({
      a: { items: a, group: 'g' },
      b: { items: b, group: { name: 'g', put: false } },
      c: { items: c, group: 'g', onBeforeDrop: () => false },
    });
    await nextTick();
    expect(await actions.moveItem('a1', { list: 'b' })).toBe(false);
    expect(await actions.moveItem('a1', { list: 'nowhere' })).toBe(false);
    expect(await actions.moveItem('a1', { list: 'c' })).toBe(false);
    // Disabled, or not rendered.
    expect(await actions.moveItem('a!', { index: 0 })).toBe(false);
    expect(await actions.moveItem('ghost', { index: 0 })).toBe(false);
    expect([ids(a), ids(b), ids(c)]).toEqual(['a1,a2,a!', 'b1', 'c1']);
    await settle();
  });

  it('calls run one after another, each once the provider is idle', async () => {
    const a = ref(tasks('a1', 'a2', 'a3'));
    mount({ a: { items: a } });
    await nextTick();
    // From two components of the provider: they don't race for it.
    const first = actions.moveItem('a3', { index: 0 });
    const second = otherActions.moveItem('a1', { index: 2 });
    const third = actions.moveItem('a2', { index: 0 });
    expect(await Promise.all([first, second, third])).toEqual([true, true, true]);
    expect(ids(a)).toBe('a2,a3,a1');
    await actions.moveItem('a3', { index: 1 });
    await actions.moveItem('a2', { index: 1 });
    expect(ids(a)).toBe('a3,a2,a1');

    // A drag of the user: the move waits for it to end.
    const drag = actions.startDrag('a2')!;
    let moved = false;
    const waiting = actions.moveItem('a2', { index: 0 }).then((result) => (moved = result));
    await nextTick();
    expect(moved).toBe(false);
    drag.cancel();
    expect(await waiting).toBe(true);
    expect(ids(a)).toBe('a2,a3,a1');
  });
});

describe('startDrag', () => {
  it('pointer drags follow points: the list sorts under them, and the drop writes it', async () => {
    const a = ref(tasks('a1', 'a2'));
    const b = ref(tasks('b1', 'b2'));
    mount({ a: { items: a, group: 'g' }, b: { items: b, group: 'g' } });
    await nextTick();
    const drag = actions.startDrag('a1')!;
    expect(drag.type).toBe('pointer');
    expect(dnd.active.value?.sensor).toBe('pointer');
    // Over the upper half of b2: the item goes before it.
    expect(await drag.moveTo({ x: 400, y: ROW * 1.25 })).toBe(true);
    expect(dnd.over.value?.id).toBe('b');
    expect(await drag.drop()).toBe(true);
    expect(drag.state).toBe('ended');
    expect([ids(a), ids(b)]).toEqual(['a2', 'b1,a1,b2']);
  });

  it('list positions and arrow steps; a cancel puts everything back', async () => {
    const a = ref(tasks('a1', 'a2', 'a3'));
    const b = ref(tasks('b1'));
    const container = mount({ a: { items: a, group: 'g' }, b: { items: b, group: 'g' } });
    await nextTick();
    const drag = actions.startDrag('a1', { type: 'keyboard' })!;
    await drag.step('down');
    await drag.step('down');
    const rows = () => [...container.querySelectorAll('[data-list="a"] > li')].map((row) => row.getAttribute('data-id')).join(',');
    expect(rows()).toBe('a2,a3,a1');
    expect(await drag.moveTo({ list: 'b', index: 0 })).toBe(true);
    expect(await drag.moveTo({ list: 'nowhere' })).toBe(false);
    drag.cancel();
    await settle();
    expect([ids(a), ids(b)]).toEqual(['a1,a2,a3', 'b1']);
    // Ended: further calls do nothing.
    expect(await drag.moveTo({ x: 0, y: 0 })).toBe(false);
    expect(await drag.drop()).toBe(false);
  });

  it('onto an element: a plain draggable dropped on a zone', async () => {
    const onZoneDrop = vi.fn();
    const container = mount({ a: { items: ref(tasks('a1')) } }, onZoneDrop);
    await nextTick();
    const drag = actions.startDrag('chip')!;
    expect(await drag.moveTo(container.querySelector('[data-zone]')!)).toBe(true);
    expect(dnd.over.value?.id).toBe('zone');
    expect(await drag.drop()).toBe(true);
    expect(onZoneDrop).toHaveBeenCalledWith('chip');
  });

  it('one drag at a time', async () => {
    mount({ a: { items: ref(tasks('a1', 'a2')) } });
    await nextTick();
    const drag = actions.startDrag('a1')!;
    expect(actions.startDrag('a2')).toBeNull();
    drag.cancel();
    await settle();
    expect(actions.startDrag('a2')).not.toBeNull();
  });
});

describe('outside a provider', () => {
  it('throws like every composable of the core', () => {
    const app = createApp({
      setup() {
        useDnDActions();
        return () => null;
      },
    });
    const errors = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => app.mount(document.createElement('div'))).toThrow(/DnDProvider/);
    errors.mockRestore();
  });
});
