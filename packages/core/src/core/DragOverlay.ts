import {
  computed,
  defineComponent,
  h,
  onMounted,
  shallowRef,
  watch,
  type SlotsType,
  type VNode,
} from 'vue';
import { useResizeObserver } from '@vueuse/core';
import type { OverlaySlotProps } from '../types';
import { useDnDContext } from './context';

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

/** Default overlay content: the clone taken at drag start, plus a count badge for multi-drag. */
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
      return h('div', { 'aria-hidden': 'true' }, [
        h('div', { ref: host }),
        count > 1 ? h('span', { style: BADGE_STYLE }, String(count)) : null,
      ]);
    };
  },
});

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

    const style = computed(() => {
      const current = manager.active.value!;
      const offset = manager.transform.value;
      return {
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '9999',
        pointerEvents: 'none',
        transformOrigin: '0 0',
        willChange: 'transform',
        transform: `translate3d(${current.rect.left + offset.x}px, ${current.rect.top + offset.y}px, 0)`,
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
        slots.default ? slots.default(props) : h(DefaultPreview),
      );
    };
  },
});
