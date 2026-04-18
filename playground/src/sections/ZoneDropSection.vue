<script setup lang="ts">
  import { ref } from 'vue';
  import type { IDragEvent } from '../../../packages/core/src/external/types';
  import Draggable from '../components/Draggable.vue';
  import Droppable from '../components/Droppable.vue';
  import DraggableZone from '../components/DraggableZone.vue';

  interface Item {
    id: string;
    label: string;
  }

  const source = ref<Item[]>([
    { id: 'z-s1', label: 'Alpha' },
    { id: 'z-s2', label: 'Beta' },
    { id: 'z-s3', label: 'Gamma' },
    { id: 'z-s4', label: 'Delta' },
  ]);

  const zoneContent = ref<Item[]>([]);

  // Parent array for DraggableZone's draggable role (zone reordering)
  const zoneList = ref([{ id: 'zone-1' }]);

  function handleSourceDrop(e: IDragEvent) {
    const r = e.helpers.suggestSort('vertical');
    if (!r) return;
    if (e.draggedItems[0]?.items === source.value) {
      source.value = r.sourceItems as Item[];
    }
  }

  function handleZoneDrop(e: IDragEvent) {
    const srcItems = e.draggedItems[0]?.items;

    // DraggableZone is dual-role: same node is both draggable (items=zoneList) and
    // droppable (items=zoneContent). When cursor is over empty zone area, the node
    // is detected as hoveredDraggable with items=zoneList. Use dropZone in that case.
    if (e.hoveredDraggable?.items === zoneList.value) {
      const tgtItems = e.dropZone?.items;
      if (!tgtItems || tgtItems !== zoneContent.value) return;
      const srcIndexes = e.draggedItems.map((d) => d.index);
      const moved = e.draggedItems.map((d) => d.item as Item);
      if (srcItems === source.value) {
        source.value = e.helpers.removeIndexes(source.value, srcIndexes) as Item[];
      } else if (srcItems === zoneContent.value) {
        zoneContent.value = e.helpers.removeIndexes(zoneContent.value, srcIndexes) as Item[];
      }
      zoneContent.value = [...zoneContent.value, ...moved];
      return;
    }

    const r = e.helpers.suggestSort('vertical');
    if (!r) return;

    const tgtItems = e.hoveredDraggable?.items ?? e.dropZone?.items;

    if (srcItems === source.value) {
      source.value = r.sourceItems as Item[];
      if (!r.sameList && tgtItems === zoneContent.value) {
        zoneContent.value = r.targetItems as Item[];
      }
    } else if (srcItems === zoneContent.value) {
      zoneContent.value = r.sourceItems as Item[];
      if (!r.sameList && tgtItems === source.value) {
        source.value = r.targetItems as Item[];
      }
    }
  }
</script>

<template>
  <div>
    <p class="hint">
      Drag items from the <b>source list</b> into the <b>DraggableZone</b> (starts empty).
      The zone is dual-role: draggable by its handle, droppable for items.
    </p>

    <div class="layout">
      <!-- Source list -->
      <div class="col">
        <h2>Source</h2>
        <Droppable
          :items="source"
          @drop="handleSourceDrop"
        >
          <div class="zone-list">
            <Draggable
              v-for="(item, i) in source"
              :key="item.id"
              :index="i"
              :items="source"
              class="card card--blue"
            >
              {{ item.label }}
            </Draggable>
            <div
              v-if="source.length === 0"
              class="empty-hint"
            >
              empty
            </div>
          </div>
        </Droppable>
      </div>

      <!-- DraggableZone (empty target) -->
      <div class="col">
        <h2>DraggableZone (empty)</h2>
        <DraggableZone
          :index="0"
          :items="zoneList"
          :zone-items="zoneContent"
          @drop="handleZoneDrop"
        >
          <template #header>Drop Zone</template>
          <div class="zone-list">
            <Draggable
              v-for="(item, i) in zoneContent"
              :key="item.id"
              :index="i"
              :items="zoneContent"
              class="card card--green"
            >
              {{ item.label }}
            </Draggable>
            <div
              v-if="zoneContent.length === 0"
              class="empty-hint"
            >
              empty — drag here
            </div>
          </div>
        </DraggableZone>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .layout {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  .col {
    flex: 1;
    min-width: 200px;
  }

  .zone-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 60px;
  }

  .empty-hint {
    color: #9ca3af;
    font-size: 0.85rem;
    text-align: center;
    padding: 1rem;
    border: 2px dashed #d1d5db;
    border-radius: 6px;
  }
</style>
