<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import UCard from '@nuxt/ui/components/Card.vue';
  import UButton from '@nuxt/ui/components/Button.vue';
  import UBadge from '@nuxt/ui/components/Badge.vue';
  import UDropdownMenu from '@nuxt/ui/components/DropdownMenu.vue';
  import UTooltip from '@nuxt/ui/components/Tooltip.vue';
  import UIcon from '@nuxt/ui/components/Icon.vue';
  import type { DropdownMenuItem } from '@nuxt/ui';
  import type { KitTask } from '../../shared/data';

  const props = defineProps<{ card: KitTask }>();
  const emit = defineEmits<{ advance: []; remove: [] }>();
  const root = useTemplateRef('root');
  makeSortableItem(root, { id: () => props.card.id });

  // The menu teleports its content to <body>, outside the card.
  const actions = computed<DropdownMenuItem[][]>(() => [
    [
      { label: 'Move to next column', icon: 'i-lucide-arrow-right', onSelect: () => emit('advance') },
      { label: 'Delete', icon: 'i-lucide-trash-2', color: 'error', onSelect: () => emit('remove') },
    ],
  ]);
</script>

<template>
  <UCard
    ref="root"
    :data-id="card.id"
    variant="outline"
    class="cursor-grab"
    :ui="{ body: 'flex items-start gap-2 p-3 sm:p-3' }"
  >
    <div class="flex flex-1 flex-col items-start gap-1">
      <span class="text-sm font-medium text-highlighted">{{ card.title }}</span>
      <div class="flex items-center gap-1">
        <UBadge
          :label="card.tag"
          size="sm"
          variant="subtle"
        />
        <UTooltip :text="`Card ${card.id}`">
          <UIcon
            name="i-lucide-info"
            class="size-4 text-muted"
            data-testid="info"
          />
        </UTooltip>
      </div>
    </div>
    <UDropdownMenu
      :items="actions"
      :content="{ align: 'end' }"
    >
      <UButton
        icon="i-lucide-ellipsis-vertical"
        color="neutral"
        variant="ghost"
        size="sm"
        square
        :aria-label="`Actions for ${card.title}`"
        data-testid="menu"
      />
    </UDropdownMenu>
  </UCard>
</template>
