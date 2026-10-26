<script setup lang="ts">
  /**
   * The event log (the former timeline layer): what happened in each drag, newest last,
   * a drag's events banded together. Announcements can be hidden; an entry opens on its data.
   */
  import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
  import { log, send } from '../lib/connection';
  import { clock } from '../lib/format';
  import ValueView from './ValueView.vue';

  const filter = ref('');
  const announcements = ref(false);
  const open = ref<number | null>(null);
  const follow = ref(true);
  const list = useTemplateRef<HTMLElement>('list');

  const entries = computed(() => {
    const query = filter.value.trim().toLowerCase();
    return log.value.filter(
      (entry) =>
        (announcements.value || entry.title !== 'announcement') &&
        (!query || `${entry.title} ${entry.subtitle}`.toLowerCase().includes(query)),
    );
  });

  /** Drags alternate bands, so one drag's events read together. */
  const band = (drag: number | null, provider: string) => (drag == null ? '' : `${provider}:${drag}`);
  const odd = computed(() => {
    const bands = new Map<string, boolean>();
    let flip = false;
    for (const entry of entries.value) {
      const key = band(entry.drag, entry.provider);
      if (key && !bands.has(key)) bands.set(key, (flip = !flip));
    }
    return bands;
  });

  const onScroll = () => {
    const element = list.value!;
    follow.value = element.scrollTop + element.clientHeight >= element.scrollHeight - 4;
  };
  watch(entries, async () => {
    if (!follow.value) return;
    await nextTick();
    list.value?.scrollTo({ top: list.value.scrollHeight });
  });
</script>

<template>
  <div class="log">
    <div class="bar">
      <input v-model="filter" placeholder="Filter" />
      <label><input v-model="announcements" type="checkbox" /> announcements</label>
      <span class="mute">{{ entries.length }}</span>
      <button class="btn" @click="send({ type: 'clearLog' })">Clear</button>
    </div>
    <div ref="list" class="entries" data-testid="log" @scroll="onScroll">
      <p v-if="!entries.length" class="empty">No events yet. Drag something.</p>
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="entry"
        :class="{ warning: entry.level === 'warning', odd: odd.get(band(entry.drag, entry.provider)) }"
        :data-title="entry.title"
      >
        <button class="line" @click="open = open === entry.id ? null : entry.id">
          <span class="time mono mute">{{ clock(entry.time) }}</span>
          <span class="title">{{ entry.title }}</span>
          <span class="subtitle mono">{{ entry.subtitle }}</span>
        </button>
        <div v-if="open === entry.id" class="data">
          <ValueView :value="entry.data" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .log {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-bottom: 1px solid var(--border);
  }

  .bar input:not([type]) {
    width: 160px;
  }

  .bar label {
    display: inline-flex;
    gap: 3px;
    align-items: center;
  }

  .bar .mute {
    flex: 1;
  }

  .entries {
    flex: 1;
    overflow: auto;
  }

  .entry.odd {
    background: var(--bg-soft);
  }

  .line {
    display: flex;
    gap: 8px;
    width: 100%;
    padding: 2px 8px;
    border: 0;
    background: none;
    text-align: left;
    align-items: baseline;
  }

  .line:hover {
    background: var(--bg-mute);
  }

  .title {
    flex: none;
    min-width: 90px;
    font-weight: 600;
  }

  .warning .title {
    color: var(--orange);
  }

  .subtitle {
    color: var(--text-soft);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .data {
    padding: 2px 8px 6px 100px;
  }
</style>
