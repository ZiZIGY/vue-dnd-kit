import { defaultDocument, defaultWindow, useEventListener } from '@vueuse/core';
import type { DnDManager } from '../core/manager';

/** Keys `getModifierState` knows; any other `copyModifier` is tracked by keydown/keyup. */
const MODIFIERS = new Set(['Alt', 'AltGraph', 'Control', 'Meta', 'Shift', 'CapsLock']);

/**
 * Live state of the provider's `copyModifier` (default Alt). Key and pointer events
 * both carry it, so a copy can toggle while the pointer stands still.
 * Call inside an effect scope: the listeners go away with it.
 */
export function trackCopyModifier(manager: DnDManager, onChange: () => void): () => boolean {
  let held = false;
  const name = () => (manager.props.copyModifier === undefined ? 'Alt' : manager.props.copyModifier);

  const set = (value: boolean) => {
    if (value === held) return;
    held = value;
    if (manager.status.value === 'dragging') onChange();
  };

  const onKey = (event: KeyboardEvent) => {
    const key = name();
    if (!key) return;
    if (event.key === key) {
      // A lone Alt press would move focus to the browser menu on Windows.
      if (manager.status.value === 'dragging') event.preventDefault();
      set(event.type === 'keydown');
    } else if (MODIFIERS.has(key)) {
      set(event.getModifierState(key));
    }
  };

  const onPointer = (event: PointerEvent) => {
    const key = name();
    if (key && MODIFIERS.has(key)) set(event.getModifierState(key));
  };

  useEventListener(defaultDocument, 'keydown', onKey, { capture: true });
  useEventListener(defaultDocument, 'keyup', onKey, { capture: true });
  useEventListener(defaultDocument, 'pointerdown', onPointer, { capture: true, passive: true });
  useEventListener(defaultDocument, 'pointermove', onPointer, { capture: true, passive: true });
  useEventListener(defaultWindow, 'blur', () => set(false));

  return () => held && !!name();
}
