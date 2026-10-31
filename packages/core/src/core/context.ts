import {
  computed,
  inject,
  onScopeDispose,
  readonly,
  type App,
  type InjectionKey,
} from 'vue';
import type { DnDContext, DnDMonitor, DnDSelection, DnDState, Key } from '../types';
import type { DnDManager } from './manager';
import { positionInTarget } from './manager/events';
import { warnIfDeciding } from './deciding';

/** Bundlers replace it: development builds keep the warnings, production drops them. */
declare const process: { env: { NODE_ENV?: string } };

export const DND_CONTEXT: InjectionKey<DnDManager> = Symbol('vue-dnd-kit');

/** The provider's manager: what the library itself works with. */
export const useManager = (): DnDManager => {
  const manager = inject(DND_CONTEXT, null);
  if (!manager) {
    throw new Error('[vue-dnd-kit] No <DnDProvider> found above this component.');
  }
  return manager;
};

/**
 * The provider above this component, as an opaque handle for `provideDnDContext`: it
 * bridges the provider into shadow roots and separate Vue apps.
 */
export const useDnDContext = (): DnDContext => useManager() as unknown as DnDContext;

/** Shares a provider (from `useDnDContext()`) with another Vue app, e.g. one mounted inside a shadow root. */
export const provideDnDContext = (app: App, context: DnDContext): void => {
  app.provide(DND_CONTEXT, context as unknown as DnDManager);
};

/** Id-based selection over the provider's reactive set: per-id updates, survives unmounts. */
export const createSelection = (set: Set<Key>): DnDSelection => ({
  get ids() {
    return set;
  },
  has: (id) => set.has(id),
  add: (...ids) => ids.forEach((id) => set.add(id)),
  delete: (...ids) => ids.forEach((id) => set.delete(id)),
  toggle: (id, force) => {
    if (force ?? !set.has(id)) set.add(id);
    else set.delete(id);
  },
  set: (ids) => {
    // Copy first: `ids` may be this very set (or a view of it).
    const next = new Set(ids);
    for (const id of [...set]) if (!next.has(id)) set.delete(id);
    for (const id of next) set.add(id);
  },
  clear: () => set.clear(),
});

/** Read-only drag state for custom UI (valid-target highlighting, spinners, progress). */
export const useDnD = (): DnDState => {
  const manager = useManager();
  return {
    status: readonly(manager.status),
    // A decided drop hands its overlay to a flight: the drag state is gone at once.
    active: readonly(manager.active) as DnDState['active'],
    over: readonly(manager.over) as DnDState['over'],
    pointer: readonly(manager.pointer),
    // Measured only for those who read it: an overlay component showing where it would land.
    position: computed(() => {
      const current = manager.active.value;
      const over = manager.over.value;
      if (!current || !over) return null;
      return positionInTarget(manager.getOverlayRect(current, manager.transform.value), over);
    }),
    activation: { progress: readonly(manager.activationProgress) },
    isAutoScrolling: readonly(manager.isAutoScrolling),
    selection: createSelection(manager.selection),
    cancel:
      process.env.NODE_ENV !== 'production'
        ? () => {
            warnIfDeciding(manager, 'cancel()');
            manager.cancel();
          }
        : manager.cancel,
  };
};

/** Subscribes to drag events for the lifetime of the calling scope. */
export const useDnDMonitor = (monitor: DnDMonitor): void => {
  const manager = useManager();
  onScopeDispose(manager.addMonitor(monitor));
};
