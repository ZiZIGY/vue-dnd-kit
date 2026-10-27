<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
import OrgRow from './OrgRow.vue';
import { createOrg, type Member } from './org';

const org = ref<Member[]>(createOrg());
const collapsed = ref(new Set<Key>());

const INDENT = 22;
const root = useTemplateRef<HTMLElement>('root');
const { items } = makeSortableTree(root, {
  items: org,
  // This tree keeps its children in `members`.
  getChildren: (member) => member.members,
  setChildren: (member, members) => {
    member.members = members;
  },
  indentation: INDENT,
  // Only teams take members, and a locked team takes no one.
  canNest: (_member, team) => team.kind === 'team' && !team.locked,
  // Teams in teams, but no deeper than that: a team with members can't go below the top.
  maxDepth: 2,
  collapsed,
  // Rows a team shows or hides as it opens or closes slide in and out.
  animate: true,
});

const toggle = (key: Key) => (collapsed.value.has(key) ? collapsed.value.delete(key) : collapsed.value.add(key));
</script>

<template>
  <section class="org">
    <header>
      <span>Acme · Org chart</span>
      <span class="rules">maxDepth 2 · teams only</span>
    </header>
    <div ref="root" class="members">
      <OrgRow v-for="node in items" :key="node.key" :node="node" :indent="INDENT" @toggle="toggle" />
    </div>
  </section>
</template>

<style scoped>
.org {
  width: min(100%, 360px);
  margin: 0 auto;
  padding: 8px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 10px 12px;
  font-size: 14px;
  font-weight: 700;
}

.rules {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  font-weight: 400;
  opacity: 0.5;
}

.members {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
