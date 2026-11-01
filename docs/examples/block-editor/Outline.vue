<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Block } from './blocks';
import { placeCaret } from './caret';
import { EDITOR } from './editor';

/**
 * The page's headings. A sidebar on wide screens; a column of dashes at the page's edge
 * otherwise, which opens on hover or focus. Click one to go there.
 */
const editor = inject(EDITOR)!;
const LEVELS: Partial<Record<Block['kind'], number>> = { h1: 1, h2: 2, h3: 3 };

// The headings on screen, in reading order: none from closed toggles.
const headings = computed(() => {
  const found: Block[] = [];
  const visit = (blocks: Block[]) =>
    blocks.forEach((block) => {
      if (LEVELS[block.kind]) found.push(block);
      if (!editor.collapsed.value.has(block.id)) visit(block.children);
    });
  visit(editor.blocks.value);
  return found;
});

// Scrolls the page alone, not the site around the demo, and puts the caret in the heading.
const go = (id: string) => {
  const field = editor.root.value?.querySelector<HTMLElement>(`[data-text="${id}"]`);
  const scroller = field?.closest<HTMLElement>('.scroller');
  if (!field || !scroller) return;
  const top = field.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 24;
  const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  scroller.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
  placeCaret(field, 'end');
};
</script>

<template>
  <nav v-if="headings.length" class="toc" aria-label="On this page">
    <p class="caption">On this page</p>
    <ul>
      <li v-for="heading in headings" :key="heading.id">
        <button type="button" :class="heading.kind" @click="go(heading.id)">
          <span class="dash" aria-hidden="true" />
          <span class="name">{{ heading.text || 'Untitled' }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* Mid-sized: dashes at the right edge of the page, a card on hover. */
.toc {
  position: absolute;
  top: 56px;
  right: 10px;
  z-index: 4;
  max-height: calc(100% - 80px);
  overflow-y: auto;
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 10px;
  transition:
    background-color 0.15s,
    box-shadow 0.15s,
    border-color 0.15s;
}

.caption {
  display: none;
  margin: 2px 8px 6px;
  font-size: 11.5px;
  font-weight: 600;
  opacity: 0.5;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
  min-height: 22px;
  padding: 2px 4px;
  border: 0;
  border-radius: 5px;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}

.dash {
  flex: none;
  order: 2;
  width: 16px;
  height: 2px;
  border-radius: 1px;
  background: currentColor;
  opacity: 0.25;
}

.h2 .dash {
  width: 12px;
}

.h3 .dash {
  width: 8px;
}

.name {
  display: none;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.7;
}

.h2 .name {
  padding-left: 10px;
}

.h3 .name {
  padding-left: 20px;
}

.toc:hover,
.toc:focus-within {
  width: 220px;
  border-color: color-mix(in srgb, currentColor 10%, transparent);
  background: Canvas;
  box-shadow: 0 16px 36px -18px rgb(0 0 0 / 0.45);
}

.toc:hover .name,
.toc:focus-within .name {
  display: block;
}

.toc:hover .dash,
.toc:focus-within .dash {
  display: none;
}

button:hover,
button:focus-visible {
  background: color-mix(in srgb, currentColor 7%, transparent);
  outline: none;
}

button:focus-visible {
  box-shadow: inset 0 0 0 2px #42b883;
}

button:hover .name {
  opacity: 1;
}

/* Wide: a sidebar of its own, always open. */
@container workspace (min-width: 1080px) {
  .toc,
  .toc:hover,
  .toc:focus-within {
    position: static;
    flex: none;
    width: 240px;
    max-height: none;
    padding: 28px 14px;
    border: 0;
    border-left: 1px solid color-mix(in srgb, currentColor 9%, transparent);
    border-radius: 0;
    background: none;
    box-shadow: none;
  }

  .caption,
  .name {
    display: block;
  }

  .dash {
    display: none;
  }
}

/* Narrow: no room beside the text. */
@container workspace (max-width: 560px) {
  .toc {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .toc {
    transition: none;
  }
}
</style>
