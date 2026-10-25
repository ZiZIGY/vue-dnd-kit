/**
 * One drag of a sensor (`SensorDrag`), from `activate()` to its end: first the pending
 * activation (its constraint, progress for the UI, the abort), then the running drag.
 *
 * Keyboard drags queue their moves: a step may await monitors (sortable resolves the
 * next slot after a render), so a quick "arrow, arrow, Space" moves twice and then drops.
 */

import type {
  ActivationConstraint,
  Coordinates,
  Key,
  Sensor,
  SensorActivation,
  SensorDirection,
  SensorDrag,
  SensorDragState,
  SensorStepOptions,
  SensorType,
  SortablePosition,
} from '../../types';
import type { DnDManager } from '../manager';
import { devtoolsHook } from '../devtoolsHook';
import { checkActivation } from './activation';
import { DIRECTIONS, arrowEvent, place, step } from './steps';

export interface DragSetup {
  manager: DnDManager;
  id: Key;
  type: SensorType;
  /** Where the drag starts. */
  origin: Coordinates;
  constraint: ActivationConstraint;
  /** Started by touch: it vibrates (`haptics`). */
  touch: boolean;
  /** The sensor that activated it (the devtools tell it); none for a drag started without one. */
  sensor?: Sensor;
  callbacks: Pick<SensorActivation, 'onStart' | 'onEnd'>;
  /** The drag ended: whoever tracks it lets it go. */
  onEnded(): void;
}

export interface DragControl {
  drag: SensorDrag;
  /** Starts waiting for the constraint (or the drag, without one): `false` when it ended at once. */
  begin(): boolean;
  /** Stands for a drag that has just started without a sensor (`manager.start`). */
  adopt(): void;
  /** The provider's drag ended: dropped (`onDragEnd`) or not (`onDragCancel`). */
  conclude(dropped: boolean): void;
  /** Aborts a pending activation (Escape, a hidden tab). */
  abort(): void;
}

const report = (error: unknown) => console.error(error);

export function createSensorDrag(setup: DragSetup): DragControl {
  const { manager, id, type, origin, constraint, callbacks } = setup;
  let state: SensorDragState = 'pending';
  let started = false;
  /** `drop()` or `cancel()` was called: the sensor is done with the drag. */
  let released = false;
  let dropped = false;
  let point = origin;
  const startedAt = performance.now();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let frame = 0;

  let queue: Promise<void> = Promise.resolve();
  let queued = 0;
  /** Runs `task` after the keyboard moves before it; resolves `fallback` if it throws. */
  const enqueue = <T>(task: () => Promise<T>, fallback: T): Promise<T> => {
    queued++;
    const run = queue.then(task);
    queue = run.then(() => undefined, report).finally(() => queued--);
    return run.catch(() => fallback);
  };

  /** The provider's drag is still this one. */
  const isRunning = () => manager.status.value === 'dragging' && manager.active.value?.id === id;
  /** Calls that move or end the drag apply. */
  const isLive = () => state === 'dragging' && !released && isRunning();

  const stopTracking = () => {
    clearTimeout(timer);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  const end = () => {
    if (state === 'ended') return;
    state = 'ended';
    stopTracking();
    setup.onEnded();
    try {
      callbacks.onEnd?.(drag);
    } catch (error) {
      report(error);
    }
  };

  const abort = () => {
    if (state !== 'pending') return;
    if (manager.status.value === 'activating') {
      manager.status.value = 'idle';
      manager.activationProgress.value = 0;
    }
    end();
  };

  const startNow = (): boolean => {
    stopTracking();
    // The manager starts from `idle`.
    if (manager.status.value === 'activating') manager.status.value = 'idle';
    // Before the start: a monitor of `onDragStart` may already end it.
    state = 'dragging';
    devtoolsHook()?.sensor(manager, id, setup.sensor, setup.touch);
    if (!manager.start(id, origin, type, setup.touch)) {
      manager.activationProgress.value = 0;
      end();
      return false;
    }
    started = true;
    if (state !== 'dragging') return true;
    try {
      callbacks.onStart?.(drag);
    } catch (error) {
      report(error);
    }
    // Where the input went while the activation waited.
    if (type === 'pointer') manager.move(point);
    return true;
  };

  /** Re-checks the pending activation: `true` while it still waits. */
  const evaluate = (): boolean => {
    if (state !== 'pending' || manager.status.value !== 'activating') return false;
    const distance = Math.hypot(point.x - origin.x, point.y - origin.y);
    const verdict = checkActivation(constraint, distance, performance.now() - startedAt);
    if (verdict === 'start') startNow();
    else if (verdict === 'abort') abort();
    else {
      manager.activationProgress.value = verdict;
      return true;
    }
    return false;
  };

  const trackDelay = () => {
    const { delay } = constraint;
    if (!delay) return;
    timer = setTimeout(evaluate, delay);
    // Progress for the UI (e.g. a long-press ring), once per frame.
    const tick = () => {
      frame = evaluate() ? requestAnimationFrame(tick) : 0;
    };
    frame = requestAnimationFrame(tick);
  };

  const begin = (): boolean => {
    if (checkActivation(constraint, 0, 0) === 'start') return startNow();
    manager.status.value = 'activating';
    manager.activationProgress.value = 0;
    if (evaluate()) trackDelay();
    return state !== 'ended';
  };

  const move = (next: Coordinates) => {
    if (state === 'pending') {
      point = next;
      evaluate();
      return;
    }
    if (!isLive()) return;
    point = next;
    if (type === 'pointer') return manager.move(next);
    void enqueue(async () => {
      if (!isRunning()) return;
      manager.move(next);
      manager.flushFrame();
    }, undefined);
  };

  const stepBy = (direction: SensorDirection, options: SensorStepOptions = {}): Promise<void> => {
    const current = manager.active.value;
    if (type !== 'keyboard' || !isLive() || !current) return Promise.resolve();
    const { event } = options;
    // A held arrow repeats (pixel moves glide), but repeats don't pile up behind a move
    // that is still resolving. Separate presses are never dropped.
    if (event?.repeat && queued > 0) return Promise.resolve();
    const fast = options.fast ?? event?.shiftKey ?? false;
    const key = event ?? arrowEvent(direction, fast);
    return enqueue(() => step(manager, current, DIRECTIONS[direction], key, fast), undefined);
  };

  const placeAt = (position: SortablePosition): Promise<boolean> => {
    const current = manager.active.value;
    if (!isLive() || !current) return Promise.resolve(false);
    const task = () => place(manager, current, position);
    return type === 'keyboard' ? enqueue(task, false) : task();
  };

  const drop = (): Promise<boolean> => {
    if (state === 'pending') abort();
    if (state !== 'dragging' || released) return Promise.resolve(false);
    released = true;
    const task = async () => {
      await manager.drop();
      return dropped;
    };
    return type === 'keyboard' ? enqueue(task, false) : task();
  };

  const cancel = () => {
    if (state === 'pending') return abort();
    if (state !== 'dragging' || released) return;
    released = true;
    if (isRunning()) manager.cancel();
  };

  const drag: SensorDrag = {
    id,
    type,
    get state() {
      return state;
    },
    get started() {
      return started;
    },
    move,
    step: stepBy,
    place: placeAt,
    drop,
    cancel,
  };

  return {
    drag,
    begin,
    adopt() {
      state = 'dragging';
      started = true;
    },
    conclude(value) {
      if (state !== 'dragging') return;
      dropped = value;
      end();
    },
    abort,
  };
}
