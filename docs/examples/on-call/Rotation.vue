<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import PersonCell from './PersonCell.vue';

type Person = { id: string; name: string; hue: number };
const props = defineProps<{ column: { id: string; title: string; people: Person[] }; placeholder: 'item' | 'indicator' }>();
const emit = defineEmits<{ swap: [text: string] }>();

const list = useTemplateRef<HTMLElement>('list');
// `behavior: 'swap'`: the dragged person trades places with the one under it, and the
// others stay put. Both columns swap and share a group, so they swap with each other too.
const { items } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'people'),
  group: 'rotation',
  behavior: 'swap',
  placeholder: () => props.placeholder,
  onDrop: (e) => {
    if (e.partner) emit('swap', `${e.items[0]?.name} ⇄ ${e.partner.item.name}`);
  },
});
</script>

<template>
  <section class="rotation">
    <h4>{{ column.title }}</h4>
    <ul ref="list" class="people">
      <PersonCell v-for="person in items" :key="person.id" :person="person" />
    </ul>
  </section>
</template>

<style scoped>
.rotation {
  flex: 1;
  min-width: 0;
  max-width: 180px;
}

h4 {
  margin: 0 0 10px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

.people {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
