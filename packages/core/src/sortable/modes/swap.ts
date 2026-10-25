/**
 * Swapping (`behavior: 'swap'`): hovering an item exchanges it with the dragged one, each
 * taking the other's place, in one list or across two. A sorting session enters this mode
 * over a list that swaps as its origin does (`sort.over`), and holds it while it holds an
 * exchange (`modeOf`).
 */

import type { Coordinates, DnDEvent, Key, SortableDropEvent } from '../../types';
import { indexMap, lookup, type GroupContext, type Session } from '../context';
import type { ListEntry } from '../entry';
import { projectSwap } from '../projection';
import { blocksKey, passedKeys } from '../stability';
import { canSwap } from '../accept';
import { collect } from '../block';
import { syncManager } from '../landing';
import { bump } from '../flip';
import { moving, type SortableMode } from './mode';

/**
 * Restores the drafts to the drag start, then exchanges the active item with `partner`:
 * each takes the other's place, in one list or across two.
 */
const applySwap = (g: GroupContext, partner: Key | null, pointer: Coordinates | null) => {
  const { lists } = g;
  const current = g.session.value!;
  const previous = current.swap;
  for (const list of lists.values()) {
    const base = current.base.get(list.id);
    if (base && list.draft.value !== base) list.draft.value = base;
  }
  current.list = current.origin.list;
  const passed = new Set<Key>();
  if (previous != null) passed.add(previous);
  if (partner != null) {
    const own = lists.get(current.origin.list!)!;
    const other = [...lists.values()].find((list) => indexMap(g, current.base.get(list.id) ?? []).has(partner));
    if (other) {
      const a = [...current.base.get(own.id)!];
      const b = other === own ? a : [...current.base.get(other.id)!];
      const i = a.indexOf(current.activeKey);
      const j = b.indexOf(partner);
      a[i] = partner;
      b[j] = current.activeKey;
      own.draft.value = a;
      if (b !== a) other.draft.value = b;
      current.list = other.id;
      if (other === own) for (const key of passedKeys(a, i, j)) passed.add(key);
      passed.add(partner);
    }
  }
  current.swap = partner;
  current.hysteresis = pointer ? { keys: passed, list: null, at: pointer } : null;
  syncManager(g);
  bump(g);
  g.manager.announce('onDragOver');
};

/** The swap partner as the drop event tells it: it went to where the active item started. */
const partnerOf = (g: GroupContext, current: Session, partner: Key): SortableDropEvent['partner'] => ({
  key: partner,
  item: lookup(g, partner),
  from: { ...current.sources.get(partner)! },
  to: { list: current.origin.list!, index: current.origin.index },
});

/** The hovered item of `target` becomes the partner; hovering the partner reverts the exchange. */
const updateSwap = (g: GroupContext, current: Session, target: ListEntry, event: DnDEvent) => {
  const { partner, key } = projectSwap({
    strategy: target.strategy(),
    pointer: event.pointer,
    items: collect(g, target),
    activeKey: current.slot,
    partner: current.swap,
  });
  if (partner === undefined || blocksKey(current.hysteresis, key)) return false;
  // An item that can't take the active item's place makes no exchange: hovering it reverts one.
  const next = partner != null && !canSwap(g, current, target, partner) ? null : partner;
  if (next !== current.swap) applySwap(g, next, event.pointer);
  return false;
};

export const swap: SortableMode = {
  ...moving,
  name: 'swap',
  over: updateSwap,
  // Off the lists, or over a list that sorts: the exchange is undone.
  leave: (g) => applySwap(g, null, null),
  facts: (g, current) => ({ partner: partnerOf(g, current, current.swap!) }),
};

/** The mode `current` drops in: `swap` while it holds an exchange. */
export const modeOf = (current: Session): SortableMode => (current.swap != null ? swap : current.mode);
