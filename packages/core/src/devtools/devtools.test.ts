import { createApp, defineComponent, effectScope, h, nextTick, ref, toRef, useTemplateRef, type PropType, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AcceptRule, Coordinates, Rect, Sensor, SensorContext } from '../types';
import { containsPoint, createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { provideDnDContext, useManager } from '../core/context';
import { useSensor } from '../core/sensors/host';
import type { DnDManager } from '../core/manager';
import { makeDraggable } from '../core/makeDraggable';
import { makeDroppable } from '../core/makeDroppable';
import { makeSortableItem } from '../sortable/makeSortableItem';
import { makeSortableList } from '../sortable/makeSortableList';
import { makeSortableTree } from '../sortable/makeSortableTree';
import { connectDevtools } from './index';
import type { DevtoolsBridge, DevtoolsEvent } from './types';

/**
 * The devtools bridge in happy-dom. Containers (`data-col`) sit side by side 300px apart,
 * their children stack 40px high: list `a` (column 0), tree `t` (1), the drop target
 * `trash` (2) and the plain draggable `chip` (3).
 */

const ROW = 40;
let manager: DnDManager;
let bridge: DevtoolsBridge | null = null;
let unmount: (() => void) | null = null;

const rectOf = (element: Element): Rect => {
  if (element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
  const column = element.getAttribute('data-col');
  if (column != null) return createRect(Number(column) * 300, 0, 200, Math.max(element.children.length, 1) * ROW);
  const parent = element.parentElement;
  const parentColumn = parent?.getAttribute('data-col');
  if (parent && parentColumn != null) {
    return createRect(Number(parentColumn) * 300, [...parent.children].indexOf(element) * ROW, 200, ROW);
  }
  return createRect(0, 0, 0, 0);
};

/** A point on row `index` of column `column`, `fraction` of the way down it. */
const at = (column: number, index: number, fraction = 0.5): Coordinates => ({ x: column * 300 + 100, y: (index + fraction) * ROW });

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('li', { ref: 'el' }, props.rowId);
  },
});

/** The items of list `a`. */
let listItems: Ref<{ id: string }[]>;

const List = defineComponent({
  name: 'TaskList',
  props: { animate: Boolean },
  setup(props) {
    listItems = ref(['a1', 'a2', 'a3'].map((id) => ({ id })));
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
      id: 'a',
      group: 'g',
      items: listItems,
      animate: () => props.animate,
    });
    return () => h('ul', { ref: 'list', 'data-col': 0 }, items.value.map((item) => h(Row, { key: item.id, rowId: item.id })));
  },
});

const Tree = defineComponent({
  setup() {
    const { items } = makeSortableTree(useTemplateRef<HTMLElement>('tree'), {
      id: 't',
      items: ref([{ id: 'f', children: [{ id: 'f1' }] }, { id: 'x' }]),
    });
    return () => h('ul', { ref: 'tree', 'data-col': 1 }, items.value.map((row) => h(Row, { key: row.key, rowId: String(row.key) })));
  },
});

const Zones = defineComponent({
  props: { accept: { type: [String, Function] as PropType<AcceptRule>, default: 'card' }, chipType: { type: String, default: 'card' } },
  setup(props) {
    // A function is a rule: the prop goes in as a ref.
    makeDroppable(useTemplateRef<HTMLElement>('trash'), { id: 'trash', accept: toRef(props, 'accept'), priority: 2 });
    makeDraggable(useTemplateRef<HTMLElement>('chip'), { id: 'chip', type: () => props.chipType, data: { kind: 'chip' } });
    return () => [h('div', { ref: 'trash', 'data-col': 2 }), h('span', { ref: 'chip', 'data-col': 3 }, 'chip')];
  },
});

const Probe = defineComponent({
  setup() {
    manager = useManager();
    return () => null;
  },
});

const Board = defineComponent({
  name: 'KanbanBoard',
  props: {
    accept: { type: [String, Function] as PropType<AcceptRule>, default: 'card' },
    chipType: { type: String, default: 'card' },
    sensors: Array as PropType<Sensor[]>,
    animate: Boolean,
  },
  setup(props) {
    return () =>
      h(DnDProvider, { animation: false, dropAnimation: false, sensors: props.sensors }, () => [
        h(Probe),
        h(List, { animate: props.animate }),
        h(Tree),
        h(Zones, { accept: props.accept, chipType: props.chipType }),
      ]);
  },
});

