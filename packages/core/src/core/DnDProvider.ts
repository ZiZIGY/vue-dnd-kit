import {
  computed,
  defineComponent,
  h,
  onMounted,
  onScopeDispose,
  provide,
  shallowRef,
  Teleport,
  useId,
  type PropType,
  type SlotsType,
  type TransitionProps,
  type VNode,
} from 'vue';
import { useEventListener } from '@vueuse/core';
import type {
  ActivationOptions,
  Announcements,
  AutoAnimation,
  AutoScrollOptions,
  CollisionDetection,
  DnDEndEvent,
  DnDEvent,
  DnDProviderProps,
  DropAnimation,
  HapticsOptions,
  KeyboardOptions,
  LayoutAnimation,
  Modifier,
  OverlaySlotProps,
  Sensor,
} from '../types';
import { createDnDManager } from './manager';
import { overlayTarget } from './manager/overlay';
import { DND_CONTEXT, useManager } from './context';
import { devtoolsHook } from './devtoolsHook';
import { useSensors } from './sensors/host';
import { useNativeDrags } from './native/bridge';
import { pointerSensor } from './sensors/pointer';
import { keyboardSensor } from './sensors/keyboard';
import { useAutoScroll } from './autoscroll';
import { DragOverlay } from './DragOverlay';
import { DEFAULT_INSTRUCTIONS, VISUALLY_HIDDEN } from './a11y';
import { injectDefaultStyles } from './styles';

/** `sensors` by default. */
const DEFAULT_SENSORS: readonly Sensor[] = [pointerSensor, keyboardSensor];

const LiveRegion = /* @__PURE__ */ defineComponent({
  name: 'DnDLiveRegion',
  setup() {
    const manager = useManager();
    return () =>
      h(
        'div',
        { role: 'status', 'aria-live': 'assertive', 'aria-atomic': 'true', style: VISUALLY_HIDDEN },
        manager.announcement.value,
      );
  },
});

/**
 * Owns the drags of everything rendered inside it: input, the overlay, the selection,
 * auto-scroll and the screen reader announcements (see `DnDProviderProps`).
 */
export const DnDProvider = /* @__PURE__ */ defineComponent({
  name: 'DnDProvider',
  props: {
    collision: Function as PropType<CollisionDetection>,
    modifiers: Array as PropType<Modifier[]>,
    animation: { type: [Boolean, Object, Function] as PropType<LayoutAnimation>, default: undefined },
    dropAnimation: { type: [Boolean, Object, Function] as PropType<DropAnimation>, default: undefined },
    animateChanges: { type: [Boolean, Object] as PropType<AutoAnimation>, default: undefined },
    autoScroll: { type: [Boolean, Object] as PropType<boolean | AutoScrollOptions>, default: true },
    activation: Object as PropType<ActivationOptions>,
    keyboard: { type: [Boolean, Object] as PropType<KeyboardOptions | false>, default: undefined },
    sensors: Array as PropType<Sensor[]>,
    haptics: { type: [Boolean, Object] as PropType<boolean | HapticsOptions>, default: undefined },
    copyModifier: { type: String as PropType<string | null>, default: 'Alt' },
    overlayTo: { type: [String, Object] as PropType<string | HTMLElement>, default: 'body' },
    overlayFit: { type: String as PropType<'slot' | 'source'>, default: 'slot' },
    overlayPreviews: { type: [Number, String] as PropType<number | 'all'>, default: 5 },
    overlayTransition: { type: [Boolean, Object] as PropType<boolean | TransitionProps>, default: true },
    overlayClass: { type: [String, Object, Array] as PropType<DnDProviderProps['overlayClass']>, default: undefined },
    announcements: { type: [Boolean, Object] as PropType<Partial<Announcements> | false>, default: undefined },
    screenReaderInstructions: String,
    defaultStyles: { type: Boolean, default: true },
  },
  emits: {
    dragStart: (_event: DnDEvent) => true,
    dragMove: (_event: DnDEvent) => true,
    dragOver: (_event: DnDEvent) => true,
    dragEnd: (_event: DnDEndEvent) => true,
    dragCancel: (_event: DnDEvent) => true,
    dragResume: (_event: DnDEvent) => true,
    dragSettle: (_event: DnDEvent | DnDEndEvent) => true,
  },
  slots: Object as SlotsType<{
    default?: () => VNode[];
    /**
     * Overlay for drags without an `overlay` component of their own (item, list or
     * tree option). Rendering nothing (`v-if`) falls back to the clone.
     */
    overlay?: (props: OverlaySlotProps) => VNode[];
  }>,
  setup(props, { slots, emit }) {
    const manager = createDnDManager(props as DnDProviderProps);
    manager.instructionsId = `dnd-kit-instructions-${useId()}`;
    provide(DND_CONTEXT, manager);
    // Reports to the devtools only when the plugin is installed (`devtoolsHook.ts`).
    devtoolsHook()?.provider(manager);

    manager.addMonitor({
      onDragStart: (event) => emit('dragStart', event),
      onDragMove: (event) => emit('dragMove', event),
      onDragOver: (event) => emit('dragOver', event),
      onDragEnd: (event) => emit('dragEnd', event),
      onDragCancel: (event) => emit('dragCancel', event),
      onDragResume: (event) => emit('dragResume', event),
      onDragSettle: (event) => emit('dragSettle', event),
    });

    useSensors(manager, DEFAULT_SENSORS);
    useNativeDrags(manager);
    useAutoScroll(manager);

    // The teleported part renders on the client only: SSR can't place it into <body>
    // (hydration mismatch in Nuxt), and nothing in it is needed before a drag.
    const mounted = shallowRef(false);
    onMounted(() => {
      mounted.value = true;
      // Each window the provider works in: its scroll and resizes move the targets under
      // the drag, and drags there rely on the styles.
      const refresh = () => manager.scheduleFrame();
      manager.windows.each((view) => {
        injectDefaultStyles(props.defaultStyles, view.document);
        useEventListener(view.document, 'scroll', refresh, { capture: true, passive: true });
        useEventListener(view, 'resize', refresh, { passive: true });
      });
    });
    onScopeDispose(manager.destroy);

    // The overlay renders in the window the drag runs in; the page's, `overlayTo`, before any.
    const overlayTo = computed(() => {
      const doc = manager.document.value;
      return doc && doc !== document ? (overlayTarget(props.overlayTo, doc) ?? props.overlayTo) : props.overlayTo;
    });

    return () => [
      slots.default?.(),
      mounted.value
        ? h(Teleport, { to: overlayTo.value }, [
            // A visual copy of the dragged item: hidden from assistive tech and focus.
            h(
              DragOverlay,
              { inert: true, 'aria-hidden': 'true' },
              slots.overlay ? { default: slots.overlay } : undefined,
            ),
            h(
              'div',
              { id: manager.instructionsId, style: { display: 'none' } },
              props.screenReaderInstructions ?? DEFAULT_INSTRUCTIONS,
            ),
            h(LiveRegion),
          ])
        : null,
    ];
  },
});
