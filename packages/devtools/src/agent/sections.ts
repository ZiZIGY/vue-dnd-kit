/**
 * The details of a node of the tab's tree: what the bridge's snapshot says about it, in
 * sections, and the element it stands for (which the page highlights).
 */

import type { Key } from '@vue-dnd-kit/core';
import type {
  DevtoolsProvider,
  DraggableSnapshot,
  DroppableSnapshot,
  GroupSnapshot,
  ListSnapshot,
  OverSnapshot,
  ProviderSnapshot,
  SessionSnapshot,
} from '@vue-dnd-kit/core/devtools';
import type { NodeRef, Section } from '../protocol';
import { positionOf } from './moves';
import { preview } from './preview';

export interface NodeDetails {
  mounted: boolean;
  sections: Section[];
  /** The element to highlight; `null` when the node has none (or it is gone). */
  element: Element | null;
}

/** At most `max` entries of a long array (drafts of big lists), with the count of the rest. */
const capped = <T>(values: readonly T[], max = 200): T[] | { first: T[]; more: number } =>
  values.length <= max ? [...values] : { first: values.slice(0, max), more: values.length - max };

const section = (name: string, record: Record<string, unknown>): Section => ({
  name,
  fields: Object.entries(record)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, preview(value)]),
});

const overFields = (over: OverSnapshot | null) =>
  over ? { id: over.id, accepted: over.accepted, data: over.data, rect: over.rect, element: over.element } : { id: null };

// ─── Provider and session ──────────────────────────────────────────────────────

const providerSections = (provider: DevtoolsProvider, snapshot: ProviderSnapshot): Section[] => [
  section('provider', {
    id: provider.id,
    status: snapshot.status,
    draggables: snapshot.draggables.length,
    'drop targets': snapshot.droppables.filter((entry) => !entry.sortable).length,
    'lists and trees': snapshot.groups.reduce((sum, group) => sum + group.lists.length, 0),
    selected: snapshot.selection.length,
  }),
  // Props left to their defaults are left out.
  section('props', snapshot.options),
];

const sessionSections = (session: SessionSnapshot, groups: GroupSnapshot[]): Section[] => {
  const { active } = session;
  return [
    section('session', {
      status: session.status,
      mode: session.mode,
      settling: session.settling,
      'auto-scrolling': session.autoScrolling,
      activation: session.activation,
      announcement: session.announcement,
    }),
    section(
      'active',
      active
        ? { id: active.id, ids: active.ids, type: active.type, sensor: active.sensor, items: active.items, rect: active.rect, element: active.element }
        : { id: null },
    ),
    section('over', overFields(session.over)),
    section('pointer', { pointer: session.pointer, transform: session.transform }),
    section('overlay', {
      overlay: session.overlay,
      'fit size': session.fitSize,
      'landing key': session.landingKey,
      landings: session.landings,
      previews: session.previews,
      'drop target': session.dropTarget ? session.dropTarget.id : null,
    }),
    ...groups
      .filter((group) => group.session)
      .map((group) => section(`sortable session · ${group.name}`, { ...group.session, indicator: group.indicator })),
  ];
};

// ─── Registry ──────────────────────────────────────────────────────────────────

const draggableSections = (entry: DraggableSnapshot, snapshot: ProviderSnapshot): Section[] => {
  const position = positionOf(snapshot, entry.id);
  return [
    section('draggable', {
      id: entry.id,
      type: entry.type,
      disabled: entry.disabled,
      selected: entry.selected,
      dragging: entry.dragging,
      list: entry.list,
      position: position && { list: position.list, index: position.index },
      handle: entry.handle,
    }),
    section('data', { data: entry.data }),
    section('element', { element: entry.element }),
  ];
};

const droppableSections = (entry: DroppableSnapshot): Section[] => [
  section('drop target', {
    id: entry.id,
    accept: entry.accept,
    acceptMode: entry.acceptMode,
    priority: entry.priority,
    disabled: entry.disabled,
    over: entry.over,
    accepting: entry.accepting,
  }),
  section('data', { data: entry.data }),
  section('element', { element: entry.element }),
];

const listSections = (list: ListSnapshot, group: GroupSnapshot): Section[] => [
  section(list.kind, {
    id: list.id,
    group: list.group,
    items: list.count,
    controlled: list.controlled,
    disabled: list.disabled,
    over: list.over,
    accepting: list.accepting,
    pull: list.pull,
  }),
  section('order', { keys: capped(list.keys), draft: list.draft && capped(list.draft) }),
  section('group', { name: group.name, lists: group.lists.map((other) => other.id), session: group.session, indicator: group.indicator }),
  section('element', { element: list.element }),
];

/** The details of `node`, from its provider's `snapshot`. */
export const nodeDetails = (provider: DevtoolsProvider, node: NodeRef, snapshot: ProviderSnapshot): NodeDetails => {
  const find = <T extends { id: Key }>(entries: T[]) => ('id' in node ? entries.find((entry) => entry.id === node.id) : undefined);
  const gone: NodeDetails = { mounted: false, sections: [], element: null };

  switch (node.kind) {
    case 'provider':
      return { mounted: true, sections: providerSections(provider, snapshot), element: null };
    case 'session':
      return { mounted: true, sections: sessionSections(snapshot.session, snapshot.groups), element: snapshot.session.active?.element ?? null };
    case 'draggable': {
      const entry = find(snapshot.draggables);
      return entry ? { mounted: true, sections: draggableSections(entry, snapshot), element: entry.element } : gone;
    }
    case 'droppable': {
      const entry = find(snapshot.droppables);
      return entry ? { mounted: true, sections: droppableSections(entry), element: entry.element } : gone;
    }
    case 'list': {
      for (const group of snapshot.groups) {
        const list = find(group.lists);
        if (list) return { mounted: true, sections: listSections(list, group), element: list.element };
      }
      return gone;
    }
  }
};
