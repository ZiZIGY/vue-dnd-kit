import { expect, test, type Page } from '@playwright/test';
import { center, dragTo, trackErrors, trackVueWarnings, waitForIdle } from './helpers';

// The Vue DevTools plugin, which src/main.ts installs in development. Without the
// DevTools it only records the providers and the page works as ever. With them (`yarn
// dev:devtools`: vite-plugin-vue-devtools, or the browser extension) the "Vue DnD Kit"
// inspector shows the providers and the drag.
//
// The e2e server runs plain `vite`: the inspector's own tests capture the plugin as it
// registers with the DevTools kit, and run it against a stand-in of the DevTools API,
// as the package's unit tests do, on the real page.

type Handler = (payload: Record<string, unknown>) => void;
type Action = { icon: string; action: (nodeId?: string) => void | Promise<void> };
type Node = { id: string; label: string; children?: Node[] };

interface Inspector {
  options: { actions: Action[]; nodeActions: Action[] };
  handlers: Record<'tree' | 'state' | 'edit', Handler>;
  timeline: Array<{ title: string; subtitle?: string; groupId?: string | number }>;
  /** The id of the node labelled `label`. */
  find(label: string): string;
}

interface DevtoolsWindow {
  __VUE_DND_KIT_DEVTOOLS_HOOK__?: object;
  __VUE_DEVTOOLS_VITE_PLUGIN_CLIENT_URL__?: string;
  __VUE_DEVTOOLS_KIT_INSPECTOR__?: Array<{ options: { id: string } }>;
  __VUE_DEVTOOLS_KIT_CONTEXT__?: {
    api: {
      getInspectorTree(payload: { inspectorId: string; filter: string }): Promise<Array<{ label: string; children?: unknown[] }>>;
    };
  };
  __VUE_DEVTOOLS_HOOK?: {
    hook(name: string, fn: (...args: unknown[]) => unknown): () => void;
    callHook(name: string, ...args: unknown[]): Promise<void>;
  };
  /** Plugins set up with the DevTools: descriptor and setup function. */
  __dndPlugins?: Array<[{ id: string }, (api: unknown) => void]>;
  __dndInspector?: Inspector;
}

/** vite-plugin-vue-devtools is in the page (`yarn dev:devtools`). */
const hasVitePlugin = (page: Page) => page.evaluate(() => !!(window as DevtoolsWindow).__VUE_DEVTOOLS_VITE_PLUGIN_CLIENT_URL__);

/**
 * Opens the DevTools panel of vite-plugin-vue-devtools: plugins are set up once a
 * DevTools client is there (before, the kit keeps them waiting).
 */
const openDevtools = async (page: Page) => {
  await page.keyboard.press('Alt+Shift+D');
  await page.waitForFunction(() =>
    ((window as DevtoolsWindow).__VUE_DEVTOOLS_KIT_INSPECTOR__ ?? []).some((inspector) => inspector.options.id === 'vue-dnd-kit'),
  );
};

/** Labels of the inspector's root nodes. */
const inspectorRoots = (page: Page) =>
  page.evaluate(async () => {
    const api = (window as DevtoolsWindow).__VUE_DEVTOOLS_KIT_CONTEXT__!.api;
    const roots = await api.getInspectorTree({ inspectorId: 'vue-dnd-kit', filter: '' });
    return roots.map((root) => root.label);
  });

/**
 * Before the page runs: the hooks of `@vue/devtools-kit` (it creates them unless they are
 * there: `__VUE_DEVTOOLS_HOOK ??= createHooks()`), with a listener that keeps every plugin
 * set up with the DevTools. Calls run in turn, each after the last, as the kit's do.
 */
const capturePlugins = (page: Page) =>
  page.addInitScript(() => {
    const win = window as DevtoolsWindow;
    const hooks = new Map<string, Array<(...args: unknown[]) => unknown>>();
    win.__dndPlugins = [];
    win.__VUE_DEVTOOLS_HOOK = {
      hook(name, fn) {
        const list = hooks.get(name) ?? [];
        hooks.set(name, [...list, fn]);
        return () => hooks.set(name, (hooks.get(name) ?? []).filter((other) => other !== fn));
      },
      callHook: (name, ...args) =>
        (hooks.get(name) ?? []).reduce<Promise<unknown>>((done, fn) => done.then(() => fn(...args)), Promise.resolve()).then(() => {}),
    };
    win.__VUE_DEVTOOLS_HOOK.hook('devtools-plugin:setup', (descriptor, setup) =>
      win.__dndPlugins!.push([descriptor as { id: string }, setup as (api: unknown) => void]),
    );
  });

