import { defaultDocument, useEventListener } from '@vueuse/core';
import type { Active, Coordinates, Key, Rect } from '../../types';
import type { DnDManager } from '../manager';
import { getCenter, getRect, getWindowRect } from '../../animation/layout';
import { isEditable } from '../../utils/dom';
import { revealElement } from '../autoscroll';

const DEFAULT_KEYS = {
  start: ['Space', 'Enter'],
  drop: ['Space', 'Enter'],
  cancel: ['Escape'],
};

const DIRECTIONS = new Map<string, Coordinates>([
  ['ArrowUp', { x: 0, y: -1 }],
  ['ArrowDown', { x: 0, y: 1 }],
  ['ArrowLeft', { x: -1, y: 0 }],
  ['ArrowRight', { x: 1, y: 0 }],
]);

const DEFAULT_STEP = 25;
const FAST_STEP_FACTOR = 4;
/** In `'droppables'` mode a target's center must lie at least this far in the arrow's direction. */
const MIN_JUMP = 10;

/** Bindings match `event.code` ('Space', 'KeyW') or `event.key` ('Enter', 'w'). */
const matches = (bindings: readonly string[], event: KeyboardEvent): boolean =>
  bindings.includes(event.code) || bindings.includes(event.key);

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
const visibleCenter = (rect: Rect): Coordinates => {
  const view = getWindowRect();
  const left = Math.max(rect.left, view.left);
  const right = Math.min(rect.right, view.right);
  const top = Math.max(rect.top, view.top);
  const bottom = Math.min(rect.bottom, view.bottom);
  return left < right && top < bottom
    ? { x: (left + right) / 2, y: (top + bottom) / 2 }
    : getCenter(rect);
};

export function useKeyboardSensor(manager: DnDManager): void {
  const options = () => (manager.props.keyboard === false ? null : (manager.props.keyboard ?? {}));
  const keys = () => ({ ...DEFAULT_KEYS, ...options()?.keys });
  let moving = false;

  /** Next accepting drop target in `direction`, scrolled into view; `undefined` when there is none. */
  const jumpToDroppable = (
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
      if (!element?.isConnected || current.element.contains(element)) continue;
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

  const moveByKey = async (event: KeyboardEvent, current: Active, direction: Coordinates) => {
    const pointer = manager.pointer.value ?? getCenter(current.rect);
    let next: Coordinates | undefined;
    for (const monitor of [...manager.monitors]) {
      next = await monitor.getKeyboardCoordinates?.(event, { active: current, pointer, direction });
      if (next) break;
    }
    if (manager.status.value !== 'dragging' || manager.active.value?.id !== current.id) return;
    if (!next) {
      if (manager.getDraggable(current.id)?.keyboard === 'droppables') {
        next = jumpToDroppable(current, pointer, direction);
      } else {
        const step = (options()?.step ?? DEFAULT_STEP) * (event.shiftKey ? FAST_STEP_FACTOR : 1);
        next = { x: pointer.x + direction.x * step, y: pointer.y + direction.y * step };
      }
    }
    if (next) manager.move(next);
  };

  useEventListener(defaultDocument, 'keydown', async (event: KeyboardEvent) => {
    const status = manager.status.value;
    const bindings = keys();

    // Escape cancels any drag, including pointer drags and pending activations.
    if ((status === 'dragging' || status === 'activating') && matches(bindings.cancel, event)) {
      event.preventDefault();
      manager.cancel();
      return;
    }

    if (status === 'dragging') {
      const current = manager.active.value!;
      if (current.sensor !== 'keyboard') return;
      if (matches(bindings.drop, event)) {
        event.preventDefault();
        if (!event.repeat) void manager.drop();
        return;
      }
      const direction = DIRECTIONS.get(event.key) ?? DIRECTIONS.get(event.code);
      if (!direction) return;
      event.preventDefault();
      // Held arrows repeat (pixel moves glide); a move still resolving swallows them.
      if (moving) return;
      moving = true;
      try {
        await moveByKey(event, current, direction);
      } finally {
        moving = false;
      }
      return;
    }

    if (status !== 'idle' || !options() || event.repeat) return;
    if (!matches(bindings.start, event)) return;
    const target = event.composedPath()[0];
    if (!(target instanceof Element) || isEditable(target)) return;
    const found = manager.findDraggable(target);
    if (!found || found.entry.isDisabled()) return;
    // Only the draggable itself (or its handle) starts a keyboard drag, never a button inside it.
    if (target !== found.entry.getFocusTarget()) return;
    if (found.entry.canDrag && !found.entry.canDrag(event)) return;
    event.preventDefault();
    manager.start(found.entry.id, getCenter(getRect(found.element)), 'keyboard');
  });
}
