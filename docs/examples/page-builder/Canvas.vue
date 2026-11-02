<script setup lang="ts">
import { computed, nextTick, useTemplateRef, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { makeSortableList } from '@vue-dnd-kit/core';
import Icon from './Icon.vue';
import PageSection from './PageSection.vue';
import SectionGhost from './SectionGhost.vue';
import { DEVICES, PAGE, reveal, useBuilder } from './builder';
import { typeScale } from './page';

const builder = useBuilder();
const { sections, device, pageWidth, selected } = builder;

const scroller = useTemplateRef<HTMLElement>('scroller');
const page = useTemplateRef<HTMLElement>('page');

// The sections: a list that stays still while you drag, with a line where the drop goes.
// Moving a 500px section live would shove the whole page around on every slot it passes.
const { items, indicator } = makeSortableList(page, {
  id: PAGE,
  items: sections,
  group: 'sections',
  placeholder: 'indicator',
  // Sections in hand, the templates' too: the real section, shrunk under the pointer.
  overlay: SectionGhost,
  // The whole canvas takes the drop: let go beside or below the page, the line says where.
  dropzone: scroller,
  // The toolbar's buttons, undo and redo move sections without a drag: they slide too.
  animateChanges: true,
  // A new section, or one moved, is selected.
  onDrop: (event) => builder.select(event.items[0]!.id),
});

// The page's width sets its type scale; the overlays read it to look the same.
const { width } = useElementSize(page);
watch(width, (value) => (pageWidth.value = value), { immediate: true });
const scale = computed(() => typeScale(pageWidth.value));

// Selected elsewhere (a layer, a click on a template): brought into view.
watch(selected, async (id) => {
  await nextTick();
  if (id) reveal(scroller.value, scroller.value?.querySelector(`[data-node="${id}"]`));
});
</script>

<template>
  <div ref="scroller" class="canvas" @click.self="builder.select(null)">
    <div class="device" :data-device="device" :style="{ width: DEVICES[device].width }">
      <div class="browser" aria-hidden="true">
        <span class="lights"><i /><i /><i /></span>
        <span class="address">lumora.site</span>
      </div>
      <div ref="page" class="page" :style="scale">
        <PageSection v-for="(section, index) in items" :key="section.id" :section="section" :index="index" :count="items.length" />
      </div>
      <div v-if="!items.length" class="empty" :class="{ armed: indicator }">
        <Icon name="plus" />
        <strong>Your page is empty</strong>
        <span>Drag a section here, or click one under Add.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* The pasteboard: dotted, scrolling, the page in the middle. */
.canvas {
  flex: 1;
  min-width: 0;
  padding: 18px 18px 40px;
  overflow: auto;
  background:
    radial-gradient(color-mix(in srgb, currentColor 14%, transparent) 1px, transparent 1.4px) 0 0 / 18px 18px,
    color-mix(in srgb, currentColor 4%, Canvas);
  overscroll-behavior: contain;
}

/* The device: the page at the width picked in the top bar, as wide as there is room for. */
.device {
  max-width: 100%;
  margin: 0 auto;
  overflow: clip;
  border-radius: 10px;
  background: #fff;
  box-shadow:
    0 0 0 1px rgb(15 23 42 / 0.1),
    0 24px 50px -30px rgb(0 0 0 / 0.6);
}

@media (prefers-reduced-motion: no-preference) {
  .device {
    transition: width 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
}

.browser {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 30px;
  padding: 0 12px;
  border-bottom: 1px solid #e8ebf1;
  background: #f7f8fa;
}

.lights {
  display: flex;
  gap: 5px;
}

.lights i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dfe3ea;
}

.address {
  flex: 0 1 220px;
  margin: 0 auto;
  padding: 3px 10px;
  overflow: hidden;
  border-radius: 6px;
  background: #eceff4;
  color: #6b7486;
  font: 500 10.5px/1.2 ui-sans-serif, system-ui, sans-serif;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Sections ask the page for their layout (`@container page`): the device's width, not the screen's. */
.page {
  container: page / inline-size;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  margin: 14px;
  padding: 56px 20px;
  border: 1.5px dashed #cdd3de;
  border-radius: 10px;
  color: #64708a;
  font: 13px/1.4 ui-sans-serif, system-ui, sans-serif;
  text-align: center;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.empty svg {
  width: 26px;
  height: 26px;
  margin-bottom: 4px;
  color: #42b883;
}

.empty strong {
  color: #1e293b;
  font-size: 15px;
}

/* A section in hand over the empty page: this is where it goes. */
.empty.armed {
  border-color: #42b883;
  background: rgb(66 184 131 / 0.08);
}
</style>
