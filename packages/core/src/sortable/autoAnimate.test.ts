import {
  createApp,
  defineComponent,
  h,
  nextTick,
  ref,
  shallowRef,
  useTemplateRef,
  type PropType,
  type Ref,
} from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  AutoAnimation,
  EnterAnimationContext,
  Key,
  LayoutAnimationContext,
  LeaveAnimationContext,
  SortableListOptions,
} from '../types';
import { containsPoint, createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';
import { makeSortableTree } from './makeSortableTree';

// `animate` (rfcs/0001-v3.md §8): changes of `items` that no drag made animate. Off by default.

type Item = { id: string; children?: Item[] };

const ROW = 40;
/** Left edge of each list: side by side, 300px apart; rows stack 40px high from the top. */
const LEFT: Record<string, number> = { a: 0, b: 300 };

let manager: DnDManager;
let data: Record<string, Ref<Item[]>>;
const mounted: Array<() => void> = [];

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
    options: { type: Object as PropType<Partial<SortableListOptions<Item>>>, default: () => ({}) },
    /** Rows rendered, as a virtual list would: the first ones. */
    shown: { type: Number, default: Infinity },
  },
  setup(props) {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
      id: props.listId,
      items: data[props.listId]!,
      group: 'auto',
      ...props.options,
    });
    return () =>
      h(
        'ul',
        { ref: 'list', 'data-list': props.listId },
        items.value.slice(0, props.shown).map((item) => h(Row, { key: item.id, rowId: item.id })),
      );
  },
});

const Tree = defineComponent({
  props: { collapsed: { type: Object as PropType<Ref<Set<Key>>>, required: true } },
  setup(props) {
    const { items } = makeSortableTree(useTemplateRef<HTMLElement>('list'), {
      id: 'a',
      items: data.a!,
      collapsed: props.collapsed,
      animate: true,
    });
    return () => h('ul', { ref: 'list', 'data-list': 'a' }, items.value.map((row) => h(Row, { key: row.key, rowId: String(row.key) })));
  },
});

/**
 * The layout happy-dom doesn't have: rows stack from the top of their list. A leaving copy
 * sits where its `left`/`top` put it, as in a containing block at the page's origin.
 */
const rectOf = (element: Element) => {
  const list = element.closest('[data-list]');
  if (!list || element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
  if (element.hasAttribute('data-dnd-leaving')) {
    const { left, top, width, height } = (element as HTMLElement).style;
    return createRect(parseFloat(left), parseFloat(top), parseFloat(width), parseFloat(height));
  }
  const left = LEFT[list.getAttribute('data-list')!]!;
  const rows = [...list.children].filter((row) => !row.hasAttribute('data-dnd-leaving'));
  if (element === list) return createRect(left, 0, 200, rows.length * ROW);
  return createRect(left, rows.indexOf(element) * ROW, 200, ROW);
};

let rectReads = 0;

const mount = (lists: Record<string, Record<string, unknown>>, provider: Record<string, unknown> = {}) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { dropAnimation: false, ...provider }, {
        default: () => [
          h({
            setup() {
              manager = useManager();
              return () => null;
            },
          }),
          ...Object.entries(lists).map(([id, props]) => (id === 'tree' ? h(Tree, props as never) : h(List, { listId: id, ...props }))),
        ],
      }),
  });
  app.mount(container);
  mounted.push(() => {
    app.unmount();
    container.remove();
  });
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    rectReads++;
    return rectOf(this) as DOMRect;
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    const candidates = [...container.querySelectorAll('[data-list] > li'), ...container.querySelectorAll('[data-list]')];
    return candidates.find((element) => containsPoint(rectOf(element), { x, y })) ?? null;
  });
  return container;
};

interface Played {
  element: Element;
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
  finish(): void;
}
const played: Played[] = [];

