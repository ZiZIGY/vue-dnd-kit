<script setup lang="ts">
// Opted in with `autoImports.modifiers`.
const modifiers = [restrictToVerticalAxis];
</script>

<template>
  <DnDProvider :modifiers="modifiers">
    <TaskList />
  </DnDProvider>
</template>
