<script setup lang="ts">
  import { makeDroppable, useDnD, type Key } from '@vue-dnd-kit/core';

  /** A digit's place in the 404: an outline of it in viewfinder corners. It takes its own digit, one at a time. */
  const props = defineProps<{ index: number; glyph: string; digit: { id: string } | null; shown: boolean }>();
  const emit = defineEmits<{ drop: [id: Key] }>();

  const number = computed(() => String(props.index + 1).padStart(2, '0'));
  const el = useTemplateRef<HTMLElement>('el');
  const { isOver, isAccepting } = makeDroppable(el, {
    id: () => `slot-${number.value}`,
    label: () => `slot ${number.value}`,
    accept: ({ active }) => (active.data as { glyph?: string } | undefined)?.glyph === props.glyph && (!props.digit || props.digit.id === active.id),
    onDrop: ({ active }) => emit('drop', active.id),
  });

  // Over it with a digit it doesn't take.
  const { status } = useDnD();
  const refused = computed(() => isOver.value && !isAccepting.value && status.value === 'dragging');
</script>

<template>
  <div
    ref="el"
    class="slot"
    :class="{ shown, accepting: isAccepting, over: isOver && isAccepting, refused }"
  >
    <span
      v-if="!digit"
      aria-hidden="true"
      class="ghost"
      >{{ glyph }}</span
    >
    <span
      v-for="corner in ['tl', 'tr', 'bl', 'br']"
      :key="corner"
      aria-hidden="true"
      class="corner"
      :class="corner"
    />
    <span
      aria-hidden="true"
      class="index"
      >{{ number }}</span
    >
    <slot />
  </div>
</template>

<style scoped>
  /* The size of a digit's box (Digit.vue), in the digits' font size. */
  .slot {
    position: relative;
    display: grid;
    place-items: center;
    width: 0.66em;
    height: 0.9em;
    border-radius: 2px;
    transition: background-color 0.25s;
  }

  .ghost {
    font-weight: 700;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 2px var(--ui-border-accented);
    opacity: 0;
    user-select: none;
    transition:
      opacity 0.5s,
      -webkit-text-stroke-color 0.2s;
  }

  .corner {
    position: absolute;
    width: 14px;
    height: 14px;
    border: 0 solid var(--ui-text-dimmed);
    opacity: 0;
    transition:
      opacity 0.5s,
      translate 0.35s var(--ease-out-expo),
      border-color 0.2s;
  }

  .tl {
    top: 0;
    left: 0;
    border-width: 1.5px 0 0 1.5px;
    translate: -8px -8px;
  }

  .tr {
    top: 0;
    right: 0;
    border-width: 1.5px 1.5px 0 0;
    translate: 8px -8px;
  }

  .bl {
    bottom: 0;
    left: 0;
    border-width: 0 0 1.5px 1.5px;
    translate: -8px 8px;
  }

  .br {
    right: 0;
    bottom: 0;
    border-width: 0 1.5px 1.5px 0;
    translate: 8px 8px;
  }

  .index {
    position: absolute;
    top: 100%;
    margin-top: 12px;
    font: 600 11px/1 var(--font-mono);
    letter-spacing: 0.08em;
    color: var(--ui-text-dimmed);
    opacity: 0;
    transition:
      opacity 0.5s,
      color 0.2s;
  }

  .shown .ghost,
  .shown .corner,
  .shown .index {
    opacity: 1;
  }

  .shown .corner {
    translate: 0 0;
  }

  /* A digit it takes is in hand: it shows it is waiting for it; under it, it closes in. */
  .accepting .corner,
  .accepting .index {
    border-color: var(--ui-primary);
    color: var(--ui-primary);
  }

  .accepting .ghost {
    -webkit-text-stroke-color: color-mix(in oklab, var(--ui-primary) 55%, transparent);
  }

  .over {
    background: color-mix(in oklab, var(--ui-primary) 9%, transparent);
  }

  /* The digit in hand covers its outline (a little larger, it wouldn't line up). */
  .over .ghost {
    opacity: 0;
  }

  .over .tl {
    translate: 6px 6px;
  }

  .over .tr {
    translate: -6px 6px;
  }

  .over .bl {
    translate: 6px -6px;
  }

  .over .br {
    translate: -6px -6px;
  }

  .refused {
    background: color-mix(in oklab, #f43f5e 8%, transparent);
    animation: shake 0.3s;
  }

  .refused .corner {
    border-color: #f43f5e;
  }

  @keyframes shake {
    25% {
      translate: -6px 0;
    }
    75% {
      translate: 6px 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .refused {
      animation: none;
    }
  }
</style>
