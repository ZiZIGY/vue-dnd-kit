<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type Active, type DnDStatus, type DragItem, type DragMode, type Over } from '@vue-dnd-kit/core';

// The overlay props, written out (`OverlayProps` is the same type).
const props = defineProps<{
  active: Active;
  items: DragItem[];
  over: Over | null;
  accepted: boolean;
  status: DnDStatus;
  mode: DragMode;
}>();

// Up to six in a row, the grabbed item first. Only the grabbed one and four next to it
// have a clone: the sixth shows `DragPreview`'s slot instead.
const MAX = 6;
const shown = computed(() => props.items.slice(0, MAX));
</script>

<template>
  <!-- The root fills the overlay box: the size of the slot, animated on drop. -->
  <div class="strip" :class="{ refused: over && !accepted, landing: status === 'dropping' }">
    <code class="caption">
      items: {{ items.length }} · mode: '{{ mode }}' · over: {{ over ? `'${over.id}'` : 'null' }} · accepted: {{ accepted }}
    </code>
    <!-- A wrapper places each preview: without a clone, `DragPreview` renders only its slot. -->
    <div v-for="(entry, index) in shown" :key="entry.id" class="cell" :style="{ left: `calc(${index} * (100% + 8px))` }">
      <DragPreview :id="entry.id">
        <span class="no-clone">{{ entry.id }}</span>
      </DragPreview>
    </div>
    <span v-if="items.length > MAX" class="more" :style="{ left: `calc(${MAX} * (100% + 8px))` }">+{{ items.length - MAX }}</span>
  </div>
</template>

<style scoped>
.strip {
  position: relative;
  width: 100%;
  height: 100%;
}

.cell {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 12px 22px -10px rgb(0 0 0 / 0.6);
}

/* Shown for an item without a clone. */
.no-clone {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border: 1.5px dashed color-mix(in srgb, currentColor 45%, transparent);
  border-radius: 10px;
  background: Canvas;
  font: 600 10px/1 ui-monospace, Menlo, Consolas, monospace;
}

.more {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  font: 600 12px/1 ui-monospace, Menlo, Consolas, monospace;
}

.caption {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;
  padding: 3px 8px;
  border-radius: 6px;
  background: #42b883;
  color: #fff;
  font: 10px/1.4 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  transition: opacity 0.15s;
}

.refused .caption {
  background: #e5484d;
}

.refused .cell {
  outline: 2px solid #e5484d;
  outline-offset: 5px;
}

.landing .caption {
  opacity: 0;
}
</style>
