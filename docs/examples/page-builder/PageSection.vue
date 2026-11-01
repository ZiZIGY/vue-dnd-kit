<script setup lang="ts">
import { computed, nextTick, useTemplateRef } from 'vue';
import { makeSortableItem, useDnD } from '@vue-dnd-kit/core';
import Icon from './Icon.vue';
import SectionView from './SectionView.vue';
import { useBuilder } from './builder';
import { SECTIONS, type Section } from './page';

const props = defineProps<{ section: Section; index: number; count: number }>();
const builder = useBuilder();
const { selected, hovered } = builder;

const el = useTemplateRef<HTMLElement>('el');
// Dragged by its grip only: the rest of a section is content to click, edit and drag. The
// grip can't scroll the page (`touch-action: none`), so a touch drags it after 4px.
const { indicator } = makeSortableItem(el, {
  item: () => props.section,
  handle: '.grip',
  activation: { touch: { distance: 4 } },
});

const name = computed(() => SECTIONS[props.section.kind].name);
const isSelected = computed(() => selected.value === props.section.id);

// The line where a section in hand would go, and what it would do there.
const { active } = useDnD();
const line = computed(() => {
  const side = indicator.value?.side;
  const dragged = active.value?.items[0]?.item as Section | undefined;
  if ((side !== 'before' && side !== 'after') || !dragged) return null;
  const verb = builder.find(dragged.id) ? 'Move' : 'Add';
  return { side, text: `${verb} ${SECTIONS[dragged.kind].name} here` };
});

/** A slot up or down. The section moved in the DOM: the focus goes back to the button. */
const move = async (by: -1 | 1, event: MouseEvent) => {
  const tools = (event.currentTarget as HTMLElement).parentElement;
  builder.moveSection(props.section.id, by);
  await nextTick();
  const same = tools?.querySelector<HTMLButtonElement>(by < 0 ? '.up' : '.down');
  const other = tools?.querySelector<HTMLButtonElement>(by < 0 ? '.down' : '.up');
  (same?.disabled ? other : same)?.focus();
};
</script>

<template>
  <div
    ref="el"
    class="page-section"
    :class="{ selected: isSelected, hovered: hovered === section.id }"
    :data-node="section.id"
    @click="builder.select(section.id)"
  >
    <SectionView :section="section" editable />

    <div class="chrome" @click.stop>
      <button
        type="button"
        class="grip"
        :data-focus="section.id"
        :aria-label="`${name} section`"
        title="Drag to move"
        @focus="builder.select(section.id)"
      >
        <Icon name="grip" />
        {{ name }}
      </button>
      <span class="tools">
        <button type="button" class="up" :disabled="index === 0" aria-label="Move up" title="Move up" @click="move(-1, $event)">
          <Icon name="up" />
        </button>
        <button type="button" class="down" :disabled="index === count - 1" aria-label="Move down" title="Move down" @click="move(1, $event)">
          <Icon name="down" />
        </button>
        <button type="button" aria-label="Duplicate" title="Duplicate (Ctrl+D)" @click="builder.duplicate(section.id)">
          <Icon name="copy" />
        </button>
        <button type="button" class="delete" aria-label="Delete" title="Delete (Del)" @click="builder.remove(section.id)">
          <Icon name="trash" />
        </button>
      </span>
    </div>

    <div v-if="line" class="drop-line" :class="line.side">
      <span>{{ line.text }}</span>
    </div>
  </div>
</template>

<style scoped>
.page-section {
  position: relative;
}

/* The outline, drawn over the content: hovered thin, selected thick. */
.page-section::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 3;
  box-shadow: inset 0 0 0 0 transparent;
  pointer-events: none;
  transition: box-shadow 0.15s;
}

.page-section:hover:not(:has(.page-block:hover))::after,
.page-section.hovered::after {
  box-shadow: inset 0 0 0 1px rgb(66 184 131 / 0.75);
}

.page-section.selected::after {
  box-shadow: inset 0 0 0 2px #42b883;
}

/* While a drag runs, only the line and the selection show. */
html[data-dnd-dragging] .page-section:not(.selected)::after {
  box-shadow: none;
}

/*
 * The section in hand waits, faded, where it was: the page doesn't move until the drop.
 * Once dropped (no `data-dnd-dragging` on the page any more), its new place stays empty
 * until the overlay has landed on it.
 */
.page-section[data-dnd-placeholder] {
  opacity: 0;
}

html[data-dnd-dragging] .page-section[data-dnd-placeholder] {
  opacity: 0.35;
}

/* ─── Its toolbar, astride the top edge ───────────────────────────────────── */

.chrome {
  position: absolute;
  top: 0;
  left: 10px;
  z-index: 6;
  display: flex;
  gap: 4px;
  translate: 0 -50%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}

.page-section:hover:not(:has(.page-block:hover)) > .chrome,
.page-section.selected > .chrome,
.chrome:focus-within {
  opacity: 1;
  pointer-events: auto;
}

html[data-dnd-dragging] .page-section > .chrome {
  opacity: 0;
}

.chrome button {
  display: inline-flex;
  align-items: center;
  height: 22px;
  border: 0;
  font: 600 11px/1 ui-sans-serif, system-ui, sans-serif;
  cursor: pointer;
}

.grip {
  gap: 3px;
  padding: 0 8px 0 4px;
  border-radius: 6px;
  background: #42b883;
  color: #fff;
  box-shadow: 0 2px 6px -2px rgb(0 0 0 / 0.35);
  cursor: grab;
  touch-action: none;
}

.grip svg {
  font-size: 14px;
}

.tools {
  display: none;
  overflow: hidden;
  border-radius: 6px;
  background: #fff;
  box-shadow:
    0 0 0 1px rgb(15 23 42 / 0.12),
    0 2px 6px -2px rgb(0 0 0 / 0.3);
}

.selected .tools,
.chrome:focus-within .tools {
  display: flex;
}

.tools button {
  justify-content: center;
  width: 24px;
  padding: 0;
  background: none;
  color: #334155;
  font-size: 13px;
}

.tools button:hover:not(:disabled) {
  background: #f1f5f9;
}

.tools .delete:hover {
  color: #e11d48;
}

.tools button:disabled {
  color: #cbd5e1;
  cursor: default;
}

.chrome button:focus-visible {
  outline: 2px solid #1e293b;
  outline-offset: 1px;
}

/* ─── The line where a section in hand would go ───────────────────────────── */

.drop-line {
  position: absolute;
  right: 0;
  left: 0;
  z-index: 7;
  height: 3px;
  background: #42b883;
  box-shadow: 0 0 0 3px rgb(66 184 131 / 0.2);
  pointer-events: none;
}

.drop-line.before {
  top: 0;
}

.drop-line.after {
  bottom: 0;
}

/* Its label sits above the line (the page's frame never cuts it), on the left: the section
   in hand hangs to the right of the pointer. */
.drop-line span {
  position: absolute;
  bottom: 100%;
  left: 12px;
  margin-bottom: 4px;
  padding: 4px 10px;
  border-radius: 99px;
  background: #42b883;
  color: #fff;
  font: 600 11px/1.2 ui-sans-serif, system-ui, sans-serif;
  white-space: nowrap;
  box-shadow: 0 4px 12px -4px rgb(0 0 0 / 0.35);
}

@media (prefers-reduced-motion: no-preference) {
  .drop-line {
    animation: line-in 0.16s ease-out;
  }
}

@keyframes line-in {
  from {
    opacity: 0;
    scale: 0.85 1;
  }
}
</style>
