<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import UBadge from '@nuxt/ui/components/Badge.vue';
  import UTooltip from '@nuxt/ui/components/Tooltip.vue';

  const props = defineProps<{ tag: string }>();
  // UTooltip has no root element of its own: it renders a fragment (the trigger, then a
  // portal). The ref resolves to the fragment's first element, the badge.
  const item = useTemplateRef('item');
  makeSortableItem(item, { id: () => props.tag });
</script>

<template>
  <UTooltip
    ref="item"
    :text="`#${tag}`"
  >
    <UBadge
      :label="tag"
      :data-id="tag"
      size="lg"
      variant="soft"
      class="cursor-grab"
    />
  </UTooltip>
</template>
