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

  let _id = 0;
  const uid = () => `copy-${++_id}`;

  const listA = ref<Item[]>([
    { id: uid(), label: 'P1' },
    { id: uid(), label: 'P2' },
    { id: uid(), label: 'P3' },
  ]);
  const listB = ref<Item[]>([
    { id: uid(), label: 'Q1' },
    { id: uid(), label: 'Q2' },
  ]);

  // ── Copy (Alt) or Sort ────────────────────────────────────────────────────────
  // Alt held → suggestCopy: source unchanged, copies inserted at target position
  // No Alt   → suggestSort: regular sort / transfer
  function handleDrop(e: IDragEvent) {
    const isAlt = e.provider.keyboard.keys.pressedKeys.value.has('AltLeft');

    if (isAlt) {
      const r = e.helpers.suggestCopy('vertical');
      if (!r) return;
      // Assign fresh ids to copies so they're unique
      const copies = (r.copiedItems as Item[]).map((item) => ({
        ...item,
        id: uid(),
      }));
      const tgtItems = e.hoveredDraggable?.items ?? e.dropZone?.items;
      // Re-build targetItems with fresh ids
      const base = tgtItems as Item[];
      const tgtIdx = r.targetIndex;
      const targetItems = [
        ...base.slice(0, tgtIdx),
        ...copies,
        ...base.slice(tgtIdx),
      ];
      if (tgtItems === listA.value) listA.value = targetItems;
      else if (tgtItems === listB.value) listB.value = targetItems;
    } else {
      const r = e.helpers.suggestSort('vertical');
      if (!r) return;

      const srcItems = e.draggedItems[0]?.items;
      if (srcItems === listA.value) listA.value = r.sourceItems as Item[];
      else if (srcItems === listB.value) listB.value = r.sourceItems as Item[];

      if (!r.sameList) {
        const tgtItems = e.hoveredDraggable?.items ?? e.dropZone?.items;
        if (tgtItems === listA.value) listA.value = r.targetItems as Item[];
        else if (tgtItems === listB.value)
          listB.value = r.targetItems as Item[];
      }
    }
  }
</script>

<template>
  <div>
    <p class="hint">
      Hold <kbd>Alt</kbd> while dropping to <b>copy</b> (source stays intact).
      Without Alt: regular sort / transfer.
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
            class="card card--orange"
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
            class="card card--orange"
          >
            {{ item.label }}
          </Draggable>
        </TransitionGroup>
      </Droppable>
    </div>
  </div>
</template>
