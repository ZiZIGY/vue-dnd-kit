import {
  cloneVNode,
  Comment,
  computed,
  defineComponent,
  Fragment,
  h,
  isVNode,
  provide,
  shallowRef,
  Transition,
  watch,
  type Component,
  type PropType,
  type SlotsType,
  type TransitionProps,
  type VNode,
  type VNodeArrayChildren,
} from 'vue';
import type { DropDestination, Key, OverlaySlotProps, Rect } from '../types';
import type { Flight } from './manager';
import { useManager } from './context';
import { getOverlaySmoothing } from './modifiers';
import { DragPreview } from './DragPreview';
import { OVERLAY_SCOPE, dragScope, flightScope, useOverlayScope, type OverlayScope } from './overlayScope';
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

/** Where the items behind the active one lie in a pile, fanned out a little. */
export const PILE = [
  { x: 8, y: 7, rotate: 4 },
  { x: -7, y: 10, rotate: -5 },
  { x: 14, y: 14, rotate: 8 },
];

/**
 * Default overlay content: the clone taken at drag start. A multi-drag shows every item
 * (the sortable layer's column); of plain draggables, a pile: the grabbed one on top of up
 * to three others, and the count. The pile's clones fly back to their items when the drag
 * is cancelled, and into the zone a drop goes into, one after another. With `'stack'` the
 * sortable layer brings the others back itself: the grabbed one and the count. The clone
 * fills the overlay box, so a resize re-lays it out instead of stretching it.
 */
