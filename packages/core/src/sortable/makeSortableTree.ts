import { computed, isReadonly, isRef, onScopeDispose, shallowRef, unref, type Ref } from 'vue';
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
import { useSortableGroup } from './group';
import type { DraftContext, ListEntry, ProjectContext } from './entry';
import { defaultGetKey, provideSortableContext, pullOf } from './makeSortableList';
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
  type KeySet,
  type TreeAccessors,
  type TreeMove,
} from './tree';

const DEFAULT_INDENTATION = 24;

/** No rows travel: copies leave the dragged nodes where they are. */
const NO_ROWS: KeySet = new Set<Key>();

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

interface DragState {
  /**
   * The dragged node the slot stands for: the grabbed one, or the selected node it rides
   * in (VS Code). It may come from another list, or be a plain draggable.
   */
  lead: Key;
  /** Place of the lead before the drag; `null` when it comes from another list. */
  origin: Origin | null;
  /** Places of the dragged nodes of this tree: they all leave them on drop (copies don't). */
  origins: Map<Key, Origin>;
  /**
   * Rows that travel with the drag → the dragged node they travel with: the dragged
   * nodes of this tree and their visible descendants. Hidden in item mode; in indicator
   * mode they stay, and the line never goes on them. Copying, nothing travels.
   */
  moving: Map<Key, Key>;
  startDepth: number;
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
  // Options are read when needed, so a ref or a getter applies from then on.
  const indentation = () => read(options.indentation) ?? DEFAULT_INDENTATION;
  const nesting = () => read(options.nesting) ?? 'both';
  // The tree stays as it is; the line shows the drop.
  const indicating = () => read(options.placeholder) === 'indicator';

  // Flattened only when the data or the collapsed set changes.
  const flat = computed(() =>
    createFlatTree(
      flattenTree(source(), accessors.getKey, accessors.getChildren, read(options.collapsed)),
    ),
  );
  const keys = computed(() => flat.value.nodes.map((node) => node.key));
  const draft = shallowRef<Key[] | null>(null);
  const placement = shallowRef<Placement | null>(null);
  let state: DragState | null = null;
  let spot: Spot | null = null;
  let dropInfo: DropInfo | null = null;

  const rows = () => flat.value.byKey;

  /** Key of the slot in the drafts: the lead, its copy, or the node made for a plain draggable. */
  const slotKey = (current: DragState) => group.session.value?.slot ?? current.lead;

  /** Copying: the dragged nodes stay where they are, their copies travel. */
  const copying = () => group.session.value?.mode.name === 'copy';

  /** Rows that travel with the drag (see `DragState.moving`); none while copying. */
  const movingRows = (current: DragState): KeySet => (copying() ? NO_ROWS : current.moving);

  /**
   * Rows the line never goes on (indicator mode): the travelling ones; while copying, the
   * originals, so a copy doesn't go into its own original just because the drag started
   * over it (the rows inside it take the copy).
   */
  const stillRows = (current: DragState): KeySet => (copying() ? current.origins : current.moving);

  /** Places the dragged nodes of this tree leave on drop; none while copying. */
  const leaving = (current: DragState): Origin[] => (copying() ? [] : [...current.origins.values()]);

  /**
   * The nodes a drop would put here, for `canNest` and `maxDepth`: the dragged ones, their
   * copies, or the node `createItem` made; with the levels below the deepest of them
   * (collapsed ones included). Kept while the slot stays the same.
   */
  let incoming: { slot: Key; items: T[]; height: number } | null = null;
  const incomingNodes = () => {
    const session = group.session.value!;
    if (incoming?.slot !== session.slot) {
      const keys = session.keys.map((key) => session.mode.placed(session, key));
      const items = keys.map((key) => group.lookup(key) as T).filter((item) => item !== undefined);
      incoming = { slot: session.slot, items, height: blockHeight(items, accessors.getChildren) };
    }
    return incoming;
  };

  const depthFilter = (): DepthFilter => {
    const { items, height } = incomingNodes();
    return blockFilter(items, height, rows(), read(options.maxDepth), options.canNest);
  };

  const canNestInto = (key: Key) => {
    const row = rows().get(key);
    return !!row && depthFilter()(row.depth + 1, key);
  };

  /** The multi-drag block while it is in this tree (the slot alone in a single drag). */
  const blockHere = (): Key[] => {
    const session = group.session.value;
    return session && session.list === id ? session.block : [];
  };

  /** Index of the slot in the draft as projection counts it (a block once); -1 when it isn't here. */
  const viewIndex = (current: DragState) => {
    const slot = slotKey(current);
    const at = draft.value ? group.indexOf(entry, slot) : -1;
    return at === -1 ? -1 : at - Math.max(blockHere().indexOf(slot), 0);
  };

  // ─── Drag lifecycle (ListEntry hooks) ────────────────────────────────────────

