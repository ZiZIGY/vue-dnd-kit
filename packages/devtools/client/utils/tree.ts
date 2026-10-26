/**
 * The registry as a tree: every provider with its drag session, its lists and trees
 * (their mounted items below them, in the order shown), its drop targets and its plain
 * draggables. Chips tell what a drag makes of each node.
 */

import type { Key, ListView, NodeRef, ProviderView } from '../../src/protocol';

export interface Chip {
  label: string;
  color?: 'green' | 'blue' | 'red' | 'orange' | 'purple';
  title?: string;
}

export interface TreeNode {
  /** Unique in the tree. */
  key: string;
  label: string;
  node: NodeRef | null;
  chips: Chip[];
  children?: TreeNode[];
}

export const sameNode = (a: NodeRef | null, b: NodeRef | null): boolean =>
  !!a &&
  !!b &&
  a.provider === b.provider &&
  a.kind === b.kind &&
  (a as { id?: Key }).id === (b as { id?: Key }).id;

/** A key in a node's key: numbers and strings stay apart. */
const encode = (key: Key) => (typeof key === 'number' ? `#${key}` : `$${key}`);

const dragChips = (entry: { over: boolean; accepting: boolean | null; disabled: boolean }): Chip[] => {
  const chips: Chip[] = [];
  if (entry.over) chips.push({ label: 'over', color: 'green' });
  if (entry.accepting === true) chips.push({ label: 'accepts', color: 'blue', title: 'takes the dragged items' });
  else if (entry.accepting === false && !entry.disabled) chips.push({ label: 'refuses', color: 'red', title: 'does not take the dragged items' });
  if (entry.disabled) chips.push({ label: 'disabled' });
  return chips;
};

const overridden = (provider: ProviderView, kind: string, id?: Key): Chip[] =>
  provider.overrides.some((entry) => entry.target.kind === kind && (entry.target as { id?: Key }).id === id)
    ? [{ label: 'edited', color: 'purple', title: 'has options overridden in the devtools' }]
    : [];

const providerNode = (provider: ProviderView): TreeNode => {
  const at = (kind: NodeRef['kind'], id?: Key): NodeRef =>
    (id === undefined ? { provider: provider.id, kind } : { provider: provider.id, kind, id }) as NodeRef;
  const key = (kind: string, id?: Key) => `${provider.id}/${kind}${id === undefined ? '' : `/${encode(id)}`}`;

  const draggable = (id: Key): TreeNode => {
    const entry = provider.draggables.find((candidate) => candidate.id === id)!;
    const chips: Chip[] = [];
    if (entry.dragging) chips.push({ label: 'dragging', color: 'green' });
    if (entry.selected) chips.push({ label: 'selected', color: 'blue' });
    if (entry.disabled) chips.push({ label: 'disabled' });
    if (entry.list == null && entry.type.length) chips.push({ label: entry.type.join(' | '), title: 'type' });
    return { key: key('draggable', id), label: String(id), node: at('draggable', id), chips: [...chips, ...overridden(provider, 'draggable', id)] };
  };

  const listNode = (list: ListView): TreeNode => {
    // Its mounted items, in the order it shows them.
    const mounted = new Set(provider.draggables.filter((entry) => entry.list === list.id).map((entry) => entry.id));
    const chips = [...dragChips(list), { label: `${list.count}` }];
    if (!list.group.startsWith('sortable:')) chips.push({ label: list.group, color: 'purple', title: 'group' });
    if (list.drafting) chips.push({ label: 'draft', color: 'orange', title: 'shows the draft order of the drag' });
    return {
      key: key('list', list.id),
      label: `${list.kind} ${list.id}`,
      node: at('list', list.id),
      chips: [...chips, ...overridden(provider, 'list', list.id)],
      children: list.keys.filter((id) => mounted.has(id)).map(draggable),
    };
  };

  const { session } = provider;
  const sessionChips: Chip[] =
    session.status === 'idle'
      ? []
      : [
          { label: session.status, color: 'green' },
          ...(session.active ? [{ label: String(session.active.id) }] : []),
          ...(session.mode !== 'move' ? [{ label: session.mode, color: 'purple' as const }] : []),
        ];
  const plain = provider.draggables.filter((entry) => entry.list == null);
  const group = (name: string, label: string, children: TreeNode[]): TreeNode[] =>
    children.length ? [{ key: key(name), label, node: null, chips: [{ label: String(children.length) }], children }] : [];

  return {
    key: key('provider'),
    label: provider.label,
    node: at('provider'),
    chips: [{ label: provider.status, color: provider.status === 'idle' ? undefined : 'green' }, ...overridden(provider, 'provider')],
    children: [
      { key: key('session'), label: 'Drag session', node: at('session'), chips: sessionChips },
      ...group('lists', 'Lists and trees', provider.lists.map(listNode)),
      ...group(
        'droppables',
        'Drop targets',
        provider.droppables.map((entry) => ({
          key: key('droppable', entry.id),
          label: String(entry.id),
          node: at('droppable', entry.id),
          chips: [...dragChips(entry), { label: `accept: ${entry.accept}` }, ...overridden(provider, 'droppable', entry.id)],
        })),
      ),
      ...group('draggables', 'Draggables', plain.map((entry) => draggable(entry.id))),
    ],
  };
};

/** Matches the filter: the node itself or any node below it. */
const matches = (node: TreeNode, filter: string): boolean =>
  !filter || node.label.toLowerCase().includes(filter) || !!node.children?.some((child) => matches(child, filter));

/** Children that match, unless the parent itself does (then all of them). */
const filtered = (node: TreeNode, filter: string): TreeNode => {
  if (!filter || node.label.toLowerCase().includes(filter) || !node.children) return node;
  return { ...node, children: node.children.filter((child) => matches(child, filter)).map((child) => filtered(child, filter)) };
};

/** The tree of `providers`, filtered by `filter` (case-insensitive, on labels). */
export const buildTree = (providers: readonly ProviderView[], filter = ''): TreeNode[] => {
  const query = filter.trim().toLowerCase();
  return providers
    .map(providerNode)
    .filter((root) => matches(root, query))
    .map((root) => filtered(root, query));
};
