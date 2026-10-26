<script setup lang="ts">
  /** A section's mark: its index in green, a rule drawn from the left, its name in mono caps. */
  defineProps<{ index: number; label: string }>();
</script>

<template>
  <p class="label flex items-center gap-3 text-[11px] text-dimmed">
    <span class="text-(--ui-primary) tabular-nums">{{ String(index).padStart(2, '0') }}</span>
    <Motion
      as="span"
      aria-hidden="true"
      class="h-px w-8 origin-left bg-(--ui-border-accented)"
      :initial="{ scaleX: 0 }"
      :while-in-view="{ scaleX: 1 }"
      :in-view-options="{ once: true }"
      :transition="{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }"
    />
    <Motion
      as="span"
      :initial="{ opacity: 0, x: -6 }"
      :while-in-view="{ opacity: 1, x: 0 }"
      :in-view-options="{ once: true }"
      :transition="{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }"
    >
      {{ label }}
    </Motion>
  </p>
</template>
