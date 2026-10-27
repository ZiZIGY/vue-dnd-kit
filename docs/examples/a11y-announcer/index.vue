<script setup lang="ts">
import { computed, ref } from 'vue';
import { DnDProvider, type Announcements, type Key } from '@vue-dnd-kit/core';
import Agenda from './Agenda.vue';
import { LANGUAGES } from './texts';

const agenda = ref([
  { id: 'welcome', title: 'Welcome', minutes: 5 },
  { id: 'roadmap', title: 'Roadmap', minutes: 15 },
  { id: 'demo', title: 'Live demo', minutes: 10 },
  { id: 'questions', title: 'Questions', minutes: 10 },
]);
const lang = ref('en');
const texts = computed(() => LANGUAGES[lang.value]!);

// Every text handed to the live region, newest first.
const spoken = ref<{ id: number; text: string }[]>([]);
let count = 0;
const say = (text: string) => {
  if (spoken.value[0]?.text !== text) spoken.value = [{ id: ++count, text }, ...spoken.value].slice(0, 4);
  return text;
};

const titleOf = (id: Key) => agenda.value.find((item) => item.id === id)?.title ?? String(id);

// `position` is where the built-in texts say the item is: picked up at, moving to, dropped
// at, back at. `index` counts from 0.
const announcements = computed<Partial<Announcements>>(() => {
  const t = texts.value;
  return {
    onDragStart: ({ active }, { position }) =>
      position && say(t.start(titleOf(active.id), position.index + 1, position.length)),
    onDragOver: ({ active }, { position }) =>
      position && say(t.move(titleOf(active.id), position.index + 1, position.length)),
    onDragEnd: ({ active }, { position }) =>
      position && say(t.drop(titleOf(active.id), position.index + 1, position.length)),
    onDragCancel: ({ active }, { position }) => position && say(t.cancel(titleOf(active.id), position.index + 1)),
    onDragResume: ({ active }) => say(t.resume(titleOf(active.id))),
  };
});
</script>

<template>
  <DnDProvider :announcements="announcements" :screen-reader-instructions="texts.instructions">
    <div class="demo">
      <div class="languages" role="radiogroup" aria-label="Language of the announcements">
        <label v-for="(language, code) in LANGUAGES" :key="code" :class="{ on: lang === code }">
          <input v-model="lang" type="radio" :value="code" />
          {{ language.name }}
        </label>
      </div>
      <div class="layout">
        <Agenda v-model="agenda" />
        <section class="reader" aria-label="Announcements">
          <h4>Announcements</h4>
          <p class="instructions"><span>aria-describedby</span>{{ texts.instructions }}</p>
          <ol class="spoken">
            <li v-for="line in spoken" :key="line.id">{{ line.text }}</li>
            <li v-if="!spoken.length" class="empty">Tab to an item and press Space</li>
          </ol>
        </section>
      </div>
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.languages {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 3px;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

.languages label {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.languages label.on {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
  font-weight: 600;
}

.languages label:has(input:focus-visible) {
  outline: 2px solid #42b883;
}

.languages input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.layout {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 18px;
  width: 100%;
}

.reader {
  box-sizing: border-box;
  width: min(100%, 270px);
  padding: 12px 14px;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  font: 12px/1.5 ui-monospace, Menlo, Consolas, monospace;
}

h4 {
  margin: 0 0 8px;
  font: inherit;
  font-weight: 600;
  opacity: 0.55;
}

.instructions {
  margin: 0 0 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  font-size: 11px;
  opacity: 0.7;
}

.instructions span {
  display: block;
  margin-bottom: 2px;
  font-size: 10px;
  opacity: 0.7;
}

.spoken {
  min-height: 96px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.spoken li + li {
  margin-top: 4px;
  opacity: 0.5;
}

.spoken li:first-child {
  color: #42b883;
}

.spoken li.empty {
  color: inherit;
  opacity: 0.45;
}
</style>