  /**
   * Selected nodes inside another dragged node ride in its subtree, the grabbed one too
   * (VS Code): each → the outermost dragged node it is in.
   */
  const carried = (dragged: readonly Key[]): Map<Key, Key> => {
    const all = new Set(dragged);
    const result = new Map<Key, Key>();
    for (const key of dragged) {
      let carrier: Key | undefined;
      for (let parent = rows().get(key)?.parentKey; parent != null; parent = rows().get(parent)?.parentKey) {
        if (all.has(parent)) carrier = parent;
      }
      if (carrier !== undefined) result.set(key, carrier);
    }
    return result;
  };

  /** Takes the dragged nodes of this tree, with the rows they carry. */
  const begin = (lead: Key, dragged: readonly Key[], copied: boolean) => {
    const { nodes, byKey } = flat.value;
    const node = byKey.get(lead);
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
    const depth = node?.depth ?? 0;
    dropInfo = null;
    spot = null;
    incoming = null;
    state = {
      lead,
      origin: node ? { parentKey: node.parentKey, index: node.index } : null,
      origins,
      moving,
      startDepth: depth,
      base: { depth, x: null, key: null },
      // A drag from another list may enter this tree later, at the level of the rows it meets.
      followRows: !node,
      nest: null,
      hoverDepth: depth,
      pending: null,
    };
    // A single node starts where it is; a block takes its place on the first move, a copy once it is here.
    placement.value =
      node && dragged.length === 1 && !copied && !indicating() ? { depth, parentKey: node.parentKey, index: node.index } : null;
  };

  const start = (draftKeys: Key[], { lead, keys: dragged, copying: copied }: DraftContext): Key[] => {
    // Once per drag: copying turning on or off asks again.
    if (state?.lead !== lead) begin(lead, dragged, copied);
    const current = state!;
    // The dragged nodes carry their subtrees: hide the visible descendants while they
    // move. Copied nodes stay as they are.
    if (copied || indicating() || current.moving.size === current.origins.size) return draftKeys;
    return draftKeys.filter((key) => current.moving.get(key) === undefined || current.origins.has(key));
  };

