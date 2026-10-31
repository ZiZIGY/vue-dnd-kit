<script setup lang="ts">
  import { createApp, onBeforeUnmount, onMounted, ref, useTemplateRef, type App } from 'vue';
  import { provideDnDContext, useDnDContext } from '@vue-dnd-kit/core';
  import ShadowList from '../components/ShadowList.vue';
  import type { Task } from '../types';

  // Document styles don't reach into a shadow root: it carries its own. Custom properties
  // inherit through it: the page's tokens (style.css) still apply.
  const SHADOW_CSS = `
    * { box-sizing: border-box; }
    :host { display: block; width: 340px; padding: 8px; background: var(--ui-surface); border: 1px solid var(--ui-border-accented); border-radius: var(--ui-radius-lg); }
    .scroller { height: 260px; overflow: auto; border-radius: var(--ui-radius); }
    .list { list-style: none; margin: 0; padding: 8px; background: var(--ui-bg-muted); display: flex; flex-direction: column; gap: 6px; }
    .row { padding: 10px 12px; background: var(--ui-surface); border: 1px solid var(--ui-border-accented); border-radius: var(--ui-radius); cursor: grab; }
    [data-dnd-placeholder] { opacity: 0.4; }
  `;
  const TAG = 'dnd-shadow-host';
  if (!customElements.get(TAG)) customElements.define(TAG, class extends HTMLElement {});

  const tasks = ref<Task[]>(
    Array.from({ length: 12 }, (_, index) => ({ id: `s${index + 1}`, title: `Shadow task ${index + 1}` })),
  );

  const container = useTemplateRef<HTMLElement>('container');
  const context = useDnDContext();
  let app: App | null = null;

  onMounted(() => {
    const host = document.createElement(TAG);
    host.dataset.testid = 'shadow-host';
    const root = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = SHADOW_CSS;
    const mount = document.createElement('div');
    root.append(style, mount);
    container.value!.appendChild(host);

    // A separate Vue app inside the shadow root, sharing this provider.
    app = createApp(ShadowList, { tasks });
    provideDnDContext(app, context);
    app.mount(mount);
  });

  onBeforeUnmount(() => app?.unmount());
</script>

<template>
  <section>
    <h2>Shadow DOM</h2>
    <p>
      A sortable list rendered by a second Vue app inside the open shadow root of a custom element, bridged with
      <code>provideDnDContext</code>. Rows scrolled out of the scroller are not drop targets.
    </p>
    <div ref="container" />
    <pre data-testid="shadow-order">{{ tasks.map((task) => task.id).join(',') }}</pre>
  </section>
</template>
