<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import DraggableBox from './DraggableBox.vue';
  import DropZone from './DropZone.vue';
  import InstantDropZone from './InstantDropZone.vue';

  const lastResult = ref<'none' | 'accepted' | 'declined' | 'cancelled'>(
    'none'
  );
  const location = ref<'start' | 'async' | 'instant'>('start');

  function reset() {
    location.value = 'start';
    lastResult.value = 'none';
  }
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="promise-drop">
        <div class="areas">
          <div class="area area--start">
            <h4 class="area-title">Start area</h4>
            <p class="area-desc">Drag from here. Reset returns item back.</p>
            <DraggableBox
              v-if="location === 'start'"
              @started="lastResult = 'none'"
              @ended="lastResult = 'accepted'"
              @cancelled="lastResult = 'cancelled'"
            />
          </div>

          <DropZone
            class="area"
            @accepted="() => { location = 'async'; lastResult = 'accepted'; }"
            @declined="lastResult = 'declined'"
          >
            <div class="zone-content">
              <h4 class="area-title">Async confirm zone</h4>
              <p class="area-desc">
                Uses <code>confirm()</code>. OK → resolve(), Cancel → resolve(false) (drag
                stays active).
              </p>
              <DraggableBox
                v-if="location === 'async'"
                @started="lastResult = 'none'"
                @ended="lastResult = 'accepted'"
                @cancelled="lastResult = 'cancelled'"
              />
            </div>
          </DropZone>

          <InstantDropZone
            class="area"
            @dropped="() => { location = 'instant'; lastResult = 'accepted'; }"
          >
            <div class="zone-content">
              <h4 class="area-title">Instant zone</h4>
              <p class="area-desc">Synchronous drop, no Promise/confirm.</p>
              <DraggableBox
                v-if="location === 'instant'"
                @started="lastResult = 'none'"
                @ended="lastResult = 'accepted'"
                @cancelled="lastResult = 'cancelled'"
              />
            </div>
          </InstantDropZone>
        </div>

        <button
          type="button"
          class="reset-button glass-btn"
          @click="reset"
        >
          <span>Reset to start</span>
        </button>

        <p class="status">
          <strong>Status:</strong>
          <span v-if="lastResult === 'none'">no decision yet</span>
          <span v-else-if="lastResult === 'accepted'">accepted</span>
          <span v-else-if="lastResult === 'declined'">
            declined (drag still active, you can drop elsewhere)
          </span>
          <span v-else-if="lastResult === 'cancelled'">
            cancelled (Promise rejected or drag cancelled)
          </span>
        </p>
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .promise-drop {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .areas {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }

  .area {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .area--start {
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(148, 163, 184, 0.4);
    background-color: rgba(15, 23, 42, 0.02);
  }

  .area-title {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.1rem;
  }

  .area-desc {
    font-size: 0.8rem;
    color: var(--vp-c-text-2);
    margin: 0 0 0.5rem;
  }

  .zone-content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.4rem;
  }

  .status {
    font-size: 0.875rem;
    color: var(--vp-c-text-2);
  }

  .reset-button {
    align-self: flex-start;
    font-size: 0.8rem;
    padding-inline: 1rem;
  }
</style>
