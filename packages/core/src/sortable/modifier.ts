import { effectScope, onScopeDispose, watch } from 'vue';
import { defaultDocument, defaultWindow } from '@vueuse/core';
import type { DnDManager } from '../core/manager';

/** Keys `getModifierState` knows; any other `copyModifier` is tracked by keydown/keyup. */
const MODIFIERS = new Set(['Alt', 'AltGraph', 'Control', 'Meta', 'Shift', 'CapsLock']);

interface Tracker {
  held: () => boolean;
  /** Sortable groups of the provider that read it. */
  users: number;
  stop: () => void;
}

/** One per provider, shared by its sortable groups. */
const trackers = new WeakMap<DnDManager, Tracker>();

function createTracker(manager: DnDManager): Tracker {
  let held = false;
  const name = () => (manager.props.copyModifier === undefined ? 'Alt' : manager.props.copyModifier);

  const set = (value: boolean) => {
    if (value === held) return;
    held = value;
    if (manager.status.value === 'dragging') manager.scheduleFrame();
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

  const onBlur = () => set(false);

  const listeners = [
    [defaultDocument, 'keydown', onKey, { capture: true }],
    [defaultDocument, 'keyup', onKey, { capture: true }],
    [defaultDocument, 'pointerdown', onPointer, { capture: true, passive: true }],
    [defaultDocument, 'pointermove', onPointer, { capture: true, passive: true }],
    [defaultWindow, 'blur', onBlur, {}],
  ] as Array<[EventTarget | undefined, string, EventListener, AddEventListenerOptions]>;

  let listening = false;
  const listen = (on: boolean) => {
    if (on === listening) return;
    listening = on;
    for (const [target, type, listener, options] of listeners) {
      if (on) target?.addEventListener(type, listener, options);
      else target?.removeEventListener(type, listener, options);
    }
    if (!on) held = false;
  };

  // Only while a press waits or a drag runs: idle pages don't pay for every pointer move.
  // Not `flush: 'sync'`: a drag starting after its activation passes through `idle` for a
  // moment, which would drop the state read while the press waited.
  const scope = effectScope(true);
  scope.run(() => watch(() => manager.status.value !== 'idle', listen, { immediate: true }));

  return {
    held: () => held && !!name(),
    users: 0,
    stop: () => {
      scope.stop();
      listen(false);
    },
  };
}

/**
 * Live state of the provider's `copyModifier` (default Alt), for a sortable group. Key
 * and pointer events both carry it, so a copy can toggle while the pointer stands still.
 * The provider's groups share one tracker, which listens only from a press (`activating`)
 * until the provider is idle again: a key held before that shows with the next pointer
 * move or key press, which carry it too. Call inside the group's effect scope: the last
 * group to go stops the tracker.
 */
export function useCopyModifier(manager: DnDManager): () => boolean {
  let tracker = trackers.get(manager);
  if (!tracker) trackers.set(manager, (tracker = createTracker(manager)));
  const current = tracker;
  current.users++;
  onScopeDispose(() => {
    if (--current.users) return;
    current.stop();
    if (trackers.get(manager) === current) trackers.delete(manager);
  });
  return current.held;
}
