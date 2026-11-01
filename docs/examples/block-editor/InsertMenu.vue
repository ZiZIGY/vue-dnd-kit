<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue';
import InsertOption from './InsertOption.vue';
import { KINDS, KIND_LIST, type BlockKind } from './blocks';

/**
 * The menu of new blocks. Opened by "+", it has a filter field of its own; opened by "/",
 * the text typed after the slash filters it (`typed`) and the block's field keeps the
 * focus, handing the menu its keys (`key`).
 */
const props = defineProps<{ typed?: string }>();
const emit = defineEmits<{ pick: [kind: BlockKind]; close: [] }>();

const filter = ref('');
const query = computed(() => (props.typed ?? filter.value).trim().toLowerCase());
// "he" finds the headings, not every hint with "the" in it: words that start with the query.
const matches = computed(() =>
  KIND_LIST.filter((kind) => {
    const { name, hint, markdown } = KINDS[kind];
    const q = query.value;
    const words = `${name} ${hint}`.toLowerCase().split(/[\s-]+/);
    return !q || markdown === q || name.toLowerCase().startsWith(q) || words.some((word) => word.startsWith(q));
  }),
);

const active = ref(0);
watch(matches, () => (active.value = 0));

const list = useTemplateRef<HTMLElement>('list');
watch(active, async (index) => {
  await nextTick();
  list.value?.children[index]?.scrollIntoView({ block: 'nearest' });
});

/** Arrows, Enter, Tab and Escape. `true` when the menu used the key. */
const key = (event: KeyboardEvent): boolean => {
  const count = matches.value.length;
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (count) active.value = (active.value + (event.key === 'ArrowDown' ? 1 : -1) + count) % count;
  } else if (event.key === 'Enter' || event.key === 'Tab') {
    const kind = matches.value[active.value];
    if (!kind) return false;
    emit('pick', kind);
  } else if (event.key === 'Escape') emit('close');
  else return false;
  event.preventDefault();
  return true;
};
defineExpose({ key });

const field = useTemplateRef<HTMLInputElement>('field');
onMounted(() => field.value?.focus({ preventScroll: true }));
</script>

<template>
  <div class="menu" @keydown.stop>
    <input
      v-if="typed === undefined"
      ref="field"
      v-model="filter"
      class="search"
      placeholder="Filter blocks…"
      aria-label="Filter blocks"
      role="combobox"
      aria-controls="new-blocks"
      aria-expanded="true"
      :aria-activedescendant="matches[active] ? `option-${matches[active]}` : undefined"
      @keydown="key"
    />
    <p class="section">Basic blocks</p>
    <ul id="new-blocks" ref="list" role="listbox" aria-label="New blocks">
      <InsertOption
        v-for="(kind, index) in matches"
        :key="kind"
        :kind="kind"
        option
        :active="index === active"
        @pick="emit('pick', kind)"
        @pointermove="active = index"
      />
    </ul>
    <p v-if="!matches.length" class="none">No blocks match “{{ query }}”</p>
    <p class="foot">
      <span><kbd>↑</kbd><kbd>↓</kbd> to choose</span>
      <span>or drag one into place</span>
    </p>
  </div>
</template>

<style scoped>
.menu {
  display: flex;
  flex-direction: column;
  width: min(310px, calc(100cqi - 24px));
  max-height: 340px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 18px 40px -16px rgb(0 0 0 / 0.4),
    0 2px 6px -2px rgb(0 0 0 / 0.12);
  animation: pop 0.14s cubic-bezier(0.2, 0, 0, 1);
}

@keyframes pop {
  from {
    opacity: 0;
    translate: 0 -4px;
    scale: 0.98;
  }
}

.search {
  margin: 8px 8px 0;
  padding: 7px 10px;
  border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  border-radius: 7px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  color: inherit;
  font: inherit;
  font-size: 13.5px;
  outline: none;
}

.search:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px color-mix(in srgb, #42b883 22%, transparent);
}

.section {
  margin: 10px 14px 4px;
  font-size: 11.5px;
  font-weight: 600;
  opacity: 0.5;
}

ul {
  overflow-y: auto;
  margin: 0;
  padding: 0 6px 6px;
  list-style: none;
}

.none {
  margin: 4px 14px 12px;
  font-size: 13px;
  opacity: 0.55;
}

.foot {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 0;
  padding: 7px 12px;
  border-top: 1px solid color-mix(in srgb, currentColor 9%, transparent);
  font-size: 11.5px;
  opacity: 0.55;
}

kbd {
  margin-right: 2px;
  padding: 0 4px;
  border-radius: 3px;
  background: color-mix(in srgb, currentColor 9%, transparent);
  font: inherit;
}

@media (prefers-reduced-motion: reduce) {
  .menu {
    animation: none;
  }
}
</style>
