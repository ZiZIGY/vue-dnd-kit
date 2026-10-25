/**
 * Sensors: what turns input into drags (`DnDProvider`'s `sensors`, `useSensor`). A sensor
 * only tells the provider "drag this item from here", then where it moved and that it
 * dropped or cancelled; the provider runs every check and the rest of the drag.
 */

import type { ActivationConstraint, Coordinates, DnDStatus, Key, PointerKind, SensorType } from './primitives';
import type { DnDProviderProps } from './provider';

/** Arrow of a keyboard step. */
export type SensorDirection = 'up' | 'down' | 'left' | 'right';

/**
 * A position in a sortable list, for `SensorDrag.place()` (and `moveItem` of
 * `@vue-dnd-kit/actions`). Lists only: trees place items by their own keys.
 */
export interface SortablePosition {
  /** Id of the list (`SortableListOptions.id`). Default: the list the item is in. */
  list?: Key;
  /**
   * Index the item ends up at, counted without the item itself (a multi-drag block
   * counts once). Clamped to the list; default: the end.
   */
  index?: number;
}

/** What a sensor asks for when its input wants to drag (`SensorContext.activate()`). */
export interface SensorActivation {
  /**
   * Where the input landed: an element inside a draggable, or the id of a draggable.
   * An element must belong to this provider; for `'pointer'` drags it must be on the
   * handle when there is one and not on an interactive child (a button, an input), for
   * `'keyboard'` drags it must be the draggable's focus target (the handle, else the
   * draggable itself) and not an editable field. An id skips these checks: the drag
   * starts from the item wherever the input was.
   */
  target: Element | Key;
  /**
   * How the drag moves. `'pointer'` (default): it follows the points given to `move()`,
   * targets are hit-tested there, containers auto-scroll at their edges and the page
   * shows the grabbing cursor. `'keyboard'`: it moves by items with `step()` and
   * `place()` as arrow keys do, targets are revealed instead of auto-scrolled, and the
   * focus goes back to the item when it ends. `Active.sensor` tells which.
   */
  type?: SensorType;
  /** Where the drag starts, in viewport coordinates. Default: the center of the draggable. */
  point?: Coordinates;
  /**
   * The input event. It is handed to the draggable's `canDrag`: without one (a gamepad,
   * a programmatic drag), `canDrag` isn't asked. A `pointerType` of `'touch'` makes the
   * drag a touch drag (`haptics`).
   */
  event?: PointerEvent | KeyboardEvent;
  /**
   * What the drag waits for before it starts (`useDnD().status` is `'activating'` until
   * then, with its progress). A pointer kind reads the draggable's `activation` option
   * for it, then the provider's, then the defaults (mouse and pen 4px, at once on a
   * handle; touch a 200ms long press with 5px tolerance). A constraint is used as it
   * is. Default: none, the drag starts at once.
   */
  activation?: PointerKind | ActivationConstraint;
  /** The drag started, after its activation: e.g. capture the pointer. */
  onStart?(drag: SensorDrag): void;
  /** The drag is over: its activation was aborted, or it dropped or was cancelled (by anyone). */
  onEnd?(drag: SensorDrag): void;
}

/**
 * - `'pending'`: waiting for the activation constraint;
 * - `'dragging'`: from the start until the drop is decided or the drag is cancelled;
 * - `'ended'`: the activation was aborted, or the drag dropped or was cancelled, by the
 *   sensor or by anything else (Escape, a hidden tab, `useDnD().cancel()`, the provider
 *   unmounting).
 */
export type SensorDragState = 'pending' | 'dragging' | 'ended';

export interface SensorStepOptions {
  /** The key press, handed to monitors' `getKeyboardCoordinates`. Default: a keydown of the arrow key. */
  event?: KeyboardEvent;
  /** A bigger step in free drags (as Shift). Default: `event.shiftKey`. */
  fast?: boolean;
}

/**
 * One drag of a sensor, from `activate()` until it ends. Every call is ignored once it
 * no longer applies: moves before the start or after the end, a second `drop()`.
 */
export interface SensorDrag {
  /** Id of the dragged item. */
  readonly id: Key;
  readonly type: SensorType;
  readonly state: SensorDragState;
  /** The drag started, even if it has ended since (the pointer sensor swallows the click that follows it). */
  readonly started: boolean;
  /**
   * The input moved. While pending, the activation constraint is checked (moving past its
   * tolerance aborts it); while dragging, the drag goes there. Pointer drags take one
   * position per frame; keyboard drags move at once, after the steps before them.
   */
  move(point: Coordinates): void;
  /**
   * Keyboard drags: one arrow step, as the keyboard sensor's arrow keys do (the next item
   * of a list, the next accepting target in `'droppables'` mode, or `keyboard.step`
   * pixels). Steps queue: each runs once the one before has rendered, and a repeated key
   * (`event.repeat`) is skipped while one still resolves. Pointer drags ignore it.
   */
  step(direction: SensorDirection, options?: SensorStepOptions): Promise<void>;
  /**
   * Puts the item at a position of a sortable list, as keyboard moves do (other lists
   * take it only if they accept it), and moves the drag to its new place. Resolves
   * `false` when no list takes it there. Queued like `step()` in keyboard drags.
   */
  place(position: SortablePosition): Promise<boolean>;
  /**
   * Drops: a pending activation is aborted instead. Resolves once the drag has ended and
   * landed: `true` when the drop went through, `false` when it was refused (a target,
   * `onBeforeDrop`) or there was nothing to drop.
   */
  drop(): Promise<boolean>;
  /** Cancels the drag (it flies back), or aborts a pending activation. */
  cancel(): void;
}

/** What a sensor gets from the provider it runs in. */
export interface SensorContext {
  /** The provider's props (e.g. `activation`, `keyboard`). Read them when needed: they may change. */
  readonly props: Readonly<DnDProviderProps>;
  /** The provider's drag status, whichever sensor runs the drag. */
  readonly status: DnDStatus;
  /**
   * The provider's drag, pending or dragging, whichever sensor started it; `null` when
   * there is none. Sensors may drive each other's drags: the keyboard sensor moves and
   * drops every keyboard drag, e.g. one a "Move" button picked up (`@vue-dnd-kit/actions`).
   */
  readonly drag: SensorDrag | null;
  /**
   * Asks to drag an item. The provider checks that it is idle (one drag at a time, none
   * while a drop lands), that the target is a draggable of its own that isn't disabled,
   * where the input landed (see `target`) and the draggable's `canDrag`, then waits for
   * the activation constraint and starts the drag. Returns the drag (pending, or already
   * dragging when there is nothing to wait for), or `null` when no drag may start.
   */
  activate(activation: SensorActivation): SensorDrag | null;
  /** Cancels the provider's drag or pending activation, whichever sensor runs it (Escape, a hidden tab). */
  cancel(): void;
}

/**
 * Input that starts drags: pointer, keyboard, or your own (a gamepad, an on-screen
 * joystick, voice, scripted drags). `setup` runs once per provider, in the browser only,
 * inside an effect scope that ends with the provider (or when the sensor leaves
 * `sensors`, or the component that called `useSensor` unmounts). Register listeners
 * with `useEventListener` or return a cleanup; a drag still running then is cancelled.
 *
 * To wrap a sensor, run its `setup` with a context of your own. `Object.create(context, {
 * activate: { value: … } })` keeps the live getters (`status`, `drag`, `props`): a spread
 * would freeze them.
 */
export interface Sensor {
  /** For debugging. */
  name?: string;
  setup(context: SensorContext): void | (() => void);
}
