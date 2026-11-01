<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { onKeyStroke } from '@vueuse/core';
import PieceArt from './PieceArt.vue';
import { NAMES, type Kind } from './chess';

// Opens next to the square while the drop waits for the answer (the square's async
// `onBeforeDrop`). A plain element of the page: the overlay waiting on the square lets the
// pointer through, so these buttons work as any other.
const props = defineProps<{ square: string }>();
const choice = defineModel<Kind>('choice', { required: true });
const emit = defineEmits<{ answer: [answer: Kind | 'reject' | 'continue'] }>();

const KINDS: Kind[] = ['Q', 'R', 'B', 'N'];
const color = props.square[1] === '8' ? 'w' : 'b';
const file = 'abcdefgh'.indexOf(props.square[0]!);

// The keyboard lands on the queen: Tab goes through the others, Enter picks.
const buttons = useTemplateRef<HTMLButtonElement[]>('buttons');
onMounted(() => buttons.value?.[0]?.focus());
// Escape says no: the pawn flies back.
onKeyStroke('Escape', (event) => {
  event.preventDefault();
  emit('answer', 'reject');
});
</script>

<template>
  <div class="picker" :class="color" :style="{ '--file': file }" role="group" aria-label="Promote the pawn">
    <div class="pieces">
      <button
        v-for="kind in KINDS"
        ref="buttons"
        :key="kind"
        type="button"
        :class="{ chosen: choice === kind }"
        :aria-label="`Promote to a ${NAMES[kind]}`"
        @pointerenter="choice = kind"
        @focus="choice = kind"
        @click="emit('answer', kind)"
      >
        <PieceArt :kind="kind" :color="color" />
      </button>
    </div>
    <div class="other">
      <button type="button" @click="emit('answer', 'continue')">Keep dragging</button>
      <button type="button" @click="emit('answer', 'reject')">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
/* Four squares wide, one rank in from the promotion square, kept on the board. */
.picker {
  position: absolute;
  z-index: 3;
  left: clamp(0%, calc((var(--file) - 1.5) * 12.5%), 50%);
  width: 50%;
  /* In the board's colours: black pieces stay visible on a dark page. */
  border-radius: 10px;
  background: #ecebd6;
  color: #26231f;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 0.2),
    0 18px 40px -12px rgb(0 0 0 / 0.6);
  animation: open 0.18s ease-out;
}

.picker.w {
  top: calc(12.5% + 6px);
}

.picker.b {
  bottom: calc(12.5% + 6px);
}

.pieces {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.pieces button {
  aspect-ratio: 1;
  padding: 10%;
  border: 0;
  border-radius: 10px;
  background: none;
  cursor: pointer;
}

.pieces button.chosen {
  background: rgb(255 214 10 / 0.55);
}

.pieces button:focus-visible,
.other button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.other {
  display: flex;
  border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent);
}

.other button {
  flex: 1;
  padding: 7px 4px;
  border: 0;
  background: none;
  color: inherit;
  font: 600 11px/1.2 system-ui, sans-serif;
  opacity: 0.75;
  cursor: pointer;
}

.other button:hover {
  opacity: 1;
}

@keyframes open {
  from {
    opacity: 0;
    translate: 0 -6px;
  }
}
</style>
