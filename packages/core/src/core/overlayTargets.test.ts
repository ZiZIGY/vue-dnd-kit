/**
 * Drop targets that shape the overlay: a zone's (or a list's) own overlay while the drag
 * is over it, with the drag's own in its slot; an `overlay` ref switched mid-drag; which
 * `dropAnimation` lands a drop; the drop waiting for the content's own animations; and
 * where a drop would go (`to`).
 */

import {
  createApp,
  defineComponent,
  h,
  nextTick,
  ref,
  shallowRef,
  useTemplateRef,
  type Component,
  type PropType,
  type Ref,
} from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DropAnimation, DropAnimationContext, OverlayProps, Rect } from '../types';
import { createRect } from '../animation/layout';
import { contentAnimations } from '../animation/drop';
import { DnDProvider } from './DnDProvider';
import { useManager } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';
import { makeDroppable } from './makeDroppable';
import { makeSortableItem } from '../sortable/makeSortableItem';
import { makeSortableList } from '../sortable/makeSortableList';

/** An overlay component: says which one it is and where the drop would go, around its slot. */
const marker = (kind: string): Component =>
  defineComponent({
    props: ['active', 'items', 'over', 'accepted', 'status', 'mode', 'to'],
    setup: (props, { slots }) => () =>
      h('i', { 'data-kind': kind, 'data-to': JSON.stringify((props as unknown as OverlayProps).to) }, slots.default?.()),
  });

const Seed = marker('seed');
const Sprout = marker('sprout');
const Droplet = marker('droplet');
const Rock = marker('rock');
const OverB = marker('over-b');
const AItem = marker('a-item');

/**
 * The layout happy-dom lacks: containers (`data-col`) sit side by side 300px apart,
 * their children stack 40px high.
 */
const ROW = 40;
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

const at = (column: number, row = 0) => ({ x: column * 300 + 100, y: row * ROW + ROW / 2 });

let manager: DnDManager;
let unmount: (() => void) | null = null;

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('div', { ref: 'el', 'data-id': props.rowId }, props.rowId);
  },
});

const List = defineComponent({
  props: {
    listId: { type: String, required: true },
    rows: { type: Object as PropType<Ref<Array<{ id: string }>>>, required: true },
    column: { type: Number, required: true },
    options: { type: Object, default: () => ({}) },
  },
  setup(props) {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
      id: props.listId,
      items: props.rows,
      group: 'g',
      ...props.options,
    });
    return () => h('div', { ref: 'list', 'data-col': props.column }, items.value.map((row) => h(Row, { key: row.id, rowId: row.id })));
  },
});

const Zone = defineComponent({
  props: { zoneId: { type: String, required: true }, column: { type: Number, required: true }, options: { type: Object, default: () => ({}) } },
  setup(props) {
    makeDroppable(useTemplateRef<HTMLElement>('el'), { id: props.zoneId, ...props.options });
    return () => h('div', { ref: 'el', 'data-col': props.column }, [h('span', props.zoneId)]);
  },
});

const Free = defineComponent({
  props: { freeId: { type: String, required: true }, column: { type: Number, required: true }, options: { type: Object, default: () => ({}) } },
  setup(props) {
    makeDraggable(useTemplateRef<HTMLElement>('el'), { id: props.freeId, ...props.options });
    return () => h('div', { 'data-col': props.column }, [h('span', { ref: 'el' }, props.freeId)]);
  },
});

/** Every drop animation that ran: whose, for which drag, on which target. */
let landed: Array<{ by: string; active: string; over: string | null }>;
const animation = (by: string): DropAnimation => (context: DropAnimationContext) => {
  landed.push({ by, active: String(context.active.id), over: context.over ? String(context.over.id) : null });
};

const seedOverlay = shallowRef<Component>(Seed);
const waterLanding = shallowRef<DropAnimation | undefined>(animation('water'));

/**
 * Column 0: list A (its items' overlay and landing), 1: list B (its own overlay and landing
 * as a target), 2: the water zone (overlay, landing), 3: a stone that takes nothing, 4: the
 * free seed (its own overlay and landing).
 */
const mountBoard = (provider: Record<string, unknown> = {}, listA: Record<string, unknown> = {}) => {
  landed = [];
  const container = document.createElement('div');
  document.body.appendChild(container);
  const a = ref([{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }]);
  const b = ref([{ id: 'b1' }, { id: 'b2' }]);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { animation: false, dropAnimation: animation('provider'), ...provider }, {
        default: () => [
          h({ setup: () => () => ((manager = useManager()), null) }),
          h(List, { listId: 'A', rows: a, column: 0, options: { overlay: AItem, dropAnimation: animation('A'), ...listA } }),
          h(List, { listId: 'B', rows: b, column: 1, options: { overOverlay: OverB, overDropAnimation: animation('B') } }),
          h(Zone, { zoneId: 'water', column: 2, options: { overlay: Droplet, dropAnimation: waterLanding } }),
          h(Zone, { zoneId: 'stone', column: 3, options: { accept: () => false, overlay: Rock } }),
          h(Free, { freeId: 'seed', column: 4, options: { overlay: seedOverlay, dropAnimation: animation('seed') } }),
        ],
      }),
  });
  app.mount(container);
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this) as DOMRect;
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    for (const column of container.querySelectorAll('[data-col]')) {
      const rect = rectOf(column);
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return column;
    }
    return null;
  });
  unmount = () => {
    app.unmount();
    container.remove();
  };
  return { a, b };
};

