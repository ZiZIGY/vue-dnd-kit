import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { connectDevtools } from '@vue-dnd-kit/core/devtools';
import { restrictToVerticalAxis } from '@vue-dnd-kit/core';
import { DnDDevtools, autoSetupDnDDevtools } from '../src/index';
import { stop } from '../src/plugin';
import { TAG, type OptionView, type ProviderView } from '../src/protocol';
import { at, drag, drop, mountBoard, type Fixture } from './fixture';
import { installChannel, openTab, type Tab } from './harness';

let fixture: Fixture | null = null;
let tab: Tab | null = null;

const open = async (options: Parameters<typeof mountBoard>[0] = {}) => {
  fixture = await mountBoard(options, DnDDevtools);
  tab = await openTab();
  return { ...fixture, tab };
};

const providerOf = (tab: Tab): ProviderView => tab.last('state')!.providers[0]!;
const option = (options: OptionView[], name: string) => options.find((entry) => entry.name === name)!;
/** The next state once `check` holds. */
const stateWhere = (tab: Tab, check: (provider: ProviderView) => boolean) =>
  tab.next('state', (message) => !!message.providers[0] && check(message.providers[0]));

beforeEach(installChannel);

afterEach(async () => {
  tab?.close();
  tab = null;
  fixture?.unmount();
  fixture = null;
  await stop();
  connectDevtools().disconnect();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('installation', () => {
  it('nothing happens when the plugin is not installed, or in production', async () => {
    fixture = await mountBoard();
    expect('__VUE_DND_KIT_DEVTOOLS_HOOK__' in globalThis).toBe(false);
    fixture.unmount();
    vi.stubEnv('NODE_ENV', 'production');
    fixture = await mountBoard({}, DnDDevtools);
    autoSetupDnDDevtools();
    expect('__VUE_DND_KIT_DEVTOOLS_HOOK__' in globalThis).toBe(false);
  });

  it('the page announces itself, and follows its providers once a tab watches', async () => {
    fixture = await mountBoard({}, DnDDevtools);
    const monitors = fixture.manager.monitors.size;
    tab = await openTab();
    expect(tab.messages[0]).toMatchObject({ type: 'page', title: expect.any(String) });
    expect(fixture.manager.monitors.size).toBe(monitors + 1);
    expect((globalThis as Record<string, unknown>).__VUE_DND_KIT_DEVTOOLS_PAGE__).toBe(tab.messages[0]!.type === 'page' && tab.messages[0]!.page);
  });
});

describe('the state', () => {
  it('shows each provider: its lists and trees, drop targets, draggables, session and options', async () => {
    const { tab } = await open();
    const provider = providerOf(tab);
    expect(provider).toMatchObject({ label: 'DnDProvider · Board', status: 'idle', selection: [], overrides: [] });
    expect(provider.lists.map((list) => [list.kind, list.id, list.keys])).toEqual([
      ['list', 'a', ['a1', 'a2', 'a3']],
      ['tree', 't', ['f', 'f1', 'x']],
    ]);
    expect(provider.droppables).toMatchObject([{ id: 'trash', accept: 'chip', priority: 1, disabled: false }]);
    expect(provider.draggables.map((entry) => entry.id)).toEqual(['a1', 'a2', 'a3', 'f', 'f1', 'x', 'chip']);
    // Every option that isn't a callback, with its editor; the code's value and the one used.
    expect(option(provider.options, 'overlayFit')).toMatchObject({ value: 'slot', code: 'slot', overridden: false, choices: ['slot', 'source'] });
    expect(option(provider.options, 'animation')).toMatchObject({ value: false, input: 'json', choices: [true, false] });
    expect(option(provider.options, 'modifiers')).toMatchObject({ input: 'names', several: true, value: { [TAG]: 'undefined' } });
    expect(option(provider.lists[0]!.options, 'strategy')).toMatchObject({ choices: ['vertical', 'horizontal', 'grid'] });
    expect(provider.lists[1]!.options.map((entry) => entry.name)).toContain('indentation');
    expect(provider.droppables[0]!.options.map((entry) => entry.name)).toEqual(['disabled', 'priority', 'accept', 'acceptMode']);
  });

  it('follows a drag, and shows the details of the node chosen', async () => {
    const { tab, manager } = await open();
    tab.send({ type: 'select', node: { provider: providerOf(tab).id, kind: 'list', id: 'a' } });
    await drag(manager, 'a1', at(0, 0), at(0, 2, 0.75));
    const dragging = await stateWhere(tab, (provider) => provider.status === 'dragging');
    const [list] = dragging.providers[0]!.lists;
    expect(list).toMatchObject({ keys: ['a2', 'a3', 'a1'], drafting: true, over: true, accepting: true });
    expect(dragging.providers[0]!.session).toMatchObject({ active: { id: 'a1' }, over: { id: 'a', accepted: true } });
    const sections = Object.fromEntries(dragging.detail!.sections.map((section) => [section.name, Object.fromEntries(section.fields)]));
    expect(sections.list).toMatchObject({ id: 'a', group: 'cards', items: 3, over: true });
    expect(sections.order).toEqual({ keys: ['a1', 'a2', 'a3'], draft: ['a2', 'a3', 'a1'] });
    expect(sections.element!.element).toEqual({ [TAG]: 'element', label: '<ul>' });
    await drop(manager);

    tab.send({ type: 'select', node: { provider: providerOf(tab).id, kind: 'draggable', id: 'chip' } });
    const chip = await tab.next('state', (message) => message.detail?.node.kind === 'draggable');
    expect(chip.detail!.options.map((entry) => entry.name)).toEqual(['disabled', 'keyboard', 'activation']);
    expect(Object.fromEntries(chip.detail!.sections.find((section) => section.name === 'data')!.fields)).toEqual({ data: { color: 'red' } });
  });
});

describe('editing options', () => {
  it('overrides apply at once, are listed, and reset', async () => {
    const { tab, manager } = await open();
    const provider = providerOf(tab).id;
    tab.send({ type: 'override', provider, target: { kind: 'list', id: 'a' }, option: 'disabled', value: true });
    const disabled = await stateWhere(tab, (view) => view.lists[0]!.disabled);
    expect(disabled.providers[0]!.overrides).toEqual([{ target: { kind: 'list', id: 'a' }, option: 'disabled', value: true }]);
    expect(option(disabled.providers[0]!.lists[0]!.options, 'disabled')).toMatchObject({ value: true, overridden: true });
    // The list's items can't be dragged.
    expect(manager.getDraggable('a1')!.isDisabled()).toBe(true);

    // The library's modifiers by name: the core's very functions.
    tab.send({ type: 'override', provider, target: { kind: 'provider' }, option: 'modifiers', value: { [TAG]: 'names', names: ['restrictToVerticalAxis'] } });
    await stateWhere(tab, (view) => view.overrides.length === 2);
    expect(manager.props.modifiers).toEqual([restrictToVerticalAxis]);
    expect(option(providerOf(tab).options, 'modifiers').value).toEqual(['restrictToVerticalAxis']);

    tab.send({ type: 'reset', provider, target: { kind: 'list', id: 'a' }, option: 'disabled' });
    await stateWhere(tab, (view) => !view.lists[0]!.disabled);
    tab.send({ type: 'reset' });
    await stateWhere(tab, (view) => view.overrides.length === 0);
    expect(manager.props.modifiers).toBeUndefined();
  });
});

describe('the log', () => {
  it('logs a drag: start, target, release, the verdict, the drop and its result', async () => {
    const { tab, manager } = await open({ list: { onDrop: (event) => event.preventDefault() } });
    await drag(manager, 'a1', at(0, 0), at(0, 2, 0.75));
    await drop(manager);
    await tab.until(() => tab.logged().some((line) => line.startsWith('drop')));
    expect(tab.logged()).toEqual([
      'drag start: a1 · pointer · from a',
      'over: a · accepts',
      'release: on a · onBeforeDrop…',
      expect.stringMatching(/^onBeforeDrop: accepted · \d+ ms$/),
      'drop: on a · move a[0] → a[2] (prevented)',
    ]);
    // One drag: its entries share it.
    const entries = tab.messages.flatMap((message) => (message.type === 'log' ? message.entries : []));
    expect(new Set(entries.map((entry) => entry.drag))).toEqual(new Set([1]));

    tab.send({ type: 'clearLog' });
    expect(await tab.next('log', (message) => !!message.clear)).toMatchObject({ entries: [] });
  });

  it('logs a refused drop, and a drag cancelled from the tab', async () => {
    const { tab, manager } = await open();
    // The trash takes chips only.
    await drag(manager, 'a1', at(0, 0), at(2, 0));
    await drop(manager);
    await tab.until(() => tab.logged().includes('cancel: drop refused'));
    await drag(manager, 'a1', at(0, 0), at(0, 2, 0.75));
    tab.send({ type: 'cancel' });
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    await tab.until(() => tab.logged().includes('cancel: cancelled'));
    expect(tab.logged().filter((line) => line.startsWith('onBeforeDrop'))).toEqual([expect.stringMatching(/^onBeforeDrop: refused by trash's accept/)]);
  });
});
