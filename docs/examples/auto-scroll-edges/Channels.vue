<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeSortableList, useDnD } from '@vue-dnd-kit/core';
import ChannelRow from './ChannelRow.vue';

const props = defineProps<{ threshold: number }>();

const NAMES = [
  'general', 'random', 'design', 'frontend', 'backend', 'releases', 'support', 'docs',
  'hiring', 'growth', 'marketing', 'sales', 'billing', 'infra', 'security', 'mobile',
  'research', 'events', 'feedback', 'standup', 'retro', 'qa', 'data', 'ops',
  'legal', 'finance', 'office', 'music', 'pets', 'lunch',
];
const channels = ref(NAMES.map((name, index) => ({ id: name, name, unread: (index * 7) % 5 })));

const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, { items: channels });

// Draws the edge zones the way the library sizes them: `threshold` of the height,
// between 24 and 96px.
const HEIGHT = 260;
const zone = computed(() => (props.threshold ? Math.min(Math.max(props.threshold * HEIGHT, 24), 96, HEIGHT / 2) : 0));

const { isAutoScrolling } = useDnD();
</script>

<template>
  <section class="sidebar" :class="{ scrolling: isAutoScrolling }">
    <header>
      Channels
      <span class="badge">{{ isAutoScrolling ? 'auto-scrolling' : `${channels.length}` }}</span>
    </header>
    <div class="viewport" :style="{ height: `${HEIGHT}px` }">
      <!-- The scroll container: any element with overflow auto or scroll scrolls by itself. -->
      <ul ref="list" class="channels">
        <ChannelRow v-for="channel in items" :key="channel.id" :channel="channel" />
      </ul>
      <template v-if="zone">
        <span class="zone top" :style="{ height: `${zone}px` }" />
        <span class="zone bottom" :style="{ height: `${zone}px` }" />
      </template>
    </div>
  </section>
</template>

<style scoped>
.sidebar {
  width: min(100%, 280px);
  padding: 6px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition: border-color 0.2s;
}

.sidebar.scrolling {
  border-color: #42b883;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px 10px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.badge {
  padding: 3px 7px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
}

.scrolling .badge {
  background: #42b883;
  color: #fff;
}

.viewport {
  position: relative;
}

.channels {
  display: flex;
  flex-direction: column;
  gap: 2px;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
  overscroll-behavior: contain;
}

/* The edge zones: a drag inside them scrolls the list, faster toward the edge. */
.zone {
  position: absolute;
  right: 0;
  left: 0;
  pointer-events: none;
}

.zone.top {
  top: 0;
  background: linear-gradient(color-mix(in srgb, #42b883 22%, transparent), transparent);
  border-top: 1.5px solid color-mix(in srgb, #42b883 60%, transparent);
}

.zone.bottom {
  bottom: 0;
  background: linear-gradient(transparent, color-mix(in srgb, #42b883 22%, transparent));
  border-bottom: 1.5px solid color-mix(in srgb, #42b883 60%, transparent);
}
</style>
