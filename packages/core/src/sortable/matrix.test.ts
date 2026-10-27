/**
 * Every combination of strategy × placeholder × behavior, dragged by pointer and keyboard,
 * within a list and across two: invariants, not exact positions. Items are never lost or
 * doubled; a sort keeps the others in order, a swap exchanges one pair; the drop event says
 * what happened; a cancel changes nothing.
 */

import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { SortableDropEvent, SortableListOptions } from '../types';
import { containsPoint, createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';

type Strategy = 'vertical' | 'horizontal' | 'grid';
type Item = { id: string };

const W = 80;
const H = 40;
const COLUMNS = 3;
const COUNT = 5;

let manager: DnDManager;
let unmount: (() => void) | null = null;
let data: Record<'a' | 'b', Ref<Item[]>>;
let drops: SortableDropEvent<Item>[];

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('li', { ref: 'el', 'data-id': props.rowId }, props.rowId);
  },
});

/** Where item `index` of list `list` is: lists side by side, or one above the other for rows. */
const cellOf = (strategy: Strategy, list: string, index: number) => {
  if (strategy === 'horizontal') return createRect(index * W, list === 'a' ? 0 : 200, W, H);
  const left = list === 'a' ? 0 : 400;
  if (strategy === 'vertical') return createRect(left, index * H, W, H);
  return createRect(left + (index % COLUMNS) * W, Math.floor(index / COLUMNS) * H, W, H);
};

const listRect = (strategy: Strategy, list: string, count: number) => {
  const n = Math.max(count, 1);
  if (strategy === 'horizontal') return createRect(0, list === 'a' ? 0 : 200, n * W, H);
  const left = list === 'a' ? 0 : 400;
  if (strategy === 'vertical') return createRect(left, 0, W, n * H);
  return createRect(left, 0, COLUMNS * W, Math.ceil(n / COLUMNS) * H);
};

const mount = (options: Partial<SortableListOptions<Item>> & { strategy: Strategy }) => {
  data = {
    a: ref(Array.from({ length: COUNT }, (_, i) => ({ id: `a${i + 1}` }))),
    b: ref(Array.from({ length: COUNT }, (_, i) => ({ id: `b${i + 1}` }))),
  };
  drops = [];
  const List = defineComponent({
    props: { listId: { type: String, required: true } },
    setup(props) {
      const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
        id: props.listId,
        items: data[props.listId as 'a' | 'b'],
        group: 'matrix',
        onDrop: (event) => drops.push(event),
        ...options,
      });
      return () => h('ul', { ref: 'list', 'data-list': props.listId }, items.value.map((item) => h(Row, { key: item.id, rowId: item.id })));
    },
  });
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { dropAnimation: false, animation: false }, {
        default: () => [
          h({ setup: () => ((manager = useManager()), () => null) }),
          h(List, { listId: 'a' }),
          h(List, { listId: 'b' }),
        ],
      }),
  });
  app.mount(container);
  const rectOf = (element: Element) => {
    if (element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
    const list = element.closest('[data-list]');
    if (!list) return createRect(0, 0, 0, 0);
    const id = list.getAttribute('data-list')!;
    if (element === list) return listRect(options.strategy, id, list.children.length);
    return cellOf(options.strategy, id, [...list.children].indexOf(element));
  };
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this) as DOMRect;
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    const candidates = [...container.querySelectorAll('[data-list] > li'), ...container.querySelectorAll('[data-list]')];
    return candidates.find((element) => containsPoint(rectOf(element), { x, y })) ?? null;
  });
  unmount = () => {
    app.unmount();
    container.remove();
  };
};

