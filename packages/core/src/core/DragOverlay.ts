import {
  cloneVNode,
  Comment,
  computed,
  defineComponent,
  Fragment,
  h,
  isVNode,
  shallowRef,
  Transition,
  watch,
  type Component,
  type SlotsType,
  type TransitionProps,
  type VNode,
  type VNodeArrayChildren,
} from 'vue';
import type { DropDestination, OverlaySlotProps } from '../types';
import { useManager } from './context';
import { getOverlaySmoothing } from './modifiers';
import { DragPreview } from './DragPreview';
import { prefersReducedMotion, settle } from '../animation/layout';

export const BADGE_STYLE = {
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

export const FILL = { width: '100%', height: '100%' } as const;

/**
 * Default overlay content: the clone taken at drag start; a multi-drag shows every
 * item (the sortable layer's column), or with `'stack'` the active one and a count
 * badge. The clone fills the overlay box, so a resize re-lays it out instead of
 * stretching it.
 */
const DefaultPreview = /* @__PURE__ */ defineComponent({
  name: 'DnDDefaultPreview',
  setup() {
    const manager = useManager();
    return () => {
      const current = manager.active.value;
      if (!current) return null;
      const count = current.ids.length;
      const column = manager.overlayColumn.value;
      if (count > 1 && column) return h(column.preview);
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
 * The drag's own overlay content by precedence: its component (the item's `overlay`,
 * else its list's), the provider's `#overlay` slot, the clone. A slot that renders
 * nothing for this drag (`v-if` on the item type) falls back to the clone.
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

/** The default `overlayTransition`: the two contents crossfade, the leaving one on top of the other. */
const CROSSFADE = 150;

const crossfade = (element: Element, keyframes: Keyframe[], done: () => void) => {
  if (prefersReducedMotion() || typeof (element as HTMLElement).animate !== 'function') return done();
  // A fade that never ends (a stalled timeline) must not keep the old content around.
  void settle((element as HTMLElement).animate(keyframes, { duration: CROSSFADE, easing: 'ease' }), CROSSFADE * 2).then(done);
};

const DEFAULT_TRANSITION: TransitionProps = {
  css: false,
  onEnter: (element, done) => crossfade(element, [{ opacity: 0 }, { opacity: 1 }], done),
  onLeave: (element, done) => {
    // Out of the flow, over the entering content: the box shows both while they fade.
    Object.assign((element as HTMLElement).style, { position: 'absolute', top: '0', left: '0' });
    crossfade(element, [{ opacity: 1 }, { opacity: 0 }], done);
  },
};

/** Keys of overlay components: a new component under the transition is new content. */
const componentKeys = new WeakMap<object, number>();
let lastComponentKey = 0;
const keyOf = (component: Component | null): string => {
  if (!component) return 'default';
  let key = componentKeys.get(component);
  if (key == null) componentKeys.set(component, (key = ++lastComponentKey));
  return `component-${key}`;
};

/** A single element or component: what a `<Transition>` can animate. */
const transitionable = (content: VNode | VNode[]): VNode | null => {
  const node = Array.isArray(content) ? (content.length === 1 ? content[0] : null) : content;
  return node && isVNode(node) && node.type !== Comment && node.type !== Fragment ? node : null;
};

/** Floating element that follows the pointer; rendered by DnDProvider. */
export const DragOverlay = /* @__PURE__ */ defineComponent({
  name: 'DnDDragOverlay',
  slots: Object as SlotsType<{ default?: (props: OverlaySlotProps) => VNode[] }>,
  setup(_, { slots }) {
    const manager = useManager();
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
      // animation moves `transform` from this rect), it all sits in `transform`: then
      // `translate` keeps the dropped box on what it lands on while that scrolls (`follow.ts`).
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

    /** Where the drop would go, kept as it was at the drop while it is decided and lands. */
    let landingTo: DropDestination | null = null;

    return () => {
      if (!visible.value) return null;
      const current = manager.active.value!;
      // Flying into place, the overlay still shows what it lands on (`over` is cleared).
      const over = manager.settling.value ? manager.dropTarget.value : manager.over.value;
      if (manager.status.value === 'dragging') landingTo = manager.getDestination();
      const props: OverlaySlotProps = {
        active: current,
        items: current.items,
        over,
        accepted: over?.accepted ?? false,
        status: manager.status.value,
        mode: manager.mode.value,
        to: landingTo,
      };
      // A target that takes the drag may show its own overlay: the drag's own is its slot.
      const target = over?.accepted ? manager.getDroppable(over.id)?.getOverlay?.() : undefined;
      const own = manager.overlayComponent;
      const renderOwn = () => renderOverlay(own, slots.default, props, DefaultPreview);
      const content = target ? h(target, props, { default: renderOwn }) : renderOwn();
      // A change of component animates: the content's root is keyed by its component.
      const option = manager.props.overlayTransition;
      const change = option === false ? null : option === true || option == null ? DEFAULT_TRANSITION : option;
      const root = change && transitionable(content);
      const children = root ? h(Transition, change, () => cloneVNode(root, { key: keyOf(target ?? own) })) : content;
      // `data-dnd-overlay` says what the overlay is doing, for CSS: `dragging`, then
      // `dropping` while it lands (or waits for an async `onBeforeDrop`).
      return h('div', { ref: element, style: style.value, 'data-dnd-overlay': props.status }, children);
    };
  },
});
