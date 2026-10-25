import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type Component } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MultipleMode, OverlayProps } from '../types';
import { DnDProvider } from '../core/DnDProvider';
import { DragPreview } from '../core/DragPreview';
import { useDnDContext } from '../core/context';
import type { DnDManager } from '../core/manager';
import { layoutColumn } from './column';
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
              manager = useDnDContext();
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
    // A component overlay gets no column: the box flies alone.
    expect(manager.overlayItems.size).toBe(0);
    await cancel();
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
