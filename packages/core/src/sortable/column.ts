/**
 * The default overlay of a multi-drag in `'group'` and `'gaps'` mode: every dragged item
 * in a column along the list, or in a pile in grids. Only the sortable layer sets
 * `overlayColumn`, so the column lives here: plain draggables don't bundle it.
 */

import { defineComponent, h, onMounted, shallowRef, type CSSProperties } from 'vue';
import type { Key, Size } from '../types';
import type { OverlayColumn } from '../core/manager/state';
import { useManager } from '../core/context';
import { DragPreview } from '../core/DragPreview';
import { BADGE_STYLE, FILL } from '../core/DragOverlay';
import { DEFAULT_LAYOUT_ANIMATION, canAnimate, getRect, resolveAnimation } from '../animation/layout';

export interface ColumnCell {
  id: Key;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Degrees: the items of a pile are turned a little. */
  rotate?: number;
}

/** Where the items behind the active one lie in a pile, fanned out a little. */
const PILE = [
  { x: 8, y: 7, rotate: 4 },
  { x: -7, y: 10, rotate: -5 },
  { x: 14, y: 14, rotate: 8 },
];

/**
 * Cells of a pile (multi-drag in grids, where a row of whole cells would cover the page):
 * the active item on top in the box, up to three others behind it at the box's size.
 */
export const layoutPile = (items: Array<{ id: Key }>, active: Key, box: Size): ColumnCell[] => {
  const behind = items.filter(({ id }) => id !== active).slice(0, PILE.length);
  return [
    ...behind.map(({ id }, i) => ({ id, ...PILE[i]!, width: box.width, height: box.height })),
    { id: active, x: 0, y: 0, width: box.width, height: box.height },
  ];
};

/** The cells `column` lays its items out in (see `layoutColumn`, `layoutPile`). */
export const layoutCells = (
  column: OverlayColumn,
  items: Array<{ id: Key; size: Size }>,
  active: Key,
  box: Size,
  source: Size,
): ColumnCell[] =>
  column.layout === 'pile'
    ? layoutPile(items, active, box)
    : layoutColumn(items, active, box, source, column.axis, column.gap);

/**
 * Cells of the multi-drag column, relative to the overlay box (the active item's cell,
 * at 0, 0). Items run along `axis` in drop order, `gap` apart; across it they take the
 * box's size, along it their own size scaled like the active item's (`box` / `source`).
 */
export const layoutColumn = (
  items: Array<{ id: Key; size: Size }>,
  active: Key,
  box: Size,
  source: Size,
  axis: 'x' | 'y',
  gap: number,
): ColumnCell[] => {
  const along = axis === 'y' ? 'height' : 'width';
  const ratio = source[along] > 0 ? box[along] / source[along] : 1;
  const lengths = items.map(({ id, size }) => (id === active ? box[along] : size[along] * ratio));
  const offsets = lengths.map(() => 0);
  const at = Math.max(items.findIndex((item) => item.id === active), 0);
  for (let i = at + 1; i < items.length; i++) offsets[i] = offsets[i - 1]! + lengths[i - 1]! + gap;
  for (let i = at - 1; i >= 0; i--) offsets[i] = offsets[i + 1]! - lengths[i]! - gap;
  return items.map(({ id }, i) =>
    axis === 'y'
      ? { id, x: 0, y: offsets[i]!, width: box.width, height: lengths[i]! }
      : { id, x: offsets[i]!, y: 0, width: lengths[i]!, height: box.height },
  );
};

