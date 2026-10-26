import { afterEach, describe, expect, it, vi } from 'vitest';
import { connectDevtools } from '@vue-dnd-kit/core/devtools';
import { DnDDevtools } from '../src/index';
import { MOVES, editedMove } from '../src/moves';
import type { InspectorNode, TimelineEvent } from '../src/format';
import { open, type FakeDevtools } from './api';
import { mountBoard, type Fixture, type FixtureOptions } from './fixture';
import type { DnDManager } from '../../core/src/core/manager';

vi.mock('@vue/devtools-api', () => ({ setupDevtoolsPlugin: vi.fn() }));

let fixture: Fixture | null = null;

/** Label → node id of every node. */
const collect = (nodes: InspectorNode[]): Array<[string, string]> =>
  nodes.flatMap((node) => [[node.label, node.id] as [string, string], ...collect(node.children ?? [])]);

/** Mounts the board with the plugin installed, opens the DevTools; `node(label)` is the id of a node. */
const mountWithDevtools = async (options: FixtureOptions = {}) => {
  fixture = await mountBoard(options, DnDDevtools);
  const devtools = open(fixture.app);
  const ids = new Map(collect(devtools.tree()));
  return { ...fixture, devtools, node: (label: string) => ids.get(label)! };
};

const idle = (manager: DnDManager) => vi.waitFor(() => expect(manager.status.value).toBe('idle'));

/** The timeline without announcements. */
const logged = (devtools: FakeDevtools): TimelineEvent[] =>
  devtools.timeline.map(({ event }) => event).filter((event) => event.title !== 'announcement');
const subtitles = (devtools: FakeDevtools, title: string) =>
  logged(devtools)
    .filter((event) => event.title === title)
    .map((event) => event.subtitle);

