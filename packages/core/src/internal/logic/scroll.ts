import type { IDnDProviderInternal } from '../types/provider';
import { runCollisionAndApply } from './pointer';

export const handleScrollEvent = (provider: IDnDProviderInternal) => () => {
  if (!provider.state.value) return;

  provider.scrollPosition.x = window.scrollX;
  provider.scrollPosition.y = window.scrollY;
  provider.lib.rectCache.clear();

  if (provider.state.value === 'dragging') {
    runCollisionAndApply(provider);
  }
};
