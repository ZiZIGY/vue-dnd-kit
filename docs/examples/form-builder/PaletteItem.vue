<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import { KINDS, useForm, type Field } from './form';

const props = defineProps<{ template: Field; strip: boolean }>();
const form = useForm();
const kind = KINDS[props.template.kind];

const el = useTemplateRef<HTMLElement>('el');
// `type`: how the trash and the overlay tell a new field from one of the form.
makeSortableItem(el, { item: () => props.template, type: 'new-field' });

// A click or Enter adds the field at the end of the form, without a drag.
const add = () => form.add(props.template.kind);
</script>

<template>
  <div
    ref="el"
    :title="`Drag into the form, or click to add a ${kind.name.toLowerCase()} field`"
    class="group flex shrink-0 cursor-grab items-center gap-2.5 bg-default text-sm text-default transition-colors select-none hover:text-highlighted focus-visible:outline-2 focus-visible:outline-primary"
    :class="strip ? 'rounded-full py-1 ps-1 pe-3 ring ring-default' : 'rounded-md p-1 hover:bg-elevated'"
    @click="add"
    @keydown.enter.prevent="add"
  >
    <span
      class="grid shrink-0 place-items-center bg-elevated text-muted ring ring-default transition-colors group-hover:text-primary"
      :class="strip ? 'size-6 rounded-full' : 'size-7 rounded-md'"
    >
      <UIcon :name="kind.icon" class="size-3.5" />
    </span>
    {{ kind.name }}
    <!-- The hover's "+" stays out of the copy that follows the pointer. -->
    <UIcon
      v-if="!strip"
      name="i-lucide-plus"
      data-dnd-no-clone
      class="ms-auto me-1 size-3.5 text-dimmed opacity-0 transition-opacity group-hover:opacity-100"
    />
  </div>
</template>
