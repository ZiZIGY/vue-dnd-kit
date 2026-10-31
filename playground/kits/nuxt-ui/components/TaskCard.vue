<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import UCard from '@nuxt/ui/components/Card.vue';
  import UButton from '@nuxt/ui/components/Button.vue';
  import UBadge from '@nuxt/ui/components/Badge.vue';
  import UTooltip from '@nuxt/ui/components/Tooltip.vue';
  import type { KitTask } from '../../shared/data';

  const props = defineProps<{ task: KitTask }>();
  // Component refs: the library resolves them to their root elements.
  const card = useTemplateRef('card');
  const handle = useTemplateRef('handle');
  makeSortableItem(card, { id: () => props.task.id, handle });
</script>

<template>
  <UCard
    ref="card"
    :data-id="task.id"
    :ui="{ body: 'flex items-center gap-3 p-2 sm:p-2' }"
  >
    <UButton
      ref="handle"
      icon="i-lucide-grip-vertical"
      color="neutral"
      variant="ghost"
      size="sm"
      square
      class="cursor-grab"
      :aria-label="`Drag ${task.title}`"
      data-testid="handle"
    />
    <span class="flex-1 text-sm">{{ task.title }}</span>
    <!-- A teleporting tooltip inside the item. -->
    <UTooltip :text="`Tag: ${task.tag}`">
      <UBadge
        :label="task.tag"
        variant="subtle"
        data-testid="tag"
      />
    </UTooltip>
  </UCard>
</template>
