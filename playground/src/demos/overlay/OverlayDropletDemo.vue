<script setup lang="ts">
  import { onMounted, onUnmounted, reactive, ref, shallowRef, type Component } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import SeedList from './SeedList.vue';
  import WaterZone from './WaterZone.vue';
  import BedTree from './BedTree.vue';
  import SeedCardOverlay from './SeedCardOverlay.vue';
  import SeedChipOverlay from './SeedChipOverlay.vue';
  import SproutOverlay from './SproutOverlay.vue';
  import { describeBeds, seed } from './seeds';

  const seeds = reactive({ id: 'seeds', title: 'Seeds', seeds: [seed('s1', 'Tomato'), seed('s2', 'Pea'), seed('s3', 'Carrot')] });
  const garden = reactive({ id: 'garden', title: 'Garden', seeds: [seed('g1', 'Bean', '🫘')] });
  const watered = ref<string[]>([]);

  // A ref, switched mid-drag: `S` turns the seeds' overlay from a card into a chip and back.
  const seedOverlay = shallowRef<Component>(SeedCardOverlay);
  const toggle = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() !== 's') return;
    seedOverlay.value = seedOverlay.value === SeedCardOverlay ? SeedChipOverlay : SeedCardOverlay;
  };
  onMounted(() => window.addEventListener('keydown', toggle));
  onUnmounted(() => window.removeEventListener('keydown', toggle));

  // Objects, not template expressions: a template would unwrap the ref.
  const seedsOptions = { overlay: seedOverlay };
  // The garden as a target: whatever comes in grows a sprout (`overOverlay`).
  const gardenOptions = { overOverlay: SproutOverlay };
</script>

<template>
  <DnDProvider>
    <p class="lead">
      Targets shape the overlay. Over the water a seed turns into a droplet and splashes when dropped; over the
      garden it grows a sprout around itself and says which place it would take; in the beds it names the bed it
      would go into. Press <kbd>S</kbd> while dragging a seed to switch its look.
    </p>
    <div class="layout">
      <SeedList
        :bed="seeds"
        :options="seedsOptions"
      />
      <SeedList
        :bed="garden"
        :options="gardenOptions"
      />
      <WaterZone @watered="watered.push($event)" />
      <BedTree />
    </div>
    <pre data-testid="state">{{ describeBeds([seeds, garden]) }} | watered:{{ watered.join(',') }}</pre>
  </DnDProvider>
</template>

<style scoped>
  .lead {
    max-width: 760px;
  }

  .layout {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-start;
  }
</style>
