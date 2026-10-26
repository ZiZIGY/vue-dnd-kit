import {
  createApp,
  createCommentVNode,
  defineComponent,
  h,
  isReactive,
  nextTick,
  reactive,
  ref,
  shallowRef,
  useTemplateRef,
  type Component,
  type PropType,
} from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Active, OverlayProps, OverlaySlotProps, SortableItemOptions } from '../types';
import { DnDProvider } from './DnDProvider';
import { renderOverlay } from './DragOverlay';
import { useManager } from './context';
import type { DnDManager } from './manager';
import { makeDraggable, toOverlay } from './makeDraggable';
import { makeSortableItem } from '../sortable/makeSortableItem';
import { makeSortableList } from '../sortable/makeSortableList';

/** Overlay component that tells which one rendered and what it received. */
const marker = (kind: string): Component =>
  defineComponent({
    props: ['active', 'items', 'over', 'accepted', 'status', 'mode'],
    setup: (props) => () =>
      h('i', { 'data-kind': kind, 'data-count': (props as unknown as OverlayProps).items.length }),
  });

const ItemOverlay = marker('item');
const ListOverlay = marker('list');
const FreeOverlay = marker('free');
const Clone = marker('clone');

const props = { items: [{ id: 'a', data: undefined, type: [] }] } as unknown as OverlaySlotProps;

describe('overlay precedence (pure)', () => {
  it('renders the component, then a non-empty slot, then the clone', () => {
    const slot = vi.fn(() => [h('b')]);
    expect((renderOverlay(ItemOverlay, slot, props, Clone) as { type: unknown }).type).toBe(ItemOverlay);
    expect(slot).not.toHaveBeenCalled();
    expect(renderOverlay(null, slot, props, Clone)).toEqual([expect.objectContaining({ type: 'b' })]);
    expect((renderOverlay(null, undefined, props, Clone) as { type: unknown }).type).toBe(Clone);
  });

  it('falls back to the clone when the slot renders nothing for this drag', () => {
    const empty = () => [createCommentVNode('v-if', true)];
    expect((renderOverlay(null, empty, props, Clone) as { type: unknown }).type).toBe(Clone);
    expect((renderOverlay(null, () => [], props, Clone) as { type: unknown }).type).toBe(Clone);
  });

  it('keeps components raw and normalizes the option', () => {
    expect(toOverlay(undefined)).toBe(true);
    expect(toOverlay(true)).toBe(true);
    expect(toOverlay(false)).toBe(false);
    const component = defineComponent({ render: () => null });
    expect(toOverlay(component)).toBe(component);
    expect(isReactive(reactive({ component }).component)).toBe(false);
  });
});

// ─── Mounted ───────────────────────────────────────────────────────────────────

let manager: DnDManager;
let unmount: (() => void) | null = null;

const Row = defineComponent({
  props: {
    id: { type: String, required: true },
    type: String,
    overlay: Object as PropType<Component>,
  },
  setup(rowProps) {
    const options: SortableItemOptions = { id: () => rowProps.id, type: () => rowProps.type, overlay: rowProps.overlay };
    makeSortableItem(useTemplateRef<HTMLElement>('el'), options);
    return () => h('li', { ref: 'el' }, rowProps.id);
  },
});

const List = defineComponent({
  props: {
    rows: { type: Array as PropType<Array<{ id: string; type?: string; overlay?: Component }>>, required: true },
    overlay: Object as PropType<Component>,
  },
  setup(listProps) {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
      items: ref(listProps.rows),
      overlay: listProps.overlay,
    });
    return () => h('ul', { ref: 'list' }, items.value.map((row) => h(Row, { key: row.id, ...row })));
  },
});

const Free = defineComponent({
  props: { id: { type: String, required: true }, overlay: { type: [Boolean, Object] as PropType<boolean | Component> } },
  setup(freeProps) {
    makeDraggable(useTemplateRef<HTMLElement>('el'), { id: freeProps.id, overlay: freeProps.overlay });
    return () => h('div', { ref: 'el' }, freeProps.id);
  },
});