/** A count badge centered on a corner of `cell` (overlay box coordinates). */
const badgeAt = (cell: ColumnCell, right: boolean, bottom: boolean, text: string) =>
  h(
    'span',
    {
      style: {
        ...BADGE_STYLE,
        top: `${cell.y + (bottom ? cell.height : 0)}px`,
        right: 'auto',
        left: `${cell.x + (right ? cell.width : 0)}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
      } as CSSProperties,
    },
    text,
  );

/**
 * Counts of the dragged items the overlay doesn't show. A pile shows the whole count on
 * top; a column shows `+N` at the end where its hidden items are: before the first cell
 * for those that drop before it, after the last for the rest.
 */
const badges = (column: OverlayColumn, cells: ColumnCell[], active: Key, ids: readonly Key[]) => {
  if (column.layout === 'pile') {
    const top = cells.find((cell) => cell.id === active)!;
    return ids.length > 1 ? [badgeAt(top, true, false, String(ids.length))] : [];
  }
  const shown = new Set(cells.map((cell) => cell.id));
  const order = column.ids.length ? column.ids : ids;
  const at = Math.max(order.indexOf(active), 0);
  const before = order.slice(0, at).filter((id) => !shown.has(id)).length;
  const after = order.slice(at + 1).filter((id) => !shown.has(id)).length;
  const along = column.axis === 'x';
  const first = cells[0]!;
  const last = cells[cells.length - 1]!;
  return [
    before > 0 ? badgeAt(first, !along, false, `+${before}`) : null,
    after > 0 ? badgeAt(last, true, !along, `+${after}`) : null,
  ];
};

/**
 * Every cloned item in a column along the list, the active one in the box and the others
 * around it in drop order, so the overlay looks like the block the drop makes; in grids, a
 * pile behind the active one. The items past the clone cap are counted where they are:
 * `+N` at each end of the column, the whole count on a pile. On pickup the clones gather
 * from their items' places; on drop each lands on its own slot.
 */
export const ColumnPreview = /* @__PURE__ */ defineComponent({
  name: 'DnDColumnPreview',
  setup() {
    const manager = useManager();
    const root = shallowRef<HTMLElement | null>(null);
    const cells = new Map<Key, HTMLElement>();

    const register = (id: Key, element: Element | null) => {
      const previous = cells.get(id);
      if (previous && manager.overlayItems.get(id) === previous) manager.overlayItems.delete(id);
      cells.delete(id);
      if (!(element instanceof HTMLElement)) return;
      cells.set(id, element);
      manager.overlayItems.set(id, element);
    };

    // The clones gather from where their items were picked up into the column.
    onMounted(() => {
      const resolved = resolveAnimation(manager.overlayColumn.value?.animation ?? manager.props.animation, DEFAULT_LAYOUT_ANIMATION);
      if (!resolved || resolved.custom || !root.value) return;
      const origin = getRect(root.value);
      for (const [id, element] of cells) {
        const preview = manager.getPreview(id);
        if (!preview || !canAnimate(element)) continue;
        const { left, top, width, height } = preview.rect;
        const { transform, width: toWidth, height: toHeight } = element.style;
        element.animate(
          [
            { transform: `translate(${left - origin.left}px, ${top - origin.top}px)`, width: `${width}px`, height: `${height}px` },
            { transform, width: toWidth, height: toHeight },
          ],
          resolved.options,
        );
      }
    });

    return () => {
      const current = manager.active.value;
      const column = manager.overlayColumn.value;
      if (!current || !column) return null;
      // The size on screen: a resize glides frame by frame, and the column with it.
      const box = manager.fitSize.value ?? current.rect;
      const source = manager.getPreview(current.id)?.rect ?? current.rect;
      const items = manager.previewIds.map((id) => ({ id, size: manager.getPreview(id)!.rect }));
      const cells = layoutCells(column, items, current.id, box, source);
      return h('div', { ref: root, 'aria-hidden': 'true', style: { ...FILL, position: 'relative' } }, [
        ...cells.map((cell) =>
          cell.id === current.id
            ? // Above the cells around it: a pile lies behind it.
              h(DragPreview, { key: cell.id, id: cell.id, style: { ...FILL, position: 'relative', zIndex: 1 } })
            : h(
                'div',
                {
                  key: cell.id,
                  ref: (element) => register(cell.id, element as Element | null),
                  'data-dnd-overlay-item': '',
                  style: {
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: `${cell.width}px`,
                    height: `${cell.height}px`,
                    transform: `translate(${cell.x}px, ${cell.y}px)${cell.rotate ? ` rotate(${cell.rotate}deg)` : ''}`,
                  },
                },
                h(DragPreview, { id: cell.id, style: FILL }),
              ),
        ),
        ...badges(column, cells, current.id, current.ids),
      ]);
    };
  },
});
