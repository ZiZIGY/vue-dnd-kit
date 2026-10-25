import { nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { connectDevtools, type DevtoolsProvider } from '@vue-dnd-kit/core/devtools';
import { DnDDevtools, autoSetupDnDDevtools } from '../src/index';
import { timelineEntries } from '../src/timeline';
import type { InspectorNode, InspectorState } from '../src/format';
import { open, registrations, type FakeDevtools } from './api';
import { at, drag, drop, mountBoard, type Fixture } from './fixture';

vi.mock('@vue/devtools-api', () => ({ setupDevtoolsPlugin: vi.fn() }));

let fixture: Fixture | null = null;

/** Mounts the board with the plugin installed, and opens the DevTools. */
const mountWithDevtools = async (options: Parameters<typeof mountBoard>[0] = {}) => {
  fixture = await mountBoard(options, DnDDevtools);
  return { ...fixture, devtools: open(fixture.app) };
};

/** `label [tag, tag]` of every node, nested. */
const outline = (nodes: InspectorNode[]): unknown[] =>
  nodes.map((node) => {
    const line = node.tags?.length ? `${node.label} [${node.tags.map((tag) => tag.label).join(', ')}]` : node.label;
    return node.children?.length ? { [line]: outline(node.children) } : line;
  });

/** A section of a state payload as `key: value`. */
const section = (state: InspectorState | null, name: string) =>
  Object.fromEntries((state?.[name] ?? []).map((field) => [field.key, field.value]));

const titles = (devtools: FakeDevtools) => devtools.timeline.map(({ event }) => event.title);
const entry = (devtools: FakeDevtools, title: string) => devtools.timeline.find(({ event }) => event.title === title)!.event;

afterEach(() => {
  fixture?.unmount();
  fixture = null;
  connectDevtools().disconnect();
  // Forgets the registrations (the mocked `setupDevtoolsPlugin` calls).
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  document.querySelector('[data-dnd-devtools-highlight]')?.remove();
});

describe('installation', () => {
  it('nothing happens when the plugin is not installed', async () => {
    fixture = await mountBoard();
    expect(registrations()).toHaveLength(0);
    expect('__VUE_DND_KIT_DEVTOOLS_HOOK__' in globalThis).toBe(false);
  });

  it('production builds skip it', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    fixture = await mountBoard({}, DnDDevtools);
    expect(registrations()).toHaveLength(0);
    expect('__VUE_DND_KIT_DEVTOOLS_HOOK__' in globalThis).toBe(false);
  });

  it('registers once per app; providers are followed only once the DevTools set it up', async () => {
    fixture = await mountBoard({}, DnDDevtools);
    fixture.app.use(DnDDevtools);
    expect(registrations()).toHaveLength(1);
    expect(registrations()[0]![0]).toMatchObject({ id: 'dev.vue-dnd-kit', label: 'Vue DnD Kit', packageName: '@vue-dnd-kit/devtools' });
    expect(registrations()[0]![0].app).toBe(fixture.app);
    const monitors = fixture.manager.monitors.size;
    const devtools = open(fixture.app);
    expect(fixture.manager.monitors.size).toBe(monitors + 1);
    expect(devtools.inspector).toMatchObject({ id: 'vue-dnd-kit', label: 'Vue DnD Kit' });
  });

  it('auto: every app a provider renders in', async () => {
    autoSetupDnDDevtools();
    fixture = await mountBoard();
    expect(registrations().map(([descriptor]) => descriptor.app)).toEqual([fixture.app]);
  });
});

