/**
 * The plugin: the "Vue DnD Kit" inspector and timeline layer of an app, fed by the core's
 * devtools bridge. The bridge is connected when the plugin is set up for an app (before
 * it mounts), so its providers report; they are followed only once the DevTools set the
 * plugin up, which they do when a DevTools panel opens (the browser extension's, or
 * `vite-plugin-vue-devtools`'s).
 */

import type { App } from 'vue';
import { setupDevtoolsPlugin } from '@vue/devtools-api';
import type { SensorDirection } from '@vue-dnd-kit/core';
import { connectDevtools, type DevtoolsBridge, type DevtoolsEvent, type DevtoolsProvider } from '@vue-dnd-kit/core/devtools';
import { buildTree, type InspectorTree, type NodeRef } from './tree';
import { nodeState } from './state';
import { timelineEntries, type DragContext } from './timeline';
import { highlight, reveal } from './highlight';
import { editedMove, MOVES, resolveMove, type MoveTarget } from './moves';
import type { Drive } from './drive';
import { COLORS, keyLabel, type DevtoolsApi } from './format';

export const PLUGIN_ID = 'dev.vue-dnd-kit';
export const INSPECTOR_ID = 'vue-dnd-kit';
export const LAYER_ID = 'vue-dnd-kit';

/** Registrations aren't reactive: the tree is compared this often and sent when it changed. */
const POLL_INTERVAL = 1000;
/** The state of the selected node follows a drag at most this often. */
const MOVE_REFRESH = 200;

/** Apps the plugin is set up for. */
const apps = new WeakSet<App>();

/** What a node is, for the label of its highlight. */
const nodeLabel = (ref: NodeRef): string => {
  switch (ref.kind) {
    case 'draggable':
      return `draggable ${keyLabel(ref.id)}`;
    case 'droppable':
      return `drop target ${keyLabel(ref.id)}`;
    case 'list':
      return keyLabel(ref.id);
    case 'session':
      return 'active';
    default:
      return ref.provider.label;
  }
};

