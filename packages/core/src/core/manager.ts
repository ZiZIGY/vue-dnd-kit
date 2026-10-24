/**
 * The drag session state machine: idle → activating → dragging → dropping → idle.
 *
 * Invariants (rfcs/0001-v3.md §13):
 * - one session per provider; input during `dropping` is ignored;
 * - every exit path (drop, reject, cancel, callback error, provider unmount)
 *   restores the document and emits exactly one terminal event;
 * - items are identified by id, never by element: elements may be recreated mid-drag.
 */

import { nextTick, shallowReactive, shallowRef } from 'vue';
import type {
  ActivationOptions,
  Active,
  BeforeDropResult,
  CollisionCandidate,
  Coordinates,
  DnDEndEvent,
  DnDEvent,
  DnDMonitor,
  DnDProviderProps,
  DnDStatus,
  DragItem,
  DragSource,
  Key,
  Over,
  Rect,
  SensorType,
  Size,
} from '../types';
import {
  containsPoint,
  createRect,
  getLayoutRect,
  getRect,
  getWindowRect,
  unionRect,
} from '../animation/layout';
import { runDropAnimation } from '../animation/drop';
import { createTargetStabilizer, pointerFirst } from './collision';
import { createMeasurer } from './measure';
import { defaultAnnouncements } from './a11y';
import { markDocumentDragging } from './styles';
import { clonePreview } from './clone';
import { containsComposed, elementFromPoint, nextFrame, parentOf } from '../utils/dom';

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
  activation?: ActivationOptions;
  canDrag?: (event: PointerEvent | KeyboardEvent) => boolean;
  overlay: boolean;
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
  priority: number;
  onDragEnter?(event: DnDEvent): void;
  onDragLeave?(event: DnDEvent): void;
  onBeforeDrop?(event: DnDEvent): BeforeDropResult | Promise<BeforeDropResult>;
  onDrop?(event: DnDEvent): void;
}

type MonitorHandler = Exclude<keyof DnDMonitor, 'onBeforeDrop' | 'getKeyboardCoordinates'>;

/** Elements owned by any provider, so nested providers ignore each other's items. */
const owners = new WeakMap<Element, object>();

const OVER_ANNOUNCE_DELAY = 500;

export type DnDManager = ReturnType<typeof createDnDManager>;

