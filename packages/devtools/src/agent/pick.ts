/**
 * Picking on the page: the next press on a draggable selects it in the tab instead of
 * doing what it does (no drag starts, no button clicks). Meanwhile the draggable under
 * the pointer is highlighted. A press elsewhere, or Escape, ends it without a pick.
 */

import type { DevtoolsProvider } from '@vue-dnd-kit/core/devtools';
import type { NodeRef } from '../protocol';
import { highlight, unhighlight } from './highlight';
import { keyLabel } from './preview';

/** The draggables' elements are looked up again after this long (items mount and unmount). */
const FRESH_FOR = 500;
/** Events a pick swallows. */
const SWALLOWED = ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click', 'touchstart', 'dblclick', 'contextmenu'];

export interface Picker {
  readonly on: boolean;
  start(): void;
  stop(): void;
}

/** Picks a draggable of `providers`; `done` hears the pick (`null`: ended without one). */
export function createPicker(providers: () => DevtoolsProvider[], done: (node: NodeRef | null) => void): Picker {
  let on = false;
  let elements = new Map<Element, NodeRef & { kind: 'draggable' }>();
  let builtAt = 0;
  let style: HTMLStyleElement | null = null;

  const lookup = () => {
    if (performance.now() - builtAt < FRESH_FOR) return elements;
    elements = new Map();
    for (const provider of providers()) {
      for (const entry of provider.snapshot().draggables) {
        if (entry.element) elements.set(entry.element, { provider: provider.id, kind: 'draggable', id: entry.id });
      }
    }
    builtAt = performance.now();
    return elements;
  };

  /** The draggable the event happened on: the closest one along its path (shadow roots included). */
  const found = (event: Event) => {
    const known = lookup();
    for (const target of event.composedPath()) {
      const node = target instanceof Element ? known.get(target) : undefined;
      if (node) return { node, element: target as Element };
    }
    return null;
  };

  const onMove = (event: PointerEvent) => {
    const hit = found(event);
    if (hit) highlight(hit.element, `pick ${keyLabel(hit.node.id)}`, Infinity);
    else unhighlight();
  };

  const onPress = (event: Event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.type !== 'pointerdown' && event.type !== 'touchstart') return;
    const hit = found(event);
    stop();
    done(hit?.node ?? null);
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    stop();
    done(null);
  };

  function stop() {
    if (!on) return;
    on = false;
    window.removeEventListener('pointermove', onMove, true);
    window.removeEventListener('keydown', onKey, true);
    // The rest of the press (its up and click) is swallowed too.
    setTimeout(() => {
      if (on) return;
      for (const type of SWALLOWED) window.removeEventListener(type, onPress, true);
    }, 400);
    style?.remove();
    style = null;
    unhighlight();
  }

  return {
    get on() {
      return on;
    },
    start() {
      if (on) return;
      on = true;
      builtAt = 0;
      window.addEventListener('pointermove', onMove, true);
      window.addEventListener('keydown', onKey, true);
      for (const type of SWALLOWED) window.addEventListener(type, onPress, { capture: true, passive: false });
      style = document.createElement('style');
      style.textContent = '* { cursor: crosshair !important; }';
      document.head.appendChild(style);
    },
    stop,
  };
}
