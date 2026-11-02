<script setup lang="ts">
  import { makeDroppable } from '@vue-dnd-kit/core';

  /** A place that exists: a link, and a drop target for the lost page. `sent`: the page was dropped here, the site is on its way. */
  const props = defineProps<{ zone: { key: string; title: string; to: string; icon: string }; index: number; sent: boolean }>();
  const emit = defineEmits<{ drop: [] }>();
  const { t } = useI18n();

  const el = useTemplateRef<HTMLElement>('el');
  const { isOver, isAccepting } = makeDroppable(el, {
    id: () => `zone-${props.zone.key}`,
    label: () => props.zone.to,
    accept: 'page',
    onDrop: () => emit('drop'),
  });
  const lit = computed(() => (isOver.value && isAccepting.value) || props.sent);
  const note = computed(() => {
    if (props.sent) return t('notFound.opening');
    return lit.value ? t('notFound.release') : props.zone.to;
  });
</script>

<template>
  <div
    ref="el"
    class="group relative flex min-h-44 flex-col justify-between overflow-hidden px-(--gutter) py-8 transition-colors duration-300 lg:min-h-52 lg:py-10"
    :class="lit ? 'bg-(--color-accent) text-(--color-on-accent)' : 'bg-default hover:bg-muted'"
  >
    <!-- The page is in hand: every place shows it takes it. -->
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-3 border border-dashed border-(--ui-primary) transition-opacity duration-300"
      :class="isAccepting && !lit ? 'opacity-100' : 'opacity-0'"
    />
    <span class="flex items-center justify-between">
      <span
        class="grid size-10 place-items-center ring-1 transition-colors duration-300 ring-inset"
        :class="lit ? 'ring-(--color-on-accent)/30' : 'text-(--ui-primary) ring-(--ui-border)'"
      >
        <UIcon
          :name="sent ? 'i-lucide-loader-circle' : zone.icon"
          class="size-[18px]"
          :class="sent ? 'animate-spin' : ''"
        />
      </span>
      <span class="font-mono text-[11px] opacity-60">{{ String(index).padStart(2, '0') }}</span>
    </span>
    <span class="mt-10 flex flex-col gap-2">
      <!-- The whole cell is the link. -->
      <NuxtLink
        :to="zone.to"
        class="text-xl font-bold tracking-[-0.035em] break-words outline-none after:absolute after:inset-0 focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-(--ui-primary) sm:text-2xl lg:text-3xl"
        :class="lit ? '' : 'text-highlighted'"
        >{{ zone.title }}</NuxtLink
      >
      <span
        class="truncate font-mono text-xs"
        :class="lit ? 'opacity-75' : 'text-dimmed'"
        >{{ note }}</span
      >
    </span>
  </div>
</template>
