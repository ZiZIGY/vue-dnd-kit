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
