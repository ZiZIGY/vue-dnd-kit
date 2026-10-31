<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDnD, type Key } from '@vue-dnd-kit/core';
import Folder from './Folder.vue';
import MessageRow from './MessageRow.vue';
import { FOLDERS, MESSAGES } from './mail';

const messages = ref(MESSAGES.map((message) => ({ ...message })));
const open = ref('inbox');
const shown = computed(() => messages.value.filter((message) => message.folder === open.value));
const countOf = (folder: string) => messages.value.filter((message) => message.folder === folder).length;

const { selection } = useDnD();

const move = (ids: Key[], folder: string) => {
  for (const message of messages.value) if (ids.includes(message.id)) message.folder = folder;
  selection.clear();
};

const show = (folder: string) => {
  open.value = folder;
  selection.clear();
};
</script>

<template>
  <div class="mailbox">
    <ul class="folders">
      <Folder
        v-for="folder in FOLDERS"
        :key="folder.id"
        :folder="folder"
        :count="countOf(folder.id)"
        :open="open === folder.id"
        @move="move($event, folder.id)"
        @show="show(folder.id)"
      />
    </ul>
    <section class="list">
      <header>
        <strong>{{ FOLDERS.find((folder) => folder.id === open)?.name }}</strong>
        <span v-if="selection.ids.size" class="selected-count">
          {{ selection.ids.size }} selected
          <button type="button" @click="selection.clear()">Clear</button>
        </span>
      </header>
      <ul class="messages">
        <MessageRow v-for="message in shown" :key="message.id" :message="message" />
      </ul>
      <p v-if="!shown.length" class="empty">Nothing here. Open another folder and drag messages in.</p>
    </section>
  </div>
</template>

<style scoped>
.mailbox {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  /* Fixed height: the box stays put as messages leave. */
  height: 400px;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 2%, Canvas);
  overflow: hidden;
}

.folders {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 10px 8px;
  list-style: none;
  border-right: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.list {
  min-width: 0;
  overflow-y: auto;
  padding: 10px 8px;
  background: Canvas;
}

header {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 26px;
  margin: 0 6px 6px;
  font-size: 14px;
}

.selected-count {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  font-size: 12px;
  opacity: 0.8;
}

.selected-count button {
  padding: 3px 8px;
  border: 1px solid color-mix(in srgb, currentColor 15%, transparent);
  border-radius: 6px;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.empty {
  margin: 24px 6px;
  font-size: 13px;
  opacity: 0.5;
  text-align: center;
}

@media (max-width: 520px) {
  .mailbox {
    grid-template-columns: 1fr;
  }

  .folders {
    flex-direction: row;
    flex-wrap: wrap;
    border-right: 0;
    border-bottom: 1px solid color-mix(in srgb, currentColor 8%, transparent);
  }
}
</style>
