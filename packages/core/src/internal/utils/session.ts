import type { IDnDProviderInternal } from '../types/provider';

/**
 * Resets DnD session state after pointer up or cancel
 */
export const resetDnDSession = (provider: IDnDProviderInternal): void => {
  // Reset hoveredPlacement on entities before clearing hovered maps
  const hoveredDraggable = provider.hovered.draggable.keys().next().value as HTMLElement | undefined;
  if (hoveredDraggable) {
    const entity = provider.entities.draggableMap.get(hoveredDraggable);
    if (entity) entity.hoveredPlacement = undefined;
  }
  const hoveredDroppable = provider.hovered.droppable.keys().next().value as HTMLElement | undefined;
  if (hoveredDroppable) {
    const entity = provider.entities.droppableMap.get(hoveredDroppable);
    if (entity) entity.hoveredPlacement = undefined;
  }

  provider.lib.rectCache.clear();
  provider.pointer.value = undefined;
  provider.state.value = undefined;
  provider.entities.selectingArea = undefined;
  provider.entities.initiatingDraggable = undefined;
  provider.delay.progress = 0;
  provider.delay.startTime = 0;
  provider.entities.draggingMap.clear();
  provider.hovered.draggable.clear();
  provider.hovered.droppable.clear();
};
