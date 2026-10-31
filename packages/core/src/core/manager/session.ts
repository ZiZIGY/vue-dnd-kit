/**
 * A drag session from start to end. `start` takes the active item and its overlay, puts
 * the page into drag mode and runs the first frame; `move` feeds the pointer to the frame
 * loop. At the end the drop is decided (`onBeforeDrop`) and committed, or the drag is
 * cancelled; the overlay lands (`finish`) and the session settles back to idle.
 */

import { nextTick } from 'vue';
import type {
  Active,
  Coordinates,
  DnDEndEvent,
  DnDEvent,
  DragItem,
  DropAnimation,
  Key,
  Over,
  Rect,
  SensorType,
} from '../../types';
import { getLayoutRect, getRect, getSettledRect } from '../../animation/layout';
import { contentAnimations, fadeInPlace, runDropAnimation, type OverlayItemLanding } from '../../animation/drop';
import { isFocusLost, nextFrame } from '../../utils/dom';
import { markDocumentDragging } from '../styles';
import { vibrate } from '../haptics';
import { isFinal, toVerdict, type Verdict } from '../verdict';
import { NO_LANDINGS, type ManagerContext } from './state';
import { createFollow } from './follow';

/** Frames a keyboard drag's item has to take the focus back after the drop. */
const FOCUS_FRAMES = 10;

