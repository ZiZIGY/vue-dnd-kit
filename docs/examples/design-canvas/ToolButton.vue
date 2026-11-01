<script setup lang="ts">
import Icon from './Icon.vue';
import type { IconName } from './icons';

// A square icon button with a tooltip: its label and shortcut. `pressed` makes it a toggle
// (left `undefined`, a plain button: no `aria-pressed`).
withDefaults(defineProps<{ icon: IconName; label: string; shortcut?: string; pressed?: boolean; tip?: 'above' | 'below' }>(), {
  shortcut: undefined,
  pressed: undefined,
  tip: 'below',
});
</script>

<template>
  <button type="button" class="tool-button" :class="tip" :aria-label="label" :aria-pressed="pressed">
    <Icon :name="icon" />
    <span class="tip" aria-hidden="true">
      {{ label }}<kbd v-if="shortcut">{{ shortcut }}</kbd>
    </span>
  </button>
</template>

<style scoped>
.tool-button {
  position: relative;
  display: grid;
  flex: none;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s,
    transform 0.1s;
}

@media (hover: hover) {
  .tool-button:hover:not(:disabled) {
    background: var(--dc-hover);
  }
}

.tool-button:active:not(:disabled) {
  transform: scale(0.92);
}

.tool-button:focus-visible {
  outline: 2px solid var(--dc-accent);
  outline-offset: 1px;
}

.tool-button:disabled {
  opacity: 0.35;
  cursor: default;
}

.tool-button[aria-pressed='true'],
.tool-button[aria-pressed='true']:hover {
  background: var(--dc-accent);
  color: #fff;
}

/* The tooltip: after a short wait on hover, at once for the keyboard. */
.tip {
  position: absolute;
  left: 50%;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 7px;
  border-radius: 6px;
  background: #1e1e1e;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 2px);
  transition:
    opacity 0.12s,
    transform 0.12s;
}

.below .tip {
  top: calc(100% + 6px);
}

.above .tip {
  bottom: calc(100% + 6px);
  transform: translate(-50%, -2px);
}

/* The first and the last button of a group keep their tooltip inside the editor. */
.tool-button:first-child .tip {
  left: 0;
  transform: translate(0, 2px);
}

.tool-button:last-child .tip {
  right: 0;
  left: auto;
  transform: translate(0, 2px);
}

/* Only where there is a hover: a tap would leave it showing. */
@media (hover: hover) {
  .tool-button:hover .tip {
    opacity: 1;
    transform: translate(-50%, 0);
    transition-delay: 0.45s;
  }
}

.tool-button:focus-visible .tip {
  opacity: 1;
  transform: translate(-50%, 0);
}

.tool-button:first-child:hover .tip,
.tool-button:first-child:focus-visible .tip,
.tool-button:last-child:hover .tip,
.tool-button:last-child:focus-visible .tip {
  transform: none;
}

/* No tooltips over a drag. */
html[data-dnd-dragging] .tip {
  visibility: hidden;
}

kbd {
  font: inherit;
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .tool-button,
  .tip {
    transition: none;
  }
}
</style>
