import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { containsPoint, createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';

// FLIP during a drag looks only at the items near the visible area (rfcs/0001-v3.md §8):
// far ones just move, and a pass doesn't even read their elements.

type Item = { id: string };

const ROW = 20;
/** Top of each list. happy-dom's viewport is 768px tall: FLIP's margin reaches 768px past it. */
const top: Record<string, number> = {};

let manager: DnDManager;
let data: Record<string, Ref<Item[]>>;
/** How often each item's element was looked up. */
const lookups = new Map<string, number>();
const mounted: Array<() => void> = [];

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    const el = useTemplateRef<HTMLElement>('el');
    const lookUp = () => {
      lookups.set(props.rowId, (lookups.get(props.rowId) ?? 0) + 1);
      return el.value;
    };
    makeSortableItem(lookUp, { id: () => props.rowId });
    return () => h('li', { ref: 'el', 'data-id': props.rowId }, props.rowId);
  },
});

const List = defineComponent({
  props: { listId: { type: String, required: true } },
  setup(props) {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
      id: props.listId,
      items: data[props.listId]!,
      group: 'flip',
    });
    return () =>
      h('ul', { ref: 'list', 'data-list': props.listId }, items.value.map((item) => h(Row, { key: item.id, rowId: item.id })));
  },
});

/** The layout happy-dom doesn't have: rows stack from the top of their list. */
const rectOf = (element: Element) => {
  const list = element.closest('[data-list]');
  if (!list || element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
  const start = top[list.getAttribute('data-list')!]!;
  if (element === list) return createRect(0, start, 200, list.children.length * ROW);
  return createRect(0, start + [...list.children].indexOf(element) * ROW, 200, ROW);
};

const rows = (prefix: string, count: number) => Array.from({ length: count }, (_, index) => ({ id: `${prefix}${index}` }));

/** Lists of `sizes` rows starting at `tops`, in one group. */
const mount = (sizes: Record<string, number>, tops: Record<string, number>) => {
  Object.assign(top, tops);
  data = Object.fromEntries(Object.entries(sizes).map(([id, count]) => [id, ref(rows(id, count))]));
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { dropAnimation: false }, {
        default: () => [
          h({
            setup() {
              manager = useManager();
              return () => null;
            },
          }),
          ...Object.keys(sizes).map((id) => h(List, { listId: id })),
        ],
      }),
  });
  app.mount(container);
  mounted.push(() => {
    app.unmount();
    container.remove();
  });
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this) as DOMRect;
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    const candidates = [...container.querySelectorAll('[data-list] > li'), ...container.querySelectorAll('[data-list]')];
    return candidates.find((element) => containsPoint(rectOf(element), { x, y })) ?? null;
  });
  return container;
};

/** Every `animate()` call: the element and its keyframes. */
const animations: Array<{ element: Element; keyframes: unknown }> = [];

const stubAnimate = () =>
  vi.spyOn(Element.prototype, 'animate').mockImplementation(function (this: Element, keyframes) {
    animations.push({ element: this, keyframes });
    return {
      playState: 'running',
      cancel() {},
      addEventListener() {},
      finished: new Promise(() => {}),
    } as unknown as Animation;
  });

/** A point in row `index` of `list`: past its middle going down, before it going up. */
const down = (list: string, index: number) => ({ x: 100, y: top[list]! + (index + 0.8) * ROW });
const up = (list: string, index: number) => ({ x: 100, y: top[list]! + (index + 0.2) * ROW });
const moveTo = async (point: { x: number; y: number }) => {
  manager.move(point);
  manager.flushFrame();
  await nextTick();
};
/** Rows of `list` as rendered. */
const order = (list: string) =>
  [...document.querySelectorAll(`[data-list="${list}"] > li`)].map((row) => row.getAttribute('data-id'));
/** Ids whose elements were looked up, of `ids`. */
const lookedUp = (ids: string[]) => ids.filter((id) => lookups.has(id));
const animated = (id: string) => animations.some(({ element }) => element.getAttribute('data-id') === id);
const ofList = (list: string, from: number, to: number) => rows(list, to).slice(from).map((row) => row.id);

describe('FLIP looks only at items near the visible area', () => {
  afterEach(() => {
    mounted.splice(0).forEach((unmount) => unmount());
    vi.restoreAllMocks();
    animations.length = 0;
    lookups.clear();
  });

  it("a pass doesn't read the elements of far items; near ones still animate", async () => {
    // `a` on screen; `b` far below, past the margin.
    mount({ a: 20, b: 20 }, { a: 0, b: 3000 });
    stubAnimate();
    expect(manager.start('a0', up('a', 0), 'pointer')).toBe(true);
    await nextTick();
    lookups.clear();

    for (const point of [down('a', 3), up('a', 1), down('a', 4), up('a', 2)]) await moveTo(point);
    expect(order('a').slice(0, 5)).toEqual(['a1', 'a2', 'a0', 'a3', 'a4']);
    expect(lookedUp(ofList('b', 0, 20))).toEqual([]);
    // a0 went down past a1–a4 and back: they slid along.
    expect(['a1', 'a2', 'a3', 'a4'].every(animated)).toBe(true);
    expect(ofList('b', 0, 20).some(animated)).toBe(false);
  });

  it('a list that moved into view is scanned again', async () => {
    mount({ a: 20, b: 20 }, { a: 0, b: 3000 });
    stubAnimate();
    manager.start('a0', up('a', 0), 'pointer');
    await nextTick();
    await moveTo(down('a', 3));
    lookups.clear();

    // The page scrolled: `b` is right below `a` now.
    top.b = 420;
    await moveTo(up('a', 1));
    expect(order('a').slice(0, 2)).toEqual(['a1', 'a0']);
    expect(lookedUp(ofList('b', 0, 20))).toHaveLength(20);
  });

  it('once the drafts may have carried far items into view, a pass scans every item', async () => {
    // `b` from 1000px down: its first 27 rows are within the margin (1536px), 73 are far.
    mount({ a: 10, b: 100 }, { a: 0, b: 1000 });
    stubAnimate();
    manager.start('a0', up('a', 0), 'pointer');
    await nextTick();
    lookups.clear();

    // Four passes of one slot each stay within half the margin (27 near rows / 6)...
    for (const point of [down('a', 3), up('a', 1), down('a', 3), up('a', 1)]) await moveTo(point);
    expect(lookedUp(ofList('b', 27, 100))).toEqual([]);
    expect(lookedUp(ofList('b', 0, 27))).toHaveLength(27);
    // ...the fifth looks at every item again.
    await moveTo(down('a', 3));
    expect(lookedUp(ofList('b', 27, 100))).toHaveLength(73);
  });

  it('the drop scans every item, and far items land without animating', async () => {
    mount({ a: 20, b: 20 }, { a: 0, b: 3000 });
    stubAnimate();
    manager.start('a0', up('a', 0), 'pointer');
    await nextTick();
    await moveTo(down('a', 3));
    animations.length = 0;
    lookups.clear();
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(data.a!.value.slice(0, 4).map((item) => item.id)).toEqual(['a1', 'a2', 'a3', 'a0']);
    expect(lookedUp(ofList('b', 0, 20))).toHaveLength(20);
    expect(ofList('b', 0, 20).some(animated)).toBe(false);
  });
});
