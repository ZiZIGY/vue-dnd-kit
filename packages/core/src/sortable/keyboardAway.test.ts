import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { containsPoint, createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeDroppable } from '../core/makeDroppable';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';

const ROW = 40;
let manager: DnDManager;
let unmount: (() => void) | null = null;
let tasks: Ref<Array<{ id: string }>>;

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('li', { ref: 'el', 'data-row': '' }, props.rowId);
  },
});

/** A list of three 40px rows at the top, and a trash zone at y 200–260 below it. */
const mount = () => {
  tasks = ref(['a', 'b', 'c'].map((id) => ({ id })));
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { dropAnimation: false, animation: false }, {
        default: () =>
          h({
            setup() {
              manager = useManager();
              const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), { items: tasks });
              makeDroppable(useTemplateRef<HTMLElement>('trash'), { id: 'trash', onDrop: (e) => e.source?.remove() });
              return () => [
                h('ul', { ref: 'list' }, items.value.map((task) => h(Row, { key: task.id, rowId: task.id }))),
                h('div', { ref: 'trash', 'data-trash': '' }),
              ];
            },
          }),
      }),
  });
  app.mount(container);
  const rectOf = (element: Element) => {
    if (element.hasAttribute('data-trash')) return createRect(0, 200, 200, 60);
    if (element.tagName === 'UL') return createRect(0, 0, 200, element.children.length * ROW);
    if (element.hasAttribute('data-row')) return createRect(0, [...element.parentElement!.children].indexOf(element) * ROW, 200, ROW);
    return createRect(0, 0, 0, 0);
  };
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this) as DOMRect;
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    const candidates = [...container.querySelectorAll('[data-row], ul, [data-trash]')];
    return candidates.find((element) => containsPoint(rectOf(element), { x, y })) ?? null;
  });
  unmount = () => {
    app.unmount();
    container.remove();
  };
};

const press = async (key: string) => {
  const before = manager.pointer.value;
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  await vi.waitFor(() => expect(manager.pointer.value).not.toBe(before));
  await nextTick();
};

afterEach(() => {
  unmount?.();
  unmount = null;
  vi.restoreAllMocks();
});

describe('keyboard: past the end of a list, a plain drop target', () => {
  it('the arrow goes on to the trash and back to the slot; dropping there removes the item', async () => {
    mount();
    await nextTick();
    manager.start('b', { x: 100, y: 1.5 * ROW }, 'keyboard');
    await nextTick();
    await press('ArrowDown');
    await press('ArrowDown');
    expect(manager.over.value?.id).toBe('trash');
    // Up from the trash: back to the slot, the last row, where it was.
    await press('ArrowUp');
    expect(manager.pointer.value).toEqual({ x: 100, y: 2.5 * ROW });
    await press('ArrowDown');
    expect(manager.over.value?.id).toBe('trash');
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(tasks.value.map((task) => task.id)).toEqual(['a', 'c']);
  });
});
