import { computed, isReadonly, isRef, onScopeDispose, shallowRef, type Ref } from 'vue';
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
import { useManager } from '../core/context';
import { createDroppable } from '../core/makeDroppable';
import { revealElement } from '../core/autoscroll';
import { getLayoutRect } from '../animation/layout';
import { createId, toElement } from '../utils/dom';
import { read } from '../utils/read';
import { useSortableGroup, type ListEntry, type ProjectContext } from './group';
import { defaultGetKey, provideSortableContext } from './makeSortableList';
import type { IndicatorProjection, ProjectionItem } from './projection';
import {
  applyTreeMove,
  blockFilter,
  blockHeight,
  buildTreeMove,
  createFlatTree,
  depthRange,
  flattenTree,
  gapPosition,
  moveKey,
  nearestValidSlot,
  offsetDepth,
  parentAt,
  projectDepth,
  projectTreeIndex,
  projectTreeIndicator,
  siblingIndexAt,
  subtreeEnd,
  type DepthFilter,
  type DraftPosition,
  type TreeAccessors,
  type TreeMove,
} from './tree';

const DEFAULT_INDENTATION = 24;

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

/** A projection and the draft position it was made in: the drop recounts the sibling index from it. */
interface Spot {
  position: DraftPosition;
  projection: TreeProjection;
}

interface DragState<T> {
  activeKey: Key;
  /** Items of every dragged key (a multi-drag block): `canNest` checks each. */
  items: T[];
  /** Place of the active node before the drag; `null` when it comes from another list. */
  origin: Origin | null;
  /** Places of the dragged nodes of this tree: they all leave them on drop. */
  origins: Map<Key, Origin>;
  /**
   * Rows that travel with the drag → the dragged node they travel with: the dragged
   * nodes of this tree and their visible descendants. Hidden in item mode; in indicator
   * mode they stay, and the line never goes on them.
   */
  moving: Map<Key, Key>;
  startDepth: number;
  /** Levels below the dragged nodes (collapsed ones included), checked against `maxDepth`. */
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
  // A shallow copy that `setChildren` gives the children: `{ ...node, children }` by default.
  const withChildren =
    options.withChildren ??
    ((node: T, children: T[]): T => {
      const copy = { ...node };
      accessors.setChildren(copy, children);
      return copy;
    });
  const source = () => read<readonly T[]>(options.items);
  const indentation = () => options.indentation ?? DEFAULT_INDENTATION;
  const nesting = () => options.nesting ?? 'both';
  // The tree stays as it is; the line shows the drop (read live, like the other options).
  const indicating = () => options.placeholder === 'indicator';

  // Flattened only when the data or the collapsed set changes.
  const flat = computed(() =>
    createFlatTree(
      flattenTree(source(), accessors.getKey, accessors.getChildren, options.collapsed?.value),
    ),
  );
  const keys = computed(() => flat.value.nodes.map((node) => node.key));
  const draft = shallowRef<Key[] | null>(null);
  const placement = shallowRef<Placement | null>(null);
  let state: DragState<T> | null = null;
  let spot: Spot | null = null;
  let dropInfo: DropInfo | null = null;

  const rows = () => flat.value.byKey;

  const depthFilter = (current: DragState<T>): DepthFilter =>
    blockFilter(current.items, current.height, rows(), options.maxDepth, options.canNest);

  const canNestInto = (current: DragState<T>, key: Key) => {
    const row = rows().get(key);
    return !!row && depthFilter(current)(row.depth + 1, key);
  };

  /** The multi-drag block while it is in this tree (the active node alone in a single drag). */
  const blockHere = (): Key[] => {
    const session = group.session.value;
    return session && session.list === id ? session.block : [];
  };

  /** Index of the active node in the draft as projection counts it (a block once); -1 when it isn't here. */
  const viewIndex = (current: DragState<T>) => {
    const at = draft.value ? group.indexOf(entry, current.activeKey) : -1;
    return at === -1 ? -1 : at - Math.max(blockHere().indexOf(current.activeKey), 0);
  };

  // ─── Drag lifecycle (ListEntry hooks) ────────────────────────────────────────

  /** Selected nodes inside another dragged node ride in its subtree; the grabbed node always travels itself. */
  const carried = (dragged: readonly Key[], activeKey: Key): Key[] => {
    const all = new Set(dragged);
    return dragged.filter((key) => {
      if (key === activeKey) return false;
      for (let parent = rows().get(key)?.parentKey; parent != null; parent = rows().get(parent)?.parentKey) {
        if (all.has(parent)) return true;
      }
      return false;
    });
  };

