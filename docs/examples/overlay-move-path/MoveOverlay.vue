<script setup lang="ts">
import { computed, inject } from 'vue';
import type { DnDStatus, DragItem, DropDestination } from '@vue-dnd-kit/core';
import FileIcon from './FileIcon.vue';
import { FILES, pathOf, trail, type FileNode } from './files';

// The dragged row, and under it where a drop would put it now: `to` changes as the
// drag moves through the tree (its `parentKey` is the folder, `null` at the root).
const props = defineProps<{ items: DragItem[]; to: DropDestination | null; status: DnDStatus }>();
const files = inject(FILES)!;

const file = computed(() => props.items[0]!.item as FileNode);
// The files don't change before the drop: where it is now is where it comes from.
const from = computed(() => trail(files.value, file.value.id)?.at(-2)?.id ?? null);
const where = computed(() => (props.to ? pathOf(files.value, props.to.parentKey) : null));
const stays = computed(() => props.to && (props.to.parentKey ?? null) === from.value);
</script>

<template>
  <div class="move">
    <div class="row">
      <FileIcon :name="file.name" :folder="file.folder" />
      <span class="name">{{ file.name }}</span>
      <span v-if="items.length > 1" class="more">+{{ items.length - 1 }}</span>
    </div>
    <!-- Gone once the drop is decided: the row lands, the files have changed. -->
    <p v-if="where" class="where" :class="{ stays, gone: status !== 'dragging' }">
      <template v-if="stays">Stays in <code>{{ where }}</code></template>
      <template v-else>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" /></svg>
        Move into <code>{{ where }}</code>
      </template>
    </p>
  </div>
</template>

<style scoped>
.move {
  position: relative;
  width: 100%;
  height: 100%;
}

.row {
  display: flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  height: 100%;
  padding: 0 10px;
  border-radius: 6px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 14%, transparent),
    0 12px 24px -10px rgb(0 0 0 / 0.5);
  font: 13px/1 ui-monospace, Menlo, Consolas, monospace;
}

.name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.more {
  margin-left: auto;
  padding: 2px 6px;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font-size: 11px;
  font-weight: 700;
}

/* Under the row, so it never hides the slot the row will land in. */
.where {
  position: absolute;
  top: calc(100% + 6px);
  left: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
  padding: 5px 9px;
  border-radius: 7px;
  background: #42b883;
  color: #04130c;
  font: 600 12px/1 system-ui, sans-serif;
  white-space: nowrap;
  box-shadow: 0 6px 16px -8px rgb(0 0 0 / 0.5);
  transition:
    background-color 0.15s,
    color 0.15s,
    opacity 0.15s;
}

.where.stays {
  background: color-mix(in srgb, currentColor 12%, Canvas);
  color: inherit;
}

.where.gone {
  opacity: 0;
}

.where code {
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
}

.where svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