/** Runs the captured plugin with a stand-in of the DevTools API: `window.__dndInspector`. */
const openInspector = (page: Page) =>
  page.evaluate(() => {
    const win = window as DevtoolsWindow;
    const [, setup] = win.__dndPlugins!.find(([descriptor]) => descriptor.id === 'dev.vue-dnd-kit')!;
    const inspector = { handlers: {}, timeline: [] } as unknown as Inspector;
    const nodes = (list: Node[]): Node[] => list.flatMap((node) => [node, ...nodes(node.children ?? [])]);
    inspector.find = (label) => {
      const payload = { inspectorId: 'vue-dnd-kit', filter: '', rootNodes: [] as Node[] };
      inspector.handlers.tree(payload);
      return nodes(payload.rootNodes).find((node) => node.label === label)!.id;
    };
    setup({
      addInspector: (options: Inspector['options']) => (inspector.options = options),
      addTimelineLayer: () => {},
      // Titles only: the data holds elements.
      addTimelineEvent: ({ event }: { event: Inspector['timeline'][number] }) =>
        inspector.timeline.push({ title: event.title, subtitle: event.subtitle, groupId: event.groupId }),
      sendInspectorTree: () => {},
      sendInspectorState: () => {},
      now: () => Date.now(),
      on: {
        getInspectorTree: (handler: Handler) => (inspector.handlers.tree = handler),
        getInspectorState: (handler: Handler) => (inspector.handlers.state = handler),
        editInspectorState: (handler: Handler) => (inspector.handlers.edit = handler),
      },
    });
    win.__dndInspector = inspector;
  });

/** Clicks a button of the node labelled `label` (by its icon); resolves once its drag is done. */
const nodeAction = (page: Page, icon: string, label: string) =>
  page.evaluate(
    async ([icon, label]) => {
      const inspector = (window as DevtoolsWindow).__dndInspector!;
      await inspector.options.nodeActions.find((action) => action.icon === icon)!.action(inspector.find(label));
    },
    [icon, label],
  );

/** Clicks a button above the inspector's tree (by its icon). */
const action = (page: Page, icon: string) =>
  page.evaluate(async (icon) => {
    await (window as DevtoolsWindow).__dndInspector!.options.actions.find((action) => action.icon === icon)!.action();
  }, icon);

/** Edits a field of the state of the node labelled `label`, as the DevTools send it (`path` from the field's key down). */
const edit = (page: Page, label: string, path: string[], value: unknown) =>
  page.evaluate(
    ({ label, path, value }) => {
      const inspector = (window as DevtoolsWindow).__dndInspector!;
      const state = { value, newKey: null, remove: false };
      inspector.handlers.edit({ inspectorId: 'vue-dnd-kit', nodeId: inspector.find(label), path, state });
    },
    { label, path, value },
  );

/** `title: subtitle` of the timeline, announcements left out. */
const timeline = (page: Page) =>
  page.evaluate(() =>
    (window as DevtoolsWindow).__dndInspector!.timeline.filter((event) => event.title !== 'announcement').map((event) => `${event.title}: ${event.subtitle}`),
  );

const row = (page: Page, id: string) => page.locator(`[data-testid="list"] [data-id="${id}"]`);

test('the playground runs with the devtools plugin installed', async ({ page }) => {
  const errors = trackErrors(page);
  const warnings = trackVueWarnings(page);
  await page.goto('/#sortable');
  await expect(page.getByTestId('order')).toHaveText('t1,t2,t3,t4,t5,t6,t7,t8');
  // Installed before the app mounted: the hook is there for the providers.
  expect(await page.evaluate(() => !!(window as DevtoolsWindow).__VUE_DND_KIT_DEVTOOLS_HOOK__)).toBe(true);
  // The kit itself is always in the page (the plugin imports it); its panel only with the Vite plugin.
  const devtools = await hasVitePlugin(page);
  if (devtools) await openDevtools(page);

  await dragTo(page, row(page, 't1'), await center(row(page, 't4'), 0.8));
  await waitForIdle(page);
  await expect(page.getByTestId('order')).toHaveText('t2,t3,t4,t1,t5,t6,t7,t8');

  if (devtools) expect((await inspectorRoots(page)).some((label) => label.startsWith('DnDProvider'))).toBe(true);
  expect(errors).toEqual([]);
  expect(warnings).toEqual([]);
});