const showFirstList = shallowRef(true);

const mountBoard = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(
        DnDProvider,
        { dropAnimation: false },
        {
          default: () =>
            h({
              setup() {
                manager = useManager();
                return () => [
                  showFirstList.value
                    ? h(List, {
                        overlay: ListOverlay,
                        rows: [{ id: 'a1', overlay: ItemOverlay }, { id: 'a2' }],
                      })
                    : null,
                  h(List, { rows: [{ id: 'b1', type: 'slotted' }, { id: 'b2' }] }),
                  h(Free, { id: 'free', overlay: FreeOverlay }),
                  h(Free, { id: 'moved', overlay: false }),
                ];
              },
            }),
          // The provider slot only handles 'slotted' items: the others get the clone.
          overlay: ({ items }: OverlaySlotProps) => (items[0]!.type.includes('slotted') ? h('i', { 'data-kind': 'slot' }) : null),
        },
      ),
  });
  app.mount(container);
  unmount = () => {
    app.unmount();
    container.remove();
  };
};

const overlay = () => document.querySelector('[data-dnd-overlay]');

/** Starts a pointer drag of `id` and returns what the overlay shows. */
const drag = async (id: string) => {
  expect(manager.start(id, { x: 1, y: 1 }, 'pointer')).toBe(true);
  await nextTick();
  const kind = overlay()?.querySelector('[data-kind]');
  return kind ? kind.getAttribute('data-kind') : overlay() ? 'clone' : null;
};

const end = async () => {
  manager.cancel();
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
};

describe('overlay precedence (mounted)', () => {
  afterEach(() => {
    unmount?.();
    unmount = null;
    showFirstList.value = true;
  });

  it('item option > list option > provider slot > clone', async () => {
    mountBoard();
    await nextTick();
    expect(await drag('a1')).toBe('item');
    await end();
    expect(await drag('a2')).toBe('list');
    await end();
    expect(await drag('b1')).toBe('slot');
    await end();
    expect(await drag('b2')).toBe('clone');
    expect(overlay()!.textContent).toContain('b2');
    await end();
  });

  it('draggables take a component, and `false` still means no overlay', async () => {
    mountBoard();
    await nextTick();
    expect(await drag('free')).toBe('free');
    await end();
    expect(await drag('moved')).toBeNull();
    expect(manager.hasOverlay).toBe(false);
    await end();
  });

  it('keeps the component for the session when the source unmounts', async () => {
    mountBoard();
    await nextTick();
    expect(await drag('a2')).toBe('list');
    showFirstList.value = false;
    await nextTick();
    expect(manager.getDraggable('a2')).toBeUndefined();
    expect(overlay()?.querySelector('[data-kind]')?.getAttribute('data-kind')).toBe('list');
    await end();
  });

  it("takes every item's clone with the styles the item has in its list", async () => {
    const style = document.createElement('style');
    style.textContent = 'ul > li { padding: 3px }';
    document.head.appendChild(style);
    mountBoard();
    await nextTick();
    manager.selection.add('b1').add('b2');
    expect(await drag('b2')).toBe('clone');
    // What `DragPreview` shows: the overlay and the multi-drag column.
    for (const id of ['b1', 'b2']) expect(manager.getPreview(id)!.element.style.padding).toBe('3px');
    await end();
    style.remove();
  });

  it('renders one overlay with every item of a multi-drag', async () => {
    mountBoard();
    await nextTick();
    manager.selection.add('a1').add('a2');
    expect(await drag('a1')).toBe('item');
    expect(document.querySelectorAll('[data-dnd-overlay]')).toHaveLength(1);
    expect(overlay()!.querySelector('[data-kind]')!.getAttribute('data-count')).toBe('2');
    expect((manager.active.value as Active).ids).toEqual(['a1', 'a2']);
    await end();
  });
});
