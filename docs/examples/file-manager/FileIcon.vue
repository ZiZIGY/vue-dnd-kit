<script setup lang="ts">
import { computed } from 'vue';
import { KINDS, TRASH, extension, kindOf, type Entry } from './files';

/**
 * A folder (it opens while something it takes is held over it, and gulps each time it
 * takes something), a photo's thumbnail, or a page with a badge of its kind. Fills its box.
 */
const props = defineProps<{ entry: Entry; open?: boolean; gulps?: number }>();

const kind = computed(() => kindOf(props.entry));
const badge = computed(() => extension(props.entry.name).slice(0, 4).toUpperCase() || 'FILE');
// A photo without a real thumbnail gets a landscape of its own, coloured by its name.
const hue = computed(() => ([...props.entry.name].reduce((sum, char) => sum + char.charCodeAt(0), 0) * 47) % 360);
</script>

<template>
  <span class="icon">
    <svg v-if="entry.id === TRASH" :key="gulps" class="art" :class="{ gulp: gulps }" viewBox="0 0 48 48" aria-hidden="true">
      <path class="can" d="M11 15h26l-2.2 25.2a3 3 0 0 1-3 2.8H16.2a3 3 0 0 1-3-2.8z" />
      <path class="ribs" d="M19 20v17M24 20v17M29 20v17" />
      <rect class="lid" x="8" y="10" width="32" height="5" rx="2.5" />
    </svg>

    <svg v-else-if="kind === 'folder'" :key="gulps" class="art" :class="{ open, gulp: gulps }" viewBox="0 0 48 48" aria-hidden="true">
      <path class="back" d="M4 11a3 3 0 0 1 3-3h10.6a3 3 0 0 1 2.1.9L22.8 12H41a3 3 0 0 1 3 3v22a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
      <path class="paper" d="M8 14h32v20H8z" />
      <path class="front" d="M4 18a3 3 0 0 1 3-3h34a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
    </svg>

    <span v-else-if="kind === 'image'" class="photo" :style="{ '--hue': hue }">
      <img v-if="entry.kind === 'file' && entry.url" :src="entry.url" alt="" draggable="false" />
      <svg v-else viewBox="0 0 40 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="29" cy="9" r="4" fill="rgb(255 255 255 / 0.8)" />
        <path d="M0 30V20l10-8 8 6 9-8 13 11v9z" fill="rgb(0 0 0 / 0.25)" />
        <path d="M0 30v-4l12-6 10 5 8-3 10 5v3z" fill="rgb(0 0 0 / 0.2)" />
      </svg>
    </span>

    <svg v-else class="art" viewBox="0 0 48 48" aria-hidden="true">
      <path class="page" d="M12 4h17l9 9v29a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path class="page" d="M29 4v7a2 2 0 0 0 2 2h7" />
      <path v-if="kind === 'spreadsheet'" class="mark" d="M15 16h18v10H15zM15 21h18M21 16v10M27 16v10" />
      <path v-else-if="kind === 'audio'" class="mark" d="M22 25V15l7-2v10M22 25a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM29 23a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
      <path v-else-if="kind === 'video'" class="mark filled" d="M20 14.5v10l8.5-5z" />
      <path v-else-if="kind === 'archive'" class="mark" d="M24 4v3M24 10v3M24 16v3M22 22h4v4h-4z" />
      <path v-else class="mark" d="M15 16h9M15 20h16M15 24h12" />
      <rect x="6" y="29" width="28" height="11" rx="3" :fill="KINDS[kind].color" />
      <text x="20" y="37.1" text-anchor="middle">{{ badge }}</text>
    </svg>
  </span>
</template>

<style scoped>
.icon {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}

.art {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Folders: a darker back, a sheet that shows when it opens, a front flap that tips forward. */
.back {
  fill: #4a8fe7;
}

.paper {
  fill: #fff;
  opacity: 0;
  transition: opacity 0.15s;
}

.front {
  fill: #74b2ff;
  stroke: rgb(255 255 255 / 0.35);
  stroke-width: 0.6;
  transform-box: fill-box;
  transform-origin: 50% 100%;
  transition: transform 0.22s cubic-bezier(0.3, 1.4, 0.5, 1);
}

.open .front {
  transform: perspective(60px) rotateX(-26deg);
}

.open .paper {
  opacity: 0.95;
}

.can {
  fill: color-mix(in srgb, currentColor 14%, Canvas);
  stroke: color-mix(in srgb, currentColor 40%, transparent);
  stroke-width: 1.4;
}

.ribs {
  stroke: color-mix(in srgb, currentColor 30%, transparent);
  stroke-width: 1.4;
  stroke-linecap: round;
}

.lid {
  fill: color-mix(in srgb, currentColor 45%, Canvas);
}

/* It took something: a gulp. */
.gulp {
  animation: gulp 0.42s cubic-bezier(0.3, 1.6, 0.5, 1);
}

@keyframes gulp {
  40% {
    scale: 1.14;
  }
}

/* Pages: paper that follows the theme, a mark of the kind, a coloured badge. */
.page {
  fill: color-mix(in srgb, currentColor 3%, Canvas);
  stroke: color-mix(in srgb, currentColor 28%, transparent);
  stroke-width: 1.2;
  stroke-linejoin: round;
}

.mark {
  fill: none;
  stroke: color-mix(in srgb, currentColor 26%, transparent);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mark.filled {
  fill: color-mix(in srgb, currentColor 26%, transparent);
}

text {
  fill: #fff;
  font: 700 6.6px system-ui, sans-serif;
  letter-spacing: 0.03em;
}

/* A photo shows itself: a 4:3 print with a white border. */
.photo {
  overflow: hidden;
  width: 92%;
  aspect-ratio: 4 / 3;
  box-sizing: border-box;
  border: max(1.5px, 0.06em) solid #fff;
  border-radius: 4px;
  background: linear-gradient(170deg, hsl(var(--hue) 80% 74%), hsl(calc(var(--hue) + 40) 60% 42%));
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.3);
}

.photo img,
.photo svg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (prefers-reduced-motion: reduce) {
  .front,
  .paper {
    transition: none;
  }

  .gulp {
    animation: none;
  }
}
</style>
