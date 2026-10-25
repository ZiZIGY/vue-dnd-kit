/**
 * Copying (`pull: 'clone'`, the copy modifier): the dragged items stay where they are,
 * their copies travel and land. The modifier switches a drag between moving and copying
 * at any time (`syncCopy`).
 */

import type { Key } from '../../types';
import { keysOf, listOf, lookup, type GroupContext, type Session } from '../context';
import type { ListEntry } from '../entry';
import type { DraftContext } from '../layout';
import { partitionMoved } from '../accept';
import { blockFor, withoutBlock } from '../block';
import { setLandings, syncManager } from '../landing';
import { bump } from '../flip';
import type { SortableMode } from './mode';
import { sort, sortOver } from './sort';

/** The copy of dragged `key`, made once per session so its key stays stable; `null` when `clone` refused. */
const copyOf = (g: GroupContext, current: Session, key: Key): Key | null => {
  if (!current.copies.has(key)) {
    const made = listOf(g, current.sources.get(key)?.list ?? null)?.clone?.(lookup(g, key));
    current.copies.set(key, made ? made.key : null);
    if (made) current.items.set(made.key, made.item);
  }
  return current.copies.get(key) ?? null;
};

const wantsCopy = (g: GroupContext, current: Session) => {
  const origin = listOf(g, current.origin.list);
  if (!origin?.clone) return false;
  return origin.pull() === 'clone' || g.copyHeld();
};

/** What `prepareDraft` is told about `current`. */
export const draftContext = (current: Session): DraftContext => ({
  lead: current.lead,
  keys: current.keys,
  copying: current.mode === copy,
});

/** Drafts while copying: every source as it is (nothing leaves). */
const copyBase = (list: ListEntry, current: Session) => {
  const draft = [...list.getKeys()];
  return list.layout.prepareDraft(draft, draftContext(current));
};

/** The drag starts copying when its list copies or the modifier is held; `false` when it moves. */
export const startCopy = (g: GroupContext, current: Session): boolean => {
  const slot = wantsCopy(g, current) ? copyOf(g, current, current.lead) : null;
  if (slot == null) return false;
  // Copying: the source stays as it is; the copy appears once a list is hovered.
  current.mode = copy;
  current.slot = slot;
  current.list = null;
  current.block = blockFor(g, current, undefined);
  for (const list of g.lists.values()) list.draft.value = copyBase(list, current);
  return true;
};

/**
 * Switches between moving and copying mid-drag (copy modifier pressed or released).
 * The new slot (and block) takes the old one's place: after the nearest key that stays put.
 */
const switchCopy = (g: GroupContext, copying: boolean) => {
  const current = g.session.value!;
  const slot = copying ? copyOf(g, current, current.lead) : current.lead;
  if (slot == null) return;
  const from = listOf(g, current.list);
  // Keys before the block that stay put, nearest first.
  let anchor: { list: ListEntry; after: Key[] } | null = null;
  if (from) {
    const keys = keysOf(from);
    const after = keys
      .slice(0, Math.max(keys.indexOf(current.block[0]!), 0))
      .reverse()
      .filter((key) => key !== current.lead && !current.others.has(key));
    anchor = { list: from, after };
  }
  current.mode = copying ? copy : sort;
  current.slot = slot;
  current.swap = null;
  current.hysteresis = null;
  current.block = blockFor(g, current, anchor?.list ?? (copying ? undefined : listOf(g, current.origin.list)));
  const moving = new Set(current.block);
  for (const list of g.lists.values()) {
    let draft: Key[];
    if (copying) draft = copyBase(list, current);
    else if (!anchor) draft = current.base.get(list.id) ?? [...list.getKeys()];
    else {
      // A block's keys leave their sources; the ones the list doesn't take stay there.
      draft = withoutBlock(current, list, moving);
      // Moving again: a tree hides the subtrees that travel.
      draft = list.layout.prepareDraft(draft, draftContext(current));
    }
    list.draft.value = draft;
  }
  if (anchor) {
    const keys = [...keysOf(anchor.list)];
    // The nearest of them still shown (a tree hides the rows inside the moving nodes).
    const present = new Set(keys);
    const after = anchor.after.find((key) => present.has(key));
    const at = after === undefined ? 0 : keys.indexOf(after) + 1;
    keys.splice(at, 0, ...current.block);
    anchor.list.draft.value = keys;
    current.list = anchor.list.id;
  } else {
    current.list = copying ? null : current.origin.list;
  }
  syncManager(g);
  bump(g);
};

/** Follows the copy modifier (and `pull: 'clone'`): a drag of the items of a list that can copy them. */
export const syncCopy = (g: GroupContext, current: Session) => {
  const wanted = wantsCopy(g, current);
  if (wanted !== (current.mode === copy)) switchCopy(g, wanted);
};

export const copy: SortableMode = {
  name: 'copy',
  moves: false,
  dragMode: () => 'copy',
  partition: partitionMoved,
  over: sortOver,
  inserted: (g, current, keys) => keys.map((key) => copyOf(g, current, key)).filter((key): key is Key => key != null),
  placed: (current, key) => current.copies.get(key) ?? key,
  original: (current, key) => {
    for (const [original, made] of current.copies) if (made === key) return original;
    return key;
  },
  // Copies vanish: their clones fly back to the originals.
  cancel: (g) => setLandings(g, []),
};

