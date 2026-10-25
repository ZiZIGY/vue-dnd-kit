/**
 * What a provider knows about: its draggables and drop targets (by id: elements may be
 * recreated mid-drag), its monitors, and the hooks library layers plug in (drag sources,
 * target rules, announcers, auto-scroll overrides).
 */

import type { Component } from 'vue';
import type {
  ActivationOptions,
  Active,
  Announcements,
  AutoScrollOptions,
  BeforeDropResult,
  Coordinates,
  DnDEvent,
  DnDMonitor,
  DragSource,
  DroppableOptions,
  Key,
  Modifier,
} from '../../types';
import { parentOf } from '../../utils/dom';

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
  /** The options it was made with, for the devtools (its `accept` rule). */
  options?: DroppableOptions;
  onDragEnter?(event: DnDEvent): void;
  onDragLeave?(event: DnDEvent): void;
  onBeforeDrop?(event: DnDEvent): BeforeDropResult | Promise<BeforeDropResult>;
  onDrop?(event: DnDEvent): void;
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

/** Elements owned by any provider, so nested providers ignore each other's items. */
const owners = new WeakMap<Element, object>();

export type Registry = ReturnType<typeof createRegistry>;
export type RegistryLookups = Registry['lookups'];
export type RegistryMembers = Registry['members'];

export function createRegistry() {
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
  /** This provider, as `owners` records it. */
  const owner = {};

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
    owners.set(element, owner);
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
      const elementOwner = owners.get(element);
      if (!elementOwner) continue;
      if (elementOwner !== owner) return null;
      const id = draggableIds.get(element);
      const entry = id == null ? undefined : draggables.get(id);
      return entry ? { entry, element: element as HTMLElement } : null;
    }
    return null;
  };

  /**
   * `integration`: a library layer (sortable groups). Its notifications run before the
   * others', so the user's `onDragEnd` sees the drop it wrote; its `onBeforeDrop` runs
   * after theirs (see `drop`).
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

  return {
    /** What the manager's modules look up. */
    lookups: { draggables, droppables, draggableIds, integrations, sourceResolvers, targetRules, announcers },
    /** Members of the manager (`DnDManager`), as they are. */
    members: {
      monitors,
      activationAborts,
      selectionAborts,
      getDraggable: (id: Key) => draggables.get(id),
      /** Every registered draggable, e.g. for selection hit-testing. */
      getDraggables: (): IterableIterator<DraggableEntry> => draggables.values(),
      getDroppable: (id: Key) => droppables.get(id),
      getDroppables: () => droppables.values(),
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
      addAnnouncer,
    },
  };
}
