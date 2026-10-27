<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import Shortcut from './Shortcut.vue';

defineProps<{ attributes: boolean }>();

const shortcuts = ref([
  { id: 'docs', title: 'Vue docs', kind: 'link' as const, href: 'https://vuejs.org' },
  { id: 'note', title: 'New note', kind: 'button' as const },
  { id: 'inbox', title: 'Inbox', kind: 'plain' as const },
  { id: 'archive', title: 'Archive', kind: 'handle' as const },
]);
const notes = ref(0);

const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: shortcuts });

// The inspector: the role, tabindex and aria-* attributes of the element that has (or
// last had) the focus, read again whenever an attribute changes.
const inspected = shallowRef<HTMLElement | null>(null);
const rows = ref<{ name: string; value: string }[]>([]);
const read = () => {
  const element = inspected.value;
  rows.value = element
    ? [...element.attributes]
        .filter(({ name }) => name === 'role' || name === 'tabindex' || name.startsWith('aria-'))
        .map(({ name, value }) => ({ name, value }))
    : [];
};
// Its name: the label of the grip, or the title of the shortcut.
const name = computed(
  () => inspected.value?.getAttribute('aria-label') ?? inspected.value?.querySelector('.title')?.textContent ?? '',
);
const inspect = (event: FocusEvent) => {
  inspected.value = event.target as HTMLElement;
  read();
};
// What `aria-describedby` points to: the text a screen reader reads after the name.
const description = computed(() => {
  const ids = rows.value.find((row) => row.name === 'aria-describedby')?.value ?? '';
  return ids
    .split(' ')
    .map((id) => (id ? document.getElementById(id)?.textContent : ''))
    .join(' ')
    .trim();
});

const observer = typeof MutationObserver === 'undefined' ? null : new MutationObserver(read);
onMounted(() => {
  if (list.value) observer?.observe(list.value, { attributes: true, subtree: true });
  inspected.value = list.value?.querySelector<HTMLElement>('[aria-roledescription]') ?? null;
  read();
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div class="layout">
    <div>
      <div ref="list" class="shortcuts" @focusin="inspect">
        <Shortcut
          v-for="shortcut in items"
          :key="shortcut.id"
          :shortcut="shortcut"
          :attributes="attributes"
          @run="notes++"
        />
      </div>
      <p class="notes">Notes created: {{ notes }}</p>
    </div>
    <section class="inspector" aria-label="Attributes of the focused element">
      <h4>&lt;{{ inspected?.tagName.toLowerCase() ?? '…' }}&gt; {{ name }}</h4>
      <dl>
        <template v-for="row in rows" :key="row.name">
          <dt>{{ row.name }}</dt>
          <dd>"{{ row.value }}"</dd>
        </template>
      </dl>
      <p v-if="description" class="described">Read after the name: {{ description }}</p>
      <p v-if="!rows.length" class="empty">No role, tabindex or aria-* attributes</p>
    </section>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 18px;
  width: 100%;
}

.shortcuts {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 220px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.notes {
  margin: 10px 4px 0;
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.inspector {
  box-sizing: border-box;
  width: min(100%, 300px);
  min-height: 190px;
  padding: 12px 14px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  font: 11px/1.5 ui-monospace, Menlo, Consolas, monospace;
}

h4 {
  margin: 0 0 10px;
  font: inherit;
  font-weight: 600;
}

dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 10px;
  margin: 0;
}

dt {
  opacity: 0.6;
}

dd {
  margin: 0;
  overflow-wrap: anywhere;
  color: #42b883;
}

.described {
  margin: 10px 0 0;
  font-size: 10px;
  opacity: 0.55;
}

.empty {
  margin: 0;
  opacity: 0.5;
}
</style>
