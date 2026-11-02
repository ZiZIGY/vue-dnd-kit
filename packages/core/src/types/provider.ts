/** `DnDProvider`: its props, the context it shares, and what its overlay shows. */

import type { TransitionProps } from 'vue';
import type { ActivationOptions, DnDStatus, Key } from './primitives';
import type { Active, DnDEndEvent, DnDEvent, DragItem, DragMode, DropDestination, Over } from './drag';
import type { AutoAnimation, DropAnimation, LayoutAnimation } from './animation';
import type { CollisionDetection, Modifier } from './collision';
import type { Sensor } from './sensor';

// ─── Provider ──────────────────────────────────────────────────────────────────

/** A place in a sortable list or tree (its visible rows): `index` counts from 0, out of `length`. */
export interface AnnouncedPosition {
  /** Id of the list or tree. */
  list: Key;
  /** The list's `label`, what people call it. */
  label?: string;
  /** The place, from 0: the built-in texts say `index + 1`. */
  index: number;
  /** How many places the list has. */
  length: number;
}

/**
 * What an announcement is about, beyond the event: for texts of your own (another
 * language, other words) that say what the built-in ones say.
 */
export interface AnnouncementContext {
  /**
   * In a sortable list or tree: where the dragged items are. At the start, where they
   * were picked up; while moving, where they would land (none outside the lists); at the
   * end, where they landed, or where they went back to.
   */
  position?: AnnouncedPosition;
  /** A swap: the item exchanged with the dragged one, and where it is now. */
  partner?: { key: Key; label?: string; position: AnnouncedPosition };
  /** How many items the drag carries. */
  count: number;
  /** The drag copies (`group.pull: 'clone'`, the copy modifier). */
  copy: boolean;
}

/**
 * Texts for screen readers, per event. Return `undefined` for the built-in text, `''` for
 * none. `context` has the positions the built-in texts of sortable lists speak.
 *
 * A text is spoken by the provider's live region (moves once the drag rests for 500 ms);
 * `undefined` leaves the event to the next source (the texts of integrations such as
 * sortable positions, then the defaults). A move isn't announced for the target found at
 * pickup: nothing moved yet.
 */
export interface Announcements {
  /** A drag started. */
  onDragStart(event: DnDEvent, context: AnnouncementContext): string | undefined;
  /** The drag moved over another target, or to another place in a list (once it rests for 500 ms). */
  onDragOver(event: DnDEvent, context: AnnouncementContext): string | undefined;
  /** The drop went through, or the drag ended outside every target. */
  onDragEnd(event: DnDEndEvent, context: AnnouncementContext): string | undefined;
  /** The drag was cancelled, or its drop refused. */
  onDragCancel(event: DnDEvent, context: AnnouncementContext): string | undefined;
  /** `onBeforeDrop` answered `'continue'`: the drag goes on. */
  onDragResume(event: DnDEvent, context: AnnouncementContext): string | undefined;
}

/** An integration's texts (sortable lists), and the context it knows for the provider's own. */
export interface Announcer extends Partial<Announcements> {
  describe?(name: keyof Announcements, event: DnDEvent): Partial<AnnouncementContext> | undefined;
}

/** Keyboard drags (the provider's `keyboard`): their keys, and the step of free drags. */
export interface KeyboardOptions {
  /**
   * The keys that pick up (`start`), drop and cancel, as `KeyboardEvent.code` (`'Space'`,
   * `'KeyW'`) or `.key` (`'Enter'`, `'w'`). Default: Space and Enter pick up and drop,
   * Escape cancels. The arrows always move.
   */
  keys?: { start?: string[]; drop?: string[]; cancel?: string[] };
  /** Pixels per arrow press for free (non-sortable) drags. Default 25. */
  step?: number;
}

/** How containers scroll when a drag nears their edges (the provider's `autoScroll`). */
export interface AutoScrollOptions {
  /** Edge zone as a fraction of the container size. Default 0.2 (clamped to 24–96px). */
  threshold?: number;
  /** Maximum speed in px per 16ms frame. */
  maxSpeed?: number;
  /**
   * Speed in px per frame with the pointer at the container's edge: slower inside the edge
   * zone, faster past the edge, up to `maxSpeed`. Default 10.
   */
  acceleration?: number;
}

/**
 * A vibration (`navigator.vibrate`): its length in ms or an on/off pattern. `true` is the
 * default one (10ms; `[20, 40, 20]` for `refuse`), `false` or `0` none.
 */
export type HapticPattern = boolean | number | number[];

/**
 * When touch drags vibrate. Only drags started by touch do; where the browser can't
 * vibrate (iOS Safari) or blocks it (no tap on the page yet), nothing happens.
 */
