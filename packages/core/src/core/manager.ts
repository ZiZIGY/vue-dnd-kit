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

import { nextTick, shallowReactive, shallowRef } from 'vue';
import type {
  ActivationOptions,
  Active,
  AutoScrollOptions,
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
  createRect,
  getLayoutRect,
  getRect,
  getWindowRect,
} from '../animation/layout';
import { runDropAnimation } from '../animation/drop';
import { pointerFirst } from './collision';
import { defaultAnnouncements } from './a11y';
import { markDocumentDragging } from './styles';
import { clonePreview } from './clone';
import { elementFromPoint, nextFrame, parentOf } from '../utils/dom';
import { getVisibleClip, intersects } from '../utils/clip';

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
  /** Arrow keys in free keyboard drags: move by pixels (default) or jump between accepting drop targets. */
  keyboard?: 'pixels' | 'droppables';
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

/** Per-container auto-scroll override (e.g. `SortableListOptions.autoScroll`). */
export interface AutoScrollEntry {
  getElement(): Element | null;
  options: boolean | AutoScrollOptions;
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
  const autoScrollEntries = new Set<AutoScrollEntry>();
  /** Cancels the running rubber-band selection (`status === 'selecting'`). */
  const selectionAborts = new Set<() => void>();

  let origin: Coordinates = { x: 0, y: 0 };
  let raw: Coordinates = { x: 0, y: 0 };
  let containerRect: Rect | null = null;
  let frame = 0;
  let preview: HTMLElement | null = null;
  let previewEnabled = false;
  let restoreDocument: (() => void) | null = null;
  let session = 0;
  let announceTimer: ReturnType<typeof setTimeout> | undefined;
  let lastAnnouncement = '';

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

  /** Overrides auto-scroll for the scroll container of `getElement()` (the element or its closest scrollable ancestor). */
  const registerAutoScroll = (
    getElement: () => Element | null,
    options: boolean | AutoScrollOptions,
  ): (() => void) => {
    const entry: AutoScrollEntry = { getElement, options };
    autoScrollEntries.add(entry);
    return () => autoScrollEntries.delete(entry);
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

  const setAnnouncement = (text: string) => {
    // Screen readers only speak changes: repeating the same text needs a different string.
    announcement.value =
      text === lastAnnouncement && announcement.value === text ? `${text}\u00A0` : text;
    lastAnnouncement = text;
  };

  const announce = (name: keyof typeof defaultAnnouncements, event: DnDEvent) => {
    clearTimeout(announceTimer);
    const custom = props.announcements;
    if (custom === false) return;
    let text: string | undefined;
    try {
      const handler = custom?.[name] ? custom : defaultAnnouncements;
      text = (handler[name] as (this: unknown, event: DnDEvent) => string | undefined).call(handler, event);
    } catch (error) {
      // A throwing announcement must not break the session (§13).
      console.error(error);
      return;
    }
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
    // Innermost first; a higher priority wins over nesting depth.
    return hits
      .map((entry, depth) => ({ entry, depth }))
      .sort((a, b) => b.entry.priority - a.entry.priority || a.depth - b.depth)
      .map(({ entry }) => entry.id);
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
      if (current.element.isConnected && current.element.contains(element)) continue;
      byElement.set(element, entry);
      elements.set(entry.id, element);
      candidates.push({ id: entry.id, rect: getLayoutRect(element), priority: entry.priority });
    }
    const detect = props.collision ?? pointerFirst;
    const [id] = detect({
      pointer: point,
      overlayRect: getOverlayRect(current, transform.value),
      candidates,
      hits: hitTest(point, byElement),
    });
    if (id == null) return null;
    const entry = droppables.get(id);
    const element = elements.get(id);
    const candidate = candidates.find((item) => item.id === id);
    if (!entry || !element || !candidate) return null;
    return {
      id,
      data: entry.getData(),
      element,
      rect: candidate.rect,
      accepted: entry.accepts(current),
    };
  };

  // ─── Frame loop ──────────────────────────────────────────────────────────────

  const runFrame = () => {
    frame = 0;
    const current = active.value;
    if (status.value !== 'dragging' || !current) return;
    const offset = applyModifiers(current, { x: raw.x - origin.x, y: raw.y - origin.y });
    transform.value = offset;
    const point = { x: origin.x + offset.x, y: origin.y + offset.y };
    pointer.value = point;

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

  const scheduleFrame = () => {
    if (!frame && status.value === 'dragging') frame = requestAnimationFrame(runFrame);
  };

  const flushFrame = () => {
    if (frame) cancelAnimationFrame(frame);
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
    scheduleFrame();
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
      const focused = document.activeElement;
      const lost =
        !focused ||
        focused === document.body ||
        focused === document.documentElement ||
        !focused.isConnected;
      if (lost) target.focus({ preventScroll: true });
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
    if (current.sensor === 'keyboard') restoreFocus(current.id);
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
      // Fly only to a slot that can be seen: virtualizers keep overscan and pinned
      // rows mounted outside the scroller's visible area. Otherwise fade out.
      const visible = !!to && to.width > 0 && intersects(to, getVisibleClip(target!));
      await runDropAnimation(props.dropAnimation, {
        overlay,
        from: getRect(overlay),
        to: visible ? to : null,
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
    selectionAborts,
    get preview() {
      return previewEnabled ? preview : null;
    },
    get hasOverlay() {
      return previewEnabled;
    },
    getDraggable: (id: Key) => draggables.get(id),
    /** Every registered draggable, e.g. for selection hit-testing. */
    getDraggables: (): IterableIterator<DraggableEntry> => draggables.values(),
    getDroppable: (id: Key) => droppables.get(id),
    getDroppables: () => droppables.values(),
    /** Pointer position as the sensor reported it, before modifiers. */
    getRawPointer: (): Coordinates => raw,
    autoScrollEntries,
    registerAutoScroll,
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
    /** Runs the pending frame now (discrete keyboard moves need `pointer`/`over` updated at once). */
    flushFrame,
    destroy,
  };
  return manager;
}
