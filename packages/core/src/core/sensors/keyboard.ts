import { defaultDocument, useEventListener } from '@vueuse/core';
import type { Coordinates } from '../../types';
import type { DnDManager } from '../manager';
import { getCenter, getRect } from '../../animation/layout';
import { isEditable } from '../../utils/dom';

const DEFAULT_KEYS = {
  start: ['Space', 'Enter'],
  drop: ['Space', 'Enter'],
  cancel: ['Escape'],
};

const DIRECTIONS: Record<string, Coordinates> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const DEFAULT_STEP = 25;

export function useKeyboardSensor(manager: DnDManager): void {
  const options = () => (manager.props.keyboard === false ? null : manager.props.keyboard ?? {});
  const keys = () => ({ ...DEFAULT_KEYS, ...options()?.keys });

  useEventListener(defaultDocument, 'keydown', async (event: KeyboardEvent) => {
    const status = manager.status.value;
    const bindings = keys();

    if (status === 'dragging') {
      const current = manager.active.value!;
      // Escape cancels any drag, including pointer drags.
      if (bindings.cancel.includes(event.code)) {
        event.preventDefault();
        manager.cancel();
        return;
      }
      if (current.sensor !== 'keyboard' || event.repeat) return;
      if (bindings.drop.includes(event.code)) {
        event.preventDefault();
        void manager.drop();
        return;
      }
      const direction = DIRECTIONS[event.code];
      if (!direction) return;
      event.preventDefault();
      const pointer = manager.pointer.value ?? getCenter(current.rect);
      let next: Coordinates | undefined;
      for (const monitor of [...manager.monitors]) {
        next = await monitor.getKeyboardCoordinates?.(event, { active: current, pointer, direction });
        if (next) break;
      }
      if (manager.status.value !== 'dragging') return;
      const step = (options()?.step ?? DEFAULT_STEP) * (event.shiftKey ? 4 : 1);
      manager.move(next ?? { x: pointer.x + direction.x * step, y: pointer.y + direction.y * step });
      return;
    }

    if (status !== 'idle' || !options() || event.repeat) return;
    if (!bindings.start.includes(event.code)) return;
    const target = event.target;
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
