<script setup lang="ts">
import { ref } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import PostList from './PostList.vue';

const drafts = ref([
  { id: 'p1', title: 'Spring launch recap', cover: 28 },
  { id: 'p2', title: 'Hiring a designer', cover: null },
  { id: 'p3', title: 'Our new office', cover: 200 },
  { id: 'p4', title: 'Roadmap for Q3', cover: null },
  { id: 'p5', title: 'Five tips for focus', cover: 140 },
]);
const scheduled = ref([{ id: 'p6', title: 'Welcome to the blog', cover: 280 }]);

// Three drafts picked to start with, one of them without a cover.
const { selection } = useDnD();
selection.set(['p1', 'p2', 'p3']);
</script>

<template>
  <div class="blog">
    <PostList id="drafts" v-model:posts="drafts" title="Drafts" />
    <PostList id="scheduled" v-model:posts="scheduled" title="Scheduled" needs-cover />
  </div>
</template>

<style scoped>
.blog {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}
</style>
