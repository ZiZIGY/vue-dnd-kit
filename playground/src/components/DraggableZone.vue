<script setup lang="ts">
  /**
   * DraggableZone — dual-role component.
   * Acts as a DRAGGABLE (grab by handle to reorder among siblings)
   * and as a DROPPABLE zone (accepts items dropped inside it).
   *
   * Use-cases: kanban columns, tree folders, nested lists.
   */
  import { computed, useTemplateRef } from 'vue';
  import {
    makeDraggable,
    makeDroppable,
    useDnDProvider,
  } from '../../../packages/core/src/external';
  import type { IDragEvent } from '../../../packages/core/src/external/types';

  const props = defineProps<{
    /** Index of this zone in its parent list. */
    index: number;
    /** Parent array — used for draggable payload (sorting zones). */
    items: unknown[];
    /** Content array — exposed as the droppable zone's items. */
    zoneItems: unknown[];
    /** Optional user-data attached to the droppable payload. */
    zoneUserData?: unknown;
  }>();

  const emit = defineEmits<{ drop: [event: IDragEvent] }>();

  const node = useTemplateRef<HTMLElement>('zoneRef');
  const { state } = useDnDProvider();

  // ── As draggable: grab by .zone-drag-handle to reorder zones ────────────────
  const { isDragging, isDragOver } = makeDraggable(
    node as any,
    {
      dragHandle: '.zone-drag-handle',
      placementMargins: {
        bottom: 4,
        left: 4,
        right: 4,
        top: 4,
      },
    },
    () => [props.index, props.items]
  );

  // ── As droppable zone: receives items dragged inside ─────────────────────────
  const { isAllowed } = makeDroppable(
    node as any,
    { events: { onDrop: (e) => emit('drop', e) } },
    () => [props.zoneItems, props.zoneUserData]
  );

  const placement = computed(() => isDragOver.value);
</script>

<template>
  <div
    ref="zoneRef"
    class="dz"
    :class="{
      'dz--dragging': isDragging,
      'dz--allowed': isAllowed && state === 'dragging',
      'dz--over': isDragOver && state === 'dragging',
    }"
  >
    <!-- Placement indicators (before/after this zone) -->

    <div
      v-if="placement?.top"
      class="dz__indicator dz__indicator--top"
    />
    <div
      v-if="placement?.bottom"
      class="dz__indicator dz__indicator--bottom"
    />
    <div
      v-if="placement?.left"
      class="dz__indicator dz__indicator--left"
    />
    <div
      v-if="placement?.right"
      class="dz__indicator dz__indicator--right"
    />

    <!-- Drag handle / header bar -->
    <div class="dz__handle zone-drag-handle">
      <span class="dz__grip">⠿</span>
      <slot name="header" />
    </div>

    <!-- Zone content -->
    <div class="dz__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .dz {
    position: relative;
    border: 2px solid #d1d5db;
    border-radius: 10px;
    background: #f9fafb;
    transition: border-color 0.15s, opacity 0.15s;
    display: flex;
    flex-direction: column;
  }
  .dz--dragging {
    opacity: 0.4;
  }
  .dz--allowed {
    border-color: #22c55e;
  }
  .dz--over {
    border-color: #3b82f6;
  }

  .dz__handle {
    padding: 0.5rem 0.75rem;
    background: #e5e7eb;
    border-radius: 8px 8px 0 0;
    cursor: grab;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    user-select: none;
    font-weight: 600;
    font-size: 0.85rem;
    color: #374151;
  }
  .dz__handle:active {
    cursor: grabbing;
  }
  .dz__grip {
    color: #9ca3af;
    font-size: 1.1rem;
  }

  .dz__body {
    padding: 0.5rem;
    flex: 1;
    min-height: 40px;
  }

  .dz__indicator {
    position: absolute;
    background: #3b82f6;
    pointer-events: none;
    z-index: 10;
    border-radius: 2px;
  }
  .dz__indicator--top,
  .dz__indicator--bottom {
    left: 0;
    right: 0;
    height: 3px;
  }
  .dz__indicator--top {
    top: -2px;
  }
  .dz__indicator--bottom {
    bottom: -2px;
  }
  .dz__indicator--left,
  .dz__indicator--right {
    top: 0;
    bottom: 0;
    width: 3px;
  }
  .dz__indicator--left {
    left: -2px;
  }
  .dz__indicator--right {
    right: -2px;
  }
</style>
