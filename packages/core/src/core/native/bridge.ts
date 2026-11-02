/**
 * The browser's own drag and drop (HTML5) as drags of a provider:
 * - drags from outside the page (files, links, text) run as drags of the provider for the
 *   targets that take them (`external`): they get a stand-in element, no overlay (the
 *   browser draws its image), and their data at the drop;
 * - a mouse drag of a `native` draggable is the browser's drag, so it can leave the page;
 *   on the page it is a drag of the provider like any other, minus the overlay;
 * - such a drag carries a sortable item for its group's lists in another window of the app
 *   (`data.ts`), where it comes in as a drag from outside. Dropped there as a move, it
 *   leaves its list here (`endOutside`).
 *
 * The browser's events drive it: `dragover` moves it, `drop` drops it, leaving the window
 * cancels a drag from outside (one of the page's own waits outside), `dragend` ends one of
 * the page's own that was dropped elsewhere.
 */

import { defaultDocument, defaultWindow, useEventListener } from '@vueuse/core';
import type { Active, DragItem, ExternalData } from '../../types';
import { createRect } from '../../animation/layout';
import type { DnDManager, DraggableEntry } from '../manager';
import { canStartFrom } from '../sensors/activation';
import { isClient } from '../../utils/dom';
import {
  carries,
  externalItems,
  externalLabel,
  readDropped,
  readHeld,
  readRemote,
  readRemoteHint,
  writeRemote,
  type RemotePayload,
} from './data';

type Effect = 'none' | 'copy' | 'move' | 'link';

interface BrowserDrag {
  manager: DnDManager;
  /** A drag of the page's own (`native`), not one from outside. */
  own: boolean;
  /** A drag from outside: what it carries. */
  external?: ExternalData;
  /** `dragenter` less `dragleave` over the document: 0 once the drag left the window. */
  depth: number;
  /** Dropped on this page: its `dragend` is no news. */
  dropped: boolean;
  /** When the last `dragover` came: mouse events after it mean the drag ended unseen. */
  lastOver: number;
  /** A drag from outside: takes its stand-in away. */
  cleanup?: () => void;
  /** A drag from outside: the ids of its items (another window's items too: theirs may be ours). */
  idOf?: (index: number) => string;
}

/** The browser runs one drag at a time: the provider that took it (one per page). */
let current: BrowserDrag | null = null;
let made = 0;

/** Whether `allowed` (`effectAllowed`) lets the drop be `effect`. */
const allows = (allowed: string, effect: Effect) =>
  allowed === 'all' || allowed === 'uninitialized' || allowed.toLowerCase().includes(effect);

const pointOf = (event: DragEvent) => ({ x: event.clientX, y: event.clientY });

/** Another window's items, with ids of this drag: their own keys may be items here too. */
const remoteItems = (items: RemotePayload['items'], idOf: (index: number) => string): DragItem[] =>
  items.map((item, index) => ({ ...item, id: idOf(index), type: item.type ?? [] }));

