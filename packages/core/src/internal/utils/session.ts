import type { IDnDProviderInternal } from '../types/provider';

/**
 * Resets DnD session state after pointer up or cancel
 */
export const resetDnDSession = (provider: IDnDProviderInternal): void => {
  provider.pointer.value = undefined;
  provider.state.value = undefined;
  provider.entities.selectingArea = undefined;
  provider.entities.initiatingDraggable = undefined;
  provider.delayProgress.value = 0;
  provider.delayStartTime.value = 0;
  provider.entities.draggingMap.clear();
};