const DefaultPreview = /* @__PURE__ */ defineComponent({
  name: 'DnDDefaultPreview',
  setup() {
    const scope = useOverlayScope();
    const cells = new Map<Key, HTMLElement>();
    /** A pile's clone lands with the drop: it goes in the box's landing items. */
    const register = (id: Key, element: Element | null) => {
      const { items } = scope();
      const previous = cells.get(id);
      if (previous && items.get(id) === previous) items.delete(id);
      cells.delete(id);
      if (!(element instanceof HTMLElement)) return;
      cells.set(id, element);
      items.set(id, element);
    };
    return () => {
      const { active: current, column, previewIds } = scope();
      if (!current) return null;
      const count = current.ids.length;
      if (count > 1 && column) return h(column.preview);
      // Sortable items carry their list's item: theirs come back on their own ('stack').
      const plain = current.items[0]?.item === undefined;
      // Every clone is in the pile, the ones past the third under it: into a zone, they
      // all go in one after another.
      const behind = count > 1 && plain ? previewIds.filter((id) => id !== current.id) : [];
      return h('div', { 'aria-hidden': 'true', style: { ...FILL, position: 'relative' } }, [
        // Deepest first: the grabbed one lies on top.
        ...behind
          .map((id, index) => {
            const { x, y, rotate } = PILE[Math.min(index, PILE.length - 1)]!;
            return h(
              'div',
              {
                key: id,
                ref: (element) => register(id, element as Element | null),
                'data-dnd-overlay-item': '',
                style: { position: 'absolute', top: '0', left: '0', ...FILL, transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)` },
              },
              h(DragPreview, { id, style: FILL }),
            );
          })
          .reverse(),
        h(DragPreview, { key: current.id, id: current.id, style: { ...FILL, position: 'relative' } }),
        count > 1 ? h('span', { style: { ...BADGE_STYLE, zIndex: 1 } }, String(count)) : null,
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

/** The box's style where it doesn't move with the pointer: a landing box, at `rect`. */
const boxStyle = (rect: Rect) =>
  ({
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '9999',
    pointerEvents: 'none',
    transformOrigin: '0 0',
    willChange: 'transform',
    boxSizing: 'border-box',
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
  }) as const;

/**
 * One box of the overlay: the drag's, or a landing flight's. It gives its content the
 * scope it shows (`OverlayScope`). A drag's box carries on as its flight's (same key), so
 * what is in it (a running transition, a component's state) lands as it was.
 */
const OverlayBox = /* @__PURE__ */ defineComponent({
  name: 'DnDOverlayBox',
  props: {
    scope: { type: Object as PropType<OverlayScope>, required: true },
    boxStyle: { type: Object as PropType<Record<string, string | undefined>>, required: true },
    status: { type: String, required: true },
    /** Told the box element (or `null` once it is gone). */
    onElement: { type: Function as PropType<(element: HTMLElement | null) => void>, required: true },
  },
  setup(props, { slots }) {
    provide(OVERLAY_SCOPE, () => props.scope);
    const element = shallowRef<HTMLElement | null>(null);
    watch(element, (value) => props.onElement(value));
    // `data-dnd-overlay` says what the box is doing, for CSS: `dragging`, then `dropping`
    // while it lands (or waits for an async `onBeforeDrop`).
    return () => h('div', { ref: element, style: props.boxStyle, 'data-dnd-overlay': props.status }, slots.default?.());
  },
});

/** What a landing box renders, made once per flight: its props never change. */
interface FlightView {
  scope: OverlayScope;
  props: OverlaySlotProps;
  style: ReturnType<typeof boxStyle>;
  onElement: (element: HTMLElement | null) => void;
}

/**
 * The overlay: a box that follows the pointer while dragging, and a box per landing
 * flight; rendered by DnDProvider.
 */
export const DragOverlay = /* @__PURE__ */ defineComponent({
  name: 'DnDDragOverlay',
  // Several boxes: each takes the attributes (`inert`, `aria-hidden` from the provider).
  inheritAttrs: false,
  slots: Object as SlotsType<{ default?: (props: OverlaySlotProps) => VNode[] }>,
  setup(_, { slots, attrs }) {
    const manager = useManager();
    const scope = dragScope(manager);
    const setElement = (value: HTMLElement | null) => {
      // A box that went on as a flight's is no longer the drag's.
      if (value || manager.active.value) manager.overlayElement.value = value;
    };

    const views = new WeakMap<Flight, FlightView>();
    const viewOf = (flight: Flight): FlightView => {
      let view = views.get(flight);
      if (!view) {
        const { active, over } = flight;
        view = {
          scope: flightScope(flight),
          props: { active, items: active.items, over, accepted: over?.accepted ?? false, status: 'dropping', mode: flight.mode, to: flight.to },
          style: boxStyle(flight.rect),
          onElement: (element) => (flight.element = element),
        };
        views.set(flight, view);
      }
      return view;
    };

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

    /** Where the drop would go, kept as it was at the release while the drop is decided. */
    let landingTo: DropDestination | null = null;

    /**
     * A box's content: the drop target's overlay around the drag's own (its component, the
     * provider's slot, the clone). A change of component animates (`overlayTransition`).
     */
    const content = (props: OverlaySlotProps, target: Component | undefined, own: Component | null) => {
      const renderOwn = () => renderOverlay(own, slots.default, props, DefaultPreview);
      const shown = target ? h(target, props, { default: renderOwn }) : renderOwn();
      // The content's root is keyed by its component: a new one is new content.
      const option = manager.props.overlayTransition;
      const change = option === false ? null : option === true || option == null ? DEFAULT_TRANSITION : option;
      const root = change && transitionable(shown);
      return root ? h(Transition, change, () => cloneVNode(root, { key: keyOf(target ?? own) })) : shown;
    };

    const dragBox = () => {
      const current = manager.active.value!;
      const over = manager.over.value;
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
      return h(
        OverlayBox,
        { ...attrs, key: manager.sessionId(), scope, boxStyle: style.value, status: props.status, onElement: setElement },
        () => content(props, target, manager.overlayComponent),
      );
    };

    return () => {
      // The landing boxes first, the drag's last: a drag's box goes on as its flight's in place.
      const boxes = manager.flights.value.map((flight) => {
        const view = viewOf(flight);
        return h(
          OverlayBox,
          { ...attrs, key: flight.id, scope: view.scope, boxStyle: view.style, status: 'dropping', onElement: view.onElement },
          () => content(view.props, flight.target, flight.component),
        );
      });
      if (visible.value) boxes.push(dragBox());
      return boxes;
    };
  },
});
