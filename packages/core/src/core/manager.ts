/**
 * The drag session state machine: idle → activating → dragging → dropping → idle,
 * plus idle → selecting → idle while a selection area draws its rubber band.
 *
 * Invariants (rfcs/0001-v3.md §13):
 * - one session per provider; input during `dropping` is ignored;
 * - every exit path (drop, reject, cancel, callback error, provider unmount)
 *   restores the document and emits exactly one terminal event;
 * - items are identified by id, never by element: elements may be recreated mid-drag.
 */

import { nextTick, shallowReactive, shallowRef, type Component } from 'vue';
import type {
  ActivationOptions,
  Active,
  AutoScrollOptions,
  Announcements,
  BeforeDropResult,
  CollisionCandidate,
  Coordinates,
  DnDEndEvent,
  DnDEvent,
  DnDMonitor,
  DnDProviderProps,
  DnDStatus,
  DragItem,
  DragMode,
  DragSource,
  Key,
  LayoutAnimation,
  Modifier,
  Over,
  Rect,
  SensorType,
  Size,
} from '../types';
import {
  containsPoint,
  getFraction,
  getLayoutRect,
  getRect,
  getWindowRect,
  offsetRect,
  prefersReducedMotion,
  resizeAround,
  unionRect,
} from '../animation/layout';
import { fadeInPlace, runDropAnimation, type landOverlayItems, type OverlayItemLanding } from '../animation/drop';
import { createTargetStabilizer, pointerFirst } from './collision';
import { createMeasurer } from './measure';
import { defaultAnnouncements } from './a11y';
import { markDocumentDragging } from './styles';
import { clonePreview } from './clone';
import { containsComposed, elementFromPoint, isFocusLost, nextFrame, parentOf } from '../utils/dom';

export interface DraggableEntry {
  id: Key;
  getElement(): HTMLElement | null;
  /** Handle element or selector; `null` when the whole element is the handle. */
  getHandle(): HTMLElement | string | null;
  /** Element that receives focus and keyboard activation. */
  getFocusTarget(): HTMLElement | null;
  getData(): unknown;
  getTypes(): string[];
  isDisabled(): boolean;
  getActivation?(): ActivationOptions | undefined;
  canDrag?: (event: PointerEvent | KeyboardEvent) => boolean;
  /** `false`: no overlay; `true`: the provider's slot or the clone; a component (`markRaw`): rendered instead. */
  getOverlay(): boolean | Component;
  /** Modifiers of this draggable (or its list), applied after the provider's. */
  getModifiers?(): Modifier[] | undefined;
  /** Arrow keys in free keyboard drags: move by pixels (default) or jump between accepting drop targets. */
  getKeyboard?(): 'pixels' | 'droppables' | undefined;
  /** Sortable integration: the item object behind this draggable. */
  getItem?(): unknown;
  /** Sortable integration: container used by `restrictToParent`. */
  getContainer?(): HTMLElement | null;
}

export interface DroppableEntry {
  id: Key;
  getElement(): HTMLElement | null;
  getData(): unknown;
  isDisabled(): boolean;
  accepts(active: Active): boolean;
  getPriority(): number;
  /** A sortable list or tree: what drops on it is shown in it, as a slot. */
  sortable?: boolean;
  onDragEnter?(event: DnDEvent): void;
  onDragLeave?(event: DnDEvent): void;
  onBeforeDrop?(event: DnDEvent): BeforeDropResult | Promise<BeforeDropResult>;
  onDrop?(event: DnDEvent): void;
}

/** A clone taken at pickup and the rect of its source then (`DragPreview`). */
export interface PreviewSource {
  element: HTMLElement;
  rect: Rect;
}

/**
 * Multi-drag layout of the default overlay, set by the sortable layer: every dragged id
 * in drop order, along `axis`, `gap` apart.
 */
export interface OverlayColumn {
  ids: Key[];
  axis: 'x' | 'y';
  gap: number;
  /** The list's layout animation: the clones gather into the column with it. */
  animation?: LayoutAnimation;
  /** Renders the column in the default overlay. The sortable layer brings it: plain drags don't bundle it. */
  preview: Component;
  /** Lands the overlay's clones (`overlayItems`: the column's, custom layouts' `DragPreview`s) with the drop. */
  land: typeof landOverlayItems;
}

/**
 * Integration rule for a drop target, asked on every target detection: `false` leaves it
 * out of this one (sortable: a target inside an item counts only in the item's middle).
 */
export type TargetRule = (entry: DroppableEntry, element: HTMLElement, point: Coordinates, active: Active) => boolean;

/** Per-container auto-scroll override (e.g. `SortableListOptions.autoScroll`). */
export interface AutoScrollEntry {
  getElement(): Element | null;
  /** Read when the drag starts; `undefined`: no override. */
  getOptions(): boolean | AutoScrollOptions | undefined;
}

type MonitorHandler = Exclude<keyof DnDMonitor, 'onBeforeDrop' | 'getKeyboardCoordinates'>;

/** Elements owned by any provider, so nested providers ignore each other's items. */
const owners = new WeakMap<Element, object>();