  const start = (draftKeys: Key[], { activeKey, keys: dragged }: { activeKey: Key; keys: Key[] }): Key[] => {
    const { nodes, byKey } = flat.value;
    const node = byKey.get(activeKey);
    const origins = new Map<Key, Origin>();
    const moving = new Map<Key, Key>();
    for (const key of dragged) {
      const row = byKey.get(key);
      if (!row) continue;
      origins.set(key, { parentKey: row.parentKey, index: row.index });
      moving.set(key, key);
      if (!row.hasChildren || row.collapsed) continue;
      // Every dragged node carries its subtree.
      const at = nodes.indexOf(row);
      for (let i = at + 1, end = subtreeEnd(nodes, at); i < end; i++) {
        if (!moving.has(nodes[i]!.key)) moving.set(nodes[i]!.key, key);
      }
    }
    const items = dragged
      .map((key) => (byKey.get(key)?.item ?? group.lookup(key)) as T)
      .filter((item) => item !== undefined);
    const depth = node?.depth ?? 0;
    dropInfo = null;
    spot = null;
    state = {
      activeKey,
      items,
      origin: node ? { parentKey: node.parentKey, index: node.index } : null,
      origins,
      moving,
      startDepth: depth,
      height: blockHeight(items, accessors.getChildren),
      base: { depth, x: null, key: null },
      // A drag from another list may enter this tree later, at the level of the rows it meets.
      followRows: !node,
      nest: null,
      hoverDepth: depth,
      pending: null,
    };
    // A single node starts where it is; a block takes its place on the first move.
    placement.value =
      node && dragged.length === 1 && !indicating() ? { depth, parentKey: node.parentKey, index: node.index } : null;
    // The dragged nodes carry their subtrees: hide the visible descendants for the whole drag.
    if (indicating() || moving.size === origins.size) return draftKeys;
    return draftKeys.filter((key) => moving.get(key) === undefined || origins.has(key));
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
    followRow(current, hitRow?.key, event.pointer);
    if (result.index == null) return null;
    // A nest slot always fits. Otherwise stop at the last slot towards the pointer
    // where some depth satisfies `canNest` and `maxDepth`.
    const index =
      result.nest != null
        ? result.index
        : nearestValidSlot(
            context.keys,
            context.activeKey,
            context.activeIndex,
            result.index,
            rows(),
            depthFilter(current),
          );
    if (index == null) return null;
    if (context.activeIndex === -1 && !hitRow) {
      // Entering an empty tree or a gap between rows: the root level, from here.
      current.base = { depth: 0, x: event.pointer.x, key: null };
      current.hoverDepth = 0;
    }
    return index;
  };

  /** Re-anchors the offset rule on a newly hovered row (items entering from another list). */
  const followRow = (current: DragState<T>, key: Key | undefined, pointer: Coordinates) => {
    const row = key == null ? undefined : rows().get(key);
    if (current.followRows && row && row.key !== current.base.key) {
      current.base = { depth: row.depth, x: pointer.x, key: row.key };
    }
  };

  /** Depth the horizontal offset asks for, from the base (filled by the first move). */
  const offsetFromBase = (current: DragState<T>, event: DnDEvent) => {
    const base = current.base;
    base.x ??= event.pointer.x - event.delta.x;
    return offsetDepth(base.depth, event.pointer.x - base.x, indentation());
  };

  const setSpot = (current: DragState<T>, position: DraftPosition, projection: TreeProjection) => {
    spot = { position, projection };
    // Every dragged node of this tree leaves its place.
    const next: Placement = {
      ...projection,
      index: siblingIndexAt(position, projection, [...current.origins.values()]),
    };
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

  const clearSpot = () => {
    spot = null;
    placement.value = null;
  };

  const place = (current: DragState<T>, draftKeys: Key[], index: number, depth: number) => {
    const position: DraftPosition = { keys: draftKeys, index, rows: rows() };
    // An invalid slot (data that already breaks the rules) still gets the nearest depth.
    setSpot(current, position, projectDepth(position, depth, depthFilter(current)) ?? projectDepth(position, depth)!);
  };

  const afterMove = (event: DnDEvent) => {
    const current = state;
    if (!current || !draft.value || indicating()) return;
    const index = viewIndex(current);
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
      if (nesting() === 'hover') {
        depth = nestRow ? nestRow.depth + 1 : current.hoverDepth;
      } else if (nestRow) {
        depth = offsetDepth(nestRow.depth + 1, event.pointer.x - current.nest!.x, indentation());
      } else {
        depth = offsetFromBase(current, event);
      }
    }
    place(current, group.viewOf(entry), index, depth);
  };

