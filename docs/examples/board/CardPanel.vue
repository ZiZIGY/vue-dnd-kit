<script setup lang="ts">
import { computed, inject, onMounted, useTemplateRef } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import Avatar from './Avatar.vue';
import Icon from './Icon.vue';
import PriorityIcon from './PriorityIcon.vue';
import StatusIcon from './StatusIcon.vue';
import { BOARD, LABELS, PEOPLE, PRIORITIES, dueOf, useMove, type Priority } from './store';

// The card opened by a click: everything about it, and changes that need no drag.
const emit = defineEmits<{ close: [] }>();
const board = inject(BOARD)!;
const { selection } = useDnD();
const move = useMove();

// The card the panel opened for (Board.vue makes a new panel for each). It edits that
// card in place, and keeps it while it slides away, deleted or not.
const card = board.openedCard.value!;
const column = computed(() => board.find(card.id)?.column);
const due = computed(() => card.due && dueOf(card.due));
// A selected card brings the selection along, as it does when you drag it.
const moving = computed(() => (selection.has(card.id) ? [...selection.ids] : [card.id]));

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((each) => each !== id) : [...list, id]);
const remove = () => {
  board.remove([card.id]);
  selection.delete(card.id);
};

const heading = useTemplateRef<HTMLElement>('heading');
onMounted(() => heading.value?.focus());
</script>

<template>
  <aside class="panel" role="dialog" :aria-label="`${card.id}: ${card.title}`">
    <header class="bar">
      <StatusIcon v-if="column" :color="column.color" :progress="column.progress" />
      <span ref="heading" class="where" tabindex="-1">{{ column?.title }} <span class="id">· {{ card.id }}</span></span>
      <button type="button" class="icon-button danger" aria-label="Delete the card" title="Delete" @click="remove">
        <Icon name="trash" />
      </button>
      <button type="button" class="icon-button" aria-label="Close" title="Close (Esc)" @click="emit('close')">
        <Icon name="close" />
      </button>
    </header>

    <div class="sheet">
      <textarea v-model="card.title" class="title" rows="1" aria-label="Title" />

      <dl class="fields">
        <dt>Status</dt>
        <dd class="choices">
          <!-- Real drags played by code: the column's limit and the Done question apply. -->
          <button
            v-for="target in board.columns.value"
            :key="target.id"
            type="button"
            class="choice"
            :aria-pressed="target.id === column?.id"
            :disabled="target.id === column?.id"
            @click="move(moving, target)"
          >
            <StatusIcon :color="target.color" :progress="target.progress" />
            {{ target.title }}
          </button>
        </dd>

        <dt>Priority</dt>
        <dd class="choices">
          <button
            v-for="(name, level) in PRIORITIES"
            :key="name"
            type="button"
            class="choice compact"
            :title="name"
            :aria-label="name"
            :aria-pressed="card.priority === level"
            @click="card.priority = level as Priority"
          >
            <PriorityIcon :level="level as Priority" />
          </button>
        </dd>

        <dt>People</dt>
        <dd class="choices">
          <button
            v-for="person in PEOPLE"
            :key="person.id"
            type="button"
            class="choice"
            :aria-pressed="card.people.includes(person.id)"
            @click="card.people = toggle(card.people, person.id)"
          >
            <Avatar :id="person.id" />
            {{ person.name }}
          </button>
        </dd>

        <dt>Labels</dt>
        <dd class="choices">
          <button
            v-for="tag in LABELS"
            :key="tag.id"
            type="button"
            class="choice"
            :style="{ '--tint': tag.color }"
            :aria-pressed="card.labels.includes(tag.id)"
            @click="card.labels = toggle(card.labels, tag.id)"
          >
            <span class="dot" />
            {{ tag.name }}
          </button>
        </dd>

        <dt>Due</dt>
        <dd>
          <span v-if="due" class="due" :class="due.tone"><Icon name="calendar" />{{ due.text }} · {{ due.hint }}</span>
          <span v-else class="muted">No due date</span>
        </dd>
      </dl>

      <textarea v-model="card.description" class="description" rows="4" placeholder="Add a description…" aria-label="Description" />

      <p class="activity">
        <span><Icon name="comment" />{{ card.comments }} comments</span>
        <span><Icon name="file" />{{ card.files }} attachments</span>
      </p>
    </div>
  </aside>
</template>

<style scoped>
.panel {
  --ring: light-dark(#fff, #18181b);
  position: absolute;
  top: 8px;
  right: 8px;
  bottom: 8px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  width: min(380px, calc(100% - 16px));
  border-radius: 14px;
  background: var(--ring);
  box-shadow:
    0 0 0 1px light-dark(rgb(15 15 20 / 0.08), rgb(255 255 255 / 0.08)),
    0 30px 60px -20px rgb(0 0 0 / 0.5);
}

.bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px 10px 16px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.where {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  outline: none;
}

.id {
  font: 500 11px/1 'Geist Mono', ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.icon-button {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font-size: 16px;
  opacity: 0.65;
  cursor: pointer;
}

.icon-button:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
  opacity: 1;
}

.icon-button.danger:hover {
  background: color-mix(in srgb, #f43f5e 14%, transparent);
  color: #f43f5e;
}

.sheet {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 18px;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
}

/* The sheet scrolls; its parts keep their height. */
.sheet > * {
  flex: none;
}

textarea {
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 6px 8px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: inherit;
  resize: none;
  field-sizing: content;
}

textarea:hover {
  background: color-mix(in srgb, currentColor 4%, transparent);
}

textarea:focus-visible {
  background: color-mix(in srgb, currentColor 4%, transparent);
  outline: 2px solid #42b883;
}

.title {
  margin: 0 -8px;
  width: calc(100% + 16px);
  font-size: 18px;
  font-weight: 650;
  line-height: 1.3;
  letter-spacing: -0.015em;
}

.description {
  min-height: 84px;
  margin: 0 -8px;
  width: calc(100% + 16px);
  font-size: 13px;
  line-height: 1.55;
}

.description::placeholder {
  color: inherit;
  opacity: 0.45;
}

.fields {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 12px 10px;
  align-items: start;
  margin: 0;
}

dt {
  padding-top: 6px;
  font-size: 12px;
  opacity: 0.55;
}

dd {
  margin: 0;
  font-size: 12px;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.choice {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 8px 0 6px;
  border: 0;
  border-radius: 7px;
  background: none;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  color: inherit;
  font: 500 12px/1 system-ui, sans-serif;
  opacity: 0.7;
  cursor: pointer;
  transition:
    background-color 0.15s,
    opacity 0.15s;
}

.choice.compact {
  width: 26px;
  justify-content: center;
  padding: 0;
}

.choice:hover:not(:disabled) {
  background: color-mix(in srgb, currentColor 6%, transparent);
  opacity: 1;
}

.choice[aria-pressed='true'] {
  background: color-mix(in srgb, #42b883 12%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #42b883 60%, transparent);
  opacity: 1;
  cursor: default;
}

.choice:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

.choice .avatar {
  width: 16px;
  height: 16px;
  box-shadow: none;
  font-size: 9px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--tint);
}

.due {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-top: 6px;
}

.due.soon {
  color: light-dark(#b45309, #fbbf24);
}

.due.overdue {
  color: light-dark(#be123c, #fb7185);
}

.muted {
  display: inline-block;
  padding-top: 6px;
  opacity: 0.5;
}

.activity {
  display: flex;
  gap: 16px;
  margin: auto 0 0;
  padding-top: 14px;
  border-top: 1px solid color-mix(in srgb, currentColor 8%, transparent);
  font-size: 12px;
  opacity: 0.55;
}

.activity span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
