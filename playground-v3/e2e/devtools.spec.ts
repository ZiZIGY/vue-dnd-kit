import { expect, test, type Page } from '@playwright/test';
import { center, dragTo, trackErrors, trackVueWarnings, waitForIdle } from './helpers';

// The Vue DevTools plugin, which src/main.ts installs in development. Without the
// DevTools it only records the providers and the page works as ever; with them
// (`yarn dev:devtools`: vite-plugin-vue-devtools, or the browser extension) the
// "Vue DnD Kit" inspector shows the providers and the drag.

interface DevtoolsWindow {
  __VUE_DND_KIT_DEVTOOLS_HOOK__?: object;
  __VUE_DEVTOOLS_KIT_INSPECTOR__?: Array<{ options: { id: string } }>;
  __VUE_DEVTOOLS_KIT_CONTEXT__?: {
    api: {
      getInspectorTree(payload: { inspectorId: string; filter: string }): Promise<Array<{ label: string; children?: unknown[] }>>;
    };
  };
}

const hasDevtools = (page: Page) => page.evaluate(() => !!(window as DevtoolsWindow).__VUE_DEVTOOLS_KIT_CONTEXT__);

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

const row = (page: Page, id: string) => page.locator(`[data-testid="list"] [data-id="${id}"]`);

test('the playground runs with the devtools plugin installed', async ({ page }) => {
  const errors = trackErrors(page);
  const warnings = trackVueWarnings(page);
  await page.goto('/#sortable');
  await expect(page.getByTestId('order')).toHaveText('t1,t2,t3,t4,t5,t6,t7,t8');
  // Installed before the app mounted: the hook is there for the providers.
  expect(await page.evaluate(() => !!(window as DevtoolsWindow).__VUE_DND_KIT_DEVTOOLS_HOOK__)).toBe(true);
  const devtools = await hasDevtools(page);
  if (devtools) await openDevtools(page);

  await dragTo(page, row(page, 't1'), await center(row(page, 't4'), 0.8));
  await waitForIdle(page);
  await expect(page.getByTestId('order')).toHaveText('t2,t3,t4,t1,t5,t6,t7,t8');

  if (devtools) expect((await inspectorRoots(page)).some((label) => label.startsWith('DnDProvider'))).toBe(true);
  expect(errors).toEqual([]);
  expect(warnings).toEqual([]);
});
