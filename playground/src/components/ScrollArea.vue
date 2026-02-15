<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import {
    makeAutoScroll,
    makeConstraintArea,
  } from '@vue-dnd-kit/core';

  const scrollContainerRef = useTemplateRef('scrollContainerRef');

  makeConstraintArea(scrollContainerRef, {
    // restrictToArea: true,
  });
  makeAutoScroll(scrollContainerRef, { threshold: 60, speed: 12 });
</script>

<template>
  <div ref="scrollContainerRef">
    <slot />
  </div>
</template>
