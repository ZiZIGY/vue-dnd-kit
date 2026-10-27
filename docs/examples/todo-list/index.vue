<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import TodoList from './TodoList.vue';
</script>

<template>
  <DnDProvider>
    <TodoList />
  </DnDProvider>
</template>
