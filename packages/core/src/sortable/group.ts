/**
 * A sortable group: lists that exchange items. Holds the draft order of every list
 * during a drag, projects the pointer onto it, commits the result on drop, and runs
 * FLIP for every change it causes.
 *
 * A drop is computed once, as the new items of every list it changes (`result`), and
 * goes through `onBeforeDrop`, then `onDrop`, then the write (the default action, which
 * `preventDefault()` skips: the user applies `result`), then the reset of the drafts.
 * The FLIP pass of that reset animates whatever the sources hold by then.
 *
 * The active slot is a key in the drafts. Usually it is the active item itself; when
 * copying it is the item's copy, and for a plain draggable from outside it is the
 * item `createItem` made. Projection, commit and FLIP only ever deal with that key.
 *
 * Multi-drag `'group'`: the other dragged items travel with the slot as a block,
 * contiguous in the draft and in drop order. Projection and keyboard moves count the
 * block once (`viewOf`), and every move takes the whole block along.
 */

import { effectScope, nextTick, type ShallowRef } from 'vue';
import type {
  Active,
  Announcements,
  BeforeDropResult,
  Coordinates,
  DnDEndEvent,
  DnDEvent,
  Key,
  KeyboardMoveContext,
  MaybePromise,
  Rect,
  SortableDropEvent,
  SortableIndicator,
} from '../types';
import type { DnDManager } from '../core/manager';
import {
  createRect,
  getCenter,
  getLayoutRect,
} from '../animation/layout';
import {
  createContext,
  indexOf as indexIn,
  keysOf,
  listOf as listIn,
  listOfKey as listOfKeyIn,
  lookup as lookupIn,
  orderedLists as orderedIn,
  sameKeys,
  spotIn as spotInCtx,
  type Session,
  type SessionStart,
} from './context';
import type { ListEntry } from './entry';
import { bump as bumpFlip, captureLayout, watchLayout } from './flip';
import {
  nextRowIndex,
  pickAdjacent,
  projectIndex,
} from './projection';
import {
  HYSTERESIS,
  blocksList,
  distance,
  settleHysteresis,
} from './stability';
import { collect, gather, pickUp, putBack, scatter, viewOf } from './block';
import { keepSlotHome, moveActive, returnToOrigin } from './slot';
import { indicateAt, setIndicator, showIndicator, updateIndicator } from './indicator';
import { leadOffset, setLandings as setLandingsIn, syncManager as syncManagerIn } from './landing';
import { trackCopyModifier } from './modifier';
import { sort } from './modes/sort';
import { modeOf } from './modes/swap';
import { copy, startCopy, syncCopy } from './modes/copy';
import { insert, startInsert } from './modes/insert';
import { revealElement } from '../core/autoscroll';
import { isFocusLost } from '../utils/dom';
import { sortableTexts, type SortableSpot, type SortableSubject } from './announcements';
import { intoPoint as intoPointIn, isInto as isIntoIn, targetRule } from './combine';
import {
  accepts as acceptsIn,
  isInert,
  partition as partitionIn,
} from './accept';

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

export interface SortableGroup {
  name: string;
  manager: DnDManager;
  session: ShallowRef<Session | null>;
  /** Insertion line of `placeholder: 'indicator'` lists, while the pointer is over one. */
  indicator: ShallowRef<SortableIndicator | null>;
  /** Shows the insertion line (trees move it with their own keys). */
  showIndicator(value: SortableIndicator | null): void;
  addList(entry: ListEntry): () => void;
  registerItem(key: Key, getElement: () => HTMLElement | null): () => void;
  lookup(key: Key): unknown;
  keysOf(list: ListEntry): Key[];
  /** `list`'s draft as projection counts it: a multi-drag block once, as the slot. */
  viewOf(list: ListEntry): Key[];
  indexOf(list: ListEntry, key: Key): number;
  accepts(list: ListEntry, active: Active): boolean;
  /** The current drag can never enter this list (another group, or a plain draggable it can't create items for). */
  isInert(list: ListEntry): boolean;
  /** Where the lead's clone sits in the overlay, from the pointer (see `leadOffset`). */
  leadOffset(): Coordinates;
  captureLayout(): void;
}

/** Bundlers replace it: development builds keep the warnings, production drops them. */
declare const process: { env: { NODE_ENV?: string } };

