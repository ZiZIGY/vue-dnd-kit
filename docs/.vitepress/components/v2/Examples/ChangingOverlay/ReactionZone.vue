<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';

  const props = defineProps<{
    items: unknown[];
  }>();

  const emit = defineEmits<{
    (e: 'drop', event: IDragEvent): void;
    (e: 'enter' | 'leave', event: IDragEvent): void;
  }>();

  const reactionRef = useTemplateRef<HTMLElement>('reactionRef');

  const { isDragOver } = makeDroppable(reactionRef, {
    events: {
      onEnter(event) {
        emit('enter', event);
      },
      onLeave(event) {
        emit('leave', event);
      },
      onDrop(event) {
        emit('drop', event);
        emit('leave', event);
      },
    },
  });
</script>

<template>
  <div
    ref="reactionRef"
    class="flex min-h-[140px] flex-col gap-3 rounded-xl border border-dashed border-slate-500/60 bg-slate-900/10 p-4 transition-colors"
    :class="{
      'border-emerald-400 bg-emerald-500/5 shadow-[0_0_0_1px_rgba(16,185,129,0.4)]':
        !!isDragOver,
    }"
  >
    <p class="text-xs text-(--vp-c-text-2)">
      Drop H and O to build water (H₂O). Try other combinations like H₂, O₂, or
      Na + Cl → NaCl.
    </p>

    <div
      v-if="items.length"
      class="flex flex-wrap gap-1.5 text-xs sm:text-sm"
    >
      <motion.span
        v-for="item in items"
        :key="item.id"
        class="inline-flex items-center gap-1 rounded-full border border-slate-500/60 bg-slate-800/60 px-2 py-0.5"
        :initial="{ scale: 0.9, y: -4, opacity: 0 }"
        :animate="{ scale: 1, y: 0, opacity: 1 }"
      >
        <span class="font-semibold">{{ item.symbol }}</span>
        <span class="hidden text-[0.7rem] text-slate-300 sm:inline">
          {{ item.name }}
        </span>
      </motion.span>
    </div>

    <p
      v-else
      class="text-xs italic text-(--vp-c-text-2)"
    >
      Reaction zone is empty — drag some reagents here.
    </p>
  </div>
</template>
