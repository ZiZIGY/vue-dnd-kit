<script setup lang="ts">
  import type { OverlayProps } from '@vue-dnd-kit/core';

  /** The lost page in hand: lifted and turned the other way. Over a place, it straightens up and shrinks a little, ready to go in. */
  const props = defineProps<OverlayProps>();
  const path = computed(() => (props.active.data as { path: string }).path);
  const taken = computed(() => !!props.over?.accepted);
  const pose = computed(() => {
    if (props.status === 'dropping') return taken.value ? { rotate: 0, scale: 0.9 } : { rotate: -3, scale: 1 };
    return taken.value ? { rotate: 0, scale: 0.94 } : { rotate: 3, scale: 1.04 };
  });
</script>

<template>
  <div class="size-full cursor-grabbing">
    <Motion
      class="size-full drop-shadow-[0_34px_38px_rgb(0_0_0/0.32)]"
      :initial="{ rotate: -3, scale: 1 }"
      :animate="pose"
      :transition="{ type: 'spring', stiffness: 360, damping: 24 }"
    >
      <NotFoundSheet
        :path="path"
        :lit="taken"
      />
    </Motion>
  </div>
</template>
