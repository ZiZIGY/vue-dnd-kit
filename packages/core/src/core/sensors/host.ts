/**
 * Sensors of a provider (rfcs/0001-v3.md В§10). A sensor only says "drag this item from
 * here" (`SensorContext.activate`), then where it moved and that it dropped or
 * cancelled. The rules every drag follows are kept here and in `drag.ts`, the same for
 * the built-in sensors and custom ones:
 * - one drag per provider, none while a drop lands (input during `dropping` is ignored);
 * - only draggables of this provider that aren't disabled, from where a drag of that type
 *   may start (the handle, no interactive child; the focus target for keyboard drags),
 *   and only if `canDrag` lets the input event through;
 * - activation constraints (distance, delay, tolerance) with their progress;
 * - the drag itself (document drag mode, auto-scroll, keyboard moves by items, focus and
 *   announcements) is the manager's (`manager/session.ts`);
 * - a hidden tab cancels the drag; a sensor that stops cancels its own.
 */

import { effectScope, onScopeDispose, watch } from 'vue';
import { defaultDocument, useEventListener } from '@vueuse/core';
import type { Key, Sensor, SensorActivation, SensorContext, SensorDrag, SensorType } from '../../types';
import type { DnDManager } from '../manager';
import { useManager } from '../context';
import { getCenter, getRect } from '../../animation/layout';
import { isClient } from '../../utils/dom';
import { canStartFrom, resolveConstraint } from './activation';
import { createSensorDrag, type DragControl } from './drag';

/** A running sensor. */
interface Owner {
  active: boolean;
  /** Its drag, until it ends. */
  current: DragControl | null;
  sensor: Sensor;
}

interface Host {
  /** Runs a sensor; the returned function stops it (`cancel`: and its drag). */
  run(sensor: Sensor): (cancel?: boolean) => void;
}

/** Per provider, like sortable groups (`useSortableGroup`): providers stay independent. */
const hosts = new WeakMap<DnDManager, Host>();

/** The draggable a sensor's `target` points at, if a drag of `type` may start there. */
const findTarget = (manager: DnDManager, target: Element | Key, type: SensorType) => {
  if (typeof target === 'object') {
    const found = target && manager.findDraggable(target);
    return found && canStartFrom(found.entry, found.element, target, type) ? found : null;
  }
  const entry = manager.getDraggable(target);
  const element = entry?.getElement();
  return entry && element ? { entry, element } : null;
};

function createHost(manager: DnDManager): Host {
  /** The provider's drag, from `activate()` (or its start elsewhere) until it ends. */
  let current: DragControl | null = null;

  const track = (control: DragControl) => {
    current = control;
    return control;
  };
  const forget = (control: DragControl) => {
    if (current === control) current = null;
  };

  // A library layer: it hears events first and is asked about drops last, so users'
  // monitors run as they would without it.
  manager.addMonitor(
    {
      // A drag started without a sensor (`manager.start`) still gets a handle, so that
      // sensors can drive it (the keyboard moves keyboard drags, whoever started them).
      onDragStart: () => {
        const active = manager.active.value;
        // A sensor's drag starting.
        if (current?.drag.state === 'dragging' || !active) return;
        // Started elsewhere while a press still waited: that press is over.
        current?.abort();
        const control: DragControl = track(
          createSensorDrag({
            manager,
            id: active.id,
            type: active.sensor,
            origin: manager.getRawPointer(),
            constraint: {},
            touch: false,
            callbacks: {},
            onEnded: () => forget(control),
          }),
        );
        control.adopt();
      },
      // A running drag hears how it ended, whoever ended it.
      onDragEnd: () => current?.conclude(true),
      onDragCancel: () => current?.conclude(false),
    },
    true,
  );
  // Escape and `useDnD().cancel()` abort a pending activation.
  manager.activationAborts.add(() => current?.abort());

  const activate = (owner: Owner, options: SensorActivation): SensorDrag | null => {
    if (!owner.active || current || manager.status.value !== 'idle') return null;
    const type = options.type ?? 'pointer';
    const found = findTarget(manager, options.target, type);
    if (!found || found.entry.isDisabled()) return null;
    const { entry, element } = found;
    const { event } = options;
    if (event && entry.canDrag && !entry.canDrag(event)) return null;

    const control: DragControl = track(
      createSensorDrag({
        manager,
        id: entry.id,
        type,
        origin: options.point ?? getCenter(getRect(element)),
        constraint: resolveConstraint(options.activation, entry, manager.props.activation),
        touch: (event as Partial<PointerEvent> | undefined)?.pointerType === 'touch',
        sensor: owner.sensor,
        pressed: typeof options.target === 'object' ? { target: options.target, item: element } : undefined,
        callbacks: options,
        onEnded: () => {
          forget(control);
          if (owner.current === control) owner.current = null;
        },
      }),
    );
    owner.current = control;
    return control.begin() ? control.drag : null;
  };

  const run = (sensor: Sensor) => {
    const owner: Owner = { active: true, current: null, sensor };
    const context: SensorContext = {
      get props() {
        return manager.props;
      },
      get status() {
        return manager.status.value;
      },
      get drag() {
        return current?.drag ?? null;
      },
      activate: (options) => activate(owner, options),
      cancel: () => manager.cancel(),
    };
    const scope = effectScope(true);
    scope.run(() => {
      try {
        const cleanup = sensor.setup(context);
        if (typeof cleanup === 'function') onScopeDispose(cleanup);
      } catch (error) {
        console.error(error);
      }
    });
    return (cancel = true) => {
      owner.active = false;
      scope.stop();
      if (cancel) owner.current?.drag.cancel();
    };
  };

  return { run };
}

const hostOf = (manager: DnDManager): Host => {
  let host = hosts.get(manager);
  if (!host) hosts.set(manager, (host = createHost(manager)));
  return host;
};

/**
 * Runs the provider's `sensors` (`defaults` without the prop), in the browser only, and
 * follows changes of the list: sensors that leave it stop, cancelling their drag.
 */
export function useSensors(manager: DnDManager, defaults: readonly Sensor[]): void {
  if (!isClient) return;
  const host = hostOf(manager);
  // The pointerup of a hidden tab may never come.
  useEventListener(defaultDocument, 'visibilitychange', () => {
    if (document.visibilityState === 'hidden') manager.cancel();
  });
  const running = new Map<Sensor, (cancel?: boolean) => void>();
  watch(
    () => manager.props.sensors ?? defaults,
    (sensors) => {
      const next = new Set(sensors);
      for (const [sensor, stop] of running) {
        if (next.has(sensor)) continue;
        running.delete(sensor);
        stop();
      }
      for (const sensor of next) if (!running.has(sensor)) running.set(sensor, host.run(sensor));
    },
    { immediate: true },
  );
  // The provider unmounts: the manager ends the drag itself (`destroy`).
  onScopeDispose(() => {
    for (const stop of running.values()) stop(false);
    running.clear();
  });
}

/**
 * Runs a sensor in the provider above for as long as the calling component (or effect
 * scope) lives, next to the provider's `sensors`. Its drag is cancelled when it unmounts.
 */
export function useSensor(sensor: Sensor): void {
  const manager = useManager();
  if (!isClient) return;
  const stop = hostOf(manager).run(sensor);
  onScopeDispose(() => stop());
}

/** Defines a sensor (see `Sensor`): it only helps with the types and returns its argument. */
export const defineSensor = (sensor: Sensor): Sensor => sensor;
