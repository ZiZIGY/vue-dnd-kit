<script setup lang="ts">
  /** Head of a section: mono eyebrow, a large title revealed word by word, a muted lead. */
  withDefaults(
    defineProps<{
      eyebrow: string;
      title: string;
      description?: string;
      pattern?: 'dots' | 'grid' | 'hatch' | 'cross';
      fade?: 'right' | 'top-right' | 'bottom' | 'left' | 'radial';
    }>(),
    { description: undefined, pattern: 'hatch', fade: 'right' },
  );
</script>

<template>
  <div class="relative px-6 py-14 divider-dashed-b lg:px-12 lg:py-20">
    <DecorPattern
      :variant="pattern"
      :fade="fade"
      class="opacity-80"
    />
    <div class="relative">
      <div v-reveal>
        <p class="mb-6 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-muted">
          <span
            aria-hidden="true"
            class="size-1.5 bg-primary"
          />{{ eyebrow }}
        </p>
      </div>
      <RevealText
        tag="h2"
        :text="title"
        :delay="0.05"
        class="max-w-3xl text-3xl font-medium leading-[1.05] tracking-tight text-highlighted sm:text-4xl lg:text-5xl"
      />
      <RevealText
        v-if="description"
        tag="p"
        :text="description"
        :delay="0.2"
        :stagger="0.012"
        :duration="0.7"
        class="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
      />
      <slot />
    </div>
  </div>
</template>