/** The inspector and the timeline layer of `app`, once the DevTools set the plugin up. */
const connect = (api: DevtoolsApi, app: App, bridge: DevtoolsBridge) => {
  /**
   * The providers this app shows: its own, and those of apps without the plugin (a
   * provider shared with an app in a shadow root holds that app's items too).
   */
  const ours = (provider: DevtoolsProvider) => !provider.app || provider.app === app || !apps.has(provider.app);
  const shown = () => bridge.providers().filter(ours);
  /** For this app's inspector (with several apps, every plugin hears every request). */
  const asked = (payload: { app?: unknown; inspectorId: string }) =>
    payload.inspectorId === INSPECTOR_ID && (!payload.app || payload.app === app);

  let tree: InspectorTree = { roots: [], nodes: new Map() };
  /** The node whose element was highlighted: refreshes of its state don't flash it again. */
  let highlighted: string | null = null;

  /** What a node stands for; asked before the tree was too (the DevTools keep the selection across reloads). */
  const refOf = (nodeId: string) => tree.nodes.get(nodeId) ?? (tree = buildTree(shown())).nodes.get(nodeId);

  const stateOf = (nodeId: string) => {
    const ref = refOf(nodeId);
    return ref && { ref, ...nodeState(ref, ref.provider.snapshot()) };
  };

  // ─── Drags from the inspector ────────────────────────────────────────────────

  /** The inspector's drags (`drive.ts`), loaded on the first command. */
  let drive: Promise<Drive> | null = null;
  const loadDrive = () => (drive ??= import('./drive').then(({ createDrive }) => createDrive()));
  /** The draggable (or sortable item) a node stands for. */
  const itemOf = (nodeId: string) => {
    const ref = refOf(nodeId);
    return ref?.kind === 'draggable' ? ref : null;
  };
  /** Moves the item of a node, from where it is when the move's turn comes; other nodes have none to move. */
  const move = (target: MoveTarget) => async (nodeId: string) => {
    const item = itemOf(nodeId);
    if (!item) return;
    await (await loadDrive()).move(item.provider, item.id, () => resolveMove(item.provider.snapshot(), item.id, target));
  };
  /** For the drag of every provider shown (one drags, as a rule). */
  const each = (command: (loaded: Drive, provider: DevtoolsProvider) => Promise<unknown>) => async () => {
    const loaded = await loadDrive();
    await Promise.all(shown().map((provider) => command(loaded, provider)));
  };
  const step = (direction: SensorDirection) => each((loaded, provider) => loaded.step(provider, direction));

  api.addInspector({
    id: INSPECTOR_ID,
    label: 'Vue DnD Kit',
    icon: 'drag_indicator',
    treeFilterPlaceholder: 'Filter by id',
    noSelectionText: 'Select a provider, its drag session, a draggable, a drop target or a list.',
    actions: [
      { icon: 'cancel', tooltip: 'Cancel the current drag', action: () => shown().forEach((provider) => provider.cancel()) },
      { icon: 'deselect', tooltip: 'Clear the selection', action: () => shown().forEach((provider) => provider.clearSelection()) },
      { icon: 'keyboard_arrow_up', tooltip: 'Step the current keyboard drag up', action: step('up') },
      { icon: 'keyboard_arrow_down', tooltip: 'Step the current keyboard drag down', action: step('down') },
      { icon: 'keyboard_arrow_left', tooltip: 'Step the current keyboard drag left', action: step('left') },
      { icon: 'keyboard_arrow_right', tooltip: 'Step the current keyboard drag right', action: step('right') },
      { icon: 'file_download_done', tooltip: 'Drop the current drag', action: each((loaded, provider) => loaded.drop(provider)) },
    ],
    nodeActions: [
      {
        icon: 'center_focus_strong',
        tooltip: 'Scroll into view and highlight',
        action: (nodeId) => {
          const found = stateOf(nodeId);
          if (found) reveal(found.element, nodeLabel(found.ref));
        },
      },
      { icon: 'arrow_upward', tooltip: 'Move up: an item of a sortable list, by a drag', action: move(MOVES.up) },
      { icon: 'arrow_downward', tooltip: 'Move down: an item of a sortable list, by a drag', action: move(MOVES.down) },
      { icon: 'vertical_align_top', tooltip: 'Move to the start of its list, by a drag', action: move(MOVES.start) },
      { icon: 'vertical_align_bottom', tooltip: 'Move to the end of its list, by a drag', action: move(MOVES.end) },
      {
        icon: 'open_with',
        tooltip: 'Pick it up for a keyboard drag: step it, drop it or cancel it with the buttons above the tree',
        action: async (nodeId) => {
          const item = itemOf(nodeId);
          if (item) (await loadDrive()).start(item.provider, item.id);
        },
      },
    ],
  });
  api.addTimelineLayer({ id: LAYER_ID, label: 'Vue DnD Kit', color: COLORS.green });

  api.on.getInspectorTree((payload) => {
    if (!asked(payload)) return;
    tree = buildTree(shown(), payload.filter);
    payload.rootNodes = tree.roots;
  });

  api.on.getInspectorState((payload) => {
    if (!asked(payload)) return;
    const found = stateOf(payload.nodeId);
    if (!found) return;
    payload.state = found.state;
    if (payload.nodeId === highlighted) return;
    highlighted = payload.nodeId;
    highlight(found.element, nodeLabel(found.ref));
  });

  // An edit of an item's `position` (its only editable field) moves it there: the state
  // follows once it has. The path tells the field (`type` is unset for custom inspectors).
  api.on.editInspectorState((payload) => {
    if (!asked(payload) || payload.state.remove || payload.state.newKey) return;
    const target = editedMove(payload.path, payload.state.value);
    if (target) void move(target)(payload.nodeId);
  });

  // ─── Updates ─────────────────────────────────────────────────────────────────

  const refresh = (structure: boolean) => {
    if (structure) api.sendInspectorTree(INSPECTOR_ID);
    api.sendInspectorState(INSPECTOR_ID);
  };
  let movedAt = 0;
  /** The drag running at each provider, for the timeline. */
  const drags = new Map<DevtoolsProvider, DragContext>();

  const log = (provider: DevtoolsProvider, event: DevtoolsEvent) => {
    let context = drags.get(provider) ?? { drag: null, released: false };
    if (event.type === 'start') context = { drag: event.drag, released: false };
    else if (event.type === 'release') context = { ...context, released: true };
    for (const entry of timelineEntries(provider, event, context)) {
      api.addTimelineEvent({ layerId: LAYER_ID, event: { time: api.now(), ...entry } });
    }
    // The drop's announcement and the end of auto-scroll still belong to the drag.
    if (event.type === 'status' && event.status === 'idle') context = { drag: null, released: false };
    drags.set(provider, context);
  };

  const unsubscribe = bridge.subscribe({
    added: (provider) => {
      if (ours(provider)) refresh(true);
    },
    removed: (provider) => {
      drags.delete(provider);
      void drive?.then((loaded) => loaded.forget(provider));
      if (ours(provider)) refresh(true);
    },
    event: (provider, event) => {
      if (!ours(provider)) return;
      log(provider, event);
      if (event.type !== 'move') return refresh(event.type !== 'announcement' && event.type !== 'autoScroll');
      const now = Date.now();
      if (now - movedAt < MOVE_REFRESH) return;
      movedAt = now;
      refresh(false);
    },
  });

  // Items mount and unmount without events: the tree is compared now and then.
  let sent = '';
  const poll = setInterval(() => {
    if (document.visibilityState === 'hidden') return;
    const next = JSON.stringify(buildTree(shown()).roots);
    if (next === sent) return;
    sent = next;
    api.sendInspectorTree(INSPECTOR_ID);
  }, POLL_INTERVAL);

  app.onUnmount(() => {
    clearInterval(poll);
    unsubscribe();
    void drive?.then((loaded) => loaded.stop());
  });
};

/** Sets the plugin up for `app` (once). */
export function setup(app: App): void {
  if (apps.has(app)) return;
  apps.add(app);
  // Providers report from now on: the app hasn't mounted yet, or a provider of it is being set up.
  const bridge = connectDevtools();
  setupDevtoolsPlugin(
    {
      id: PLUGIN_ID,
      label: 'Vue DnD Kit',
      packageName: '@vue-dnd-kit/devtools',
      homepage: 'https://github.com/zizigy/vue-dnd-kit',
      app,
    },
    (api) => connect(api, app, bridge),
  );
}

let auto = false;

/** Sets the plugin up for the app of every provider, from now on. */
export function autoSetup(): void {
  if (auto) return;
  auto = true;
  const bridge = connectDevtools();
  const add = (provider: DevtoolsProvider) => {
    if (provider.app) setup(provider.app);
  };
  bridge.providers().forEach(add);
  // Only told about providers: they are followed once the DevTools set the plugin up.
  bridge.subscribe({ added: add });
}
