<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskRow, { type Tag, type Task } from './TaskRow.vue';

const tasks = defineModel<Task[]>({ required: true });

const query = ref('');
const tag = ref<Tag | null>(null);
const TAGS: Tag[] = ['bug', 'feature', 'docs'];

const shows = (task: Task) =>
  (!tag.value || task.tag === tag.value) && task.title.toLowerCase().includes(query.value.trim().toLowerCase());

const list = useTemplateRef<HTMLElement>('list');
// `items` holds the tasks `filter` lets through, and a drag sorts among them. The drop
// writes the whole array: the hidden tasks keep their places around the moved one.
const { items } = makeSortableList(list, { items: tasks, filter: shows, label: 'Backlog', axis: 'y' });
</script>

<template>
  <div class="backlog">
    <section class="panel">
      <div class="toolbar">
        <input v-model="query" class="search" type="search" placeholder="Search tasks" aria-label="Search tasks" />
        <div class="chips" role="group" aria-label="Tag">
          <button type="button" :aria-pressed="!tag" @click="tag = null">All</button>
          <button v-for="name in TAGS" :key="name" type="button" :aria-pressed="tag === name" @click="tag = tag === name ? null : name">
            {{ name }}
          </button>
        </div>
      </div>
      <ul ref="list" class="tasks">
        <TaskRow v-for="task in items" :key="task.id" :task="task" />
      </ul>
      <p v-if="!items.length" class="empty">No task matches.</p>
    </section>

    <!-- The array itself: the drop changes it, hidden tasks included. -->
    <aside class="array" aria-label="The array">
      <h4>The array</h4>
      <ol>
        <li v-for="task in tasks" :key="task.id" :class="{ out: !shows(task) }">
          <span class="dot" :class="task.tag" />
          {{ task.title }}
        </li>
      </ol>
    </aside>
  </div>
</template>

<style scoped>
.backlog {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
}

.panel {
  box-sizing: border-box;
  width: 340px;
  max-width: 100%;
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.search {
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
  border-radius: 8px;
  background: Canvas;
  color: inherit;
  font: inherit;
  font-size: 13px;
}

.search:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

.chips {
  display: flex;
  gap: 6px;
}

.chips button {
  height: 26px;
  padding: 0 10px;
  border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font: 500 12px/1 system-ui, sans-serif;
  text-transform: capitalize;
  cursor: pointer;
}

.chips button[aria-pressed='true'] {
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 16%, transparent);
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 40px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.empty {
  margin: -40px 0 0;
  height: 40px;
  display: grid;
  place-items: center;
  font-size: 13px;
  opacity: 0.5;
}

.array {
  width: 230px;
  max-width: 100%;
}

h4 {
  margin: 6px 4px 10px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

ol {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding-left: 26px;
  font-size: 12px;
}

ol li {
  transition: opacity 0.2s;
}

ol li::marker {
  font-variant-numeric: tabular-nums;
  opacity: 0.5;
}

/* Filtered out: still there, at its place. */
ol li.out {
  opacity: 0.35;
}

.dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 6px;
  border-radius: 50%;
  vertical-align: 1px;
}

.dot.bug {
  background: #ef4444;
}

.dot.feature {
  background: #3b82f6;
}

.dot.docs {
  background: #a855f7;
}
</style>
