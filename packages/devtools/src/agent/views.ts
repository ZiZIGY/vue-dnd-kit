/**
 * The page as the tab sees it: each provider's registry, drag session, options and
 * overrides (`ProviderView`), and the details of the node the tab shows (`DetailView`),
 * built from the bridge's snapshots as plain data.
 */

import type { DevtoolsProvider, ListSnapshot, ProviderSnapshot, SessionSnapshot } from '@vue-dnd-kit/core/devtools';
import type { DetailView, ListView, NodeRef, ProviderView, SessionView } from '../protocol';
import { optionViews } from './options';
import { preview } from './preview';
import { nodeDetails } from './sections';

/** Keys of a list sent at most (the tab shows the mounted items anyway). */
const MAX_KEYS = 300;

const acceptLabel = (rule: unknown): string => {
  if (rule == null || rule === '*') return 'anything';
  if (typeof rule === 'function') return rule.name ? `${rule.name}()` : 'a function';
  return Array.isArray(rule) ? rule.join(' | ') : String(rule);
};

const sessionView = (session: SessionSnapshot): SessionView => ({
  status: session.status,
  active: session.active && {
    id: session.active.id,
    ids: session.active.ids,
    type: session.active.type,
    sensor: session.active.sensor,
  },
  over: session.over && { id: session.over.id, accepted: session.over.accepted },
  mode: session.mode,
  pointer: session.pointer,
  settling: session.settling,
  autoScrolling: session.autoScrolling,
  announcement: session.announcement,
});

const listView = (provider: DevtoolsProvider, list: ListSnapshot): ListView => ({
  id: list.id,
  kind: list.kind,
  group: list.group,
  count: list.count,
  keys: (list.draft ?? list.keys).slice(0, MAX_KEYS),
  drafting: !!list.draft,
  disabled: list.disabled,
  controlled: list.controlled,
  over: list.over,
  accepting: list.accepting,
  options: optionViews(provider, { kind: 'list', id: list.id }, list.kind === 'tree'),
});

export const providerView = (provider: DevtoolsProvider, snapshot: ProviderSnapshot): ProviderView => ({
  id: provider.id,
  label: provider.label,
  status: snapshot.status,
  options: optionViews(provider, { kind: 'provider' }),
  lists: snapshot.groups.flatMap((group) => group.lists.map((list) => listView(provider, list))),
  droppables: snapshot.droppables
    .filter((entry) => !entry.sortable)
    .map((entry) => ({
      id: entry.id,
      accept: acceptLabel(entry.accept),
      priority: entry.priority,
      disabled: entry.disabled,
      over: entry.over,
      accepting: entry.accepting,
      options: optionViews(provider, { kind: 'droppable', id: entry.id }),
    })),
  draggables: snapshot.draggables.map((entry) => ({
    id: entry.id,
    list: entry.list,
    type: entry.type,
    disabled: entry.disabled,
    selected: entry.selected,
    dragging: entry.dragging,
  })),
  selection: snapshot.selection,
  session: sessionView(snapshot.session),
  overrides: provider.overrides.list().map(({ target, option, value }) => ({ target, option, value: preview(value) })),
});

/** The details of `node`, and the element it stands for. */
export const detailView = (provider: DevtoolsProvider, node: NodeRef, snapshot: ProviderSnapshot): { view: DetailView; element: Element | null } => {
  const { mounted, sections, element } = nodeDetails(provider, node, snapshot);
  const options = node.kind === 'draggable' && mounted ? optionViews(provider, { kind: 'draggable', id: node.id }) : [];
  return { view: { node, mounted, sections, options }, element };
};
