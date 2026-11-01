<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import Icon from './Icon.vue';
import SectionView from './SectionView.vue';
import { useBuilder } from './builder';
import { SECTIONS, typeScale, type Section } from './page';

const props = defineProps<{ template: Section }>();
const builder = useBuilder();
const info = computed(() => SECTIONS[props.template.kind]);

const el = useTemplateRef<HTMLElement>('el');
// An item of the palette's list: a drag takes a copy, the template stays.
makeSortableItem(el, { item: () => props.template });

/** The picture: the section on a 960px desktop page, zoomed out to fit the card. */
const PICTURE_WIDTH = 960;
const scale = typeScale(PICTURE_WIDTH);
</script>

<template>
  <!-- Space drags it (a sortable item); a click or Enter adds it, for those who can't drag. -->
  <div
    ref="el"
    class="template"
    :aria-label="`${info.name} section`"
    @click="builder.addSection(template.kind)"
    @keydown.enter.prevent="builder.addSection(template.kind)"
  >
    <span class="picture" aria-hidden="true">
      <span class="page" :style="{ ...scale, width: `${PICTURE_WIDTH}px` }">
        <SectionView :section="template" />
      </span>
    </span>
    <span class="name"><Icon :name="info.icon" /> {{ info.name }}</span>
  </div>
</template>

<style scoped>
.template {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 5px 5px 7px;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  cursor: grab;
  transition:
    box-shadow 0.15s,
    translate 0.15s;
}

.template:hover {
  box-shadow:
    0 0 0 1px color-mix(in srgb, #42b883 70%, transparent),
    0 8px 18px -10px rgb(0 0 0 / 0.4);
}

.template:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

@media (prefers-reduced-motion: no-preference) {
  .template:hover {
    translate: 0 -1px;
  }
}

/* The template stays in the palette while its copy travels. */
.template[data-dnd-placeholder] {
  opacity: 1;
}

.picture {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  overflow: hidden;
  border-radius: 6px;
  background: #eef0f5;
}

/* `zoom` scales the layout too, so the picture takes its zoomed size and centers. */
.page {
  flex: none;
  container: page / inline-size;
  zoom: 0.1;
  pointer-events: none;
}

.name {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 2px;
  overflow: hidden;
  font-size: 12px;
  font-weight: 550;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.name svg {
  opacity: 0.55;
}

/* The copy in hand, before it reaches the page. */
[data-dnd-overlay] .template {
  box-shadow:
    0 0 0 1.5px #42b883,
    0 18px 30px -14px rgb(0 0 0 / 0.55);
  rotate: -2deg;
}
</style>