test.describe('drags from the inspector', () => {
  test.beforeEach(async ({ page }) => {
    await capturePlugins(page);
    await page.goto('/#kanban');
    await expect(page.getByTestId('board')).toHaveText('todo:a1,a2,a3,a4 | doing:b1,b2 | done:');
    await openInspector(page);
  });

  test("a node's buttons and its editable position move cards, by drags of the `devtools` sensor", async ({ page }) => {
    const errors = trackErrors(page);
    const board = page.getByTestId('board');
    await nodeAction(page, 'arrow_downward', 'a1');
    await expect(board).toHaveText('todo:a2,a1,a3,a4 | doing:b1,b2 | done:');
    await nodeAction(page, 'vertical_align_bottom', 'a2');
    await expect(board).toHaveText('todo:a1,a3,a4,a2 | doing:b1,b2 | done:');
    await nodeAction(page, 'arrow_upward', 'a3');
    await expect(board).toHaveText('todo:a3,a1,a4,a2 | doing:b1,b2 | done:');
    // To another list at an index: one edit of the whole position.
    await edit(page, 'b2', ['position'], { list: 'todo', index: 1 });
    await expect(board).toHaveText('todo:a3,b2,a1,a4,a2 | doing:b1 | done:');
    await waitForIdle(page);
    // Its list alone: the index is kept.
    await edit(page, 'b1', ['position', 'list'], 'done');
    await expect(board).toHaveText('todo:a3,b2,a1,a4,a2 | doing: | done:b1');
    await waitForIdle(page);

    const log = await timeline(page);
    expect(log.filter((entry) => entry.startsWith('drag start'))).toEqual([
      'drag start: a1 · devtools (keyboard) · from todo',
      'drag start: a2 · devtools (keyboard) · from todo',
      'drag start: a3 · devtools (keyboard) · from todo',
      'drag start: b2 · devtools (keyboard) · from doing',
      'drag start: b1 · devtools (keyboard) · from doing',
    ]);
    expect(log.filter((entry) => entry.startsWith('drop')).map((entry) => entry.replace(/^drop: on \S+ · /, ''))).toEqual([
      'move todo[0] → todo[1]',
      'move todo[0] → todo[3]',
      'move todo[1] → todo[0]',
      'move doing[1] → todo[1]',
      'move doing[0] → done[0]',
    ]);
    expect(errors).toEqual([]);
  });

  test('a card picked up from the inspector is stepped across columns and dropped from it', async ({ page }) => {
    const errors = trackErrors(page);
    await nodeAction(page, 'open_with', 'a1');
    await expect(page.locator('[data-dnd-placeholder]')).toHaveCount(1);
    await action(page, 'keyboard_arrow_right');
    await action(page, 'keyboard_arrow_right');
    await action(page, 'file_download_done');
    await waitForIdle(page);
    await expect(page.getByTestId('board')).toHaveText('todo:a2,a3,a4 | doing:b1,b2 | done:a1');

    // Another, cancelled from the inspector: it flies back.
    await nodeAction(page, 'open_with', 'b1');
    await action(page, 'keyboard_arrow_down');
    await action(page, 'cancel');
    await waitForIdle(page);
    await expect(page.getByTestId('board')).toHaveText('todo:a2,a3,a4 | doing:b1,b2 | done:a1');

    const log = await timeline(page);
    expect(log.filter((entry) => /^(drag start|drop|cancel)/.test(entry)).map((entry) => entry.replace(/^drop: on \S+ · /, 'drop: '))).toEqual([
      'drag start: a1 · devtools (keyboard) · from todo',
      'drop: move todo[0] → done[0]',
      'drag start: b1 · devtools (keyboard) · from doing',
      'cancel: cancelled',
    ]);
    expect(errors).toEqual([]);
  });
});