const registries = new WeakMap<DnDManager, Map<string, SortableGroup>>();

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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function createGroup(manager: DnDManager, name: string, release: () => void): SortableGroup {
  const g = createContext(manager, name);
  const { lists, items, session, indicator } = g;
  const scope = effectScope(true);

  const listOf = (id: Key | null) => listIn(g, id);
  const spotIn = (list: Key, index: number) => spotInCtx(g, list, index);
  const indexOf = (list: ListEntry, key: Key) => indexIn(g, list, key);
  const lookup = (key: Key) => lookupIn(g, key);
  const listOfKey = (key: Key, useDraft: boolean) => listOfKeyIn(g, key, useDraft);
  const orderedLists = () => orderedIn(g);
  const bump = () => bumpFlip(g);
  const partition = (list: ListEntry, current: Session) => partitionIn(g, list, current);
  const accepts = (list: ListEntry, active: Active) => acceptsIn(g, list, active);
  const isInto = (event: DnDEvent) => isIntoIn(g, event);
  const intoPoint = (key: Key, list: ListEntry, active: Active) => intoPointIn(g, key, list, active);
  const setLandings = (entries: Array<[Key, Key]>) => setLandingsIn(g, entries);
  const syncManager = () => syncManagerIn(g);

  scope.run(() => {
    watchLayout(g);
    g.copyHeld = trackCopyModifier(manager, () => manager.scheduleFrame());
  });

  // ─── Session ─────────────────────────────────────────────────────────────────

  const start = (event: DnDEvent) => {
    const activeKey = event.active.id;
    // Drags that don't involve this group leave it untouched (no snapshot of its lists).
    if (!listOfKey(activeKey, false) && ![...lists.values()].some((list) => list.create)) return;
    const ordered = orderedLists();
    const snapshot = new Map<Key, unknown>();
    const sources = new Map<Key, { list: Key; index: number }>();
    for (const list of ordered) {
      list.getKeys().forEach((key, index) => {
        snapshot.set(key, list.getItem(key));
        sources.set(key, { list: list.id, index });
      });
    }
    const common: SessionStart = {
      activeKey,
      lock: null,
      items: snapshot,
      size: { width: event.active.rect.width, height: event.active.rect.height },
      result: null,
      sources,
      copies: new Map<Key, Key | null>(),
      created: new Map<Key, Key | null>(),
      swap: null,
      indicator: null,
      marker: null,
      hysteresis: null,
      target: null,
      removed: false,
      prevented: false,
      stop: null,
    };

    if (!sources.has(activeKey)) {
      // A plain draggable: only lists with `createItem` take part.
      if (!ordered.some((list) => list.create)) return;
      g.spokenSpot = null;
      g.columnList = null;
      session.value = startInsert(g, common);
      syncManager();
      bump();
      return;
    }

    const { origin, ...picked } = pickUp(g, event, ordered, sources, snapshot);
    const { keys, grouped, base } = picked;
    const current: Session = {
      ...common,
      ...picked,
      origin: { list: origin.list, index: origin.index },
      slot: picked.lead,
      list: origin.list,
      mode: sort,
    };
    session.value = current;
    g.columnList = null;
    // The pickup announcement names this position: the first target of the drag doesn't repeat it.
    const formed = base.get(origin.list)!;
    g.spokenSpot = grouped
      ? spotKey({ list: origin.list, index: formed.indexOf(keys[0]!), length: formed.length })
      : spotKey(spotIn(origin.list, origin.index));

    if (!startCopy(g, current)) {
      gather(g, current, event);
      for (const list of lists.values()) list.draft.value = base.get(list.id)!;
    }
    syncManager();
    bump();
  };

  // ─── Move ────────────────────────────────────────────────────────────────────

  /** The drag enters `target`: its slot there (an external draggable takes the item `target` makes); `false` when it has none. */
  const enter = (current: Session, target: ListEntry): boolean => current.mode.enter?.(g, current, target) ?? true;

  /** The pointer is over no list of this group (or one that refuses the drag). */
  const leave = (current: Session) => {
    setIndicator(g, null);
    modeOf(current).leave?.(g, current);
  };

  /** Extension hook: runs on every move over a valid target, guarded or not (trees update depth here). */
  const afterMove = (current: Session, event: DnDEvent) => {
    listOf(current.list)?.afterMove?.(event);
  };

  /**
   * A block that moved can leave the pointer over one of its members (items of other
   * sizes passed, the end of a list): project again once it has rendered, as the pointer
   * may not move again (WebKit delivers a whole glide within a frame or two, and a
   * release right after it runs the last frame inside the drop). Each pass steps toward
   * the pointer, so it ends within a pass per member.
   */
  const followBlock = (current: Session, event: DnDEvent) => {
    if (current.block.length < 2 || g.followed++ > current.block.length) return;
    const pass: Promise<void> = nextTick(() => {
      if (g.following === pass) g.following = null;
      if (session.value === current && manager.status.value !== 'idle' && manager.pointer.value === event.pointer) {
        move(event);
      }
    });
    g.following = pass;
  };

  /** Resolves once no `followBlock` pass is pending. */
  const settleBlock = async () => {
    while (g.following) await g.following;
  };

  const move = (event: DnDEvent) => {
    const current = session.value;
    if (!current || current.activeKey !== event.active.id) return;
    if (event.pointer !== g.movedAt) {
      g.movedAt = event.pointer;
      g.followed = 0;
    }
    // Keyboard drags move the slot in getKeyboardCoordinates. Trees (`project`) answer
    // the keyboard themselves and keep the pointer path below (in indicator mode they
    // move the line themselves), and so does an external item outside the lists: its
    // own keyboard moves (pixels, droppables) may take it in.
    if (event.active.sensor === 'keyboard' && (current.mode !== insert || current.list != null || indicator.value)) {
      const list = current.list == null ? undefined : lists.get(current.list);
      if (!list?.project || list.placeholder() === 'indicator' || indicator.value) return afterMove(current, event);
    }
    syncCopy(g, current);
    // No frame is ever skipped: the target follows pointer movement only, so a skipped
    // frame that carried the final position would leave the slot stale until the
    // pointer moves again (WebKit delivers a whole glide within a frame or two). The
    // frame after a cross-list move is safe without a guard: the FLIP pass invalidates
    // measurements post-flush, and the manager's target stabilizer plus the list
    // hysteresis below keep a layout shift from bouncing the item back.
    current.hysteresis = settleHysteresis(current.hysteresis, event.pointer);

    const over = event.over;
    if (!over) {
      // Last valid target: a pointer a few pixels past a list boundary keeps it.
      if (current.target && distance(event.pointer, current.target.at) < HYSTERESIS) return afterMove(current, event);
      current.target = null;
      return leave(current);
    }
    const target = lists.get(over.id);
    if (!target || !over.accepted || target.isDisabled()) {
      current.target = null;
      return leave(current);
    }
    // The list the slot just left can't take it back until the pointer moves on.
    const blocked = target.id !== current.list && blocksList(current.hysteresis, target.id);
    // Lists with `project` (trees) keep projecting while blocked: depth changes without a reorder.
    if (blocked && !target.project) return afterMove(current, event);
    if (!blocked) current.target = { list: target.id, at: event.pointer };

    // Each list makes its own item for an external draggable.
    if (!blocked && !enter(current, target)) return leave(current);

    if (target.placeholder() === 'indicator') {
      updateIndicator(g, target, event);
      return afterMove(current, event);
    }
    setIndicator(g, null);
    if (current.mode.over(g, current, target, event, blocked)) followBlock(current, event);
    afterMove(current, event);
  };

  // ─── Drop ────────────────────────────────────────────────────────────────────

  /**
   * Builds the new items of every list in `next` (what the write would put there) and
   * the drop event around them: its `result`, and `preventDefault()` for the session.
   */
  const dropResult = (current: Session, next: Map<ListEntry, Key[]>, inserted: Key[], facts: DropFacts): DropResult => {
    const built = new Map<ListEntry, unknown[]>();
    for (const [list, keys] of next) built.set(list, list.build(keys, lookup, list.id === facts.to.list ? inserted : []));
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
    accepted: ReadonlySet<Key> | null,
    marker: SortableIndicator | null,
  ): DropResult | null => {
    const current = session.value!;
    const slot = current.slot;
    const drafts = new Map<ListEntry, Key[]>();
    for (const list of lists.values()) drafts.set(list, keysOf(list));
    let target = listOf(current.list);
    if (marker) {
      const list = lists.get(marker.list);
      if (list) {
        if (target && target !== list) drafts.set(target, drafts.get(target)!.filter((key) => key !== slot));
        drafts.set(list, placeAt(drafts.get(list)!, slot, marker.index));
        target = list;
      }
    }
    if (!target) return null;

    const allowed = accepted ?? new Set(partition(target, current).accepted);
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
      const changed = list.hasChanges
        ? list.hasChanges(keys, list === target ? insert : [])
        : !sameKeys(keys, list.getKeys());
      if (changed) next.set(list, keys);
    }
    if (!next.size) return null;
    const finalKeys = next.get(target) ?? target.getKeys();
    return dropResult(current, next, insert, {
      keys: current.keys,
      items: current.keys.map((key) => lookup(mode.placed(current, key))),
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
  const computeRemoval = (accepted: readonly Key[]): DropResult | null => {
    const current = session.value!;
    if (!modeOf(current).moves || current.origin.list == null) return null;
    const gone = new Set(accepted);
    const next = new Map<ListEntry, Key[]>();
    for (const list of lists.values()) {
      const source = list.getKeys();
      const keys = source.filter((key) => !gone.has(key));
      if (list.hasChanges ? list.hasChanges(keys, []) : keys.length !== source.length) next.set(list, keys);
    }
    if (!next.size) return null;
    return dropResult(current, next, [], {
      keys: current.keys,
      items: current.keys.map(lookup),
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
  const write = (result: DropResult) => {
    const blocked = [...result.next.keys()].filter((list) => list.isReadonly());
    if (blocked.length) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[vue-dnd-kit] A drop wasn't written: \`items\` is read-only (a getter, a readonly ref or a computed) in ${blocked.map((list) => `"${String(list.id)}"`).join(', ')}. Call \`event.preventDefault()\` in onBeforeDrop or onDrop and apply \`event.result\` yourself.`,
        );
      }
      return;
    }
    for (const [list, keys] of result.next) {
      list.commit(result.built.get(list)!, keys, lookup, list.id === result.event.to.list ? result.inserted : []);
    }
  };

  const reset = () => {
    const current = session.value;
    if (!current) return;
    scatter(g, current);
    for (const list of lists.values()) {
      list.draft.value = null;
      list.reset?.();
    }
    session.value = null;
    setIndicator(g, null);
    bump();
  };

  const isForeign = (event: DnDEvent) => !!event.over && !lists.has(event.over.id);

  const isOutside = (current: Session, event: DnDEvent) =>
    !event.over && !(current.target && distance(event.pointer, current.target.at) < HYSTERESIS);

  const combine = (verdict: BeforeDropResult, partial: Key[] | undefined): BeforeDropResult =>
    verdict === false ? false : Array.isArray(verdict) ? verdict : (partial ?? verdict);

  const beforeDrop = (event: DnDEvent): MaybePromise<BeforeDropResult> => {
    const current = session.value;
    if (!current || current.activeKey !== event.active.id || isForeign(event)) return;
    // The last move may still be lining the block up with the overlay.
    return g.following ? settleBlock().then(() => decide(current, event)) : decide(current, event);
  };

  const decide = (current: Session, event: DnDEvent): MaybePromise<BeforeDropResult> => {
    if (session.value !== current) return;
    // A refusing list cancels the drop in the manager; don't ask the user about it.
    if (event.over && !event.over.accepted) return;
    const outside = isOutside(current, event);
    const rule = outside ? listOf(current.list ?? current.origin.list)?.dropOutside() : undefined;
    if (rule === 'cancel') return false;
    let result: DropResult | null;
    if (rule === 'remove') {
      // The list the items leave is asked, as for any drop of its own.
      current.removed = true;
      result = computeRemoval(current.keys);
    } else {
      current.marker = indicator.value ?? (outside ? current.indicator : null);
      result = computeResult(null, current.marker);
    }
    current.result = result;
    if (!result) return;
    const partial = result.event.rejected.length ? result.event.accepted : undefined;
    const verdict = lists.get(result.event.to.list)?.beforeDrop?.(result.event);
    return isPromise(verdict) ? verdict.then((value) => combine(value, partial)) : combine(verdict, partial);
  };

  // What moves: the lead, which carries the active node when that rides in it.
  const subjectOf = (current: Session): SortableSubject => ({
    key: current.lead,
    count: current.keys.length,
    copy: current.mode === copy,
  });

  const end = (event: DnDEndEvent) => {
    const current = session.value;
    if (!current || current.activeKey !== event.active.id) return;
    let result: DropResult | null = null;
    // The result `onBeforeDrop` saw holds unless it accepted fewer keys.
    const kept = new Set(event.accepted);
    const prepared = current.result;
    const unchanged = !!prepared && sameKeys(prepared.event.accepted, current.keys.filter((key) => kept.has(key)));
    if (current.removed) {
      result = unchanged ? prepared : computeRemoval(event.accepted);
    } else if (!isForeign(event)) {
      result = unchanged ? prepared : computeResult(kept, current.marker);
    }
    if (result) {
      // `onDrop` comes first: the sources still hold the old order, `result` the new one.
      try {
        lists.get(result.event.to.list)?.afterDrop?.(result.event);
      } catch (error) {
        console.error(error);
      }
      if (!current.prevented) write(result);
    }
    // Where the overlay's clones land: the accepted items on their slots (copies when
    // copying); the rest on their own elements, back where they started. The active item
    // goes with its lead.
    const accepted = result && !current.removed ? result.event.accepted : [];
    if (result && !accepted.includes(current.lead)) manager.landingKey.value = null;
    setLandings(
      accepted
        .filter((key) => key !== current.activeKey)
        .map((key) => [modeOf(current).placed(current, key), key]),
    );

    const who = subjectOf(current);
    let text: string | undefined;
    if (isInto(event)) {
      text = sortableTexts.into(who, event.over!.id);
    } else if (current.removed) {
      if (result) text = sortableTexts.removed(who, result.event.to.list);
    } else if (result && result.event.to.index >= 0) {
      const list = lists.get(result.event.to.list);
      // The committed keys: a `defineModel` ref only shows the new array after the parent re-renders.
      const committed = list ? (result.next.get(list) ?? list.getKeys()) : [];
      // A swap changes no list's length.
      const partner = result.event.partner;
      text = sortableTexts.end(
        who,
        { list: result.event.to.list, index: result.event.to.index, length: committed.length },
        partner && { key: partner.key, spot: spotIn(partner.to.list, partner.to.index) },
      );
    } else if (!result && !isForeign(event) && modeOf(current).moves && current.origin.list != null) {
      text = sortableTexts.end(who, spotIn(current.origin.list, current.origin.index));
    }
    g.announced = { key: current.activeKey, text };
    reset();
  };

  const cancel = (event: DnDEvent) => {
    const current = session.value;
    // Copies vanish (`copy.cancel`). Moved block members stay placeholders until the overlay is home.
    if (current && current.activeKey === event.active.id) modeOf(current).cancel?.(g, current);
    if (current && current.activeKey === event.active.id && current.origin.list != null) {
      g.announced = {
        key: current.activeKey,
        text: sortableTexts.cancel(subjectOf(current), spotIn(current.origin.list, current.origin.index)),
      };
    }
    reset();
  };

  // ─── Keyboard ────────────────────────────────────────────────────────────────

  /** Insertion index in `target` for the slot coming from `from` (cross-list keyboard moves). */
  const insertionIndex = (target: ListEntry, from: Rect, current: Session): number => {
    const keys = keysOf(target);
    const element = target.getElement();
    const center = getCenter(from);
    const strategy = target.strategy();
    if (strategy !== 'grid') {
      // Before the first item whose center is level with or past the slot's (rows that line up tie).
      const axis = strategy === 'vertical' ? 'y' : 'x';
      const next = collect(g, target).find((item) => getCenter(item.rect)[axis] >= center[axis] - 1);
      return next ? next.index : keys.length;
    }
    let pointer = center;
    if (element) {
      const box = getLayoutRect(element);
      pointer = { x: clamp(center.x, box.left + 1, box.right - 1), y: clamp(center.y, box.top + 1, box.bottom - 1) };
    }
    const projection = projectIndex({
      strategy: target.strategy(),
      pointer,
      items: collect(g, target),
      activeKey: current.slot,
      activeIndex: -1,
      length: keys.length,
      lock: null,
    });
    return projection.index ?? keys.length;
  };

  /** Closest list of the group in the arrow's direction that takes the drag: from `list`, or from `origin` outside the lists. */
  const adjacentList = (
    list: ListEntry | null,
    active: Active,
    direction: Coordinates,
    origin?: Rect,
  ): ListEntry | null => {
    const element = list?.getElement();
    const from = element ? getLayoutRect(element) : origin;
    if (!from) return null;
    const candidates: Array<{ list: ListEntry; rect: Rect }> = [];
    for (const other of lists.values()) {
      const node = other.getElement();
      if (other === list || !node?.isConnected || other.isDisabled() || !accepts(other, active)) continue;
      // Lists inside the dragged element (a column's own cards) can't take it.
      if (active.element.isConnected && active.element.contains(node)) continue;
      candidates.push({ list: other, rect: getLayoutRect(node) });
    }
    return pickAdjacent(from, candidates, direction)?.list ?? null;
  };

  /**
   * Once a keyboard move has rendered: reveals the slot and returns its center. A slot
   * that was recreated (in another list, or by a list that remounts its rows) gets the
   * focus back, as the old element took it along; an external draggable is still where
   * it was and keeps it.
   */
  const slotCenter = (current: Session, recreated: boolean): Coordinates | undefined => {
    const element = items.get(current.slot)?.();
    if (!element?.isConnected) return undefined;
    revealElement(element);
    if (recreated && current.mode !== insert) manager.getDraggable(current.slot)?.getFocusTarget()?.focus({ preventScroll: true });
    return getCenter(getLayoutRect(element));
  };

  /**
   * The arrow takes the drag across into an indicator list, level with `from`. Such
   * lists never move: the slot stays (or goes back) home and only the line goes there.
   */
  const indicateAcross = async (current: Session, target: ListEntry, from: Rect): Promise<Coordinates | undefined> => {
    const home = current.list;
    keepSlotHome(g, current);
    // Measured once the slot is back home.
    await nextTick();
    if (session.value !== current) return undefined;
    if (current.list !== home) slotCenter(current, true);
    return indicateAt(g, target, insertionIndex(target, from, current));
  };

  const keyboardIndicator = async (
    current: Session,
    list: ListEntry,
    active: Active,
    pointer: Coordinates,
    direction: Coordinates,
  ): Promise<Coordinates | undefined> => {
    const strategy = list.strategy();
    const step = strategy === 'vertical' ? direction.y : direction.x;
    if (!step) {
      const other = adjacentList(list, active, direction);
      if (!other || !enter(current, other)) return undefined;
      // The line, where the keyboard took the drag, stands for the slot.
      const from = createRect(pointer.x, pointer.y, 0, 0);
      if (other.placeholder() === 'indicator') return indicateAcross(current, other, from);
      // A list that moves takes the slot; the line goes away.
      setIndicator(g, null);
      moveActive(g, other, insertionIndex(other, from, current), null);
      await nextTick();
      return session.value === current ? slotCenter(current, true) : undefined;
    }
    const keys = keysOf(list);
    const own = list.id === current.list ? keys.indexOf(current.slot) : -1;
    const marker = indicator.value?.list === list.id ? indicator.value : null;
    let next = (marker ? marker.index : Math.max(own, 0)) + step;
    // Right before or after the active item the drop changes nothing: skip those positions.
    while (own >= 0 && (next === own || next === own + 1)) next += step;
    if (next < 0 || next > keys.length) return undefined;
    return indicateAt(g, list, next);
  };

  /**
   * An external draggable outside the lists: the arrow takes it into the closest list
   * in its direction, at the position level with the drag, as moves between lists do.
   * Without one that way it moves as the plain draggable it is (pixels, droppables).
   */
  const enterList = async (
    current: Session,
    active: Active,
    pointer: Coordinates,
    direction: Coordinates,
  ): Promise<Coordinates | undefined> => {
    const from = createRect(pointer.x, pointer.y, 0, 0);
    const target = adjacentList(null, active, direction, from);
    if (!target || !enter(current, target)) return undefined;
    const index = insertionIndex(target, from, current);
    if (target.placeholder() === 'indicator') return indicateAt(g, target, index) ?? pointer;
    moveActive(g, target, index, null);
    await nextTick();
    if (session.value !== current) return undefined;
    return slotCenter(current, false) ?? pointer;
  };

  /**
   * Keyboard sorting by items (rfcs/0001-v3.md §10): the arrow along the list moves
   * the slot by one, the perpendicular one moves it to the adjacent list (kanban),
   * and in grids up/down go to the nearest item of the next row. The item a list made
   * for an external draggable moves like any other. Into an indicator list only the
   * line moves.
   */
  const getKeyboardCoordinates = async (
    _event: KeyboardEvent,
    { active, pointer, direction }: KeyboardMoveContext,
  ): Promise<Coordinates | undefined> => {
    const current = session.value;
    if (!current || current.activeKey !== active.id) return;
    const marker = indicator.value;
    const list = marker ? lists.get(marker.list) : current.list == null ? undefined : lists.get(current.list);
    if (!list && current.mode === insert) return enterList(current, active, pointer, direction);
    // Trees navigate depth themselves; copies over their palette have no slot to move.
    if (!list || list.project) return;
    // Staying put still answers, so the sensor doesn't fall back to pixel steps.
    const center = () => {
      const element = items.get(current.slot)?.() ?? items.get(current.activeKey)?.();
      return element?.isConnected ? getCenter(getLayoutRect(element)) : pointer;
    };
    if (list.placeholder() === 'indicator') {
      return (await keyboardIndicator(current, list, active, pointer, direction)) ?? center();
    }

    const strategy = list.strategy();
    // A block moves by items as one unit.
    const keys = viewOf(list, current);
    const position = keys.indexOf(current.slot);
    const slot = items.get(current.slot)?.();
    if (position === -1 || !slot?.isConnected) return center();
    const slotRect = getLayoutRect(slot);
    // Resting on a drop target in an item: the arrow that went there goes on past the
    // item, the opposite one comes back to the slot, any other moves from the slot.
    const stop = current.stop;
    current.stop = null;
    // Leaving the target: detect again even where the pointer stays (the slot that took
    // the item's place has its center where the target's was).
    if (stop) manager.scheduleFrame();
    const onward = !!stop && direction.x === stop.direction.x && direction.y === stop.direction.y;
    if (stop && !onward && direction.x === -stop.direction.x && direction.y === -stop.direction.y) return center();

    let target = list;
    let index: number | null = null;
    let across = false;
    if (strategy === 'grid' && direction.y) {
      const others = collect(g, list).filter((item) => item.index !== position);
      index = nextRowIndex(others, slotRect, direction.y > 0 ? 1 : -1);
      across = index === null;
    } else {
      const step = strategy === 'vertical' ? direction.y : direction.x;
      if (step) {
        const next = position + step;
        if (next >= 0 && next < keys.length) index = next;
      } else {
        across = true;
      }
    }
    if (across) {
      const other = adjacentList(list, active, direction);
      if (other?.placeholder() === 'indicator') {
        const line = enter(current, other) ? await indicateAcross(current, other, slotRect) : undefined;
        return line ?? center();
      }
      if (other) {
        target = other;
        index = insertionIndex(other, slotRect, current);
      }
    }
    if (index !== null) {
      if (target === list && !list.canSort()) index = null;
      else if (target !== list && target.id === current.origin.list && !target.canSort()) {
        returnToOrigin(g, null);
        index = null;
      }
    }
    // Passing an item with a drop target that takes the drag stops on the target first:
    // the next press drops into the item (or goes on past it, as the pointer does).
    const passed = index !== null && target === list && !onward ? keys[index] : undefined;
    const into = passed === undefined ? null : intoPoint(passed, list, active);
    if (into) {
      current.stop = { key: passed!, direction };
      return into;
    }
    // An external item takes the item the other list makes for it.
    if (index !== null && enter(current, target)) moveActive(g, target, index, null);

    await nextTick();
    if (session.value !== current) return;
    // In this list too when it keys its rows by index (Vuetify's v-data-table-virtual
    // remounts every row whose index changed).
    return slotCenter(current, target !== list || isFocusLost()) ?? center();
  };

  // ─── Announcements ───────────────────────────────────────────────────────────

  const spotKey = ({ list, index, length }: SortableSpot) => `${String(list)}\u0000${index}\u0000${length}`;

  const spotOf = (current: Session): SortableSpot | null => {
    const shown = indicator.value;
    if (shown) {
      const list = lists.get(shown.list);
      const keys = list ? keysOf(list) : [];
      const own = keys.indexOf(current.slot);
      const index = own >= 0 && own < shown.index ? shown.index - 1 : shown.index;
      return { list: shown.list, index, length: own >= 0 ? keys.length : keys.length + 1 };
    }
    if (current.list == null) return null;
    const keys = keysOf(lists.get(current.list)!);
    // A block is placed where it starts.
    return { list: current.list, index: keys.indexOf(current.block[0]!), length: keys.length };
  };

  const ours = (event: DnDEvent) => {
    const current = session.value;
    return current && current.activeKey === event.active.id && !isForeign(event) ? current : null;
  };

  const announcer: Partial<Announcements> = {
    onDragStart: (event) => {
      const current = ours(event);
      if (!current || current.origin.list == null) return undefined;
      return sortableTexts.start(subjectOf(current), spotIn(current.origin.list, current.origin.index));
    },
    onDragOver: (event) => {
      const into = session.value;
      if (into?.activeKey === event.active.id && isInto(event)) {
        // Back over the list, the position is spoken again.
        g.spokenSpot = null;
        return sortableTexts.target(subjectOf(into), event.over!.id);
      }
      const current = ours(event);
      const spot = current && spotOf(current);
      if (!spot) return undefined;
      // '' tells the manager there is nothing new, without cancelling a pending text.
      const key = spotKey(spot);
      if (key === g.spokenSpot) return '';
      g.spokenSpot = key;
      // A swap partner sits where the active item started.
      const partner = current.swap;
      return sortableTexts.over(
        subjectOf(current),
        spot,
        partner == null ? undefined : { key: partner, spot: spotIn(current.origin.list!, current.origin.index) },
      );
    },
    onDragEnd: (event) => (g.announced?.key === event.active.id ? g.announced.text : undefined),
    onDragCancel: (event) => (g.announced?.key === event.active.id ? g.announced.text : undefined),
  };

  // ─── Wiring ──────────────────────────────────────────────────────────────────

  // An integration: the drop is written before the user's monitors hear `onDragEnd`.
  const removeMonitor = manager.addMonitor(
    {
      onDragStart: start,
      onDragMove: move,
      onBeforeDrop: beforeDrop,
      onDragEnd: end,
      onDragCancel: cancel,
      getKeyboardCoordinates,
    },
    true,
  );
  const removeAnnouncer = manager.addAnnouncer(announcer);
  const removeRule = manager.addTargetRule(targetRule(g));
  // `e.source.remove()` in a trash zone's onDrop marks the dragged items for removal.
  const removeSource = manager.addSourceResolver((active) => {
    const current = session.value;
    if (!current || current.activeKey !== active.id || current.origin.list == null) return undefined;
    return {
      list: current.origin.list,
      remove: () => {
        current.removed = true;
      },
    };
  });

  return {
    name,
    manager,
    session,
    indicator,
    addList(entry) {
      lists.set(entry.id, entry);
      return () => {
        if (lists.get(entry.id) !== entry) return;
        lists.delete(entry.id);
        if (lists.size) return;
        removeMonitor();
        removeAnnouncer();
        removeRule();
        removeSource();
        scope.stop();
        release();
      };
    },
    registerItem(key, getElement) {
      items.set(key, getElement);
      return () => {
        if (items.get(key) === getElement) items.delete(key);
      };
    },
    showIndicator: (value) => showIndicator(g, value),
    lookup,
    keysOf,
    viewOf: (list) => (session.value ? viewOf(list, session.value) : keysOf(list)),
    indexOf,
    accepts,
    isInert: (list) => isInert(g, list),
    leadOffset: () => leadOffset(g, session.value),
    captureLayout: () => captureLayout(g),
  };
}

export function useSortableGroup(manager: DnDManager, name: string): SortableGroup {
  let groups = registries.get(manager);
  if (!groups) {
    groups = new Map();
    registries.set(manager, groups);
  }
  const existing = groups.get(name);
  if (existing) return existing;
  const group = createGroup(manager, name, () => groups!.delete(name));
  groups.set(name, group);
  return group;
}
