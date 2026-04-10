<script setup lang="ts">
  import { markRaw, useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import NoteOverlay from './NoteOverlay.vue';

  const props = defineProps<{
    id: string;
    text: string;
    color: 'amber' | 'rose' | 'teal';
  }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging } = makeDraggable(itemRef, {
    render: markRaw(NoteOverlay),
    data: () => ({ id: props.id, text: props.text, color: props.color }),
  });
</script>

<template>
  <motion.div
    ref="itemRef"
    class="note"
    :class="[`note--${props.color}`, { 'note--dragging': isDragging }]"
    :initial="{ scale: 0.9, opacity: 0 }"
    :animate="{ scale: 1, opacity: isDragging ? 0 : 1 }"
    :transition="{ duration: 0.2 }"
  >
    <span class="note-icon">📝</span>
    {{ props.text }}
  </motion.div>
</template>

<style scoped>
  .note {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: grab;
    
    /* See Mobile & Touch section */
    touch-action: none;
    user-select: none;
  }

  .note:active { cursor: grabbing; }
  .note--dragging { opacity: 0; }

  .note-icon { font-size: 0.9rem; flex-shrink: 0; }

  .note--amber {
    background: rgba(251, 191, 36, 0.15);
    border: 1px solid rgba(251, 191, 36, 0.35);
    color: rgb(252, 211, 77);
  }

  .note--rose {
    background: rgba(251, 113, 133, 0.13);
    border: 1px solid rgba(251, 113, 133, 0.3);
    color: rgb(253, 164, 175);
  }

  .note--teal {
    background: rgba(45, 212, 191, 0.12);
    border: 1px solid rgba(45, 212, 191, 0.3);
    color: rgb(94, 234, 212);
  }
</style>