const center = (strategy: Strategy, list: string, index: number) => {
  const rect = cellOf(strategy, list, index);
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

/** The pointer glides from `from` to `to` in steps, as a hand does. */
const glide = async (from: { x: number; y: number }, to: { x: number; y: number }) => {
  for (let step = 1; step <= 8; step++) {
    manager.move({ x: from.x + ((to.x - from.x) * step) / 8, y: from.y + ((to.y - from.y) * step) / 8 });
    manager.flushFrame();
    await nextTick();
  }
};

const press = async (key: string) => {
  const before = manager.pointer.value;
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  await vi.waitFor(() => expect(manager.pointer.value).not.toBe(before), { timeout: 1000 });
  await nextTick();
};

const settle = async () => {
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  await nextTick();
};

const ids = (list: 'a' | 'b') => data[list].value.map((item) => item.id);
const original = (list: 'a' | 'b') => Array.from({ length: COUNT }, (_, i) => `${list}${i + 1}`);

/** The invariants of any drop: nothing lost or doubled, and the change is a sort or one exchange. */
const expectSound = (behavior: 'sort' | 'swap', dragged: string) => {
  const all = [...ids('a'), ...ids('b')];
  expect([...all].sort()).toEqual([...original('a'), ...original('b')].sort());
  if (!drops.length) {
    expect(ids('a')).toEqual(original('a'));
    expect(ids('b')).toEqual(original('b'));
    return;
  }
  const event = drops.at(-1)!;
  // A single item in lists that swap always exchanges; in lists that sort, it moves.
  expect(event.mode).toBe(behavior === 'swap' ? 'swap' : 'move');
  if (behavior === 'swap') {
    // One exchange: the dragged item and its partner trade places.
    const changed = (['a', 'b'] as const).flatMap((list) =>
      ids(list).flatMap((id, index) => (id === original(list)[index] ? [] : [{ list, index, id }])),
    );
    expect(changed).toHaveLength(2);
    expect(changed.map(({ id }) => id).sort()).toEqual([dragged, event.partner!.key].sort());
  } else {
    // A sort: the others keep their order in each list.
    for (const list of ['a', 'b'] as const) {
      const others = ids(list).filter((id) => id !== dragged);
      expect(others).toEqual(original(list).filter((id) => others.includes(id)));
    }
  }
  // Where the event says the item went is where it is.
  const to = event.to;
  expect(ids(to.list as 'a' | 'b')[to.index]).toBe(dragged);
};

afterEach(() => {
  unmount?.();
  unmount = null;
  vi.restoreAllMocks();
});

const STRATEGIES: Strategy[] = ['vertical', 'horizontal', 'grid'];
const PLACEHOLDERS = ['item', 'indicator'] as const;
const BEHAVIORS = ['sort', 'swap'] as const;

describe.each(STRATEGIES)('%s', (strategy) => {
  describe.each(PLACEHOLDERS)('placeholder: %s', (placeholder) => {
    describe.each(BEHAVIORS)('behavior: %s', (behavior) => {
      const options = { strategy, placeholder, behavior } as const;

      it('pointer, within the list', async () => {
        const errors = vi.spyOn(console, 'error');
        mount(options);
        await nextTick();
        manager.start('a1', center(strategy, 'a', 0), 'pointer');
        await nextTick();
        await glide(center(strategy, 'a', 0), center(strategy, 'a', 3));
        await manager.drop();
        await settle();
        expectSound(behavior, 'a1');
        expect(drops).toHaveLength(1);
        expect(errors).not.toHaveBeenCalled();
      });

      it('pointer, across to the other list', async () => {
        mount(options);
        await nextTick();
        manager.start('a2', center(strategy, 'a', 1), 'pointer');
        await nextTick();
        await glide(center(strategy, 'a', 1), center(strategy, 'b', 2));
        await manager.drop();
        await settle();
        expectSound(behavior, 'a2');
        expect(drops).toHaveLength(1);
        expect(drops[0]!.to.list).toBe('b');
      });

      it('a cancel changes nothing', async () => {
        mount(options);
        await nextTick();
        manager.start('a1', center(strategy, 'a', 0), 'pointer');
        await nextTick();
        await glide(center(strategy, 'a', 0), center(strategy, 'b', 3));
        manager.cancel();
        await settle();
        expect(ids('a')).toEqual(original('a'));
        expect(ids('b')).toEqual(original('b'));
        expect(drops).toHaveLength(0);
      });

      it('keyboard, two steps along the list', async () => {
        mount(options);
        await nextTick();
        manager.start('a1', center(strategy, 'a', 0), 'keyboard');
        await nextTick();
        const key = strategy === 'vertical' ? 'ArrowDown' : 'ArrowRight';
        await press(key);
        await press(key);
        await manager.drop();
        await settle();
        expectSound(behavior, 'a1');
        expect(drops).toHaveLength(1);
        expect(ids('a').indexOf('a1')).toBeGreaterThan(0);
      });
    });
  });
});
