/**
 * The devtools hook. The devtools bridge (`@vue-dnd-kit/core/devtools`, which the
 * `@vue-dnd-kit/devtools` plugin connects) puts it on `globalThis` before the app mounts,
 * and providers and sortable groups report to it as they are created, sensors as they
 * start a drag. Without it
 * nothing else runs; production builds drop the lookup.
 */

import type { Key, Sensor } from '../types';
import type { GroupContext } from '../sortable/context';
import type { DnDManager } from './manager';

/** Bundlers replace it: development builds keep the hook, production drops it. */
declare const process: { env: { NODE_ENV?: string } };

/** What providers and sortable groups report (implemented by `devtools/index.ts`). */
export interface DevtoolsHook {
  /** A provider was set up; called in its `setup`, so the bridge can tell its app and unmount. */
  provider(manager: DnDManager): void;
  /** A sortable group was created on the provider `g.manager`. */
  group(g: GroupContext): void;
  /** A sensor's drag of `id` is about to start (`sensor` is missing for a drag it took over). */
  sensor(manager: DnDManager, id: Key, sensor: Sensor | undefined, touch: boolean): void;
}

/** The hook, while the devtools bridge is connected. */
export const devtoolsHook = (): DevtoolsHook | undefined =>
  process.env.NODE_ENV === 'production'
    ? undefined
    : (globalThis as { __VUE_DND_KIT_DEVTOOLS_HOOK__?: DevtoolsHook }).__VUE_DND_KIT_DEVTOOLS_HOOK__;
