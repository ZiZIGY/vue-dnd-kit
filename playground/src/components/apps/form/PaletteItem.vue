<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import { fieldType, type FormField } from './form';
  import FieldIcon from './FieldIcon.vue';

  const props = defineProps<{ template: FormField }>();
  const el = useTemplateRef<HTMLElement>('el');
  makeSortableItem(el, {
    id: () => props.template.id,
    // 'section' keeps sections out of sections, also for new ones from the palette.
    type: () => ['palette', fieldType(props.template.kind)],
  });
</script>

<template>
  <li
    ref="el"
    class="fb-template"
    :data-id="template.id"
  >
    <FieldIcon :kind="template.kind" />
    {{ template.label }}
  </li>
</template>

<style scoped>
  .fb-template {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    cursor: grab;
    user-select: none;
  }

  .fb-template:hover {
    border-color: #93c5fd;
  }

  .fb-template:focus-visible {
    outline: 2px solid #2563eb;
  }
</style>
