<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from 'vue';
import type { Choice, Post } from './posts';

const props = defineProps<{ missing: Post[]; ready: number }>();
const emit = defineEmits<{ answer: [choice: Choice] }>();

const first = useTemplateRef<HTMLButtonElement>('first');
onMounted(() => first.value?.focus());

const which = computed(() =>
  props.missing.length === 1 ? `“${props.missing[0]!.title}” has` : `${props.missing.length} posts have`,
);
</script>

<template>
  <!-- Not modal: the posts, and the overlay waiting where it was let go, stay in sight. -->
  <div class="question" role="alertdialog" aria-labelledby="cover-question" @keydown.esc="emit('answer', 'cancel')">
    <p id="cover-question" class="text">{{ which }} no cover yet.</p>
    <div class="actions">
      <button ref="first" type="button" class="primary" @click="emit('answer', 'cover')">
        Add a cover, schedule all {{ missing.length + ready }}
      </button>
      <button v-if="ready" type="button" @click="emit('answer', 'ready')">Schedule the {{ ready }} ready</button>
      <button type="button" @click="emit('answer', 'cancel')">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.question {
  padding: 10px 12px;
  border: 1px solid color-mix(in srgb, #f59e0b 55%, transparent);
  border-radius: 12px;
  background: Canvas;
}

.text {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

button {
  padding: 6px 10px;
  border: 0;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  color: inherit;
  font: 600 12px/1.2 system-ui, sans-serif;
  cursor: pointer;
}

button.primary {
  background: #42b883;
  color: #fff;
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}
</style>
