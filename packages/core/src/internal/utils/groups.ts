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
  const setB = new Set(groupsB);
  return groupsA.some((g) => setB.has(g));
};

/**
 * Фильтрует видимые зоны по группам: оставляет только те, куда можно дропнуть
 * текущий набор перетаскиваемых (draggingMap). Внутри сам берёт ключи из draggingMap.
 *
 * groupMatch on the zone controls the matching strategy:
 * - 'every' (default): ALL dragged items must individually match zone's groups.
 * - 'some': zone is accessible if AT LEAST ONE dragged item matches.
 */
export function filterByGroupsDroppables(
  visibleDroppableSet: Set<HTMLElement>,
  draggingMap: Map<HTMLElement, IDraggingEntity>,
  draggableMap: Map<HTMLElement, IDraggableEntity>,
  droppableMap: Map<HTMLElement, IDroppableEntity>
): Set<HTMLElement> {
  const draggingItems: Array<{ groups: string[] }> = [];
  for (const el of draggingMap.keys()) {
    const entity = draggableMap.get(el);
    draggingItems.push({ groups: entity?.groups ?? [] });
  }

  const allowed = new Set<HTMLElement>();
  for (const el of visibleDroppableSet) {
    const zoneEntity = droppableMap.get(el);
    const zoneGroups = zoneEntity?.groups ?? [];
    const groupMatch = zoneEntity?.groupMatch ?? 'every';

    const isAllowed =
      !draggingItems.length ||
      draggingItems[groupMatch]((item) => areGroupsCompatible(item.groups, zoneGroups));

    if (isAllowed) allowed.add(el);
  }
  return allowed;
}

/**
 * Фильтрует видимые драгаемые по группам: оставляет только те, что в одной «доступной» группе
 * с текущим перетаскиваемым набором (draggingMap). Когда не тянем — все видимые доступны.
 */
export function filterByGroupsDraggables(
  visibleDraggableSet: Set<HTMLElement>,
  draggingMap: Map<HTMLElement, IDraggingEntity>,
  draggableMap: Map<HTMLElement, IDraggableEntity>
): Set<HTMLElement> {
  const draggingGroups = new Set<string>();
  for (const el of draggingMap.keys()) {
    const entity = draggableMap.get(el);
    for (const g of entity?.groups ?? []) draggingGroups.add(g);
  }
  const draggingGroupsArr = [...draggingGroups];
  const allowed = new Set<HTMLElement>();
  for (const el of visibleDraggableSet) {
    const entity = draggableMap.get(el);
    const groups = entity?.groups ?? [];
    if (areGroupsCompatible(draggingGroupsArr, groups)) allowed.add(el);
  }
  return allowed;
}
