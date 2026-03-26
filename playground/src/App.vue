<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '../../packages/core/src/external/index';
  import SwapSection from './sections/SwapSection.vue';
  import CopySection from './sections/CopySection.vue';
  import TreeSection from './sections/TreeSection.vue';
  import KanbanSection from './sections/KanbanSection.vue';
  import ConfirmSection from './sections/ConfirmSection.vue';
  import OverlaySection from './sections/OverlaySection.vue';
  import ShadowDomSection from './sections/ShadowDomSection.vue';
  import VirtualSection from './sections/VirtualSection.vue';

  type Tab =
    | 'sort'
    | 'swap'
    | 'copy'
    | 'tree'
    | 'kanban'
    | 'confirm'
    | 'overlay'
    | 'shadow-dom'
    | 'virtual';

  const tabs: { id: Tab; label: string; desc: string }[] = [
    { id: 'sort', label: 'Sort & Transfer', desc: 'suggestSort()' },
    { id: 'swap', label: 'Swap', desc: 'suggestSwap()' },
    { id: 'copy', label: 'Copy', desc: 'suggestCopy()' },
    { id: 'tree', label: 'Tree', desc: 'nested sort / swap' },
    { id: 'kanban', label: 'Kanban', desc: 'DraggableZone' },
    {
      id: 'confirm',
      label: 'Confirm drop',
      desc: 'onDrop Promise + confirm()',
    },
    {
      id: 'overlay',
      label: 'Changing Overlay',
      desc: 'Test',
    },
    { id: 'shadow-dom', label: 'Shadow DOM', desc: 'web component bug' },
    { id: 'virtual', label: 'Virtual List', desc: 'useVirtualList + id' },
  ];

  const activeTab = ref<Tab>('sort');
</script>

<template>
  <DnDProvider overlay-to="body">
    <div class="playground">
      <h1>Vue DnD Kit — Playground</h1>

      <nav class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab"
          :class="{ 'tab--active': activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="tab__label">{{ tab.label }}</span>
          <code class="tab__desc">{{ tab.desc }}</code>
        </button>
      </nav>

      <section class="section">
        <SwapSection v-if="activeTab === 'swap'" />
        <CopySection v-else-if="activeTab === 'copy'" />
        <TreeSection v-else-if="activeTab === 'tree'" />
        <KanbanSection v-else-if="activeTab === 'kanban'" />
        <ConfirmSection v-else-if="activeTab === 'confirm'" />
        <OverlaySection v-else-if="activeTab === 'overlay'" />
        <ShadowDomSection v-else-if="activeTab === 'shadow-dom'" />
        <VirtualSection v-else-if="activeTab === 'virtual'" />
      </section>
    </div>
  </DnDProvider>
</template>

<style>
  body {
    background: #f0f0f0;
    min-height: 100svh;
  }

  h1 {
    font-size: 1.5rem;
    margin: 0;
  }

  h2 {
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }

  p {
    color: #666;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .hint {
    color: #555;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  code {
    background: #eee;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.85em;
  }

  kbd {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.1em 0.4em;
    font-size: 0.85em;
  }

  /* ── Tabs ──────────────────────────────────────────────────────────────────── */
  .tabs {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0;
  }

  .tab {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    background: #f9fafb;
    cursor: pointer;
    font-size: 0.875rem;
    color: #374151;
    transition: background 0.15s;
    position: relative;
    bottom: -2px;
  }

  .tab:hover {
    background: #e5e7eb;
  }

  .tab--active {
    background: #fff;
    border-color: #e5e7eb;
    border-bottom-color: #fff;
    color: #1d4ed8;
    font-weight: 600;
    z-index: 1;
  }

  .tab__label {
    line-height: 1.2;
  }

  .tab__desc {
    font-size: 0.7rem;
    color: #9ca3af;
    background: none;
    padding: 0;
  }

  .tab--active .tab__desc {
    color: #93c5fd;
  }

  /* ── Section wrapper ───────────────────────────────────────────────────────── */
  .section {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0 8px 8px 8px;
    padding: 1.5rem;
  }

  /* ── Shared zone/list styles ───────────────────────────────────────────────── */
  .zones {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .zones .droppable {
    min-width: 180px;
    flex: 1;
  }

  .zone-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 60px;
  }

  .card {
    padding: 0.6rem 0.75rem;
    background: #3b82f6;
    color: #fff;
    border-radius: 8px;
    user-select: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .card--blue {
    background: #3b82f6;
  }
  .card--green {
    background: #22c55e;
  }
  .card--purple {
    background: #a855f7;
  }
  .card--orange {
    background: #f97316;
  }

  /* ── TransitionGroup animations ────────────────────────────────────────────── */
  .list-move,
  .list-enter-active,
  .list-leave-active {
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }

  .list-leave-active {
    position: absolute;
  }
</style>
