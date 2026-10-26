/**
 * Drags from the tab. They go through the public sensor API, so they are real drags: the
 * animations, the announcements and the drop pipeline (`onBeforeDrop`, `onDrop`,
 * `event.result`, `preventDefault()`) run as for any other. A sensor named `devtools`
 * runs in each provider the tab drives, from its first command on; the log names it as
 * the sensor of these drags. Moves of the buttons are keyboard drags made the way
 * `@vue-dnd-kit/actions` makes them (`createDnDActions`); the joystick (`stick.ts`) drags
 * through the sensor's context.
 */

import { createApp, effectScope } from 'vue';
import { provideDnDContext, useSensor, type Key, type SensorContext, type SortablePosition } from '@vue-dnd-kit/core';
import { createDnDActions, type DnDActions } from '@vue-dnd-kit/actions';
import type { DevtoolsProvider } from '@vue-dnd-kit/core/devtools';

/** The name of the tab's sensor. */
export const SENSOR_NAME = 'devtools';

/** The tab's sensor in a provider. */
interface Driver {
  context: SensorContext;
  actions: DnDActions;
  /** The last move: the next one reads the position once it is done. */
  queue: Promise<unknown>;
  stop(): void;
}

/**
 * Runs the `devtools` sensor in `provider`. `useSensor` finds the provider by injection:
 * an app that is never mounted provides its context, the way a component under it would.
 */
const runSensor = (provider: DevtoolsProvider): Driver | null => {
  const holder = createApp({});
  provideDnDContext(holder, provider.context);
  const scope = effectScope(true);
  const sensor: { context?: SensorContext } = {};
  scope.run(() =>
    holder.runWithContext(() => useSensor({ name: SENSOR_NAME, setup: (context) => void (sensor.context = context) })),
  );
  if (!sensor.context) {
    scope.stop();
    return null;
  }
  return { context: sensor.context, actions: createDnDActions(sensor.context), queue: Promise.resolve(), stop: () => scope.stop() };
};

export interface Drive {
  /** The sensor's context in `provider` (started on first use); `null` where no sensor runs (the server). */
  contextOf(provider: DevtoolsProvider): SensorContext | null;
  /**
   * Moves the item `id` of a sortable list, in one drag (`moveItem`). Moves run one after
   * another: `target` is asked where to once the moves before it are done (`null`: it
   * stays). Resolves `false` when it didn't move.
   */
  move(provider: DevtoolsProvider, id: Key, target: () => SortablePosition | null): Promise<boolean>;
  /** The provider unmounted: its sensor stops. */
  forget(provider: DevtoolsProvider): void;
  /** Stops every sensor. */
  stop(): void;
}

export const createDrive = (): Drive => {
  const drivers = new Map<DevtoolsProvider, Driver>();
  const driverOf = (provider: DevtoolsProvider) => {
    let driver = drivers.get(provider) ?? null;
    if (!driver && (driver = runSensor(provider))) drivers.set(provider, driver);
    return driver;
  };

  return {
    contextOf: (provider) => driverOf(provider)?.context ?? null,
    move(provider, id, target) {
      const driver = driverOf(provider);
      if (!driver) return Promise.resolve(false);
      const run = () => {
        const to = target();
        return to ? driver.actions.moveItem(id, to) : false;
      };
      const result = driver.queue.then(run).catch((error: unknown) => {
        console.error(error);
        return false;
      });
      driver.queue = result;
      return result;
    },
    forget(provider) {
      drivers.get(provider)?.stop();
      drivers.delete(provider);
    },
    stop() {
      for (const driver of drivers.values()) driver.stop();
      drivers.clear();
    },
  };
};
