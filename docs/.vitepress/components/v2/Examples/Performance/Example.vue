<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useRafFn } from '@vueuse/core';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import RawList from './RawList.vue';
  import VirtualList from './VirtualList.vue';
  import type { PerfItemData } from './PerfItem.vue';

  const COLORS = [
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#f97316',
    '#22c55e',
    '#14b8a6',
    '#f59e0b',
    '#ef4444',
  ];
  const COUNT_OPTIONS = [100, 500, 1000, 2000, 5000, 10_000, 25_000, 50_000, 100_000];

  const count = ref(500);
  const mode = ref<'raw' | 'virtual'>('raw');
  const renderedCount = ref(0);

  function generate(n: number): PerfItemData[] {
    return Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      label: `Item ${i + 1}`,
      color: COLORS[i % COLORS.length],
    }));
  }

  const items = ref<PerfItemData[]>(generate(count.value));

  watch(count, (n) => {
    items.value = generate(n);
  });
  watch(mode, () => {
    renderedCount.value = 0;
  });

  // FPS meter
  const fps = ref(0);
  let _frames = 0;
  let _last = 0;

  useRafFn(() => {
    _frames++;
    const now = performance.now();
    if (_last === 0) {
      _last = now;
      return;
    }
    if (now - _last >= 600) {
      fps.value = Math.round((_frames * 1000) / (now - _last));
      _frames = 0;
      _last = now;
    }
  });

  function handleDrop(e: IDragEvent) {
    const r = e.helpers.suggestSort('vertical');
    if (!r) return;
    items.value = r.sourceItems as PerfItemData[];
  }
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="perf">
        <!-- Controls -->
        <div class="controls">
          <div class="controls__group">
            <span class="controls__label">Items</span>
            <div class="controls__btns">
              <button
                v-for="n in COUNT_OPTIONS"
                :key="n"
                class="btn"
                :class="{ 'btn--active': count === n }"
                @click="count = n"
              >
                {{ n.toLocaleString() }}
              </button>
            </div>
          </div>
          <div class="controls__group">
            <span class="controls__label">Mode</span>
            <div class="controls__btns">
              <button
                class="btn"
                :class="{ 'btn--active': mode === 'raw' }"
                @click="mode = 'raw'"
              >
                Raw
              </button>
              <button
                class="btn"
                :class="{ 'btn--active': mode === 'virtual' }"
                @click="mode = 'virtual'"
              >
                Virtualized
              </button>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats">
          <div class="stat">
            <span class="stat__val">{{ items.length.toLocaleString() }}</span>
            <span class="stat__key">Total items</span>
          </div>
          <div class="stat">
            <span class="stat__val">
              {{
                mode === 'raw'
                  ? items.length.toLocaleString()
                  : renderedCount.toLocaleString()
              }}
            </span>
            <span class="stat__key">DOM nodes</span>
          </div>
          <div
            class="stat"
            :class="{ 'stat--warn': fps > 0 && fps < 30, 'stat--ok': fps >= 55 }"
          >
            <span class="stat__val">{{ fps || '—' }}</span>
            <span class="stat__key">FPS</span>
          </div>
        </div>

        <!-- List -->
        <RawList
          v-if="mode === 'raw'"
          :items="items"
          :on-drop="handleDrop"
        />
        <VirtualList
          v-else
          :items="items"
          :on-drop="handleDrop"
          @update:rendered="renderedCount = $event"
        />
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .perf {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* ── Controls ─────────────────────────────────────────────────────── */
  .controls {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    align-items: center;
  }
  .controls__group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .controls__label {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--vp-c-text-3);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }
  .controls__btns {
    display: flex;
    gap: 4px;
  }
  .btn {
    padding: 4px 10px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    background: var(--vp-c-bg);
    font-size: 0.8rem;
    color: var(--vp-c-text-2);
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn:hover {
    background: var(--vp-c-bg-mute);
  }
  .btn--active {
    background: var(--vp-c-brand-1);
    color: #fff;
    border-color: var(--vp-c-brand-1);
  }

  /* ── Stats ────────────────────────────────────────────────────────── */
  .stats {
    display: flex;
    gap: 1px;
    background: var(--vp-c-divider);
    border-radius: 8px;
    overflow: hidden;
  }
  .stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 0;
    background: var(--vp-c-bg-soft);
    transition: background 0.3s;
  }
  .stat--warn {
    background: color-mix(in srgb, #ef4444 12%, var(--vp-c-bg-soft));
  }
  .stat--ok {
    background: color-mix(in srgb, #22c55e 12%, var(--vp-c-bg-soft));
  }
  .stat__val {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--vp-c-text-1);
    font-variant-numeric: tabular-nums;
  }
  .stat__key {
    font-size: 0.68rem;
    color: var(--vp-c-text-3);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

</style>
