<script setup lang="ts">
  /** A 13px registration cross centred on a line crossing (the frame and a section edge). */
  defineProps<{ side: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }>();
</script>

<template>
  <span
    aria-hidden="true"
    class="pointer-events-none absolute z-3 hidden size-[13px] text-dimmed md:block"
    :class="{
      '-top-[7px] -left-[7px]': side === 'top-left',
      '-top-[7px] -right-[7px]': side === 'top-right',
      '-bottom-[7px] -left-[7px]': side === 'bottom-left',
      '-bottom-[7px] -right-[7px]': side === 'bottom-right',
    }"
  >
    <span class="absolute inset-x-0 top-[6px] h-px bg-current" />
    <span class="absolute inset-y-0 left-[6px] w-px bg-current" />
  </span>
</template>
