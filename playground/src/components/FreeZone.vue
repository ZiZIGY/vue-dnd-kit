<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable, type AcceptRule } from '@vue-dnd-kit/core';

  const props = defineProps<{ id: string; label: string; accept: AcceptRule }>();
  const el = useTemplateRef<HTMLElement>('el');
  const { isOver, isAccepting } = makeDroppable(el, { id: props.id, accept: props.accept });
</script>

<template>
  <div
    ref="el"
    class="zone"
    :class="{ over: isOver, accepting: isAccepting }"
    :data-testid="id"
  >
    <strong>{{ label }}</strong>
    <slot />
  </div>
</template>
