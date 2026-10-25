import {
  computed,
  markRaw,
  onScopeDispose,
  provide,
  shallowRef,
  type Component,
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

/** What a list (or tree) gives its items. */
export interface SortableContext {
  group: SortableGroup;
  list: ListEntry;
  /** The list's `getKey`: keys `makeSortableItem({ item })`. */
  getKey: (item: unknown) => Key;
  /** The list's `overlay` component, used when the item has none. */
  overlay?: Component;
}

export const SORTABLE_CONTEXT: InjectionKey<SortableContext> = Symbol('vue-dnd-kit-sortable');

/** `item.id`, or the item itself for primitives (lists and trees). */
export const defaultGetKey = (item: unknown): Key =>
  item !== null && typeof item === 'object' && 'id' in item
    ? ((item as { id: Key }).id)
    : (item as Key);

export const provideSortableContext = (
  group: SortableGroup,
  list: ListEntry,
  getKey: (item: never) => Key,
  overlay: Component | undefined,
): void =>
  provide(SORTABLE_CONTEXT, {
    group,
    list,
    getKey: getKey as (item: unknown) => Key,
    overlay: overlay && markRaw(overlay),
  });

let warnedClone = false;

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
    pull: () => {
      const pull = groupOptions?.pull ?? true;
      if (pull === 'clone' && !options.clone) {
        if (!warnedClone) console.warn('[vue-dnd-kit] group.pull: \'clone\' needs a `clone` option; items stay in the list.');
        warnedClone = true;
        return false;
      }
      return pull;
    },
    canPut: (context) => {
      const put = groupOptions?.put ?? true;
      return typeof put === 'function' ? put(context) : put;
    },
    dropOutside: () =>
      options.dropOutside ?? (options.placeholder === 'indicator' ? 'cancel' : 'placeholder'),
    behavior: () => options.behavior ?? 'sort',
    multiple: () => options.multiple ?? 'stack',
    acceptMode: () => options.acceptMode ?? 'all',
    clone: options.clone
      ? (item) => {
          const copy = options.clone!(item as T);
          return { key: getKey(copy), item: copy };
        }
      : undefined,
    create: options.createItem
      ? (active) => {
          const item = options.createItem!(active);
          return item === undefined ? undefined : { key: getKey(item), item };
        }
      : undefined,
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
    // Lists the current drag can never enter are not drop targets at all: in nested
    // sortables a column dragged over another column must reach the columns list,
    // not stop at the inner card list it happens to be over.
    { id, disabled: () => !!read(options.disabled) || group.isInert(entry) },
    { accepts: (active) => group.accepts(entry, active) },
  );

  provideSortableContext(group, entry, getKey, options.overlay);

  const items = computed<T[]>(() => {
    const order = draft.value;
    return order ? order.map((key) => group.lookup(key) as T) : options.items.value;
  });
  // The row a virtualizer must keep mounted: in the list holding a copy or an
  // external item, that row is the copy/item (the slot), not the original.
  // The session is mutated in place, so the slot is read from its reactive mirror.
  const activeKey = computed(() => {
    const current = group.session.value;
    if (!current) return null;
    const slot = manager.landingKey.value;
    return slot != null && group.indexOf(entry, slot) !== -1 ? slot : current.activeKey;
  });
  const activeIndex = computed(() => {
    const key = activeKey.value;
    return key == null ? -1 : group.indexOf(entry, key);
  });
  const activeSize = computed(() => group.session.value?.size ?? null);
  const indicator = computed(() => {
    const value = group.indicator.value;
    return value?.list === id ? value : null;
  });

  return {
    id,
    items,
    isOver: droppable.isOver,
    isAccepting: droppable.isAccepting,
    indicator,
    activeKey,
    activeIndex,
    activeSize,
    captureLayout: group.captureLayout,
  };
}
