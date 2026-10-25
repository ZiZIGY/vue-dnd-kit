/**
 * The default overlay of a multi-drag in `'group'` and `'gaps'` mode: every dragged item
 * in a column along the list. Only the sortable layer sets `overlayColumn`, so the
 * column lives here: plain draggables don't bundle it.
 */

import { defineComponent, h, onMounted, shallowRef } from 'vue';
import type { Key, Size } from '../types';
import { useDnDContext } from '../core/context';
import { DragPreview } from '../core/DragPreview';
import { BADGE_STYLE, FILL } from '../core/DragOverlay';
import { DEFAULT_LAYOUT_ANIMATION, canAnimate, getRect, resolveAnimation } from '../animation/layout';

export interface ColumnCell {
  id: Key;
  x: number;
  y: number;
  width: number;
  height: number;
}

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

/**
 * Every cloned item in a column along the list, the active one in the box and the others
 * around it in drop order, so the overlay looks like the block the drop makes. Items past
 * the clone cap are counted in a badge. On pickup the clones gather from their items'
 * places; on drop each lands on its own slot.
 */
export const ColumnPreview = /* @__PURE__ */ defineComponent({
  name: 'DnDColumnPreview',
  setup() {
    const manager = useDnDContext();
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
      const hidden = current.ids.length - items.length;
      return h('div', { ref: root, 'aria-hidden': 'true', style: { ...FILL, position: 'relative' } }, [
        ...layoutColumn(items, current.id, box, source, column.axis, column.gap).map((cell) =>
          cell.id === current.id
            ? h(DragPreview, { key: cell.id, id: cell.id, style: FILL })
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
                    transform: `translate(${cell.x}px, ${cell.y}px)`,
                  },
                },
                h(DragPreview, { id: cell.id, style: FILL }),
              ),
        ),
        hidden > 0 ? h('span', { style: BADGE_STYLE }, `+${hidden}`) : null,
      ]);
    };
  },
});
