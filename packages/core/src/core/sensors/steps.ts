/**
 * How keyboard drags move (rfcs/0001-v3.md §10), whichever sensor drives them: by items.
 * An arrow asks the monitors for the next position (sortable lists answer with the next
 * slot); without an answer a free drag jumps to the next accepting target
 * (`keyboard: 'droppables'`) or moves by pixels. `place` puts the item at a position of
 * a list directly.
 */

import type { Active, Coordinates, Key, Rect, SensorDirection, SortablePosition } from '../../types';
import type { DnDManager } from '../manager';
import { getCenter, getRect, getWindowRect, intersectRect } from '../../animation/layout';
import { revealElement } from '../autoscroll';

const DEFAULT_STEP = 25;
const FAST_STEP_FACTOR = 4;
/** In `'droppables'` mode a target's center must lie at least this far in the arrow's direction. */
const MIN_JUMP = 10;

/** Unit vector of each arrow. */
export const DIRECTIONS: Record<SensorDirection, Coordinates> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const ARROW_KEYS: Record<SensorDirection, string> = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
};

/** The key press a step stands for, when the sensor has none (monitors get a `KeyboardEvent`). */
export const arrowEvent = (direction: SensorDirection, fast: boolean): KeyboardEvent => {
  const key = ARROW_KEYS[direction];
  return new KeyboardEvent('keydown', { key, code: key, shiftKey: fast });
};

/**
 * `'droppables'` mode: the closest target whose center lies in the arrow's direction,
 * scored by the distance along the arrow plus twice the sideways offset, so targets
 * in line with the pointer win over closer ones off to the side.
 */
export const pickInDirection = (
  pointer: Coordinates,
  direction: Coordinates,
  candidates: ReadonlyArray<{ id: Key; rect: Rect }>,
): Key | null => {
  let best: Key | null = null;
  let bestScore = Infinity;
  for (const { id, rect } of candidates) {
    const center = getCenter(rect);
    const dx = center.x - pointer.x;
    const dy = center.y - pointer.y;
    const along = dx * direction.x + dy * direction.y;
    if (along < MIN_JUMP) continue;
    const score = along + 2 * Math.abs(dx * direction.y + dy * direction.x);
    if (score < bestScore) {
      bestScore = score;
      best = id;
    }
  }
  return best;
};

/** Center of the part of `rect` inside the viewport, so the hit test lands on it. */
const visibleCenter = (rect: Rect): Coordinates => getCenter(intersectRect(rect, getWindowRect()) ?? rect);

/** Next accepting drop target in `direction`, scrolled into view; `undefined` when there is none. */
const jumpToDroppable = (
  manager: DnDManager,
  current: Active,
  pointer: Coordinates,
  direction: Coordinates,
): Coordinates | undefined => {
  const overId = manager.over.value?.id;
  const candidates: Array<{ id: Key; rect: Rect }> = [];
  const elements = new Map<Key, HTMLElement>();
  for (const entry of manager.getDroppables()) {
    if (entry.id === overId || entry.isDisabled()) continue;
    const element = entry.getElement();
    if (!element?.isConnected || manager.isOwned(element, current)) continue;
    if (!entry.accepts(current)) continue;
    candidates.push({ id: entry.id, rect: getRect(element) });
    elements.set(entry.id, element);
  }
  const id = pickInDirection(pointer, direction, candidates);
  const element = id == null ? undefined : elements.get(id);
  if (!element) return undefined;
  revealElement(element);
  return visibleCenter(getRect(element));
};

/** The drag `current` is still the provider's running drag (a step may have awaited a render). */
const isRunning = (manager: DnDManager, current: Active) =>
  manager.status.value === 'dragging' && manager.active.value?.id === current.id;

/** Moves a keyboard drag to `next` at once: the next step reads `pointer` and `over`. */
const moveNow = (manager: DnDManager, next: Coordinates) => {
  manager.move(next);
  // The next key press reads `pointer` and `over`: don't leave them a frame behind.
  manager.flushFrame();
};

/** One arrow step of the running keyboard drag `current`. */
export const step = async (
  manager: DnDManager,
  current: Active,
  direction: Coordinates,
  event: KeyboardEvent,
  fast: boolean,
): Promise<void> => {
  const pointer = manager.pointer.value ?? getCenter(current.rect);
  let next: Coordinates | undefined;
  for (const monitor of [...manager.monitors]) {
    next = await monitor.getKeyboardCoordinates?.(event, { active: current, pointer, direction });
    if (next) break;
  }
  if (!isRunning(manager, current)) return;
  if (!next) {
    if (manager.getDraggable(current.id)?.getKeyboard?.() === 'droppables') {
      next = jumpToDroppable(manager, current, pointer, direction);
    } else {
      const keyboard = manager.props.keyboard || undefined;
      const size = (keyboard?.step ?? DEFAULT_STEP) * (fast ? FAST_STEP_FACTOR : 1);
      next = { x: pointer.x + direction.x * size, y: pointer.y + direction.y * size };
    }
  }
  if (next) moveNow(manager, next);
};

/** Puts the item of the running drag `current` at `position` (see `SensorDrag.place`). */
export const place = async (manager: DnDManager, current: Active, position: SortablePosition): Promise<boolean> => {
  let next: Coordinates | undefined;
  for (const monitor of [...manager.monitors]) {
    next = await monitor.placeAt?.(current, position);
    if (next) break;
  }
  if (!next || !isRunning(manager, current)) return false;
  moveNow(manager, next);
  return true;
};