afterEach(() => {
  fixture?.unmount();
  fixture = null;
  connectDevtools().disconnect();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('moves from the inspector', () => {
  it("the node's buttons move an item of a sortable list, each by a drag of the `devtools` sensor", async () => {
    const { devtools, order, node } = await mountWithDevtools();
    await devtools.nodeAction('arrow_downward', node('a1'));
    expect(order('a')).toEqual(['a2', 'a1', 'a3']);
    await devtools.nodeAction('arrow_upward', node('a3'));
    expect(order('a')).toEqual(['a2', 'a3', 'a1']);
    await devtools.nodeAction('vertical_align_top', node('a1'));
    expect(order('a')).toEqual(['a1', 'a2', 'a3']);
    await devtools.nodeAction('vertical_align_bottom', node('a2'));
    expect(order('a')).toEqual(['a1', 'a3', 'a2']);
    // Real drags: the timeline logs each, started by the inspector's sensor (as a keyboard drag).
    expect(subtitles(devtools, 'drag start')).toEqual([
      'a1 · devtools (keyboard) · from a',
      'a3 · devtools (keyboard) · from a',
      'a1 · devtools (keyboard) · from a',
      'a2 · devtools (keyboard) · from a',
    ]);
    expect(subtitles(devtools, 'drop').map((subtitle) => subtitle!.replace(/^on \S+ · /, ''))).toEqual([
      'move a[0] → a[1]',
      'move a[2] → a[1]',
      'move a[2] → a[0]',
      'move a[1] → a[2]',
    ]);
    expect(subtitles(devtools, 'onBeforeDrop')).toHaveLength(4);
  });

  it('moves clicked in a row read where the item is when their turn comes', async () => {
    const { devtools, order, node } = await mountWithDevtools();
    await Promise.all([devtools.nodeAction('arrow_downward', node('a1')), devtools.nodeAction('arrow_downward', node('a1'))]);
    expect(order('a')).toEqual(['a2', 'a3', 'a1']);
  });

  it('nothing moves at the ends of a list, nor tree items, plain draggables and other nodes', async () => {
    const { devtools, order, node, manager } = await mountWithDevtools();
    await devtools.nodeAction('arrow_upward', node('a1'));
    await devtools.nodeAction('vertical_align_bottom', node('a3'));
    // Trees place items by depth too: `moveItem` doesn't take them.
    await devtools.nodeAction('arrow_downward', node('f'));
    await devtools.nodeAction('arrow_downward', node('chip'));
    await devtools.nodeAction('arrow_downward', node('DnDProvider · Board'));
    await devtools.nodeAction('arrow_downward', node('list a'));
    expect(order('a')).toEqual(['a1', 'a2', 'a3']);
    expect(logged(devtools)).toEqual([]);
    expect(manager.status.value).toBe('idle');
  });

  it('the editable position of an item moves it: to another list at an index, or by one of its fields', async () => {
    const { devtools, order, node, manager } = await mountWithDevtools({ second: true });
    expect(devtools.state(node('a1'))!.move).toEqual([{ key: 'position', value: { list: 'a', index: 0 }, editable: true }]);
    // Only items of sortable lists have one.
    for (const label of ['f1', 'chip', 'list a']) expect(devtools.state(node(label))!.move).toBeUndefined();

    devtools.edit(node('a1'), ['position'], { list: 'b', index: 1 });
    await vi.waitFor(() => expect(order('b')).toEqual(['b1', 'a1', 'b2']));
    await idle(manager);
    expect(order('a')).toEqual(['a2', 'a3']);
    expect(devtools.state(node('a1'))!.move![0]!.value).toEqual({ list: 'b', index: 1 });
    // Its index (the DevTools' − button), then its list: the index is kept.
    devtools.edit(node('a1'), ['position', 'index'], 0);
    await vi.waitFor(() => expect(order('b')).toEqual(['a1', 'b1', 'b2']));
    await idle(manager);
    devtools.edit(node('a1'), ['position', 'list'], 'a');
    await vi.waitFor(() => expect(order('a')).toEqual(['a1', 'a2', 'a3']));
    await idle(manager);
    expect(subtitles(devtools, 'drag start')).toHaveLength(3);

    // Values that are no position, and other fields, move nothing.
    devtools.edit(node('a1'), ['position'], 'b');
    devtools.edit(node('a1'), ['position', 'index'], 'last');
    devtools.edit(node('a1'), ['position', 'list'], { id: 'b' });
    devtools.edit(node('a1'), ['list'], 'b');
    devtools.edit(node('chip'), ['position'], { list: 'a', index: 0 });
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(subtitles(devtools, 'drag start')).toHaveLength(3);
    expect([order('a'), order('b')]).toEqual([
      ['a1', 'a2', 'a3'],
      ['b1', 'b2'],
    ]);
  });

  it('reads edits as the DevTools send them', () => {
    const at = { list: 'a', index: 2, count: 3 };
    expect(editedMove(['position'], { list: 'b', index: 0 })?.(at)).toEqual({ list: 'b', index: 0 });
    expect(editedMove(['position'], { list: 7 })?.(at)).toEqual({ list: 7 });
    expect(editedMove(['position'], {})?.(at)).toEqual({});
    expect(editedMove(['position', 'index'], 1)?.(at)).toEqual({ index: 1 });
    expect(editedMove(['position', 'list'], 'b')?.(at)).toEqual({ list: 'b', index: 2 });
    expect(editedMove('position', { index: 0 })?.(at)).toEqual({ index: 0 });
    for (const [path, value] of [
      [['position'], null],
      [['position'], [1]],
      [['position'], { index: 1.5 }],
      [['position', 'index'], '1'],
      [['position', 'list'], true],
      [['position', 'other'], 1],
      [['data'], { index: 0 }],
    ] as Array<[string[], unknown]>) {
      expect(editedMove(path, value)).toBeNull();
    }
    expect([MOVES.up(at), MOVES.down(at), MOVES.start(), MOVES.end()]).toEqual([{ index: 1 }, { index: 3 }, { index: 0 }, {}]);
  });
});

describe('a drag from the inspector', () => {
  it('is picked up, stepped and dropped from the inspector, through the whole drop pipeline', async () => {
    const onBeforeDrop = vi.fn();
    const onDrop = vi.fn();
    const { devtools, order, node, manager } = await mountWithDevtools({ list: { onBeforeDrop, onDrop } });
    await devtools.nodeAction('open_with', node('a1'));
    expect(manager.active.value).toMatchObject({ id: 'a1', sensor: 'keyboard' });
    await devtools.action('keyboard_arrow_down');
    await devtools.action('keyboard_arrow_down');
    expect(devtools.state(node('list a'))!.order).toContainEqual({ key: 'draft', value: ['a2', 'a3', 'a1'] });
    await devtools.action('file_download_done');
    await idle(manager);
    expect(order('a')).toEqual(['a2', 'a3', 'a1']);
    expect(onBeforeDrop).toHaveBeenCalledTimes(1);
    expect(onDrop.mock.calls[0]![0]).toMatchObject({ from: { list: 'a', index: 0 }, to: { list: 'a', index: 2 } });
    const events = logged(devtools);
    expect(events.map((event) => event.title)).toEqual(expect.arrayContaining(['drag start', 'release', 'onBeforeDrop', 'drop']));
    expect(subtitles(devtools, 'drag start')).toEqual(['a1 · devtools (keyboard) · from a']);
    expect(subtitles(devtools, 'drop')[0]).toMatch(/move a\[0\] → a\[2\]$/);
    // One drag, one group.
    expect(new Set(events.map((event) => event.groupId)).size).toBe(1);
  });

  it('is cancelled by the cancel button; without a drag the step and drop buttons do nothing', async () => {
    const { devtools, order, node, manager } = await mountWithDevtools();
    await devtools.action('keyboard_arrow_down');
    await devtools.action('file_download_done');
    expect(logged(devtools)).toEqual([]);

    await devtools.nodeAction('open_with', node('a2'));
    await devtools.action('keyboard_arrow_up');
    // One drag at a time: another can't start.
    await devtools.nodeAction('open_with', node('a3'));
    expect(manager.active.value?.id).toBe('a2');
    await devtools.action('cancel');
    await idle(manager);
    expect(order('a')).toEqual(['a1', 'a2', 'a3']);
    expect(subtitles(devtools, 'cancel')).toEqual(['cancelled']);
  });

  it('a plain draggable too: arrows move it by pixels, and a drop on no target is a drop outside', async () => {
    const { devtools, node, manager } = await mountWithDevtools();
    await devtools.nodeAction('open_with', node('chip'));
    expect(manager.active.value?.id).toBe('chip');
    const start = manager.pointer.value!;
    await devtools.action('keyboard_arrow_right');
    expect(manager.pointer.value).toEqual({ x: start.x + 25, y: start.y });
    await devtools.action('file_download_done');
    await idle(manager);
    expect(subtitles(devtools, 'drag start')).toEqual(['chip · devtools (keyboard)']);
  });
});
