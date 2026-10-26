/**
 * Driving a drag from the tab: the joystick's vector (the knob, or the arrow keys), sent
 * to the page as it changes (at most every `SEND_EVERY` ms, a release at once), and the
 * commands around it. Keyboard shortcuts work anywhere in the tab but in a field:
 * arrows or WASD steer (Shift: full tilt), Space or Enter drops, Escape cancels, G picks the
 * chosen item up, P picks on the page.
 */

import { computed, ref, watch } from 'vue';
import type { Key } from '../../src/protocol';
import { send, store } from './connection';

const SEND_EVERY = 30;
/** Tilt of the arrow keys; Shift pushes to the rim. */
const KEY_TILT = 0.55;

export const vector = ref({ x: 0, y: 0 });

/** The draggable chosen in the tab: the one the joystick picks up. */
export const chosen = computed(() => {
  const node = store.selected;
  return node?.kind === 'draggable' ? { provider: node.provider, id: node.id as Key } : null;
});

/** The provider's drag, if one runs. */
export const running = computed(() => store.providers.find((provider) => provider.session.status !== 'idle')?.session ?? null);

let sentAt = 0;
let timer: ReturnType<typeof setTimeout> | undefined;

const sendVector = () => {
  timer = undefined;
  sentAt = performance.now();
  const { x, y } = vector.value;
  send({ type: 'stick', x, y, ...(chosen.value ? { grab: chosen.value } : {}) });
};

watch(vector, ({ x, y }) => {
  clearTimeout(timer);
  const wait = SEND_EVERY - (performance.now() - sentAt);
  if ((x === 0 && y === 0) || wait <= 0) sendVector();
  else timer = setTimeout(sendVector, wait);
});

/** Picks the chosen item up, without moving it. */
export const grab = (): void => {
  if (chosen.value) send({ type: 'stick', x: 0, y: 0, grab: chosen.value });
};
export const drop = (): void => {
  vector.value = { x: 0, y: 0 };
  send({ type: 'drop' });
};
export const cancel = (): void => {
  vector.value = { x: 0, y: 0 };
  send({ type: 'cancel' });
};
export const togglePick = (): void => send({ type: 'pick', on: !store.picking });

const ARROWS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  KeyW: [0, -1],
  KeyS: [0, 1],
  KeyA: [-1, 0],
  KeyD: [1, 0],
};

const typing = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null;
  // Fields type, and buttons take their own Space and Enter.
  return !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|A|SUMMARY)$/.test(target.tagName));
};

/** The keyboard shortcuts, on the tab's window. */
export function useShortcuts(): void {
  const held = new Set<string>();
  let fast = false;
  const steer = () => {
    let x = 0;
    let y = 0;
    for (const code of held) {
      x += ARROWS[code]![0];
      y += ARROWS[code]![1];
    }
    const length = Math.hypot(x, y);
    const tilt = fast ? 1 : KEY_TILT;
    vector.value = length ? { x: (x / length) * tilt, y: (y / length) * tilt } : { x: 0, y: 0 };
  };

  addEventListener('keydown', (event) => {
    if (typing(event) || event.ctrlKey || event.metaKey || event.altKey) return;
    fast = event.shiftKey;
    if (ARROWS[event.code]) {
      event.preventDefault();
      if (!event.repeat) held.add(event.code);
      return steer();
    }
    if (event.repeat) return;
    const actions: Record<string, () => void> = { Space: drop, Enter: drop, Escape: cancel, KeyG: grab, KeyP: togglePick };
    const action = actions[event.code];
    if (!action) return;
    event.preventDefault();
    action();
  });
  addEventListener('keyup', (event) => {
    fast = event.shiftKey;
    if (held.delete(event.code) || event.key === 'Shift') steer();
  });
  // The window lost the keys' ups.
  addEventListener('blur', () => {
    held.clear();
    steer();
  });
}