export function createDnDManager(props: DnDProviderProps) {
  const status = shallowRef<DnDStatus>('idle');
  const active = shallowRef<Active | null>(null);
  const over = shallowRef<Over | null>(null);
  const pointer = shallowRef<Coordinates | null>(null);
  const transform = shallowRef<Coordinates>({ x: 0, y: 0 });
  const activationProgress = shallowRef(0);
  const isAutoScrolling = shallowRef(false);
  const overlayElement = shallowRef<HTMLElement | null>(null);
  const overlaySize = shallowRef<Size | null>(null);
  const announcement = shallowRef('');
  const selection = shallowReactive(new Set<Key>());

  const draggables = new Map<Key, DraggableEntry>();
  const droppables = new Map<Key, DroppableEntry>();
  const draggableIds = new WeakMap<Element, Key>();
  const monitors = new Set<DnDMonitor>();
  const sourceResolvers = new Set<(active: Active) => DragSource | undefined>();
  const activationAborts = new Set<() => void>();

  let origin: Coordinates = { x: 0, y: 0 };
  let raw: Coordinates = { x: 0, y: 0 };
  let containerRect: Rect | null = null;
  let frame = 0;
  let preview: HTMLElement | null = null;
  let previewEnabled = false;
  let restoreDocument: (() => void) | null = null;
  let session = 0;
  let announceTimer: ReturnType<typeof setTimeout> | undefined;

  const measurer = createMeasurer();
  const stabilizer = createTargetStabilizer();
  /** Nesting depth of drop target elements among drop targets, per session. */
  let nesting = new WeakMap<Element, number>();
  /** Pointer of the last target detection. */
  let detectedAt: Coordinates | null = null;
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

  const addMonitor = (monitor: DnDMonitor): (() => void) => {
    monitors.add(monitor);
    return () => monitors.delete(monitor);
  };

  const addSourceResolver = (resolver: (active: Active) => DragSource | undefined) => {
    sourceResolvers.add(resolver);
    return () => sourceResolvers.delete(resolver);
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
    for (const monitor of [...monitors]) {
      try {
        (monitor[name] as ((event: DnDEvent) => void) | undefined)?.(event);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const announce = (name: keyof typeof defaultAnnouncements, event: DnDEvent) => {
    if (props.announcements === false) return;
    const custom = props.announcements?.[name] as ((event: DnDEvent) => string | undefined) | undefined;
    const fallback = defaultAnnouncements[name] as (event: DnDEvent) => string | undefined;
    const text = (custom ?? fallback)(event);
    clearTimeout(announceTimer);
    if (!text) return;
    if (name === 'onDragOver') {
      announceTimer = setTimeout(() => (announcement.value = text), OVER_ANNOUNCE_DELAY);
    } else {
      announcement.value = text;
    }
  };

  // ─── Geometry ────────────────────────────────────────────────────────────────

  const getOverlayRect = (current: Active, offset: Coordinates): Rect => {
    const size = overlaySize.value ?? current.rect;
    return createRect(current.rect.left + offset.x, current.rect.top + offset.y, size.width, size.height);
  };

  const applyModifiers = (current: Active, offset: Coordinates): Coordinates => {
    let result = offset;
    for (const modifier of props.modifiers ?? []) {
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
    for (
      let element = elementFromPoint(point.x, point.y);
      element;
      element = parentOf(element)
    ) {
      const entry = byElement.get(element);
      if (entry) hits.push(entry);
    }
    return hits
      .map((entry, depth) => ({ entry, depth }))
      .sort((a, b) => b.entry.priority - a.entry.priority || a.depth - b.depth)
      .map(({ entry }) => entry.id);
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

  const detectOver = (current: Active, point: Coordinates): Over | null => {
    const candidates: CollisionCandidate[] = [];
    const byElement = new Map<Element, DroppableEntry>();
    const elements = new Map<Key, HTMLElement>();
    for (const entry of droppables.values()) {
      if (entry.isDisabled()) continue;
      const element = entry.getElement();
      if (!element?.isConnected) continue;
      // Never drop an item into itself or its own descendants.
      if (current.element.isConnected && containsComposed(current.element, element)) continue;
      byElement.set(element, entry);
      elements.set(entry.id, element);
      measurer.observe(element);
    }
    for (const [element, entry] of byElement) {
      // Fully clipped by a scroll container or the viewport: not hittable.
      const rect = measurer.measureVisible(element);
      if (rect) {
        candidates.push({ id: entry.id, rect, priority: entry.priority, depth: depthOf(element, byElement) });
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

  const runFrame = () => {
    frame = 0;
    const current = active.value;
    if (status.value !== 'dragging' || !current) return;
    const refresh = refreshRequested;
    refreshRequested = false;
    const offset = applyModifiers(current, { x: raw.x - origin.x, y: raw.y - origin.y });
    const point = { x: origin.x + offset.x, y: origin.y + offset.y };
    // The target follows the pointer, scrolling and resizing, never a layout shift
    // alone: a frame where none of them changed (a repeated pointermove) does nothing.
    if (!refresh && detectedAt && point.x === detectedAt.x && point.y === detectedAt.y) return;
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
      announce('onDragOver', event);
    }
    emit('onDragMove', event);
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

  const start = (id: Key, coordinates: Coordinates, sensor: SensorType): boolean => {
    if (status.value === 'dragging' || status.value === 'dropping') return false;
    const entry = draggables.get(id);
    const element = entry?.getElement();
    if (!entry || !element || entry.isDisabled()) return false;

    const ids =
      selection.has(id) && selection.size > 1
        ? [id, ...[...selection].filter((key) => key !== id)]
        : [id];
    const items = buildItems(ids);
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
    previewEnabled = entry.overlay;
    preview = entry.overlay ? clonePreview(element) : null;
    const container = entry.getContainer?.() ?? element.parentElement;
    containerRect = container ? getRect(container) : null;
    origin = coordinates;
    raw = coordinates;
    pointer.value = coordinates;
    transform.value = { x: 0, y: 0 };
    over.value = null;
    overlaySize.value = null;
    activationProgress.value = 1;
    measurer.begin();
    stabilizer.reset();
    nesting = new WeakMap();
    detectedAt = null;
    refreshRequested = false;
    status.value = 'dragging';
    restoreDocument = markDocumentDragging(sensor);

    const event = createEvent();
    emit('onDragStart', event);
    announce('onDragStart', event);
    runFrame();
    return true;
  };

  const move = (coordinates: Coordinates) => {
    raw = coordinates;
    requestFrame();
  };

  const settle = (current: Active) => {
    session++;
    restoreDocument?.();
    restoreDocument = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    measurer.end();
    detectedAt = null;
    if (current.sensor === 'keyboard') {
      draggables.get(current.id)?.getFocusTarget()?.focus({ preventScroll: true });
    }
    active.value = null;
    over.value = null;
    pointer.value = null;
    transform.value = { x: 0, y: 0 };
    overlaySize.value = null;
    activationProgress.value = 0;
    preview = null;
    previewEnabled = false;
    containerRect = null;
    status.value = 'idle';
  };

  /** Plays the drop or return animation, then ends the session. */
  const finish = async (reason: 'drop' | 'cancel', event: DnDEvent) => {
    const current = event.active;
    const id = session;
    status.value = 'dropping';
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
      const target = draggables.get(current.id)?.getElement();
      const to = target?.isConnected ? getLayoutRect(target) : null;
      await runDropAnimation(props.dropAnimation, {
        overlay,
        from: getRect(overlay),
        to: to && to.width > 0 ? to : null,
        reason,
        active: current,
      });
      if (id !== session) return;
    }
    settle(current);
  };

  const cancel = () => {
    if (status.value === 'activating') {
      activationAborts.forEach((abort) => abort());
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
    transform,
    activationProgress,
    isAutoScrolling,
    overlayElement,
    overlaySize,
    announcement,
    selection,
    instructionsId: '',
    monitors,
    activationAborts,
    get preview() {
      return previewEnabled ? preview : null;
    },
    get hasOverlay() {
      return previewEnabled;
    },
    getDraggable: (id: Key) => draggables.get(id),
    getDroppable: (id: Key) => droppables.get(id),
    registerDraggable,
    registerDroppable,
    bindDraggableElement,
    unbindDraggableElement,
    findDraggable,
    addMonitor,
    addSourceResolver,
    updateActive,
    start,
    move,
    drop,
    cancel,
    scheduleFrame,
    destroy,
    /** Layout rect without in-flight FLIP translates; cached during a drag, scroll-aware. */
    measure: measurer.measure,
    /** `measure()` clipped by scroll containers and the viewport; `null` when fully clipped. */
    measureVisible: measurer.measureVisible,
    /** Whether FLIP should animate the element (near its scroll container's visible area). */
    isNearViewport: measurer.isNearViewport,
    /** Call after layout changes the library caused (draft changes): drops cached rects. */
    invalidateMeasurements: measurer.invalidate,
  };
  return manager;
}
