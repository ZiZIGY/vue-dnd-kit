import { computed, isReadonly, isRef, onScopeDispose, shallowRef, unref } from 'vue';
import type {
  FlatNode,
  Key,
  MaybeElementRef,
  SortableTreeOptions,
  SortableTreeReturn,
  TreeProjection,
} from '../types';
import { useManager } from '../core/context';
import { createDroppable } from '../core/makeDroppable';
import { createId, toElement } from '../utils/dom';
import { read } from '../utils/read';
import { useSortableGroup } from './group';
import type { ListEntry } from './entry';
import { defaultGetKey, provideSortableContext, pullOf } from './makeSortableList';
import { createFlatTree, flattenTree, type TreeAccessors } from './tree/flatten';
import { blockHere, indicating, rows, source, type TreeContext } from './tree/context';
import { treeLayout } from './tree/layout';
import { afterDrop, beforeDrop, build, commit } from './tree/drop';
import { keyboardCoordinates } from './tree/keyboard';

const defaultGetChildren = (node: unknown): unknown[] | undefined =>
  node !== null && typeof node === 'object' ? (node as { children?: unknown[] }).children : undefined;

const defaultSetChildren = (node: unknown, children: unknown[]) => {
  (node as { children?: unknown[] }).children = children;
};

/**
 * Makes a container a sortable tree. Render the returned `items` (visible nodes in
 * draft order, indented by `depth`) with a row component that calls `makeSortableItem`.
 * On drop, after `onDrop`, the moved nodes (with their subtrees) are written into
 * `options.items`, unless `event.preventDefault()` leaves `event.result` to you.
 */
