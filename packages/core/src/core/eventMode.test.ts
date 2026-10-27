import { createApp, defineComponent, h, nextTick, ref, useTemplateRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DnDEvent, DnDState } from '../types';
import { createRect } from '../animation/layout';
import { DnDProvider } from './DnDProvider';
import { useDnD, useManager } from './context';
import type { DnDManager } from './manager';
import { makeDroppable } from './makeDroppable';
import { makeSortableItem } from '../sortable/makeSortableItem';
import { makeSortableList } from '../sortable/makeSortableList';

let manager: DnDManager;
let state: DnDState;
let unmount: (() => void) | null = null;
let drops: DnDEvent[];

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('li', { ref: 'el', 'data-row': '' }, props.rowId);
  },
});

/** A palette that copies out (rows 200×40 from the top) and a plain drop zone at (300, 0), 200×200. */
const mount = () => {
  drops = [];
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { dropAnimation: false, animation: false }, {
        default: () =>
          h({
            setup() {
              manager = useManager();
              state = useDnD();
              const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
                items: ref([{ id: 'block' }]),
                group: { name: 'blocks', pull: 'clone', put: false },
                clone: (item) => ({ id: `${item.id}-copy` }),
              });
              makeDroppable(useTemplateRef<HTMLElement>('zone'), { id: 'zone', onDrop: (event) => drops.push(event) });
              return () => [
                h('ul', { ref: 'list' }, items.value.map((item) => h(Row, { key: item.id, rowId: item.id }))),
                h('div', { ref: 'zone', 'data-zone': '' }),
              ];
            },
          }),
      }),
  });
  app.mount(container);
  const zone = container.querySelector('[data-zone]')!;
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    if (this.hasAttribute('data-zone')) return createRect(300, 0, 200, 200) as DOMRect;
    if (this.hasAttribute('data-row')) return createRect(0, 0, 200, 40) as DOMRect;
    if (this.tagName === 'UL') return createRect(0, 0, 200, 40) as DOMRect;
    return createRect(0, 0, 0, 0) as DOMRect;
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x) => (x >= 300 ? zone : null));
  unmount = () => {
    app.unmount();
    container.remove();
  };
};

afterEach(() => {
  unmount?.();
  unmount = null;
  vi.restoreAllMocks();
});

describe('a drop on a plain target', () => {
  it("knows it is a copy (event.mode), and useDnD().position follows the box in the target", async () => {
    mount();
    await nextTick();
    expect(manager.start('block', { x: 10, y: 10 }, 'pointer')).toBe(true);
    await nextTick();
    // The grab point is 10px into the box: the box's corner sits 10px up-left of the pointer.
    manager.move({ x: 360, y: 90 });
    manager.flushFrame();
    expect(manager.over.value?.id).toBe('zone');
    expect(state.position.value).toEqual({ x: 50, y: 80 });
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(drops).toHaveLength(1);
    expect(drops[0]!.mode).toBe('copy');
    expect(drops[0]!.position).toEqual({ x: 50, y: 80 });
    expect(state.position.value).toBeNull();
  });
});