const settle = async () => {
  for (let i = 0; i < 4; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();
  }
};

const start = async (id: string, point: { x: number; y: number }) => {
  expect(manager.start(id, point, 'pointer')).toBe(true);
  await settle();
};

const pointTo = async (point: { x: number; y: number }) => {
  manager.move(point);
  manager.flushFrame();
  await settle();
};

const idle = async () => {
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  await settle();
};

const overlay = () => document.querySelector<HTMLElement>('[data-dnd-overlay]');
/** The kinds the overlay shows, outermost first. */
const kinds = () => [...(overlay()?.querySelectorAll('[data-kind]') ?? [])].map((element) => element.getAttribute('data-kind'));
/** What the overlay shows once a change of component has faded through. */
const shows = (expected: string[]) => vi.waitFor(() => expect(kinds()).toEqual(expected));
const toProp = () => JSON.parse(overlay()!.querySelector('[data-kind]')!.getAttribute('data-to')!);

afterEach(() => {
  unmount?.();
  unmount = null;
  seedOverlay.value = Seed;
  waterLanding.value = animation('water');
  vi.restoreAllMocks();
});

describe("a drop target's overlay", () => {
  it('shows while a drag it takes is over it, with the drag’s own overlay in its slot', async () => {
    mountBoard();
    await settle();
    await start('seed', at(4));
    expect(kinds()).toEqual(['seed']);
    await pointTo(at(2));
    await shows(['droplet', 'seed']);
    // The content's root stays the overlay's child: CSS like `[data-dnd-overlay] > *` holds.
    expect(overlay()!.firstElementChild!.getAttribute('data-kind')).toBe('droplet');
    // A target that refuses the drag doesn't change it.
    await pointTo(at(3));
    await shows(['seed']);
    await pointTo({ x: 2000, y: 20 });
    await shows(['seed']);
    manager.cancel();
    await idle();
  });

  it("a list's `overOverlay` shows over it, whatever list the drag comes from", async () => {
    mountBoard();
    await settle();
    await start('a1', at(0, 0));
    expect(kinds()).toEqual(['a-item']);
    await pointTo(at(1, 1));
    await shows(['over-b', 'a-item']);
    await pointTo(at(0, 1));
    await shows(['a-item']);
    manager.cancel();
    await idle();
  });

  it('stays while the drop lands on it', async () => {
    mountBoard();
    await settle();
    await start('seed', at(4));
    await pointTo(at(2));
    await shows(['droplet', 'seed']);
    // An async decision keeps the overlay over the target: `dropping`, still showing it.
    const drop = manager.drop();
    await nextTick();
    expect(overlay()?.getAttribute('data-dnd-overlay')).toBe('dropping');
    expect(kinds()).toEqual(['droplet', 'seed']);
    await drop;
    await idle();
  });

  it('an `overlay` ref switched mid-drag swaps the component at once', async () => {
    mountBoard();
    await settle();
    await start('seed', at(4));
    expect(kinds()).toEqual(['seed']);
    seedOverlay.value = Sprout;
    await shows(['sprout']);
    manager.cancel();
    await idle();
  });

  it('`overlayTransition: false` swaps without a transition', async () => {
    mountBoard({ overlayTransition: false });
    await settle();
    await start('seed', at(4));
    await pointTo(at(2));
    expect(kinds()).toEqual(['droplet', 'seed']);
    await pointTo(at(4));
    expect(kinds()).toEqual(['seed']);
    manager.cancel();
    await idle();
  });
});

describe('which `dropAnimation` lands a drop', () => {
  it("the target's, then the dragged item's (its list's), then the provider's", async () => {
    mountBoard();
    await settle();
    // Dropped on the water: the zone's.
    await start('seed', at(4));
    await pointTo(at(2));
    await manager.drop();
    await idle();
    // Cancelled: the seed's own, and no target.
    await start('seed', at(4));
    manager.cancel();
    await idle();
    // Into list B: its `overDropAnimation`.
    await start('a1', at(0, 0));
    await pointTo(at(1, 1));
    await manager.drop();
    await idle();
    // Cancelled: list A's `dropAnimation` for its items.
    await start('a2', at(0, 0));
    manager.cancel();
    await idle();
    // From B into A, which has no `overDropAnimation`, and B no `dropAnimation`: the provider's.
    await start('b1', at(1, 0));
    await pointTo(at(0, 1));
    await manager.drop();
    await idle();
    expect(landed).toEqual([
      { by: 'water', active: 'seed', over: 'water' },
      { by: 'seed', active: 'seed', over: null },
      { by: 'B', active: 'a1', over: 'B' },
      { by: 'A', active: 'a2', over: null },
      { by: 'provider', active: 'b1', over: 'A' },
    ]);
  });

  it("a target's `false` wins: someone chose no animation", async () => {
    mountBoard();
    await settle();
    waterLanding.value = false;
    await start('seed', at(4));
    await pointTo(at(2));
    await manager.drop();
    await idle();
    expect(landed).toEqual([]);
  });
});

