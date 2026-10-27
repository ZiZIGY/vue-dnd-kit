<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import LayersPanel from './LayersPanel.vue';

// Front to back, as a design tool lists them.
const layers = ref([
  { id: 'title', name: 'Title', kind: 'text' as const, visible: true, locked: false },
  { id: 'badge', name: 'Badge', kind: 'shape' as const, visible: true, locked: false },
  { id: 'photo', name: 'Photo', kind: 'image' as const, visible: true, locked: false },
  { id: 'card', name: 'Card', kind: 'shape' as const, visible: true, locked: true },
]);
</script>

<template>
  <DnDProvider>
    <div class="editor">
      <!-- The artboard reads `layers`: it restacks when a drop writes the new order. -->
      <div class="artboard" aria-hidden="true">
        <template v-for="(layer, index) in layers" :key="layer.id">
          <div v-show="layer.visible" class="shape" :class="layer.id" :style="{ zIndex: layers.length - index }">
            <template v-if="layer.id === 'title'">Summer sale</template>
            <template v-if="layer.id === 'badge'">-30%</template>
          </div>
        </template>
      </div>
      <LayersPanel v-model="layers" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.editor {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.artboard {
  position: relative;
  overflow: hidden;
  width: 240px;
  height: 170px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 10px 30px -12px rgb(0 0 0 / 0.5);
}

.shape {
  position: absolute;
}

.card {
  inset: 18px;
  border-radius: 12px;
  background: #1e3a8a;
}

.photo {
  top: 34px;
  left: 66px;
  width: 120px;
  height: 84px;
  border-radius: 8px;
  background:
    radial-gradient(circle at 75% 30%, #fde68a 0 12px, transparent 13px),
    linear-gradient(170deg, #67e8f9, #0e7490);
}

.badge {
  top: 20px;
  left: 160px;
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #facc15;
  color: #1e3a8a;
  font: 800 13px/1 system-ui, sans-serif;
}

.title {
  top: 104px;
  left: 30px;
  color: #fff;
  font: 800 24px/1 system-ui, sans-serif;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 6px rgb(0 0 0 / 0.35);
}
</style>
