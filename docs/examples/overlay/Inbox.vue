<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import MailRow from './MailRow.vue';

const mails = ref([
  { id: 'm1', from: 'Maya Chen', subject: 'Design review at 3', time: '9:41', hue: 160 },
  { id: 'm2', from: 'Leo Park', subject: 'The build is green', time: '8:15', hue: 28 },
  { id: 'm3', from: 'Nora Kim', subject: 'Slides for the demo', time: '7:02', hue: 290 },
  { id: 'm4', from: 'Sam Rivera', subject: 'Lunch on Friday?', time: '6:30', hue: 205 },
]);

const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: mails });

const archive = (id: string) => {
  mails.value = mails.value.filter((mail) => mail.id !== id);
};
</script>

<template>
  <section class="inbox">
    <header>
      <span>Inbox</span>
      <span class="count">{{ mails.length }}</span>
    </header>
    <!-- The list paints its rows: they have no background of their own. -->
    <ul ref="list" class="mails">
      <MailRow v-for="mail in items" :key="mail.id" :mail="mail" @archive="archive" />
    </ul>
    <p v-if="!mails.length" class="empty">All done</p>
  </section>
</template>

<style scoped>
.inbox {
  width: 340px;
  max-width: 100%;
  margin: 0 auto;
  padding: 6px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px 8px;
  font-size: 15px;
  font-weight: 700;
}

.count {
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.mails {
  margin: 0;
  padding: 0;
  list-style: none;
}

.empty {
  margin: 0;
  padding: 24px;
  font-size: 13px;
  text-align: center;
  opacity: 0.5;
}
</style>
