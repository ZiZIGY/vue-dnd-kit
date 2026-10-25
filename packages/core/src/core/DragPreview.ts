import { defineComponent, h, onMounted, shallowRef, watch, type PropType } from 'vue';
import type { DragPreviewProps, Key } from '../types';
import { useDnDContext } from './context';

/**
 * The default clone of one dragged item (see `DragPreviewProps`). Custom overlays use
 * it to lay out several items themselves; the default overlay shows a multi-drag with it.
 */
export const DragPreview = /* @__PURE__ */ defineComponent({
  name: 'DragPreview',
  props: {
    id: { type: [String, Number] as PropType<DragPreviewProps['id']>, required: true },
  },
  setup(props, { slots }) {
    const manager = useDnDContext();
    const host = shallowRef<HTMLElement | null>(null);
    let shown: HTMLElement | null = null;

    const attach = () => {
      shown?.remove();
      shown = null;
      const preview = manager.getPreview(props.id);
      if (!preview || !host.value) return;
      // One clone, one place: a second preview of the same item shows a copy of it.
      shown = preview.element.isConnected ? (preview.element.cloneNode(true) as HTMLElement) : preview.element;
      host.value.appendChild(shown);
    };
    onMounted(attach);
    watch(() => props.id, attach, { flush: 'post' });

    return () => {
      const preview = manager.getPreview(props.id as Key);
      if (!preview) return slots.default?.();
      const { width, height } = preview.rect;
      return h('div', { ref: host, 'aria-hidden': 'true', style: { width: `${width}px`, height: `${height}px` } });
    };
  },
});
