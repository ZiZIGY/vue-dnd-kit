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

  const listA = ref<Item[]>([
    { id: 'sw-a1', label: 'X1' },
    { id: 'sw-a2', label: 'X2' },
    { id: 'sw-a3', label: 'X3' },
  ]);
  const listB = ref<Item[]>([
    { id: 'sw-b1', label: 'Y1' },
    { id: 'sw-b2', label: 'Y2' },
  ]);

  // ── Swap ─────────────────────────────────────────────────────────────────────
  // hoveredDraggable → swap item(s) with hovered element
  // no hoveredDraggable → no-op (swap requires a target element)
  //
  // Single drag:  A ↔ B (positional swap)
  // Multi drag:   [A, C] ↔ D  (group exchange — group replaces D, D goes to first source slot)
  function handleDrop(e: IDragEvent) {
    if (!e.hoveredDraggable) return;

    const r = e.helpers.suggestSwap();
    if (!r) return;

    const srcItems = e.draggedItems[0]?.items;
    if (srcItems === listA.value) listA.value = r.sourceItems as Item[];
    else if (srcItems === listB.value) listB.value = r.sourceItems as Item[];

    if (!r.sameList) {
      // Target is always hoveredDraggable.items for swap
      const tgtItems = e.hoveredDraggable.items;
      if (tgtItems === listA.value) listA.value = r.targetItems as Item[];
      else if (tgtItems === listB.value) listB.value = r.targetItems as Item[];
    }
  }
</script>

<template>
  <div>
    <p class="hint">
      Hover over an element to <b>swap</b> positions. Multi-select (checkbox) +
      drag for group exchange. Dropping on empty zone does nothing.
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
            class="card card--purple"
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
            class="card card--purple"
          >
            {{ item.label }}
          </Draggable>
        </TransitionGroup>
      </Droppable>
    </div>
  </div>
</template>