export interface HapticsOptions {
  /** The drag starts, after the long press. Default `true`. */
  start?: HapticPattern;
  /** The drag enters a drop target (a list, a zone) that accepts it. Default `false`. */
  enter?: HapticPattern;
  /** The drop goes through. Default `false`. */
  drop?: HapticPattern;
  /** The drop is refused (by a target or `onBeforeDrop`) and the items fly back. Default `false`. */
  refuse?: HapticPattern;
}

/**
 * Props of `DnDProvider`. Most are read when the provider needs them: change one, and the
 * next drag uses it.
 */
export interface DnDProviderProps {
  /** How the target under the drag is chosen. Default `pointerFirst`; another built-in (`closestCorners`) or your own. */
  collision?: CollisionDetection;
  /** Modifiers for every drag, applied first: those of drag areas, draggables and lists come after. */
  modifiers?: Modifier[];
  /** Default FLIP animation for sortable lists. */
  animation?: LayoutAnimation;
  /**
   * How the overlay lands on drop and flies back on cancel, when nothing closer sets one:
   * the drop target's `overDropAnimation` comes first, then the dragged item's own (or its
   * list's), then this one.
   */
  dropAnimation?: DropAnimation;
  /** Default `animateChanges` of sortable lists and trees: changes of their items that no drag made. Off by default. */
  animateChanges?: AutoAnimation;
  /**
   * Scrolls containers and the page when a drag nears their edges. Default `true`; options
   * tune it, `false` turns it off. Lists, trees and drag areas can override it.
   */
  autoScroll?: boolean | AutoScrollOptions;
  /**
   * What a press must do before it becomes a drag, per pointer kind (see
   * `ActivationOptions` for the defaults). Drag areas, lists, trees, items and draggables
   * can override it.
   */
  activation?: ActivationOptions;
  /** Keyboard drags: their keys and step. `false` turns them off; Escape still cancels any drag. */
  keyboard?: KeyboardOptions | false;
  /**
   * What turns input into drags. Default `[pointerSensor, keyboardSensor]`: leave one out,
   * wrap or replace it, or add your own (`defineSensor`). The keyboard sensor also cancels
   * any drag with Escape; `keyboard: false` turns its drags off but keeps that. The list
   * may change at any time: sensors that leave it stop, cancelling their drag.
   */
  sensors?: Sensor[];
  /**
   * Vibration for touch drags. Default: a short one when a drag starts after the long
   * press; an object adds others (`enter`, `drop`, `refuse`); `false` turns them all off.
   */
  haptics?: boolean | HapticsOptions;
  /** Key (KeyboardEvent.key) that turns a move into a copy. Default `'Alt'`; `null` disables. */
  copyModifier?: string | null;
  /**
   * Where the overlay renders: a selector or an element. Default `'body'`. A modal
   * `<dialog>` sits above the rest of the page: drags inside one need it there.
   */
  overlayTo?: string | HTMLElement;
  /**
   * Overlay size while dragging. `'slot'` (default): it follows the slot the item will
   * land in, so over another list it takes the size of that list's items, and the drop
   * needs no resize. It resizes around the pointer, which stays at the same fraction of
   * the box. `'source'`: it keeps the dragged element's size. The default overlay
   * content re-lays out at the new size; it is never scaled.
   */
  overlayFit?: 'slot' | 'source';
  /**
   * Multi-drag: how many dragged items get a clone at pickup, the grabbed one and the
   * others next to it in drop order. Default 5; `'all'` clones every one that is rendered.
   * The default overlay shows the clones and counts the rest (`+N`); in a layout of your
   * own, `DragPreview` renders its slot for an item without one. Every clone flies: back to
   * its item on a cancel, to its slot on a drop, into the zone a drop goes into, one after
   * another. The clones are taken together, one layout per snapshot pass for all, but each
   * costs reading its styles: mind long items on slow phones.
   */
  overlayPreviews?: number | 'all';
  /**
   * How the overlay changes from one component to another during a drag (a drop target's
   * `overOverlay` takes over, an `overlay` ref is switched): `true` (default) crossfades them
   * in 150 ms, `false` swaps them at once, and an object is the props of a Vue
   * `<Transition>` around the content's root (`name`, `mode`, JS hooks for GSAP or
   * motion). Without `mode: 'out-in'` both show at once: give the leaving one
   * `position: absolute` (`.<name>-leave-active`) so they stack in the box.
   */
  overlayTransition?: boolean | TransitionProps;
  /**
   * Classes for the overlay's content (`[data-dnd-overlay-content]`), the element that
   * fills the overlay box: the one to animate as a whole while the library moves and
   * sizes the box. A transition on it runs from `@starting-style` as the drag picks up,
   * and back as it lands (`[data-dnd-overlay='dropping']`): the drop waits for it. Plain
   * CSS reaches it outside `<style scoped>` (or with `:global(...)`), Tailwind with
   * `starting:` and `in-data-[dnd-overlay=dragging]:`.
   */
  overlayClass?: string | Record<string, boolean> | Array<string | Record<string, boolean>>;
  /** Own texts for some events (see `Announcements`); `false` keeps the live region silent. */
  announcements?: Partial<Announcements> | false;
  /**
   * How to drag with the keyboard, read out by screen readers for every draggable (its
   * `aria-describedby`). Default: English instructions for Space, Enter, the arrows and Escape.
   */
  screenReaderInstructions?: string;
  /**
   * Inject the default looks: zero-specificity, layered CSS that dims placeholders and the
   * items a multi-drag leaves in place (`opacity: 0.4`). Default `true`; `false` leaves
   * the looks to you. What drags need is injected either way: no text selection and no
   * scroll anchoring while dragging (virtual lists rely on it), the drag cursor
   * (`--dnd-cursor`), and no link callout on a long press on iOS.
   */
  defaultStyles?: boolean;
}

