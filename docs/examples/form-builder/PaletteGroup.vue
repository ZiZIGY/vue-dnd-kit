<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import FieldOverlay from './FieldOverlay.vue';
import PaletteItem from './PaletteItem.vue';
import { cloneField, template, type FieldKind } from './form';

const props = defineProps<{ title: string; kinds: FieldKind[]; strip: boolean }>();

// One field of each kind: the palette and the rows are lists of one group ('fields'), so a
// field dragged from here into a row is a field like the others.
const templates = props.kinds.map(template);

const list = useTemplateRef<HTMLElement>('list');
// Copies go out (`pull: 'clone'`, a new field each), nothing comes in, the order stays.
makeSortableList(list, {
  id: `palette:${props.title}`,
  items: () => templates,
  group: { name: 'fields', pull: 'clone', put: false },
  sort: false,
  clone: cloneField,
  overlay: FieldOverlay,
  strategy: () => (props.strip ? 'horizontal' : 'vertical'),
});
</script>

<template>
  <section :class="{ contents: strip }">
    <h4 v-if="!strip" class="px-2 pt-3 pb-1.5 text-[11px] font-medium tracking-wider text-dimmed uppercase">
      {{ title }}
    </h4>
    <div ref="list" class="flex" :class="strip ? 'shrink-0 gap-1.5' : 'flex-col gap-px'">
      <PaletteItem v-for="item in templates" :key="item.id" :template="item" :strip="strip" />
    </div>
  </section>
</template>
