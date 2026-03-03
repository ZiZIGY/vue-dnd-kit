<script setup lang="ts">
  /**
   * KanbanSection — kanban board using DraggableZone columns + Draggable cards.
   *
   * Single handleDrop discriminates by checking source items identity:
   *   draggedItems[0].items === columns.value  → column reorder (horizontal sort)
   *   otherwise                              → card move   (vertical sort)
   *
   * A DraggableZone is simultaneously:
   *   - DRAGGABLE (grabbed by header handle → reorders columns)
   *   - DROPPABLE (receives card drops → card enters this column)
   */
  import { ref } from 'vue';
  import type { IDragEvent } from '../../../packages/core/src/external/types';
  import type { KanbanCard, KanbanColumn } from '../types';
  import Draggable from '../components/Draggable.vue';
  import DraggableZone from '../components/DraggableZone.vue';
  import Droppable from '../components/Droppable.vue';

  let _id = 0;
  const uid = () => `k-${++_id}`;

  const columns = ref<KanbanColumn[]>([
    {
      id: uid(),
      title: 'To Do',
      cards: [
        { id: uid(), label: 'Research API' },
        { id: uid(), label: 'Write tests' },
        { id: uid(), label: 'Update docs' },
      ],
    },
    {
      id: uid(),
      title: 'In Progress',
      cards: [
        { id: uid(), label: 'Build UI' },
        { id: uid(), label: 'Integrate DnD' },
      ],
    },
    {
      id: uid(),
      title: 'Done',
      cards: [
        { id: uid(), label: 'Setup project' },
        { id: uid(), label: 'Define types' },
      ],
    },
  ]);

  function handleDrop(e: IDragEvent) {
    const srcItems = e.draggedItems[0]?.items;

    if (srcItems === columns.value) {
      // ── Column reorder ────────────────────────────────────────────────────────
      const r = e.helpers.suggestSort('horizontal');
      if (!r) return;
      columns.value = r.sourceItems as KanbanColumn[];
    } else {
      // ── Card move ─────────────────────────────────────────────────────────────
      // Guard: hovering over a column element (not its cards zone) — skip
      if (e.hoveredDraggable?.items === columns.value) return;

      const r = e.helpers.suggestSort('vertical');
      if (!r) return;

      // Identify source column by cards array identity
      const srcCol = columns.value.find((c) => c.cards === srcItems);
      if (srcCol) srcCol.cards = r.sourceItems as KanbanCard[];

      if (!r.sameList) {
        const tgtItems = e.hoveredDraggable?.items ?? e.dropZone?.items;
        const tgtCol = columns.value.find((c) => c.cards === tgtItems);
        if (tgtCol) tgtCol.cards = r.targetItems as KanbanCard[];
      }
    }
  }
</script>

<template>
  <div>
    <p class="hint">
      Grab column headers to <b>reorder columns</b>. Drag cards to
      <b>sort or move between columns</b>.
    </p>

    <!--
      Board-level Droppable: handles column reorder drops.
      Its items = columns (so suggestSort returns new columns array).
    -->
    <Droppable
      :items="columns"
      orientation="horizontal"
      @drop="handleDrop"
    >
      <div class="board">
        <DraggableZone
          v-for="(col, i) in columns"
          :key="col.id"
          :index="i"
          :items="columns"
          :zone-items="col.cards"
          @drop="handleDrop"
        >
          <template #header>{{ col.title }}</template>

          <div class="card-list">
            <Draggable
              v-for="(card, ci) in col.cards"
              :key="card.id"
              :index="ci"
              :items="col.cards"
              class="card card--blue"
            >
              {{ card.label }}
            </Draggable>
          </div>
        </DraggableZone>
      </div>
    </Droppable>
  </div>
</template>

<style scoped>
  .board {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .board > :deep(.dz) {
    min-width: 220px;
    flex: 1;
  }

  .card-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 40px;
  }
</style>
