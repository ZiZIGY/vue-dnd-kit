<script setup lang="ts">
  import { computed, shallowRef } from 'vue';
  import type { SortableDropEvent } from '@vue-dnd-kit/core';
  import ControlledList from '../components/controlled/ControlledList.vue';
  import ControlledTree from '../components/controlled/ControlledTree.vue';
  import StatusProbe from '../components/StatusProbe.vue';
  import {
    allFolders,
    createServer,
    createStore,
    describeResult,
    serializeFolders,
    type Card,
  } from '../components/controlled/store';

  const store = createStore();
  const server = createServer();
  const lastResult = shallowRef('');

  /**
   * Cards are saved on the server first: the drop waits for it (async `onBeforeDrop`),
   * and the store takes `result` through its action once the server agrees, before the
   * hook resolves, so the overlay lands in the new order. A failed request applies
   * nothing: the drop goes through unapplied and the cards fly back.
   */
  const save = async (event: SortableDropEvent<Card>) => {
    event.preventDefault();
    lastResult.value = describeResult(event.result);
    try {
      await server.request(`${event.keys.join('+')} to ${String(event.to.list)}`);
      store.applyLists(event.result);
    } catch {
      // The store is as it was: nothing to undo.
    }
    return true;
  };
  const saved = { group: 'controlled', onBeforeDrop: save };

  const state = computed(() =>
    ['todo', 'done', 'archive'].map((id) => `${id}:${store.list(id).map((card) => card.id).join(',')}`).join(' | '),
  );
</script>

<template>
  <section>
    <h2>Controlled</h2>
    <p class="hint">
      The lists read a frozen store and never write it: each drop calls <code>event.preventDefault()</code> and the
      store applies <code>event.result</code> through its action, after the server saves it. The archive never
      prevents: its drops warn in the console and change nothing.
    </p>
    <label>
      <input
        v-model="server.failing.value"
        type="checkbox"
        data-testid="server-fails"
      />
      Server fails
    </label>
    <div class="demo-row">
      <ControlledList
        list-id="todo"
        title="To do"
        :source="() => store.list('todo')"
        :options="saved"
      />
      <ControlledList
        list-id="done"
        title="Done"
        :source="() => store.list('done')"
        :options="saved"
      />
      <!-- Read-only and never prevented: development builds warn, the cards fly back. -->
      <ControlledList
        list-id="archive"
        title="Archive (read-only)"
        :source="() => store.list('archive')"
        :options="{ group: 'controlled' }"
      />
    </div>
    <StatusProbe />
    <pre data-testid="state">{{ state }}</pre>
    <pre data-testid="result">{{ lastResult }}</pre>
    <pre data-testid="server">{{ server.busy.value ? 'saving…' : server.log.value[0] ?? '' }}</pre>
  </section>

  <section>
    <h3>Tree of class instances</h3>
    <p class="hint">
      <code>withChildren</code> copies the changed folders through their class; <code>onDrop</code> puts the new tree
      in the store.
    </p>
    <ControlledTree :store="store" />
    <pre data-testid="tree">{{ serializeFolders(store.tree()) }}</pre>
    <pre data-testid="tree-classes">{{ allFolders(store.tree()) ? 'folders' : 'plain objects' }}</pre>
  </section>
</template>
