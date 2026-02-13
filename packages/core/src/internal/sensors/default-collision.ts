/**
 * Default collision: same logic as vue-dnd-box reference
 * - Filter: AABB overlap with container (overlay)
 * - Sort: pointer outside container → isPointerInElement + depth; else overlap % + centerDistance
 * - Returns full sorted list
 */

import { createSensor } from './sensor';
import {
  overlayContainer,
  overlayBoxFromStyle,
  visibleElements,
  allowedVisibleZones,
  filterValidCollisionTarget,
  aabbCollision,
  sortByOverlapAndPointer,
} from './steps';

export const defaultCollisionDetection = createSensor()
  .container(overlayContainer)
  .containerBox(overlayBoxFromStyle)
  .elements(visibleElements)
  .zones(allowedVisibleZones)
  .filterElements(filterValidCollisionTarget)
  .filterZones(filterValidCollisionTarget)
  .collision(aabbCollision)
  .sortElements(sortByOverlapAndPointer)
  .sortZones(sortByOverlapAndPointer)
  .build();
