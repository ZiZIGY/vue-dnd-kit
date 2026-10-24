import { computed, onScopeDispose, provide, shallowRef } from 'vue';
import type {
  Coordinates,
  DnDEvent,
  FlatNode,
  Key,
  KeyboardMoveContext,
  MaybeElementRef,
  SortableDropEvent,
  SortableTreeDropEvent,
  SortableTreeOptions,
  SortableTreeReturn,
  TreeProjection,
} from '../types';
import { useDnDContext } from '../core/context';
import { createDroppable } from '../core/makeDroppable';
import { getLayoutRect } from '../animation/layout';
import { createId, toElement } from '../utils/dom';
import { read } from '../utils/read';
import { useSortableGroup, type ListEntry, type ProjectContext } from './group';
import { SORTABLE_CONTEXT } from './makeSortableList';
import {
  applyTreeMove,
  createFlatTree,
  depthRange,
  flattenTree,
  moveKey,
  offsetDepth,
  parentAt,
  projectDepth,
  projectTreeIndex,
  siblingIndexAt,
  subtreeEnd,
  subtreeHeight,
  type DepthFilter,
  type DraftPosition,
  type TreeAccessors,
} from './tree';

const DEFAULT_INDENTATION = 24;

const defaultGetKey = (node: unknown): Key =>
  node !== null && typeof node === 'object' && 'id' in node ? (node as { id: Key }).id : (node as Key);

const defaultGetChildren = (node: unknown): unknown[] | undefined =>
  node !== null && typeof node === 'object' ? (node as { children?: unknown[] }).children : undefined;

const defaultSetChildren = (node: unknown, children: unknown[]) => {
  (node as { children?: unknown[] }).children = children;
};

/** Projection plus the index among the new siblings. */
interface Placement extends TreeProjection {
  index: number;
}

interface Origin {
  parentKey: Key | null;
  index: number;
}

interface DragState<T> {
  activeKey: Key;
  item: T;
  /** Place before the drag; `null` when the item comes from another list of the group. */
  origin: Origin | null;
  startDepth: number;
  /** Levels below the active node (collapsed ones included), checked against `maxDepth`. */
  height: number;
  /**
   * Origin of the offset rule. Nodes of this tree: the start depth and pointer x (x is
   * filled by the first move). Items from another list have no meaningful start here:
   * the last hovered row's level, from the pointer x when that row was entered.
   */
  base: { depth: number; x: number | null; key: Key | null };
  /** The active item entered from another list (possibly coming back): anchor on rows. */
  followRows: boolean;
  /**
   * Row whose middle band was hovered last, and the pointer x at that moment. Until
   * the pointer hovers another row, the offset rule counts from that row's child
   * depth, so the nested placeholder doesn't jump back while the pointer rests on it.
   */
  nest: { key: Key; x: number } | null;
  /** `nesting: 'hover'`: level asked for by the last hovered edge band. */
  hoverDepth: number;
  /** Keyboard: slot and depth chosen by the last arrow key, applied by the next move. */
  pending: { index: number; depth: number } | null;
}

interface DropInfo {
  from: Origin | null;
  to: Placement | null;
}

/**
 * Makes a container a sortable tree. Render the returned `items` (visible nodes in
 * draft order, indented by `depth`) with a row component that calls `makeSortableItem`.
 * On drop, the moved node (with its subtree) is written into `options.items`.
 */
