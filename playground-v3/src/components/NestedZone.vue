<script setup lang="ts">
  import { computed, inject, useTemplateRef } from 'vue';
  import { makeDroppable, useDnD, type AcceptRule } from '@vue-dnd-kit/core';
  import NestedPiece from './NestedPiece.vue';
  import { ZONE_STORE } from './zones';

  const props = defineProps<{ id: string; label: string; accept?: AcceptRule; priority?: number }>();
  const store = inject(ZONE_STORE)!;
  const el = useTemplateRef<HTMLElement>('el');
  const { isOver } = makeDroppable(el, {
    id: props.id,
    accept: props.accept,
    priority: props.priority,
    onDrop: (event) => (store.location[event.active.id] = props.id),
  });
  const { over } = useDnD();

  /** `accepted`/`rejected` while hovered, for styling and tests. */
  const hover = computed(() => (isOver.value ? (over.value?.accepted ? 'accepted' : 'rejected') : undefined));
  const pieces = computed(() => store.pieces.filter((piece) => store.location[piece.id] === props.id));
</script>

<template>
  <div
    ref="el"
    class="nz-zone"
    :data-testid="`zone-${id}`"
    :data-over="hover"
  >
    <span class="nz-zone-label">{{ label }}</span>
    <div
      v-if="pieces.length"
      class="nz-zone-pieces"
    >
      <NestedPiece
        v-for="piece in pieces"
        :key="piece.id"
        :piece="piece"
      />
    </div>
    <slot />
  </div>
</template>
