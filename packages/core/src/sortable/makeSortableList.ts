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
  ActivationOptions,
  DropAnimation,
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
import { putAllows } from './accept';
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
  /** The list's `dropAnimation`, used when the item has none. */
  getDropAnimation: () => DropAnimation | undefined;
  /** The list's `modifiers`, used when the item has none. */
  getModifiers?: () => Modifier[] | undefined;
  /** The list's `axis`, used when the item has none. */
  getAxis?: () => 'x' | 'y' | undefined;
  /** The list's `activation`, used when the item has none. */
  getActivation?: () => ActivationOptions | undefined;
}

/** What the lists (and trees) of a component give the items it renders: several are told apart by the DOM. */
export interface SortableScope {
  contexts: SortableContext[];
}

export const SORTABLE_CONTEXT: InjectionKey<SortableScope> = Symbol('vue-dnd-kit-sortable');

/** The scope of each component with lists: provided once, its later lists join it. */
const scopes = new WeakMap<object, SortableScope>();

/**
 * The context of the list an item is in: the component's only list, or of several the
 * innermost whose element holds the item's element (the first while it isn't rendered).
 */
export const contextOf = (scope: SortableScope, element: Element | null): SortableContext => {
  const { contexts } = scope;
  if (contexts.length === 1 || !element) return contexts[0]!;
  let found: SortableContext | undefined;
  let container: Element | null = null;
  for (const context of contexts) {
    const own = context.list.getElement();
    if (own?.contains(element) && (!container || container.contains(own))) {
      found = context;
      container = own;
    }
  }
  return found ?? contexts[0]!;
};

/** `item.id`, or the item itself for primitives (lists and trees). */
export const defaultGetKey = (item: unknown): Key =>
  item !== null && typeof item === 'object' && 'id' in item
    ? ((item as { id: Key }).id)
    : (item as Key);

export const provideSortableContext = (
  group: SortableGroup,
  list: ListEntry,
  getKey: (item: never) => Key,
  overlay: MaybeReadonlyRef<Component | undefined>,
  dropAnimation: MaybeReadonlyRef<DropAnimation | undefined>,
  getModifiers?: () => Modifier[] | undefined,
  getAxis?: () => 'x' | 'y' | undefined,
  getActivation?: () => ActivationOptions | undefined,
): void => {
  const context: SortableContext = {
    group,
    list,
    getKey: getKey as (item: unknown) => Key,
    getOverlay: () => unref(overlay),
    getDropAnimation: () => unref(dropAnimation),
    getModifiers,
    getAxis,
    getActivation,
  };
  // Several lists in one component: its items find theirs by the DOM (`contextOf`).
  const instance = getCurrentInstance();
  const own = instance && scopes.get(instance);
  if (own) {
    own.contexts.push(context);
    return;
  }
  const scope: SortableScope = { contexts: [context] };
  if (instance) scopes.set(instance, scope);
  provide(SORTABLE_CONTEXT, scope);
};

/**
 * A drop into a list with `filter`: the new order of the shown keys (`next`) as the whole
 * array. Each hidden item stays after the shown one it followed, or, when that one moved
 * (`inserted`) or left, after the nearest before it that stayed (first, without one).
 */
export const withHidden = <T>(
  all: readonly T[],
  shown: readonly Key[],
  next: readonly Key[],
  inserted: readonly Key[],
  getKey: (item: T) => Key,
  lookup: (key: Key) => unknown,
): unknown[] => {
  const visible = new Set(shown);
  const stayed = new Set(next);
  for (const key of inserted) stayed.delete(key);
  const first: T[] = [];
  const after = new Map<Key, T[]>();
  let anchor: Key | null = null;
  for (const item of all) {
    const key = getKey(item);
    if (visible.has(key)) {
      if (stayed.has(key)) anchor = key;
    } else if (anchor === null) {
      first.push(item);
    } else {
      let hidden = after.get(anchor);
      if (!hidden) after.set(anchor, (hidden = []));
      hidden.push(item);
    }
  }
  return [...first, ...next.flatMap((key) => [lookup(key), ...(after.get(key) ?? [])])];
};

