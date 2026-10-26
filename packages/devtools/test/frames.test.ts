import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { connectDevtools } from '@vue-dnd-kit/core/devtools';
import { DnDDevtools } from '../src/index';
import { stop } from '../src/plugin';
import type { MapFrame } from '../src/protocol';
import { at, drag, drop, mountBoard, type Fixture } from './fixture';
import { installChannel, openTab, type Tab } from './harness';

let fixture: Fixture | null = null;
let tab: Tab | null = null;

const open = async () => {
  fixture = await mountBoard({ list: { placeholder: 'indicator' } }, DnDDevtools);
  tab = await openTab();
  return { ...fixture, tab };
};

/** The copies sent so far, by id. */
const copies = (tab: Tab) => new Map(tab.messages.flatMap((message) => (message.type === 'copies' ? message.copies : [])));
const zone = (frame: MapFrame, id: string | null) => frame.zones.find((entry) => entry.id === id)!;

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

describe('the mini-map', () => {
  it('has a zone per list, tree and drop target, and one for the plain draggables, with copies of the items', async () => {
    const { tab } = await open();
    const { frame } = await tab.next('frame');
    expect(frame.zones.map((entry) => [entry.kind, entry.id, entry.items.map((item) => item.id)])).toEqual([
      ['list', 'a', ['a1', 'a2', 'a3']],
      ['tree', 't', ['f', 'f1', 'x']],
      ['droppable', 'trash', []],
      ['free', null, ['chip']],
    ]);
    expect(zone(frame, 'a').rect).toEqual({ x: 0, y: 0, w: 200, h: 120 });
    expect(zone(frame, 'a').items[1]!.rect).toEqual({ x: 0, y: 40, w: 200, h: 40 });
    // The copies are the library's clones, sent once.
    const sent = copies(tab);
    const a1 = sent.get(zone(frame, 'a').items[0]!.copy)!;
    expect(a1).toMatch(/^<li[^>]*>a1<\/li>$/);
    expect(a1).not.toContain('data-dnd-');
    // A shell: the zone in its ancestors (display: contents), without its items.
    expect(sent.get(zone(frame, 'a').shell)).toMatch(
      /^<div data-v-app="" style="display: contents"><ul data-col="0" style="position: relative;[^"]*" data-devtools-zone><\/ul><\/div>$/,
    );
    expect(tab.last('styles')!.css).toContain(':host {');

    // Copies are made again only when the element changed.
    const next = await tab.next('frame');
    expect(zone(next.frame, 'a').items[0]!.copy).toBe(zone(frame, 'a').items[0]!.copy);
  });

  it('follows a drag: the placeholder, the target, who accepts, the pointer, the overlay, the insertion line', async () => {
    const { tab, manager } = await open();
    await drag(manager, 'a1', at(0, 0), at(0, 2, 0.75));
    const { frame } = await tab.next('frame', (message) => !!message.frame.pointer);
    const list = zone(frame, 'a');
    expect(list).toMatchObject({ over: true, accepting: true });
    expect(zone(frame, 't').accepting).toBe(false);
    expect(list.items.find((item) => item.id === 'a1')).toMatchObject({ placeholder: true, dragging: true });
    expect(frame.pointer).toEqual(at(0, 2, 0.75));
    // `placeholder: 'indicator'`: a line after the last row of `a`.
    expect(frame.indicator).toMatchObject({ list: 'a', rect: { x: 0, w: 200, h: 2 } });
    expect(frame.overlay).not.toBeNull();
    // What the overlay shows, copied.
    await tab.until(() => !!tab.last('preview')?.html);
    expect(tab.last('preview')!.html).toContain('a1');
    await drop(manager);
    await tab.until(() => tab.last('preview')!.html === null);
  });

  it('stops sending once no tab watches', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date', 'performance'] });
    try {
      const { tab } = await open();
      await vi.advanceTimersByTimeAsync(600);
      const count = tab.messages.length;
      await vi.advanceTimersByTimeAsync(600);
      expect(tab.messages.length).toBeGreaterThan(count);
      // No watch for a while.
      await vi.advanceTimersByTimeAsync(5000);
      const after = tab.messages.length;
      await vi.advanceTimersByTimeAsync(2000);
      expect(tab.messages.length).toBe(after);
    } finally {
      vi.useRealTimers();
    }
  });
});
