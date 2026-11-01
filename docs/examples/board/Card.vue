<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue';
import { makeSortableItem, useDnD } from '@vue-dnd-kit/core';
import Avatar from './Avatar.vue';
import Icon from './Icon.vue';
import PriorityIcon from './PriorityIcon.vue';
import { BOARD, PRIORITIES, dueOf, label, person, type Card } from './store';

const props = defineProps<{ card: Card; done: boolean }>();
const board = inject(BOARD)!;
const { status } = useDnD();

const el = useTemplateRef<HTMLElement>('el');
// `type`: what the trash takes. `selected` is bound to the provider's selection: drag a
// selected card and every selected card comes along.
const { selected } = makeSortableItem(el, { item: () => props.card, type: 'card' });

// A click opens the card: the click that ends a drag never gets here.
const onClick = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
  else board.opened.value = props.card.id;
};
// Space picks the card up (the provider's keys); Enter opens it and X selects it.
const onKeydown = (event: KeyboardEvent) => {
  if (status.value !== 'idle' || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.key === 'Enter') board.opened.value = props.card.id;
  else if (event.key.toLowerCase() === 'x') selected.value = !selected.value;
};

const due = computed(() => props.card.due && dueOf(props.card.due));
const completed = computed(() => board.completed.value.has(props.card.id));
/** What a screen reader says for the card: the gist, not every chip. */
const summary = computed(() =>
  [
    `${props.card.id}: ${props.card.title}`,
    PRIORITIES[props.card.priority],
    due.value && due.value.hint,
    ...props.card.people.map((id) => person(id).name),
    selected.value && 'selected',
  ]
    .filter(Boolean)
    .join(', '),
);
</script>

<template>
  <li
    ref="el"
    class="card"
    :data-card="card.id"
    :class="{ selected, open: board.opened.value === card.id, completed }"
    :aria-label="summary"
    @click="onClick"
    @keydown="onKeydown"
  >
    <div v-if="card.cover" class="cover" :class="card.cover" />
    <div class="head">
      <!-- The selection mark stays behind: the copy in the overlay is a card, not a choice. -->
      <span v-if="selected" class="check" data-dnd-no-clone><Icon name="check" /></span>
      <span v-if="done" class="tick">
        <Icon name="check" />
        <!-- Just moved to Done: the check pops and a few sparks fly. -->
        <span v-if="completed" class="sparks" aria-hidden="true">
          <i v-for="spark in 8" :key="spark" :style="{ '--turn': `${spark * 45}deg` }" />
        </span>
      </span>
      <span class="id">{{ card.id }}</span>
      <span class="people">
        <Avatar v-for="id in card.people" :id="id" :key="id" />
      </span>
    </div>
    <p class="title">{{ card.title }}</p>
    <div class="meta">
      <span class="chip level"><PriorityIcon :level="card.priority" /></span>
      <span v-for="id in card.labels" :key="id" class="chip tag" :style="{ '--tint': label(id).color }">{{ label(id).name }}</span>
      <span v-if="due" class="chip due" :class="due.tone" :title="due.hint"><Icon name="calendar" />{{ due.text }}</span>
      <span class="counts">
        <span v-if="card.comments" title="Comments"><Icon name="comment" />{{ card.comments }}</span>
        <span v-if="card.files" title="Attachments"><Icon name="file" />{{ card.files }}</span>
      </span>
    </div>
  </li>
</template>

