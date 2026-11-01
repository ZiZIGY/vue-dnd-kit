<script setup lang="ts">
import { inject } from 'vue';
import Icon from './Icon.vue';
import { BOARD } from './store';

// The board's last word (a deletion with its Undo, a column that can't take more), for six seconds.
const board = inject(BOARD)!;
const { notice } = board;

const undo = () => {
  notice.value?.undo?.();
};
</script>

<template>
  <!-- The live region stays in the page: screen readers hear each notice as it comes. -->
  <div role="status" class="region">
    <Transition name="notice">
      <div v-if="notice" :key="notice.text" class="notice">
        <span class="text">{{ notice.text }}</span>
        <button v-if="notice.undo" type="button" class="undo" @click="undo"><Icon name="undo" />Undo</button>
        <button type="button" class="dismiss" aria-label="Dismiss" @click="board.dismiss"><Icon name="close" /></button>
        <span class="timer" aria-hidden="true" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.region {
  position: relative;
  display: flex;
  justify-content: center;
}

.notice {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  padding: 5px 5px 5px 12px;
  border-radius: 12px;
  background: light-dark(#18181b, #f4f4f5);
  box-shadow: 0 16px 40px -12px rgb(0 0 0 / 0.55);
  color: light-dark(#fafafa, #18181b);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.text {
  margin-right: 6px;
}

button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 9px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: 600 12px/1 system-ui, sans-serif;
  cursor: pointer;
}

button:hover {
  background: color-mix(in srgb, currentColor 12%, transparent);
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.undo {
  color: #42b883;
}

.dismiss {
  width: 28px;
  justify-content: center;
  padding: 0;
  opacity: 0.6;
}

/* The six seconds the notice stays, running out along its bottom edge. */
.timer {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #42b883;
  transform-origin: left;
  animation: countdown 6s linear forwards;
}

.notice-enter-active,
.notice-leave-active {
  transition:
    opacity 0.2s,
    translate 0.2s;
}

.notice-enter-from,
.notice-leave-to {
  opacity: 0;
  translate: 0 8px;
}

.notice-leave-active {
  position: absolute;
}

@keyframes countdown {
  to {
    scale: 0 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .timer {
    animation: none;
    opacity: 0;
  }

  .notice-enter-from,
  .notice-leave-to {
    translate: none;
  }
}
</style>
