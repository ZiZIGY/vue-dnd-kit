<script setup lang="ts">
// Opted in with `vueDndKit.autoImports.modifiers` in nuxt.config.ts.
const modifiers = [restrictToVerticalAxis];
</script>

<template>
  <DnDProvider :modifiers="modifiers">
    <h1>@vue-dnd-kit/nuxt playground</h1>
    <TaskList />
  </DnDProvider>
</template>

<style>
.area {
  position: relative;
  max-width: 360px;
  padding: 16px;
  background: #f3f4f6;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.task {
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.task.selected {
  border-color: #2563eb;
}

.band {
  background: rgb(37 99 235 / 0.12);
  border: 1px solid #2563eb;
}
</style>
