<script setup lang="ts">
  import { onBeforeUnmount, ref, shallowRef, useTemplateRef } from 'vue';
  import { makeSortableList, useDnD } from '@vue-dnd-kit/core';
  import SortableRow from '../components/SortableRow.vue';
  import type { Task } from '../types';

  // A list that moves into another window of the app: a popup the page opens, where a
  // teleport moves the mounted list (it isn't mounted again), under this page's provider.
  // `addWindow` lets the provider listen there; closing the popup brings the list back.
  const tasks = ref<Task[]>(Array.from({ length: 5 }, (_, index) => ({ id: `w${index + 1}`, title: `Window task ${index + 1}` })));

  const dnd = useDnD();
  const target = shallowRef<HTMLElement | null>(null);
  let popup: Window | null = null;
  let release: (() => void) | null = null;

  const listRef = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(listRef, { items: tasks, id: 'window-list' });

  const attach = () => {
    release?.();
    release = null;
    target.value = null;
    popup = null;
  };

  const detach = () => {
    if (popup && !popup.closed) return popup.focus();
    popup = window.open('', 'dnd-kit-window', 'popup,width=420,height=560');
    if (!popup) return;
    const doc = popup.document;
    doc.title = 'Vue DnD Kit: another window';
    // The page's styles, as they are now: the popup has none of its own.
    for (const node of document.querySelectorAll('style, link[rel="stylesheet"]')) doc.head.appendChild(node.cloneNode(true));
    doc.body.innerHTML = '';
    const mount = doc.createElement('main');
    doc.body.appendChild(mount);
    release = dnd.addWindow(popup);
    popup.addEventListener('pagehide', attach);
    target.value = mount;
  };

  onBeforeUnmount(() => {
    const opened = popup;
    attach();
    opened?.close();
  });
</script>

<template>
  <section>
    <h2>Another window</h2>
    <p>
      The list moves into a popup of this page with a teleport, as a detached panel does, under the same provider:
      <code>useDnD().addWindow(popup)</code> lets it listen there, so the list sorts in the popup, with its overlay
      there. Closing the popup brings it back.
    </p>
    <button
      type="button"
      data-testid="open-window"
      @click="detach"
    >
      Open the list in a window
    </button>
    <Teleport
      :to="target"
      :disabled="!target"
    >
      <ul
        ref="list"
        class="list"
        data-testid="window-list"
      >
        <SortableRow
          v-for="task in items"
          :key="task.id"
          :item="task"
        />
      </ul>
    </Teleport>
    <pre data-testid="windows-order">{{ tasks.map((task) => task.id).join(',') }}</pre>
  </section>
</template>
