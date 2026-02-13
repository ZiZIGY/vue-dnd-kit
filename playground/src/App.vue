<script setup lang="ts">
  import { DnDProvider } from '../../packages/core/src/external/index';
  import ScrollArea from './components/ScrollArea.vue';
  import Draggable from './components/Draggable.vue';
  import Overlay from './components/Overlay.vue';
  import Droppable from './components/Droppable.vue';
</script>

<template>
  <DnDProvider
    :auto-scroll-viewport="{ threshold: 60, speed: 11 }"
    overlay-to="body"
  >
    <div class="playground">
      <h1>Vue DnD Kit — Playground</h1>
      <p
        >Local packages: core + utilities. Run <code>yarn playground</code> —
        watch builds packages, dev runs app.</p
      >
      <ScrollArea
        ref="scrollContainerRef"
        class="scroll-area"
      >
        <Draggable class="card"> Drag me — auto-scroll near edges</Draggable>
        <Droppable>
          <div class="droppable">Drop here</div>
        </Droppable>
      </ScrollArea>
    </div>

    <template #overlay>
      <Overlay />
    </template>
  </DnDProvider>
</template>

<style>
  body {
    background: #f0f0f0;
    height: 200svh;
  }
  .playground {
    padding: 2rem;
    max-width: 60rem;
    margin: 0 auto;
  }
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  p {
    color: var(--color-text-2, #666);
    margin-bottom: 1.5rem;
  }
  .scroll-area {
    height: 400px;
    overflow: auto;
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 1rem;
  }
  .content {
    min-height: 800px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
  }
  .card {
    padding: 1rem 1.5rem;
    background: #3b82f6;
    color: #fff;
    border-radius: 8px;
    cursor: grab;
    user-select: none;
  }
  .card:active {
    cursor: grabbing;
  }
  code {
    background: #eee;
    padding: 0.2em 0.4em;
    border-radius: 4px;
  }
</style>

.list-move, /* apply transition to moving elements */ .list-enter-active,
.list-leave-active { transition: all 0.5s ease; } .list-enter-from,
.list-leave-to { opacity: 0; transform: translateX(30px); } .list-leave-active {
position: absolute; }
