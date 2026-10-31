/**
 * The drag session state machine: idle → activating → dragging → dropping → idle,
 * plus idle → selecting → idle while a selection area draws its rubber band.
 *
 * Invariants (rfcs/0001-v3.md §13):
 * - one session per provider; input during `dropping` is ignored;
 * - every exit path (drop, reject, cancel, callback error, provider unmount)
 *   restores the document and emits exactly one terminal event;
 * - items are identified by id, never by element: elements may be recreated mid-drag.
 *
 * `createDnDManager` composes the modules of this folder around one `ManagerContext`
 * (`state.ts`): the registry, events and announcements, the overlay, target detection,
 * the frame loop and the session itself.
 */

import type { Coordinates, DnDProviderProps, Key } from '../../types';
import { getRect } from '../../animation/layout';
import { createMeasurer } from '../measure';
// In the order the modules build on each other.
import { createDragState, type ManagerContext } from './state';
import { createRegistry } from './registry';
import { createEvents } from './events';
import { createOverlay } from './overlay';
import { createDetection } from './detection';
import { createFrameLoop } from './frame';
import { createSession } from './session';

export type { AreaEntry, AutoScrollEntry, DraggableEntry, DroppableEntry, IntegrationMonitor, TargetRule } from './registry';
export type { Flight, OverlayColumn } from './state';
export type { PreviewSource } from './overlay';

export type DnDManager = ReturnType<typeof createDnDManager>;

export function createDnDManager(props: DnDProviderProps) {
  const state = createDragState();
  const { lookups, members } = createRegistry();
  // The modules are put in right below, before anything can call one (see `ManagerContext`).
  const ctx = {
    props,
    ...state,
    ...lookups,
    ...members,
    measurer: createMeasurer({ onShadowScroll: () => ctx.loop.scheduleFrame() }),
    origin: { x: 0, y: 0 },
    touch: false,
    raw: { x: 0, y: 0 },
    pointerElement: null,
    restoreDocument: null,
  } as ManagerContext;
  const events = (ctx.events = createEvents(ctx));
  const overlay = (ctx.overlay = createOverlay(ctx));
  const detection = (ctx.detection = createDetection(ctx));
  const loop = (ctx.loop = createFrameLoop(ctx));
  const { measurer } = ctx;

  // The getters below are read-only, though the spreads leave them writable in `DnDManager`.
  const manager = {
    props,
    ...state,
    instructionsId: '',
    // monitors, activationAborts, selectionAborts, getDraggable(s), getDroppable(s), registration
    ...members,
    /** Clone of a dragged item taken at pickup (`DragPreview`); none past `overlayPreviews` or for unrendered items. */
    getPreview: overlay.getPreview,
    /** Ids that have a clone, in drop order: what the default overlay's column shows. */
    get previewIds(): readonly Key[] {
      return overlay.previewIds;
    },
    get hasOverlay() {
      return overlay.enabled;
    },
    getModifiers: overlay.getModifiers,
    /** The dragged item's overlay component (its own, else its list's); `null`: slot or clone. */
    get overlayComponent() {
      return overlay.component;
    },
    /** Pointer position as the sensor reported it, before modifiers. */
    getRawPointer: (): Coordinates => ctx.raw,
    /**
     * Topmost element under the pointer at the last target detection (at most a frame
     * old); `null` when unknown, e.g. while a modifier moves the point off the pointer.
     */
    getPointerElement: (): Element | null => ctx.pointerElement,
    /** The overlay box for a drag offset, as the overlay, collision and modifiers see it. */
    getOverlayRect: overlay.getOverlayRect,
    /** The element is (in) a dragged item or a slot one lands in: never a drop target. */
    isOwned: detection.isOwned,
    /** A slot a landing overlay flies to: hidden (`data-dnd-placeholder`) until it is there. */
    isLanding: (key: Key): boolean => ctx.flights.value.some((flight) => flight.slot === key || flight.landings.has(key)),
    /** The flight landing this dragged item, if one is. */
    flightOf: (id: Key) => ctx.flights.value.find((flight) => flight.active.ids.includes(id)),
    /** The item of a landing box under `point`, the newest on top: a press there catches it in flight. */
    catchAt: (point: Coordinates): Key | null => {
      for (const flight of [...ctx.flights.value].reverse()) {
        const { element } = flight;
        if (!element?.isConnected || !ctx.draggables.has(flight.active.id)) continue;
        const rect = getRect(element);
        if (point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom) {
          return flight.active.id;
        }
      }
      return null;
    },
    /** A landing overlay carries this slot's item: its box, or a clone in it, flies there (FLIP leaves it alone). */
    isCarried: (key: Key): boolean =>
      ctx.flights.value.some(
        (flight) => key === (flight.landingKey ?? flight.active.id) || flight.items.has(flight.landings.get(key) ?? key),
      ),
    announce: events.announce,
    // updateActive, start, move, drop, cancel, destroy
    ...createSession(ctx),
    scheduleFrame: loop.scheduleFrame,
    /** Runs the pending frame now (discrete keyboard moves need `pointer`/`over` updated at once). */
    flushFrame: loop.flushFrame,
    /** Layout rect without in-flight FLIP translates; cached during a drag, scroll-aware. */
    measure: measurer.measure,
    /** `measure()` clipped by scroll containers and the viewport; `null` when fully clipped. */
    measureVisible: measurer.measureVisible,
    /** Whether FLIP should animate the element (near its scroll container's visible area). */
    isNearViewport: measurer.isNearViewport,
    /** Call after layout changes the library caused (draft changes): cached rects go stale. */
    invalidateMeasurements: measurer.invalidate,
  };
  return manager;
}