describe('the inspector', () => {
  it('shows the provider with its session, selection, draggables, drop targets, lists and trees', async () => {
    const { devtools } = await mountWithDevtools();
    expect(outline(devtools.tree())).toEqual([
      {
        'DnDProvider · Board [idle]': [
          'Drag session',
          'Selection [0]',
          { 'Draggables [1]': ['chip [chip]'] },
          { 'Drop targets [1]': ['trash [accept: chip, priority 1]'] },
          {
            'Sortable lists and trees [2]': [
              { 'list a [3 items, group: cards]': ['a1', 'a2', 'a3'] },
              { 'tree t [3 items]': ['f', 'f1', 'x'] },
            ],
          },
        ],
      },
    ]);
    // A filter keeps the matching nodes and the way to them.
    expect(outline(devtools.tree('A2'))).toEqual([
      { 'DnDProvider · Board [idle]': [{ 'Sortable lists and trees [2]': [{ 'list a [3 items, group: cards]': ['a2'] }] }] },
    ]);
  });

  it('tags what a drag changes: the draft, the target, who accepts', async () => {
    const { devtools, manager } = await mountWithDevtools();
    manager.selection.add('a1');
    await drag(manager, 'a1', at(0, 0), at(0, 2, 0.75));
    const [provider] = outline(devtools.tree()) as Array<Record<string, unknown[]>>;
    expect(provider!['DnDProvider · Board [dragging]']).toEqual([
      'Drag session [dragging, a1]',
      'Selection [1]',
      { 'Draggables [1]': ['chip [chip]'] },
      { 'Drop targets [1]': ['trash [refuses, accept: chip, priority 1]'] },
      {
        'Sortable lists and trees [2]': [
          { 'list a [over, accepts, 3 items, group: cards, draft]': ['a2', 'a3', 'a1 [dragging, selected]'] },
          // Another group: it never takes the list's items, and keeps no draft.
          { 'tree t [refuses, 3 items]': ['f', 'f1', 'x'] },
        ],
      },
    ]);
    await drop(manager);
  });

  it('gives the state of each node and highlights its element', async () => {
    const { devtools, manager } = await mountWithDevtools();
    const ids = new Map(devtools.tree().length ? collect(devtools.tree()) : []);

    const provider = devtools.state(ids.get('DnDProvider · Board')!);
    expect(section(provider, 'provider')).toMatchObject({ status: 'idle', draggables: 7, 'drop targets': 1, 'lists and trees': 2 });
    expect(section(provider, 'props')).toMatchObject({ animation: false, dropAnimation: false, autoScroll: true, overlayFit: 'slot' });

    const chip = devtools.state(ids.get('chip')!);
    expect(section(chip, 'draggable')).toMatchObject({ id: 'chip', type: ['chip'], disabled: false, list: null });
    expect(section(chip, 'data')).toEqual({ data: { color: 'red' } });
    expect(section(chip, 'element').element).toBeInstanceOf(HTMLSpanElement);
    // Selecting the node highlights the chip on the page.
    const box = document.querySelector<HTMLElement>('[data-dnd-devtools-highlight]')!;
    expect(box.textContent).toBe('draggable chip');
    expect([box.style.left, box.style.width, box.style.opacity]).toEqual(['900px', '200px', '1']);

    const trash = devtools.state(ids.get('trash')!);
    expect(section(trash, 'drop target')).toMatchObject({ accept: 'chip', acceptMode: 'all', priority: 1, over: false, accepting: null });

    const tree = devtools.state(ids.get('tree t')!);
    expect(section(tree, 'tree')).toMatchObject({ id: 't', items: 3, controlled: false });
    expect(section(tree, 'order')).toEqual({ keys: ['f', 'f1', 'x'], draft: null });

    await drag(manager, 'a1', at(0, 0), at(0, 2, 0.75));
    const list = devtools.state(ids.get('list a')!);
    expect(section(list, 'list')).toMatchObject({ group: 'cards', items: 3, over: true, accepting: true });
    expect(section(list, 'options')).toMatchObject({ strategy: 'vertical', multiple: 'group', pull: true, dropOutside: 'placeholder' });
    expect(section(list, 'order')).toEqual({ keys: ['a1', 'a2', 'a3'], draft: ['a2', 'a3', 'a1'] });
    expect(section(list, 'group').session).toMatchObject({ activeKey: 'a1', kind: 'move', origin: { list: 'a', index: 0 } });

    const session = devtools.state(ids.get('Drag session')!);
    expect(section(session, 'session')).toMatchObject({ status: 'dragging', mode: 'move' });
    expect(section(session, 'active')).toMatchObject({ id: 'a1', ids: ['a1'], sensor: 'pointer' });
    expect(section(session, 'over')).toMatchObject({ id: 'a', accepted: true });
    expect(section(session, 'overlay')).toMatchObject({ overlay: true, 'fit size': { width: 200, height: 40 } });
    expect(session!['sortable session']![0]).toMatchObject({ key: 'cards', value: { activeKey: 'a1' } });
    await drop(manager);
  });
});

/** Label → node id of every node. */
const collect = (nodes: InspectorNode[]): Array<[string, string]> =>
  nodes.flatMap((node) => [[node.label, node.id] as [string, string], ...collect(node.children ?? [])]);

