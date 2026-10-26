/**
 * Programmatic drags, built on the core's public sensor API like any custom sensor
 * (`useSensor`): no access to the core's internals. A programmatic drag is a real one:
 * it is picked up, moves, drops or is cancelled with the normal animations, screen
 * reader announcements and drop pipeline (`onBeforeDrop`, `onDrop`, `event.result`,
 * `preventDefault()`), and the provider's rules (one drag at a time, disabled items).
 */

import { effectScope, nextTick, watch } from 'vue';
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
 * The actions of a sensor of your own: `moveItem` and `startDrag` as `useDnDActions()`
 * gives them, with the drags started by the sensor whose `context` this is (its `name` is
 * the drag's sensor in the devtools timeline). Create them in the sensor's `setup`: to
 * drive a provider from outside its components (a store, a test harness, the devtools
 * plugin), or under a name of your own. `moveItem` calls queue per actions object.
 *
 * @example
 * let tour: DnDActions | undefined;
 * const tourSensor = defineSensor({ name: 'tour', setup: (context) => void (tour = createDnDActions(context)) });
 * // <DnDProvider :sensors="[pointerSensor, keyboardSensor, tourSensor]">
 * await tour?.moveItem('card-1', { list: 'done' });
 */
export function createDnDActions(context: SensorContext): DnDActions {
  /** The last `moveItem`: the next one runs after it. */
  let queue: Promise<unknown> = Promise.resolve();

  /** Resolves once the provider has no drag (and no drop landing). */
  const whenIdle = (): Promise<void> => {
    if (context.status === 'idle') return Promise.resolve();
    return new Promise((resolve) => {
      const stop = watch(
        () => context.status,
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
    const drag = context.activate({ target: id, type: options.type, point: options.from });
    return drag ? wrap(drag) : null;
  };

  /** A keyboard drag of `id` once the provider is idle; `null` when the item can't be dragged. */
  const activateWhenIdle = async (id: Key): Promise<SensorDrag | null> => {
    for (;;) {
      await whenIdle();
      const drag = context.activate({ target: id, type: 'keyboard' });
      // Refused while idle: the item can't be dragged. Else a drag of another sensor (other
      // actions, the user) started first: it is waited for too.
      if (drag || context.status === 'idle') return drag;
    }
  };

  const moveItem = (id: Key, to: SortablePosition): Promise<boolean> => {
    const run = async () => {
      const drag = await activateWhenIdle(id);
      if (!drag) return false;
      if (await drag.place(to)) return drag.drop();
      drag.cancel();
      return false;
    };
    const result = queue.then(run, run);
    queue = result;
    return result;
  };

  return { moveItem, startDrag };
}

/** The actions of each provider: every `useDnDActions()` under it shares them (and their queue). */
const providers = new WeakMap<DnDContext, DnDActions>();

/** During server rendering nothing drags. */
const serverActions: DnDActions = { moveItem: () => Promise.resolve(false), startDrag: () => null };

/**
 * Programmatic drags in the provider above: `moveItem` for "move up", "to the top" or
 * "move to Done" buttons and menus (an accessible alternative to dragging), `startDrag`
 * for scripted drags. Call it in a component's `setup` under a `<DnDProvider>`.
 */
export function useDnDActions(): DnDActions {
  const provider = useDnDContext();
  let actions = providers.get(provider);
  if (actions) return actions;
  const sensor: { context?: SensorContext } = {};
  // The provider's one sensor for actions outlives the component that calls this first:
  // a row with "move" buttons is re-created when its drag takes it to another list, and
  // the drag must go on. It has no listeners to clean up; the provider's unmount ends
  // any drag it runs. It never runs on the server.
  effectScope(true).run(() =>
    useSensor(
      defineSensor({
        name: 'actions',
        setup: (context) => void (sensor.context = context),
      }),
    ),
  );
  actions = sensor.context ? createDnDActions(sensor.context) : serverActions;
  providers.set(provider, actions);
  return actions;
}