describe("the drop waits for the content's own animations", () => {
  /** A finite animation of an element inside the overlay, which ends when `end` is called. */
  const contentAnimation = (endTime = 300) => {
    let end!: () => void;
    const finished = new Promise<void>((resolve) => (end = resolve));
    const animation = {
      playState: 'running',
      finished,
      effect: { target: null as Element | null, getComputedTiming: () => ({ endTime }) },
    };
    return { animation, end: () => end() };
  };

  const animateContent = (animations: Array<{ effect: { target: Element | null } }>) => {
    vi.spyOn(HTMLElement.prototype, 'getAnimations').mockImplementation(function (this: HTMLElement) {
      if (!this.hasAttribute('data-dnd-overlay')) return [];
      for (const animation of animations) animation.effect.target = this.firstElementChild;
      return animations as unknown as Animation[];
    });
  };

  it('a splash started on `dropping` plays to its end before the drag settles', async () => {
    mountBoard();
    await settle();
    const splash = contentAnimation();
    animateContent([splash.animation]);
    await start('seed', at(4));
    await pointTo(at(2));
    const drop = manager.drop();
    await settle();
    await settle();
    expect(manager.status.value).toBe('dropping');
    splash.end();
    await drop;
    await idle();
  });

  it('endless loops are not waited for', async () => {
    mountBoard();
    await settle();
    const loop = contentAnimation(Infinity);
    animateContent([loop.animation]);
    await start('seed', at(4));
    await pointTo(at(2));
    await manager.drop();
    await idle();
  });

  it('waits at most two seconds', async () => {
    vi.useFakeTimers();
    try {
      const element = document.createElement('div');
      const child = document.createElement('i');
      element.appendChild(child);
      const stuck = contentAnimation();
      stuck.animation.effect.target = child;
      element.getAnimations = () => [stuck.animation as unknown as Animation];
      let done = false;
      void contentAnimations(element).then(() => (done = true));
      await vi.advanceTimersByTimeAsync(1999);
      expect(done).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      expect(done).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('`to`: where a drop would go', () => {
  it('in a list, live; `null` over a plain target', async () => {
    mountBoard();
    await settle();
    await start('a1', at(0, 0));
    expect(toProp()).toEqual({ list: 'A', index: 0 });
    await pointTo({ x: 100, y: 2 * ROW + 35 });
    expect(toProp()).toEqual({ list: 'A', index: 2 });
    await pointTo(at(1, 1));
    await shows(['over-b', 'a-item']);
    expect(toProp()).toEqual({ list: 'B', index: 2 });
    // The water takes it: its droplet, around the list's overlay.
    await pointTo(at(2));
    await shows(['droplet', 'a-item']);
    expect(toProp()).toBeNull();
    manager.cancel();
    await idle();
  });

  it("outside every target: the slot's place, where `dropOutside: 'placeholder'` keeps the items", async () => {
    const { a } = mountBoard();
    await settle();
    await start('a1', at(0, 0));
    await pointTo({ x: 100, y: 2 * ROW + 35 });
    await pointTo({ x: 2000, y: 500 });
    expect(toProp()).toEqual({ list: 'A', index: 2 });
    await manager.drop();
    await idle();
    expect(a.value.map((row) => row.id)).toEqual(['a2', 'a3', 'a1']);
  });

  it("outside every target: `null` where `dropOutside` cancels the drop", async () => {
    mountBoard({}, { dropOutside: 'cancel' });
    await settle();
    await start('a1', at(0, 0));
    await pointTo({ x: 100, y: 2 * ROW + 35 });
    expect(toProp()).toEqual({ list: 'A', index: 2 });
    await pointTo({ x: 2000, y: 500 });
    expect(toProp()).toBeNull();
    manager.cancel();
    await idle();
  });

  it('keeps the place it lands on while the drop animates: where the drop puts it', async () => {
    const { b } = mountBoard();
    await settle();
    await start('a1', at(0, 0));
    await pointTo(at(1, 1));
    await shows(['over-b', 'a-item']);
    const drop = manager.drop();
    await nextTick();
    expect(overlay()?.getAttribute('data-dnd-overlay')).toBe('dropping');
    expect(toProp()).toEqual({ list: 'B', index: 2 });
    await drop;
    await idle();
    expect(b.value.map((row) => row.id)).toEqual(['b1', 'b2', 'a1']);
  });
});
