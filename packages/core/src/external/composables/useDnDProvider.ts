import type { IDnDProviderExternal } from '../types';
import { useDnDProviderInternal } from '../../internal/composables/useDnDProviderInternal';

export const useDnDProvider = (): IDnDProviderExternal => {
  const provider = useDnDProviderInternal();

  return {
    preview: provider.preview,
    delay: provider.delay,
    distanceProgress: provider.distanceProgress,
    entities: provider.entities,
    pointer: provider.pointer,
    state: provider.state,
    scrollPosition: provider.scrollPosition,
    keyboard: provider.keyboard,
    hovered: provider.hovered,
    collision: provider.collision,
    autoScrollViewport: provider.autoScrollViewport,
  };
};
