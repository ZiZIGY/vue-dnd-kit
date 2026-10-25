/**
 * Auto-scroll (rfcs/0001-v3.md §11): `math.ts` decides how fast, `dom.ts` reads and
 * scrolls the containers, `loop.ts` runs both once per frame of a pointer drag.
 */

export { useAutoScroll } from './loop';
export { revealElement } from './dom';
