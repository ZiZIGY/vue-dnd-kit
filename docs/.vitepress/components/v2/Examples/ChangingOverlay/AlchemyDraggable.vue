<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable } from '@vue-dnd-kit/core';

  const flaskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m26.017 7.19l10.03 27.582a12.1 12.1 0 0 1 .729 4.137h0a4.6 4.6 0 0 1-1.345 3.247h0a4.6 4.6 0 0 1-3.247 1.344H15.816a4.6 4.6 0 0 1-3.247-1.345h0a4.6 4.6 0 0 1-1.345-3.247h0a12.1 12.1 0 0 1 .729-4.136L21.983 7.19h-1.345a1.345 1.345 0 0 1-1.345-1.345h0A1.345 1.345 0 0 1 20.638 4.5h6.724a1.345 1.345 0 0 1 1.345 1.345h0a1.345 1.345 0 0 1-1.345 1.345ZM13.1 31.617h21.8"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M19.522 27.565a1.278 1.278 0 1 0-.374-.904a1.3 1.3 0 0 0 .374.904m4.831-6.074a2.126 2.126 0 1 1 0 1.345a2.15 2.15 0 0 1 0-1.345m-2.37-3.543a.95.95 0 1 0-.279-.672a.96.96 0 0 0 .279.672"/></svg>`;

  interface Reagent {
    id: string;
    symbol: string;
    name: string;
  }

  const props = defineProps<{
    index: number;
    items: Reagent[];
    reagent: Reagent;
  }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging } = makeDraggable(
    itemRef,
    { data: () => props.reagent },
    () => [props.index, props.items]
  );
</script>

<template>
  <motion.div
    ref="itemRef"
    class="inline-flex items-center gap-2 rounded-full border border-sky-400/60 bg-sky-500/10 px-3 py-1.5 text-sm font-medium text-(--vp-c-text-1) cursor-grab select-none touch-none"
    :initial="{ scale: 0.9, y: -6, opacity: 0 }"
    :animate="{ scale: 1, y: 0, opacity: 1 }"
    :style="{ opacity: isDragging ? 0.3 : 1 }"
  >
    <span
      class="w-4 h-4 text-sky-400"
      v-html="flaskSvg"
    />
    <span class="text-base font-semibold">{{ props.reagent.symbol }}</span>
    <span class="hidden text-xs text-slate-400 sm:inline">
      ({{ props.reagent.name }})
    </span>
  </motion.div>
</template>

