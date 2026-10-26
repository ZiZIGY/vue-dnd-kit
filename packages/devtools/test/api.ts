/**
 * The Vue DevTools as the plugin sees them: `@vue/devtools-api` is mocked, and `open()`
 * runs the plugin's setup function the way the DevTools do once the app is registered,
 * with a fake API that records what the plugin adds and answers its handlers.
 */

import type { App } from 'vue';
import { vi } from 'vitest';
import { setupDevtoolsPlugin } from '@vue/devtools-api';
import type { DevtoolsApi, InspectorNode, InspectorState, TimelineEvent } from '../src/format';

type InspectorOptions = Parameters<DevtoolsApi['addInspector']>[0];
type Handler = (payload: never) => void;

export interface FakeDevtools {
  inspector: InspectorOptions;
  timeline: Array<{ layerId: string; event: TimelineEvent }>;
  sendInspectorTree: ReturnType<typeof vi.fn>;
  sendInspectorState: ReturnType<typeof vi.fn>;
  /** The inspector tree, as the DevTools ask for it. */
  tree(filter?: string): InspectorNode[];
  /** The state of a node, as the DevTools ask for it when it is selected. */
  state(nodeId: string): InspectorState | null;
  /**
   * Edits a field of a node's state, as the DevTools send it: `path` from the field's key
   * down (`['position']`, `['position', 'index']`), `section` the section it is in.
   */
  edit(nodeId: string, section: string, path: string[], value: unknown): void;
  /** Clicks a button above the tree (`actions`), by its icon: resolves once its command is done. */
  action(icon: string): Promise<void>;
  /** Clicks a button of the selected node (`nodeActions`), by its icon: resolves once its command is done. */
  nodeAction(icon: string, nodeId: string): Promise<void>;
}

/** The plugin's registrations so far: descriptor and setup function. */
export const registrations = () => vi.mocked(setupDevtoolsPlugin).mock.calls;

/** Runs the plugin's setup for `app`, as the DevTools do once they registered it. */
export const open = (app: App): FakeDevtools => {
  const call = registrations().find(([descriptor]) => descriptor.app === app);
  if (!call) throw new Error('The plugin was not set up for this app.');
  const handlers = new Map<string, Handler>();
  const devtools = {
    timeline: [],
    sendInspectorTree: vi.fn(),
    sendInspectorState: vi.fn(),
    tree(filter = '') {
      const payload = { app, inspectorId: 'vue-dnd-kit', filter, rootNodes: [] as InspectorNode[] };
      handlers.get('tree')!(payload as never);
      return payload.rootNodes;
    },
    state(nodeId: string) {
      const payload = { app, inspectorId: 'vue-dnd-kit', nodeId, state: null as InspectorState | null };
      handlers.get('state')!(payload as never);
      return payload.state;
    },
    edit(nodeId: string, section: string, path: string[], value: unknown) {
      const state = { newKey: null, value, type: typeof value, remove: false };
      handlers.get('edit')!({ app, inspectorId: 'vue-dnd-kit', nodeId, type: section, path, state, set: () => {} } as never);
    },
    async action(icon: string) {
      await devtools.inspector.actions!.find((action) => action.icon === icon)!.action();
    },
    async nodeAction(icon: string, nodeId: string) {
      await devtools.inspector.nodeActions!.find((action) => action.icon === icon)!.action(nodeId);
    },
  } as unknown as FakeDevtools;
  const api = {
    addInspector: (options: InspectorOptions) => (devtools.inspector = options),
    addTimelineLayer: vi.fn(),
    addTimelineEvent: (options: { layerId: string; event: TimelineEvent }) => devtools.timeline.push(options),
    sendInspectorTree: devtools.sendInspectorTree,
    sendInspectorState: devtools.sendInspectorState,
    now: () => Date.now(),
    on: {
      getInspectorTree: (handler: Handler) => handlers.set('tree', handler),
      getInspectorState: (handler: Handler) => handlers.set('state', handler),
      editInspectorState: (handler: Handler) => handlers.set('edit', handler),
    },
  };
  call[1](api as unknown as DevtoolsApi);
  return devtools;
};
