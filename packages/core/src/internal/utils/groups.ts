import type {
  IDraggableEntity,
  IDraggingEntity,
  IDroppableEntity,
} from '../../external/types/entities';

/**
 * Checks compatibility between two group sets.
 * Used for selection area, zones, droppable, etc.
 *
 * - Empty array = global (compatible with any)
 * - Otherwise requires at least one shared group
 */
export const areGroupsCompatible = (
  groupsA: string[],
  groupsB: string[]
): boolean => {
  if (!groupsA.length || !groupsB.length) return true;
  return groupsA.some((g) => groupsB.includes(g));
};

/**
 * Фильтрует видимые зоны по группам: оставляет только те, куда можно дропнуть
 * текущий набор перетаскиваемых (draggingMap). Внутри сам берёт ключи из draggingMap.
 */
export function filterByGroups(
  visibleDroppableSet: Set<HTMLElement>,
  draggingMap: Map<HTMLElement, IDraggingEntity>,
  draggableMap: Map<HTMLElement, IDraggableEntity>,
  droppableMap: Map<HTMLElement, IDroppableEntity>
): Set<HTMLElement> {
  const draggingGroups = new Set<string>();
  for (const el of draggingMap.keys()) {
    const entity = draggableMap.get(el);
    for (const g of entity?.groups ?? []) draggingGroups.add(g);
  }
  const draggingGroupsArr = [...draggingGroups];
  const allowed = new Set<HTMLElement>();
  for (const el of visibleDroppableSet) {
    const zoneEntity = droppableMap.get(el);
    const zoneGroups = zoneEntity?.groups ?? [];
    if (areGroupsCompatible(draggingGroupsArr, zoneGroups)) allowed.add(el);
  }
  return allowed;
}
