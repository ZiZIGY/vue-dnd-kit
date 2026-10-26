/**
 * The drop of a sortable session. It is computed once, as the new items of every list it
 * changes (`result`), and goes through `onBeforeDrop`, then `onDrop`, then the write
 * (the default action, which `preventDefault()` skips: the user applies `result`), then
 * the reset of the drafts. The FLIP pass of that reset animates whatever the sources hold
 * by then.
 */

import type { BeforeDropResult, DnDEndEvent, DnDEvent, Key, MaybePromise, SortableDropEvent, SortableIndicator } from '../types';
import { isForeign, keysOf, listOf, lookup, sameKeys, type GroupContext, type Session } from './context';
import type { ListEntry } from './entry';
import { partition } from './accept';
import { putBack, scatter } from './block';
import { setIndicator } from './indicator';
import { landDrop } from './landing';
import { bump } from './flip';
import { HYSTERESIS, distance } from './stability';
import { cancelText, endText } from './announcements';
import { settleBlock } from './session';
import { modeOf } from './modes/swap';
import { isFinal, toVerdict } from '../core/verdict';

export interface DropResult {
  next: Map<ListEntry, Key[]>;
  /** The new items of each list in `next` (`build`): the event's `result`, what the write puts. */
  built: Map<ListEntry, unknown[]>;
  /** Keys put at the slot of the target list (`event.to.list`). */
  inserted: Key[];
  event: SortableDropEvent;
}

/** A drop event before its list results are built. */
export type DropFacts = Omit<SortableDropEvent, 'result' | 'preventDefault' | 'defaultPrevented'>;

/** Bundlers replace it: development builds keep the warnings, production drops them. */
declare const process: { env: { NODE_ENV?: string } };

const isPromise = <T>(value: MaybePromise<T>): value is Promise<T> =>
  !!value && typeof (value as Promise<T>).then === 'function';

/** `keys` with `slot` moved (or inserted) to `index`, counted in `keys` as given. */
const placeAt = (keys: Key[], slot: Key, index: number): Key[] => {
  const position = keys.indexOf(slot);
  const result = position === -1 ? [...keys] : keys.filter((key) => key !== slot);
  const at = position !== -1 && position < index ? index - 1 : index;
  result.splice(Math.max(0, Math.min(at, result.length)), 0, slot);
  return result;
};

/**
 * Builds the new items of every list in `next` (what the write would put there) and
 * the drop event around them: its `result`, and `preventDefault()` for the session.
 */
const dropResult = (
  g: GroupContext,
  current: Session,
  next: Map<ListEntry, Key[]>,
  inserted: Key[],
  facts: DropFacts,
): DropResult => {
  const find = (key: Key) => lookup(g, key);
  const built = new Map<ListEntry, unknown[]>();
  for (const [list, keys] of next) built.set(list, list.build(keys, find, list.id === facts.to.list ? inserted : []));
  const event: SortableDropEvent = {
    ...facts,
    result: new Map([...built].map(([list, items]) => [list.id, items])),
    preventDefault: () => {
      current.prevented = true;
    },
    get defaultPrevented() {
      return current.prevented;
    },
  };
  return { next, built, inserted, event };
};

/**
 * The new order of every list that changes. `accepted` limits the moved keys
 * (partial accept); `marker` is the indicator to insert at (`placeholder: 'indicator'`).
 */
