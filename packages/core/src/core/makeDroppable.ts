import { computed, onScopeDispose, unref, watch } from 'vue';
import type {
  Active,
  DroppableOptions,
  DroppableReturn,
  Key,
  MaybeElementRef,
  Placement,
} from '../types';
import type { DroppableEntry } from './manager';
import { useDnDContext } from './context';
import { matchesRule } from './accept';
import { createId, toElement } from '../utils/dom';
import { read } from '../utils/read';
import { getCenter } from '../animation/layout';

/** Hook used by the sortable layer to accept by group rules instead of `accept`. */
export interface DroppableInternals {
  accepts?: (active: Active) => boolean;
}

export function createDroppable<TData>(
  target: MaybeElementRef,
  options: DroppableOptions<TData>,
  internals: DroppableInternals = {},
): DroppableReturn {
  const manager = useDnDContext();
  const fallbackId = createId('droppable');
  const id = computed<Key>(() => read(options.id) ?? fallbackId);

  const accepts =
    internals.accepts ??
    ((active: Active) =>
      matchesRule(
        unref(options.accept),
        { active, items: active.items, types: active.items.flatMap((item) => item.type) },
        options.acceptMode,
      ));

  const entry: DroppableEntry = {
    id: id.value,
    priority: options.priority ?? 0,
    getElement: () => toElement(target),
    getData: () => read(options.data),
    isDisabled: () => !!read(options.disabled),
    accepts,
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
  // hold. Once the drop is decided they would run against the changed data: they stop.
  const isAccepting = computed(() => {
    const active = manager.active.value;
    const status = manager.status.value;
    const live = status === 'dragging' || (status === 'dropping' && !manager.settling.value);
    return !!active && live && !entry.isDisabled() && accepts(active);
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
