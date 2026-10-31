import { defineComponent, h, onBeforeUnmount, onMounted, shallowRef, watch, type PropType } from 'vue';
import type { DragPreviewProps, Key } from '../types';
import { useOverlayScope } from './overlayScope';

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
    // The box it renders in: the drag's, or a landing one's.
    const scope = useOverlayScope();
    const host = shallowRef<HTMLElement | null>(null);
    let shown: HTMLElement | null = null;
    /** This preview as the overlay clone of its item, which lands on the item's slot. */
    let landing: { id: Key; element: HTMLElement; items: Map<Key, HTMLElement> } | null = null;

    const release = () => {
      if (landing && landing.items.get(landing.id) === landing.element) landing.items.delete(landing.id);
      landing = null;
    };

    const attach = () => {
      shown?.remove();
      shown = null;
      release();
      const { active, column, getPreview, items } = scope();
      const preview = getPreview(props.id);
      const element = host.value;
      if (!preview || !element) return;
      // One clone, one place: a second preview of the same item shows a copy of it.
      shown = preview.element.isConnected ? (preview.element.cloneNode(true) as HTMLElement) : preview.element;
      element.appendChild(shown);
      // In a custom overlay layout of a sortable multi-drag (the column brings the landing),
      // another dragged item's preview lands on that item's slot with the drop, as the
      // default column's cells do (those register themselves).
      const parent = element.parentElement;
      const lands =
        !!column &&
        props.id !== active?.id &&
        !!parent?.closest('[data-dnd-overlay]') &&
        !parent.closest('[data-dnd-overlay-item]');
      element.toggleAttribute('data-dnd-overlay-item', lands);
      if (!lands) return;
      items.set(props.id, element);
      landing = { id: props.id, element, items };
    };
    onMounted(attach);
    watch(() => props.id, attach, { flush: 'post' });
    onBeforeUnmount(release);

    return () => {
      const preview = scope().getPreview(props.id as Key);
      if (!preview) {
        // In an element of its own, so `class` and `style` apply to the fallback as to a clone.
        const fallback = slots.default?.();
        return fallback?.length ? h('div', null, fallback) : null;
      }
      const { width, height } = preview.rect;
      return h('div', { ref: host, 'aria-hidden': 'true', style: { width: `${width}px`, height: `${height}px` } });
    };
  },
});
