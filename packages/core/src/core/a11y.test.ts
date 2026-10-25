import { createApp, defineComponent, h, nextTick, ref, useTemplateRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Announcements } from '../types';
import { DnDProvider } from './DnDProvider';
import { useDnDContext } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';
import { makeDroppable } from './makeDroppable';
import { makeSortableItem } from '../sortable/makeSortableItem';
import { makeSortableList } from '../sortable/makeSortableList';

let manager: DnDManager;
const mounted: Array<() => void> = [];

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('li', { ref: 'el' }, props.rowId);
  },
});

const List = defineComponent({
  setup() {
    manager = useDnDContext();
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
      id: 'l',
      items: ref([{ id: 'a' }, { id: 'b' }, { id: 'c' }]),
    });
    return () => h('ul', { ref: 'list' }, items.value.map((row) => h(Row, { key: row.id, rowId: row.id })));
  },
});

const Zone = defineComponent({
  props: { zoneId: { type: String, required: true } },
  setup(props, { slots }) {
    makeDroppable(useTemplateRef<HTMLElement>('el'), { id: props.zoneId });
    return () => h('div', { ref: 'el', 'data-zone': props.zoneId }, slots.default?.());
  },
});

const Free = defineComponent({
  setup() {
    makeDraggable(useTemplateRef<HTMLElement>('el'), { id: 'free' });
    return () => h('span', { ref: 'el' }, 'free');
  },
});

/** A sortable list `l` (a, b, c), and zones `home` (holding the plain draggable `free`) and `away`. */
const mountBoard = (announcements?: Partial<Announcements>) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { dropAnimation: false, announcements }, {
        default: () => [h(List), h(Zone, { zoneId: 'home' }, () => h(Free)), h(Zone, { zoneId: 'away' })],
      }),
  });
  app.mount(container);
  mounted.push(() => {
    app.unmount();
    container.remove();
  });
  return container;
};

const cancel = async () => {
  manager.cancel();
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
};

describe('announcements', () => {
  afterEach(() => {
    mounted.splice(0).forEach((unmount) => unmount());
    vi.restoreAllMocks();
  });

  it('a text returning undefined falls back to the integrations (sortable positions), then the defaults', async () => {
    mountBoard({
      onDragStart: () => undefined,
      onDragCancel: ({ active }) => (active.id === 'free' ? undefined : ''),
    });
    await nextTick();
    // Integration announcers that return undefined pass the event on as well.
    manager.addAnnouncer({ onDragStart: () => undefined, onDragCancel: () => undefined });

    manager.start('a', { x: 1, y: 1 }, 'keyboard');
    expect(manager.announcement.value).toBe('Picked up item a at position 1 of 3 in list l.');
    // '' says nothing.
    await cancel();
    expect(manager.announcement.value).toBe('Picked up item a at position 1 of 3 in list l.');

    manager.start('free', { x: 1, y: 1 }, 'keyboard');
    expect(manager.announcement.value).toBe('Picked up draggable item free.');
    await cancel();
    expect(manager.announcement.value).toBe('Dragging was cancelled. Draggable item free was dropped.');
  });

  it('a move is not announced for the target found at pickup', async () => {
    const container = mountBoard({ onDragOver: ({ over }) => `Over ${String(over?.id)}.` });
    await nextTick();
    const onDragOver = vi.fn();
    manager.addMonitor({ onDragOver });
    const over = vi.spyOn(manager.props.announcements as Announcements, 'onDragOver');
    let under = container.querySelector('[data-zone="home"] span')!;
    vi.spyOn(document, 'elementFromPoint').mockImplementation(() => under);

    manager.start('free', { x: 1, y: 1 }, 'keyboard');
    expect(manager.over.value?.id).toBe('home');
    // Monitors still hear about it.
    expect(onDragOver).toHaveBeenCalledTimes(1);
    expect(over).not.toHaveBeenCalled();

    under = container.querySelector('[data-zone="away"]')!;
    manager.move({ x: 2, y: 2 });
    manager.flushFrame();
    expect(manager.over.value?.id).toBe('away');
    expect(over).toHaveBeenCalledTimes(1);
    expect(manager.announcement.value).toBe('Picked up draggable item free.');
    await vi.waitFor(() => expect(manager.announcement.value).toBe('Over away.'), { timeout: 2000 });
    await cancel();
  });
});