const mount = (props: { accept?: AcceptRule; chipType?: string; sensors?: Sensor[]; animate?: boolean } = {}) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp(Board, props);
  app.mount(container);
  unmount = () => {
    app.unmount();
    container.remove();
  };
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this) as DOMRect;
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    const candidates = [...container.querySelectorAll('[data-col] > *'), ...container.querySelectorAll('[data-col]')];
    return candidates.find((element) => containsPoint(rectOf(element), { x, y })) ?? null;
  });
  return app;
};

/** Connects the bridge and records the events (moves left out). */
const connect = () => {
  bridge = connectDevtools();
  const events: DevtoolsEvent[] = [];
  bridge.subscribe({ event: (_provider, event) => event.type !== 'move' && events.push(event) });
  return events;
};

const drag = async (id: string, from: Coordinates, to: Coordinates) => {
  expect(manager.start(id, from, 'pointer')).toBe(true);
  await nextTick();
  manager.move(to);
  manager.flushFrame();
  await nextTick();
  await nextTick();
};

const drop = async () => {
  await manager.drop();
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
};

/** The drag events, in order. */
const DRAG_EVENTS = new Set(['start', 'over', 'release', 'drop', 'cancel']);
const types = (events: DevtoolsEvent[]) => events.filter((event) => DRAG_EVENTS.has(event.type)).map((event) => event.type);