  // ─── Indicator mode ──────────────────────────────────────────────────────────

  /** The line at a gap (`position`) with the depth nearest to `depth` that fits; `null` when none does. */
  const lineAt = (
    current: DragState<T>,
    position: DraftPosition,
    depth: number,
    line: IndicatorProjection,
  ): IndicatorProjection | null => {
    const projection = projectDepth(position, depth, depthFilter(current));
    if (!projection) {
      clearSpot();
      return null;
    }
    setSpot(current, position, projection);
    return { ...line, ...projection };
  };

  /** The line before the row at a gap of `position` (which leaves the moving rows out), or after the last one. */
  const lineBefore = ({ keys: others, index }: DraftPosition): IndicatorProjection => {
    const after = index >= others.length;
    const key = others[after ? others.length - 1 : index] ?? null;
    return { index: key == null ? 0 : group.indexOf(entry, key) + +after, key, side: after ? 'after' : 'before' };
  };

  const indicate = (event: DnDEvent, items: ProjectionItem[]): IndicatorProjection | null | undefined => {
    const current = state;
    if (!current) return undefined;
    const draftKeys = group.keysOf(entry);
    const line = projectTreeIndicator({
      pointer: event.pointer,
      items,
      activeKey: current.activeKey,
      length: draftKeys.length,
      moving: current.moving,
      canNestInto: nesting() === 'offset' ? undefined : (key) => canNestInto(current, key),
    });
    if (!line) {
      if (line === null) clearSpot();
      return line;
    }
    const row = line.key == null ? undefined : rows().get(line.key);
    let depth: number;
    if (line.side === 'inside') depth = row!.depth + 1;
    // 'hover': a sibling of the row the line is on.
    else if (nesting() === 'hover') depth = row?.depth ?? 0;
    else {
      followRow(current, row?.key, event.pointer);
      depth = offsetFromBase(current, event);
    }
    return lineAt(current, gapPosition(draftKeys, line.index, current.moving, rows()), depth, line);
  };

  /** The keyboard enters the tree: the line at `index`, level with the row it goes on. */
  const indicateAt = (index: number): IndicatorProjection | null => {
    const current = state!;
    const position = gapPosition(group.keysOf(entry), index, current.moving, rows());
    const row = rows().get(position.keys[position.index] ?? position.keys[position.index - 1]!);
    return lineAt(current, position, row?.depth ?? 0, lineBefore(position));
  };

  // ─── Drop ────────────────────────────────────────────────────────────────────

  /** Where the dragged nodes would land in this tree, `null` when not here. */
  const landingSpot = (current: DragState<T>): Spot | null => {
    if (indicating()) {
      // No line: the active node's own place.
      if (!spot && current.origin) {
        const position = gapPosition(group.keysOf(entry), group.indexOf(entry, current.activeKey), current.moving, rows());
        setSpot(current, position, { depth: current.startDepth, parentKey: current.origin.parentKey });
      }
      return spot;
    }
    const index = viewIndex(current);
    if (index === -1) return null;
    // Projected again on the draft as it is now, at the last depth.
    place(current, group.viewOf(entry), index, placement.value?.depth ?? current.startDepth);
    return spot;
  };

  /**
   * What committing `next` does here (one list holds the slot, so nodes either land here
   * or leave): the nodes `inserted` at the slot land side by side at `to`, and the
   * dragged nodes of this tree leave their places, unless rejected back into them.
   */
  const outcome = (current: DragState<T>, next: Key[], inserted: readonly Key[]) => {
    const present = new Set(next);
    const landing = inserted.filter((key) => present.has(key));
    const removed = [...current.origins.keys()].filter((key) => landing.includes(key) || !present.has(key));
    const at = landing.length ? landingSpot(current) : null;
    const to: Placement | null = at && {
      ...at.projection,
      index: siblingIndexAt(at.position, at.projection, removed.map((key) => current.origins.get(key)!)),
    };
    return { landing, removed, to };
  };

  const hasChanges = (next: Key[], inserted: readonly Key[]) => {
    const current = state!;
    const { landing, removed, to } = outcome(current, next, inserted);
    // Nodes leave the tree, or the landing ones aren't already side by side right there.
    return (
      (!to && removed.length > 0) ||
      landing.some((key, i) => {
        const origin = current.origins.get(key);
        return !origin || origin.parentKey !== to!.parentKey || origin.index !== to!.index + i;
      })
    );
  };

