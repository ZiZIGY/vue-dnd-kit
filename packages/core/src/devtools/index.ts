/**
 * `@vue-dnd-kit/core/devtools`: the bridge the `@vue-dnd-kit/devtools` plugin reads the
 * library through. An internal contract, versioned with the core: it may change in any
 * release, so use it through the plugin.
 *
 * `connectDevtools()` puts the hook (`core/devtoolsHook.ts`) on `globalThis`; providers
 * set up from then on report to it, and so do their sortable groups. Connect before the
 * app mounts: providers set up earlier aren't seen. Until a listener subscribes to the
 * events, a provider is only recorded; then it is followed. The bridge reads (snapshots) and
 * listens (events); the only things it changes are the explicit actions of a provider
 * (`cancel`, `clearSelection`) and the live overrides of its options (`overrides.ts`). It
 * also hands out each provider's `context`, so the plugin can drag through the public
 * sensor API, and the library's clone of an element (what the overlay shows of it).
 * Providers shared with other apps through `provideDnDContext` (shadow roots) are one
 * provider: their items are in it.
 *
 * The bridge has copies of its own of the library modules it runs (`vite.config.ts`):
 * the library's `index.js` stays one file, and the same with or without the bridge.
 */

import { getCurrentScope, onScopeDispose } from 'vue';
import type { DnDManager } from '../core/manager';
import type { DevtoolsHook } from '../core/devtoolsHook';
import { createProviderRecord, type ProviderRecord } from './provider';
import type { DevtoolsBridge, DevtoolsListener } from './types';

/** The library's clones: `copyElement` (a deep copy kept out of the page's way) and `clonePreview` (styled as the overlay shows it). */
export { clonePreview, copyElement, type CloneOptions } from '../core/clone';

export type {
  ActiveSnapshot,
  CancelReason,
  DevtoolsBridge,
  DevtoolsEvent,
  DevtoolsListener,
  DevtoolsOverrides,
  DevtoolsProvider,
  DraggableSnapshot,
  DroppableSnapshot,
  GroupSnapshot,
  ItemSnapshot,
  ListSnapshot,
  OptionOverride,
  OptionRead,
  OverrideTarget,
  OverSnapshot,
  ProviderSnapshot,
  SessionSnapshot,
  SortableDropSnapshot,
  SensorSnapshot,
  SortableSessionSnapshot,
} from './types';

const HOOK = '__VUE_DND_KIT_DEVTOOLS_HOOK__';

type HookHolder = { [HOOK]?: DevtoolsHook };

let bridge: DevtoolsBridge | null = null;

/**
 * Connects the devtools (once per page; later calls return the same bridge). Providers
 * set up from now on report to it, until `disconnect()`.
 */
export function connectDevtools(): DevtoolsBridge {
  if (bridge) return bridge;
  const records = new Map<DnDManager, ProviderRecord>();
  const listeners = new Set<DevtoolsListener>();

  /** Tells every listener; one that throws doesn't keep the others from hearing it. */
  const tell = (call: (listener: DevtoolsListener) => void) => {
    for (const listener of listeners) {
      try {
        call(listener);
      } catch (error) {
        console.error(error);
      }
    }
  };

  /** Someone listens to the events: providers are followed (a monitor, a few watchers) from then on. */
  const following = () => [...listeners].some((listener) => listener.event);

  const hook: DevtoolsHook = {
    provider(manager) {
      if (records.has(manager)) return;
      const record = createProviderRecord(manager, (provider, event) => tell((listener) => listener.event?.(provider, event)));
      records.set(manager, record);
      if (following()) record.follow();
      // Called in the provider's setup: its scope ends when it unmounts.
      if (getCurrentScope()) {
        onScopeDispose(() => {
          if (records.get(manager) !== record) return;
          record.stop();
          records.delete(manager);
          tell((listener) => listener.removed?.(record));
        });
      }
      tell((listener) => listener.added?.(record));
    },
    group(g) {
      records.get(g.manager)?.addGroup(g);
    },
    sensor(manager, id, sensor, touch) {
      records.get(manager)?.sensorStarts(id, sensor, touch);
    },
  };
  (globalThis as HookHolder)[HOOK] = hook;

  const connected: DevtoolsBridge = {
    providers: () => [...records.values()],
    subscribe(listener) {
      listeners.add(listener);
      if (listener.event) for (const record of records.values()) record.follow();
      return () => {
        listeners.delete(listener);
      };
    },
    disconnect() {
      const holder = globalThis as HookHolder;
      if (holder[HOOK] === hook) delete holder[HOOK];
      for (const record of records.values()) record.stop();
      records.clear();
      listeners.clear();
      if (bridge === connected) bridge = null;
    },
  };
  bridge = connected;
  return connected;
}
