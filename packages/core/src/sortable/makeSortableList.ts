import {
  computed,
  getCurrentInstance,
  isReadonly,
  isRef,
  onScopeDispose,
  provide,
  shallowRef,
  unref,
  type Component,
  type InjectionKey,
  type Ref,
} from 'vue';
import type {
  Key,
  MaybeElementRef,
  MaybeReadonlyRef,
  Modifier,
  SortableDropEvent,
  SortableGroupOptions,
  SortableListOptions,
  SortableListReturn,
} from '../types';
import { useManager } from '../core/context';
import { createDroppable } from '../core/makeDroppable';
import { createId, toElement } from '../utils/dom';
import { read } from '../utils/read';
import { useSortableGroup, type SortableGroup } from './group';
import type { ListEntry } from './entry';
import { flatLayout } from './layout';
import { changedRun } from './draft';

/** What a list (or tree) gives its items. */
export interface SortableContext {
  group: SortableGroup;
  list: ListEntry;
  /** The list's `getKey`: keys `makeSortableItem({ item })`. */
  getKey: (item: unknown) => Key;
  /** The list's `overlay` component, used when the item has none. */
  getOverlay: () => Component | undefined;
  /** The list's `modifiers`, used when the item has none. */
  getModifiers?: () => Modifier[] | undefined;
  /** The list's `axis`, used when the item has none. */
  getAxis?: () => 'x' | 'y' | undefined;
}

export const SORTABLE_CONTEXT: InjectionKey<SortableContext> = Symbol('vue-dnd-kit-sortable');

/** `item.id`, or the item itself for primitives (lists and trees). */
export const defaultGetKey = (item: unknown): Key =>
  item !== null && typeof item === 'object' && 'id' in item
    ? ((item as { id: Key }).id)
    : (item as Key);

/** Bundlers replace it: development builds keep the warnings, production drops them. */
declare const process: { env: { NODE_ENV?: string } };

/** Components that provide a sortable context (development only). */
const providers = new WeakSet<object>();

export const provideSortableContext = (
  group: SortableGroup,
  list: ListEntry,
  getKey: (item: never) => Key,
  overlay: MaybeReadonlyRef<Component | undefined>,
  getModifiers?: () => Modifier[] | undefined,
  getAxis?: () => 'x' | 'y' | undefined,
): void => {
  if (process.env.NODE_ENV !== 'production') {
    // A second list overrides the first one's context: every item of the component
    // registers with the last list, and the first list's items stop sorting.
    const instance = getCurrentInstance();
    if (instance && providers.has(instance)) {
      console.warn(
        '[vue-dnd-kit] Two sortable lists (makeSortableList, makeSortableTree) in one component: their items all join the last one, so the others stop sorting. Render each list in its own component.',
      );
    }
    if (instance) providers.add(instance);
  }
  provide(SORTABLE_CONTEXT, {
    group,
    list,
    getKey: getKey as (item: unknown) => Key,
    getOverlay: () => unref(overlay),
    getModifiers,
    getAxis,
  });
};

let warnedClone = false;

/** `group.pull` of a list or tree: `'clone'` needs a `clone` option, without one the items stay (with a warning). */
export const pullOf = (group: SortableGroupOptions | undefined, canClone: boolean): boolean | 'clone' => {
  const pull = group?.pull ?? true;
  if (pull === 'clone' && !canClone) {
    if (!warnedClone) console.warn('[vue-dnd-kit] group.pull: \'clone\' needs a `clone` option; items stay in the list.');
    warnedClone = true;
    return false;
  }
  return pull;
};

/**
 * Makes a container a sortable list. Render the returned `items` (the draft order);
 * the result is written back to `options.items` on drop, after `onDrop`, unless
 * `event.preventDefault()` leaves `event.result` to you.
 */
export function makeSortableList<T>(
  target: MaybeElementRef,
  options: SortableListOptions<T>,
): SortableListReturn<T> {
  const manager = useManager();
  const id = options.id ?? createId('sortable');
  const groupOptions = typeof options.group === 'string' ? { name: options.group } : options.group;
  const group = useSortableGroup(manager, groupOptions?.name ?? `sortable:${id}`);
  const getKey = (options.getKey ?? defaultGetKey) as (item: T) => Key;
  const source = () => read<readonly T[]>(options.items) as T[];

  const keys = computed(() => source().map(getKey));
  const byKey = computed(() => {
    const map = new Map<Key, T>();
    for (const item of source()) map.set(getKey(item), item);
    return map;
  });
  const draft = shallowRef<Key[] | null>(null);

  const entry: ListEntry = {
    id,
    draft,
    getElement: () => toElement(target),
    getKeys: () => keys.value,
    getItem: (key) => byKey.value.get(key),
    layout: flatLayout,
    options,
    strategy: () => read(options.strategy) ?? 'vertical',
    placeholder: () => read(options.placeholder) ?? 'item',
    animation: () => unref(options.animation) ?? manager.props.animation,
    animate: () => read(options.animate) ?? manager.props.animate,
    isDisabled: () => !!read(options.disabled),
    canSort: () => read(options.sort) !== false,
    pull: () => pullOf(groupOptions, !!options.clone),
    canPut: (context) => {
      const put = groupOptions?.put ?? true;
      return typeof put === 'function' ? put(context) : put;
    },
    dropOutside: () =>
      read(options.dropOutside) ?? (read(options.placeholder) === 'indicator' ? 'cancel' : 'placeholder'),
    behavior: () => read(options.behavior) ?? 'sort',
    multiple: () => read(options.multiple) ?? 'group',
    acceptMode: () => read(options.acceptMode) ?? 'all',
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
    isReadonly: () => !isRef(options.items) || isReadonly(options.items),
    build: (next, lookup) => next.map(lookup),
    // The very array the drop's `result` holds.
    commit: (built) => {
      (options.items as Ref<T[]>).value = built as T[];
    },
    beforeDrop: options.onBeforeDrop as ListEntry['beforeDrop'],
    afterDrop: options.onDrop as ((event: SortableDropEvent) => void) | undefined,
  };
  onScopeDispose(group.addList(entry));
  group.animateChanges(entry);
  onScopeDispose(manager.registerAutoScroll(entry.getElement, () => read(options.autoScroll)));

  const droppable = createDroppable(
    target,
    // Lists the current drag can never enter are not drop targets at all: in nested
    // sortables a column dragged over another column must reach the columns list,
    // not stop at the inner card list it happens to be over.
    { id, disabled: () => !!read(options.disabled) || group.isInert(entry) },
    { accepts: (active) => group.accepts(entry, active) },
  );

  provideSortableContext(
    group,
    entry,
    getKey,
    options.overlay,
    () => read(options.modifiers),
    () => read(options.axis),
  );

  // A new draft usually differs from the previous one in a short run (a reorder): only
  // that run is looked up, the rest is copied. Items of a session never change by key.
  let rendered: { order: Key[]; items: T[]; session: unknown } | null = null;
  const items = computed<T[]>(() => {
    const order = draft.value;
    if (!order) {
      rendered = null;
      return source();
    }
    const session = group.session.value;
    const lookup = (key: Key) => group.lookup(key) as T;
    let next: T[];
    if (rendered?.session === session) {
      const { start, end, nextEnd } = changedRun(rendered.order, order);
      const previous = rendered.items;
      next = previous.slice(0, start).concat(order.slice(start, nextEnd).map(lookup), previous.slice(end));
    } else {
      next = order.map(lookup);
    }
    rendered = { order, items: next, session };
    return next;
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
