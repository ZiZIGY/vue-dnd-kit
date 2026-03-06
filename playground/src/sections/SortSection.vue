<script setup lang="ts">
  import { ref } from 'vue';
  import { TransitionGroup } from 'vue';
  import type { IDragEvent } from '../../../packages/core/src/external/types';
  import Draggable from '../components/Draggable.vue';
  import Droppable from '../components/Droppable.vue';

  interface Item {
    id: string;
    label: string;
  }

  const listA = ref<Item[]>(
    Array.from({ length: 100 }, (_, i) => ({ id: `s-a${i}`, label: `A${i}` }))
  );
  const listB = ref<Item[]>([
    { id: 's-b1', label: 'B1' },
    { id: 's-b2', label: 'B2' },
  ]);

  // ── Sort / Transfer ──────────────────────────────────────────────────────────
  // hoveredDraggable → insert before/after that element (its list is the target)
  // no hoveredDraggable → append to zone start/end
  // same list → reorder; different list → transfer
  function handleDrop(e: IDragEvent) {
    const r = e.helpers.suggestSort('vertical');
    if (!r) return;

    const srcItems = e.draggedItems[0]?.items;
    if (srcItems === listA.value) listA.value = r.sourceItems as Item[];
    else if (srcItems === listB.value) listB.value = r.sourceItems as Item[];

    if (!r.sameList) {
      const tgtItems = e.hoveredDraggable?.items ?? e.dropZone?.items;
      if (tgtItems === listA.value) listA.value = r.targetItems as Item[];
      else if (tgtItems === listB.value) listB.value = r.targetItems as Item[];
    }
  }
</script>

<template>
  <div>
    <p class="hint">
      Drag within a list to <b>reorder</b>. Drag across lists to
      <b>transfer</b>.
    </p>
    <div class="zones">
      <Droppable
        :items="listA"
        @drop="handleDrop"
      >
        <TransitionGroup
          name="list"
          tag="div"
          class="zone-list"
        >
          <Draggable
            v-for="(item, i) in listA"
            :key="item.id"
            :index="i"
            :items="listA"
            class="card card--blue"
          >
            {{ item.label }}
          </Draggable>
        </TransitionGroup>
      </Droppable>

      <Droppable
        :items="listB"
        @drop="handleDrop"
      >
        <TransitionGroup
          name="list"
          tag="div"
          class="zone-list"
        >
          <Draggable
            v-for="(item, i) in listB"
            :key="item.id"
            :index="i"
            :items="listB"
            class="card card--green"
          >
            {{ item.label }}
          </Draggable>
        </TransitionGroup>
      </Droppable>
    </div>
  </div>
</template>
