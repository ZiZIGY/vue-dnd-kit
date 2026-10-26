/**
 * The state panel of an inspector node: what the bridge's snapshot says about it, in
 * sections. Also the element the node stands for, which the page highlights.
 */

import type { Key } from '@vue-dnd-kit/core';
import type {
  DraggableSnapshot,
  DroppableSnapshot,
  GroupSnapshot,
  ListSnapshot,
  OverSnapshot,
  ProviderSnapshot,
  SessionSnapshot,
} from '@vue-dnd-kit/core/devtools';
import { acceptLabel, capped, elementValue, fields, keyLabel, type InspectorState } from './format';
import { positionOf, type ItemPosition } from './moves';
import type { NodeRef } from './tree';

export interface NodeState {
  state: InspectorState;
  /** The element to highlight; `null` when the node has none (or it is gone). */
  element: Element | null;
}

const none = (state: InspectorState): NodeState => ({ state, element: null });

const overFields = (over: OverSnapshot | null) =>
  over
    ? fields({ id: over.id, accepted: over.accepted, data: over.data, rect: over.rect, element: elementValue(over.element) })
    : fields({ id: null });

// ─── Provider ──────────────────────────────────────────────────────────────────

const providerState = (ref: NodeRef, snapshot: ProviderSnapshot): InspectorState => ({
  provider: fields({
    id: ref.provider.id,
    status: snapshot.status,
    draggables: snapshot.draggables.length,
    'drop targets': snapshot.droppables.filter((entry) => !entry.sortable).length,
    'lists and trees': snapshot.groups.reduce((sum, group) => sum + group.lists.length, 0),
    selected: snapshot.selection.length,
  }),
  // Props left to their defaults are left out.
  props: fields(snapshot.options, true),
});

const sessionState = (session: SessionSnapshot, groups: GroupSnapshot[]): InspectorState => {
  const { active } = session;
  const sortable = groups.filter((group) => group.session);
  return {
    session: fields({
      status: session.status,
      mode: session.mode,
      settling: session.settling,
      'auto-scrolling': session.autoScrolling,
      activation: session.activation,
      announcement: session.announcement,
    }),
    active: active
      ? fields({
          id: active.id,
          ids: active.ids,
          type: active.type,
          sensor: active.sensor,
          items: active.items,
          rect: active.rect,
          element: elementValue(active.element),
        })
      : fields({ id: null }),
    over: overFields(session.over),
    pointer: fields({ pointer: session.pointer, transform: session.transform }),
    overlay: fields({
      overlay: session.overlay,
      'fit size': session.fitSize,
      'landing key': session.landingKey,
      landings: session.landings,
      previews: session.previews,
      'drop target': session.dropTarget ? session.dropTarget.id : null,
    }),
    ...(sortable.length
      ? {
          'sortable session': sortable.map((group) => ({
            key: group.name,
            value: { ...group.session, indicator: group.indicator },
          })),
        }
      : {}),
  };
};

// ─── Registry ──────────────────────────────────────────────────────────────────

/**
 * Where an item of a sortable list is, editable: an edit moves it there by a drag
 * (`plugin.ts`, `editedMove`). Its index has + and − buttons in the DevTools.
 */
const moveState = (position: ItemPosition | null): InspectorState =>
  position ? { move: [{ key: 'position', value: { list: position.list, index: position.index }, editable: true }] } : {};

const draggableState = (entry: DraggableSnapshot, position: ItemPosition | null): NodeState => ({
  state: {
    draggable: fields({
      id: entry.id,
      type: entry.type,
      disabled: entry.disabled,
      selected: entry.selected,
      dragging: entry.dragging,
      list: entry.list,
      handle: elementValue(entry.handle),
    }),
    ...moveState(position),
    data: fields({ data: entry.data }),
    element: fields({ element: elementValue(entry.element) }),
  },
  element: entry.element,
});

const droppableState = (entry: DroppableSnapshot): NodeState => ({
  state: {
    'drop target': fields({
      id: entry.id,
      accept: acceptLabel(entry.accept),
      'accept rule': entry.accept,
      acceptMode: entry.acceptMode,
      priority: entry.priority,
      disabled: entry.disabled,
      over: entry.over,
      accepting: entry.accepting,
    }),
    data: fields({ data: entry.data }),
    element: fields({ element: elementValue(entry.element) }),
  },
  element: entry.element,
});

const listState = (list: ListSnapshot, group: GroupSnapshot): NodeState => ({
  state: {
    [list.kind]: fields({
      id: list.id,
      group: list.group,
      items: list.count,
      controlled: list.controlled,
      disabled: list.disabled,
      over: list.over,
      accepting: list.accepting,
    }),
    options: fields({
      strategy: list.strategy,
      placeholder: list.placeholder,
      behavior: list.behavior,
      multiple: list.multiple,
      pull: list.pull,
      sort: list.sort,
      dropOutside: list.dropOutside,
      acceptMode: list.acceptMode,
    }),
    order: fields({ keys: capped(list.keys), draft: list.draft && capped(list.draft) }),
    group: fields({
      name: group.name,
      lists: group.lists.map((other) => other.id),
      session: group.session,
      indicator: group.indicator,
    }),
    element: fields({ element: elementValue(list.element) }),
  },
  element: list.element,
});

/** The state of the node `ref`, from its provider's `snapshot`. */
export const nodeState = (ref: NodeRef, snapshot: ProviderSnapshot): NodeState => {
  const find = <T extends { id: Key }>(entries: T[]) => ('id' in ref ? entries.find((entry) => entry.id === ref.id) : undefined);
  const gone = (what: string): NodeState => none({ [what]: fields({ id: 'id' in ref ? keyLabel(ref.id) : null, mounted: false }) });

  switch (ref.kind) {
    case 'provider':
      return none(providerState(ref, snapshot));
    case 'session': {
      const { session } = snapshot;
      return { state: sessionState(session, snapshot.groups), element: session.active?.element ?? null };
    }
    case 'selection':
      return none({ selection: fields({ ids: snapshot.selection }) });
    case 'draggables':
      return none({ draggables: fields({ ids: snapshot.draggables.filter((entry) => entry.list == null).map((entry) => entry.id) }) });
    case 'droppables':
      return none({ 'drop targets': fields({ ids: snapshot.droppables.filter((entry) => !entry.sortable).map((entry) => entry.id) }) });
    case 'lists':
      return none({ lists: snapshot.groups.flatMap((group) => group.lists.map((list) => ({ key: keyLabel(list.id), value: group.name }))) });
    case 'draggable': {
      const entry = find(snapshot.draggables);
      return entry ? draggableState(entry, positionOf(snapshot, entry.id)) : gone('draggable');
    }
    case 'droppable': {
      const entry = find(snapshot.droppables);
      return entry ? droppableState(entry) : gone('drop target');
    }
    case 'list': {
      for (const group of snapshot.groups) {
        const list = find(group.lists);
        if (list) return listState(list, group);
      }
      return gone('list');
    }
  }
};
