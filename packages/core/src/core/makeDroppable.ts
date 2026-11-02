import { computed, markRaw, onScopeDispose, unref, watch } from 'vue';
import type {
  Active,
  DroppableOptions,
  DroppableReturn,
  Key,
  MaybeElementRef,
  Placement,
} from '../types';
import type { DroppableEntry } from './manager';
import { useManager } from './context';
import { matchesRule } from './accept';
import { createId, toElement } from '../utils/dom';
import { read } from '../utils/read';
import { getCenter } from '../animation/layout';
import { takesExternal } from './native/data';

/** Hooks used by the sortable layer: it accepts by group rules instead of `accept`. */
export interface DroppableInternals {
  accepts?: (active: Active) => boolean;
  /** The list's group: its lists take its items from another window of the app. */
  getGroup?: () => string;
}

export function createDroppable<TData>(
  target: MaybeElementRef,
  options: DroppableOptions<TData>,
  internals: DroppableInternals = {},
): DroppableReturn {
  const manager = useManager();
  const fallbackId = createId('droppable');
  const id = computed<Key>(() => read(options.id) ?? fallbackId);

  // A drag from outside the page by its own rule (`external`); a list's group rules take
  // that in too, as they make items for it.
  const accepts =
    internals.accepts ??
    ((active: Active) =>
      active.external && !active.external.group
        ? takesExternal(read(options.external), active.external)
        : matchesRule(
            unref(options.accept),
            { active, items: active.items, types: active.items.flatMap((item) => item.type) },
            read(options.acceptMode),
          ));

  const entry: DroppableEntry = {
    id: id.value,
    getPriority: () => read(options.priority) ?? 0,
    // Lists and trees accept by group rules.
    sortable: !!internals.accepts,
    options,
    getElement: () => toElement(target),
    getData: () => read(options.data),
    getLabel: () => read(options.label),
    isDisabled: () => !!read(options.disabled),
    accepts,
    getExternal: () => read(options.external),
    getGroup: internals.getGroup,
    getOverlay: () => {
      const overlay = unref(options.overOverlay);
      return overlay ? markRaw(overlay) : undefined;
    },
    getDropAnimation: () => unref(options.overDropAnimation),
    onDragEnter: options.onDragEnter,
    onDragLeave: options.onDragLeave,
    onBeforeDrop: options.onBeforeDrop,
    onDrop: options.onDrop,
  };

  let unregister = manager.registerDroppable(entry);
  watch(id, (next) => {
    unregister();
    entry.id = next;
    unregister = manager.registerDroppable(entry);
  });
  onScopeDispose(() => unregister());

  const isOver = computed(() => manager.over.value?.id === id.value);
  // While an async `onBeforeDrop` decides, nothing has changed yet and the rules still
  // hold. Once the drop is decided the drag state is gone (`active` is `null`): they stop.
  const isAccepting = computed(() => {
    const active = manager.active.value;
    return !!active && !entry.isDisabled() && accepts(active);
  });
  const placement = computed<Placement | null>(() => {
    const over = manager.over.value;
    const pointer = manager.pointer.value;
    if (!pointer || over?.id !== id.value) return null;
    const center = getCenter(over.rect);
    return {
      top: pointer.y <= center.y,
      bottom: pointer.y > center.y,
      left: pointer.x <= center.x,
      right: pointer.x > center.x,
    };
  });

  return { id, isOver, isAccepting, placement };
}

/** Makes an element a drop target. */
export function makeDroppable<TData = unknown>(
  target: MaybeElementRef,
  options: DroppableOptions<TData> = {},
): DroppableReturn {
  return createDroppable(target, options);
}