const stubAnimate = () =>
  vi.spyOn(Element.prototype, 'animate').mockImplementation(function (this: Element, keyframes, options) {
    let resolve!: () => void;
    const finished = new Promise<void>((done) => (resolve = done));
    const animation = {
      playState: 'running',
      cancel: () => (animation.playState = 'idle'),
      addEventListener() {},
      finished,
    };
    played.push({
      element: this,
      keyframes: keyframes as Keyframe[],
      options: options as KeyframeAnimationOptions,
      finish: () => {
        animation.playState = 'finished';
        resolve();
      },
    });
    return animation as unknown as Animation;
  });

const ids = (...keys: string[]) => keys.map((id) => ({ id }));
/** Animations played on the row (or the leaving copy) `id`. */
const on = (id: string) => played.filter(({ element }) => element.getAttribute('data-id') === id);
const ghost = (container: HTMLElement) => container.querySelector<HTMLElement>('[data-dnd-leaving]');
/** Lets the post-flush pass run, and promises settle. */
const flush = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve));
};

describe('animate: changes no drag made', () => {
  beforeEach(() => {
    data = { a: ref(ids('a1', 'a2', 'a3')), b: ref(ids('b1', 'b2')) };
    rectReads = 0;
  });

  afterEach(() => {
    mounted.splice(0).forEach((unmount) => unmount());
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    played.length = 0;
  });

  it('is off by default: nothing is measured or animated', async () => {
    const container = mount({ a: {} });
    stubAnimate();
    rectReads = 0;
    data.a!.value = ids('a3', 'a2', 'a4');
    await flush();
    expect(rectReads).toBe(0);
    expect(played).toEqual([]);
    expect(ghost(container)).toBeNull();
  });

  it('moves items to their new places from where they were', async () => {
    mount({ a: { options: { animate: true } } });
    stubAnimate();
    data.a!.value = ids('a3', 'a2', 'a1');
    await flush();
    expect(on('a1').map(({ keyframes }) => keyframes)).toEqual([[{ translate: '0px -80px' }, { translate: '0px 0px' }]]);
    expect(on('a3').map(({ keyframes }) => keyframes)).toEqual([[{ translate: '0px 80px' }, { translate: '0px 0px' }]]);
    expect(on('a2')).toEqual([]);
  });

  it('fades in an item that appears', async () => {
    mount({ a: { options: { animate: true } } });
    stubAnimate();
    data.a!.value = ids('a1', 'a4', 'a2', 'a3');
    await flush();
    expect(on('a4').map(({ keyframes }) => keyframes)).toEqual([[{ opacity: 0 }, { opacity: 1 }]]);
    // The ones below made room.
    expect(on('a2')[0]!.keyframes).toEqual([{ translate: '0px -40px' }, { translate: '0px 0px' }]);
  });

  it('a copy of a removed item fades out where it was, then goes', async () => {
    const container = mount({ a: { options: { animate: true } } });
    stubAnimate();
    data.a!.value = ids('a2', 'a3');
    await flush();
    const copy = ghost(container)!;
    expect(copy.getAttribute('data-id')).toBe('a1');
    expect(copy.parentElement?.getAttribute('data-list')).toBe('a');
    expect(copy.hasAttribute('inert')).toBe(true);
    expect(copy.style.getPropertyValue('position')).toBe('absolute');
    expect(copy.style.getPropertyPriority('position')).toBe('important');
    // Placed over a1's old row.
    expect(copy.getBoundingClientRect()).toMatchObject({ left: 0, top: 0, width: 200, height: 40 });
    expect(on('a2')[0]!.keyframes).toEqual([{ translate: '0px 40px' }, { translate: '0px 0px' }]);
    const exit = played.find(({ element }) => element === copy)!;
    expect(exit.keyframes.at(-1)).toMatchObject({ opacity: 0 });
    exit.finish();
    await flush();
    expect(ghost(container)).toBeNull();
  });

  it('custom functions per kind get the element, the rects and the options, and say when they end', async () => {
    let leaveDone!: () => void;
    const move = vi.fn<(context: LayoutAnimationContext) => void>();
    const enter = vi.fn<(context: EnterAnimationContext) => void>();
    const leave = vi.fn((_context: LeaveAnimationContext) => new Promise<void>((resolve) => (leaveDone = resolve)));
    const container = mount({ a: { options: { animate: { duration: 300, move, enter, leave } } } });
    stubAnimate();
    data.a!.value = ids('a3', 'a4', 'a2');
    await flush();

    expect(move).toHaveBeenCalledTimes(2);
    const moved = move.mock.calls.find(([context]) => context.key === 'a3')![0];
    expect(moved).toMatchObject({
      from: { left: 0, top: 80 },
      to: { left: 0, top: 0 },
      options: { duration: 300, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' },
      reason: 'change',
    });
    expect(moved.element.getAttribute('data-id')).toBe('a3');
    expect(moved.signal.aborted).toBe(false);

    expect(enter).toHaveBeenCalledTimes(1);
    expect(enter.mock.calls[0]![0]).toMatchObject({ key: 'a4', to: { top: 40 }, options: { duration: 300 } });

    expect(leave).toHaveBeenCalledTimes(1);
    const left = leave.mock.calls[0]![0];
    expect(left).toMatchObject({ key: 'a1', from: { left: 0, top: 0, width: 200, height: 40 } });
    expect(left.element).toBe(ghost(container));
    // The library played nothing of its own.
    expect(played).toEqual([]);
    // The copy stays until the promise settles.
    await flush();
    expect(ghost(container)).not.toBeNull();
    leaveDone();
    await flush();
    expect(ghost(container)).toBeNull();
  });

  it('an interrupted custom move is aborted, and the next one starts where the item was shown', async () => {
    const signals: AbortSignal[] = [];
    const move = vi.fn(({ signal }: LayoutAnimationContext) => {
      signals.push(signal);
      return new Promise<void>(() => {});
    });
    mount({ a: { options: { animate: { move } } } });
    stubAnimate();
    data.a!.value = ids('a2', 'a1', 'a3');
    await flush();
    expect(signals.map((signal) => signal.aborted)).toEqual([false, false]);
    data.a!.value = ids('a2', 'a3', 'a1');
    await flush();
    // The layout is read with no custom animation running: their offsets can't be told apart.
    expect(signals.slice(0, 2).map((signal) => signal.aborted)).toEqual([true, true]);
    expect(signals.slice(2).map((signal) => signal.aborted)).toEqual([false, false]);
    const again = move.mock.calls.map(([context]) => context).find((context) => context.signal === signals[2])!;
    expect(again).toMatchObject({ key: 'a1', from: { top: 40 }, to: { top: 80 } });
  });

  it('`false` turns one kind off', async () => {
    const container = mount({ a: { options: { animate: { leave: false } } } });
    stubAnimate();
    data.a!.value = ids('a2', 'a3');
    await flush();
    expect(ghost(container)).toBeNull();
    expect(on('a2')).toHaveLength(1);
  });

  it('reduced motion turns it off, custom functions included', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
    const move = vi.fn();
    const container = mount({ a: { options: { animate: { move } } } });
    stubAnimate();
    rectReads = 0;
    data.a!.value = ids('a3', 'a2');
    await flush();
    expect(move).not.toHaveBeenCalled();
    expect(played).toEqual([]);
    expect(ghost(container)).toBeNull();
    expect(rectReads).toBe(0);
  });

  it("the provider's `animate` is the default; a list's own wins; a ref turns it on and off", async () => {
    const own = shallowRef<AutoAnimation>(false);
    mount({ a: {}, b: { options: { animate: own } } }, { animate: true });
    stubAnimate();
    data.a!.value = ids('a2', 'a1', 'a3');
    data.b!.value = ids('b2', 'b1');
    await flush();
    expect(on('a1')).toHaveLength(1);
    expect(on('b1')).toEqual([]);
    own.value = true;
    await flush();
    data.b!.value = ids('b1', 'b2');
    await flush();
    expect(on('b1')).toHaveLength(1);
  });

  it('an item moved to another list of the group slides there', async () => {
    mount({ a: { options: { animate: true } }, b: { options: { animate: true } } });
    stubAnimate();
    data.a!.value = ids('a2', 'a3');
    data.b!.value = ids('a1', 'b1', 'b2');
    await flush();
    expect(on('a1').map(({ keyframes }) => keyframes)).toEqual([[{ translate: '-300px 0px' }, { translate: '0px 0px' }]]);
    expect(on('b1')[0]!.keyframes).toEqual([{ translate: '0px -40px' }, { translate: '0px 0px' }]);
  });

  it("rows a virtual list doesn't render are skipped", async () => {
    data.a!.value = ids('a1', 'a2', 'a3', 'a4', 'a5');
    const container = mount({ a: { options: { animate: true }, shown: 3 } });
    stubAnimate();
    // a5 (not rendered) leaves, a4 comes into view as a1 leaves: neither is new.
    data.a!.value = ids('a2', 'a3', 'a4');
    await flush();
    expect(ghost(container)?.getAttribute('data-id')).toBe('a1');
    expect(container.querySelectorAll('[data-dnd-leaving]')).toHaveLength(1);
    expect(on('a4')).toEqual([]);
  });

  it('drags keep their own animations, their drop included', async () => {
    const move = vi.fn();
    const animation = vi.fn();
    mount({ a: { options: { animate: { move }, animation } } });
    stubAnimate();
    expect(manager.start('a1', { x: 100, y: 10 }, 'pointer')).toBe(true);
    await nextTick();
    manager.move({ x: 100, y: 70 });
    manager.flushFrame();
    await nextTick();
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    await flush();
    expect(data.a!.value.map((item) => item.id)).toEqual(['a2', 'a1', 'a3']);
    expect(animation).toHaveBeenCalled();
    expect(animation.mock.calls.every(([context]) => (context as LayoutAnimationContext).reason === 'drag')).toBe(true);
    expect(move).not.toHaveBeenCalled();
  });

  it("a drop's render stays the drag's: items a `'stack'` multi-drag brings back still fly out of the overlay", async () => {
    mount({ a: { options: { animate: true, multiple: 'stack' } } });
    stubAnimate();
    manager.selection.add('a1');
    manager.selection.add('a3');
    expect(manager.start('a1', { x: 100, y: 10 }, 'pointer')).toBe(true);
    await nextTick();
    manager.move({ x: 100, y: 30 });
    manager.flushFrame();
    await nextTick();
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    await flush();
    // The row itself, not the clone that flew into the overlay at pickup.
    const back = on('a3')
      .filter(({ element }) => element.closest('[data-list]'))
      .map(({ keyframes }) => keyframes);
    expect(back.some((frames) => 'translate' in frames[0]!)).toBe(true);
    expect(back).toContainEqual([{ opacity: 0 }, { opacity: 1 }]);
  });

  it('trees: the rows a node hides as it collapses leave, the rows it shows enter', async () => {
    data.a!.value = [{ id: 'f', children: ids('f1', 'f2') }, { id: 'g' }];
    const collapsed = ref(new Set<Key>());
    const container = mount({ tree: { collapsed } });
    stubAnimate();
    collapsed.value = new Set(['f']);
    await flush();
    expect([...container.querySelectorAll('[data-dnd-leaving]')].map((row) => row.getAttribute('data-id'))).toEqual(['f1', 'f2']);
    expect(on('g')[0]!.keyframes).toEqual([{ translate: '0px 80px' }, { translate: '0px 0px' }]);
    played.length = 0;
    collapsed.value = new Set();
    await flush();
    expect(on('f1').filter(({ element }) => !element.hasAttribute('data-dnd-leaving'))[0]!.keyframes).toEqual([
      { opacity: 0 },
      { opacity: 1 },
    ]);
  });
});
