import { createApp, defineComponent, h, nextTick, ref, shallowRef, useTemplateRef, type PropType, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ActivationOptions, LayoutAnimation, SortableItemOptions, SortableListOptions } from '../types';
import { containsPoint, createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';

// List options given as a ref or a getter are read when the list needs them: a change
// made between two drags applies to the second one.

type Item = { id: string };

const ROW = 40;
/** Left edge of each list: `a` and `b` side by side, 200px wide, 40px rows. */
const LEFT: Record<string, number> = { a: 0, b: 300 };

let manager: DnDManager;
let data: Record<string, Ref<Item[]>>;
const mounted: Array<() => void> = [];

const Row = defineComponent({
  props: {
    rowId: { type: String, required: true },
    options: { type: Object as PropType<Partial<SortableItemOptions>>, default: () => ({}) },
  },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId, ...props.options });
    return () => h('li', { ref: 'el', 'data-id': props.rowId }, props.rowId);
  },
});

const List = defineComponent({
  props: {
    listId: { type: String, required: true },
    options: { type: Object as PropType<Partial<SortableListOptions<Item>>>, default: () => ({}) },
    rows: { type: Object as PropType<Partial<SortableItemOptions>>, default: () => ({}) },
  },
  setup(props) {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
      id: props.listId,
      items: data[props.listId]!,
      group: 'pair',
      ...props.options,
    });
    return () =>
      h(
        'ul',
        { ref: 'list', 'data-list': props.listId },
        items.value.map((item) => h(Row, { key: item.id, rowId: item.id, options: props.rows })),
      );
  },
});

