/**
 * `overlayPreviews`: how many dragged items get a clone at pickup, the grabbed one and the
 * others next to it in drop order.
 */

import { createApp, defineComponent, h, nextTick, ref, useTemplateRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DnDProvider } from './DnDProvider';
import { useManager } from './context';
import type { DnDManager } from './manager';
import { makeSortableItem } from '../sortable/makeSortableItem';
import { makeSortableList } from '../sortable/makeSortableList';

let manager: DnDManager;
let unmount: (() => void) | null = null;

const IDS = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'];

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('li', { ref: 'el' }, props.rowId);
  },
});

const List = defineComponent({
  setup() {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), { items: ref(IDS.map((id) => ({ id }))) });
    return () => h('ul', { ref: 'list' }, items.value.map((row) => h(Row, { key: row.id, rowId: row.id })));
  },
});

const mount = (overlayPreviews?: number | 'all') => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { dropAnimation: false, overlayPreviews }, () => [
        h({ setup: () => () => ((manager = useManager()), null) }),
        h(List),
      ]),
  });
  app.mount(container);
  unmount = () => {
    app.unmount();
    container.remove();
  };
};

/** The ids cloned when every row is picked and `grabbed` is dragged. */
const cloned = async (grabbed: string) => {
  await nextTick();
  for (const id of IDS) manager.selection.add(id);
  expect(manager.start(grabbed, { x: 1, y: 1 }, 'pointer')).toBe(true);
  await nextTick();
  const ids = [...manager.previewIds];
  // Each one is a copy of its own row.
  for (const id of ids) expect(manager.getPreview(id)!.element.textContent).toBe(id);
  manager.cancel();
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  return ids;
};

afterEach(() => {
  unmount?.();
  unmount = null;
});

describe('overlayPreviews', () => {
  it('clones five by default, around the grabbed item in drop order', async () => {
    mount();
    expect(await cloned('r5')).toEqual(['r3', 'r4', 'r5', 'r6', 'r7']);
  });

  it('takes as many as it is given', async () => {
    mount(3);
    expect(await cloned('r1')).toEqual(['r1', 'r2', 'r3']);
  });

  it("`'all'` clones every rendered item, in one go", async () => {
    mount('all');
    expect(await cloned('r9')).toEqual(IDS);
  });
});
