/**
 * The overlay's side of a sortable session: where its clones land (the slot, the
 * placeholders of a block), the `mode` it shows, and the column of a multi-drag.
 */

import type { Coordinates, DnDEvent, Key } from '../types';
import { landOverlayItems } from '../animation/drop';
import { listOf, type GroupContext, type Session } from './context';
import type { ListEntry } from './entry';
import { ColumnPreview, layoutColumn } from './column';

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
 * in a column along the list holding the slot (a row in horizontal lists and grids:
 * consecutive grid items sit side by side), with that list's gap.
 */
const syncColumn = (g: GroupContext, current: Session) => {
  if (current.stacked) return;
  const ids = columnIds(current);
  if (ids.length < 2) return;
  const list = listOf(g, current.list ?? current.origin.list);
  if (!list || list.id === g.columnList) return;
  g.columnList = list.id;
  const axis = list.strategy() === 'vertical' ? 'y' : 'x';
  g.manager.overlayColumn.value = {
    ids,
    axis,
    gap: gapOf(list, axis),
    animation: list.animation(),
    preview: ColumnPreview,
    land: landOverlayItems,
  };
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
  const cell = layoutColumn(items, active.id, box, source, column.axis, column.gap).find((at) => at.id === current.lead);
  return cell ? { x: cell.x, y: cell.y } : NO_OFFSET;
};

/** `event` with the pointer at the lead's clone, for projection (see `leadOffset`). */
export const atLead = (g: GroupContext, current: Session, event: DnDEvent): DnDEvent => {
  const offset = leadOffset(g, current);
  if (offset === NO_OFFSET) return event;
  return { ...event, pointer: { x: event.pointer.x + offset.x, y: event.pointer.y + offset.y } };
};
