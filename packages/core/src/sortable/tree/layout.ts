/**
 * The layout of a tree for its group (`ListLayout`): the dragged nodes carry their
 * subtrees, and where they land has a depth, from the pointer's horizontal offset or
 * from hovering the middle of a row (`nesting`). In indicator mode the line shows it.
 */

import type { Coordinates, DnDEvent, Key } from '../../types';
import type { ListLayout } from '../layout';
import type { IndicatorProjection } from '../projection';
import { subtreeEnd } from './flatten';
import { gapPosition, nearestValidSlot, offsetDepth, projectDepth, type DraftPosition } from './depth';
import { projectTreeIndex, projectTreeIndicator } from './projection';
import {
  canNestInto,
  clearSpot,
  copying,
  depthFilter,
  indentation,
  indicating,
  movingRows,
  nesting,
  place,
  rows,
  setSpot,
  slotKey,
  stillRows,
  viewIndex,
  type DragState,
  type Origin,
  type TreeContext,
} from './context';
import { hasChanges } from './drop';

/**
 * Selected nodes inside another dragged node ride in its subtree, the grabbed one too
 * (VS Code): each → the outermost dragged node it is in.
 */
const carried = <T>(t: TreeContext<T>, dragged: readonly Key[]): Map<Key, Key> => {
  const all = new Set(dragged);
  const result = new Map<Key, Key>();
  for (const key of dragged) {
    let carrier: Key | undefined;
    for (let parent = rows(t).get(key)?.parentKey; parent != null; parent = rows(t).get(parent)?.parentKey) {
      if (all.has(parent)) carrier = parent;
    }
    if (carrier !== undefined) result.set(key, carrier);
  }
  return result;
};

