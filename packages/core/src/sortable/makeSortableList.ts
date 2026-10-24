import {
  computed,
  onScopeDispose,
  provide,
  shallowRef,
  type InjectionKey,
} from 'vue';
import type {
  Key,
  MaybeElementRef,
  SortableDropEvent,
  SortableListOptions,
  SortableListReturn,
} from '../types';
import { useDnDContext } from '../core/context';
import { createDroppable } from '../core/makeDroppable';
import { createId, toElement } from '../utils/dom';
import { read } from '../utils/read';
import { useSortableGroup, type ListEntry, type SortableGroup } from './group';

export interface SortableContext {
  group: SortableGroup;
  list: ListEntry;
}

export const SORTABLE_CONTEXT: InjectionKey<SortableContext> = Symbol('vue-dnd-kit-sortable');

const defaultGetKey = (item: unknown): Key =>
  item !== null && typeof item === 'object' && 'id' in item
    ? ((item as { id: Key }).id)
    : (item as Key);

/**
 * Makes a container a sortable list. Render the returned `items` (the draft order);
 * the result is written back to `options.items` on drop.
 */
export function makeSortableList<T>(
  target: MaybeElementRef,
  options: SortableListOptions<T>,
): SortableListReturn<T> {
  const manager = useDnDContext();
  const id = options.id ?? createId('sortable');
  const groupOptions = typeof options.group === 'string' ? { name: options.group } : options.group;
  const group = useSortableGroup(manager, groupOptions?.name ?? `sortable:${id}`);
  const getKey = (options.getKey ?? defaultGetKey) as (item: T) => Key;

  const keys = computed(() => options.items.value.map(getKey));
  const byKey = computed(() => {
    const map = new Map<Key, T>();
    for (const item of options.items.value) map.set(getKey(item), item);
    return map;
  });
  const draft = shallowRef<Key[] | null>(null);

  const entry: ListEntry = {
    id,
    draft,
    getElement: () => toElement(target),
    getKeys: () => keys.value,
    getItem: (key) => byKey.value.get(key),
    strategy: () => options.strategy ?? 'vertical',
    placeholder: () => options.placeholder ?? 'item',
    animation: () => options.animation ?? manager.props.animation,
    isDisabled: () => !!read(options.disabled),
    canSort: () => options.sort !== false,
    pull: () => groupOptions?.pull ?? true,
    canPut: (context) => {
      const put = groupOptions?.put ?? true;
      return typeof put === 'function' ? put(context) : put;
    },
    dropOutside: () =>
      options.dropOutside ?? (options.placeholder === 'indicator' ? 'cancel' : 'placeholder'),
    commit: (next, lookup) => {
      options.items.value = next.map((key) => lookup(key) as T);
    },
    beforeDrop: options.onBeforeDrop as ListEntry['beforeDrop'],
    afterDrop: options.onDrop as ((event: SortableDropEvent) => void) | undefined,
  };
  onScopeDispose(group.addList(entry));
  if (options.autoScroll !== undefined) {
    onScopeDispose(manager.registerAutoScroll(entry.getElement, options.autoScroll));
  }

  const droppable = createDroppable(
    target,
    { id, disabled: options.disabled },
    { accepts: (active) => group.accepts(entry, active) },
  );

  provide(SORTABLE_CONTEXT, { group, list: entry });

  const items = computed<T[]>(() => {
    const order = draft.value;
    return order ? order.map((key) => group.lookup(key) as T) : options.items.value;
  });
  const activeKey = computed(() => group.session.value?.activeKey ?? null);
  const activeIndex = computed(() => {
    const key = activeKey.value;
    return key == null ? -1 : group.indexOf(entry, key);
  });
  const activeSize = computed(() => group.session.value?.size ?? null);

  return {
    id,
    items,
    isOver: droppable.isOver,
    isAccepting: droppable.isAccepting,
    // Indicator mode lands with the remaining sortable modules (rfcs/0001-v3.md §15, B3).
    indicator: computed(() => null),
    activeKey,
    activeIndex,
    activeSize,
    captureLayout: group.captureLayout,
  };
}
