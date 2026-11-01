<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import CoverQuestion from './CoverQuestion.vue';
import PostList from './PostList.vue';
import type { Choice, Post } from './posts';

const drafts = ref<Post[]>([
  { id: 'p1', title: 'Spring launch recap', cover: 28 },
  { id: 'p2', title: 'Hiring a designer', cover: null },
  { id: 'p3', title: 'Our new office', cover: 200 },
  { id: 'p4', title: 'Roadmap for Q3', cover: null },
  { id: 'p5', title: 'Five tips for focus', cover: 140 },
]);
const scheduled = ref<Post[]>([{ id: 'p6', title: 'Welcome to the blog', cover: 280 }]);

// Three drafts picked to start with, one of them without a cover.
const { selection } = useDnD();
selection.set(['p1', 'p2', 'p3']);

// The open question, and how to answer the drop waiting for it.
const question = shallowRef<{ missing: Post[]; ready: number; answer: (choice: Choice) => void } | null>(null);

const ask = (missing: Post[], ready: number) =>
  new Promise<Choice>((resolve) => {
    question.value = {
      missing,
      ready,
      answer: (choice) => {
        question.value = null;
        resolve(choice);
      },
    };
  });
</script>

<template>
  <div class="blog">
    <div class="lists">
      <PostList id="drafts" v-model:posts="drafts" title="Drafts" />
      <PostList id="scheduled" v-model:posts="scheduled" title="Scheduled" :ask="ask" />
    </div>
    <!-- Always as tall: the question takes the hint's place without moving the lists. -->
    <div class="bar">
      <CoverQuestion v-if="question" :missing="question.missing" :ready="question.ready" @answer="question.answer" />
      <p v-else class="hint">Ctrl/Cmd-click to pick posts. Scheduled asks about posts without a cover.</p>
    </div>
  </div>
</template>

<style scoped>
.blog {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

.lists {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.bar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 84px;
}

.hint {
  margin: 0;
  font-size: 12px;
  text-align: center;
  opacity: 0.6;
}
</style>
