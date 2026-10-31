/**
 * A drag session from start to end. `start` takes the active item and its overlay, puts
 * the page into drag mode and runs the first frame; `move` feeds the pointer to the frame
 * loop. At the end the drop is decided (`onBeforeDrop`) and committed, or the drag is
 * cancelled. The drag then hands its overlay to a flight (`Flight`), which lands it while
 * the next drag may already start, and settles once it has landed (`onDragSettle`).
 */

import { nextTick } from 'vue';
import type {
  Active,
  Coordinates,
  DnDEndEvent,
  DnDEvent,
  DnDStatus,
  DragItem,
  DropAnimation,
  DropDestination,
  Key,
  Rect,
  SensorType,
} from '../../types';
import { containsPoint, getLayoutRect, getRect, getSettledRect, offsetRect } from '../../animation/layout';
import {
  contentAnimations,
  fadeInPlace,
  intoOverlayItems,
  intoStagger,
  landOverlayItems,
  runDropAnimation,
  type OverlayItemLanding,
} from '../../animation/drop';
import { isFocusLost, nextFrame } from '../../utils/dom';
import { markDocumentDragging } from '../styles';
import { vibrate } from '../haptics';
import { isFinal, toVerdict, type Verdict } from '../verdict';
import { NO_LANDINGS, type Flight, type ManagerContext } from './state';
import { createFollow } from './follow';

/** Frames a keyboard drag's item has to take the focus back after the drop. */
const FOCUS_FRAMES = 10;