/** The layout happy-dom doesn't have: rows stack from the top of their list. */
const rectOf = (element: Element) => {
  const list = element.closest('[data-list]');
  if (!list || element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
  const left = LEFT[list.getAttribute('data-list')!]!;
  if (element === list) return createRect(left, 0, 200, list.children.length * ROW);
  return createRect(left, [...list.children].indexOf(element) * ROW, 200, ROW);
};

const mountPair = (
  a: Partial<SortableListOptions<Item>> = {},
  b: Partial<SortableListOptions<Item>> = {},
  provider: Record<string, unknown> = {},
  rows: Partial<SortableItemOptions> = {},
) => {
  data = { a: ref(['a1', 'a2', 'a3'].map((id) => ({ id }))), b: ref(['b1', 'b2', 'b3'].map((id) => ({ id }))) };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { dropAnimation: false, animation: false, ...provider }, {
        default: () => [
          h({
            setup() {
              manager = useManager();
              return () => null;
            },
          }),
          h(List, { listId: 'a', options: a, rows }),
          h(List, { listId: 'b', options: b }),
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

const keys = (container: HTMLElement, list: string) =>
  [...container.querySelectorAll(`[data-list="${list}"] > li`)].map((row) => row.getAttribute('data-id'));
const at = (list: string, index: number) => ({ x: LEFT[list]! + 100, y: index * ROW + ROW / 2 });

/** Selects `ids` and picks the first one up where it is. */
const pickUp = async (...ids: string[]) => {
  manager.selection.clear();
  if (ids.length > 1) for (const id of ids) manager.selection.add(id);
  expect(manager.start(ids[0]!, at(ids[0]![0]!, Number(ids[0]![1]) - 1), 'pointer')).toBe(true);
  await nextTick();
};
const moveTo = async (point: { x: number; y: number }) => {
  manager.move(point);
  manager.flushFrame();
  await nextTick();
};
const cancel = async () => {
  manager.cancel();
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  await nextTick();
};
const drop = async () => {
  await manager.drop();
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  await nextTick();
};

describe('makeSortableList options are read when needed', () => {
  afterEach(() => {
    mounted.splice(0).forEach((unmount) => unmount());
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  /** Drags a1 past the middle of a3's row and returns list `a` as it is shown then. */
  const dragOverLast = async (container: HTMLElement) => {
    await pickUp('a1');
    await moveTo(at('a', 1));
    await moveTo({ x: 100, y: 2.75 * ROW });
    const shown = keys(container, 'a');
    await cancel();
    return shown;
  };

  it('`behavior`', async () => {
    const behavior = shallowRef<'sort' | 'swap'>('sort');
    const container = mountPair({ behavior: () => behavior.value });
    await nextTick();
    expect(await dragOverLast(container)).toEqual(['a2', 'a3', 'a1']);
    behavior.value = 'swap';
    expect(await dragOverLast(container)).toEqual(['a3', 'a2', 'a1']);
  });

  it('`placeholder`', async () => {
    const placeholder = shallowRef<'item' | 'indicator'>('item');
    const container = mountPair({ placeholder: () => placeholder.value });
    await nextTick();
    expect(await dragOverLast(container)).toEqual(['a2', 'a3', 'a1']);
    placeholder.value = 'indicator';
    expect(await dragOverLast(container)).toEqual(['a1', 'a2', 'a3']);
  });

  it('`sort`', async () => {
    const sort = shallowRef(true);
    const container = mountPair({ sort });
    await nextTick();
    expect(await dragOverLast(container)).toEqual(['a2', 'a3', 'a1']);
    sort.value = false;
    expect(await dragOverLast(container)).toEqual(['a1', 'a2', 'a3']);
  });

  it('`multiple` (when the drag starts)', async () => {
    const multiple = shallowRef<'group' | 'stack'>('group');
    const container = mountPair({ multiple: () => multiple.value });
    await nextTick();
    await pickUp('a1', 'a3');
    expect(keys(container, 'a')).toEqual(['a1', 'a3', 'a2']);
    await cancel();
    multiple.value = 'stack';
    await pickUp('a1', 'a3');
    expect(keys(container, 'a')).toEqual(['a1', 'a2']);
    await cancel();
  });

  it('`strategy` and `animation` (a ref): the multi-drag overlay column follows them', async () => {
    const strategy = shallowRef<'vertical' | 'horizontal'>('vertical');
    const animation = shallowRef<LayoutAnimation | undefined>({ duration: 123 });
    mountPair({ strategy: () => strategy.value, animation });
    await nextTick();
    await pickUp('a1', 'a2');
    expect(manager.overlayColumn.value).toMatchObject({ axis: 'y', animation: { duration: 123 } });
    await cancel();
    strategy.value = 'horizontal';
    // Back to the provider's.
    animation.value = undefined;
    await pickUp('a1', 'a2');
    expect(manager.overlayColumn.value).toMatchObject({ axis: 'x', animation: false });
    await cancel();
  });

  it('`dropOutside` (at the drop)', async () => {
    const dropOutside = shallowRef<'placeholder' | 'remove'>('placeholder');
    mountPair({ dropOutside: () => dropOutside.value });
    await nextTick();
    const dropAway = async () => {
      await pickUp('a1');
      await moveTo({ x: 1000, y: 700 });
      await drop();
      return data.a!.value.map((item) => item.id);
    };
    expect(await dropAway()).toEqual(['a1', 'a2', 'a3']);
    dropOutside.value = 'remove';
    expect(await dropAway()).toEqual(['a2', 'a3']);
  });

  it('`acceptMode`', async () => {
    const acceptMode = shallowRef<'all' | 'some'>('all');
    // `b` takes anything but a2.
    mountPair({}, { acceptMode: () => acceptMode.value, group: { name: 'pair', put: ({ keys }) => !keys.includes('a2') } });
    await nextTick();
    const acceptedByB = async () => {
      await pickUp('a1', 'a2');
      await moveTo(at('b', 1));
      const over = manager.over.value;
      await cancel();
      return over?.id === 'b' && over.accepted;
    };
    expect(await acceptedByB()).toBe(false);
    acceptMode.value = 'some';
    expect(await acceptedByB()).toBe(true);
  });

  it('`autoScroll` (when the drag starts)', async () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    const autoScroll = shallowRef<boolean | undefined>(undefined);
    // The provider doesn't auto-scroll; the list's own option can turn it on.
    const container = mountPair({ autoScroll: () => autoScroll.value }, {}, { autoScroll: false });
    await nextTick();
    const list = container.querySelector<HTMLElement>('[data-list="a"]')!;
    list.style.overflowY = 'auto';
    Object.defineProperties(list, {
      clientWidth: { value: 200 },
      clientHeight: { value: 2 * ROW },
      scrollHeight: { value: 3 * ROW },
    });
    const scrollBy = vi.fn();
    list.scrollBy = scrollBy;
    // Toward the bottom edge of the list's visible area.
    const scrolls = async () => {
      scrollBy.mockClear();
      await pickUp('a1');
      vi.advanceTimersByTime(16);
      manager.move({ x: 100, y: 2 * ROW - 4 });
      vi.advanceTimersByTime(16);
      vi.advanceTimersByTime(16);
      const scrolled = scrollBy.mock.calls.length > 0;
      manager.cancel();
      vi.advanceTimersByTime(16);
      await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
      return scrolled;
    };
    expect(await scrolls()).toBe(false);
    autoScroll.value = true;
    expect(await scrolls()).toBe(true);
  });
});

describe('makeSortableItem options', () => {
  afterEach(() => {
    mounted.splice(0).forEach((unmount) => unmount());
    vi.restoreAllMocks();
  });

  const press = (type: string, target: EventTarget, init: PointerEventInit = {}) => {
    const event = new PointerEvent(type, { bubbles: true, composed: true, isPrimary: true, button: 0, pointerId: 1, pointerType: 'mouse', ...init });
    // happy-dom leaves it out; the copy modifier reads it.
    Object.defineProperty(event, 'getModifierState', { value: () => false });
    target.dispatchEvent(event);
  };

  it('`canDrag` gates pointer and keyboard drags, as on makeDraggable', async () => {
    const canDrag = vi.fn((event: PointerEvent | KeyboardEvent) => event.shiftKey);
    const container = mountPair({}, {}, {}, { canDrag, activation: { mouse: {} } });
    await nextTick();
    const row = container.querySelector<HTMLElement>('[data-id="a1"]')!;

    press('pointerdown', row);
    expect(manager.status.value).toBe('idle');
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
    expect(manager.status.value).toBe('idle');
    expect(canDrag).toHaveBeenCalledTimes(2);

    press('pointerdown', row, { shiftKey: true });
    expect(manager.status.value).toBe('dragging');
    expect(manager.active.value?.id).toBe('a1');
    press('pointercancel', document);
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  });

  it('`attributes`, live', async () => {
    const attributes = shallowRef(false);
    const container = mountPair({}, {}, {}, { attributes });
    await nextTick();
    const row = container.querySelector('[data-id="a1"]')!;
    expect(row.hasAttribute('role')).toBe(false);
    expect(row.hasAttribute('aria-roledescription')).toBe(false);
    attributes.value = true;
    await nextTick();
    expect(row.getAttribute('role')).toBe('button');
    expect(row.getAttribute('aria-roledescription')).toBe('sortable');
    // The other list's rows keep the default.
    expect(container.querySelector('[data-id="b1"]')!.getAttribute('role')).toBe('button');
  });

  it('`activation` is read when a press starts', async () => {
    const activation = shallowRef<ActivationOptions>({ mouse: {} });
    const container = mountPair({}, {}, {}, { activation: () => activation.value });
    await nextTick();
    const row = container.querySelector('[data-id="a1"]')!;

    press('pointerdown', row);
    expect(manager.status.value).toBe('dragging');
    press('pointercancel', document);
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));

    activation.value = { mouse: { distance: 50 } };
    press('pointerdown', row);
    expect(manager.status.value).toBe('activating');
    press('pointercancel', document);
    expect(manager.status.value).toBe('idle');
  });
});