const computeResult = (
  g: GroupContext,
  accepted: ReadonlySet<Key> | null,
  marker: SortableIndicator | null,
): DropResult | null => {
  const { lists } = g;
  const current = g.session.value!;
  const slot = current.slot;
  const drafts = new Map<ListEntry, Key[]>();
  for (const list of lists.values()) drafts.set(list, keysOf(list));
  let target = listOf(g, current.list);
  if (marker) {
    const list = lists.get(marker.list);
    if (list) {
      if (target && target !== list) drafts.set(target, drafts.get(target)!.filter((key) => key !== slot));
      drafts.set(list, placeAt(drafts.get(list)!, slot, marker.index));
      target = list;
    }
  }
  if (!target) return null;

  const allowed = accepted ?? new Set(partition(g, target, current).accepted);
  const moved = current.keys.filter((key) => allowed.has(key));
  const rejected = current.keys.filter((key) => !allowed.has(key));
  const mode = modeOf(current);
  const moving = mode.moves;
  const insert = mode.inserted(g, current, moved);
  // Everything but the slot leaves its place: the rest of a block, and when moving every
  // dragged key (in 'gaps' mode and indicator lists they are still where they started).
  // The slot then makes room for what is inserted; rejected keys go back below.
  const strip = new Set(current.block);
  if (moving) for (const key of current.keys) strip.add(key);
  strip.delete(slot);
  const back = moving
    ? rejected
        .map((key) => ({ key, source: current.sources.get(key)! }))
        .sort((a, b) => a.source.index - b.source.index)
    : [];
  const settled = new Set(moved);

  const next = new Map<ListEntry, Key[]>();
  for (const [list, draft] of drafts) {
    let keys = draft.filter((key) => !strip.has(key));
    keys = list === target ? keys.flatMap((key) => (key === slot ? insert : [key])) : keys.filter((key) => key !== slot);
    // Rejected keys fly back to where they started: after their nearest original
    // predecessor that is still in the list and stays (other keys may have left it).
    for (const { key, source } of back) if (source.list === list.id) putBack(keys, list, key, source.index, settled);
    if (list.layout.hasChanges(keys, list === target ? insert : [], list.getKeys())) next.set(list, keys);
  }
  if (!next.size) return null;
  const finalKeys = next.get(target) ?? target.getKeys();
  return dropResult(g, current, next, insert, {
    keys: current.keys,
    items: current.keys.map((key) => lookup(g, mode.placed(current, key))),
    accepted: moved,
    rejected,
    from: { ...current.origin },
    to: { list: target.id, index: insert.length ? finalKeys.indexOf(insert[0]!) : -1 },
    sameList: current.origin.list === target.id,
    mode: mode.name,
    ...mode.facts?.(g, current),
  });
};

/**
 * Trash zones, `e.source.remove()` and `dropOutside: 'remove'`: the dragged items (those
 * accepted) leave their lists. The event goes to the list the drag started in.
 */
const computeRemoval = (g: GroupContext, accepted: readonly Key[]): DropResult | null => {
  const current = g.session.value!;
  if (!current.mode.moves || current.origin.list == null) return null;
  const gone = new Set(accepted);
  const next = new Map<ListEntry, Key[]>();
  for (const list of g.lists.values()) {
    const source = list.getKeys();
    const keys = source.filter((key) => !gone.has(key));
    if (list.layout.hasChanges(keys, [], source)) next.set(list, keys);
  }
  if (!next.size) return null;
  return dropResult(g, current, next, [], {
    keys: current.keys,
    items: current.keys.map((key) => lookup(g, key)),
    accepted: current.keys.filter((key) => gone.has(key)),
    rejected: current.keys.filter((key) => !gone.has(key)),
    from: { ...current.origin },
    to: { list: current.origin.list, index: -1 },
    sameList: true,
    mode: 'move',
  });
};

/**
 * The default action of a drop: every list it changes takes its new items. All or
 * none: a read-only source among them (one the user didn't take the drop for, with
 * `preventDefault()`) blocks the others too, or items would be lost or duplicated.
 */
const write = (g: GroupContext, result: DropResult) => {
  const blocked = [...result.next.keys()].filter((list) => list.isReadonly());
  if (blocked.length) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[vue-dnd-kit] A drop wasn't written: \`items\` is read-only (a getter, a readonly ref or a computed) in ${blocked.map((list) => `"${String(list.id)}"`).join(', ')}. Call \`event.preventDefault()\` in onBeforeDrop or onDrop and apply \`event.result\` yourself.`,
      );
    }
    return;
  }
  const find = (key: Key) => lookup(g, key);
  for (const [list, keys] of result.next) {
    list.commit(result.built.get(list)!, keys, find, list.id === result.event.to.list ? result.inserted : []);
  }
};