export function createSession(ctx: ManagerContext) {
  /** Counts sessions: an awaited step of one that has settled since does nothing. */
  let session = 0;
  /** Fades of items without a clone, kept until their placeholder marks are gone. */
  let fades: Animation[] = [];
  /** Keeps the dropped overlay on what it lands on while the page scrolls. */
  const follow = createFollow(ctx);

  const restoreDocument = () => {
    ctx.restoreDocument?.();
    ctx.restoreDocument = null;
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
    const status = ctx.status.value;
    if (status === 'dragging' || status === 'dropping' || status === 'selecting') return false;
    const entry = ctx.draggables.get(id);
    const element = entry?.getElement();
    if (!entry || !element || entry.isDisabled()) return false;

    const ids =
      ctx.selection.has(id) && ctx.selection.size > 1
        ? [id, ...[...ctx.selection].filter((key) => key !== id)]
        : [id];
    const items = buildItems(ids);
    const modifiers = entry.getModifiers?.() ?? [];
    ctx.overlay.pickUp(id, entry);
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
    ctx.overlay.place(ctx.active.value, coordinates, modifiers, container);
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

  const settle = (current: Active) => {
    session++;
    restoreDocument();
    follow.stop();
    ctx.loop.cancel();
    ctx.measurer.end();
    ctx.loop.reset();
    ctx.pointerElement = null;
    if (current.sensor === 'keyboard') restoreFocus(current.id);
    ctx.active.value = null;
    ctx.over.value = null;
    ctx.pointer.value = null;
    ctx.settling.value = false;
    ctx.dropTarget.value = null;
    ctx.transform.value = { x: 0, y: 0 };
    ctx.overlay.end();
    ctx.mode.value = 'move';
    ctx.landingKey.value = null;
    ctx.landings.value = NO_LANDINGS;
    ctx.overlayColumn.value = null;
    ctx.overlayItems.clear();
    ctx.activationProgress.value = 0;
    ctx.status.value = 'idle';
    // Faded-in items keep full opacity until their placeholder marks are gone (post-flush).
    const faded = fades;
    fades = [];
    if (faded.length) void nextTick(() => faded.forEach((animation) => animation.cancel()));
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

  /**
   * Multi-drag: the default overlay's clones of the other items land on their own slots
   * with the box; items without a clone (past the cap, custom overlays) fade in where
   * they are, instead of popping to full opacity when the drop ends. A box going `into`
   * a zone takes every clone with it, and the items still shown fade in where they are.
   */
  const landItems = (
    current: Active,
    animation: DropAnimation | undefined,
    box: { from: Rect; to: Rect | null },
    into: boolean,
  ): Promise<void> => {
    if (current.ids.length < 2) return Promise.resolve();
    const slotOf = new Map<Key, Key>();
    for (const [slot, id] of ctx.landings.value) slotOf.set(id, slot);
    const elementOf = (id: Key) => {
      const element = ctx.draggables.get(slotOf.get(id) ?? id)?.getElement();
      return element?.isConnected ? element : null;
    };
    const items: OverlayItemLanding[] = [];
    const resting: HTMLElement[] = [];
    for (const id of current.ids) {
      if (id === current.id) continue;
      const clone = ctx.overlayItems.get(id);
      const target = elementOf(id);
      if (into || !clone?.isConnected) {
        if (target) resting.push(target);
        continue;
      }
      const to = landingRect(target);
      items.push({ element: clone, from: getRect(clone), to });
    }
    fades = fadeInPlace(animation, resting);
    // Clones exist only with the sortable layer's column: its cells, a custom layout's `DragPreview`s.
    return ctx.overlayColumn.value?.land(animation, items, box) ?? Promise.resolve();
  };

  /**
   * How a drag lands: the drop target's own `dropAnimation` (a zone's, a list's
   * `overDropAnimation`), else the dragged item's (its list's), else the provider's.
   * `false` counts: it is someone's choice of no animation.
   */
  const dropAnimationOf = (over: Over | null): DropAnimation | undefined => {
    const target = over ? ctx.droppables.get(over.id)?.getDropAnimation?.() : undefined;
    return target ?? ctx.overlay.dropAnimation ?? ctx.props.dropAnimation;
  };

  /** Plays the drop or return animation, then ends the session. */
  const finish = async (reason: 'drop' | 'cancel', event: DnDEvent) => {
    const current = event.active;
    const id = session;
    ctx.status.value = 'dropping';
    // The commit (or the cancel) happened in this same tick: nothing has rendered against
    // the changed data with the drag state still live.
    ctx.settling.value = true;
    ctx.dropTarget.value = reason === 'drop' ? event.over : null;
    ctx.over.value = null;
    ctx.pointer.value = null;
    ctx.loop.cancel();
    restoreDocument();

    const overlay = ctx.overlayElement.value;
    if (overlay) {
      // Measure the target after the commit has rendered, then once more a frame
      // later: virtualizers may re-measure rows with a ResizeObserver in between.
      await nextTick();
      await nextFrame();
      if (id !== session) return;
      // Copies and created items land on their own row, not on the dragged one.
      const target = ctx.draggables.get(ctx.landingKey.value ?? current.id)?.getElement();
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
      const over = reason === 'drop' ? event.over : null;
      // While it lands, the box stays on where it goes (the slot, the zone), else on what
      // it was dropped on: scrolling the page mid-flight doesn't send it astray.
      const anchor = landing ? target! : into ? zone!.element : over?.element;
      follow.follow(anchor ?? null);
      const animation = dropAnimationOf(over);
      // The overlay's content may animate its own landing (a splash on `dropping`): the
      // drop ends when that does too.
      await Promise.all([
        runDropAnimation(animation, { overlay, from, to: landing, into, reason, active: current, over }),
        landItems(current, animation, { from, to: landing }, !!into),
        contentAnimations(overlay),
      ]);
      if (id !== session) return;
    }
    settle(current);
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
    void conclude('onDragCancel', ctx.events.createEvent());
  };

  /**
   * `onBeforeDrop` answered `'continue'`: nothing dropped, and the drag goes on from where
   * it stood, the page back in drag mode. The sensor takes it up again (`onResume`): a
   * pointer moves it without a button, and its next release drops.
   */
  const resume = (event: DnDEvent) => {
    // The overlay follows the pointer again.
    follow.stop();
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
    if (ctx.overlay.enabled) follow.follow(target?.element ?? null);

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
    if (current && ctx.status.value === 'dragging') ctx.events.emit('onDragCancel', ctx.events.createEvent());
    if (current) settle(current);
    ctx.events.stopAnnouncing();
  };

  return { updateActive, start, move, drop, cancel, destroy };
}
