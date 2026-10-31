/**
 * Development only. While `onBeforeDrop` decides a drop, the provider takes no input
 * (rfcs/0001-v3.md §13): a new drag or a cancel asked for meanwhile does nothing. The
 * first one of each such drop says why: an `onBeforeDrop` whose promise never settles
 * would otherwise look like a provider that stopped working.
 */

import type { DnDManager } from './manager';

/** Per provider, the drag (`sessionId`) whose decision has been told about. */
const told = new WeakMap<DnDManager, number>();

/** `asked` did nothing: says why if a drop is being decided, once per drop. */
export const warnIfDeciding = (manager: DnDManager, asked: 'A new drag' | 'cancel()'): void => {
  const active = manager.active.value;
  if (manager.status.value !== 'dropping' || !active) return;
  const session = manager.sessionId();
  if (told.get(manager) === session) return;
  told.set(manager, session);
  console.warn(
    `[vue-dnd-kit] ${asked} does nothing while onBeforeDrop decides the drop of "${String(active.id)}": the provider takes no input until it answers. Make sure the promise it returns settles.`,
  );
};
