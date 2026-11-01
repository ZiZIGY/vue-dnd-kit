<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DnDStatus, type DragItem, type DragMode, type Over } from '@vue-dnd-kit/core';
import FileIcon from './FileIcon.vue';
import type { DropPlace } from './drive';
import type { Entry } from './files';

/**
 * What follows the pointer. From the grid, a pile: the grabbed tile on up to two others
 * (their real clones), which land on their own places or go into the folder one after
 * another. From the list, a chip by the pointer, as rows are too wide to carry around.
 * Both say how many, show a "+" while Alt copies, and what letting go would do.
 */
const props = defineProps<{
  items: DragItem[];
  over: Over | null;
  accepted: boolean;
  status: DnDStatus;
  mode: DragMode;
  rows: boolean;
}>();

const grabbed = computed(() => props.items[0]!);
const entry = computed(() => grabbed.value.item as Entry);
/** Up to two others under the grabbed tile, the deepest first. */
const behind = computed(() =>
  props.items
    .slice(1, 3)
    .map((item, index) => ({
      item,
      // Wrappers turn with `transform`: the landing undoes it on the way to the slot.
      transform: `translate(${index ? -7 : 7}px, ${5 + index * 3}px) rotate(${index ? -5 : 4}deg)`,
    }))
    .reverse(),
);

// Over a folder, its `data`: where the drop goes, or why it can't.
const place = computed(() => (props.status === 'dragging' ? (props.over?.data as DropPlace | undefined) : undefined));
const pill = computed(() => {
  if (!place.value) return null;
  if (!props.accepted) return { refused: true, text: place.value.why ?? 'Can’t go here' };
  if (place.value.trash) return { refused: false, text: 'Move to Trash' };
  return { refused: false, text: `${props.mode === 'copy' ? 'Copy' : 'Move'} to ${place.value.name}` };
});
</script>

<template>
  <!-- Fills the overlay box, which takes the size of the grabbed tile or row. -->
  <div class="overlay" :class="{ dropping: status !== 'dragging' }">
    <!-- The list's box is centered on the pointer (`snapCenterToCursor`): the chip hangs off it. -->
    <div v-if="rows" class="anchor chip">
      <span class="chip-icon"><FileIcon :entry="entry" /></span>
      <span class="chip-name">{{ entry.name }}</span>
      <template v-if="items.length > 1">
        <span v-for="n in Math.min(items.length - 1, 2)" :key="n" class="sheet" :style="{ '--n': n }" />
      </template>
      <span v-if="items.length > 1" class="count">{{ items.length }}</span>
      <span v-if="mode === 'copy' && status === 'dragging'" class="plus" aria-hidden="true">+</span>
      <span v-if="pill" class="pill" :class="{ refused: pill.refused }">{{ pill.text }}</span>
    </div>

    <div v-else class="anchor pile">
      <div v-for="{ item, transform } in behind" :key="item.id" class="card" :style="{ transform }">
        <DragPreview :id="item.id" class="face" :style="{ width: '100%', height: '100%' }">
          <div class="blank" />
        </DragPreview>
      </div>
      <DragPreview :id="grabbed.id" class="face" :style="{ width: '100%', height: '100%' }" />
      <span v-if="items.length > 1" class="count">{{ items.length }}</span>
      <span v-if="mode === 'copy' && status === 'dragging'" class="plus" aria-hidden="true">+</span>
      <span v-if="pill" class="pill" :class="{ refused: pill.refused }">{{ pill.text }}</span>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: relative;
  width: 100%;
  height: 100%;
}

.pile {
  position: relative;
  width: 100%;
  height: 100%;
}

.card {
  position: absolute;
  inset: 0;
}

.face {
  position: relative;
  border-radius: 12px;
}

/* Picked up: the pile lifts off the page. */
.overlay:not(.dropping) .face {
  box-shadow: 0 16px 28px -14px rgb(0 0 0 / 0.5);
}

.blank {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: color-mix(in srgb, currentColor 8%, Canvas);
}

/* The chip: by the pointer, a card with sheets under it for the others. */
.chip {
  position: absolute;
  top: calc(50% + 12px);
  left: calc(50% + 12px);
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 240px;
  padding: 6px 12px 6px 8px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 5%, Canvas);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, currentColor 13%, transparent),
    0 14px 28px -12px rgb(0 0 0 / 0.5);
  font-size: 13px;
  font-weight: 500;
  transition: opacity 0.15s;
}

/* Let go, the chip fades: the row it stands for is in its place. */
.dropping .chip {
  opacity: 0;
}

.chip-icon {
  flex: none;
  width: 22px;
  height: 22px;
}

.chip-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sheet {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: color-mix(in srgb, currentColor 9%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 13%, transparent);
  translate: calc(var(--n) * 4px) calc(var(--n) * 4px);
}

.count,
.plus {
  position: absolute;
  z-index: 1;
  display: grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 11px;
  box-shadow:
    0 0 0 2px Canvas,
    0 3px 8px rgb(0 0 0 / 0.3);
  color: #fff;
  font: 700 12px/1 system-ui, sans-serif;
  animation: pop 0.25s cubic-bezier(0.3, 1.6, 0.5, 1);
}

.count {
  top: -9px;
  right: -9px;
  background: #ff3b30;
}

.plus {
  top: -9px;
  left: -9px;
  background: #42b883;
  font-size: 16px;
}

/* What the drop would do, under the pile or the chip. */
.pill {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  z-index: 1;
  padding: 5px 10px;
  border-radius: 99px;
  background: color-mix(in srgb, CanvasText 88%, transparent);
  color: Canvas;
  font: 600 12px/1.2 system-ui, sans-serif;
  white-space: nowrap;
  translate: -50% 0;
  box-shadow: 0 6px 16px -6px rgb(0 0 0 / 0.5);
  animation: pop 0.2s ease-out;
}

.chip .pill {
  left: 0;
  translate: none;
}

.pill.refused {
  background: #e5484d;
  color: #fff;
}

@keyframes pop {
  from {
    opacity: 0;
    scale: 0.6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .count,
  .plus,
  .pill {
    animation: none;
  }

  .chip {
    transition: none;
  }
}
</style>
