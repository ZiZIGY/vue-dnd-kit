import { createApp, defineComponent, h, nextTick, ref, shallowRef, useTemplateRef, type ShallowRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Announcements } from '../types';
import { DnDProvider } from './DnDProvider';
import { useManager } from './context';
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
    manager = useManager();
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

describe('draggable attributes during a drag', () => {
  afterEach(() => {
    mounted.splice(0).forEach((unmount) => unmount());
    vi.restoreAllMocks();
  });

  it('change on the dragged item only: the others are left alone at pickup and drop', async () => {
    const container = mountBoard();
    await nextTick();
    const rows = container.querySelectorAll('li');
    const free = container.querySelector<HTMLElement>('[data-zone="home"] span')!;
    // The attributes the library keeps (measuring reads `style`, as happy-dom computes styles).
    const kept = new Set(['tabindex', 'role', 'aria-roledescription', 'aria-describedby', 'aria-disabled', 'aria-pressed']);
    const reads = [vi.spyOn(rows[1]!, 'getAttribute'), vi.spyOn(free, 'getAttribute')];
    const keptReads = () => reads.flatMap((read) => read.mock.calls.filter(([name]) => kept.has(name)));

    expect(manager.start('a', { x: 1, y: 1 }, 'pointer')).toBe(true);
    await nextTick();
    expect(rows[0]!.getAttribute('aria-pressed')).toBe('true');
    await cancel();
    await nextTick();
    expect(rows[0]!.hasAttribute('aria-pressed')).toBe(false);
    expect(keptReads()).toEqual([]);
  });
});

describe('aria-describedby', () => {
  afterEach(() => {
    mounted.splice(0).forEach((unmount) => unmount());
  });

  /** Makes `element` (outside the app, so it outlives the draggable) draggable while `shown` is true. */
  const mountProbe = (element: HTMLElement, shown: ShallowRef<boolean>) => {
    const Probe = defineComponent({
      setup() {
        manager = useManager();
        makeDraggable(() => element, { id: 'probe' });
        return () => null;
      },
    });
    const container = document.createElement('div');
    document.body.append(container, element);
    const app = createApp({ setup: () => () => h(DnDProvider, null, { default: () => (shown.value ? h(Probe) : null) }) });
    app.mount(container);
    mounted.push(() => {
      app.unmount();
      container.remove();
      element.remove();
    });
  };

  const describedBy = (element: Element) => element.getAttribute('aria-describedby');

  it("the instructions id joins the user's ids as a token, is restored after a rewrite, and is all that cleanup removes", async () => {
    const element = document.createElement('div');
    element.setAttribute('aria-describedby', 'help  extra');
    const shown = shallowRef(true);
    mountProbe(element, shown);
    await nextTick();
    const id = manager.instructionsId;
    expect(id).toBeTruthy();
    expect(describedBy(element)).toBe(`help extra ${id}`);

    // A binding (a kit tooltip opening, then closing) rewrites the attribute.
    element.setAttribute('aria-describedby', 'tooltip');
    await vi.waitFor(() => expect(describedBy(element)).toBe(`tooltip ${id}`));
    element.removeAttribute('aria-describedby');
    await vi.waitFor(() => expect(describedBy(element)).toBe(id));
    element.setAttribute('aria-describedby', `${id} mine`);
    await nextTick();
    expect(describedBy(element)).toBe(`${id} mine`);

    // Cleanup removes the library's token only.
    shown.value = false;
    await nextTick();
    expect(describedBy(element)).toBe('mine');
    element.setAttribute('aria-describedby', 'later');
    await nextTick();
    expect(describedBy(element)).toBe('later');
  });

  it('an attribute the library created goes away with its token', async () => {
    const element = document.createElement('div');
    const shown = shallowRef(true);
    mountProbe(element, shown);
    await nextTick();
    expect(describedBy(element)).toBe(manager.instructionsId);
    shown.value = false;
    await nextTick();
    expect(element.hasAttribute('aria-describedby')).toBe(false);
    // Like the library's other attributes.
    expect(element.hasAttribute('role')).toBe(false);
  });
});
