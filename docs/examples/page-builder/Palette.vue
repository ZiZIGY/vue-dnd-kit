<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import ElementChip from './ElementChip.vue';
import SectionGhost from './SectionGhost.vue';
import TemplateCard from './TemplateCard.vue';
import { CHIPS, SECTION_KINDS, createSection, type Section } from './page';

// One template per kind of section: a real section, so its card and the overlay show it.
const templates = ref<Section[]>(SECTION_KINDS.map((kind) => ({ ...createSection(kind), id: `template-${kind}` })));

const list = useTemplateRef<HTMLElement>('list');
// The page's group: copies go out (a new section each, new ids), nothing comes in, and
// the templates keep their order.
const { items } = makeSortableList(list, {
  id: 'templates',
  items: templates,
  group: { name: 'sections', pull: 'clone', put: false },
  sort: false,
  strategy: 'grid',
  clone: (template) => createSection(template.kind),
  overlay: SectionGhost,
});
</script>

<template>
  <div class="palette">
    <h3>Sections</h3>
    <p class="hint">Drag onto the page, or click to add</p>
    <div ref="list" class="templates">
      <TemplateCard v-for="template in items" :key="template.id" :template="template" />
    </div>

    <h3>Elements</h3>
    <p class="hint">Drop into any column</p>
    <div class="chips">
      <ElementChip v-for="kind in CHIPS" :key="kind" :kind="kind" />
    </div>
  </div>
</template>

<style scoped>
.palette {
  height: 100%;
  padding: 8px 12px 16px;
  overflow: auto;
  box-sizing: border-box;
}

h3 {
  margin: 10px 2px 2px;
  font: 600 10.5px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

.hint {
  margin: 4px 2px 10px;
  font-size: 11.5px;
  opacity: 0.5;
}

.templates,
.chips {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
  gap: 8px;
}

.chips {
  gap: 6px;
}
</style>