/** Bundlers replace it: development builds keep the warnings, production drops them. */
declare const process: { env: { NODE_ENV?: string } };

let warnedClone = false;

/** `group.pull` of a list or tree: `'clone'` needs a `clone` option, without one the items stay (with a warning). */
export const pullOf = (group: Pick<SortableGroupOptions, 'pull'> | undefined, canClone: boolean): boolean | 'clone' => {
  const pull = group?.pull ?? true;
  if (pull === 'clone' && !canClone) {
    if (process.env.NODE_ENV !== 'production' && !warnedClone) {
      console.warn('[vue-dnd-kit] group.pull: \'clone\' needs a `clone` option; items stay in the list.');
    }
    warnedClone = true;
    return false;
  }
  return pull;
};

/** `external` of a list or tree makes its items with `createItem`: without one it takes nothing, and development builds say so. */
export const checkExternal = (options: { external?: unknown; createItem?: unknown }, kind: 'list' | 'tree') => {
  if (process.env.NODE_ENV !== 'production' && read(options.external) && !options.createItem) {
    console.warn(`[vue-dnd-kit] A sortable ${kind} with \`external\` needs \`createItem\` to make items of what comes from outside the page; without one it takes nothing.`);
  }
};

/**
 * Makes a container a sortable list. Render the returned `items` (the draft order), not
 * your array: the drop is written back to `options.items`, after `onDrop`, unless
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
  checkExternal(options, 'list');
  const getKey = (options.getKey ?? defaultGetKey) as (item: T) => Key;
  const source = () => read<readonly T[]>(options.items) as T[];
  // `filter`: the list shows, and sorts, only these.
  const shown = computed(() => (options.filter ? source().filter(options.filter) : source()));

  const keys = computed(() => shown.value.map(getKey));
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
    animate: () => read(options.animateChanges) ?? manager.props.animateChanges,
    animateSize: () => read(options.animateSize) ?? true,
    isDisabled: () => !!read(options.disabled),
    canSort: () => read(options.sort) !== false,
    pull: () => pullOf(groupOptions, !!options.clone),
    canPut: (context) => putAllows(groupOptions?.put as SortableGroupOptions['put'], context, manager),
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
          const made = options.createItem!(active);
          return made === undefined ? undefined : (Array.isArray(made) ? made : [made]).map((item: T) => ({ key: getKey(item), item }));
        }
      : undefined,
    external: () => read(options.external),
    keyOf: (item) => getKey(item as T),
    isReadonly: () => !isRef(options.items) || isReadonly(options.items),
    build: (next, lookup, inserted) => (options.filter ? withHidden(source(), keys.value, next, inserted, getKey, lookup) : next.map(lookup)),
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
    // The list takes drops in its `dropzone` (a column around it), else in its element.
    () => toElement(options.dropzone) ?? toElement(target),
    // Lists the current drag can never enter are not drop targets at all: in nested
    // sortables a column dragged over another column must reach the columns list,
    // not stop at the inner card list it happens to be over.
    {
      id,
      label: options.label,
      data: options.data,
      disabled: () => !!read(options.disabled) || group.isInert(entry),
      // As a target: what the overlay shows over it, and how it lands in it.
      overOverlay: options.overOverlay,
      overDropAnimation: options.overDropAnimation,
      // Drags from outside the page it takes (with `createItem`).
      external: options.external,
    },
    { accepts: (active) => group.accepts(entry, active), getGroup: () => group.name },
  );

  provideSortableContext(
    group,
    entry,
    getKey,
    options.overlay,
    options.dropAnimation,
    () => read(options.modifiers),
    () => read(options.axis),
    () => read(options.activation),
  );

  // A new draft usually differs from the previous one in a short run (a reorder): only
  // that run is looked up, the rest is copied. Items of a session never change by key.
  let rendered: { order: Key[]; items: T[]; session: unknown } | null = null;
  const items = computed<T[]>(() => {
    const order = draft.value;
    if (!order) {
      rendered = null;
      return shown.value;
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
