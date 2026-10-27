<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

/** Lists the `data-dnd-*` attributes on the page right now: on `<html>`, the overlay, and the rows in `scope`. */
const props = defineProps<{ scope: HTMLElement | null }>();
const lines = ref<{ tag: string; attribute: string; note: string }[]>([]);

const describe = (element: Element, name: string) => {
  const value = element.getAttribute(name);
  return value ? `${name}="${value}"` : name;
};

const read = () => {
  const next: typeof lines.value = [];
  const html = document.documentElement;
  if (html.hasAttribute('data-dnd-dragging')) next.push({ tag: 'html', attribute: describe(html, 'data-dnd-dragging'), note: 'the page' });
  const overlay = document.querySelector('[data-dnd-overlay]');
  if (overlay) next.push({ tag: 'div', attribute: describe(overlay, 'data-dnd-overlay'), note: 'the overlay' });
  for (const name of ['data-dnd-placeholder', 'data-dnd-dragging']) {
    for (const row of props.scope?.querySelectorAll(`[${name}]`) ?? []) {
      next.push({ tag: 'li', attribute: name, note: row.querySelector('.title')?.textContent ?? '' });
    }
  }
  lines.value = next;
};

let observer: MutationObserver | undefined;
onMounted(() => {
  // Attributes change on the rows and on <html>; the overlay is added to <body>.
  observer = new MutationObserver(read);
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['data-dnd-dragging', 'data-dnd-placeholder', 'data-dnd-overlay'],
  });
  read();
});
onUnmounted(() => observer?.disconnect());
</script>

<template>
  <section class="inspector" aria-live="off">
    <h4>Attributes now</h4>
    <ul>
      <li v-for="line in lines" :key="line.tag + line.attribute + line.note">
        <span class="tag">{{ line.tag }}</span>
        <span class="attribute">{{ line.attribute }}</span>
        <span class="note">{{ line.note }}</span>
      </li>
      <li v-if="!lines.length" class="none">Drag a row to see them</li>
    </ul>
  </section>
</template>

<style scoped>
.inspector {
  flex: 1;
  min-width: 0;
  max-width: 280px;
  padding: 12px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
}

h4 {
  margin: 0 0 10px;
  font: inherit;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 150px;
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
}

.tag {
  opacity: 0.5;
}

.attribute {
  color: #42b883;
  overflow-wrap: anywhere;
}

.note {
  grid-column: 2;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.55;
}

.none {
  display: block;
  opacity: 0.5;
}
</style>
