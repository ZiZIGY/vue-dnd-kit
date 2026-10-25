import {
  computed,
  inject,
  onScopeDispose,
  readonly,
  type App,
  type InjectionKey,
} from 'vue';
import type { DnDMonitor, DnDSelection, DnDState, Key } from '../types';
import type { DnDManager } from './manager';

export const DND_CONTEXT: InjectionKey<DnDManager> = Symbol('vue-dnd-kit');

/** The provider's manager. Advanced API: also used to bridge shadow roots and separate apps. */
export const useDnDContext = (): DnDManager => {
  const manager = inject(DND_CONTEXT, null);
  if (!manager) {
    throw new Error('[vue-dnd-kit] No <DnDProvider> found above this component.');
  }
  return manager;
};

/** Shares a provider with another Vue app (e.g. one mounted inside a shadow root). */
export const provideDnDContext = (app: App, manager: DnDManager): void => {
  app.provide(DND_CONTEXT, manager);
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
  const manager = useDnDContext();
  return {
    status: readonly(manager.status),
    // The overlay keeps its item for the drop animation; the drag itself is over.
    active: computed(() => (manager.settling.value ? null : manager.active.value)),
    over: readonly(manager.over) as DnDState['over'],
    pointer: readonly(manager.pointer),
    activation: { progress: readonly(manager.activationProgress) },
    isAutoScrolling: readonly(manager.isAutoScrolling),
    selection: createSelection(manager.selection),
    cancel: manager.cancel,
  };
};

/** Subscribes to drag events for the lifetime of the calling scope. */
export const useDnDMonitor = (monitor: DnDMonitor): void => {
  const manager = useDnDContext();
  onScopeDispose(manager.addMonitor(monitor));
};
