<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';

  const props = defineProps<{ person: { id: string; name: string; role: string } }>();
  const el = useTemplateRef<HTMLElement>('el');
  makeSortableItem(el, { id: () => props.person.id });
</script>

<template>
  <tr
    ref="el"
    class="row"
    :data-id="person.id"
  >
    <td>{{ person.name }}</td>
    <td>{{ person.role }}</td>
  </tr>
</template>
