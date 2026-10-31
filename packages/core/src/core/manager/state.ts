/**
 * The state of one provider's manager. `createDnDManager` builds a `ManagerContext` and
 * hands it to each of its modules; what a module alone needs stays in its closure.
 * No provider's state lives at module level, so providers on one page stay independent
 * (`owners` in `registry.ts` is shared on purpose: it tells their elements apart).
 */

import { shallowReactive, shallowRef, type Component } from 'vue';
import type {
  Active,
  Coordinates,
  DnDEvent,
  DnDProviderProps,
  DnDStatus,
  DragMode,
  DropAnimation,
  DropDestination,
  Key,
  LayoutAnimation,
  Over,
  Rect,
  Size,
} from '../../types';
import type { landOverlayItems } from '../../animation/drop';
import type { Measurer } from '../measure';
import type { Detection } from './detection';
import type { Events } from './events';
import type { Follow } from './follow';
import type { FrameLoop } from './frame';
import type { Overlay, PreviewSource } from './overlay';
import type { RegistryLookups, RegistryMembers } from './registry';

/**
 * Multi-drag layout of the default overlay, set by the sortable layer: every dragged id
 * in drop order, along `axis`, `gap` apart.
 */
export interface OverlayColumn {
  ids: Key[];
  axis: 'x' | 'y';
  gap: number;
  /** `'column'` (default): the items in a row along `axis`. `'pile'` (grids): stacked behind the active one. */
  layout?: 'column' | 'pile';
  /** The list's layout animation: the clones gather into the column with it. */
  animation?: LayoutAnimation;
  /** Renders the column in the default overlay. The sortable layer brings it: plain drags don't bundle it. */
  preview: Component;
  /** Lands the overlay's clones (`overlayItems`: the column's, custom layouts' `DragPreview`s) with the drop. */
  land: typeof landOverlayItems;
}

export const NO_LANDINGS: ReadonlyMap<Key, Key> = new Map();

/**
 * An ended drag whose overlay is landing (`session.ts`): what the box shows and where it
 * goes, as the drag left them. The provider is free for the next drag meanwhile; the
 * overlay renders a box per flight.
 */
export interface Flight {
  /** The drag's session: the overlay keys a drag's box by it, so the box carries on as the flight's. */
  id: number;
  reason: 'drop' | 'cancel';
  /** What `onDragEnd` (a `DnDEndEvent`) or `onDragCancel` got; `onDragSettle` gets it too. */
  event: DnDEvent;
  active: Active;
  mode: DragMode;
  /** The target it was dropped on: what it lands on; `null` on a cancel. */
  over: Over | null;
  /** Where the drop went, as the overlay's `to` said at the release. */
  to: DropDestination | null;
  /** The row the overlay lands on when it isn't the active item's (a copy, a created item). */
  landingKey: Key | null;
  /** The slot hidden until the overlay is there: the active item's, its copy's; `null` for none. */
  slot: Key | null;
  /** Multi-drag: slot → dragged id of the other items landing (see `landings`). */
  landings: ReadonlyMap<Key, Key>;
  column: OverlayColumn | null;
  /** The clones taken at pickup (`DragPreview`), and the ids that have one, in drop order. */
  previews: ReadonlyMap<Key, PreviewSource>;
  previewIds: readonly Key[];
  /** The drag's own overlay component (`null`: the provider's slot or the clone). */
  component: Component | null;
  /** The drop target's overlay around it, if it has one. */
  target: Component | undefined;
  /** The drag's own `dropAnimation` (the item's, its list's). */
  dropAnimation: DropAnimation | undefined;
  fitSize: Size | null;
  /** Where the box was left (viewport). */
  rect: Rect;
  /** Clones of the other items in the box, which land on their own slots. */
  items: Map<Key, HTMLElement>;
  /** The box. */
  element: HTMLElement | null;
  /** Keeps the box on what it lands on while the page scrolls. */
  follow: Follow;
  /** Fades of items without a clone, kept until their placeholder marks are gone. */
  fades: Animation[];
  /** Landed, or the provider went away: its awaited steps do nothing. */
  done: boolean;
}

/** The reactive drag state: what the overlay, the composables and `useDnD()` render. */
export const createDragState = () => ({
  status: shallowRef<DnDStatus>('idle'),
  active: shallowRef<Active | null>(null),
  over: shallowRef<Over | null>(null),
  pointer: shallowRef<Coordinates | null>(null),
  /**
   * Ended drags whose overlay is landing, oldest first. A decided drop hands its overlay
   * to a flight and clears the drag state (`active`, `over` read `null`), so the next drag
   * can start while it lands.
   */
  flights: shallowRef<readonly Flight[]>([]),
  transform: shallowRef<Coordinates>({ x: 0, y: 0 }),
  /**
   * How far the content the drag started in has moved on screen since the start (see
   * `ModifierArgs.containerShift`): axis locks hold the other axis there, and an element
   * dragged without an overlay subtracts it, as it moves with that content.
   */
  containerShift: shallowRef<Coordinates>({ x: 0, y: 0 }),
  activationProgress: shallowRef(0),
  isAutoScrolling: shallowRef(false),
  /** The containers auto-scroll moved in its last frame (the window aside): a new array when they change. */
  autoScrollers: shallowRef<readonly Element[]>([]),
  overlayElement: shallowRef<HTMLElement | null>(null),
  /** Size the overlay box has while dragging (see `updateFitSize`). */
  fitSize: shallowRef<Size | null>(null),
  announcement: shallowRef(''),
  selection: shallowReactive(new Set<Key>()),
  /** What a drop would do, set by the sortable layer (overlay slot `mode`). */
  mode: shallowRef<DragMode>('move'),
  /** Key whose element the overlay lands on, when it isn't the active id (copies, external items). */
  landingKey: shallowRef<Key | null>(null),
  /**
   * Multi-drag, set by the sortable layer: slot key → id of the dragged item (other than
   * the active one) that lands there. While dragging: the placeholders of a `'group'`
   * block; after the commit: where each accepted item went (copies included).
   */
  landings: shallowRef<ReadonlyMap<Key, Key>>(NO_LANDINGS),
  /** Multi-drag layout of the default overlay; `null`: the active item with a count (a pile of plain draggables). */
  overlayColumn: shallowRef<OverlayColumn | null>(null),
  /** Clones of the other items in the default overlay's column, by id: each lands on its own slot. */
  overlayItems: new Map<Key, HTMLElement>(),
});

export type DragState = ReturnType<typeof createDragState>;

/**
 * Everything the manager's modules share. They reach each other through it when they
 * run, never while they are created: `createDnDManager` puts every module in place
 * before anything can call one.
 */
export interface ManagerContext extends DragState, RegistryLookups, RegistryMembers {
  props: DnDProviderProps;
  measurer: Measurer;
  /** Pointer position at drag start. */
  origin: Coordinates;
  /** The drag was started by touch: it vibrates (`haptics`). */
  touch: boolean;
  /** Pointer position as the sensor reported it, before modifiers. */
  raw: Coordinates;
  /**
   * Topmost element under the pointer at the last target detection, for auto-scroll;
   * `null` while a modifier moves the point away from the pointer.
   */
  pointerElement: Element | null;
  /** Takes the page out of drag mode (cursor, text selection); set while it is in it. */
  restoreDocument: (() => void) | null;

  events: Events;
  overlay: Overlay;
  detection: Detection;
  loop: FrameLoop;
}
