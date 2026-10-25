import {
  Comment,
  computed,
  defineComponent,
  Fragment,
  h,
  isVNode,
  onMounted,
  shallowRef,
  watch,
  type Component,
  type SlotsType,
  type VNode,
  type VNodeArrayChildren,
} from 'vue';
import type { Key, OverlaySlotProps, Size } from '../types';
import { useDnDContext } from './context';
import { getOverlaySmoothing } from './modifiers';
import { DragPreview } from './DragPreview';
import {
  DEFAULT_LAYOUT_ANIMATION,
  canAnimate,
  getRect,
  prefersReducedMotion,
  resolveAnimation,
} from '../animation/layout';

const BADGE_STYLE = {
  position: 'absolute',
  top: '-8px',
  right: '-8px',
  minWidth: '20px',
  height: '20px',
  padding: '0 6px',
  borderRadius: '10px',
  background: '#2563eb',
  color: '#fff',
  font: '600 12px/20px system-ui, sans-serif',
  textAlign: 'center',
  boxSizing: 'border-box',
} as const;

const FILL = { width: '100%', height: '100%' } as const;

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
 * Multi-drag (`'group'`, `'gaps'`): every cloned item in a column along the list, the
 * active one in the box and the others around it in drop order, so the overlay looks
 * like the block the drop makes. Items past the clone cap are counted in a badge. On
 * pickup the clones gather from their items' places; on drop each lands on its own slot.
 */
const ColumnPreview = defineComponent({
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

/**
 * Default overlay content: the clone taken at drag start; a multi-drag shows every
 * item (`ColumnPreview`), or with `'stack'` the active one and a count badge. The clone
 * fills the overlay box, so a resize re-lays it out instead of stretching it.
 */
const DefaultPreview = defineComponent({
  name: 'DnDDefaultPreview',
  setup() {
    const manager = useDnDContext();
    return () => {
      const current = manager.active.value;
      if (!current) return null;
      const count = current.ids.length;
      if (count > 1 && manager.overlayColumn.value) return h(ColumnPreview);
      return h('div', { 'aria-hidden': 'true', style: FILL }, [
        h(DragPreview, { id: current.id, style: FILL }),
        count > 1 ? h('span', { style: BADGE_STYLE }, String(count)) : null,
      ]);
    };
  },
});

/** Slot output that renders nothing: comments (`v-if`) and empty fragments only. */
const isEmpty = (nodes: VNodeArrayChildren): boolean =>
  nodes.every((node) =>
    isVNode(node)
      ? node.type === Comment || (node.type === Fragment && isEmpty(node.children as VNodeArrayChildren))
      : node == null || typeof node === 'boolean' || (Array.isArray(node) && isEmpty(node)),
  );

/**
 * Overlay content by precedence: the drag's component (the item's `overlay`, else its
 * list's), the provider's `#overlay` slot, the clone. A slot that renders nothing for
 * this drag (`v-if` on the item type) falls back to the clone.
 */
export const renderOverlay = (
  component: Component | null,
  slot: ((props: OverlaySlotProps) => VNode[]) | undefined,
  props: OverlaySlotProps,
  fallback: Component,
): VNode | VNode[] => {
  if (component) return h(component, props);
  const content = slot?.(props);
  return content && !isEmpty(content) ? content : h(fallback);
};

/** Floating element that follows the pointer; rendered by DnDProvider. */
export const DragOverlay = defineComponent({
  name: 'DnDDragOverlay',
  slots: Object as SlotsType<{ default?: (props: OverlaySlotProps) => VNode[] }>,
  setup(_, { slots }) {
    const manager = useDnDContext();
    const element = shallowRef<HTMLElement | null>(null);

    watch(element, (value) => (manager.overlayElement.value = value));

    const visible = computed(() => {
      const status = manager.status.value;
      return !!manager.active.value && manager.hasOverlay && (status === 'dragging' || status === 'dropping');
    });

    // Smooth snapping glides between snapped positions while dragging. The transition
    // goes away with `dragging`: a running CSS transition would override the WAAPI
    // drop animation (transitions sit above animations in the cascade).
    const transition = computed(() => {
      if (manager.status.value !== 'dragging' || prefersReducedMotion()) return undefined;
      const smooth = getOverlaySmoothing(manager.getModifiers());
      return smooth ? `transform ${smooth.duration}ms ${smooth.easing}` : undefined;
    });

    const style = computed(() => {
      const current = manager.active.value!;
      const offset = manager.transform.value;
      // Sized and placed as collision sees it: resized around the grab point.
      const box = manager.getOverlayRect(current, offset);
      // While `transform` glides (smooth snapping), the shift of a resize goes to
      // `translate`, so it keeps pace with the size. Otherwise, and on drop (the drop
      // animation moves `transform` from this rect), it all sits in `transform`.
      const glide = !!transition.value;
      const x = glide ? current.rect.left + offset.x : box.left;
      const y = glide ? current.rect.top + offset.y : box.top;
      return {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '9999',
        pointerEvents: 'none',
        transformOrigin: '0 0',
        willChange: 'transform',
        boxSizing: 'border-box',
        width: `${box.width}px`,
        height: `${box.height}px`,
        transform: `translate3d(${x}px, ${y}px, 0)`,
        translate: glide ? `${box.left - x}px ${box.top - y}px` : undefined,
        transition: transition.value,
      } as const;
    });

    return () => {
      if (!visible.value) return null;
      const current = manager.active.value!;
      // Flying into place, the overlay still shows what it lands on (`over` is cleared).
      const over = manager.settling.value ? manager.dropTarget.value : manager.over.value;
      const props: OverlaySlotProps = {
        active: current,
        items: current.items,
        over,
        accepted: over?.accepted ?? false,
        status: manager.status.value,
        mode: manager.mode.value,
      };
      return h(
        'div',
        { ref: element, style: style.value, 'data-dnd-overlay': '' },
        renderOverlay(manager.overlayComponent, slots.default, props, DefaultPreview),
      );
    };
  },
});
