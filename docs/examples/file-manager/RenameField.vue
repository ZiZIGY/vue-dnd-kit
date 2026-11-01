<script setup lang="ts">
import { inject, onMounted, ref, useTemplateRef } from 'vue';
import { DRIVE } from './drive';
import { isFolder, type Entry } from './files';

/** The name, edited in place: Enter or a click elsewhere saves, Escape keeps the old one. */
const props = defineProps<{ entry: Entry }>();
const emit = defineEmits<{ done: [] }>();
const drive = inject(DRIVE)!;

const value = ref(props.entry.name);
const input = useTemplateRef<HTMLInputElement>('input');

// The name is selected without its extension, as Finder does.
onMounted(() => {
  const dot = isFolder(props.entry) ? -1 : props.entry.name.lastIndexOf('.');
  input.value?.focus();
  input.value?.setSelectionRange(0, dot > 0 ? dot : props.entry.name.length);
});

const save = () => {
  // A blur follows Enter as the field goes away: save once.
  if (drive.renaming.value !== props.entry.id) return;
  drive.rename(props.entry, value.value);
  emit('done');
};
const cancel = () => {
  drive.renaming.value = null;
  emit('done');
};
</script>

<template>
  <!-- A field: a press on it never starts a drag or a rubber band. -->
  <input
    ref="input"
    v-model="value"
    class="rename"
    aria-label="Name"
    spellcheck="false"
    @keydown.enter.prevent="save"
    @keydown.esc.prevent="cancel"
    @blur="save"
    @click.stop
    @dblclick.stop
  />
</template>

<style scoped>
.rename {
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 2px 5px;
  border: 0;
  border-radius: 5px;
  outline: 2px solid #42b883;
  background: Canvas;
  color: inherit;
  font: inherit;
  text-align: inherit;
}
</style>
