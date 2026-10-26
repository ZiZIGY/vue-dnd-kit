<script setup lang="ts">
  /** What the bridge knows about the node shown, in sections (the former inspector's state). */
  import { computed } from 'vue';
  import { send, store } from '../lib/connection';
  import { sameNode } from '../lib/tree';
  import ValueView from './ValueView.vue';

  const detail = computed(() => (store.detail && sameNode(store.detail.node, store.selected) ? store.detail : null));
  const hasElement = computed(() => detail.value?.sections.some((section) => section.name === 'element') ?? false);
</script>

<template>
  <div class="panel" data-testid="state">
    <p v-if="!store.selected" class="empty">Choose a node in the tree or an item in the map.</p>
    <p v-else-if="!detail" class="empty">Loading…</p>
    <p v-else-if="!detail.mounted" class="empty">Not mounted.</p>
    <template v-else>
      <div class="actions">
        <button v-if="hasElement" class="btn" @click="send({ type: 'reveal', node: detail.node })">Show on page</button>
        <button
          v-if="detail.node.kind === 'provider'"
          class="btn"
          @click="send({ type: 'clearSelection', provider: detail.node.provider })"
        >
          Clear the selection
        </button>
      </div>
      <section v-for="section in detail.sections" :key="section.name">
        <div class="section-title">{{ section.name }}</div>
        <div v-for="[key, value] in section.fields" :key="key" class="field">
          <span class="key mono">{{ key }}</span>
          <ValueView :value="value" />
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
  .panel {
    padding: 4px 10px 10px;
    overflow: auto;
    height: 100%;
  }

  .actions {
    display: flex;
    gap: 4px;
    margin-top: 4px;
  }

  .field {
    display: flex;
    gap: 8px;
    padding: 1px 0;
    align-items: baseline;
  }

  .key {
    flex: none;
    min-width: 72px;
    color: var(--text-soft);
  }
</style>