afterEach(() => {
  unmount?.();
  unmount = null;
  bridge?.disconnect();
  bridge = null;
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('the devtools hook', () => {
  it('is absent until the bridge connects; providers set up before are not seen', async () => {
    mount();
    await nextTick();
    expect('__VUE_DND_KIT_DEVTOOLS_HOOK__' in globalThis).toBe(false);
    bridge = connectDevtools();
    expect(bridge.providers()).toEqual([]);
    expect(connectDevtools()).toBe(bridge);
    bridge.disconnect();
    expect('__VUE_DND_KIT_DEVTOOLS_HOOK__' in globalThis).toBe(false);
  });

  it('is never looked up in production builds', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    bridge = connectDevtools();
    mount();
    await nextTick();
    expect(bridge.providers()).toEqual([]);
  });

  it('gets the providers set up while connected, until they unmount', async () => {
    bridge = connectDevtools();
    const added = vi.fn();
    const removed = vi.fn();
    bridge.subscribe({ added, removed });
    const app = mount();
    await nextTick();
    const [provider] = bridge.providers();
    expect(added).toHaveBeenCalledWith(provider);
    expect(provider!.label).toBe('DnDProvider · KanbanBoard');
    // By reference: a deep match would walk the whole app.
    expect(provider!.app).toBe(app);
    expect(provider!.id).toMatch(/^provider-\d+$/);
    unmount!();
    unmount = null;
    expect(removed).toHaveBeenCalledWith(provider);
    expect(bridge.providers()).toEqual([]);
  });

  it('only records a provider until someone listens', async () => {
    bridge = connectDevtools();
    mount();
    await nextTick();
    const monitors = manager.monitors.size;
    const event = vi.fn();
    bridge.subscribe({ event });
    expect(manager.monitors.size).toBe(monitors + 1);
    manager.selection.add('a1');
    await nextTick();
    expect(event).toHaveBeenCalledWith(bridge.providers()[0], { type: 'selection', ids: ['a1'] });
  });
});

describe('snapshots', () => {
  it('list the draggables, drop targets, lists and trees as they are', async () => {
    bridge = connectDevtools();
    mount();
    await nextTick();
    manager.selection.add('a2');
    const snapshot = bridge.providers()[0]!.snapshot();
    expect(snapshot.status).toBe('idle');
    expect(snapshot.selection).toEqual(['a2']);
    expect(snapshot.draggables.map((entry) => [entry.id, entry.list])).toEqual([
      ['a1', 'a'],
      ['a2', 'a'],
      ['a3', 'a'],
      ['f', 't'],
      ['f1', 't'],
      ['x', 't'],
      ['chip', null],
    ]);
    expect(snapshot.draggables.find((entry) => entry.id === 'chip')).toMatchObject({
      type: ['card'],
      disabled: false,
      selected: false,
      dragging: false,
      data: { kind: 'chip' },
    });
    expect(snapshot.draggables.find((entry) => entry.id === 'a2')).toMatchObject({ type: ['g'], selected: true });
    const trash = snapshot.droppables.find((entry) => entry.id === 'trash');
    expect(trash).toMatchObject({ accept: 'card', acceptMode: 'all', priority: 2, sortable: false, over: false, accepting: null });
    expect(trash!.element).toBeInstanceOf(HTMLDivElement);
    expect(snapshot.droppables.filter((entry) => entry.sortable).map((entry) => entry.id)).toEqual(['a', 't']);
    expect(snapshot.groups.map((g) => [g.name, g.lists.map((list) => `${list.kind}:${String(list.id)}`)])).toEqual([
      ['g', ['list:a']],
      ['sortable:t', ['tree:t']],
    ]);
    expect(snapshot.groups[0]!.lists[0]).toMatchObject({
      strategy: 'vertical',
      multiple: 'group',
      pull: true,
      count: 3,
      keys: ['a1', 'a2', 'a3'],
      draft: null,
      controlled: false,
    });
    expect(snapshot.groups[1]!.lists[0]).toMatchObject({ count: 3, keys: ['f', 'f1', 'x'] });
    expect(snapshot.session).toMatchObject({ status: 'idle', active: null, over: null, mode: 'move' });
  });

  it('show the session and the drafts during a drag', async () => {
    bridge = connectDevtools();
    mount();
    await nextTick();
    await drag('a1', at(0, 0), at(0, 2, 0.75));
    const snapshot = bridge.providers()[0]!.snapshot();
    expect(snapshot.session).toMatchObject({
      status: 'dragging',
      active: { id: 'a1', ids: ['a1'], sensor: 'pointer' },
      over: { id: 'a', accepted: true },
      overlay: true,
    });
    expect(snapshot.session.fitSize).toEqual({ width: 200, height: ROW });
    const [g] = snapshot.groups;
    expect(g!.session).toMatchObject({ activeKey: 'a1', kind: 'move', origin: { list: 'a', index: 0 }, list: 'a' });
    expect(g!.lists[0]).toMatchObject({ draft: ['a2', 'a3', 'a1'], over: true, accepting: true });
    expect(snapshot.draggables.find((entry) => entry.id === 'a1')!.dragging).toBe(true);
    // The tree is in another group: it never takes the list's items.
    expect(snapshot.droppables.find((entry) => entry.id === 't')!.accepting).toBe(false);
    expect(snapshot.droppables.find((entry) => entry.id === 'trash')!.accepting).toBe(false);
    await drop();
  });
});

describe('events', () => {
  it('of a sortable drop: start, target, release, the drop with its result', async () => {
    const events = connect();
    mount();
    await nextTick();
    await drag('a1', at(0, 0), at(0, 2, 0.75));
    await drop();
    expect(types(events)).toEqual(['start', 'over', 'release', 'drop']);
    expect(events.filter((event) => event.type === 'status').map((event) => event.type === 'status' && event.status)).toEqual([
      'dragging',
      'dropping',
      'idle',
    ]);
    const [start, over, , end] = events.filter((event) => DRAG_EVENTS.has(event.type));
    expect(start).toMatchObject({ type: 'start', drag: 1, active: { id: 'a1' }, source: 'a' });
    expect(over).toMatchObject({ type: 'over', drag: 1, over: { id: 'a', accepted: true }, previous: null });
    expect(end).toMatchObject({ type: 'drop', drag: 1, dropped: true, accepted: ['a1'], rejected: [] });
    const [sortable] = end!.type === 'drop' ? end!.sortable : [];
    expect(sortable).toMatchObject({
      group: 'g',
      from: { list: 'a', index: 0 },
      to: { list: 'a', index: 2 },
      mode: 'move',
      defaultPrevented: false,
    });
    expect(sortable!.result.get('a')).toEqual([{ id: 'a2' }, { id: 'a3' }, { id: 'a1' }]);
  });

  it('tell why a drag ended without a drop', async () => {
    const events = connect();
    mount({ chipType: 'other' });
    await nextTick();
    const reasons = () => events.flatMap((event) => (event.type === 'cancel' ? [event.reason] : []));

    // The target's `accept` refuses the chip.
    await drag('chip', at(3, 0), at(2, 0));
    await drop();
    // A monitor rejects the drop.
    const veto = manager.addMonitor({ onBeforeDrop: () => false });
    await drag('a1', at(0, 0), at(0, 2, 0.75));
    await drop();
    veto();
    // Cancelled before a drop.
    await drag('a1', at(0, 0), at(0, 2, 0.75));
    manager.cancel();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(reasons()).toEqual(['refused', 'rejected', 'cancelled']);
    // The user's monitors decide first: the list never prepared its drop.
    const rejected = events.find((event) => event.type === 'cancel' && event.reason === 'rejected');
    expect(rejected).toMatchObject({ drag: 2, sortable: [] });
    expect(rejected!.type === 'cancel' && rejected!.waited).toBeGreaterThanOrEqual(0);
  });

  it('of a drop on a plain drop target, of the announcements and the selection', async () => {
    const events = connect();
    mount();
    await nextTick();
    manager.selection.add('x');
    await nextTick();
    await drag('chip', at(3, 0), at(2, 0));
    await drop();
    const end = events.find((event) => event.type === 'drop');
    expect(end).toMatchObject({ over: { id: 'trash', accepted: true }, dropped: true, sortable: [] });
    expect(events.find((event) => event.type === 'selection')).toEqual({ type: 'selection', ids: ['x'] });
    expect(events.some((event) => event.type === 'announcement' && event.text.length > 0)).toBe(true);
  });
});

describe('changes no drag made', () => {
  it('are told for lists with animate on, not for the changes of a drag', async () => {
    // Animations that never end (happy-dom's reject when the next pass cancels them).
    vi.spyOn(Element.prototype, 'animate').mockImplementation(
      () => ({ playState: 'running', cancel() {}, addEventListener() {}, finished: new Promise(() => {}) }) as unknown as Animation,
    );
    const events = connect();
    mount({ animate: true });
    // The group's lists are read once the render that created it is done.
    await nextTick();
    await nextTick();
    const changes = () => events.filter((event) => event.type === 'change');
    listItems.value = [{ id: 'a3' }, { id: 'a1' }, { id: 'a4' }];
    await nextTick();
    expect(changes()).toEqual([{ type: 'change', group: 'g', list: 'a', added: ['a4'], removed: ['a2'], reordered: true }]);
    // The drop writes the list: the drag's own change.
    await drag('a3', at(0, 0), at(0, 2, 0.75));
    await drop();
    expect(listItems.value.map((item) => item.id)).toEqual(['a1', 'a4', 'a3']);
    expect(changes()).toHaveLength(1);
  });

  it('are not told for lists without animate', async () => {
    const events = connect();
    mount();
    await nextTick();
    await nextTick();
    listItems.value = [{ id: 'a2' }];
    await nextTick();
    expect(events.some((event) => event.type === 'change')).toBe(false);
  });
});

describe('sensors', () => {
  it('the start tells which sensor started the drag; none for a drag started without one', async () => {
    const events = connect();
    let context!: SensorContext;
    const joystick: Sensor = { name: 'joystick', setup: (sensorContext) => void (context = sensorContext) };
    mount({ sensors: [joystick] });
    await nextTick();
    const started = context.activate({ target: 'chip' });
    expect(started?.state).toBe('dragging');
    started!.cancel();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    await drag('a1', at(0, 0), at(0, 2, 0.75));
    manager.cancel();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    const starts = events.flatMap((event) => (event.type === 'start' ? [[event.active.id, event.sensor]] : []));
    expect(starts).toEqual([
      ['chip', { name: 'joystick', touch: false }],
      ['a1', null],
    ]);
  });
});

describe('actions', () => {
  it('cancel the drag and clear the selection', async () => {
    bridge = connectDevtools();
    mount();
    await nextTick();
    const [provider] = bridge.providers();
    manager.selection.add('a1');
    manager.selection.add('a2');
    provider!.clearSelection();
    expect(manager.selection.size).toBe(0);
    await drag('a1', at(0, 0), at(0, 2, 0.75));
    provider!.cancel();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  });

  it("hand out the provider's context: a sensor runs in it from outside its components", async () => {
    const events = connect();
    mount();
    await nextTick();
    const [provider] = bridge!.providers();
    // What the plugin does: an app that is never mounted provides it to `useSensor`.
    const holder = createApp({});
    provideDnDContext(holder, provider!.context);
    let context!: SensorContext;
    const scope = effectScope(true);
    scope.run(() => holder.runWithContext(() => useSensor({ name: 'devtools', setup: (sensorContext) => void (context = sensorContext) })));
    const started = context.activate({ target: 'a1', type: 'keyboard' })!;
    expect(manager.active.value?.id).toBe('a1');
    expect(await started.place({ index: 2 })).toBe(true);
    expect(await started.drop()).toBe(true);
    expect(listItems.value.map((item) => item.id)).toEqual(['a2', 'a3', 'a1']);
    expect(events.find((event) => event.type === 'start')).toMatchObject({ sensor: { name: 'devtools' } });
    // Stopped with its scope, like any sensor: its drag is cancelled.
    const next = context.activate({ target: 'a2', type: 'keyboard' })!;
    scope.stop();
    expect(next.state).toBe('ended');
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  });
});
