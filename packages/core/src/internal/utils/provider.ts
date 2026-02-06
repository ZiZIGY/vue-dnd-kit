import type { IDraggableEntity, ISelectableAreaEntity } from '../../external/types';

import type { Ref } from 'vue';

/**
 * Utility for filtering entities by modifier keys.
 *
 * @param entityMap - Map of entities (e.g. selectableAreaMap or draggableEntityMap)
 * @param visibleSet - Set of visible nodes
 * @param modifiers - Ref with pressed keys
 * @returns Set of filtered nodes with matching modifiers
 */
export const filterByModifiers = (
  entityMap: Map<HTMLElement, IDraggableEntity | ISelectableAreaEntity>,
  visibleSet: Set<HTMLElement>,
  modifiers: Ref<Set<string>>
): Set<HTMLElement> => {
  const result: Set<HTMLElement> = new Set();

  visibleSet.forEach((visibleNode) => {
    const entity = entityMap.get(visibleNode);
    if (!entity) return;

    const keys = entity.modifier?.keys;
    const method = entity.modifier?.method;

    // If no modifier keys are specified, element is always available
    if (!keys || !method || keys.length === 0) {
      result.add(visibleNode);
      return;
    }

    const keysPressed = keys[method]((key) => modifiers.value.has(key));

    if (keysPressed) {
      result.add(visibleNode);
    }
  });

  return result;
};
