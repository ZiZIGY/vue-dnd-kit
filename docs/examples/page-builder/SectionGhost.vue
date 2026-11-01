<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type DnDStatus, type DragItem, type DropDestination } from '@vue-dnd-kit/core';
import SectionView from './SectionView.vue';
import { PAGE, useBuilder } from './builder';
import { typeScale, type Section } from './page';

/**
 * The overlay of sections: one of the page's, or a template of the palette. Over the page,
 * the real section, rendered at the page's width and shrunk under the pointer. On the drop,
 * it grows back to full size while the box flies to its place: it lands exactly on it.
 */
const props = defineProps<{ items: DragItem[]; status: DnDStatus; to: DropDestination | null }>();
const { find, pageWidth } = useBuilder();

const section = computed(() => props.items[0]!.item as Section);
const fromPalette = computed(() => !find(section.value.id));
const onPage = computed(() => props.to?.list === PAGE);

/** `card`: a template away from the page, as the palette shows it. `ghost`: the section in hand. `landing`: full size. */
const look = computed(() => {
  if (fromPalette.value && !onPage.value) return 'card';
  return props.status === 'dropping' ? 'landing' : 'ghost';
});

// About 240px wide on screen, whatever the page's width.
const shrink = computed(() => Math.min(0.6, 240 / Math.max(pageWidth.value, 1)));
</script>

<template>
  <div class="section-ghost">
    <!-- The library's copy of the template's card. -->
    <DragPreview v-if="look === 'card'" :id="items[0]!.id" :style="{ width: '100%', height: '100%' }" />
    <div
      v-else
      class="replica"
      :class="[look, { away: !onPage }]"
      :style="{ ...typeScale(pageWidth), width: `${pageWidth}px`, '--shrink': shrink }"
    >
      <SectionView :section="section" />
    </div>
  </div>
</template>

<style scoped>
.section-ghost {
  position: relative;
  width: 100%;
  height: 100%;
}

/*
 * As wide as the page, so it lays out as it does there, then scaled from its top left
 * corner, where the pointer holds it. The box can be smaller (a template's card): the
 * replica overflows it.
 */
.replica {
  position: absolute;
  top: 0;
  left: 0;
  container: page / inline-size;
  overflow: hidden;
  border-radius: calc(10px / var(--shrink));
  box-shadow:
    0 0 0 calc(1px / var(--shrink)) rgb(15 23 42 / 0.12),
    0 calc(26px / var(--shrink)) calc(50px / var(--shrink)) calc(-18px / var(--shrink)) rgb(0 0 0 / 0.55);
  transform-origin: 0 0;
  scale: var(--shrink);
}

/* Off the page, it fades: a drop there changes nothing. */
.replica.away {
  opacity: 0.55;
}

.replica.landing {
  border-radius: 0;
  box-shadow: none;
  opacity: 1;
  scale: 1;
}

/*
 * The drop waits for this transition. Its timing is the drop animation's (250ms, `ease`),
 * so the replica grows exactly as fast as the box flies home.
 */
@media (prefers-reduced-motion: no-preference) {
  .replica {
    animation: appear 0.18s ease-out;
    transition:
      scale 0.25s ease,
      border-radius 0.25s ease,
      box-shadow 0.25s ease,
      opacity 0.2s;
  }
}

@keyframes appear {
  from {
    opacity: 0;
    scale: calc(var(--shrink) * 0.85);
  }
}
</style>
