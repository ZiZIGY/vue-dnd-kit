<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import PostCard from './PostCard.vue';
import { pickCover, type Choice, type Post } from './posts';

const props = defineProps<{
  id: string;
  title: string;
  /** Asks what to do with posts without a cover; only lists that need one ask. */
  ask?: (missing: Post[], ready: number) => Promise<Choice>;
}>();
const posts = defineModel<Post[]>('posts', { required: true });

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.id,
  items: posts,
  group: 'blog',
  // A scheduled post needs a cover. Dropped with posts that have none, the list asks what
  // to do, and the drop waits for the answer: every post (covers added), the ready ones
  // (the keys returned; the others fly back), or none.
  onBeforeDrop: async (event) => {
    const missing = event.items.filter((post) => post.cover === null);
    if (!props.ask || event.sameList || !missing.length) return true;
    const choice = await props.ask(missing, event.items.length - missing.length);
    if (choice === 'cover') missing.forEach((post) => (post.cover = pickCover()));
    if (choice === 'ready') return event.keys.filter((_, index) => event.items[index]!.cover !== null);
    return choice === 'cover';
  },
});
</script>

<template>
  <section class="column" :class="{ over: isOver }">
    <h3>
      {{ title }}
      <small v-if="ask">with a cover</small>
      <span class="count">{{ posts.length }}</span>
    </h3>
    <ul ref="list" class="posts">
      <PostCard v-for="post in items" :key="post.id" :post="post" />
    </ul>
  </section>
</template>

<style scoped>
.column {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  transition: border-color 0.2s;
}

.column.over {
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}

h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 2px 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

small {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.5;
}

.count {
  margin-left: auto;
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}

.posts {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-height: 60px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