/** Runs the provider's browser drags (see above), in the browser only. */
export function useNativeDrags(manager: DnDManager): void {
  if (!isClient) return;

  /** Elements a mouse press made `draggable`, so the browser can start its drag there. */
  const madeDraggable = new Set<HTMLElement>();
  const undoDraggable = () => {
    for (const element of madeDraggable) element.removeAttribute('draggable');
    madeDraggable.clear();
  };

  const ours = () => (current?.manager === manager ? current : null);

  const end = (drag: BrowserDrag) => {
    drag.cleanup?.();
    if (current === drag) current = null;
  };

  /**
   * What the drop would be over the current target: nothing for a target that refuses. Another
   * window's items move, or copy with the browser's copy key (Ctrl, Option on a Mac).
   */
  const effectOf = (drag: BrowserDrag, allowed: string, copyKey = false): Effect => {
    const over = manager.over.value;
    if (over && !over.accepted) return 'none';
    // From outside, only a target makes a drop: elsewhere the browser would open the file.
    if (drag.external && !over) return 'none';
    const copying = drag.external ? !drag.external.group || copyKey : manager.mode.value === 'copy';
    const wanted: Effect = copying ? 'copy' : 'move';
    for (const effect of [wanted, 'move', 'copy', 'link'] as const) if (allows(allowed, effect)) return effect;
    return 'none';
  };

  // ─── The page's own drags (`native`) ──────────────────────────────────────────

  /** A mouse press on a `native` draggable, where its drags start: the browser may drag it. */
  const onPointerDown = (event: PointerEvent) => {
    undoDraggable();
    if (event.pointerType !== 'mouse' || event.button !== 0 || !(event.target instanceof Element)) return;
    const found = manager.findDraggable(event.target);
    if (!found?.entry.getNative?.() || found.entry.isDisabled() || !canStartFrom(found.entry, found.element, event.target, 'pointer')) return;
    // `canDrag` is asked at the press, as the pointer sensor does.
    if (found.entry.canDrag && !found.entry.canDrag(event)) return;
    // The user's own attribute stays as it is.
    if (found.element.hasAttribute('draggable')) return;
    found.element.setAttribute('draggable', 'true');
    madeDraggable.add(found.element);
  };

  const startOwn = (event: DragEvent, entry: DraggableEntry) => {
    const transfer = event.dataTransfer!;
    if (current || !manager.isAtRest() || !manager.start(entry.id, pointOf(event), 'pointer', false, {})) {
      event.preventDefault();
      return;
    }
    const active = manager.active.value!;
    const native = entry.getNative!()!;
    transfer.effectAllowed = native.effect ?? 'copyMove';
    const data = native.data?.(active) ?? (active.label ? { 'text/plain': active.label } : {});
    for (const [type, value] of Object.entries(data)) transfer.setData(type, value);
    const group = entry.getGroup?.();
    if (group) writeRemote(transfer, { group, items: active.items.map(({ id, item, data, label, type }) => ({ id, item, data, label, type })) });
    const drag: BrowserDrag = { manager, own: true, depth: 0, dropped: false, lastOver: performance.now() };
    current = drag;
    // The element may leave the document mid-drag (moved to another list): its `dragend`
    // still comes to it, and doesn't bubble up here then.
    event.target!.addEventListener('dragend', (end) => onDragEnd(end as DragEvent), { once: true });
  };

  const onDragStart = (event: DragEvent) => {
    if (!(event.target instanceof Element) || !event.dataTransfer) return;
    const found = manager.findDraggable(event.target);
    if (!found?.entry.getNative?.() || (!madeDraggable.has(found.element) && found.element.getAttribute('draggable') !== 'true')) return;
    startOwn(event, found.entry);
  };

  /** A drag of the page's own ended: dropped here (done), elsewhere, or cancelled. */
  const onDragEnd = (event: DragEvent) => {
    const drag = ours();
    undoDraggable();
    if (!drag?.own) return;
    end(drag);
    if (!drag.dropped) manager.endOutside((event.dataTransfer?.dropEffect ?? 'none') as Effect);
  };

  // ─── Drags from outside ────────────────────────────────────────────────────────

  /**
   * Whether the provider has a target for the drag: one that takes drags from outside
   * (`external`), whose rule then says yes or no as the drag goes over it; for another
   * window's items, a list of their group or a target that takes them.
   */
  const wanted = (probe: Active) =>
    [...manager.getDroppables()].some((entry) => {
      if (entry.isDisabled()) return false;
      const { external } = probe;
      if (!external?.group) return !!entry.getExternal?.();
      return entry.sortable ? entry.getGroup?.() === external.group : entry.accepts(probe);
    });

  /** A drag from outside comes in: it starts, for the targets that take it, at a stand-in element. */
  const startExternal = (event: DragEvent) => {
    const transfer = event.dataTransfer!;
    const remote = readRemoteHint(transfer.types);
    const external = readHeld(transfer, remote?.group);
    const id = `external-${++made}`;
    const idOf = (index: number) => `${id}:${index}`;
    const items: DragItem[] = remote ? remoteItems(remote.items, idOf) : externalItems(id, external);
    if (!items.length) return;
    if (!remote) items[0]!.label = externalLabel(external);
    const point = pointOf(event);
    const standIn = document.createElement('div');
    standIn.setAttribute('aria-hidden', 'true');
    standIn.setAttribute('data-dnd-external', '');
    standIn.style.cssText = `position:fixed;left:${point.x}px;top:${point.y}px;width:0;height:0;pointer-events:none`;
    document.body.appendChild(standIn);
    const first = items[0]!;
    const probe: Active = {
      id: first.id,
      ids: items.map((item) => item.id),
      items,
      data: first.data,
      label: first.label,
      type: first.type,
      element: standIn,
      rect: createRect(point.x, point.y, 0, 0),
      sensor: 'pointer',
      external,
      native: true,
    };
    if (!wanted(probe)) {
      standIn.remove();
      return;
    }
    const entry: DraggableEntry = {
      id: first.id,
      getElement: () => standIn,
      getHandle: () => null,
      getFocusTarget: () => null,
      getData: () => first.data,
      getLabel: () => first.label,
      getTypes: () => first.type,
      isDisabled: () => false,
      getOverlay: () => false,
    };
    const unregister = manager.registerDraggable(entry);
    const cleanup = () => {
      unregister();
      standIn.remove();
    };
    if (!manager.start(first.id, point, 'pointer', false, { items, external })) return cleanup();
    current = { manager, own: false, external, depth: 1, dropped: false, lastOver: performance.now(), cleanup, idOf };
    event.preventDefault();
    transfer.dropEffect = effectOf(current, transfer.effectAllowed);
  };

  // ─── Both ──────────────────────────────────────────────────────────────────────

  const onDragEnter = (event: DragEvent) => {
    const drag = ours();
    if (drag) {
      drag.depth++;
      event.preventDefault();
      return;
    }
    if (!current && carries(event.dataTransfer) && manager.isAtRest()) startExternal(event);
  };

  const onDragOver = (event: DragEvent) => {
    const drag = ours();
    if (!drag || !event.dataTransfer) return;
    // Cancelled, the event lets a drop come; the effect says whether it is welcome.
    event.preventDefault();
    drag.lastOver = performance.now();
    if (manager.outside.value) manager.outside.value = false;
    manager.move(pointOf(event));
    event.dataTransfer.dropEffect = effectOf(drag, event.dataTransfer.effectAllowed, event.ctrlKey || event.altKey);
  };

  const onDragLeave = () => {
    const drag = ours();
    if (!drag || --drag.depth > 0) return;
    drag.depth = 0;
    if (drag.own) {
      // Out of the window: it may come back, or be dropped elsewhere (`dragend`).
      manager.outside.value = true;
      return;
    }
    end(drag);
    manager.cancel();
  };

  const onDrop = (event: DragEvent) => {
    const drag = ours();
    if (!drag || !event.dataTransfer) return;
    event.preventDefault();
    drag.dropped = true;
    manager.move(pointOf(event));
    manager.flushFrame();
    const { external } = drag;
    if (external) {
      const over = manager.over.value;
      readDropped(external, event.dataTransfer, over ? manager.getDroppable(over.id)?.getExternal?.() : undefined);
      // Another window's items, in full (the names of the types may have carried only their group).
      const remote = external.group ? readRemote(event.dataTransfer) : null;
      if (remote?.items.length && drag.idOf) manager.updateActive({ items: remoteItems(remote.items, drag.idOf) });
    }
    void manager.drop().finally(() => {
      if (!drag.own) end(drag);
    });
  };

  /** Mouse events don't come while the browser drags: one now means its drag ended unseen. */
  const onPointerMove = () => {
    const drag = ours();
    if (!drag || performance.now() - drag.lastOver < 300) return;
    end(drag);
    manager.cancel();
  };

  // Another hand ended the drag (`useDnD().cancel()`, the provider unmounting): the browser's
  // drag goes on as the browser's alone.
  manager.addMonitor(
    {
      onDragCancel: (event) => {
        const drag = ours();
        if (drag && !drag.own && !drag.dropped && event.active.external === drag.external) end(drag);
      },
    },
    true,
  );

  useEventListener(defaultDocument, 'pointerdown', onPointerDown, { capture: true });
  useEventListener(defaultDocument, 'pointerup', undoDraggable, { capture: true });
  useEventListener(defaultDocument, 'dragstart', onDragStart, { capture: true });
  useEventListener(defaultDocument, 'dragend', onDragEnd, { capture: true });
  useEventListener(defaultDocument, 'dragenter', onDragEnter, { capture: true });
  useEventListener(defaultDocument, 'dragover', onDragOver, { capture: true });
  useEventListener(defaultDocument, 'dragleave', onDragLeave, { capture: true });
  useEventListener(defaultDocument, 'drop', onDrop, { capture: true });
  useEventListener(defaultWindow, 'pointermove', onPointerMove, { capture: true, passive: true });
}

