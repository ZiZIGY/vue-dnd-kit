<script setup lang="ts">
import PaletteGroup from './PaletteGroup.vue';
import { SECTIONS } from './form';

/** The fields to add: a side panel, or a strip of chips above the form on a phone. */
defineProps<{ strip?: boolean }>();
</script>

<template>
  <nav
    v-if="strip"
    aria-label="Fields"
    class="flex gap-1.5 overflow-x-auto px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    <PaletteGroup v-for="section in SECTIONS" :key="section.title" v-bind="section" strip />
  </nav>

  <nav v-else aria-label="Fields" class="flex h-full flex-col">
    <header class="flex h-12 shrink-0 items-center justify-between border-b border-default px-4">
      <h3 class="text-sm font-semibold text-highlighted">Fields</h3>
      <span class="text-xs text-dimmed">Drag or click</span>
    </header>
    <div class="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
      <PaletteGroup v-for="section in SECTIONS" :key="section.title" v-bind="section" :strip="false" />
    </div>
  </nav>
</template>
