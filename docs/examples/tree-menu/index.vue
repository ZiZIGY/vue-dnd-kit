<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import MenuTree from './MenuTree.vue';
import Template from './Template.vue';
</script>

<template>
  <DnDProvider>
    <div class="editor">
      <aside class="templates">
        <h3>Add</h3>
        <Template title="Page" kind="page" />
        <Template title="Link" kind="link" />
        <Template title="Group" kind="group" />
      </aside>
      <MenuTree />
    </div>
  </DnDProvider>
</template>

<style scoped>
.editor {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
}

.templates {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 120px;
}

h3 {
  margin: 0 0 2px;
  font: 600 10px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}
</style>
