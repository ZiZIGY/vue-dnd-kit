<script setup lang="ts">
import { computed, inject } from 'vue';
import BlockText from './BlockText.vue';
import { createBlock, type Block } from './blocks';
import { EDITOR } from './editor';

/**
 * What a block shows, by its kind. `open`: a toggle shows the blocks inside it. `number`:
 * a numbered item's place in its run of numbered items. `depth`: list markers change with it.
 */
const props = defineProps<{ block: Block; open: boolean; number: number; depth: number }>();
const editor = inject(EDITOR)!;

const BULLETS = ['•', '◦', '▪'];
const bullet = computed(() => BULLETS[props.depth % 3]);
// 1. 2. 3., then a. b. c., then i. ii. iii., as nested lists are numbered.
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
const numeral = computed(() => {
  const n = props.number;
  const style = props.depth % 3;
  if (style === 1) return String.fromCharCode(96 + ((n - 1) % 26) + 1);
  if (style === 2) return ROMAN[n - 1] ?? String(n);
  return String(n);
});
</script>

<template>
  <BlockText v-if="block.kind === 'text'" :block="block" class="quiet" placeholder="Write something, or press / for blocks…" />

  <BlockText v-else-if="block.kind === 'h1'" :block="block" class="h1" placeholder="Heading 1" />
  <BlockText v-else-if="block.kind === 'h2'" :block="block" class="h2" placeholder="Heading 2" />
  <BlockText v-else-if="block.kind === 'h3'" :block="block" class="h3" placeholder="Heading 3" />

  <div v-else-if="block.kind === 'todo'" class="marked" :class="{ done: block.done }">
    <span class="marker">
      <input type="checkbox" :checked="block.done" :aria-label="block.done ? 'Done' : 'Not done'" @change="editor.check(block.id)" />
    </span>
    <BlockText :block="block" placeholder="To-do" />
  </div>

  <div v-else-if="block.kind === 'bullet'" class="marked">
    <span class="marker bullet" aria-hidden="true">{{ bullet }}</span>
    <BlockText :block="block" placeholder="List" />
  </div>

  <div v-else-if="block.kind === 'numbered'" class="marked">
    <span class="marker numeral" aria-hidden="true">{{ numeral }}.</span>
    <BlockText :block="block" placeholder="List" />
  </div>

  <div v-else-if="block.kind === 'toggle'" class="marked">
    <span class="marker">
      <button
        type="button"
        class="chevron"
        :aria-expanded="open"
        :aria-label="open ? 'Close toggle' : 'Open toggle'"
        @click="editor.toggle(block.id)"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 11 8l-5 4.5z" /></svg>
      </button>
    </span>
    <BlockText :block="block" class="toggle-title" placeholder="Toggle" />
    <button
      v-if="open && !block.children.length"
      type="button"
      class="empty-toggle"
      @click="editor.insertInto(block.id, createBlock('text'))"
    >
      Empty toggle. Click to add a block, or drop one inside.
    </button>
  </div>

  <BlockText v-else-if="block.kind === 'quote'" :block="block" class="quote" placeholder="Empty quote" />

  <div v-else-if="block.kind === 'callout'" class="callout">
    <span class="emoji" aria-hidden="true">💡</span>
    <BlockText :block="block" placeholder="Type something…" />
  </div>

  <div v-else-if="block.kind === 'code'" class="code">
    <span class="language" aria-hidden="true">Shell</span>
    <BlockText :block="block" multiline placeholder="Code" />
  </div>

  <figure v-else-if="block.kind === 'image'" class="image">
    <div class="picture" role="img" aria-label="Hills at sunrise">
      <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <circle cx="236" cy="46" r="15" fill="rgb(255 255 255 / 0.78)" />
        <path d="M0 120V78l48-26 42 18 58-36 70 34 48-20 54 26v46z" fill="rgb(6 40 48 / 0.22)" />
        <path d="M0 120V96l70-20 58 16 80-28 58 18 54-10v48z" fill="rgb(6 40 48 / 0.3)" />
      </svg>
    </div>
    <BlockText :block="block" tag="figcaption" class="caption" placeholder="Add a caption" />
  </figure>

  <div v-else class="divider" role="separator" />