declare const dndContext: unique symbol;

/**
 * A provider as `useDnDContext()` returns it, to hand to `provideDnDContext()`: another
 * Vue app (e.g. one mounted in a shadow root) then works with the same provider. Opaque:
 * it has no public members, so it never changes with the library's internals.
 */
export interface DnDContext {
  readonly [dndContext]: true;
}

/**
 * What the overlay shows: the props of the provider's `#overlay` slot and of overlay
 * components (`overlay` option of draggables, sortable items, lists and trees).
 */
export interface OverlaySlotProps {
  /** The drag. */
  active: Active;
  /** Every dragged item, the primary one first: one overlay for the whole multi-drag. */
  items: DragItem[];
  /**
   * The drop target under the drag. While a decided drop animates, the target it lands
   * on (as it was at the drop); `null` while a cancelled drag flies back.
   */
  over: Over | null;
  /** Whether `over` accepts the dragged items; `false` when over nothing. */
  accepted: boolean;
  /** `'dragging'`, then `'dropping'` while the overlay lands (or flies back). */
  status: DnDStatus;
  /** What a drop would do now (see `DnDEvent.mode`): e.g. show a plus while it copies. */
  mode: DragMode;
  /**
   * Where a drop would put the dragged items now, in a sortable list or tree: e.g. tint
   * the overlay by the folder a tree drag would go into. Outside every target it is the
   * slot's place, where `dropOutside: 'placeholder'` (the default) keeps them. `null` when
   * the drop would put them in no list: over a plain drop target, over a list that refuses
   * them, outside with `dropOutside: 'cancel'` or `'remove'`. While a decided drop
   * animates, the place it lands on.
   */
  to: DropDestination | null;
}

/**
 * Props of an overlay component, for `defineProps<OverlayProps>()`.
 *
 * The component renders inside the overlay box, which follows the slot size
 * (`overlayFit: 'slot'`) and animates it on drop. Give the root `width: 100%` (and
 * `height: 100%`) to follow that size; a fixed size keeps the component's own.
 */
export type OverlayProps = OverlaySlotProps;

/**
 * Props of `DragPreview`: the default clone of one dragged item, for custom overlays (an
 * `overlay` component or the provider's `#overlay` slot) that lay out several items
 * themselves, e.g. `<DragPreview v-for="item in items" :key="item.id" :id="item.id" />`.
 *
 * Clones are taken at pickup, of the grabbed item and of the others next to it in drop
 * order, as many as the provider's `overlayPreviews` (5 by default; those that are rendered
 * then). For any other item `DragPreview` renders its
 * default slot in an element that takes `class` and `style` as a clone's does, or nothing
 * without one. The clone fills the element, which has the item's size at
 * pickup, set inline: change it with `style` (`:style="{ width: '100%', height: '100%' }"`),
 * which falls through; a class can't override it.
 *
 * In a sortable multi-drag (`multiple: 'group'` or `'gaps'`), the preview of an item other
 * than the grabbed one lands on that item's slot with the drop (back on its place when
 * cancelled), from wherever the layout put it: wrappers turned or scaled with `transform`
 * are undone on the way, its size animates as width and height. Style the preview itself
 * (corners, shadow): its wrappers stay in the box. Items without a clone fade in instead.
 * Dropped into a zone (not a list), the previews go into it one after another, the box
 * last.
 */
export interface DragPreviewProps {
  /** Id of a dragged item: one of `items` in `OverlayProps`. */
  id: Key;
}
