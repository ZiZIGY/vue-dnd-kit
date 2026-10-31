<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { Task } from '../types';

const props = defineProps<{ item: Task }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { id: () => props.item.id });
</script>

<template>
  <li ref="el" class="row" :class="{ tall: item.tall }" :data-id="item.id">
    {{ item.title }}
  </li>
</template>