  const project = (event: DnDEvent, context: ProjectContext): number | null => {
    const current = state;
    if (!current) return null;
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
      canNestInto: nesting() === 'offset' ? undefined : canNestInto,
      // Copying, the originals hold the slot as the active row does (see `stillRows`).
      still: copying() ? current.origins : undefined,
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
            depthFilter(),
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
  const followRow = (current: DragState, key: Key | undefined, pointer: Coordinates) => {
    const row = key == null ? undefined : rows().get(key);
    if (current.followRows && row && row.key !== current.base.key) {
      current.base = { depth: row.depth, x: pointer.x, key: row.key };
    }
  };

  /** Depth the horizontal offset asks for, from the base (filled by the first move). */
  const offsetFromBase = (current: DragState, event: DnDEvent) => {
    const base = current.base;
    base.x ??= event.pointer.x - event.delta.x;
    return offsetDepth(base.depth, event.pointer.x - base.x, indentation());
  };

  const setSpot = (current: DragState, position: DraftPosition, projection: TreeProjection) => {
    spot = { position, projection };
    // Every dragged node of this tree leaves its place.
    const next: Placement = {
      ...projection,
      index: siblingIndexAt(position, projection, leaving(current)),
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

  const place = (current: DragState, draftKeys: Key[], index: number, depth: number) => {
    const position: DraftPosition = { keys: draftKeys, index, rows: rows() };
    // An invalid slot (data that already breaks the rules) still gets the nearest depth.
    setSpot(current, position, projectDepth(position, depth, depthFilter()) ?? projectDepth(position, depth)!);
  };

  /** Depth of the row next to the slot at `index` of `view`: the one after it, else the one before. */
  const levelAt = (view: Key[], index: number) => {
    const key = view[index + 1] ?? view[index - 1];
    return (key === undefined ? undefined : rows().get(key)?.depth) ?? 0;
  };

  const afterMove = (event: DnDEvent) => {
    const current = state;
    if (!current || !draft.value || indicating()) return;
    const index = viewIndex(current);
    if (index === -1) return;
    const view = group.viewOf(entry);

    let depth: number;
    if (event.active.sensor === 'keyboard') {
      if (current.pending) {
        depth = current.pending.depth;
        current.pending = null;
      } else if (placement.value) {
        return;
      } else {
        // Taken in from outside (another list, a plain draggable): level with the rows there.
        depth = current.origin ? current.startDepth : levelAt(view, index);
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
    place(current, view, index, depth);
  };

  // ─── Indicator mode ──────────────────────────────────────────────────────────

  /** The line at a gap (`position`) with the depth nearest to `depth` that fits; `null` when none does. */
  const lineAt = (
    current: DragState,
    position: DraftPosition,
    depth: number,
    line: IndicatorProjection,
  ): IndicatorProjection | null => {
    const projection = projectDepth(position, depth, depthFilter());
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
      activeKey: slotKey(current),
      length: draftKeys.length,
      moving: stillRows(current),
      canNestInto: nesting() === 'offset' ? undefined : canNestInto,
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
    return lineAt(current, gapPosition(draftKeys, line.index, movingRows(current), rows()), depth, line);
  };

  /** The keyboard enters the tree: the line at `index`, level with the row it goes on. */
  const indicateAt = (index: number): IndicatorProjection | null => {
    const current = state!;
    const position = gapPosition(group.keysOf(entry), index, movingRows(current), rows());
    const row = rows().get(position.keys[position.index] ?? position.keys[position.index - 1]!);
    return lineAt(current, position, row?.depth ?? 0, lineBefore(position));
  };

  // ─── Drop ────────────────────────────────────────────────────────────────────

  /** Where the dragged nodes would land in this tree, `null` when not here. */
  const landingSpot = (current: DragState): Spot | null => {
    if (indicating()) {
      // No line: the lead's own place.
      if (!spot && current.origin) {
        const position = gapPosition(group.keysOf(entry), group.indexOf(entry, current.lead), movingRows(current), rows());
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
  const outcome = (current: DragState, next: Key[], inserted: readonly Key[]) => {
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

  const moveOf = (current: DragState, next: Key[], lookup: (key: Key) => unknown, inserted: readonly Key[]) => {
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
    incoming = null;
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
    placeholder: () => read(options.placeholder) ?? 'item',
    animation: () => unref(options.animation) ?? manager.props.animation,
    isDisabled: () => !!read(options.disabled),
    canSort: () => true,
    pull: () => pullOf(groupOptions, !!options.clone),
    canPut: (context) => {
      const put = groupOptions?.put ?? true;
      return typeof put === 'function' ? put(context) : put;
    },
    dropOutside: () => read(options.dropOutside) ?? (indicating() ? 'cancel' : 'placeholder'),
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

  /**
   * Pointer that puts the overlay over the slot `index` (FLIP-free layout rects): the
   * lead's clone over it, `offset` away from the pointer (see `group.leadOffset`).
   */
  const slotCoordinates = (
    current: DragState,
    view: Key[],
    from: number,
    next: { index: number; depth: number },
    pointer: Coordinates,
    x: number,
    offset: Coordinates,
  ): Coordinates => {
    const rectOf = (key: Key | undefined) => {
      const element = key == null ? null : manager.getDraggable(key)?.getElement();
      return element?.isConnected ? getLayoutRect(element) : null;
    };
    const active = rectOf(slotKey(current));
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
    return { x, y: top + active.height / 2 - offset.y };
  };

  /**
   * Arrow keys: up/down move the slot by one visible row, keeping its depth where the
   * new neighbours allow it; left/right change the depth. In indicator mode the line
   * moves the same way, through the gaps between the rows that stay, skipping the
   * dragged node's own place at its own level (that drop would change nothing). A copy
   * or a created node moves like any node once it is here.
   */
  const keyboardCoordinates = ({ active, pointer, direction }: KeyboardMoveContext): Coordinates | undefined => {
    const current = state;
    const session = group.session.value;
    if (!current || !session || !draft.value || active.id !== session.activeKey) return undefined;
    const slot = session.slot;
    const draftKeys = group.keysOf(entry);
    const at = group.indexOf(entry, slot);
    const from = viewIndex(current);
    const view = group.viewOf(entry);
    let positionAt = (index: number): DraftPosition => ({
      keys: index === from ? view : moveKey(view, slot, from, index),
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
      const moving = movingRows(current);
      const gaps = gapPosition(draftKeys, mine ? mine.index : at, moving, rows());
      positionAt = (index) => ({ ...gaps, index });
      base = { index: gaps.index, depth: mine ? mine.depth! : current.startDepth };
      end = gaps.keys.length;
      // One node moving: its own place at its own level changes nothing (a copy there does).
      if (at !== -1 && session.mode.name !== 'copy' && session.keys.length < 2) home = gapPosition(draftKeys, at, moving, rows()).index;
    } else if (from === -1) {
      return undefined;
    }
    const filter = depthFilter();

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
    // The overlay shifts by the levels it changes (from where it is: a node from another
    // list or a created one came in over the tree).
    const x = pointer.x + (projection.depth - base.depth) * indentation();
    // The grabbed row may ride in the lead: the lead's clone goes over the slot.
    const offset = group.leadOffset();
    if (!indicating()) {
      current.pending = { index: position.index, depth: projection.depth };
      return slotCoordinates(current, view, from, current.pending, pointer, x, offset);
    }
    const line = lineAt(current, position, projection.depth, lineBefore(position))!;
    group.showIndicator({ list: id, ...line });
    // The overlay goes over the row with the line.
    const element = (line.key == null ? null : manager.getDraggable(line.key)?.getElement()) ?? toElement(target);
    if (!element?.isConnected) return pointer;
    revealElement(element);
    const rect = getLayoutRect(element);
    return { x, y: rect.top + rect.height / 2 - offset.y };
  };

  onScopeDispose(
    manager.addMonitor({
      getKeyboardCoordinates: (_event, context) => keyboardCoordinates(context),
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
    isAccepting: droppable.isAccepting,
    activeKey,
    activeIndex,
    activeSize,
    captureLayout: group.captureLayout,
  };
}