</template>

<style scoped>
/* Every block's text: the page's size, and one line per 26px. */
.editable {
  font-size: 15px;
  line-height: 26px;
}

/* A paragraph says what it takes only where the caret is. */
.quiet[data-empty]:not(:focus)::before {
  content: none;
}

.h1,
.h2,
.h3 {
  font-weight: 700;
  letter-spacing: -0.02em;
}

.h1 {
  font-size: 28px;
  line-height: 36px;
}

.h2 {
  font-size: 21px;
  line-height: 30px;
}

.h3 {
  font-size: 17px;
  line-height: 26px;
}

/* A marker column, then the text: nested blocks start under the text. */
.marked {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  align-items: start;
}

.marker {
  display: grid;
  place-items: center;
  height: 26px;
  user-select: none;
}

.bullet {
  font-size: 18px;
}

.numeral {
  justify-items: start;
  padding-left: 3px;
  font-variant-numeric: tabular-nums;
}

input[type='checkbox'] {
  appearance: none;
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  margin: 0;
  border: 1.5px solid color-mix(in srgb, currentColor 45%, transparent);
  border-radius: 4px;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;
}

input[type='checkbox']:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
}

input[type='checkbox']:checked {
  border-color: #42b883;
  background: #42b883;
}

/* The tick: drawn by the borders of a turned box. */
input[type='checkbox']:checked::after {
  content: '';
  width: 4px;
  height: 8px;
  margin-top: -2px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  rotate: 45deg;
}

input[type='checkbox']:focus-visible,
.chevron:focus-visible,
.empty-toggle:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.done .editable {
  text-decoration: line-through;
  text-decoration-color: color-mix(in srgb, currentColor 40%, transparent);
  opacity: 0.5;
  transition: opacity 0.2s;
}

.chevron {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: none;
  color: inherit;
  cursor: pointer;
}

.chevron:hover {
  background: color-mix(in srgb, currentColor 9%, transparent);
}

.chevron svg {
  width: 12px;
  height: 12px;
  fill: currentColor;
  transition: rotate 0.18s cubic-bezier(0.2, 0, 0, 1);
}

.chevron[aria-expanded='true'] svg {
  rotate: 90deg;
}

.empty-toggle {
  grid-column: 2;
  justify-self: start;
  margin: 2px 0 2px -6px;
  padding: 2px 6px;
  border: 0;
  border-radius: 5px;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 13px;
  line-height: 22px;
  text-align: left;
  opacity: 0.5;
  cursor: pointer;
}

.empty-toggle:hover {
  background: color-mix(in srgb, currentColor 7%, transparent);
  opacity: 0.75;
}

.quote {
  padding-left: 14px;
  border-left: 3px solid currentColor;
  font-size: 17px;
}

.callout {
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  gap: 6px;
  padding: 12px 14px 12px 12px;
  border: 1px solid color-mix(in srgb, currentColor 8%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, #42b883 9%, Canvas);
}

.emoji {
  font-size: 18px;
  line-height: 26px;
  text-align: center;
}

.code {
  position: relative;
  padding: 14px 16px 12px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 5%, Canvas);
}

.code .editable {
  font: 13.5px/22px ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  tab-size: 2;
}

.language {
  position: absolute;
  top: 6px;
  right: 10px;
  font-size: 11px;
  opacity: 0.45;
}

.image {
  margin: 6px 0 2px;
}

.picture {
  overflow: hidden;
  height: clamp(120px, 26cqi, 220px);
  border-radius: 8px;
  background: linear-gradient(165deg, #a7f3d0, #5eead4 40%, #0e7490);
}

.picture svg {
  display: block;
  width: 100%;
  height: 100%;
}

.caption {
  margin-top: 6px;
  font-size: 13px;
  line-height: 20px;
  opacity: 0.6;
}

.divider {
  display: flex;
  align-items: center;
  height: 26px;
}

.divider::before {
  content: '';
  flex: 1;
  border-top: 1px solid color-mix(in srgb, currentColor 16%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .chevron svg {
    transition: none;
  }
}
</style>
