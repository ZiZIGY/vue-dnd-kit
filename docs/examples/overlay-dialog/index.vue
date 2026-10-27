<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import ColumnList from './ColumnList.vue';

const columns = ref(['Name', 'Status', 'Owner', 'Due date', 'Priority']);

const dialog = useTemplateRef<HTMLDialogElement>('dialog');
const open = ref(false);
const intoDialog = ref(true);

// A modal <dialog> sits on the top layer, above everything in <body>, the overlay
// included. While it is open, the overlay renders inside it.
const overlayTo = computed(() => (open.value && intoDialog.value ? '#columns-dialog' : 'body'));

const show = () => {
  dialog.value?.showModal();
  open.value = true;
};
</script>

<template>
  <DnDProvider :overlay-to="overlayTo">
    <div class="sheet">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in 2" :key="row">
            <td v-for="column in columns" :key="column"><span class="skeleton" /></td>
          </tr>
        </tbody>
      </table>
      <button type="button" class="primary" @click="show">Edit columns</button>
    </div>

    <dialog id="columns-dialog" ref="dialog" @close="open = false">
      <h3>Columns</h3>
      <p>Drag to change their order.</p>
      <ColumnList v-model:columns="columns" />
      <footer>
        <label class="switch">
          <input v-model="intoDialog" type="checkbox" />
          Overlay inside the dialog
        </label>
        <button type="button" class="primary" @click="dialog?.close()">Done</button>
      </footer>
    </dialog>
  </DnDProvider>
</template>

<style scoped>
.sheet {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

table {
  width: min(100%, 520px);
  border-collapse: collapse;
  font-size: 12px;
}

th {
  padding: 8px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
}

td {
  padding: 10px 8px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.skeleton {
  display: block;
  height: 8px;
  border-radius: 4px;
  background: color-mix(in srgb, currentColor 10%, transparent);
}

button {
  padding: 7px 14px;
  border: 0;
  border-radius: 8px;
  font: 600 12px/1.2 system-ui, sans-serif;
  cursor: pointer;
}

.primary {
  background: #42b883;
  color: #04130c;
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* No transform on the dialog: it would move the overlay's fixed position. */
dialog {
  width: min(340px, calc(100vw - 32px));
  box-sizing: border-box;
  margin: auto;
  padding: 18px;
  border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  border-radius: 16px;
  background: Canvas;
  color: CanvasText;
  box-shadow: 0 30px 60px -20px rgb(0 0 0 / 0.6);
}

dialog::backdrop {
  background: rgb(0 0 0 / 0.45);
}

h3 {
  margin: 0;
  font-size: 15px;
}

p {
  margin: 4px 0 14px;
  font-size: 12px;
  opacity: 0.6;
}

footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}

.switch {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.switch input {
  accent-color: #42b883;
}
</style>
