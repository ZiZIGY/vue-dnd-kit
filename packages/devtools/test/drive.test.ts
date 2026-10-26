import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { connectDevtools } from '@vue-dnd-kit/core/devtools';
import { DnDDevtools } from '../src/index';
import { stop } from '../src/plugin';
import { MOVES } from '../src/agent/moves';
import { speedOf, DEAD_ZONE, MAX_SPEED } from '../src/agent/stick';
import { mountBoard, type Fixture, type FixtureOptions } from './fixture';
import { installChannel, openTab, type Tab } from './harness';
import type { DnDManager } from '../../core/src/core/manager';

let fixture: Fixture | null = null;
let tab: Tab | null = null;

const open = async (options: FixtureOptions = {}) => {
  fixture = await mountBoard(options, DnDDevtools);
  tab = await openTab();
  const provider = tab.last('state')!.providers[0]!.id;
  return { ...fixture, tab, provider };
};

const idle = (manager: DnDManager) => vi.waitFor(() => expect(manager.status.value).toBe('idle'));

beforeEach(installChannel);

afterEach(async () => {
  tab?.close();
  tab = null;
  fixture?.unmount();
  fixture = null;
  await stop();
  connectDevtools().disconnect();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('moves', () => {
  it("move an item of a sortable list by a keyboard drag of the `devtools` sensor, one after another", async () => {
    const { tab, order, provider } = await open({ second: true });
    tab.send({ type: 'move', provider, id: 'a1', to: 'down' });
    tab.send({ type: 'move', provider, id: 'a1', to: 'down' });
    await vi.waitFor(() => expect(order('a')).toEqual(['a2', 'a3', 'a1']));
    tab.send({ type: 'move', provider, id: 'a1', to: 'start' });
    await vi.waitFor(() => expect(order('a')).toEqual(['a1', 'a2', 'a3']));
    // To another list (the end, or an index).
    tab.send({ type: 'move', provider, id: 'a3', to: { list: 'b', index: 0 } });
    await vi.waitFor(() => expect(order('b')).toEqual(['a3', 'b1', 'b2']));
    await tab.until(() => tab.logged().filter((line) => line.startsWith('drop')).length === 4);
    expect(tab.logged().filter((line) => line.startsWith('drag start'))).toEqual([
      'drag start: a1 · devtools (keyboard) · from a',
      'drag start: a1 · devtools (keyboard) · from a',
      'drag start: a1 · devtools (keyboard) · from a',
      'drag start: a3 · devtools (keyboard) · from a',
    ]);
    expect([MOVES.up({ list: 'a', index: 2, count: 3 }), MOVES.end()]).toEqual([{ index: 1 }, {}]);
  });

  it('nothing moves at the ends of a list, nor tree items and plain draggables', async () => {
    const { tab, order, provider, manager } = await open();
    tab.send({ type: 'move', provider, id: 'a1', to: 'up' });
    tab.send({ type: 'move', provider, id: 'f', to: 'down' });
    tab.send({ type: 'move', provider, id: 'chip', to: 'down' });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(order('a')).toEqual(['a1', 'a2', 'a3']);
    expect(tab.logged()).toEqual([]);
    expect(manager.status.value).toBe('idle');
  });
});

describe('the joystick', () => {
  it('speeds up with the tilt, nothing in the dead zone', () => {
    expect(speedOf(DEAD_ZONE)).toBe(0);
    expect(speedOf(1)).toBe(MAX_SPEED);
    expect(speedOf(0.5)).toBeGreaterThan(0);
    expect(speedOf(0.5)).toBeLessThan(MAX_SPEED / 2);
  });

  it('picks the chosen item up, steers it as a pointer drag and drops it through the whole pipeline', async () => {
    const onDrop = vi.fn();
    const { tab, order, provider, manager } = await open({ list: { onDrop } });
    tab.send({ type: 'stick', x: 0, y: 1, grab: { provider, id: 'a1' } });
    await vi.waitFor(() => expect(manager.active.value).toMatchObject({ id: 'a1', sensor: 'pointer' }));
    // Down the list: past the middle of a3 (rows are 40px high, a1's center is at 20).
    await vi.waitFor(() => expect(manager.pointer.value!.y).toBeGreaterThan(105), { timeout: 3000 });
    tab.send({ type: 'stick', x: 0, y: 0 });
    expect(manager.pointer.value!.x).toBe(100);
    tab.send({ type: 'drop' });
    await idle(manager);
    expect(order('a')).toEqual(['a2', 'a3', 'a1']);
    expect(onDrop.mock.calls[0]![0]).toMatchObject({ from: { list: 'a', index: 0 }, to: { list: 'a', index: 2 } });
    await tab.until(() => tab.logged().some((line) => line.startsWith('drop')));
    expect(tab.logged()[0]).toBe('drag start: a1 · devtools (pointer) · from a');
  });

  it("steers a drag the page started, cancels it; a disabled item isn't picked up", async () => {
    const { tab, provider, manager } = await open();
    expect(manager.start('chip', { x: 1000, y: 20 }, 'pointer')).toBe(true);
    tab.send({ type: 'stick', x: -1, y: 0, grab: { provider, id: 'a1' } });
    await vi.waitFor(() => expect(manager.pointer.value!.x).toBeLessThan(900));
    expect(manager.active.value!.id).toBe('chip');
    tab.send({ type: 'cancel' });
    await idle(manager);

    tab.send({ type: 'override', provider, target: { kind: 'draggable', id: 'a1' }, option: 'disabled', value: true });
    await tab.next('state', (message) => message.providers[0]!.overrides.length === 1);
    tab.send({ type: 'stick', x: 0, y: 1, grab: { provider, id: 'a1' } });
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(manager.status.value).toBe('idle');
    tab.send({ type: 'stick', x: 0, y: 0 });
  });
});

describe('picking on the page', () => {
  it('the next press on a draggable chooses it, and does nothing else', async () => {
    const { tab, manager } = await open();
    tab.send({ type: 'pick', on: true });
    await tab.next('pick', (message) => message.on);
    const chip = manager.getDraggable('chip')!.getElement()!;
    const press = new PointerEvent('pointerdown', { bubbles: true, composed: true, cancelable: true });
    chip.dispatchEvent(press);
    expect(press.defaultPrevented).toBe(true);
    const picked = await tab.next('pick', (message) => !message.on);
    expect(picked.picked).toMatchObject({ kind: 'draggable', id: 'chip' });
    await tab.next('state', (message) => message.detail?.node.kind === 'draggable');
    expect(manager.status.value).toBe('idle');

    // Escape ends it without a pick.
    tab.send({ type: 'pick', on: true });
    await tab.next('pick', (message) => message.on);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect((await tab.next('pick')).picked).toBeUndefined();
  });
});
