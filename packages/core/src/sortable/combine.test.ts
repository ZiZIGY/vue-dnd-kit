import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DnDEvent, DropAnimationContext, SortableStrategy } from '../types';
import { createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeDroppable } from '../core/makeDroppable';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';
import { dropBand, dropBandPoint } from './combine';

describe('dropBand', () => {
  const item = createRect(100, 200, 80, 40);

  it('is the middle half of the item along the main axis, across all of it', () => {
    expect(dropBand(item, 'vertical')).toEqual(createRect(100, 210, 80, 20));
    expect(dropBand(item, 'horizontal')).toEqual(createRect(120, 200, 40, 40));
    // Grid rows run along x: the edges left and right of an item sort.
    expect(dropBand(item, 'grid')).toEqual(createRect(120, 200, 40, 40));
  });

  it('gives the keyboard a point on the target inside the band, if they meet', () => {
    // The target is the item itself: the band's center.
    expect(dropBandPoint(item, item, 'vertical')).toEqual({ x: 140, y: 220 });
    // An icon in the top-left corner of the item only meets the band partly.
    expect(dropBandPoint(item, createRect(100, 200, 30, 30), 'vertical')).toEqual({ x: 115, y: 220 });
    // A badge in the top edge band can't be dropped into.
    expect(dropBandPoint(item, createRect(160, 200, 20, 8), 'vertical')).toBeNull();
  });
});

