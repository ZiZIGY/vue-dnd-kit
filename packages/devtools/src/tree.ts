/**
 * The inspector tree: every provider with its drag session, its selection, its plain
 * draggables, its drop targets and its sortable lists and trees (their items inside).
 * Each node's id says what it stands for (`NodeRef`), so its state can be found again.
 */

import type { Key } from '@vue-dnd-kit/core';
import type {
  DevtoolsProvider,
  DraggableSnapshot,
  DroppableSnapshot,
  ListSnapshot,
  ProviderSnapshot,
} from '@vue-dnd-kit/core/devtools';
import { COLORS, STATUS_COLORS, acceptLabel, keyLabel, tag, type InspectorNode, type InspectorTag } from './format';

/** What a node of the tree stands for. */
export type NodeRef =
  | { kind: 'provider' | 'session' | 'selection' | 'draggables' | 'droppables' | 'lists'; provider: DevtoolsProvider }
  | { kind: 'draggable' | 'droppable' | 'list'; provider: DevtoolsProvider; id: Key };

export interface InspectorTree {
  roots: InspectorNode[];
  /** Node id → what it stands for. */
  nodes: Map<string, NodeRef>;
}

/** A key in a node id: numbers and strings stay apart (`1` and `'1'` are two items). */
const encode = (key: Key) => (typeof key === 'number' ? `#${key}` : `$${key}`);

export const nodeId = (ref: NodeRef): string => {
  const base = `${ref.provider.id}`;
  if (ref.kind === 'provider') return base;
  return 'id' in ref ? `${base}/${ref.kind}/${encode(ref.id)}` : `${base}/${ref.kind}`;
};

// ─── Tags ──────────────────────────────────────────────────────────────────────

const draggableTags = (entry: DraggableSnapshot): InspectorTag[] => {
  const tags: InspectorTag[] = [];
  if (entry.dragging) tags.push(tag('dragging', COLORS.green));
  if (entry.selected) tags.push(tag('selected', COLORS.blue));
  if (entry.disabled) tags.push(tag('disabled', COLORS.grey));
  // Sortable items are typed by their group: the list says it already.
  if (entry.list == null && entry.type.length) tags.push(tag(entry.type.join(' | '), COLORS.slate, 'type'));
  return tags;
};

/** Over, accepts or refuses during a drag. */
const dragTags = (entry: { over: boolean; accepting: boolean | null; disabled: boolean }): InspectorTag[] => {
  const tags: InspectorTag[] = [];
  if (entry.over) tags.push(tag('over', COLORS.green));
  if (entry.accepting === true) tags.push(tag('accepts', COLORS.blue, 'takes the dragged items'));
  else if (entry.accepting === false && !entry.disabled) tags.push(tag('refuses', COLORS.red, 'does not take the dragged items'));
  if (entry.disabled) tags.push(tag('disabled', COLORS.grey));
  return tags;
};

const droppableTags = (entry: DroppableSnapshot): InspectorTag[] => {
  const tags = dragTags(entry);
  tags.push(tag(`accept: ${acceptLabel(entry.accept)}`, COLORS.slate, `acceptMode: ${entry.acceptMode}`));
  if (entry.priority) tags.push(tag(`priority ${entry.priority}`, COLORS.slate));
  return tags;
};

const listTags = (list: ListSnapshot): InspectorTag[] => {
  const tags = dragTags(list);
  tags.push(tag(`${list.count} ${list.count === 1 ? 'item' : 'items'}`, COLORS.slate));
  // Lists without `group` have one of their own.
  if (!list.group.startsWith('sortable:')) tags.push(tag(`group: ${list.group}`, COLORS.purple));
  if (list.draft) tags.push(tag('draft', COLORS.orange, 'shows the draft order of the drag'));
  return tags;
};

// ─── Tree ──────────────────────────────────────────────────────────────────────

/** Matches the filter: the node itself or any node below it. */
const matches = (node: InspectorNode, filter: string): boolean =>
  !filter || node.label.toLowerCase().includes(filter) || !!node.children?.some((child) => matches(child, filter));

/** Children that match, unless the parent itself does (then all of them). */
const filtered = (node: InspectorNode, filter: string): InspectorNode => {
  if (!filter || node.label.toLowerCase().includes(filter) || !node.children) return node;
  return { ...node, children: node.children.filter((child) => matches(child, filter)).map((child) => filtered(child, filter)) };
};

const providerNode = (provider: DevtoolsProvider, snapshot: ProviderSnapshot, nodes: Map<string, NodeRef>): InspectorNode => {
  const node = (ref: NodeRef, label: string, tags: InspectorTag[] = [], children?: InspectorNode[]): InspectorNode => {
    const id = nodeId(ref);
    nodes.set(id, ref);
    return { id, label, tags, ...(children ? { children } : {}) };
  };
  const count = (n: number) => [tag(String(n), COLORS.slate)];
  const { session } = snapshot;

  const draggable = (entry: DraggableSnapshot) => node({ kind: 'draggable', provider, id: entry.id }, keyLabel(entry.id), draggableTags(entry));
  const plain = snapshot.draggables.filter((entry) => entry.list == null);
  const targets = snapshot.droppables.filter((entry) => !entry.sortable);
  const lists = snapshot.groups.flatMap((group) => group.lists);
  const itemsOf = new Map<Key, DraggableSnapshot[]>();
  for (const entry of snapshot.draggables) {
    if (entry.list != null) itemsOf.set(entry.list, [...(itemsOf.get(entry.list) ?? []), entry]);
  }

  const listNode = (list: ListSnapshot) => {
    // Its mounted items, in the order it shows them (the draft while dragging).
    const order = new Map((list.draft ?? list.keys).map((key, index) => [key, index]));
    const items = (itemsOf.get(list.id) ?? []).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
    return node({ kind: 'list', provider, id: list.id }, `${list.kind} ${keyLabel(list.id)}`, listTags(list), items.map(draggable));
  };

  const sessionTags =
    session.status === 'idle'
      ? []
      : [
          tag(session.status, STATUS_COLORS[session.status]),
          ...(session.active ? [tag(keyLabel(session.active.id), COLORS.slate, 'active')] : []),
          ...(session.mode !== 'move' ? [tag(session.mode, COLORS.purple, 'mode')] : []),
        ];

  return node(
    { kind: 'provider', provider },
    provider.label,
    [tag(snapshot.status, STATUS_COLORS[snapshot.status])],
    [
      node({ kind: 'session', provider }, 'Drag session', sessionTags),
      node({ kind: 'selection', provider }, 'Selection', count(snapshot.selection.length)),
      node({ kind: 'draggables', provider }, 'Draggables', count(plain.length), plain.map(draggable)),
      node(
        { kind: 'droppables', provider },
        'Drop targets',
        count(targets.length),
        targets.map((entry) => node({ kind: 'droppable', provider, id: entry.id }, keyLabel(entry.id), droppableTags(entry))),
      ),
      node({ kind: 'lists', provider }, 'Sortable lists and trees', count(lists.length), lists.map(listNode)),
    ],
  );
};

/** The tree of `providers`, filtered by `filter` (case-insensitive, on labels). */
export const buildTree = (providers: readonly DevtoolsProvider[], filter = ''): InspectorTree => {
  const nodes = new Map<string, NodeRef>();
  const query = filter.trim().toLowerCase();
  const roots = providers
    .map((provider) => providerNode(provider, provider.snapshot(), nodes))
    .filter((root) => matches(root, query))
    .map((root) => filtered(root, query));
  return { roots, nodes };
};

