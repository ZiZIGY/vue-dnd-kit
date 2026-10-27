<script setup lang="ts">
import { reactive } from 'vue';
import { DnDProvider, type SortablePutContext } from '@vue-dnd-kit/core';
import RuleList from './RuleList.vue';

// Four lists of one group, `files`. What each gives and takes is its `group.pull` and `group.put`.
const shortlist = reactive({
  id: 'shortlist',
  title: 'Shortlist',
  code: 'put: ({ keys }) => shortlist.files.length + keys.length <= 3',
  refusal: 'full',
  group: { name: 'files', put: ({ keys }: SortablePutContext) => shortlist.files.length + keys.length <= 3 },
  files: [
    { id: 'pitch', name: 'pitch.pdf', kind: 'doc' as const },
    { id: 'mock', name: 'mockup.png', kind: 'image' as const },
  ],
});

const lists = reactive([
  {
    id: 'inbox',
    title: 'Inbox',
    code: '{ pull: true, put: false }',
    refusal: 'put: false',
    group: { name: 'files', pull: true, put: false },
    files: [
      { id: 'logo', name: 'logo.svg', kind: 'image' as const },
      { id: 'brief', name: 'brief.pdf', kind: 'doc' as const },
      { id: 'hero', name: 'hero.png', kind: 'image' as const },
    ],
  },
  {
    id: 'templates',
    title: 'Templates',
    code: "{ pull: 'clone', put: false }, sort: false",
    refusal: 'put: false',
    group: { name: 'files', pull: 'clone' as const, put: false },
    sort: false,
    files: [
      { id: 'invoice', name: 'invoice.doc', kind: 'doc' as const },
      { id: 'banner', name: 'banner.png', kind: 'image' as const },
    ],
  },
  {
    id: 'images',
    title: 'Images',
    code: "put: ({ types }) => types.every((type) => type === 'image')",
    refusal: 'images only',
    group: { name: 'files', put: ({ types }: SortablePutContext) => types.every((type) => type === 'image') },
    files: [],
  },
  shortlist,
]);
</script>

<template>
  <DnDProvider>
    <div class="rules">
      <RuleList v-for="list in lists" :key="list.id" :list="list" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.rules {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 260px));
  gap: 12px;
  justify-content: center;
}

@media (max-width: 480px) {
  .rules {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
