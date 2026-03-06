<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import BlockItem from './BlockItem.vue';
  import type { Block } from './BlockItem.vue';
  import CopyDropZone from './CopyDropZone.vue';

  // ── Catalog (palette) — always preserved on copy ─────────────────────────────
  const catalog = ref<Block[]>([
    { id: 101, type: 'header', label: 'Header', icon: '🏷️', isPalette: true },
    { id: 102, type: 'hero', label: 'Hero Image', icon: '🖼️', isPalette: true },
    { id: 103, type: 'text', label: 'Text Block', icon: '📝', isPalette: true },
    {
      id: 104,
      type: 'cta',
      label: 'Call to Action',
      icon: '🔘',
      isPalette: true,
    },
    { id: 105, type: 'divider', label: 'Divider', icon: '➖', isPalette: true },
    { id: 106, type: 'footer', label: 'Footer', icon: '📌', isPalette: true },
  ]);

  // ── Canvas (template) — user's composition ───────────────────────────────────
  let _nextId = 200;
  const uid = () => ++_nextId;

  const template = ref<Block[]>([
    { id: uid(), type: 'header', label: 'Header', icon: '🏷️' },
    { id: uid(), type: 'text', label: 'Text Block', icon: '📝' },
    { id: uid(), type: 'footer', label: 'Footer', icon: '📌' },
  ]);

  // ── Drop handler ─────────────────────────────────────────────────────────────
  function handleDrop(e: IDragEvent) {
    const srcItems = e.draggedItems[0]?.items as Block[] | undefined;
    const dropZoneItems = e.dropZone?.items as Block[] | undefined;

    const fromCatalog = srcItems === catalog.value;
    const fromTemplate = srcItems === template.value;
    const toTemplate = dropZoneItems === template.value;

    if (!toTemplate) return;

    if (fromCatalog) {
      // From palette → copy into template
      const r = e.helpers.suggestCopy('vertical');
      if (!r) return;

      const copies = (r.copiedItems as Block[]).map((b) => ({
        ...b,
        id: uid(),
        isPalette: false,
      }));

      // targetItems внутри suggestCopy уже содержит вставленные элементы,
      // поэтому мы пересобираем список сами на основе текущего template,
      // чтобы избежать двойной вставки.
      const base = template.value;
      template.value = [
        ...base.slice(0, r.targetIndex),
        ...copies,
        ...base.slice(r.targetIndex),
      ];
      return;
    }

    if (fromTemplate) {
      // Within template → sort only inside template
      const r = e.helpers.suggestSort('vertical');
      if (!r) return;
      template.value = r.sourceItems as Block[];
    }
  }
</script>

<template>
  <ExampleContainer direction="top-right">
    <DnDProvider :style="{ opacity: 0.5 }">
      <div class="builder">
        <!-- Catalog -->
        <div class="panel panel--catalog">
          <div class="panel-header">
            <span class="panel-title">Blocks</span>
            <span class="panel-badge">catalog</span>
          </div>
          <CopyDropZone
            class="panel-body"
            :items="catalog"
            @drop="handleDrop"
          >
            <TransitionGroup
              name="list"
              tag="div"
              class="block-list"
            >
              <BlockItem
                v-for="(block, index) in catalog"
                :key="block.id"
                :index="index"
                :items="catalog"
                :block="block"
                copy-only
              />
            </TransitionGroup>
          </CopyDropZone>
        </div>

        <!-- Canvas -->
        <div class="panel panel--canvas">
          <div class="panel-header">
            <span class="panel-title">Your Template</span>
            <span class="panel-badge panel-badge--count"
              >{{ template.length }} blocks</span
            >
          </div>
          <CopyDropZone
            class="panel-body panel-body--canvas"
            :items="template"
            @drop="handleDrop"
          >
            <TransitionGroup
              name="list"
              tag="div"
              class="block-list"
            >
              <BlockItem
                v-for="(block, index) in template"
                :key="block.id"
                :index="index"
                :items="template"
                :block="block"
                compact
              />
            </TransitionGroup>
            <div
              v-if="template.length === 0"
              class="canvas-empty"
            >
              ← Drag blocks here
            </div>
          </CopyDropZone>
        </div>
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .builder {
    display: flex;
    gap: 12px;
  }

  .panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-radius: 8px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
  }

  .panel-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--vp-c-text-1);
  }

  .panel-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 10px;
    background: var(--vp-c-default-soft);
    color: var(--vp-c-text-2);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .panel-badge--count {
    background: color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent);
    color: var(--vp-c-brand-1);
  }

  .panel-body {
    padding: 10px;
    border-radius: 10px;
    border: 1px dashed var(--vp-c-divider);
    background: var(--vp-c-bg-soft);
    min-height: 80px;
  }

  .panel-body--canvas {
    border-color: color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
    background: color-mix(in srgb, var(--vp-c-brand-1) 4%, transparent);
    min-height: 120px;
  }

  .block-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: relative;
  }

  .canvas-empty {
    text-align: center;
    padding: 24px 0;
    color: var(--vp-c-text-3);
    font-size: 13px;
  }

  .list-move {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-active,
  .list-leave-active {
    transition: all 0.28s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }

  .list-leave-active {
    position: absolute;
    width: 100%;
    pointer-events: none;
  }

  @media (max-width: 560px) {
    .builder {
      flex-direction: column;
    }
  }
</style>
