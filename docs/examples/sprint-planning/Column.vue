<script setup lang="ts">
import { computed, toRef, useTemplateRef } from 'vue';
import { makeSortableList, useDnD } from '@vue-dnd-kit/core';
import StoryCard from './StoryCard.vue';

type Story = { id: string; title: string; points: number; bug?: boolean };
const props = defineProps<{ column: { id: string; title: string; stories: Story[] }; wholeColumn: boolean }>();

const zone = useTemplateRef<HTMLElement>('zone');
const list = useTemplateRef<HTMLElement>('list');
// Same `group`: stories move between the two lists. `dropzone`: the element that takes
// drops for the list, here the whole column (a getter, so the switch applies at once).
const { items, isOver } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'stories'),
  group: 'planning',
  dropzone: () => (props.wholeColumn ? zone.value : undefined),
});

const points = computed(() => props.column.stories.reduce((sum, story) => sum + story.points, 0));
const { active } = useDnD();
</script>

<template>
  <section ref="zone" class="column" :class="{ dragging: active, area: wholeColumn, over: isOver }">
    <h3>
      <span>{{ column.title }}</span>
      <span class="points">{{ points }} pts</span>
    </h3>
    <ul ref="list" class="stories" :class="{ area: !wholeColumn }">
      <StoryCard v-for="story in items" :key="story.id" :story="story" />
    </ul>
  </section>
</template>

<style scoped>
.column {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  max-width: 250px;
  min-height: 300px;
  padding: 10px;
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 4%, transparent);
  outline: 1.5px dashed transparent;
  outline-offset: -1.5px;
  transition:
    outline-color 0.2s,
    background 0.2s;
}

h3 {
  display: flex;
  justify-content: space-between;
  margin: 2px 2px 12px;
  font-size: 13px;
  font-weight: 700;
}

.points {
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  font-weight: 400;
  opacity: 0.55;
}

.stories {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  border-radius: 10px;
  list-style: none;
  outline: 1.5px dashed transparent;
  outline-offset: 3px;
  transition: outline-color 0.2s;
}

/* While a drag runs, outline the element that takes drops: the column or the list. */
.column.dragging.area,
.dragging .stories.area {
  outline-color: color-mix(in srgb, #42b883 55%, transparent);
}

.column.over {
  background: color-mix(in srgb, #42b883 7%, transparent);
}
</style>