  /** The move a drop's `next` makes here; the event's `from` and `to` come with it. */
  let prepared: { next: Key[]; move: TreeMove<T> } | null = null;

  const moveOf = (current: DragState<T>, next: Key[], lookup: (key: Key) => unknown, inserted: readonly Key[]) => {
    const { landing, removed, to } = outcome(current, next, inserted);
    dropInfo = { from: current.origin, to };
    const move: TreeMove<T> = {
      keys: to ? landing : removed,
      node: (key) => lookup(key) as T | undefined,
      to: to && { parentKey: to.parentKey, index: to.index },
    };
    prepared = { next, move };
    return move;
  };

  /** The drop's `result` here: a new tree, the user's nodes untouched. */
  const build = (next: Key[], lookup: (key: Key) => unknown, inserted: readonly Key[]): unknown[] => {
    const current = state;
    if (!current) return [...source()];
    return buildTreeMove(source(), moveOf(current, next, lookup, inserted), { ...accessors, withChildren });
  };

  /** The default write: the same move, through `setChildren`. */
  const commit = (_items: unknown[], next: Key[], lookup: (key: Key) => unknown, inserted: readonly Key[]) => {
    const current = state;
    if (!current) return;
    const move = prepared?.next === next ? prepared.move : moveOf(current, next, lookup, inserted);
    (options.items as Ref<T[]>).value = applyTreeMove(source(), move, accessors);
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
    state ? { from: state.origin, to: landingSpot(state) && placement.value } : null;

  const reset = () => {
    state = null;
    spot = null;
    prepared = null;
    placement.value = null;
  };

  const entry: ListEntry = {
    id,
    draft,
    getElement: () => toElement(target),
    getKeys: () => keys.value,
    getItem: (key) => rows().get(key)?.item,
    strategy: () => 'vertical',
    placeholder: () => options.placeholder ?? 'item',
    animation: () => options.animation ?? manager.props.animation,
    isDisabled: () => !!read(options.disabled),
    canSort: () => true,
    pull: () => groupOptions?.pull ?? true,
    canPut: (context) => {
      const put = groupOptions?.put ?? true;
      return typeof put === 'function' ? put(context) : put;
    },
    dropOutside: () => (indicating() ? 'cancel' : 'placeholder'),
    multiple: () => 'group',
    carried,
    prepareDraft: start,
    project,
    indicate,
    indicateAt,
    afterMove,
    hasChanges,
    isReadonly: () => !isRef(options.items) || isReadonly(options.items),
    build,
    commit,
    // `result` was built for this event: its `from` and `to` go with it.
    beforeDrop: (event) => options.onBeforeDrop?.(toTreeEvent(event, dropInfo ?? liveDropInfo())),
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
    view: Key[],
    from: number,
    next: { index: number; depth: number },
    pointer: Coordinates,
    x: number,
  ): Coordinates => {
    const rectOf = (key: Key | undefined) => {
      const element = key == null ? null : manager.getDraggable(key)?.getElement();
      return element?.isConnected ? getLayoutRect(element) : null;
    };
    const active = rectOf(current.activeKey);
    const passed = next.index === from ? null : rectOf(view[next.index]);
    if (!active || (next.index !== from && !passed)) return { x, y: pointer.y };
    // A multi-drag block moves as one: its first and last rows bound it.
    const block = blockHere();
    const first = rectOf(block[0]) ?? active;
    const last = rectOf(block[block.length - 1]) ?? active;
    let top = active.top;
    // Moving down, the passed row shifts up by the block: the block ends where the row ended.
    if (passed && next.index > from) top = passed.bottom - (last.bottom - active.top);
    else if (passed) top = passed.top + (active.top - first.top);
    // The keyboard drag starts at the row center, so the overlay's top follows `y - height / 2`.
    return { x, y: top + active.height / 2 };
  };

  /**
   * Arrow keys: up/down move the slot by one visible row, keeping its depth where the
   * new neighbours allow it; left/right change the depth. In indicator mode the line
   * moves the same way, through the gaps between the rows that stay, skipping the
   * dragged node's own place at its own level (that drop would change nothing).
   */
  const keyboardCoordinates = ({ active, pointer, direction }: KeyboardMoveContext): Coordinates | undefined => {
    const current = state;
    if (!current || !draft.value || active.id !== current.activeKey) return undefined;
    const draftKeys = group.keysOf(entry);
    const at = group.indexOf(entry, current.activeKey);
    const from = viewIndex(current);
    const view = group.viewOf(entry);
    let positionAt = (index: number): DraftPosition => ({
      keys: index === from ? view : moveKey(view, current.activeKey, from, index),
      index,
      rows: rows(),
    });
    let base = current.pending ?? { index: from, depth: placement.value?.depth ?? current.startDepth };
    let end = view.length - 1;
    let home = -1;
    if (indicating()) {
      const shown = group.indicator.value;
      const mine = shown?.list === id ? shown : null;
      // The line is in another list, or the dragged node isn't here.
      if (!mine && (shown || at === -1)) return undefined;
      const gaps = gapPosition(draftKeys, mine ? mine.index : at, current.moving, rows());
      positionAt = (index) => ({ ...gaps, index });
      base = { index: gaps.index, depth: mine ? mine.depth! : current.startDepth };
      end = gaps.keys.length;
      if (at !== -1 && current.items.length < 2) home = gapPosition(draftKeys, at, current.moving, rows()).index;
    } else if (from === -1) {
      return undefined;
    }
    const filter = depthFilter(current);

    let next: Spot | null = null;
    if (direction.y) {
      const step = direction.y > 0 ? 1 : -1;
      for (let index = base.index + step; index >= 0 && index <= end; index += step) {
        const position = positionAt(index);
        const projection = projectDepth(position, base.depth, filter);
        if (projection && (index !== home || projection.depth !== current.startDepth)) {
          next = { position, projection };
          break;
        }
      }
    } else if (direction.x) {
      // One level in or out, only when that exact level is allowed here.
      const position = positionAt(base.index);
      const depth = base.depth + (direction.x > 0 ? 1 : -1);
      const { min, max } = depthRange(position);
      const parentKey = parentAt(position, depth);
      if (depth >= min && depth <= max && filter(depth, parentKey)) next = { position, projection: { depth, parentKey } };
    }
    // Staying put still answers, so the sensor doesn't fall back to pixel steps.
    if (!next) return pointer;
    const { position, projection } = next;
    const x = pointer.x - manager.transform.value.x + (projection.depth - current.startDepth) * indentation();
    if (!indicating()) {
      current.pending = { index: position.index, depth: projection.depth };
      return slotCoordinates(current, view, from, current.pending, pointer, x);
    }
    const line = lineAt(current, position, projection.depth, lineBefore(position))!;
    group.showIndicator({ list: id, ...line });
    // The overlay goes over the row with the line.
    const element = (line.key == null ? null : manager.getDraggable(line.key)?.getElement()) ?? toElement(target);
    if (!element?.isConnected) return pointer;
    revealElement(element);
    const rect = getLayoutRect(element);
    return { x, y: rect.top + rect.height / 2 };
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

  provideSortableContext(group, entry, accessors.getKey, options.overlay);

  const activeKey = computed(() => group.session.value?.activeKey ?? null);
  const inTree = computed(() => activeKey.value != null && draft.value != null && group.indexOf(entry, activeKey.value) !== -1);
  const indicator = computed(() => {
    const value = group.indicator.value;
    return value?.list === id ? value : null;
  });

  const items = computed<FlatNode<T>[]>(() => {
    const order = draft.value;
    const { nodes, byKey } = flat.value;
    if (!order) return nodes;
    const current = state;
    let visible = order;
    // Indicator mode: a dragged node that went to another list takes its subtree along.
    if (indicating() && current) {
      visible = order.filter((key) => {
        const carrier = current.moving.get(key);
        return carrier === undefined || carrier === key || group.indexOf(entry, carrier) !== -1;
      });
    }
    const projection = indicating() ? null : placement.value;
    // The dragged nodes here (a multi-drag block) carry the projected depth, side by side.
    const block = new Map((projection ? blockHere() : []).map((key, index) => [key, index]));
    return visible.map((nodeKey) => {
      const node = byKey.get(nodeKey) ?? {
        key: nodeKey,
        item: group.lookup(nodeKey) as T,
        depth: 0,
        parentKey: null,
        index: 0,
        hasChildren: false,
        collapsed: false,
      };
      const at = block.get(nodeKey);
      return at === undefined ? node : { ...node, ...projection!, index: projection!.index + at };
    });
  });

  const projected = computed<TreeProjection | null>(() => {
    const projection = placement.value;
    // Indicator mode: the line's place, while it is in this tree.
    return projection && (indicating() ? indicator.value : inTree.value)
      ? { depth: projection.depth, parentKey: projection.parentKey }
      : null;
  });

  return {
    id,
    items,
    projected,
    indicator,
    isOver: droppable.isOver,
    activeKey,
    captureLayout: group.captureLayout,
  };
}
