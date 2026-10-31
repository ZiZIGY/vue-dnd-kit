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
  DnDProviderProps,
  DnDStatus,
  DragMode,
  Key,
  LayoutAnimation,
  Over,
  Size,
} from '../../types';
import type { landOverlayItems } from '../../animation/drop';
import type { Measurer } from '../measure';
import type { Detection } from './detection';
import type { Events } from './events';
import type { FrameLoop } from './frame';
import type { Overlay } from './overlay';
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

/** The reactive drag state: what the overlay, the composables and `useDnD()` render. */
export const createDragState = () => ({
  status: shallowRef<DnDStatus>('idle'),
  active: shallowRef<Active | null>(null),
  over: shallowRef<Over | null>(null),
  pointer: shallowRef<Coordinates | null>(null),
  /**
   * The drop is decided (committed or cancelled) and only the overlay animation is left.
   * The drag state is over: `over` and `pointer` are cleared, accept rules stop running
   * (the data has already changed under them), and `useDnD().active` reads `null`.
   */
  settling: shallowRef(false),
  /**
   * What a decided drop lands on (`over` at the drop; `null` when it was cancelled): the
   * overlay keeps showing it while it flies there, after `over` itself is cleared.
   */
  dropTarget: shallowRef<Over | null>(null),
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
  /** Multi-drag layout of the default overlay; `null`: the active item with a count. */
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