<style scoped>
.card {
  /* The card's own surface, read by the avatars' ring too. */
  --surface: light-dark(#fff, #1c1c20);
  --ring: var(--surface);
  --edge: light-dark(rgb(15 15 20 / 0.08), rgb(255 255 255 / 0.07));
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 11px 9px;
  border-radius: 10px;
  background: var(--surface);
  box-shadow:
    0 0 0 1px var(--edge),
    0 1px 2px light-dark(rgb(15 15 20 / 0.06), rgb(0 0 0 / 0.3));
  font-size: 13px;
  cursor: grab;
  user-select: none;
  transition:
    box-shadow 0.15s,
    background-color 0.15s;
}

.card:hover {
  --edge: light-dark(rgb(15 15 20 / 0.16), rgb(255 255 255 / 0.14));
  box-shadow:
    0 0 0 1px var(--edge),
    0 6px 14px -8px rgb(0 0 0 / 0.35);
}

.card:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.card.open {
  --edge: #42b883;
}

.card.selected {
  --surface: light-dark(color-mix(in srgb, #42b883 7%, #fff), color-mix(in srgb, #42b883 9%, #1c1c20));
  box-shadow:
    0 0 0 1.5px #42b883,
    0 0 0 4px color-mix(in srgb, #42b883 18%, transparent);
}

/* The slot a dragged card will land in: an empty, dashed box, green over a column that takes it. */
.card[data-dnd-placeholder] {
  opacity: 1;
  background: none;
  box-shadow: none;
}

.card[data-dnd-placeholder] > * {
  visibility: hidden;
}

.card[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1.5px dashed color-mix(in srgb, var(--slot, currentColor) 45%, transparent);
  border-radius: inherit;
  background: color-mix(in srgb, var(--slot, currentColor) 7%, transparent);
}

.cover {
  height: 52px;
  margin: -10px -11px 0;
  border-radius: 10px 10px 0 0;
}

.cover.aurora {
  background:
    radial-gradient(120% 160% at 0% 0%, #42b883, transparent 60%),
    radial-gradient(90% 140% at 100% 100%, #818cf8, transparent 65%),
    linear-gradient(135deg, #0f766e, #312e81);
}

.cover.blueprint {
  background:
    linear-gradient(rgb(255 255 255 / 0.14) 1px, transparent 1px) 0 0 / 12px 12px,
    linear-gradient(90deg, rgb(255 255 255 / 0.14) 1px, transparent 1px) 0 0 / 12px 12px,
    linear-gradient(135deg, #1d4ed8, #0ea5e9);
}

.cover.dusk {
  background: linear-gradient(160deg, #fb923c, #db2777 55%, #7c3aed);
}

.head {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 20px;
}

.id {
  font: 500 11px/1 'Geist Mono', ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.02em;
  opacity: 0.5;
}

.check,
.tick {
  position: relative;
  display: grid;
  place-items: center;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  font-size: 11px;
}

.check {
  background: #42b883;
  color: #fff;
}

.tick {
  color: #42b883;
  box-shadow: inset 0 0 0 1.5px #42b883;
}

.people {
  display: flex;
  margin-left: auto;
}

.people > * + * {
  margin-left: -5px;
}

.title {
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.005em;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 20px;
  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 13%, transparent);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.chip.level {
  padding: 0 3px;
}

.tag::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--tint);
}

.due {
  opacity: 0.8;
}

.due.soon {
  color: light-dark(#b45309, #fbbf24);
  opacity: 1;
}

.due.overdue {
  background: color-mix(in srgb, #f43f5e 12%, transparent);
  box-shadow: none;
  color: light-dark(#be123c, #fb7185);
  opacity: 1;
}

.counts {
  display: flex;
  gap: 8px;
  margin-left: auto;
  font-size: 11px;
  opacity: 0.55;
}

.counts > span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

/* The copy in the overlay: lifted off the board, never shown as selected. */
[data-dnd-overlay] .card {
  --surface: light-dark(#fff, #1f1f24);
  --edge: light-dark(rgb(15 15 20 / 0.1), rgb(255 255 255 / 0.1));
  box-shadow:
    0 0 0 1px var(--edge),
    0 18px 36px -14px rgb(0 0 0 / 0.5);
  cursor: grabbing;
}

.sparks {
  position: absolute;
  top: 50%;
  left: 50%;
}

.sparks i {
  position: absolute;
  width: 4px;
  height: 4px;
  margin: -2px;
  border-radius: 50%;
  background: #42b883;
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .completed {
    animation: glow 1.2s ease-out;
  }

  .completed .tick {
    animation: pop 0.5s cubic-bezier(0.34, 1.6, 0.64, 1);
  }

  .sparks i {
    animation: spark 0.7s cubic-bezier(0.2, 0.7, 0.3, 1) 0.1s;
  }
}

/* With reduced motion, Done's check simply fills in. */
.completed .tick {
  background: #42b883;
  color: #fff;
}

@keyframes glow {
  from {
    box-shadow:
      0 0 0 1.5px #42b883,
      0 0 0 6px color-mix(in srgb, #42b883 30%, transparent);
  }
}

@keyframes pop {
  from {
    scale: 0.2;
  }
}

@keyframes spark {
  from {
    opacity: 1;
    transform: rotate(var(--turn)) translateY(0);
  }

  to {
    opacity: 0;
    transform: rotate(var(--turn)) translateY(-22px) scale(0.4);
  }
}
</style>
