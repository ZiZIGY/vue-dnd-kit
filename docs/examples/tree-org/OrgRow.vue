<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode, type Key } from '@vue-dnd-kit/core';
import { headcount, type Member } from './org';

const props = defineProps<{ node: FlatNode<Member>; indent: number }>();
const emit = defineEmits<{ toggle: [key: Key] }>();

const el = useTemplateRef<HTMLElement>('el');
// A locked row doesn't drag (and says so with `aria-disabled`).
makeSortableItem(el, { id: () => props.node.key, disabled: () => !!props.node.item.locked });

const member = computed(() => props.node.item);
const initials = computed(() => member.value.name.split(' ').map((word) => word[0]).join(''));
const hue = computed(() => [...member.value.id].reduce((sum, char) => sum + char.charCodeAt(0), 0) * 47 % 360);
</script>

<template>
  <!-- Indented by its margin: the row itself moves with its depth, so the overlay lands on
       its level and a depth change slides. -->
  <div ref="el" class="member" :class="[member.kind, { locked: member.locked }]" :style="{ marginInlineStart: `${node.depth * indent}px` }">
    <template v-if="member.kind === 'team'">
      <button
        type="button"
        class="toggle"
        :class="{ open: !node.collapsed }"
        :aria-expanded="!node.collapsed"
        :aria-label="`${node.collapsed ? 'Expand' : 'Collapse'} ${member.name}`"
        @click="emit('toggle', node.key)"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>
      </button>
      <span class="name">{{ member.name }}</span>
      <svg v-if="member.locked" class="lock" viewBox="0 0 16 16" aria-label="Locked">
        <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
        <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
      </svg>
      <span class="count">{{ headcount(member) }}</span>
    </template>
    <template v-else>
      <span class="avatar" :style="{ background: `hsl(${hue} 45% 45%)` }">{{ initials }}</span>
      <span class="name">{{ member.name }}</span>
      <span class="role">{{ member.role }}</span>
    </template>
  </div>
</template>

<style scoped>
.member {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 10px 0 8px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.member:hover {
  background: color-mix(in srgb, currentColor 8%, Canvas);
}

.member:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.member.locked {
  cursor: default;
}

.team .name {
  font-weight: 650;
}

/* The slot, indented to the level the member will land at. */
.member[data-dnd-placeholder] {
  opacity: 1;
}

.member[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 2px 2px 2px 4px;
  border: 1.5px dashed #42b883;
  border-radius: 8px;
  background: color-mix(in srgb, #42b883 10%, Canvas);
}

.toggle {
  display: grid;
  flex: none;
  place-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: none;
  color: inherit;
  cursor: pointer;
}

.toggle:hover {
  background: color-mix(in srgb, currentColor 10%, transparent);
}

.toggle svg {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: rotate 0.15s;
}

.toggle.open svg {
  rotate: 90deg;
}

.avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}

.name {
  white-space: nowrap;
}

.role {
  overflow: hidden;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.55;
}

.lock {
  width: 13px;
  height: 13px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  opacity: 0.6;
}

.count {
  margin-left: auto;
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 9%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
}
</style>
