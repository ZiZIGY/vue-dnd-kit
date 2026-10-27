<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import PostCard from './PostCard.vue';

type Post = { id: string; title: string; cover: number | null };
const props = defineProps<{ id: string; title: string; needsCover?: boolean }>();
const posts = defineModel<Post[]>('posts', { required: true });
const notice = ref('');

const list = useTemplateRef<HTMLElement>('list');
const { items, isOver } = makeSortableList(list, {
  id: props.id,
  items: posts,
  group: 'blog',
  // Scheduled takes only the posts that have a cover: the keys returned are the ones
  // accepted, and the others fly back where they came from.
  onBeforeDrop: (event) => {
    if (!props.needsCover || event.sameList) return true;
    const ready = event.keys.filter((_, index) => event.items[index]!.cover !== null);
    const missing = event.keys.length - ready.length;
    notice.value = `${ready.length} scheduled` + (missing ? ` · ${missing} without a cover` : '');
    return ready;
  },
});
</script>

<template>
  <section class="column" :class="{ over: isOver }">
    <h3>
      {{ title }}
      <small v-if="needsCover">with a cover</small>
      <span class="count">{{ posts.length }}</span>
    </h3>
    <ul ref="list" class="posts">
      <PostCard v-for="post in items" :key="post.id" :post="post" />
    </ul>
    <p v-if="notice" class="notice">{{ notice }}</p>
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

.notice {
  margin: 10px 4px 0;
  font-size: 12px;
  color: #42b883;
}
</style>
