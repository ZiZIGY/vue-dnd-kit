import {
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
  type VNode,
} from 'vue';
import { defaultDocument, defaultWindow, useEventListener } from '@vueuse/core';
import type {
  ActivationOptions,
  Announcements,
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
import { DND_CONTEXT, useManager } from './context';
import { devtoolsHook } from './devtoolsHook';
import { useSensors } from './sensors/host';
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

export const DnDProvider = /* @__PURE__ */ defineComponent({
  name: 'DnDProvider',
  props: {
    collision: Function as PropType<CollisionDetection>,
    modifiers: Array as PropType<Modifier[]>,
    animation: { type: [Boolean, Object, Function] as PropType<LayoutAnimation>, default: undefined },
    dropAnimation: { type: [Boolean, Object, Function] as PropType<DropAnimation>, default: undefined },
    autoScroll: { type: [Boolean, Object] as PropType<boolean | AutoScrollOptions>, default: true },
    activation: Object as PropType<ActivationOptions>,
    keyboard: { type: [Boolean, Object] as PropType<KeyboardOptions | false>, default: undefined },
    sensors: Array as PropType<Sensor[]>,
    haptics: { type: [Boolean, Object] as PropType<boolean | HapticsOptions>, default: undefined },
    copyModifier: { type: String as PropType<string | null>, default: 'Alt' },
    overlayTo: { type: [String, Object] as PropType<string | HTMLElement>, default: 'body' },
    overlayFit: { type: String as PropType<'slot' | 'source'>, default: 'slot' },
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
    });

    useSensors(manager, DEFAULT_SENSORS);
    useAutoScroll(manager);

    const refresh = () => manager.scheduleFrame();
    useEventListener(defaultDocument, 'scroll', refresh, { capture: true, passive: true });
    useEventListener(defaultWindow, 'resize', refresh, { passive: true });

    // The teleported part renders on the client only: SSR can't place it into <body>
    // (hydration mismatch in Nuxt), and nothing in it is needed before a drag.
    const mounted = shallowRef(false);
    onMounted(() => {
      mounted.value = true;
      if (props.defaultStyles) injectDefaultStyles();
    });
    onScopeDispose(manager.destroy);

    return () => [
      slots.default?.(),
      mounted.value
        ? h(Teleport, { to: props.overlayTo }, [
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