describe('the timeline', () => {
  it('logs a sortable drop: start, target, release, the verdict, the drop and its result', async () => {
    const { devtools, manager } = await mountWithDevtools({ list: { onDrop: (event) => event.preventDefault() } });
    await drag(manager, 'a1', at(0, 0), at(0, 2, 0.75));
    await drop(manager);
    expect(titles(devtools).filter((title) => title !== 'announcement')).toEqual(['drag start', 'over', 'release', 'onBeforeDrop', 'drop']);
    expect(entry(devtools, 'drag start').subtitle).toBe('a1 · pointer · from a');
    expect(entry(devtools, 'over').subtitle).toBe('a · accepts');
    expect(entry(devtools, 'onBeforeDrop').subtitle).toMatch(/^accepted · \d+ ms$/);
    const end = entry(devtools, 'drop');
    expect(end.subtitle).toBe('on a · move a[0] → a[2] (prevented)');
    expect(end.data.sortable[0].result.get('a')).toEqual([{ id: 'a2' }, { id: 'a3' }, { id: 'a1' }]);
    // One drag, one group: its announcements included.
    expect(new Set(devtools.timeline.map(({ event }) => event.groupId))).toEqual(new Set([expect.stringMatching(/:1$/)]));
    expect(devtools.timeline.every(({ layerId }) => layerId === 'vue-dnd-kit')).toBe(true);
  });

  it('logs a refused drop, a rejection and a cancel', async () => {
    const { devtools, manager } = await mountWithDevtools();
    // The trash takes chips only.
    await drag(manager, 'a1', at(0, 0), at(2, 0));
    await drop(manager);
    expect(entry(devtools, 'onBeforeDrop')).toMatchObject({ logType: 'warning', subtitle: expect.stringMatching(/^refused by trash's accept/) });
    expect(entry(devtools, 'cancel').subtitle).toBe('drop refused');

    devtools.timeline.length = 0;
    const veto = manager.addMonitor({ onBeforeDrop: () => false });
    await drag(manager, 'chip', at(3, 0), at(2, 0));
    await drop(manager);
    veto();
    expect(entry(devtools, 'onBeforeDrop').subtitle).toMatch(/^rejected/);
    expect(entry(devtools, 'cancel').subtitle).toBe('drop rejected');

    devtools.timeline.length = 0;
    await drag(manager, 'a1', at(0, 0), at(0, 2, 0.75));
    // The inspector's action.
    devtools.inspector.actions![0]!.action();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(titles(devtools)).not.toContain('onBeforeDrop');
    expect(entry(devtools, 'cancel')).toMatchObject({ subtitle: 'cancelled', logType: 'default' });
  });

  it('names the sensor that started a drag', () => {
    const provider = { id: 'provider-x', label: 'DnDProvider' } as DevtoolsProvider;
    const start = (sensor: { name: string | undefined; touch: boolean } | null) =>
      timelineEntries(
        provider,
        {
          type: 'start',
          drag: 3,
          active: { id: 'chip', ids: ['chip'], items: [], type: [], sensor: 'pointer', element: document.body, rect: {} as never },
          pointer: { x: 0, y: 0 },
          source: null,
          sensor,
        },
        { drag: null, released: false },
      )[0]!;
    expect(start({ name: 'joystick', touch: false }).subtitle).toBe('chip · joystick (pointer)');
    expect(start({ name: 'pointer', touch: true }).subtitle).toBe('chip · pointer · touch');
    expect(start(null)).toMatchObject({ subtitle: 'chip · pointer', groupId: 'provider-x:3' });
  });

  it('refreshes the inspector on events, and the state at most every 200 ms while moving', async () => {
    const { devtools, manager } = await mountWithDevtools();
    devtools.sendInspectorTree.mockClear();
    await drag(manager, 'chip', at(3, 0), at(2, 0));
    expect(devtools.sendInspectorTree).toHaveBeenCalledWith('vue-dnd-kit');
    const states = devtools.sendInspectorState.mock.calls.length;
    for (let i = 0; i < 5; i++) {
      manager.move(at(2, 0, 0.1 * i));
      manager.flushFrame();
    }
    expect(devtools.sendInspectorState.mock.calls.length - states).toBeLessThanOrEqual(1);
    await drop(manager);
  });
});

describe('actions', () => {
  it('clear the selection', async () => {
    const { devtools, manager } = await mountWithDevtools();
    manager.selection.add('a1');
    manager.selection.add('chip');
    devtools.inspector.actions![1]!.action();
    expect(manager.selection.size).toBe(0);
    await nextTick();
  });
});
