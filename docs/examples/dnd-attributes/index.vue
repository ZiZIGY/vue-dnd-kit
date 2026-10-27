<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Inspector from './Inspector.vue';
import TaskList from './TaskList.vue';

const demo = useTemplateRef<HTMLElement>('demo');
</script>

<template>
  <DnDProvider>
    <div ref="demo" class="demo">
      <TaskList />
      <Inspector :scope="demo" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
</style>
