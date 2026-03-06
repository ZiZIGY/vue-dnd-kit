import type { IDnDProviderInternal } from '../types/provider';
import { runCollisionAndApply } from './pointer';
import { updateSelectionByBox } from '../utils/selection';

export const handleScrollEvent = (provider: IDnDProviderInternal) => () => {
  if (!provider.state.value) return;

  const prevX = provider.scrollPosition.x;
  const prevY = provider.scrollPosition.y;

  provider.scrollPosition.x = window.scrollX;
  provider.scrollPosition.y = window.scrollY;
  provider.lib.rectCache.clear();

  if (provider.state.value === 'dragging') {
    runCollisionAndApply(provider);
    return;
  }

  if (provider.state.value === 'selecting' && provider.pointer.value) {
    // Keep pointer.start fixed in document space so the selection anchor stays
    // attached to its original content position while the viewport scrolls.
    // Both pointer coords are in viewport space; subtracting the scroll delta
    // converts the start to follow the page, extending the rect over new items.
    const dx = window.scrollX - prevX;
    const dy = window.scrollY - prevY;
    provider.pointer.value.start.x -= dx;
    provider.pointer.value.start.y -= dy;

    updateSelectionByBox(provider);
  }
};