describe('drop into an item', () => {
  const ROW = 40;
  let manager: DnDManager;
  let unmount: (() => void) | null = null;
  let order: Ref<Array<{ id: string }>>;
  let drops: string[];
  let animations: DropAnimationContext[];

  /**
   * A vertical list (or a grid of 100px cells in one row) of `ids`. Ids starting with `g`
   * are groups: their element is also a drop target (`group:<id>`) that takes anything,
   * except `g-x`, which takes nothing. Its `onDrop` removes the items from the list.
   */
  const mount = (ids: string[], strategy: SortableStrategy = 'vertical') => {
    drops = [];
    animations = [];
    const container = document.createElement('div');
    document.body.appendChild(container);
    const Row = defineComponent({
      props: { rowId: { type: String, required: true } },
      setup(props) {
        const el = useTemplateRef<HTMLElement>('el');
        makeSortableItem(el, { id: () => props.rowId });
        if (props.rowId.startsWith('g')) {
          makeDroppable(el, {
            id: `group:${props.rowId}`,
            accept: () => props.rowId !== 'g-x',
            onDrop: (event: DnDEvent) => {
              drops.push(`${event.active.ids.join('+')}>${props.rowId}`);
              event.source?.remove();
            },
          });
        }
        return () => h('li', { ref: 'el', 'data-id': props.rowId }, props.rowId);
      },
    });
    order = ref(ids.map((id) => ({ id })));
    const app = createApp({
      setup: () => () =>
        h(
          DnDProvider,
          { animation: false, dropAnimation: (context: DropAnimationContext) => void animations.push(context) },
          {
            default: () =>
              h({
                setup() {
                  manager = useManager();
                  const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), { id: 'list', items: order, strategy });
                  return () =>
                    h('ul', { ref: 'list', 'data-list': '' }, items.value.map((task) => h(Row, { key: task.id, rowId: task.id })));
                },
              }),
          },
        ),
    });
    app.mount(container);
    unmount = () => {
      app.unmount();
      container.remove();
    };

    // The layout happy-dom doesn't have: rows stack from the top (cells side by side in a grid).
    const rectOf = (element: Element) => {
      if (element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
      const list = container.querySelector('[data-list]')!;
      const count = list.children.length;
      if (element === list) return strategy === 'grid' ? createRect(0, 0, count * 100, ROW) : createRect(0, 0, 200, count * ROW);
      if (element.parentElement === list) {
        const index = [...list.children].indexOf(element);
        return strategy === 'grid' ? createRect(index * 100, 0, 100, ROW) : createRect(0, index * ROW, 200, ROW);
      }
      return createRect(0, 0, 0, 0);
    };
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return rectOf(this) as DOMRect;
    });
    vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
      const list = container.querySelector('[data-list]')!;
      const inside = (element: Element) => {
        const rect = rectOf(element);
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      };
      return [...list.children].find(inside) ?? (inside(list) ? list : null);
    });
    return container;
  };

  const rows = (container: HTMLElement) => [...container.querySelectorAll('ul > li')].map((row) => row.getAttribute('data-id'));
  const data = () => order.value.map((item) => item.id).join(',');

  /** Picks `id` up at the center of its row (selecting `others` with it). */
  const pickUp = async (id: string, others: string[] = [], sensor: 'pointer' | 'keyboard' = 'pointer') => {
    for (const key of [id, ...others]) manager.selection.add(key);
    const index = order.value.findIndex((item) => item.id === id);
    expect(manager.start(id, { x: 100, y: index * ROW + ROW / 2 }, sensor)).toBe(true);
    await nextTick();
  };

  /** Moves the pointer to `y` (and `x`), runs the frame and lets the drafts render. */
  const moveTo = async (y: number, x = 100) => {
    manager.move({ x, y });
    manager.flushFrame();
    await nextTick();
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

  it("the middle of an item's band targets it, without reordering; the drop goes into it", async () => {
    const container = mount(['a1', 'a2', 'g1', 'a3']);
    await nextTick();
    await pickUp('a1');
    // g1 spans 80–120; its middle band is 90–110. The top edge band leaves it to the list.
    await moveTo(84);
    expect(manager.over.value?.id).not.toBe('group:g1');
    await moveTo(100);
    expect(manager.over.value?.id).toBe('group:g1');
    expect(manager.over.value?.accepted).toBe(true);
    // a1 passed a2 on the way (crossing its center), but not g1.
    expect(rows(container)).toEqual(['a2', 'a1', 'g1', 'a3']);

    await drop();
    expect(drops).toEqual(['a1>g1']);
    // `e.source.remove()`: gone from the list, nothing else moved.
    expect(data()).toBe('a2,g1,a3');
    // The item isn't shown anywhere: the overlay goes into the target (one row up now).
    expect(animations.at(-1)).toMatchObject({ reason: 'drop', to: null, into: createRect(0, ROW, 200, ROW) });
  });

  it('the edge bands of an item sort past it as usual', async () => {
    const container = mount(['a1', 'g1', 'a2']);
    await nextTick();
    await pickUp('a1');
    // The bottom band of g1 (40–80): past its center, a1 goes after it.
    await moveTo(75);
    expect(manager.over.value?.id).not.toBe('group:g1');
    expect(rows(container)).toEqual(['g1', 'a1', 'a2']);
    await drop();
    expect(drops).toEqual([]);
    expect(data()).toBe('g1,a1,a2');
  });

  it('a target that refuses the drag is left out: the list sorts over the whole item', async () => {
    const container = mount(['a1', 'g-x', 'a2']);
    await nextTick();
    await pickUp('a1');
    // Right in g-x's middle, past its center: it is just an item.
    await moveTo(62);
    expect(manager.over.value?.id).not.toBe('group:g-x');
    expect(rows(container)).toEqual(['g-x', 'a1', 'a2']);
    await drop();
    expect(data()).toBe('g-x,a1,a2');
  });

  it('a multi-drag goes in whole, never into an item it carries', async () => {
    const container = mount(['g1', 'a1', 'g2', 'a2']);
    await nextTick();
    // g2 travels with a1 ('group' block a1, g2 right after the active item).
    await pickUp('a1', ['g2']);
    expect(rows(container)).toEqual(['g1', 'a1', 'g2', 'a2']);
    // The middle of g2's row: not a target, though it takes anything.
    await moveTo(100);
    expect(manager.over.value?.id).toBe('list');
    // g1 is one.
    await moveTo(20);
    expect(manager.over.value?.id).toBe('group:g1');
    await drop();
    expect(drops).toEqual(['a1+g2>g1']);
    expect(data()).toBe('g1,a2');
  });

  it('cancelling or a refusing onBeforeDrop over a target changes nothing', async () => {
    mount(['a1', 'g1']);
    await nextTick();
    await pickUp('a1');
    await moveTo(60);
    expect(manager.over.value?.id).toBe('group:g1');
    manager.cancel();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(drops).toEqual([]);
    expect(data()).toBe('a1,g1');
    expect(animations.at(-1)).toMatchObject({ reason: 'cancel', into: null });

    const refuse = manager.addMonitor({ onBeforeDrop: () => false });
    await pickUp('a1');
    await moveTo(60);
    await drop();
    refuse();
    expect(drops).toEqual([]);
    expect(data()).toBe('a1,g1');
  });

  it('grid: the edges of an item you can drop into put the item before or after it', async () => {
    const container = mount(['a1', 'a2', 'g1', 'a3'], 'grid');
    await nextTick();
    manager.selection.clear();
    expect(manager.start('a1', { x: 50, y: 20 }, 'pointer')).toBe(true);
    await nextTick();
    // The left edge of g1 (200–300): a1 goes right before it, g1 stays put.
    await moveTo(20, 210);
    expect(rows(container)).toEqual(['a2', 'a1', 'g1', 'a3']);
    // On through g1's left band into its middle: into g1, nothing moves.
    await moveTo(20, 222);
    await moveTo(20, 250);
    expect(manager.over.value?.id).toBe('group:g1');
    expect(rows(container)).toEqual(['a2', 'a1', 'g1', 'a3']);
    // Its right edge: after it.
    await moveTo(20, 290);
    expect(rows(container)).toEqual(['a2', 'g1', 'a1', 'a3']);
    await drop();
    expect(data()).toBe('a2,g1,a1,a3');
  });

  it('keyboard: an arrow stops on the target before passing the item; Enter drops into it', async () => {
    const container = mount(['a1', 'g1', 'a2']);
    await nextTick();
    const press = async (key: string) => {
      const before = manager.pointer.value;
      document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      await vi.waitFor(() => expect(manager.pointer.value).not.toBe(before));
      await nextTick();
    };
    await pickUp('a1', [], 'keyboard');
    await press('ArrowDown');
    expect(manager.over.value?.id).toBe('group:g1');
    expect(rows(container)).toEqual(['a1', 'g1', 'a2']);
    // Back up: out of the target, still in place.
    await press('ArrowUp');
    expect(manager.over.value?.id).not.toBe('group:g1');
    expect(rows(container)).toEqual(['a1', 'g1', 'a2']);
    // Down twice: onto the target, then past the item.
    await press('ArrowDown');
    await press('ArrowDown');
    expect(manager.over.value?.id).not.toBe('group:g1');
    expect(rows(container)).toEqual(['g1', 'a1', 'a2']);
    // Up onto it again (from below), and drop.
    await press('ArrowUp');
    expect(manager.over.value?.id).toBe('group:g1');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(drops).toEqual(['a1>g1']);
    expect(data()).toBe('g1,a2');
  });

  it('announces the target, the position again once off it, and the drop into it', async () => {
    mount(['a1', 'g1', 'a2']);
    await nextTick();
    // The block a1, a2 forms at a1: g1 is the third row (80–120).
    await pickUp('a1', ['a2']);
    await moveTo(100);
    const spoken = (text: string) =>
      vi.waitFor(() => expect(manager.announcement.value).toBe(text), { timeout: 2000 });
    await spoken('Over group:g1: dropping puts 2 items inside.');
    // Off it, back where the block is: its position is spoken again.
    await moveTo(20);
    await spoken('2 items moved to position 1 of 3 in list list.');
    await moveTo(100);
    await spoken('Over group:g1: dropping puts 2 items inside.');
    await drop();
    expect(manager.announcement.value).toBe('2 items dropped into group:g1.');
  });
});