/** Takes the dragged nodes of this tree, with the rows they carry. */
const begin = <T>(t: TreeContext<T>, lead: Key, dragged: readonly Key[], copied: boolean) => {
  const { nodes, byKey } = t.flat.value;
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
  t.dropInfo = null;
  t.spot = null;
  t.incoming = null;
  t.state = {
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
  t.placement.value =
    node && dragged.length === 1 && !copied && !indicating(t) ? { depth, parentKey: node.parentKey, index: node.index } : null;
};

/** Re-anchors the offset rule on a newly hovered row (items entering from another list). */
const followRow = <T>(t: TreeContext<T>, current: DragState, key: Key | undefined, pointer: Coordinates) => {
  const row = key == null ? undefined : rows(t).get(key);
  if (current.followRows && row && row.key !== current.base.key) {
    current.base = { depth: row.depth, x: pointer.x, key: row.key };
  }
};

/** Depth the horizontal offset asks for, from the base (filled by the first move). */
const offsetFromBase = <T>(t: TreeContext<T>, current: DragState, event: DnDEvent) => {
  const base = current.base;
  base.x ??= event.pointer.x - event.delta.x;
  return offsetDepth(base.depth, event.pointer.x - base.x, indentation(t));
};

/** Depth of the row next to the slot at `index` of `view`: the one after it, else the one before. */
const levelAt = <T>(t: TreeContext<T>, view: Key[], index: number) => {
  const key = view[index + 1] ?? view[index - 1];
  return (key === undefined ? undefined : rows(t).get(key)?.depth) ?? 0;
};

const afterMove = <T>(t: TreeContext<T>, event: DnDEvent) => {
  const current = t.state;
  if (!current || !t.draft.value || indicating(t)) return;
  const index = viewIndex(t, current);
  if (index === -1) return;
  const view = t.group.viewOf(t.entry);

  let depth: number;
  if (event.active.sensor === 'keyboard') {
    if (current.pending) {
      depth = current.pending.depth;
      current.pending = null;
    } else if (t.placement.value) {
      return;
    } else {
      // Taken in from outside (another list, a plain draggable): level with the rows there.
      depth = current.origin ? current.startDepth : levelAt(t, view, index);
    }
  } else {
    const nestRow = current.nest ? rows(t).get(current.nest.key) : undefined;
    if (nesting(t) === 'hover') {
      depth = nestRow ? nestRow.depth + 1 : current.hoverDepth;
    } else if (nestRow) {
      depth = offsetDepth(nestRow.depth + 1, event.pointer.x - current.nest!.x, indentation(t));
    } else {
      depth = offsetFromBase(t, current, event);
    }
  }
  place(t, current, view, index, depth);
};

// ─── Indicator mode ──────────────────────────────────────────────────────────

/** The line at a gap (`position`) with the depth nearest to `depth` that fits; `null` when none does. */
export const lineAt = <T>(
  t: TreeContext<T>,
  current: DragState,
  position: DraftPosition,
  depth: number,
  line: IndicatorProjection,
): IndicatorProjection | null => {
  const projection = projectDepth(position, depth, depthFilter(t));
  if (!projection) {
    clearSpot(t);
    return null;
  }
  setSpot(t, current, position, projection);
  return { ...line, ...projection };
};

/** The line before the row at a gap of `position` (which leaves the moving rows out), or after the last one. */
export const lineBefore = <T>(t: TreeContext<T>, { keys: others, index }: DraftPosition): IndicatorProjection => {
  const after = index >= others.length;
  const key = others[after ? others.length - 1 : index] ?? null;
  return { index: key == null ? 0 : t.group.indexOf(t.entry, key) + +after, key, side: after ? 'after' : 'before' };
};

/** The tree as its group lays it out (see `ListLayout`). */
export const treeLayout = <T>(t: TreeContext<T>): ListLayout => ({
  nested: true,
  carried: (dragged) => carried(t, dragged),
  prepareDraft: (draftKeys, { lead, keys: dragged, copying: copied }) => {
    // Once per drag: copying turning on or off asks again.
    if (t.state?.lead !== lead) begin(t, lead, dragged, copied);
    const current = t.state!;
    // The dragged nodes carry their subtrees: hide the visible descendants while they
    // move. Copied nodes stay as they are.
    if (copied || indicating(t) || current.moving.size === current.origins.size) return draftKeys;
    return draftKeys.filter((key) => current.moving.get(key) === undefined || current.origins.has(key));
  },
  project: (event, context) => {
    const keep = { index: null, lock: context.lock, key: null };
    const current = t.state;
    if (!current) return keep;
    if (event.active.sensor === 'keyboard') {
      // Arrow keys pick the slot themselves; the pointer only moves the overlay there.
      const pending = current.pending;
      return pending && pending.index !== context.activeIndex ? { ...keep, index: pending.index } : keep;
    }
    const result = projectTreeIndex({
      pointer: event.pointer,
      items: context.items,
      activeKey: context.activeKey,
      activeIndex: context.activeIndex,
      length: context.keys.length,
      canNestInto: nesting(t) === 'offset' ? undefined : (key) => canNestInto(t, key),
      // Copying, the originals hold the slot as the active row does (see `stillRows`).
      still: copying(t) ? current.origins : undefined,
    });
    const hitRow = result.hit ? rows(t).get(result.hit.key) : undefined;
    if (result.nest != null) {
      current.nest = { key: result.nest, x: event.pointer.x };
    } else if (hitRow) {
      current.nest = null;
      current.hoverDepth = hitRow.depth;
    }
    // The drag start in another list says nothing about depth here: re-anchor the
    // offset rule on every newly hovered row, at that row's level.
    if (context.activeIndex === -1) current.followRows = true;
    followRow(t, current, hitRow?.key, event.pointer);
    if (result.index == null) return keep;
    // A nest slot always fits. Otherwise stop at the last slot towards the pointer
    // where some depth satisfies `canNest` and `maxDepth`.
    const index =
      result.nest != null
        ? result.index
        : nearestValidSlot(context.keys, context.activeKey, context.activeIndex, result.index, rows(t), depthFilter(t));
    if (index == null) return keep;
    if (context.activeIndex === -1 && !hitRow) {
      // Entering an empty tree or a gap between rows: the root level, from here.
      current.base = { depth: 0, x: event.pointer.x, key: null };
      current.hoverDepth = 0;
    }
    return { ...keep, index };
  },
  indicate: (event, { items }) => {
    const current = t.state;
    if (!current) return undefined;
    const draftKeys = t.group.keysOf(t.entry);
    const line = projectTreeIndicator({
      pointer: event.pointer,
      items,
      activeKey: slotKey(t, current),
      length: draftKeys.length,
      moving: stillRows(t, current),
      canNestInto: nesting(t) === 'offset' ? undefined : (key) => canNestInto(t, key),
    });
    if (!line) {
      if (line === null) clearSpot(t);
      return line;
    }
    const row = line.key == null ? undefined : rows(t).get(line.key);
    let depth: number;
    if (line.side === 'inside') depth = row!.depth + 1;
    // 'hover': a sibling of the row the line is on.
    else if (nesting(t) === 'hover') depth = row?.depth ?? 0;
    else {
      followRow(t, current, row?.key, event.pointer);
      depth = offsetFromBase(t, current, event);
    }
    return lineAt(t, current, gapPosition(draftKeys, line.index, movingRows(t, current), rows(t)), depth, line);
  },
  // The keyboard enters the tree: the line at `index`, level with the row it goes on.
  indicateAt: (_keys, index) => {
    const current = t.state!;
    const position = gapPosition(t.group.keysOf(t.entry), index, movingRows(t, current), rows(t));
    const row = rows(t).get(position.keys[position.index] ?? position.keys[position.index - 1]!);
    return lineAt(t, current, position, row?.depth ?? 0, lineBefore(t, position));
  },
  afterMove: (event) => afterMove(t, event),
  hasChanges: (next, inserted) => hasChanges(t, next, inserted),
  reset: () => {
    t.state = null;
    t.spot = null;
    t.incoming = null;
    t.prepared = null;
    t.placement.value = null;
  },
});
