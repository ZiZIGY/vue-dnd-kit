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
    { id: 'c-a1', label: 'A1' },
    { id: 'c-a2', label: 'A2' },
    { id: 'c-a3', label: 'A3' },
  ]);
  const listB = ref<Item[]>([
    { id: 'c-b1', label: 'B1' },
    { id: 'c-b2', label: 'B2' },
  ]);

  /** onDrop returns a Promise: confirm() → resolve and apply, or reject to cancel drop */
  function handleDrop(e: IDragEvent): Promise<void> {
    return new Promise((resolve, reject) => {
      const labels = e.draggedItems.map((d) => (d.item as Item).label).join(', ');
      const ok = window.confirm(
        `Drop "${labels}" here?\n\nCancel = revert drag.`
      );
      if (!ok) {
        reject(new Error('User cancelled'));
        return;
      }

      const r = e.helpers.suggestSort('vertical');
      if (!r) {
        resolve();
        return;
      }

      const srcItems = e.draggedItems[0]?.items;
      if (srcItems === listA.value) listA.value = r.sourceItems as Item[];
      else if (srcItems === listB.value) listB.value = r.sourceItems as Item[];

      if (!r.sameList) {
        const tgtItems = e.hoveredDraggable?.items ?? e.dropZone?.items;
        if (tgtItems === listA.value) listA.value = r.targetItems as Item[];
        else if (tgtItems === listB.value) listB.value = r.targetItems as Item[];
      }
      resolve();
    });
  }
</script>

<template>
  <div>
    <p class="hint">
      Drop returns a <b>Promise</b>. Here we use <code>confirm()</code>: OK applies the drop,
      Cancel rejects and the drag is reverted.
    </p>
    <div class="zones">
      <Droppable
        :items="listA"
        :on-drop="handleDrop"
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
        :on-drop="handleDrop"
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
