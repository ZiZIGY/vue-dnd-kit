/**
 * Default collision: same logic as vue-dnd-box reference
 * - Filter: AABB overlap with container (overlay)
 * - Sort: pointer outside container → isPointerInElement + depth; else overlap % + centerDistance
 * - Picks closest to pointer when both zone and element present
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
  .minOverlapPercent(10)
  .sortElements(sortByOverlapAndPointer)
  .sortZones(sortByOverlapAndPointer)
  .build();

