<script setup lang="ts">
  import type { Component } from 'vue';

  /** Where a live demo plays: a flat panel, the demo centred, a reset in the corner. */
  defineProps<{ demo: Component | null; minHeight?: string }>();
  const { t } = useI18n();
  const runs = ref(0);
</script>

<template>
  <div
    class="stage relative flex items-center justify-center px-5 py-12 sm:px-10"
    :style="{ minHeight: minHeight ?? '20rem' }"
  >
    <UTooltip :text="t('example.reset')">
      <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        square
        icon="i-lucide-rotate-ccw"
        :aria-label="t('example.reset')"
        class="absolute end-3 top-3"
        @click="runs++"
      />
    </UTooltip>
    <div class="w-full">
      <ClientOnly>
        <component
          :is="demo"
          v-if="demo"
          :key="runs"
        />
        <template #fallback>
          <p class="label text-center text-[10px] text-dimmed">{{ t('example.loading') }}</p>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>
