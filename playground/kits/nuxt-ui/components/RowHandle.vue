<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import UButton from '@nuxt/ui/components/Button.vue';

  const props = defineProps<{ id: string; name: string }>();
  const anchor = useTemplateRef<HTMLElement>('anchor');
  const handle = useTemplateRef('handle');
  // UTable renders its own <tr> elements and has no row slot: the row is found from a
  // cell slot. A getter is a valid element target.
  makeSortableItem(() => anchor.value?.closest('tr') ?? null, { id: () => props.id, handle });
</script>

<template>
  <span
    ref="anchor"
    class="inline-flex"
  >
    <UButton
      ref="handle"
      icon="i-lucide-grip-vertical"
      color="neutral"
      variant="ghost"
      size="xs"
      square
      class="cursor-grab"
      :aria-label="`Drag ${name}`"
      data-testid="row-handle"
    />
  </span>
</template>
