<script setup lang="ts">
import { inject } from 'vue';
import Avatar from './Avatar.vue';
import Icon from './Icon.vue';
import { BOARD, PEOPLE } from './store';

// Search and people: the columns show only the cards that match, and drags go on working.
const board = inject(BOARD)!;
const { query, people } = board;

const toggle = (id: string) => {
  people.value = people.value.includes(id) ? people.value.filter((each) => each !== id) : [...people.value, id];
};
// Escape clears the search first; the frame around the demo keeps it then.
const onEscape = (event: KeyboardEvent) => {
  if (!query.value) return;
  event.preventDefault();
  query.value = '';
};
</script>

<template>
  <div class="filters">
    <label class="search">
      <Icon name="search" />
      <input v-model="query" type="search" placeholder="Filter cards" aria-label="Filter cards" @keydown.esc="onEscape" />
    </label>
    <div class="people" role="group" aria-label="Show the cards of">
      <button
        v-for="person in PEOPLE"
        :key="person.id"
        type="button"
        class="person"
        :class="{ dimmed: people.length && !people.includes(person.id) }"
        :aria-pressed="people.includes(person.id)"
        :aria-label="person.name"
        @click="toggle(person.id)"
      >
        <Avatar :id="person.id" />
      </button>
    </div>
    <button v-if="board.filtering.value" type="button" class="reset" @click="board.clearFilters">Clear</button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

/* On a narrow board, a row of their own under the sprint and the trash (Board.vue). */
@container board (max-width: 600px) {
  .filters {
    order: 1;
    flex-basis: 100%;
  }

  .search {
    flex: 1;
  }
}

.search {
  display: flex;
  flex: 0 1 220px;
  align-items: center;
  gap: 7px;
  min-width: 0;
  height: 32px;
  padding: 0 10px;
  box-sizing: border-box;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 6%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 8%, transparent);
  font-size: 14px;
  transition: box-shadow 0.15s;
}

.search:focus-within {
  box-shadow:
    inset 0 0 0 1px #42b883,
    0 0 0 3px color-mix(in srgb, #42b883 20%, transparent);
}

.search > .icon {
  opacity: 0.5;
}

input {
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: none;
  background: none;
  color: inherit;
  font: 500 13px/1 system-ui, sans-serif;
}

input::placeholder {
  color: inherit;
  opacity: 0.5;
}

.people {
  display: flex;
  padding-left: 4px;
}

.person {
  --ring: var(--surface);
  margin-left: -4px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: none;
  cursor: pointer;
  transition:
    opacity 0.15s,
    translate 0.15s;
}

.person:hover {
  z-index: 1;
  translate: 0 -2px;
}

.person[aria-pressed='true'] {
  z-index: 1;
  --ring: #42b883;
}

.person.dimmed {
  opacity: 0.4;
}

.person:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.reset {
  padding: 6px 9px;
  border: 0;
  border-radius: 7px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  color: inherit;
  font: 600 12px/1 system-ui, sans-serif;
  cursor: pointer;
}

.reset:focus-visible {
  outline: 2px solid #42b883;
}

@media (prefers-reduced-motion: reduce) {
  .person:hover {
    translate: none;
  }
}
</style>
