import {
  defineComponent,
  h,
  onMounted,
  onScopeDispose,
  provide,
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
  KeyboardOptions,
  LayoutAnimation,
  Modifier,
  OverlaySlotProps,
} from '../types';
import { createDnDManager } from './manager';
import { DND_CONTEXT, useDnDContext } from './context';
import { usePointerSensor } from './sensors/pointer';
import { useKeyboardSensor } from './sensors/keyboard';
import { useAutoScroll } from './autoscroll';
import { DragOverlay } from './DragOverlay';
import { DEFAULT_INSTRUCTIONS, VISUALLY_HIDDEN } from './a11y';
import { injectDefaultStyles } from './styles';

const LiveRegion = defineComponent({
  name: 'DnDLiveRegion',
  setup() {
    const manager = useDnDContext();
    return () =>
      h(
        'div',
        { role: 'status', 'aria-live': 'assertive', 'aria-atomic': 'true', style: VISUALLY_HIDDEN },
        manager.announcement.value,
      );
  },
});

export const DnDProvider = defineComponent({
  name: 'DnDProvider',
  props: {
    collision: Function as PropType<CollisionDetection>,
    modifiers: Array as PropType<Modifier[]>,
    animation: { type: [Boolean, Object, Function] as PropType<LayoutAnimation>, default: undefined },
    dropAnimation: { type: [Boolean, Object, Function] as PropType<DropAnimation>, default: undefined },
    autoScroll: { type: [Boolean, Object] as PropType<boolean | AutoScrollOptions>, default: true },
    activation: Object as PropType<ActivationOptions>,
    keyboard: { type: [Boolean, Object] as PropType<KeyboardOptions | false>, default: undefined },
    copyModifier: { type: String as PropType<string | null>, default: 'Alt' },
    overlayTo: { type: [String, Object] as PropType<string | HTMLElement>, default: 'body' },
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
    overlay?: (props: OverlaySlotProps) => VNode[];
  }>,
  setup(props, { slots, emit }) {
    const manager = createDnDManager(props as DnDProviderProps);
    manager.instructionsId = `dnd-kit-instructions-${useId()}`;
    provide(DND_CONTEXT, manager);

    manager.addMonitor({
      onDragStart: (event) => emit('dragStart', event),
      onDragMove: (event) => emit('dragMove', event),
      onDragOver: (event) => emit('dragOver', event),
      onDragEnd: (event) => emit('dragEnd', event),
      onDragCancel: (event) => emit('dragCancel', event),
    });

    usePointerSensor(manager);
    useKeyboardSensor(manager);
    useAutoScroll(manager);

    const refresh = () => manager.scheduleFrame();
    useEventListener(defaultDocument, 'scroll', refresh, { capture: true, passive: true });
    useEventListener(defaultWindow, 'resize', refresh, { passive: true });

    onMounted(() => {
      if (props.defaultStyles) injectDefaultStyles();
    });
    onScopeDispose(manager.destroy);

    return () => [
      slots.default?.(),
      h(Teleport, { to: props.overlayTo }, [
        h(DragOverlay, null, slots.overlay ? { default: slots.overlay } : undefined),
        h(
          'div',
          { id: manager.instructionsId, style: { display: 'none' } },
          props.screenReaderInstructions ?? DEFAULT_INSTRUCTIONS,
        ),
        h(LiveRegion),
      ]),
    ];
  },
});
