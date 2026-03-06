<script setup lang="ts">
  import { motion, AnimatePresence } from 'motion-v';
  import { DragPreview } from '@vue-dnd-kit/core';
</script>

<template>
  <AnimatePresence mode="popLayout">
    <DragPreview v-slot="{ draggingMap }">
      <motion.div
        v-for="[node, draggable] in draggingMap"
        :key="node"
        class="preview-wrapper"
        :initial="{ scale: 0.9, opacity: 0, rotate: -2 }"
        :animate="{ scale: 1.06, opacity: 1, rotate: 1.5 }"
        :exit="{ scale: 0.9, opacity: 0, rotate: -2 }"
        :transition="{ type: 'spring', stiffness: 480, damping: 26 }"
      >
        <component
          v-if="draggable.render"
          :is="draggable.render"
        />
        <component
          v-else
          :is="node.tagName"
          v-html="draggable.initialOuterHTML"
          :style="{
            width: draggable.initialRect.width + 'px',
            height: draggable.initialRect.height + 'px',
          }"
        />
      </motion.div>
    </DragPreview>
  </AnimatePresence>
</template>

<style scoped>
  .preview-wrapper {
    filter: drop-shadow(0 16px 40px rgba(0, 0, 0, 0.22));
  }
</style>
