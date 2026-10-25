/**
 * Programmatic drags, built on the core's public sensor API like any custom sensor
 * (`useSensor`): no access to the core's internals. A programmatic drag is a real one:
 * it is picked up, moves, drops or is cancelled with the normal animations, screen
 * reader announcements and drop pipeline (`onBeforeDrop`, `onDrop`, `event.result`,
 * `preventDefault()`), and the provider's rules (one drag at a time, disabled items).
 */

import { nextTick, watch } from 'vue';
import {
  defineSensor,
  useDnDContext,
  useSensor,
  type Coordinates,
  type DnDContext,
  type Key,
  type SensorContext,
  type SensorDirection,
  type SensorDrag,
  type SensorDragState,
  type SensorType,
  type SortablePosition,
} from '@vue-dnd-kit/core';

export interface StartDragOptions {
  /**
   * `'pointer'` (default): the drag follows the points it is moved to, like a mouse:
   * targets are hit-tested there and lists sort under it. `'keyboard'`: it moves by items,
   * like arrow keys (`step`), and the keyboard sensor can take over (arrows, Space, Escape).
   */
  type?: SensorType;
  /** Where the drag starts, in viewport coordinates. Default: the center of the item. */
  from?: Coordinates;
}

/** Where `ActionDrag.moveTo()` takes a drag: a point (viewport coordinates), an element, or a list position. */
export type DragDestination = Coordinates | Element | SortablePosition;

/** A drag started by `startDrag()`. Every call is ignored once it has ended. */
export interface ActionDrag {
  /** Id of the dragged item. */
  readonly id: Key;
  readonly type: SensorType;
  /** `'dragging'` until the drop is decided or the drag is cancelled (by anyone), `'ended'` after. */
  readonly state: SensorDragState;
  /**
   * Moves the drag to a point, onto an element (the center of its visible part, scrolled
   * into view first if needed), or to a position of a sortable list (`{ list, index }`, as
   * `moveItem` takes it). Resolves once the move has rendered: `false` when the drag has
   * ended or no list takes it to that position.
   */
  moveTo(destination: DragDestination): Promise<boolean>;
  /** `'keyboard'` drags: one arrow step (the next item of a list); pointer drags ignore it. */
  step(direction: SensorDirection): Promise<void>;
  /** Drops. Resolves once it has landed: `true` when the drop went through, `false` when it was refused. */
  drop(): Promise<boolean>;
  /** Cancels: the items fly back. */
  cancel(): void;
}

export interface DnDActions {
  /**
   * Moves an item of a sortable list to a position of its list or another one (that
   * accepts it), in one go: it is picked up, put there and dropped, as a keyboard drag
   * (announced, the focus kept on the item if its row is re-rendered). Calls run one after
   * another, each once the provider is idle (a drop still landing, a drag of the user).
   * Resolves `true` when the drop went through; `false` when the item can't be dragged
   * (not rendered, disabled), no list takes it there, or the drop is refused.
   *
   * @example
   * moveItem(task.id, { index: index - 1 }); // up
   * moveItem(task.id, { index: 0 }); // to the top
   * moveItem(task.id, { list: 'done' }); // to the end of another list
   */
  moveItem(id: Key, to: SortablePosition): Promise<boolean>;
  /**
   * Starts a drag of a draggable or sortable item, to script it (`moveTo`, `step`,
   * `drop`, `cancel`): demos, tours, tests. `null` when it can't start: another drag
   * runs, the item isn't rendered or is disabled.
   */
  startDrag(id: Key, options?: StartDragOptions): ActionDrag | null;
}

/** The last `moveItem` of each provider: the next one runs after it. */
const queues = new WeakMap<DnDContext, Promise<unknown>>();

/** Frames stop in hidden tabs: wait at most this long for one. */
const FRAME_TIMEOUT = 100;

/** Resolves on the next animation frame, or after `FRAME_TIMEOUT` ms when frames stall. */
const nextFrame = (): Promise<void> =>
  new Promise((resolve) => {
    const done = () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      resolve();
    };
    const frame = requestAnimationFrame(done);
    const timer = setTimeout(done, FRAME_TIMEOUT);
  });

const isPoint = (destination: DragDestination): destination is Coordinates =>
  typeof (destination as Partial<Coordinates>).x === 'number' && typeof (destination as Partial<Coordinates>).y === 'number';

/** Center of the part of `element` in the viewport, where a hit test finds it; scrolled into view if it is outside. */
const centerOf = (element: Element): Coordinates => {
  const visible = () => {
    const rect = element.getBoundingClientRect();
    const left = Math.max(rect.left, 0);
    const top = Math.max(rect.top, 0);
    const right = Math.min(rect.right, window.innerWidth);
    const bottom = Math.min(rect.bottom, window.innerHeight);
    return right > left && bottom > top ? { x: (left + right) / 2, y: (top + bottom) / 2 } : null;
  };
  let point = visible();
  if (!point) {
    element.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    point = visible();
  }
  if (point) return point;
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

/**
 * Programmatic drags in the provider above: `moveItem` for "move up", "to the top" or
 * "move to Done" buttons and menus (an accessible alternative to dragging), `startDrag`
 * for scripted drags. Call it in a component's `setup` under a `<DnDProvider>`.
 */
export function useDnDActions(): DnDActions {
  let context: SensorContext | null = null;
  useSensor(
    defineSensor({
      name: 'actions',
      setup(ctx) {
        context = ctx;
        return () => {
          context = null;
        };
      },
    }),
  );

  /** Resolves once the provider has no drag (and no drop landing). */
  const whenIdle = (): Promise<void> => {
    if (!context || context.status === 'idle') return Promise.resolve();
    return new Promise((resolve) => {
      const stop = watch(
        () => context?.status ?? 'idle',
        (status) => {
          if (status !== 'idle') return;
          stop();
          resolve();
        },
      );
    });
  };

  const wrap = (drag: SensorDrag): ActionDrag => ({
    id: drag.id,
    type: drag.type,
    get state() {
      return drag.state;
    },
    async moveTo(destination) {
      if (drag.state !== 'dragging') return false;
      if (destination instanceof Element || isPoint(destination)) {
        drag.move(destination instanceof Element ? centerOf(destination) : destination);
        // Pointer drags take one position per frame; lists render the move after it.
        await nextFrame();
        await nextTick();
        return drag.state === 'dragging';
      }
      return drag.place(destination);
    },
    step: (direction) => drag.step(direction),
    drop: () => drag.drop(),
    cancel: () => drag.cancel(),
  });

  const startDrag = (id: Key, options: StartDragOptions = {}): ActionDrag | null => {
    const drag = context?.activate({ target: id, type: options.type, point: options.from });
    return drag ? wrap(drag) : null;
  };

  // One queue per provider: rows that each call `useDnDActions()` don't race for it.
  const provider = useDnDContext();
  const moveItem = (id: Key, to: SortablePosition): Promise<boolean> => {
    const run = async () => {
      await whenIdle();
      const drag = context?.activate({ target: id, type: 'keyboard' });
      if (!drag) return false;
      if (await drag.place(to)) return drag.drop();
      drag.cancel();
      return false;
    };
    const result = (queues.get(provider) ?? Promise.resolve()).then(run, run);
    queues.set(provider, result);
    return result;
  };

  return { moveItem, startDrag };
}
