<script setup lang="ts">
  import { ref } from 'vue';
  import { TransitionGroup } from 'vue';

  import DnDProvider from './external/components/DnDProvider.vue';
  import Draggable from './internal/components/Draggable.vue';
  import SelectionArea from './internal/components/SelectionArea.vue';
  import DraggableZone from './internal/components/DroppableZone.vue';

  const test = ref([1, 2, 3, 4, 5, 6, 7]);

  const shuffle = () => {
    const arr = [...test.value];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    test.value = arr;
  };
</script>

<template>
  <DnDProvider>
    <div class="app-layout">
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Список (Ctrl + drag)</h2>
          <button
            type="button"
            class="shuffle-btn"
            @click="shuffle"
          >
            Shuffle
          </button>
        </div>
        <SelectionArea class="selection-area">
          <TransitionGroup
            name="list"
            class="list"
          >
            <Draggable
              v-for="(value, index) in test"
              :key="value"
              :index
              :source="test"
              drag-handle=".drag-handle"
            >
              <template #handle>
                <div class="drag-handle">
                  <span class="drag-handle-icon">⋮⋮</span>
                </div>
              </template>
              <span class="item-value">{{ value }}: Значение</span>
            </Draggable>
          </TransitionGroup>
        </SelectionArea>
      </section>
    </div>
  </DnDProvider>
</template>

<style>
  .app-layout {
    min-height: 100svh;
    padding: 2rem;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    font-family: 'Inter', system-ui, sans-serif;
  }

  .section {
    max-width: 420px;
    margin-bottom: 2rem;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .section-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .list--zone {
    gap: 6px;
  }

  .shuffle-btn {
    padding: 6px 12px;
    background: #475569;
    color: #e2e8f0;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .shuffle-btn:hover {
    background: #64748b;
  }

  /* TransitionGroup animations */
  .list-move,
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  .list-leave-active {
    position: absolute;
    width: 100%;
  }

  .drag-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 100%;
    margin-right: 10px;
    color: #64748b;
    cursor: grab;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .drag-handle:hover {
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.05);
  }

  .drag-handle:active {
    cursor: grabbing;
  }

  .drag-handle-icon {
    font-size: 14px;
    letter-spacing: -2px;
  }

  .item-value {
    color: #e2e8f0;
    font-size: 0.95rem;
  }
</style>