export function makeSortableTree<T>(
  target: MaybeElementRef,
  options: SortableTreeOptions<T>,
): SortableTreeReturn<T> {
  const manager = useDnDContext();
  const id = options.id ?? createId('tree');
  const groupOptions = typeof options.group === 'string' ? { name: options.group } : options.group;
  const group = useSortableGroup(manager, groupOptions?.name ?? `sortable:${id}`);
  const accessors: TreeAccessors<T> = {
    getKey: (options.getKey ?? defaultGetKey) as (node: T) => Key,
    getChildren: (options.getChildren ?? defaultGetChildren) as (node: T) => T[] | undefined,
    setChildren: (options.setChildren ?? defaultSetChildren) as (node: T, children: T[]) => void,
  };
  const indentation = () => options.indentation ?? DEFAULT_INDENTATION;
  const nesting = () => options.nesting ?? 'both';

  // Flattened only when the data or the collapsed set changes.
  const flat = computed(() =>
    createFlatTree(
      flattenTree(options.items.value, accessors.getKey, accessors.getChildren, options.collapsed?.value),
    ),
  );
  const keys = computed(() => flat.value.nodes.map((node) => node.key));
  const draft = shallowRef<Key[] | null>(null);
  const placement = shallowRef<Placement | null>(null);
  let state: DragState<T> | null = null;
  let dropInfo: DropInfo | null = null;

  const rows = () => flat.value.byKey;

  const depthFilter =
    (current: DragState<T>): DepthFilter =>
    (depth, parentKey) => {
      if (options.maxDepth != null && depth + current.height > options.maxDepth) return false;
      if (parentKey == null || !options.canNest) return true;
      const parent = rows().get(parentKey);
      return !parent || options.canNest(current.item, parent.item);
    };

  const canNestInto = (current: DragState<T>, key: Key) => {
    const row = rows().get(key);
    return !!row && depthFilter(current)(row.depth + 1, key);
  };

  const activeIndexInDraft = (current: DragState<T>) => (draft.value ? group.indexOf(entry, current.activeKey) : -1);

  // ─── Drag lifecycle (ListEntry hooks) ────────────────────────────────────────

  const start = (draftKeys: Key[], activeKey: Key): Key[] => {
    const node = rows().get(activeKey);
    dropInfo = null;
    if (!node) {
      // A drag from another list of the group: the item may enter this tree later.
      const item = group.lookup(activeKey) as T;
      state = {
        activeKey,
        item,
        origin: null,
        startDepth: 0,
        height: item == null ? 0 : subtreeHeight(item, accessors.getChildren),
        base: { depth: 0, x: null, key: null },
        followRows: true,
        nest: null,
        hoverDepth: 0,
        pending: null,
      };
      placement.value = null;
      return draftKeys;
    }
    state = {
      activeKey,
      item: node.item,
      origin: { parentKey: node.parentKey, index: node.index },
      startDepth: node.depth,
      height: subtreeHeight(node.item, accessors.getChildren),
      base: { depth: node.depth, x: null, key: null },
      followRows: false,
      nest: null,
      hoverDepth: node.depth,
      pending: null,
    };
    placement.value = { depth: node.depth, parentKey: node.parentKey, index: node.index };
    // The node carries its subtree: hide the visible descendants for the whole drag.
    const index = draftKeys.indexOf(activeKey);
    if (index === -1 || !node.hasChildren || node.collapsed) return draftKeys;
    const draftRows = draftKeys.map((key) => rows().get(key) ?? { depth: 0 });
    const end = subtreeEnd(draftRows, index);
    return end === index + 1 ? draftKeys : [...draftKeys.slice(0, index + 1), ...draftKeys.slice(end)];
  };

  const project = (event: DnDEvent, context: ProjectContext): number | null => {
    const current = state;
    if (!current || current.activeKey !== context.activeKey) return null;
    if (event.active.sensor === 'keyboard') {
      // Arrow keys pick the slot themselves; the pointer only moves the overlay there.
      const pending = current.pending;
      return pending && pending.index !== context.activeIndex ? pending.index : null;
    }
    const result = projectTreeIndex({
      pointer: event.pointer,
      items: context.items,
      activeKey: context.activeKey,
      activeIndex: context.activeIndex,
      length: context.keys.length,
      canNestInto: nesting() === 'offset' ? undefined : (key) => canNestInto(current, key),
    });
    const hitRow = result.hit ? rows().get(result.hit.key) : undefined;
    if (result.nest != null) {
      current.nest = { key: result.nest, x: event.pointer.x };
    } else if (hitRow) {
      current.nest = null;
      current.hoverDepth = hitRow.depth;
    }
    // The drag start in another list says nothing about depth here: re-anchor the
    // offset rule on every newly hovered row, at that row's level.
    if (context.activeIndex === -1) current.followRows = true;
    if (current.followRows && hitRow && hitRow.key !== current.base.key) {
      current.base = { depth: hitRow.depth, x: event.pointer.x, key: hitRow.key };
    }
    if (result.index == null) return null;
    if (result.nest == null) {
      // Skip slots where no depth satisfies `canNest` and `maxDepth`.
      const position: DraftPosition = {
        keys: moveKey(context.keys, context.activeKey, context.activeIndex, result.index),
        index: result.index,
        rows: rows(),
      };
      if (!projectDepth(position, Infinity, depthFilter(current))) return null;
    }
    if (context.activeIndex === -1 && !hitRow) {
      // Entering an empty tree or a gap between rows: the root level, from here.
      current.base = { depth: 0, x: event.pointer.x, key: null };
      current.hoverDepth = 0;
    }
    return result.index;
  };

  const place = (current: DragState<T>, draftKeys: Key[], index: number, depth: number) => {
    const position: DraftPosition = { keys: draftKeys, index, rows: rows() };
    // An invalid slot (data that already breaks the rules) still gets the nearest depth.
    const projection = projectDepth(position, depth, depthFilter(current)) ?? projectDepth(position, depth)!;
    const next: Placement = { ...projection, index: siblingIndexAt(position, projection, current.origin) };
    const previous = placement.value;
    if (
      !previous ||
      previous.depth !== next.depth ||
      previous.parentKey !== next.parentKey ||
      previous.index !== next.index
    ) {
      placement.value = next;
    }
  };

  const afterMove = (event: DnDEvent) => {
    const current = state;
    const draftKeys = draft.value;
    if (!current || !draftKeys) return;
    const index = activeIndexInDraft(current);
    if (index === -1) return;

    let depth: number;
    if (event.active.sensor === 'keyboard') {
      if (current.pending) {
        depth = current.pending.depth;
        current.pending = null;
      } else if (placement.value) {
        return;
      } else {
        depth = current.startDepth;
      }
    } else {
      const nestRow = current.nest ? rows().get(current.nest.key) : undefined;
      const base = current.base;
      base.x ??= event.pointer.x - event.delta.x;
      if (nesting() === 'hover') {
        depth = nestRow ? nestRow.depth + 1 : current.hoverDepth;
      } else if (nestRow) {
        depth = offsetDepth(nestRow.depth + 1, event.pointer.x - current.nest!.x, indentation());
      } else {
        depth = offsetDepth(base.depth, event.pointer.x - base.x, indentation());
      }
    }
    place(current, draftKeys, index, depth);
  };

  /** Final place of the active node in this tree, `null` when it isn't here. */
  const finalPlacement = (current: DragState<T>): Placement | null => {
    const index = activeIndexInDraft(current);
    if (index === -1) return null;
    if (!placement.value) place(current, draft.value!, index, current.startDepth);
    return placement.value;
  };

  const hasChanges = () => {
    const current = state;
    if (!current) return false;
    const next = finalPlacement(current);
    if (!current.origin || !next) return !!current.origin !== !!next;
    return next.parentKey !== current.origin.parentKey || next.index !== current.origin.index;
  };

  const commit = (lookup: (key: Key) => unknown) => {
    const current = state;
    if (!current) return;
    const to = finalPlacement(current);
    dropInfo = { from: current.origin, to };
    options.items.value = applyTreeMove(
      options.items.value,
      {
        key: current.activeKey,
        node: (lookup(current.activeKey) as T | undefined) ?? current.item,
        to: to && { parentKey: to.parentKey, index: to.index },
      },
      accessors,
    );
  };

  /** Turns the group's flat indices into indices among siblings, plus parent keys. */
  const toTreeEvent = (event: SortableDropEvent, info: DropInfo | null): SortableTreeDropEvent<T> => {
    const treeEvent = event as SortableTreeDropEvent<T>;
    treeEvent.from.parentKey = info?.from?.parentKey ?? null;
    if (info?.from) treeEvent.from.index = info.from.index;
    treeEvent.to.parentKey = info?.to?.parentKey ?? null;
    if (info?.to) treeEvent.to.index = info.to.index;
    return treeEvent;
  };

  const liveDropInfo = (): DropInfo | null =>
    state ? { from: state.origin, to: finalPlacement(state) } : null;

  const reset = () => {
    state = null;
    placement.value = null;
  };

  const entry: ListEntry = {
    id,
    draft,
    getElement: () => toElement(target),
    getKeys: () => keys.value,
    getItem: (key) => rows().get(key)?.item,
    strategy: () => 'vertical',
    placeholder: () => 'item',
    animation: () => options.animation ?? manager.props.animation,
    isDisabled: () => !!read(options.disabled),
    canSort: () => true,
    pull: () => groupOptions?.pull ?? true,
    canPut: (context) => {
      const put = groupOptions?.put ?? true;
      return typeof put === 'function' ? put(context) : put;
    },
    dropOutside: () => 'placeholder',
    prepareDraft: (draftKeys, { activeKey }) => start(draftKeys, activeKey),
    project,
    afterMove,
    hasChanges,
    commit: (_keys, lookup) => commit(lookup),
    beforeDrop: (event) => options.onBeforeDrop?.(toTreeEvent(event, liveDropInfo())),
    afterDrop: (event) => {
      const info = dropInfo;
      dropInfo = null;
      options.onDrop?.(toTreeEvent(event, info));
    },
    reset,
  };
  onScopeDispose(group.addList(entry));

  // ─── Keyboard ────────────────────────────────────────────────────────────────

  /** Pointer that puts the overlay over the slot `index` (FLIP-free layout rects). */
  const slotCoordinates = (
    current: DragState<T>,
    draftKeys: Key[],
    from: number,
    next: { index: number; depth: number },
    pointer: Coordinates,
  ): Coordinates => {
    const transform = manager.transform.value;
    const origin = { x: pointer.x - transform.x, y: pointer.y - transform.y };
    const x = origin.x + (next.depth - current.startDepth) * indentation();
    const activeElement = manager.getDraggable(current.activeKey)?.getElement();
    const passed = next.index === from ? null : manager.getDraggable(draftKeys[next.index]!)?.getElement();
    if (!activeElement?.isConnected || (next.index !== from && !passed?.isConnected)) return { x, y: pointer.y };
    const active = getLayoutRect(activeElement);
    let top = active.top;
    // Moving down, the passed rows shift up by one slot: the active slot ends where the last one ended.
    if (passed && next.index > from) top = getLayoutRect(passed).bottom - active.height;
    else if (passed) top = getLayoutRect(passed).top;
    // The keyboard drag starts at the row center, so the overlay's top follows `y - height / 2`.
    return { x, y: top + active.height / 2 };
  };

  const keyboardCoordinates = ({ active, pointer, direction }: KeyboardMoveContext): Coordinates | undefined => {
    const current = state;
    const draftKeys = draft.value;
    if (!current || !draftKeys || active.id !== current.activeKey) return undefined;
    const from = activeIndexInDraft(current);
    if (from === -1) return undefined;
    const filter = depthFilter(current);
    const base = current.pending ?? { index: from, depth: placement.value?.depth ?? current.startDepth };
    const positionAt = (index: number): DraftPosition => ({
      keys: index === from ? draftKeys : moveKey(draftKeys, current.activeKey, from, index),
      index,
      rows: rows(),
    });

    let next: { index: number; depth: number } | null = null;
    if (direction.y !== 0) {
      // ±1 visible row; keep the depth where the new neighbours allow it.
      const step = direction.y > 0 ? 1 : -1;
      for (let index = base.index + step; index >= 0 && index < draftKeys.length; index += step) {
        const projection = projectDepth(positionAt(index), base.depth, filter);
        if (projection) {
          next = { index, depth: projection.depth };
          break;
        }
      }
    } else if (direction.x !== 0) {
      // One level in or out, only when that exact level is allowed here.
      const position = positionAt(base.index);
      const depth = base.depth + (direction.x > 0 ? 1 : -1);
      const { min, max } = depthRange(position);
      if (depth >= min && depth <= max && filter(depth, parentAt(position, depth))) {
        next = { index: base.index, depth };
      }
    }
    // Staying put still answers, so the sensor doesn't fall back to pixel steps.
    if (!next) return pointer;
    current.pending = next;
    return slotCoordinates(current, draftKeys, from, next, pointer);
  };

  onScopeDispose(
    manager.addMonitor({
      getKeyboardCoordinates: (_event, context) => keyboardCoordinates(context),
    }),
  );

  // ─── Droppable, context, output ──────────────────────────────────────────────

  const droppable = createDroppable(
    target,
    { id, disabled: options.disabled },
    { accepts: (active) => group.accepts(entry, active) },
  );

  provide(SORTABLE_CONTEXT, { group, list: entry });

  const activeKey = computed(() => group.session.value?.activeKey ?? null);
  const inTree = computed(() => activeKey.value != null && draft.value != null && group.indexOf(entry, activeKey.value) !== -1);

  const items = computed<FlatNode<T>[]>(() => {
    const order = draft.value;
    const { nodes, byKey } = flat.value;
    if (!order) return nodes;
    const key = activeKey.value;
    const projection = placement.value;
    return order.map((nodeKey) => {
      const node = byKey.get(nodeKey);
      if (nodeKey !== key || !projection) {
        return (
          node ?? {
            key: nodeKey,
            item: group.lookup(nodeKey) as T,
            depth: 0,
            parentKey: null,
            index: 0,
            hasChildren: false,
            collapsed: false,
          }
        );
      }
      return {
        key: nodeKey,
        item: node?.item ?? (group.lookup(nodeKey) as T),
        depth: projection.depth,
        parentKey: projection.parentKey,
        index: projection.index,
        hasChildren: node?.hasChildren ?? false,
        collapsed: node?.collapsed ?? false,
      };
    });
  });

  const projected = computed<TreeProjection | null>(() => {
    const projection = placement.value;
    return projection && inTree.value ? { depth: projection.depth, parentKey: projection.parentKey } : null;
  });

  return {
    id,
    items,
    projected,
    isOver: droppable.isOver,
    activeKey,
    captureLayout: group.captureLayout,
  };
}
