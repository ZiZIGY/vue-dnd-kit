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
import { useResizeObserver } from '@vueuse/core';
import type { OverlaySlotProps } from '../types';
import { useDnDContext } from './context';
import { getOverlaySmoothing } from './modifiers';
import { prefersReducedMotion } from '../animation/layout';

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

/** Overlay box resizes (target list with other item sizes) glide instead of jumping. */
const RESIZE_TRANSITION = 'width 150ms ease, height 150ms ease';

/**
 * Default overlay content: the clone taken at drag start, plus a count badge for
 * multi-drag. The clone fills the overlay box, so a resize re-lays it out instead of
 * stretching it.
 */
const DefaultPreview = defineComponent({
  name: 'DnDDefaultPreview',
  setup() {
    const manager = useDnDContext();
    const host = shallowRef<HTMLElement | null>(null);
    onMounted(() => {
      const clone = manager.preview;
      if (clone && host.value) host.value.appendChild(clone);
    });
    return () => {
      const count = manager.active.value?.ids.length ?? 0;
      return h('div', { 'aria-hidden': 'true', style: FILL }, [
        h('div', { ref: host, style: FILL }),
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
    useResizeObserver(element, () => {
      const el = element.value;
      if (el) manager.overlaySize.value = { width: el.offsetWidth, height: el.offsetHeight };
    });

    const visible = computed(() => {
      const status = manager.status.value;
      return !!manager.active.value && manager.hasOverlay && (status === 'dragging' || status === 'dropping');
    });

    // Smooth snapping glides between snapped positions while dragging. The transition
    // goes away with `dragging`: a running CSS transition would override the WAAPI
    // drop animation (transitions sit above animations in the cascade).
    const transition = computed(() => {
      if (manager.status.value !== 'dragging' || prefersReducedMotion()) return undefined;
      const smooth = getOverlaySmoothing(manager.props.modifiers);
      return [smooth && `transform ${smooth.duration}ms ${smooth.easing}`, RESIZE_TRANSITION]
        .filter(Boolean)
        .join(', ');
    });

    const style = computed(() => {
      const current = manager.active.value!;
      const offset = manager.transform.value;
      const size = manager.fitSize.value ?? current.rect;
      return {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '9999',
        pointerEvents: 'none',
        transformOrigin: '0 0',
        willChange: 'transform',
        boxSizing: 'border-box',
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: `translate3d(${current.rect.left + offset.x}px, ${current.rect.top + offset.y}px, 0)`,
        transition: transition.value,
      } as const;
    });

    return () => {
      if (!visible.value) return null;
      const current = manager.active.value!;
      const props: OverlaySlotProps = {
        active: current,
        items: current.items,
        over: manager.over.value,
        accepted: manager.over.value?.accepted ?? false,
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
