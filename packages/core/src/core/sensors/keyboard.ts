import { defaultDocument, useEventListener } from '@vueuse/core';
import type { Active, Coordinates, Key, Rect } from '../../types';
import type { DnDManager } from '../manager';
import { getCenter, getRect, getWindowRect, intersectRect } from '../../animation/layout';
import { getEventTarget, isEditable } from '../../utils/dom';
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
const visibleCenter = (rect: Rect): Coordinates => getCenter(intersectRect(rect, getWindowRect()) ?? rect);

export function useKeyboardSensor(manager: DnDManager): void {
  const options = () => (manager.props.keyboard === false ? null : (manager.props.keyboard ?? {}));
  const keys = () => ({ ...DEFAULT_KEYS, ...options()?.keys });

  // Moves may await monitors (sortable resolves the next slot after a render), so key
  // presses are serialized: a quick "arrow, arrow, Space" moves twice and then drops.
  let queue: Promise<void> = Promise.resolve();
  let queued = 0;
  const enqueue = (task: () => unknown) => {
    queued++;
    queue = queue
      .then(async () => {
        await task();
      })
      .catch((error: unknown) => console.error(error))
      .finally(() => queued--);
  };

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
    if (!next) return;
    manager.move(next);
    // The next key press reads `pointer` and `over`: don't leave them a frame behind.
    manager.flushFrame();
  };

  /**
   * A key the drag acts on is consumed: nothing below the document sees it. UI kits
   * handle the same keys on their own elements (a list moving focus on arrows, an item
   * clicking itself on Enter/Space and stopping propagation, an overlay closing on
   * Escape); left to them, the press would act twice or never reach the drag.
   */
  const consume = (event: KeyboardEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Capture phase: runs before any handler on the focused element or its ancestors.
  useEventListener(defaultDocument, 'keydown', async (event: KeyboardEvent) => {
    const status = manager.status.value;
    const bindings = keys();

    // Escape cancels any drag, including pointer drags and pending activations.
    if ((status === 'dragging' || status === 'activating') && matches(bindings.cancel, event)) {
      consume(event);
      manager.cancel();
      return;
    }

    if (status === 'dragging') {
      const current = manager.active.value!;
      if (current.sensor !== 'keyboard') return;
      if (matches(bindings.drop, event)) {
        consume(event);
        if (!event.repeat) enqueue(() => void manager.drop());
        return;
      }
      const direction = DIRECTIONS.get(event.key) ?? DIRECTIONS.get(event.code);
      if (!direction) return;
      consume(event);
      // A held arrow repeats (pixel moves glide), but repeats don't pile up behind a
      // move that is still resolving. Separate presses are never dropped.
      if (event.repeat && queued > 0) return;
      enqueue(() => moveByKey(event, current, direction));
      return;
    }

    if (status !== 'idle' || !options() || event.repeat) return;
    if (!matches(bindings.start, event)) return;
    const target = getEventTarget(event);
    if (!(target instanceof Element) || isEditable(target)) return;
    const found = manager.findDraggable(target);
    if (!found || found.entry.isDisabled()) return;
    // Only the draggable itself (or its handle) starts a keyboard drag, never a button inside it.
    if (target !== found.entry.getFocusTarget()) return;
    if (found.entry.canDrag && !found.entry.canDrag(event)) return;
    if (manager.start(found.entry.id, getCenter(getRect(found.element)), 'keyboard')) consume(event);
  }, { capture: true });
}