export function makeSortableTree<T>(
  target: MaybeElementRef,
  options: SortableTreeOptions<T>,
): SortableTreeReturn<T> {
  const manager = useManager();
  const id = options.id ?? createId('tree');
  const groupOptions = typeof options.group === 'string' ? { name: options.group } : options.group;
  const group = useSortableGroup(manager, groupOptions?.name ?? `sortable:${id}`);
  const accessors: TreeAccessors<T> = {
    getKey: (options.getKey ?? defaultGetKey) as (node: T) => Key,
    getChildren: (options.getChildren ?? defaultGetChildren) as (node: T) => T[] | undefined,
    setChildren: (options.setChildren ?? defaultSetChildren) as (node: T, children: T[]) => void,
  };
  const t: TreeContext<T> = {
    id,
    manager,
    group,
    options,
    accessors,
    withChildren:
      options.withChildren ??
      ((node: T, children: T[]): T => {
        const copy = { ...node };
        accessors.setChildren(copy, children);
        return copy;
      }),
    flat: computed(() =>
      createFlatTree(flattenTree(source(t), accessors.getKey, accessors.getChildren, read(options.collapsed))),
    ),
    draft: shallowRef<Key[] | null>(null),
    placement: shallowRef(null),
    state: null,
    spot: null,
    dropInfo: null,
    incoming: null,
    prepared: null,
    entry: null!,
  };
  const { flat, draft, placement } = t;
  const keys = computed(() => flat.value.nodes.map((node) => node.key));

  const entry: ListEntry = {
    id,
    draft,
    getElement: () => toElement(target),
    getKeys: () => keys.value,
    getItem: (key) => rows(t).get(key)?.item,
    layout: treeLayout(t),
    strategy: () => 'vertical',
    placeholder: () => read(options.placeholder) ?? 'item',
    animation: () => unref(options.animation) ?? manager.props.animation,
    isDisabled: () => !!read(options.disabled),
    canSort: () => true,
    pull: () => pullOf(groupOptions, !!options.clone),
    canPut: (context) => {
      const put = groupOptions?.put ?? true;
      return typeof put === 'function' ? put(context) : put;
    },
    dropOutside: () => read(options.dropOutside) ?? (indicating(t) ? 'cancel' : 'placeholder'),
    multiple: () => 'group',
    acceptMode: () => read(options.acceptMode) ?? 'all',
    // A copy brings its subtree: `clone` copies the whole node.
    clone: options.clone
      ? (node) => {
          const copy = options.clone!(node as T);
          return { key: accessors.getKey(copy), item: copy };
        }
      : undefined,
    create: options.createItem
      ? (active) => {
          const node = options.createItem!(active);
          return node === undefined ? undefined : { key: accessors.getKey(node), item: node };
        }
      : undefined,
    isReadonly: () => !isRef(options.items) || isReadonly(options.items),
    build: (next, lookup, inserted) => build(t, next, lookup, inserted),
    commit: (_items, next, lookup, inserted) => commit(t, next, lookup, inserted),
    beforeDrop: (event) => beforeDrop(t, event),
    afterDrop: (event) => afterDrop(t, event),
  };
  t.entry = entry;
  onScopeDispose(group.addList(entry));

  onScopeDispose(
    manager.addMonitor({
      getKeyboardCoordinates: (_event, context) => keyboardCoordinates(t, context),
    }),
  );

  // ─── Droppable, context, output ──────────────────────────────────────────────

  const droppable = createDroppable(
    target,
    // Trees the current drag can never enter (a plain draggable without `createItem`)
    // are no drop targets, as lists.
    { id, disabled: () => !!read(options.disabled) || group.isInert(entry) },
    { accepts: (active) => group.accepts(entry, active) },
  );

  // Read when a drag starts; `undefined` leaves the provider's.
  onScopeDispose(manager.registerAutoScroll(entry.getElement, () => read(options.autoScroll)));

  provideSortableContext(group, entry, accessors.getKey, options.overlay, () => read(options.modifiers));

  // The row a virtualizer must keep mounted. The session is mutated in place: a copy or a
  // created node is read from the slot's reactive mirror (the lead never changes).
  const activeKey = computed(() => {
    const current = group.session.value;
    if (!current) return null;
    const slot = manager.landingKey.value ?? current.lead;
    return group.indexOf(entry, slot) !== -1 ? slot : current.activeKey;
  });
  const inTree = computed(() => {
    const current = group.session.value;
    return !!current && draft.value != null && group.indexOf(entry, current.slot) !== -1;
  });
  const indicator = computed(() => {
    const value = group.indicator.value;
    return value?.list === id ? value : null;
  });

  /** A row for a node that isn't in this tree's data yet: from another list, a copy, a created node. */
  const newRow = (key: Key): FlatNode<T> => {
    const item = group.lookup(key) as T;
    const children = item === undefined ? undefined : accessors.getChildren(item);
    return { key, item, depth: 0, parentKey: null, index: 0, hasChildren: !!children?.length, collapsed: false };
  };

  const items = computed<FlatNode<T>[]>(() => {
    const order = draft.value;
    const { nodes, byKey } = flat.value;
    if (!order) return nodes;
    const current = t.state;
    let visible = order;
    // Indicator mode: a dragged node that went to another list takes its subtree along.
    if (indicating(t) && current) {
      visible = order.filter((key) => {
        const carrier = current.moving.get(key);
        return carrier === undefined || carrier === key || group.indexOf(entry, carrier) !== -1;
      });
    }
    const projection = indicating(t) ? null : placement.value;
    // The dragged nodes here (a multi-drag block) carry the projected depth, side by side.
    const block = new Map((projection ? blockHere(t) : []).map((key, index) => [key, index]));
    return visible.map((nodeKey) => {
      const node = byKey.get(nodeKey) ?? newRow(nodeKey);
      const at = block.get(nodeKey);
      return at === undefined ? node : { ...node, ...projection!, index: projection!.index + at };
    });
  });

  const activeIndex = computed(() => {
    const key = activeKey.value;
    return key == null ? -1 : items.value.findIndex((row) => row.key === key);
  });
  const activeSize = computed(() => group.session.value?.size ?? null);

  const projected = computed<TreeProjection | null>(() => {
    const projection = placement.value;
    // Indicator mode: the line's place, while it is in this tree.
    return projection && (indicating(t) ? indicator.value : inTree.value)
      ? { depth: projection.depth, parentKey: projection.parentKey }
      : null;
  });

  return {
    id,
    items,
    projected,
    indicator,
    isOver: droppable.isOver,
    isAccepting: droppable.isAccepting,
    activeKey,
    activeIndex,
    activeSize,
    captureLayout: group.captureLayout,
  };
}
