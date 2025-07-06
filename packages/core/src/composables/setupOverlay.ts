import {
  computed,
  CSSProperties,
  onMounted,
  onUnmounted,
  TransitionProps,
} from 'vue';
import { TDnDNode } from '../@types';
import { useDnDProvider } from '../provider/context';
import { getElementFromRef } from '../utils/vue';

export const setupOverlay = (ref: TDnDNode, options?: TransitionProps) => {
  const provider = useDnDProvider();

  const style = computed<CSSProperties>(() => ({
    position: 'fixed',
    transform: `translate3d(${
      (provider.pointerPosition.current[0] ?? 0) -
      (provider.pointerPosition.offsetPixel[0] ?? 0)
    }px, ${
      (provider.pointerPosition.current[1] ?? 0) -
      (provider.pointerPosition.offsetPixel[1] ?? 0)
    }px, 0)`,
    zIndex: 1000,
    top: 0,
    left: 0,
  }));

  onMounted(() => {
    if (!ref.value) return;
    const element = getElementFromRef(ref);

    provider.overlay.ref = element;
    provider.overlay.options = options ?? null;
  });

  onUnmounted(() => {
    provider.overlay.ref = null;
    provider.overlay.options = null;
  });

  return {
    draggingElements: provider.draggingMap,
    isDragging: provider.isDragging,
    style,
  };
};
