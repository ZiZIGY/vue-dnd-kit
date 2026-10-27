<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableTree } from '@vue-dnd-kit/core';
import MenuRow from './MenuRow.vue';

interface MenuItem {
  id: string;
  title: string;
  kind: 'page' | 'link' | 'group';
  children?: MenuItem[];
}

const menu = ref<MenuItem[]>([
  { id: 'home', title: 'Home', kind: 'page' },
  {
    id: 'products',
    title: 'Products',
    kind: 'group',
    children: [
      { id: 'analytics', title: 'Analytics', kind: 'page' },
      { id: 'billing', title: 'Billing', kind: 'page' },
    ],
  },
  { id: 'pricing', title: 'Pricing', kind: 'page' },
  { id: 'company', title: 'Company', kind: 'group', children: [{ id: 'careers', title: 'Careers', kind: 'link' }] },
]);

const INDENT = 24;
let created = 0;
const root = useTemplateRef<HTMLElement>('root');
const { items } = makeSortableTree(root, {
  items: menu,
  indentation: INDENT,
  // The tree stays still while dragging: each row draws the line from its `indicator`.
  placeholder: 'indicator',
  // A menu bar with dropdowns: two levels, and links open no dropdown.
  maxDepth: 1,
  canNest: (_item, parent) => parent.kind !== 'link',
  // A template dragged in from the side becomes a new item, where the line is.
  createItem: (active) => {
    const template = active.data as Pick<MenuItem, 'title' | 'kind'>;
    return { id: `new-${++created}`, title: `New ${template.title.toLowerCase()}`, kind: template.kind };
  },
});
</script>

<template>
  <section class="builder">
    <!-- The menu as visitors see it: the saved data, not the draft. -->
    <nav class="preview" aria-label="Preview">
      <span v-for="item in menu" :key="item.id" class="entry">
        {{ item.title }}<span v-if="item.children?.length" class="caret" aria-hidden="true">▾</span>
      </span>
    </nav>
    <div ref="root" class="menu">
      <MenuRow v-for="node in items" :key="node.key" :node="node" :indent="INDENT" />
    </div>
  </section>
</template>

<style scoped>
.builder {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(100%, 330px);
}

.preview {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  min-height: 36px;
  align-items: center;
  padding: 0 14px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font-size: 12px;
  font-weight: 600;
}

.caret {
  margin-left: 3px;
  font-size: 9px;
  opacity: 0.6;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 120px;
  padding: 8px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}
</style>
