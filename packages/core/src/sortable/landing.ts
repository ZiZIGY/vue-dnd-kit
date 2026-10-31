/**
 * The overlay's side of a sortable session: where its clones land (the slot, the
 * placeholders of a block), the `mode` it shows, and the column of a multi-drag.
 */

import type { Coordinates, DnDEvent, DropDestination, Key } from '../types';
import { landOverlayItems } from '../animation/drop';
import { listOf, type GroupContext, type Session } from './context';
import type { ListEntry } from './entry';
import type { DropResult } from './drop';
import { ColumnPreview, layoutCells } from './column';
import { spotOf } from './announcements';
import { nearLastTarget } from './stability';

const NO_OFFSET: Coordinates = { x: 0, y: 0 };

/** Sets where the other dragged items land (slot → dragged id), keeping the map when nothing changed. */
export const setLandings = (g: GroupContext, entries: Array<[Key, Key]>) => {
  const { manager } = g;
  const previous = manager.landings.value;
  if (previous.size === entries.length && entries.every(([slot, id]) => previous.get(slot) === id)) return;
  manager.landings.value = new Map(entries);
};

/** Spacing between items of `list` along `axis`, from its CSS `gap`. */
const gapOf = (list: ListEntry, axis: 'x' | 'y'): number => {
  const element = list.getElement();
  if (!element) return 0;
  const style = getComputedStyle(element);
  return parseFloat(axis === 'y' ? style.rowGap : style.columnGap) || 0;
};

/** Ids in the overlay's column, in drop order: the active node goes right after the tree node it rides in. */
const columnIds = (current: Session): Key[] =>
  current.lead === current.activeKey
    ? current.keys
    : current.keys.flatMap((key) => (key === current.lead ? [key, current.activeKey] : [key]));

/**
 * The default overlay of a multi-drag that isn't `'stack'`: every item in drop order,
 * in a column along the list holding the slot (a row in horizontal lists), with that
 * list's gap. In grids a row of whole cells would cover the page: they pile up instead.
 */
const syncColumn = (g: GroupContext, current: Session) => {
  if (current.stacked) return;
  const ids = columnIds(current);
  if (ids.length < 2) return;
  const list = listOf(g, current.list ?? current.origin.list);
  if (!list || list.id === g.columnList) return;
  g.columnList = list.id;
  const strategy = list.strategy();
  const axis = strategy === 'vertical' ? 'y' : 'x';
  g.manager.overlayColumn.value = {
    ids,
    axis,
    gap: gapOf(list, axis),
    layout: strategy === 'grid' ? 'pile' : 'column',
    animation: list.animation(),
    preview: ColumnPreview,
    land: landOverlayItems,
  };
};

/**
 * Where a drop would put the dragged items (the overlay's `to`): the slot's place while
 * the drag is over the list that holds it (or shows its line), a tree adding the depth
 * and the parent. Outside every target too, where `dropOutside: 'placeholder'` keeps
 * the slot. Reactive: the drafts (`version`), the line, the target, a tree's placement.
 */
export const destinationOf = (g: GroupContext): DropDestination | null => {
  void g.version.value;
  const current = g.session.value;
  if (!current) return null;
  const over = g.manager.over.value;
  // A refusing target, or outside every target where the drop cancels or removes: it
  // lands nowhere. (Just past the edge of the last target still counts as on it.)
  const nowhere = over
    ? !over.accepted
    : !nearLastTarget(current.target, g.manager.pointer.value) &&
      listOf(g, current.list ?? current.origin.list)?.dropOutside() !== 'placeholder';
  if (nowhere) return null;
  const spot = spotOf(g, current);
  // Over a plain target the drop goes there, not to the slot.
  if (!spot || (over && spot.list !== over.id)) return null;
  const placement = listOf(g, spot.list)?.layout.placement?.();
  return placement ? { list: spot.list, ...placement } : { list: spot.list, index: spot.index };
};

const sameDestination = (a: DropDestination, b: DropDestination) =>
  a.list === b.list && a.index === b.index && a.parentKey === b.parentKey && a.depth === b.depth;

/** `destinationOf`, the same object while nothing changed: the overlay's props stay as they are. */
export const stableDestination = (g: GroupContext) => (previous: DropDestination | null | undefined) => {
  const next = destinationOf(g);
  return previous && next && sameDestination(previous, next) ? previous : next;
};

/** Mirrors the session into the manager: overlay `mode`, where the overlay lands, the placeholders of a block. */
export const syncManager = (g: GroupContext) => {
  const { manager } = g;
  const current = g.session.value;
  if (!current) return;
  const placed = current.list != null;
  // The overlay lands on a copy or a created item; on the active item's own element
  // otherwise, also when it rides in the lead: the drop shows it again inside it.
  manager.landingKey.value = placed && current.slot !== current.lead ? current.slot : null;
  // Placeholders of the others: a block's, and the lead's when it isn't the active item
  // (its clone rides in the overlay's column too).
  const carrier = current.lead !== current.activeKey;
  setLandings(
    g,
    placed && (current.grouped || carrier)
      ? current.block
          .filter((key) => key !== current.slot || carrier)
          .map((key) => [key, current.mode.original?.(current, key) ?? key])
      : [],
  );
  syncColumn(g, current);
  manager.mode.value = current.mode.dragMode(g, current);
};

/**
 * The drop is decided: where the overlay's clones land. The accepted items on their
 * slots (copies when copying); the rest on their own elements, back where they started.
 * The active item goes with its lead.
 */
export const landDrop = (g: GroupContext, current: Session, result: DropResult | null) => {
  const accepted = result && !current.removed ? result.event.accepted : [];
  if (result) {
    // The lead lands where the drop put it: its copy, the item made for it, or itself. An
    // indicator list never showed the copy while dragging, so only the drop knows it.
    const placed = accepted.includes(current.lead) ? current.mode.placed(current, current.lead) : null;
    if (placed == null) g.manager.landingKey.value = null;
    else if (placed !== current.lead) g.manager.landingKey.value = placed;
  }
  setLandings(
    g,
    accepted
      .filter((key) => key !== current.activeKey)
      .map((key) => [current.mode.placed(current, key), key]),
  );
};

/**
 * Where the lead's clone sits in the overlay, from the pointer: nowhere else than under
 * it, unless the grabbed node rides in another one (a tree), whose clone shows before
 * it in the column. Projection places the slot by that point, so the block lines up
 * with the column (the pointer holds the grabbed row inside it), and keyboard moves put
 * the pointer that far from the slot.
 */
export const leadOffset = (g: GroupContext, current: Session | null): Coordinates => {
  if (!current) return NO_OFFSET;
  const { manager } = g;
  const active = manager.active.value;
  const column = manager.overlayColumn.value;
  if (current.lead === current.activeKey || !active || !column) return NO_OFFSET;
  const items = manager.previewIds.map((id) => ({ id, size: manager.getPreview(id)!.rect }));
  const box = manager.fitSize.value ?? active.rect;
  const source = manager.getPreview(active.id)?.rect ?? active.rect;
  const cell = layoutCells(column, items, active.id, box, source).find((at) => at.id === current.lead);
  return cell ? { x: cell.x, y: cell.y } : NO_OFFSET;
};

/** `event` with the pointer at the lead's clone, for projection (see `leadOffset`). */
export const atLead = (g: GroupContext, current: Session, event: DnDEvent): DnDEvent => {
  const offset = leadOffset(g, current);
  if (offset === NO_OFFSET) return event;
  return { ...event, pointer: { x: event.pointer.x + offset.x, y: event.pointer.y + offset.y } };
};
