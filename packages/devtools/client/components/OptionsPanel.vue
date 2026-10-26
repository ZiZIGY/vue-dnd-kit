<script setup lang="ts">
  /**
   * The options of the node shown (its provider's when it has none of its own), editable
   * live, and every override of the page with its reset.
   */
  import { computed } from 'vue';
  import type { OptionView, OverrideView, ProviderView, TargetRef } from '../../src/protocol';
  import { send, store } from '../utils/connection';
  import { short } from '../utils/format';
  import OptionField from './OptionField.vue';

  const provider = computed<ProviderView | null>(
    () => store.providers.find((entry) => entry.id === store.selected?.provider) ?? store.providers[0] ?? null,
  );

  const edited = computed<{ title: string; target: TargetRef; options: OptionView[] } | null>(() => {
    const owner = provider.value;
    if (!owner) return null;
    const node = store.selected?.provider === owner.id ? store.selected : null;
    if (node?.kind === 'list') {
      const list = owner.lists.find((entry) => entry.id === node.id);
      if (list) return { title: `${list.kind} ${String(list.id)}`, target: { kind: 'list', id: list.id }, options: list.options };
    }
    if (node?.kind === 'droppable') {
      const zone = owner.droppables.find((entry) => entry.id === node.id);
      if (zone) return { title: `drop target ${String(zone.id)}`, target: { kind: 'droppable', id: zone.id }, options: zone.options };
    }
    if (node?.kind === 'draggable' && store.detail?.node.kind === 'draggable' && store.detail.node.id === node.id) {
      return { title: `draggable ${String(node.id)}`, target: { kind: 'draggable', id: node.id }, options: store.detail.options };
    }
    return { title: owner.label, target: { kind: 'provider' }, options: owner.options };
  });

  const overrides = computed(() =>
    store.providers.flatMap((owner) => owner.overrides.map((override) => ({ provider: owner.id, override }))),
  );

  const targetLabel = ({ target }: OverrideView) => (target.kind === 'provider' ? 'provider' : `${target.kind} ${String(target.id)}`);
  const resetOne = (provider: string, { target, option }: OverrideView) => send({ type: 'reset', provider, target, option });
</script>

<template>
  <div class="panel">
    <div class="overrides">
      <span class="mute">{{ overrides.length ? `${overrides.length} edited` : 'Nothing edited' }}</span>
      <button class="btn danger" :disabled="!overrides.length" data-testid="reset-all" @click="send({ type: 'reset' })">Reset all</button>
    </div>
    <ul v-if="overrides.length" class="list">
      <li v-for="{ provider: owner, override } in overrides" :key="`${owner}/${targetLabel(override)}/${override.option}`">
        <span class="mono">{{ targetLabel(override) }} · {{ override.option }}</span>
        <span class="mono mute value">{{ short(override.value, 40) }}</span>
        <button class="reset" title="Reset" @click="resetOne(owner, override)">↺</button>
      </li>
    </ul>

    <template v-if="edited && provider">
      <div class="section-title" data-testid="options-title">{{ edited.title }}</div>
      <p v-if="!edited.options.length" class="mute">No options to edit.</p>
      <OptionField v-for="option in edited.options" :key="option.name" :option="option" :target="edited.target" :provider="provider.id" />
      <p class="mute hint">Edits apply to this page at once, in development only, and are never written to your code.</p>
    </template>
    <p v-else class="empty">No provider on the page.</p>
  </div>
</template>

<style scoped>
  .panel {
    padding: 8px 10px;
    overflow: auto;
    height: 100%;
  }

  .overrides {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .list {
    list-style: none;
    margin: 4px 0 0;
    padding: 0;
  }

  .list li {
    display: flex;
    gap: 6px;
    align-items: baseline;
    padding: 2px 0;
  }

  .value {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
  }

  .reset {
    border: 0;
    background: none;
    color: var(--purple);
  }

  .hint {
    margin-top: 8px;
  }
</style>