/** The session ends (drop, cancel, reject): the lists show their sources again. */
const reset = (g: GroupContext) => {
  const current = g.session.value;
  if (!current) return;
  scatter(g, current);
  for (const list of g.lists.values()) {
    list.draft.value = null;
    list.layout.reset();
  }
  g.session.value = null;
  setIndicator(g, null);
  bump(g);
};

const isOutside = (current: Session, event: DnDEvent) =>
  !event.over && !(current.target && distance(event.pointer, current.target.at) < HYSTERESIS);

/** The verdict of `onBeforeDrop`, the keys a partial accept took unless it named its own. */
const withPartial = (value: BeforeDropResult, partial: Key[] | undefined): BeforeDropResult => {
  const verdict = toVerdict(value);
  return isFinal(verdict) || Array.isArray(verdict) ? verdict : (partial ?? verdict);
};

/**
 * `onBeforeDrop` answered `'continue'`: the drop it was asked about won't happen. What it
 * prepared goes, and the session moves on; the next drop decides afresh.
 */
export const resume = (g: GroupContext) => {
  const current = g.session.value;
  if (!current) return;
  current.result = null;
  current.marker = null;
  current.removed = false;
};

const decide = (g: GroupContext, current: Session, event: DnDEvent): MaybePromise<BeforeDropResult> => {
  if (g.session.value !== current) return;
  // A refusing list cancels the drop in the manager; don't ask the user about it.
  if (event.over && !event.over.accepted) return;
  const outside = isOutside(current, event);
  const rule = outside ? listOf(g, current.list ?? current.origin.list)?.dropOutside() : undefined;
  if (rule === 'cancel') return false;
  let result: DropResult | null;
  if (rule === 'remove') {
    // The list the items leave is asked, as for any drop of its own.
    current.removed = true;
    result = computeRemoval(g, current.keys);
  } else {
    current.marker = g.indicator.value ?? (outside ? current.indicator : null);
    result = computeResult(g, null, current.marker);
  }
  current.result = result;
  if (!result) return;
  const partial = result.event.rejected.length ? result.event.accepted : undefined;
  const verdict = g.lists.get(result.event.to.list)?.beforeDrop?.(result.event);
  return isPromise(verdict) ? verdict.then((value) => withPartial(value, partial)) : withPartial(verdict, partial);
};

export const beforeDrop = (g: GroupContext, event: DnDEvent): MaybePromise<BeforeDropResult> => {
  const current = g.session.value;
  if (!current || current.activeKey !== event.active.id || isForeign(g, event)) return;
  // The last move may still be lining the block up with the overlay.
  return g.following ? settleBlock(g).then(() => decide(g, current, event)) : decide(g, current, event);
};

export const end = (g: GroupContext, event: DnDEndEvent) => {
  const current = g.session.value;
  if (!current || current.activeKey !== event.active.id) return;
  let result: DropResult | null = null;
  // The result `onBeforeDrop` saw holds unless it accepted fewer keys.
  const kept = new Set(event.accepted);
  const prepared = current.result;
  const unchanged = !!prepared && sameKeys(prepared.event.accepted, current.keys.filter((key) => kept.has(key)));
  if (current.removed) {
    result = unchanged ? prepared : computeRemoval(g, event.accepted);
  } else if (!isForeign(g, event)) {
    result = unchanged ? prepared : computeResult(g, kept, current.marker);
  }
  if (result) {
    // `onDrop` comes first: the sources still hold the old order, `result` the new one.
    try {
      g.lists.get(result.event.to.list)?.afterDrop?.(result.event);
    } catch (error) {
      console.error(error);
    }
    if (!current.prevented) write(g, result);
  }
  // The drop as it was made, for the devtools: they read it as the session ends.
  current.result = result;
  landDrop(g, current, result);
  g.announced = { key: current.activeKey, text: endText(g, current, event, result) };
  reset(g);
};

export const cancel = (g: GroupContext, event: DnDEvent) => {
  const current = g.session.value;
  if (current && current.activeKey === event.active.id) {
    // Copies vanish (`copy.cancel`). Moved block members stay placeholders until the overlay is home.
    current.mode.cancel?.(g, current);
    if (current.origin.list != null) g.announced = { key: current.activeKey, text: cancelText(g, current) };
  }
  reset(g);
};
