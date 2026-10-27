<script setup lang="ts">
import { computed } from 'vue';
import { extension, isFolder, type Entry } from './files';

/** A folder (open while a drop for it is held over it), a photo, or a page tagged with its extension. */
const props = defineProps<{ entry: Entry; open?: boolean }>();

const COLORS: Record<string, string> = {
  pdf: '#ef4444',
  docx: '#3b82f6',
  xlsx: '#16a34a',
  key: '#f97316',
  zip: '#a16207',
  svg: '#f59e0b',
  html: '#a855f7',
  css: '#a855f7',
};

const ext = computed(() => extension(props.entry.name));
const photo = computed(() => ext.value === 'jpg' || ext.value === 'png');
// Every photo gets colours of its own, from its name.
const hue = computed(() => ([...props.entry.name].reduce((sum, char) => sum + char.charCodeAt(0), 0) * 47) % 360);
</script>

<template>
  <span v-if="photo" class="photo" :style="{ '--hue': hue }">
    <svg viewBox="0 0 40 30" aria-hidden="true">
      <circle cx="29" cy="9" r="4" fill="rgb(255 255 255 / 0.75)" />
      <path d="M0 30V21l11-8 9 6 9-7 11 9v9z" fill="rgb(0 0 0 / 0.22)" />
    </svg>
  </span>
  <svg v-else class="icon" viewBox="0 0 48 48" aria-hidden="true">
    <template v-if="isFolder(entry)">
      <path fill="#d99a35" d="M4 11a3 3 0 0 1 3-3h11l4 4h19a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
      <path v-if="open" fill="#f7cd6b" d="M9 19.4A2.5 2.5 0 0 1 11.4 18h31.2a1.5 1.5 0 0 1 1.4 2l-5.2 16.5a2.5 2.5 0 0 1-2.4 1.5H5.4A1.5 1.5 0 0 1 4 36z" />
      <path v-else fill="#f0bb4f" d="M4 18a3 3 0 0 1 3-3h34a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
    </template>
    <template v-else>
      <path class="page" d="M12 4h17l9 9v29a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path class="page" d="M29 4v7a2 2 0 0 0 2 2h7" />
      <path class="lines" d="M15 16h9M15 20h16M15 24h12" />
      <rect x="6" y="28" width="28" height="11" rx="3" :fill="COLORS[ext] ?? '#71717a'" />
      <text x="20" y="36.2" text-anchor="middle">{{ ext.toUpperCase() }}</text>
    </template>
  </svg>
</template>

<style scoped>
.icon {
  flex: none;
  width: 48px;
  height: 48px;
}

.page {
  fill: color-mix(in srgb, currentColor 4%, Canvas);
  stroke: color-mix(in srgb, currentColor 30%, transparent);
  stroke-width: 1.2;
  stroke-linejoin: round;
}

.lines {
  stroke: color-mix(in srgb, currentColor 22%, transparent);
  stroke-width: 1.6;
  stroke-linecap: round;
}

text {
  fill: #fff;
  font: 700 7px system-ui, sans-serif;
  letter-spacing: 0.02em;
}

/* A photo shows itself: a thumbnail with a white border. */
.photo {
  flex: none;
  overflow: hidden;
  width: 44px;
  height: 33px;
  margin: 8px 2px 7px;
  border: 2px solid #fff;
  border-radius: 4px;
  background: linear-gradient(160deg, hsl(var(--hue) 80% 72%), hsl(calc(var(--hue) + 40) 65% 38%));
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.35);
}

.photo svg {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