export function createSession(ctx: ManagerContext) {
  /** Counts drags: the overlay keys a drag's box by it, and an awaited step of an older one does nothing. */
  let session = 0;
  /** Keeps the overlay on the target it was dropped on while `onBeforeDrop` decides. */
  const waiting = createFollow(() => ctx.overlayElement.value);
  /** Where the drop would go as the drag was released (the overlay's `to`). */
  let releasedTo: DropDestination | null = null;

  const restoreDocument = () => {
    ctx.restoreDocument?.();
    ctx.restoreDocument = null;
  };

  /** What the status rests at without a drag: `'dropping'` while an overlay still lands. */
  const restStatus = (): DnDStatus => (ctx.flights.value.length ? 'dropping' : 'idle');

  /** No drag runs, none is deciding its drop: a new one may start (landings don't count). */
  const isAtRest = (): boolean => {
    const status = ctx.status.value;
    return status === 'idle' || (status === 'dropping' && !ctx.active.value);
  };

  // ─── Start ───────────────────────────────────────────────────────────────────

  const buildItems = (ids: Key[]): DragItem[] =>
    ids.map((id) => {
      const entry = ctx.draggables.get(id);
      return {
        id,
        item: entry?.getItem?.(),
        data: entry?.getData(),
        type: entry?.getTypes() ?? [],
      };
    });

  /** Lets integrations (sortable) fix up the active item, e.g. multi-drag ids from unmounted rows. */
  const updateActive = (patch: Partial<Pick<Active, 'ids' | 'items'>>) => {
    if (ctx.active.value) ctx.active.value = { ...ctx.active.value, ...patch };
  };

  /** Starts a drag of `id` from `coordinates` (sensors: `SensorContext.activate`); `touch`: started by touch. */
  const start = (id: Key, coordinates: Coordinates, sensor: SensorType, touch = false): boolean => {
    // One drag at a time, and none while a drop is still being decided. Landings don't
    // hold the next drag back.
    if (ctx.active.value || ctx.status.value === 'selecting') return false;
    const entry = ctx.draggables.get(id);
    const element = entry?.getElement();
    if (!entry || !element || entry.isDisabled()) return false;

    session++;
    // Caught in flight: an item whose overlay still lands. Its landing ends where the box
    // is, and the drag goes on from there with its clones (its slots are still hidden).
    const caught = ctx.flights.value.find((flight) => flight.active.ids.includes(id));
    let caughtAt = caught?.element?.isConnected ? getRect(caught.element) : null;
    // A keyboard drag is held at its item, not under a pointer: it goes on from the box
    // only where the box is over the item, else from the item as any pickup.
    if (caughtAt && sensor !== 'pointer' && !containsPoint(caughtAt, coordinates)) caughtAt = null;
    if (caught) land(caught);
    const ids =
      ctx.selection.has(id) && ctx.selection.size > 1
        ? [id, ...[...ctx.selection].filter((key) => key !== id)]
        : [id];
    const items = buildItems(ids);
    const modifiers = entry.getModifiers?.() ?? [];
    ctx.overlay.pickUp(id, entry, caught?.previews);
    ctx.overlayColumn.value = null;
    ctx.landings.value = NO_LANDINGS;
    ctx.overlayItems.clear();
    ctx.active.value = {
      id,
      ids,
      items,
      data: items[0]!.data,
      type: items[0]!.type,
      element,
      rect: getLayoutRect(element),
      sensor,
    };
    const container = entry.getContainer?.() ?? element.parentElement;
    ctx.origin = coordinates;
    ctx.touch = touch;
    ctx.raw = coordinates;
    ctx.pointer.value = coordinates;
    ctx.transform.value = { x: 0, y: 0 };
    ctx.over.value = null;
    ctx.overlay.place(ctx.active.value, coordinates, modifiers, container, caughtAt);
    ctx.mode.value = 'move';
    ctx.landingKey.value = null;
    ctx.activationProgress.value = 1;
    ctx.measurer.begin();
    ctx.detection.begin();
    ctx.loop.reset();
    ctx.status.value = 'dragging';
    ctx.restoreDocument = markDocumentDragging(sensor);

    const event = ctx.events.createEvent();
    ctx.events.emit('onDragStart', event);
    if (ctx.overlay.enabled && ctx.active.value) ctx.overlay.takePreviews(ctx.active.value);
    ctx.events.announce('onDragStart', event);
    vibrate(ctx.props.haptics, 'start', touch);
    ctx.loop.runFrame();
    return true;
  };

  const move = (coordinates: Coordinates) => {
    ctx.raw = coordinates;
    ctx.loop.requestFrame();
  };

  // ─── End ─────────────────────────────────────────────────────────────────────

  /**
   * Gives focus back to the dragged item after a keyboard drag. Looked up by id once
   * the result has rendered: moving between lists recreates the element, and the old
   * one took the focus with it. Focus the user moved elsewhere is left alone.
   */
  const restoreFocus = (id: Key) => {
    const attempt = () => {
      const target = ctx.draggables.get(id)?.getFocusTarget();
      if (!target?.isConnected) return false;
      if (!isFocusLost()) return true;
      target.focus({ preventScroll: true });
      // A target that can't take the focus yet (still hidden as the slot) is tried again.
      return document.activeElement === target;
    };
    void nextTick(() => {
      // Virtualizers may mount the row a frame later; a slot may stay hidden a few frames.
      let frames = 0;
      const retry = () => {
        if (!attempt() && ++frames < FOCUS_FRAMES) requestAnimationFrame(retry);
      };
      retry();
    });
  };

  /** The drag is over: its state goes, the page leaves drag mode. Its flight, if any, lands on. */
  const clear = () => {
    restoreDocument();
    waiting.stop();
    ctx.loop.cancel();
    ctx.measurer.end();
    ctx.loop.reset();
    ctx.pointerElement = null;
    ctx.active.value = null;
    ctx.over.value = null;
    ctx.pointer.value = null;
    ctx.transform.value = { x: 0, y: 0 };
    ctx.overlay.end();
    // The box, if it lands, is its flight's now.
    ctx.overlayElement.value = null;
    ctx.mode.value = 'move';
    ctx.landingKey.value = null;
    ctx.landings.value = NO_LANDINGS;
    ctx.overlayColumn.value = null;
    ctx.overlayItems.clear();
    ctx.activationProgress.value = 0;
    ctx.status.value = restStatus();
  };

  /**
   * The drop is decided (or the drag cancelled): the drag hands its overlay to a flight,
   * which lands it, and clears its state, so the next drag can start at once. The box
   * stays where it was left, moved by what it followed while the drop was decided.
   */
  const handOff = (reason: 'drop' | 'cancel', event: DnDEvent): Flight => {
    const current = event.active;
    const shift = waiting.take();
    const box = ctx.overlay.getOverlayRect(current, ctx.transform.value);
    const over = reason === 'drop' ? event.over : null;
    const mode = ctx.mode.value;
    const landingKey = ctx.landingKey.value;
    const flight: Flight = {
      id: session,
      reason,
      event,
      active: current,
      mode,
      over,
      to: releasedTo,
      landingKey,
      // A copy that found no slot leaves the original as it is.
      slot: landingKey ?? (mode === 'copy' ? null : current.id),
      landings: ctx.landings.value,
      column: ctx.overlayColumn.value,
      ...ctx.overlay.release(),
      target: over?.accepted ? ctx.droppables.get(over.id)?.getOverlay?.() : undefined,
      rect: shift ? offsetRect(box, shift.x, shift.y) : box,
      items: new Map(ctx.overlayItems),
      element: ctx.overlay.enabled ? ctx.overlayElement.value : null,
      follow: createFollow(() => flight.element),
      fades: [],
      done: false,
    };
    releasedTo = null;
    ctx.flights.value = [...ctx.flights.value, flight];
    clear();
    return flight;
  };

  /** A flight has landed: its slots show, the focus comes back after a keyboard drag. */
  const land = (flight: Flight) => {
    if (flight.done) return;
    flight.done = true;
    flight.follow.stop();
    if (flight.active.sensor === 'keyboard') restoreFocus(flight.active.id);
    ctx.flights.value = ctx.flights.value.filter((entry) => entry !== flight);
    // A drag that started meanwhile has its own status.
    if (ctx.status.value === 'dropping' && !ctx.active.value) ctx.status.value = restStatus();
    // Faded-in items keep full opacity until their placeholder marks are gone (post-flush).
    const faded = flight.fades;
    flight.fades = [];
    if (faded.length) void nextTick(() => faded.forEach((animation) => animation.cancel()));
    ctx.events.emit('onDragSettle', flight.event);
  };

  /**
   * Where a dragged item lands, if its slot is rendered and can be seen: virtualizers
   * keep overscan rows mounted outside the scroller, and the slot may be scrolled away.
   * Measured where the slot will settle: in a nested list it may still be sliding with
   * an ancestor (the item of the outer list that holds it).
   */
  const landingRect = (target: Element | null | undefined): Rect | null => {
    const to = target?.isConnected ? getSettledRect(target) : null;
    return to && to.width > 0 && ctx.measurer.measureVisible(target!) ? to : null;
  };

  /** The clones of the other dragged items riding in a flight's box, in drop order. */
  const clonesOf = (flight: Flight): HTMLElement[] => {
    const current = flight.active;
    return current.ids.flatMap((id) => {
      const clone = id === current.id ? null : flight.items.get(id);
      return clone?.isConnected ? [clone] : [];
    });
  };

  /**
   * Multi-drag: the overlay's clones of the other items (the column's cells, a pile's, a
   * custom layout's `DragPreview`s) land on their own slots with the box; items without a
   * clone (past `overlayPreviews`, custom overlays) fade in where they are, instead of
   * popping to full opacity when the drop ends. Into a zone, the clones go in one after
   * another, the box after them; the items still shown fade in where they are.
   */
  const landItems = (
    flight: Flight,
    animation: DropAnimation | undefined,
    box: { from: Rect; to: Rect | null },
    into: Rect | null,
  ): Promise<void> => {
    const current = flight.active;
    if (current.ids.length < 2) return Promise.resolve();
    const slotOf = new Map<Key, Key>();
    for (const [slot, id] of flight.landings) slotOf.set(id, slot);
    const elementOf = (id: Key) => {
      const element = ctx.draggables.get(slotOf.get(id) ?? id)?.getElement();
      return element?.isConnected ? element : null;
    };
    const items: OverlayItemLanding[] = [];
    const resting: HTMLElement[] = [];
    for (const id of current.ids) {
      if (id === current.id) continue;
      const clone = flight.items.get(id);
      const target = elementOf(id);
      if (into || !clone?.isConnected) {
        if (target) resting.push(target);
        continue;
      }
      const to = landingRect(target);
      items.push({ element: clone, from: getRect(clone), to });
    }
    flight.fades = fadeInPlace(animation, resting);
    if (into) return intoOverlayItems(animation, clonesOf(flight), into);
    return (flight.column?.land ?? landOverlayItems)(animation, items, box);
  };

  /**
   * How a flight lands: the drop target's own `dropAnimation` (a zone's, a list's
   * `overDropAnimation`), else the dragged item's (its list's), else the provider's.
   * `false` counts: it is someone's choice of no animation.
   */
  const dropAnimationOf = (flight: Flight): DropAnimation | undefined => {
    const { over } = flight;
    const target = over ? ctx.droppables.get(over.id)?.getDropAnimation?.() : undefined;
    return target ?? flight.dropAnimation ?? ctx.props.dropAnimation;
  };

  /** Hands the overlay to a flight, plays its drop or return animation, then settles it. */
  const finish = async (reason: 'drop' | 'cancel', event: DnDEvent) => {
    const flight = handOff(reason, event);
    const overlay = flight.element;
    if (overlay) {
      // Measure the target after the commit has rendered, then once more a frame
      // later: virtualizers may re-measure rows with a ResizeObserver in between.
      await nextTick();
      await nextFrame();
      if (flight.done) return;
      const current = flight.active;
      // Copies and created items land on their own row, not on the dragged one.
      const target = ctx.draggables.get(flight.landingKey ?? current.id)?.getElement();
      // The commit changed the layout since the last frame: read afresh.
      ctx.measurer.invalidate();
      ctx.measurer.nextFrame();
      // Fly only to a slot that can be seen, otherwise fade out.
      const landing = landingRect(target);
      const from = getRect(overlay);
      // Shown nowhere after a drop on a zone (not a list: an item dropped into a folder,
      // a trash zone): the overlay goes into the zone. Otherwise it fades where it is.
      const zone = landing || reason !== 'drop' ? null : event.over;
      const into =
        (zone?.element.isConnected && !ctx.droppables.get(zone.id)?.sortable && ctx.measurer.measureVisible(zone.element)) ||
        null;
      const { over } = flight;
      // While it lands, the box stays on where it goes (the slot, the zone), else on what
      // it was dropped on: scrolling the page mid-flight doesn't send it astray.
      const anchor = landing ? target! : into ? zone!.element : over?.element;
      flight.follow.follow(anchor ?? null);
      const animation = dropAnimationOf(flight);
      // Into a zone, the box goes in after the clones it carries, one after another.
      const going = into ? clonesOf(flight).length : 0;
      // The overlay's content may animate its own landing (a splash on `dropping`): the
      // drop ends when that does too.
      await Promise.all([
        runDropAnimation(animation, { overlay, from, to: landing, into, reason, active: current, over }, going * intoStagger(going)),
        landItems(flight, animation, { from, to: landing }, into),
        contentAnimations(overlay),
      ]);
      if (flight.done) return;
    }
    land(flight);
  };

  /** Tells the monitors and the live region how the drag ended, then lands the overlay. */
  const conclude = (name: 'onDragEnd' | 'onDragCancel', event: DnDEvent) => {
    ctx.events.emit(name, event);
    ctx.events.announce(name, event);
    return finish(name === 'onDragEnd' ? 'drop' : 'cancel', event);
  };

  /** Aborts a press that is still activating, or a running rubber band: `true` if there was one. */
  const abortPending = (): boolean => {
    const { value } = ctx.status;
    const aborts = value === 'activating' ? ctx.activationAborts : value === 'selecting' ? ctx.selectionAborts : null;
    aborts?.forEach((abort) => abort());
    return !!aborts;
  };

  const cancel = () => {
    if (abortPending() || ctx.status.value !== 'dragging' || !ctx.active.value) return;
    releasedTo = ctx.getDestination();
    void conclude('onDragCancel', ctx.events.createEvent());
  };

  /**
   * `onBeforeDrop` answered `'continue'`: nothing dropped, and the drag goes on from where
   * it stood, the page back in drag mode. The sensor takes it up again (`onResume`): a
   * pointer moves it without a button, and its next release drops.
   */
  const resume = (event: DnDEvent) => {
    // The overlay follows the pointer again.
    waiting.stop();
    ctx.status.value = 'dragging';
    ctx.restoreDocument = markDocumentDragging(event.active.sensor);
    ctx.events.emit('onDragResume', event);
    ctx.events.announce('onDragResume', event);
    // Where the pointer is now: the user may have moved it during the wait.
    ctx.loop.scheduleFrame();
  };

  const drop = async () => {
    if (ctx.status.value !== 'dragging' || !ctx.active.value) return;
    ctx.loop.flushFrame();
    releasedTo = ctx.getDestination();
    const id = session;
    ctx.status.value = 'dropping';
    // `onBeforeDrop` may wait for the user (a confirmation dialog): the page stops being
    // in drag mode now, with its own cursor and text selection. The drag state and the
    // overlay stay as they are until the drop is decided.
    restoreDocument();
    const event = ctx.events.createEvent();
    // Measured now: the handlers below may change the page before anyone reads it.
    void event.position;
    const target = event.over;
    // While `onBeforeDrop` decides (a confirmation may take a while), the overlay stays on
    // the target it was dropped on, wherever the page scrolls.
    if (ctx.overlay.enabled) waiting.follow(target?.element ?? null);

    let verdict: Verdict = true;
    try {
      // The user's monitors decide first: a list may apply a controlled drop's result in
      // its own `onBeforeDrop`, and a veto after that would strand the applied result.
      for (const monitor of ctx.events.orderMonitors(false)) {
        const result = toVerdict(await monitor.onBeforeDrop?.(event));
        if (isFinal(result)) {
          verdict = result;
          break;
        }
        if (Array.isArray(result)) verdict = result;
      }
      if (!isFinal(verdict) && target?.accepted) {
        const result = toVerdict(await ctx.droppables.get(target.id)?.onBeforeDrop?.(event));
        if (isFinal(result) || Array.isArray(result)) verdict = result;
      }
    } catch (error) {
      console.error(error);
      verdict = false;
    }
    if (id !== session) return;

    if (verdict === 'continue') return resume(event);
    if (verdict === false || (target && !target.accepted)) {
      vibrate(ctx.props.haptics, 'refuse', ctx.touch);
      return conclude('onDragCancel', event);
    }

    if (target) {
      try {
        ctx.droppables.get(target.id)?.onDrop?.(event);
      } catch (error) {
        console.error(error);
      }
    }
    const endEvent: DnDEndEvent = {
      ...event,
      dropped: !!target,
      accepted: Array.isArray(verdict) ? verdict : event.active.ids,
    };
    vibrate(ctx.props.haptics, 'drop', ctx.touch);
    return conclude('onDragEnd', endEvent);
  };

  const destroy = () => {
    abortPending();
    const current = ctx.active.value;
    // A running drag ends, also one whose drop `onBeforeDrop` was still deciding: its answer
    // comes to nothing (`session` moves on below), so this is its one terminal event.
    if (current) ctx.events.emit('onDragCancel', ctx.events.createEvent());
    // An awaited drop of it, and the landings, do nothing more.
    session++;
    for (const flight of ctx.flights.value) {
      flight.done = true;
      flight.follow.stop();
    }
    ctx.flights.value = [];
    if (current) clear();
    ctx.events.stopAnnouncing();
  };

  return {
    updateActive,
    start,
    move,
    drop,
    cancel,
    destroy,
    restStatus,
    isAtRest,
    /** The current (or last) drag's number: the overlay keys its box by it. */
    sessionId: () => session,
  };
}