const OVER_ANNOUNCE_DELAY = 500;

/**
 * Most items cloned at pickup: the grabbed one and the others next to it in drop order.
 * Cloning reads computed styles, the most expensive part of a pickup, and a column of
 * more clones covers most of the screen; the overlay counts the rest instead.
 */
const MAX_PREVIEWS = 5;

const NO_LANDINGS: ReadonlyMap<Key, Key> = new Map();

export type DnDManager = ReturnType<typeof createDnDManager>;

export function createDnDManager(props: DnDProviderProps) {
  const status = shallowRef<DnDStatus>('idle');
  const active = shallowRef<Active | null>(null);
  const over = shallowRef<Over | null>(null);
  const pointer = shallowRef<Coordinates | null>(null);
  /**
   * The drop is decided (committed or cancelled) and only the overlay animation is left.
   * The drag state is over: `over` and `pointer` are cleared, accept rules stop running
   * (the data has already changed under them), and `useDnD().active` reads `null`.
   */
  const settling = shallowRef(false);
  /**
   * What a decided drop lands on (`over` at the drop; `null` when it was cancelled): the
   * overlay keeps showing it while it flies there, after `over` itself is cleared.
   */
  const dropTarget = shallowRef<Over | null>(null);
  const transform = shallowRef<Coordinates>({ x: 0, y: 0 });
  const activationProgress = shallowRef(0);
  const isAutoScrolling = shallowRef(false);
  const overlayElement = shallowRef<HTMLElement | null>(null);
  /** Size the overlay box has while dragging (see `updateFitSize`). */
  const fitSize = shallowRef<Size | null>(null);
  const announcement = shallowRef('');
  const selection = shallowReactive(new Set<Key>());
  /** What a drop would do, set by the sortable layer (overlay slot `mode`). */
  const mode = shallowRef<DragMode>('move');
  /** Key whose element the overlay lands on, when it isn't the active id (copies, external items). */
  const landingKey = shallowRef<Key | null>(null);
  /**
   * Multi-drag, set by the sortable layer: slot key → id of the dragged item (other than
   * the active one) that lands there. While dragging: the placeholders of a `'group'`
   * block; after the commit: where each accepted item went (copies included).
   */
  const landings = shallowRef<ReadonlyMap<Key, Key>>(NO_LANDINGS);
  /** Multi-drag layout of the default overlay; `null`: the active item with a count. */
  const overlayColumn = shallowRef<OverlayColumn | null>(null);
  /** Clones of the other items in the default overlay's column, by id: each lands on its own slot. */
  const overlayItems = new Map<Key, HTMLElement>();

  const draggables = new Map<Key, DraggableEntry>();
  const droppables = new Map<Key, DroppableEntry>();
  const draggableIds = new WeakMap<Element, Key>();
  const monitors = new Set<DnDMonitor>();
  /** Monitors of library layers (see `addMonitor`). */
  const integrations = new Set<DnDMonitor>();
  const sourceResolvers = new Set<(active: Active) => DragSource | undefined>();
  const targetRules = new Set<TargetRule>();
  /** Integration announcers (sortable positions): after the user's `announcements`, before the defaults. */
  const announcers = new Set<Partial<Announcements>>();
  const activationAborts = new Set<() => void>();
  const autoScrollEntries = new Set<AutoScrollEntry>();
  /** Cancels the running rubber-band selection (`status === 'selecting'`). */
  const selectionAborts = new Set<() => void>();

  let origin: Coordinates = { x: 0, y: 0 };
  /** Where the pointer holds the overlay box, as fractions of its size: it resizes around this point. */
  let grab: Coordinates = { x: 0, y: 0 };
  let raw: Coordinates = { x: 0, y: 0 };
  let containerRect: Rect | null = null;
  let frame = 0;
  /** Clones taken at pickup by id (`DragPreview`), and the ids that have one, in drop order. */
  let previews = new Map<Key, PreviewSource>();
  let previewIds: Key[] = [];
  let previewEnabled = false;
  /** Fades of items without a clone, kept until their placeholder marks are gone. */
  let fades: Animation[] = [];
  /** Overlay component of the drag, taken at start: the source may unmount mid-drag. */
  let overlayComponent: Component | null = null;
  /** Modifiers of the draggable the drag started from, taken at start like the overlay. */
  let sourceModifiers: readonly Modifier[] = [];
  let restoreDocument: (() => void) | null = null;
  let session = 0;
  let announceTimer: ReturnType<typeof setTimeout> | undefined;
  let lastAnnouncement = '';

  const measurer = createMeasurer({ onShadowScroll: () => scheduleFrame() });
  const stabilizer = createTargetStabilizer();
  /** Nesting depth of drop target elements among drop targets, per session. */
  let nesting = new WeakMap<Element, number>();
  /** Drop target elements in a dragged item or in a slot one lands in, per session. */
  let owned = new WeakMap<Element, boolean>();
  /** Pointer of the last target detection. */
  let detectedAt: Coordinates | null = null;
  /**
   * Topmost element under the pointer at the last target detection, for auto-scroll;
   * `null` while a modifier moves the point away from the pointer.
   */
  let pointerElement: Element | null = null;
  /** Scroll, resize or an external request since the last frame: detect even if the pointer stood still. */
  let refreshRequested = false;

  // ─── Registration ────────────────────────────────────────────────────────────

  const registerDraggable = (entry: DraggableEntry): (() => void) => {
    draggables.set(entry.id, entry);
    return () => {
      // A recreated element may already have registered the same id.
      if (draggables.get(entry.id) === entry) draggables.delete(entry.id);
    };
  };

  const registerDroppable = (entry: DroppableEntry): (() => void) => {
    droppables.set(entry.id, entry);
    return () => {
      if (droppables.get(entry.id) === entry) droppables.delete(entry.id);
    };
  };

  const bindDraggableElement = (element: Element, id: Key) => {
    draggableIds.set(element, id);
    owners.set(element, manager);
  };

  const unbindDraggableElement = (element: Element, id: Key) => {
    if (draggableIds.get(element) !== id) return;
    draggableIds.delete(element);
    owners.delete(element);
  };

  /** Closest draggable owned by this provider, walking up from the event target. */
  const findDraggable = (
    target: Element,
  ): { entry: DraggableEntry; element: HTMLElement } | null => {
    for (let element: Element | null = target; element; element = parentOf(element)) {
      const owner = owners.get(element);
      if (!owner) continue;
      if (owner !== manager) return null;
      const id = draggableIds.get(element);
      const entry = id == null ? undefined : draggables.get(id);
      return entry ? { entry, element: element as HTMLElement } : null;
    }
    return null;
  };

  /**
   * `integration`: a library layer (sortable groups). Its notifications run before the
   * others', so the user's `onDragEnd` sees the drop it wrote.
   */
  const addMonitor = (monitor: DnDMonitor, integration = false): (() => void) => {
    monitors.add(monitor);
    if (integration) integrations.add(monitor);
    return () => {
      monitors.delete(monitor);
      integrations.delete(monitor);
    };
  };

  const addSourceResolver = (resolver: (active: Active) => DragSource | undefined) => {
    sourceResolvers.add(resolver);
    return () => sourceResolvers.delete(resolver);
  };

  const addTargetRule = (rule: TargetRule) => {
    targetRules.add(rule);
    return () => targetRules.delete(rule);
  };

  /** Overrides auto-scroll for the scroll container of `getElement()` (the element or its closest scrollable ancestor). */
  const registerAutoScroll = (
    getElement: () => Element | null,
    getOptions: () => boolean | AutoScrollOptions | undefined,
  ): (() => void) => {
    const entry: AutoScrollEntry = { getElement, getOptions };
    autoScrollEntries.add(entry);
    return () => autoScrollEntries.delete(entry);
  };

  /** Extra announcers (sortable positions): after the provider's own texts, before the defaults. */
  const addAnnouncer = (announcer: Partial<Announcements>): (() => void) => {
    announcers.add(announcer);
    return () => announcers.delete(announcer);
  };

  // ─── Events ──────────────────────────────────────────────────────────────────

  const createEvent = (): DnDEvent => {
    const current = active.value!;
    const p = pointer.value ?? origin;
    let source: DragSource | undefined;
    for (const resolve of sourceResolvers) {
      source = resolve(current);
      if (source) break;
    }
    return {
      active: current,
      over: over.value,
      pointer: p,
      delta: { x: p.x - origin.x, y: p.y - origin.y },
      source,
    };
  };

  const emit = (name: MonitorHandler, event: DnDEvent | DnDEndEvent) => {
    // Integrations first (see `addMonitor`), each side in registration order.
    const ordered = [...monitors].sort((a, b) => Number(integrations.has(b)) - Number(integrations.has(a)));
    for (const monitor of ordered) {
      try {
        (monitor[name] as ((event: DnDEvent) => void) | undefined)?.(event);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const setAnnouncement = (text: string) => {
    // Screen readers only speak changes: repeating the same text needs a different string.
    announcement.value =
      text === lastAnnouncement && announcement.value === text ? `${text}\u00A0` : text;
    lastAnnouncement = text;
  };

  const announce = (name: keyof Announcements, event: DnDEvent = createEvent()) => {
    const custom = props.announcements;
    if (custom === false) return clearTimeout(announceTimer);
    type Announce = (this: unknown, event: DnDEvent) => string | undefined;
    let text: string | undefined;
    try {
      // The provider's own text wins, then announcers (sortable positions), then defaults.
      // `undefined`: not this source's business, the next one speaks; '': nothing to say.
      text = (custom?.[name] as Announce | undefined)?.call(custom, event);
      for (const announcer of announcers) {
        if (text !== undefined) break;
        text = (announcer[name] as Announce | undefined)?.call(announcer, event);
      }
      text ??= (defaultAnnouncements[name] as Announce).call(defaultAnnouncements, event);
    } catch (error) {
      // A throwing announcement must not break the session (§13).
      clearTimeout(announceTimer);
      console.error(error);
      return;
    }
    // Nothing new (e.g. the first target of a drag is where it started): neither speak
    // nor cancel what is pending.
    if (text === '') return;
    clearTimeout(announceTimer);
    if (!text) return;
    if (name === 'onDragOver') {
      // Debounced: only the target the pointer settles on is spoken, and only if it changed.
      announceTimer = setTimeout(() => {
        if (text !== lastAnnouncement) setAnnouncement(text);
      }, OVER_ANNOUNCE_DELAY);
    } else {
      setAnnouncement(text);
    }
  };

  // ─── Geometry ────────────────────────────────────────────────────────────────

  /**
   * The overlay box for a drag offset: the dragged element's rect moved by `offset`,
   * at the box's current size, resized around the grab point. The overlay, collision
   * and modifiers all place the box with this, so they never disagree.
   */
  const getOverlayRect = (current: Active, offset: Coordinates): Rect =>
    resizeAround(offsetRect(current.rect, offset.x, offset.y), fitSize.value ?? current.rect, grab);

  /** The provider's modifiers, then those of the draggable (or list) the drag started from. */
  const getModifiers = (): readonly Modifier[] =>
    sourceModifiers.length ? [...(props.modifiers ?? []), ...sourceModifiers] : (props.modifiers ?? []);

  const applyModifiers = (current: Active, offset: Coordinates): Coordinates => {
    let result = offset;
    for (const modifier of getModifiers()) {
      result = modifier({
        transform: result,
        active: current,
        activeRect: current.rect,
        overlayRect: getOverlayRect(current, result),
        origin,
        containerRect,
        windowRect: getWindowRect(),
        over: over.value,
      });
    }
    return result;
  };

  /**
   * Drop targets under the point: the topmost element (shadow roots included) and its
   * flat-tree ancestors. Higher priority first, then the deepest.
   */
  const hitTest = (point: Coordinates, byElement: Map<Element, DroppableEntry>): Key[] => {
    const hits: DroppableEntry[] = [];
    const top = elementFromPoint(point.x, point.y);
    pointerElement = point.x === raw.x && point.y === raw.y ? top : null;
    for (let element = top; element; element = parentOf(element)) {
      const entry = byElement.get(element);
      if (entry) hits.push(entry);
    }
    return hits
      .map((entry, depth) => ({ id: entry.id, priority: entry.getPriority(), depth }))
      .sort((a, b) => b.priority - a.priority || a.depth - b.depth)
      .map(({ id }) => id);
  };

  const depthOf = (element: Element, byElement: Map<Element, DroppableEntry>): number => {
    let depth = nesting.get(element);
    if (depth === undefined) {
      depth = 0;
      for (let parent = parentOf(element); parent; parent = parentOf(parent)) {
        if (byElement.has(parent)) {
          depth = depthOf(parent, byElement) + 1;
          break;
        }
      }
      nesting.set(element, depth);
    }
    return depth;
  };

  /**
   * Never drop items into themselves: a target in (or on) any dragged item, or in a slot
   * one lands in (a copy, a created item), is out for the whole drag.
   */
  const isOwned = (element: Element, current: Active): boolean => {
    let own = owned.get(element);
    if (own === undefined) {
      own = false;
      for (let node: Element | null = element; node && !own; node = parentOf(node)) {
        const id = draggableIds.get(node);
        own = id != null && (current.ids.includes(id) || id === landingKey.value || landings.value.has(id));
      }
      owned.set(element, own);
    }
    return own;
  };

  const detectOver = (current: Active, point: Coordinates): Over | null => {
    const candidates: CollisionCandidate[] = [];
    // Every target that could be one (nesting depth), and the ones the rules let in now.
    const all = new Map<Element, DroppableEntry>();
    const byElement = new Map<Element, DroppableEntry>();
    const elements = new Map<Key, HTMLElement>();
    for (const entry of droppables.values()) {
      if (entry.isDisabled()) continue;
      const element = entry.getElement();
      if (!element?.isConnected || isOwned(element, current)) continue;
      all.set(element, entry);
      let hidden = false;
      for (const rule of targetRules) hidden ||= !rule(entry, element, point, current);
      if (hidden) continue;
      byElement.set(element, entry);
      elements.set(entry.id, element);
      measurer.observe(element);
    }
    for (const [element, entry] of byElement) {
      // Fully clipped by a scroll container or the viewport: not hittable.
      const rect = measurer.measureVisible(element);
      if (rect) {
        candidates.push({ id: entry.id, rect, priority: entry.getPriority(), depth: depthOf(element, all) });
      }
    }
    const hits = hitTest(point, byElement);
    const detect = props.collision ?? pointerFirst;
    const ranked = detect({
      pointer: point,
      overlayRect: getOverlayRect(current, transform.value),
      candidates,
      hits,
    });

    const visible = new Set<Key>(hits);
    for (const candidate of candidates) visible.add(candidate.id);
    const id = stabilizer.resolve({
      pointer: point,
      previous: over.value?.id ?? null,
      next: ranked.find((key) => elements.has(key)) ?? null,
      exact: current.sensor === 'keyboard',
      isValid: (key) => visible.has(key),
      isGap: (parent, child) => {
        const parentElement = elements.get(parent)!;
        const childElement = elements.get(child);
        if (!childElement || parentElement === childElement) return false;
        if (!containsComposed(parentElement, childElement)) return false;
        // The pointer is within the bounds of the targets nested in `parent`, but over none.
        let bounds: Rect | null = null;
        for (const candidate of candidates) {
          const element = elements.get(candidate.id)!;
          if (element === parentElement || !containsComposed(parentElement, element)) continue;
          if (containsPoint(candidate.rect, point)) return false;
          bounds = bounds ? unionRect(bounds, candidate.rect) : candidate.rect;
        }
        return !!bounds && containsPoint(bounds, point);
      },
    });
    if (id == null) return null;
    const entry = droppables.get(id)!;
    const element = elements.get(id)!;
    return {
      id,
      data: entry.getData(),
      element,
      rect: measurer.measure(element),
      accepted: entry.accepts(current),
    };
  };

  // ─── Frame loop ──────────────────────────────────────────────────────────────

  /** A placeholder styled smaller than this share of the source (a drop line) keeps the source size on that axis. */
  const FIT_MIN_RATIO = 0.25;
  /** Overlay box resizes (a target list with other item sizes) glide instead of jumping. */
  const RESIZE_DURATION = 150;

  /**
   * Glide of `fitSize` to a new slot size. It runs in the frame loop rather than as a
   * CSS transition: the box resizes around the grab point, so its position depends
   * on its size, and collision and modifiers must see the box as it is shown.
   */
  let resize: { from: Size; to: Size; start: number } | null = null;

  /**
   * `overlayFit: 'slot'`: the overlay takes the size of the slot the item will land in,
   * so it matches the items of the list it hovers. Layout sizes (`offset*`) ignore
   * FLIP translates; each axis is taken on its own, so a thin custom placeholder
   * still passes its width.
   */
  const updateFitSize = (current: Active) => {
    // Without an overlay the element itself moves: it keeps its size.
    if (props.overlayFit === 'source' || !previewEnabled) return;
    const slot = draggables.get(landingKey.value ?? current.id)?.getElement();
    if (!slot?.isConnected) return;
    const size =
      slot instanceof HTMLElement
        ? { width: slot.offsetWidth, height: slot.offsetHeight }
        : getLayoutRect(slot);
    const { width: sourceWidth, height: sourceHeight } = current.rect;
    const width = size.width >= sourceWidth * FIT_MIN_RATIO ? size.width : sourceWidth;
    const height = size.height >= sourceHeight * FIT_MIN_RATIO ? size.height : sourceHeight;
    const previous = resize?.to ?? fitSize.value;
    if (previous && Math.abs(previous.width - width) < 0.5 && Math.abs(previous.height - height) < 0.5) {
      return;
    }
    const shown = fitSize.value;
    if (!shown || prefersReducedMotion()) {
      resize = null;
      fitSize.value = { width, height };
      return;
    }
    resize = { from: shown, to: { width, height }, start: performance.now() };
    requestFrame();
  };

  /** Moves `fitSize` along the running glide; asks for frames until it ends. */
  const stepResize = () => {
    if (!resize) return;
    const { from, to, start } = resize;
    const progress = (performance.now() - start) / RESIZE_DURATION;
    if (progress >= 1) {
      resize = null;
      fitSize.value = to;
      return;
    }
    // Ease-out: quick at first, settling on the slot size.
    const eased = 1 - (1 - progress) ** 3;
    fitSize.value = {
      width: from.width + (to.width - from.width) * eased,
      height: from.height + (to.height - from.height) * eased,
    };
    requestFrame();
  };

  const runFrame = () => {
    frame = 0;
    const current = active.value;
    if (status.value !== 'dragging' || !current) return;
    // Reorders render between frames: the slot may have moved into another list.
    updateFitSize(current);
    stepResize();
    const refresh = refreshRequested;
    refreshRequested = false;
    const offset = applyModifiers(current, { x: raw.x - origin.x, y: raw.y - origin.y });
    const point = { x: origin.x + offset.x, y: origin.y + offset.y };
    // A modifier moved the point off the pointer (it may hold it while the pointer moves on).
    if (point.x !== raw.x || point.y !== raw.y) pointerElement = null;

    // The target follows the pointer, scrolling and resizing, never a layout shift
    // alone: a frame where none of them changed (a repeated pointermove) does nothing.
    if (!refresh && detectedAt && point.x === detectedAt.x && point.y === detectedAt.y) return;
    // The first detection of the drag: the target found under the item at pickup isn't news.
    const pickup = !detectedAt;
    detectedAt = point;
    transform.value = offset;
    pointer.value = point;
    measurer.nextFrame();
    // Scrolling moves the content under the pointer: the hysteresis, which measures
    // pointer travel, no longer applies.
    if (refresh) stabilizer.reset();

    const previous = over.value;
    const next = detectOver(current, point);
    const changed = previous?.id !== next?.id || previous?.accepted !== next?.accepted;
    if (changed) over.value = next;
    else if (previous && next) previous.rect = next.rect;

    const event = createEvent();
    if (changed) {
      if (previous) droppables.get(previous.id)?.onDragLeave?.(event);
      if (next) droppables.get(next.id)?.onDragEnter?.(event);
      emit('onDragOver', event);
      if (!pickup) announce('onDragOver', event);
    }
    emit('onDragMove', event);
    // The move may have reordered (sortable): fit the slot once that rendered, even if
    // the pointer stops here and no further frame runs.
    void nextTick(() => {
      if (status.value === 'dragging' && active.value === current) updateFitSize(current);
    });
  };

  const requestFrame = () => {
    if (!frame && status.value === 'dragging') frame = requestAnimationFrame(runFrame);
  };

  /** Re-detects the target on the next frame even if the pointer stands still (scroll, resize). */
  const scheduleFrame = () => {
    if (status.value !== 'dragging') return;
    refreshRequested = true;
    requestFrame();
  };

  /** Runs a pending frame now. Without one, the target is already up to date. */
  const flushFrame = () => {
    if (!frame) return;
    cancelAnimationFrame(frame);
    runFrame();
  };

  // ─── Session ─────────────────────────────────────────────────────────────────

  const buildItems = (ids: Key[]): DragItem[] =>
    ids.map((id) => {
      const entry = draggables.get(id);
      return {
        id,
        item: entry?.getItem?.(),
        data: entry?.getData(),
        type: entry?.getTypes() ?? [],
      };
    });

  /** Lets integrations (sortable) fix up the active item, e.g. multi-drag ids from unmounted rows. */
  const updateActive = (patch: Partial<Pick<Active, 'ids' | 'items'>>) => {
    if (active.value) active.value = { ...active.value, ...patch };
  };

  const takePreview = (id: Key): PreviewSource | null => {
    const entry = draggables.get(id);
    const element = entry?.getElement();
    if (!entry || !element?.isConnected) return null;
    // Sortable items (they have a container) stay opaque: their background is often the list's.
    return { element: clonePreview(element, { opaque: !!entry.getContainer }), rect: getRect(element) };
  };

  /**
   * Clones of the other dragged items, next to the active one in drop order (the overlay
   * column's order, else `ids`). Runs right after `onDragStart`: the sortable layer has
   * set the order, and the DOM hasn't re-rendered yet.
   */
  const takePreviews = (current: Active) => {
    const order = overlayColumn.value?.ids ?? current.ids;
    const at = Math.max(order.indexOf(current.id), 0);
    const from = Math.max(0, Math.min(at - ((MAX_PREVIEWS - 1) >> 1), order.length - MAX_PREVIEWS));
    const ids = order.slice(from, from + MAX_PREVIEWS);
    for (const id of ids) {
      if (previews.has(id)) continue;
      const preview = takePreview(id);
      if (preview) previews.set(id, preview);
    }
    previewIds = ids.filter((id) => previews.has(id));
  };

  const start = (id: Key, coordinates: Coordinates, sensor: SensorType): boolean => {
    if (status.value === 'dragging' || status.value === 'dropping' || status.value === 'selecting') {
      return false;
    }
    const entry = draggables.get(id);
    const element = entry?.getElement();
    if (!entry || !element || entry.isDisabled()) return false;

    const ids =
      selection.has(id) && selection.size > 1
        ? [id, ...[...selection].filter((key) => key !== id)]
        : [id];
    const items = buildItems(ids);
    const overlay = entry.getOverlay();
    previewEnabled = overlay !== false;
    overlayComponent = typeof overlay === 'boolean' ? null : overlay;
    sourceModifiers = entry.getModifiers?.() ?? [];
    // Taken synchronously, before the placeholder re-renders. Overlay components get it
    // too: they may show it (`DragPreview`).
    const preview = previewEnabled ? takePreview(id) : null;
    previews = new Map(preview ? [[id, preview]] : []);
    previewIds = [];
    overlayColumn.value = null;
    landings.value = NO_LANDINGS;
    overlayItems.clear();
    active.value = {
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
    containerRect = container ? getRect(container) : null;
    origin = coordinates;
    raw = coordinates;
    pointer.value = coordinates;
    transform.value = { x: 0, y: 0 };
    over.value = null;
    fitSize.value = { width: active.value.rect.width, height: active.value.rect.height };
    resize = null;
    // Where the pointer holds the box on the first frame, after modifiers (the center
    // with snapCenterToCursor). The box has the source size here: no grab applies yet.
    const first = applyModifiers(active.value, { x: 0, y: 0 });
    grab = getFraction(offsetRect(active.value.rect, first.x, first.y), coordinates);
    mode.value = 'move';
    landingKey.value = null;
    activationProgress.value = 1;
    measurer.begin();
    stabilizer.reset();
    nesting = new WeakMap();
    owned = new WeakMap();
    detectedAt = null;
    refreshRequested = false;
    status.value = 'dragging';
    restoreDocument = markDocumentDragging(sensor);

    const event = createEvent();
    emit('onDragStart', event);
    if (previewEnabled && active.value) takePreviews(active.value);
    announce('onDragStart', event);
    runFrame();
    return true;
  };

  const move = (coordinates: Coordinates) => {
    raw = coordinates;
    requestFrame();
  };

  /**
   * Gives focus back to the dragged item after a keyboard drag. Looked up by id once
   * the result has rendered: moving between lists recreates the element, and the old
   * one took the focus with it. Focus the user moved elsewhere is left alone.
   */
  const restoreFocus = (id: Key) => {
    const attempt = () => {
      const target = draggables.get(id)?.getFocusTarget();
      if (!target?.isConnected) return false;
      if (isFocusLost()) target.focus({ preventScroll: true });
      return true;
    };
    void nextTick(() => {
      // Virtualizers may mount the row a frame later.
      if (!attempt()) requestAnimationFrame(attempt);
    });
  };

  const settle = (current: Active) => {
    session++;
    restoreDocument?.();
    restoreDocument = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    measurer.end();
    detectedAt = null;
    pointerElement = null;
    if (current.sensor === 'keyboard') restoreFocus(current.id);
    active.value = null;
    over.value = null;
    pointer.value = null;
    settling.value = false;
    dropTarget.value = null;
    transform.value = { x: 0, y: 0 };
    fitSize.value = null;
    resize = null;
    mode.value = 'move';
    landingKey.value = null;
    landings.value = NO_LANDINGS;
    overlayColumn.value = null;
    overlayItems.clear();
    activationProgress.value = 0;
    previews = new Map();
    previewIds = [];
    previewEnabled = false;
    overlayComponent = null;
    sourceModifiers = [];
    containerRect = null;
    status.value = 'idle';
    // Faded-in items keep full opacity until their placeholder marks are gone (post-flush).
    const faded = fades;
    fades = [];
    if (faded.length) void nextTick(() => faded.forEach((animation) => animation.cancel()));
  };

  /**
   * Multi-drag: the default overlay's clones of the other items land on their own slots
   * with the box; items without a clone (past the cap, custom overlays) fade in where
   * they are, instead of popping to full opacity when the drop ends. A box going `into`
   * a zone takes every clone with it, and the items still shown fade in where they are.
   */
  const landItems = (current: Active, box: { from: Rect; to: Rect | null }, into: boolean): Promise<void> => {
    if (current.ids.length < 2) return Promise.resolve();
    const slotOf = new Map<Key, Key>();
    for (const [slot, id] of landings.value) slotOf.set(id, slot);
    const elementOf = (id: Key) => {
      const element = draggables.get(slotOf.get(id) ?? id)?.getElement();
      return element?.isConnected ? element : null;
    };
    const items: OverlayItemLanding[] = [];
    const resting: HTMLElement[] = [];
    for (const id of current.ids) {
      if (id === current.id) continue;
      const clone = overlayItems.get(id);
      const target = elementOf(id);
      if (into || !clone?.isConnected) {
        if (target) resting.push(target);
        continue;
      }
      const to = target ? measurer.measure(target) : null;
      const visible = !!to && to.width > 0 && !!measurer.measureVisible(target!);
      items.push({ element: clone, from: getRect(clone), to: visible ? to : null });
    }
    fades = fadeInPlace(props.dropAnimation, resting);
    // Clones exist only with the sortable layer's column: its cells, a custom layout's `DragPreview`s.
    return overlayColumn.value?.land(props.dropAnimation, items, box) ?? Promise.resolve();
  };

  /** Plays the drop or return animation, then ends the session. */
  const finish = async (reason: 'drop' | 'cancel', event: DnDEvent) => {
    const current = event.active;
    const id = session;
    status.value = 'dropping';
    // The commit (or the cancel) happened in this same tick: nothing has rendered against
    // the changed data with the drag state still live.
    settling.value = true;
    dropTarget.value = reason === 'drop' ? event.over : null;
    over.value = null;
    pointer.value = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    restoreDocument?.();
    restoreDocument = null;

    const overlay = overlayElement.value;
    if (overlay) {
      // Measure the target after the commit has rendered, then once more a frame
      // later: virtualizers may re-measure rows with a ResizeObserver in between.
      await nextTick();
      await nextFrame();
      if (id !== session) return;
      // Copies and created items land on their own row, not on the dragged one.
      const target = draggables.get(landingKey.value ?? current.id)?.getElement();
      // The commit changed the layout since the last frame: read afresh.
      measurer.invalidate();
      measurer.nextFrame();
      const to = target?.isConnected ? measurer.measure(target) : null;
      // Fly only to a slot that can be seen: virtualizers keep overscan rows mounted
      // outside the scroller, and the slot may be scrolled away. Otherwise fade out.
      const visible = !!to && to.width > 0 && !!measurer.measureVisible(target!);
      const from = getRect(overlay);
      const landing = visible ? to : null;
      // Shown nowhere after a drop on a zone (not a list: an item dropped into a folder,
      // a trash zone): the overlay goes into the zone. Otherwise it fades where it is.
      const zone = landing || reason !== 'drop' ? null : event.over;
      const into =
        (zone?.element.isConnected && !droppables.get(zone.id)?.sortable && measurer.measureVisible(zone.element)) || null;
      await Promise.all([
        runDropAnimation(props.dropAnimation, { overlay, from, to: landing, into, reason, active: current }),
        landItems(current, { from, to: landing }, !!into),
      ]);
      if (id !== session) return;
    }
    settle(current);
  };

  const cancel = () => {
    if (status.value === 'activating') {
      activationAborts.forEach((abort) => abort());
      return;
    }
    if (status.value === 'selecting') {
      selectionAborts.forEach((abort) => abort());
      return;
    }
    if (status.value !== 'dragging' || !active.value) return;
    const event = createEvent();
    emit('onDragCancel', event);
    announce('onDragCancel', event);
    void finish('cancel', event);
  };

  const drop = async () => {
    if (status.value !== 'dragging' || !active.value) return;
    flushFrame();
    const id = session;
    status.value = 'dropping';
    // `onBeforeDrop` may wait for the user (a confirmation dialog): the page stops being
    // in drag mode now, with its own cursor and text selection. The drag state and the
    // overlay stay as they are until the drop is decided.
    restoreDocument?.();
    restoreDocument = null;
    const event = createEvent();
    const target = event.over;

    let verdict: BeforeDropResult = true;
    try {
      for (const monitor of [...monitors]) {
        const result = await monitor.onBeforeDrop?.(event);
        if (result === false) {
          verdict = false;
          break;
        }
        if (Array.isArray(result)) verdict = result;
      }
      if (verdict !== false && target?.accepted) {
        const result = await droppables.get(target.id)?.onBeforeDrop?.(event);
        if (result === false) verdict = false;
        else if (Array.isArray(result)) verdict = result;
      }
    } catch (error) {
      console.error(error);
      verdict = false;
    }
    if (id !== session) return;

    if (verdict === false || (target && !target.accepted)) {
      emit('onDragCancel', event);
      announce('onDragCancel', event);
      return finish('cancel', event);
    }

    if (target) {
      try {
        droppables.get(target.id)?.onDrop?.(event);
      } catch (error) {
        console.error(error);
      }
    }
    const endEvent: DnDEndEvent = {
      ...event,
      dropped: !!target,
      accepted: Array.isArray(verdict) ? verdict : event.active.ids,
    };
    emit('onDragEnd', endEvent);
    announce('onDragEnd', endEvent);
    return finish('drop', endEvent);
  };

  const destroy = () => {
    if (status.value === 'activating') activationAborts.forEach((abort) => abort());
    if (status.value === 'selecting') selectionAborts.forEach((abort) => abort());
    const current = active.value;
    if (current && status.value === 'dragging') emit('onDragCancel', createEvent());
    if (current) settle(current);
    clearTimeout(announceTimer);
  };

  const manager = {
    props,
    status,
    active,
    over,
    pointer,
    settling,
    dropTarget,
    transform,
    activationProgress,
    isAutoScrolling,
    overlayElement,
    fitSize,
    announcement,
    selection,
    mode,
    landingKey,
    landings,
    overlayColumn,
    overlayItems,
    instructionsId: '',
    monitors,
    activationAborts,
    selectionAborts,
    /** Clone of a dragged item taken at pickup (`DragPreview`); none past the cap or for unrendered items. */
    getPreview: (id: Key): PreviewSource | undefined => previews.get(id),
    /** Ids that have a clone, in drop order: what the default overlay's column shows. */
    get previewIds(): readonly Key[] {
      return previewIds;
    },
    get hasOverlay() {
      return previewEnabled;
    },
    /** The dragged item's overlay component (its own, else its list's); `null`: slot or clone. */
    getModifiers,
    get overlayComponent() {
      return overlayComponent;
    },
    getDraggable: (id: Key) => draggables.get(id),
    /** Every registered draggable, e.g. for selection hit-testing. */
    getDraggables: (): IterableIterator<DraggableEntry> => draggables.values(),
    getDroppable: (id: Key) => droppables.get(id),
    getDroppables: () => droppables.values(),
    /** Pointer position as the sensor reported it, before modifiers. */
    getRawPointer: (): Coordinates => raw,
    /**
     * Topmost element under the pointer at the last target detection (at most a frame
     * old); `null` when unknown, e.g. while a modifier moves the point off the pointer.
     */
    getPointerElement: (): Element | null => pointerElement,
    /** The overlay box for a drag offset, as the overlay, collision and modifiers see it. */
    getOverlayRect,
    autoScrollEntries,
    registerAutoScroll,
    registerDraggable,
    registerDroppable,
    bindDraggableElement,
    unbindDraggableElement,
    findDraggable,
    addMonitor,
    addSourceResolver,
    addTargetRule,
    /** The element is (in) a dragged item or a slot one lands in: never a drop target. */
    isOwned,
    addAnnouncer,
    announce,
    updateActive,
    start,
    move,
    drop,
    cancel,
    scheduleFrame,
    /** Runs the pending frame now (discrete keyboard moves need `pointer`/`over` updated at once). */
    flushFrame,
    destroy,
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
