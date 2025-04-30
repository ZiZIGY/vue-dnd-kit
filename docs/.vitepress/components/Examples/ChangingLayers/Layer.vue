<script setup lang="ts">
  import { TLayerProps } from '@vue-dnd-kit/core';

  const props = defineProps<TLayerProps>();
</script>

<template>
  <div>
    <img
      src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/master/public/logo.svg"
      alt="logo"
    />
    {{ props.id }}
  </div>
</template>
