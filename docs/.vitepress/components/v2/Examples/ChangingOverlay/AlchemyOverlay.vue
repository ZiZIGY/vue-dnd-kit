<script setup lang="ts">
  import { computed } from 'vue';
  import { motion } from 'motion-v';
  import { useDnDProvider } from '@vue-dnd-kit/core';
  import AlchemyElement from './AlchemyElement.vue';

  interface Reagent {
    id: string;
    symbol: string;
    name: string;
  }

  const { state, preview, entities } = useDnDProvider();

  const style = computed(() => ({
    transform: `translate3d(${preview.position.value.x}px, ${preview.position.value.y}px, 0)`,
  }));

  const elementMeta = {
    H: {
      number: 1,
      mass: '1.008',
      config: ['1s¹'],
    },
    O: {
      number: 8,
      mass: '15.999',
      config: ['2s²', '2p⁴'],
    },
    Na: {
      number: 11,
      mass: '22.990',
      config: ['3s¹'],
    },
    Cl: {
      number: 17,
      mass: '35.45',
      config: ['3s²', '3p⁵'],
    },
  } as const;

  const currentElement = computed(() => {
    const first = entities.draggingMap.values().next().value as
      | { payload?: () => unknown; data?: () => unknown }
      | undefined;
    if (!first) return null;

    let reagent: Reagent | null = null;

    if (typeof first.payload === 'function') {
      const result = first.payload();
      if (Array.isArray(result) && result.length >= 2) {
        const [idx, items] = result as [number, Reagent[]];
        reagent = items[Number(idx)] ?? null;
      }
    }

    if (!reagent && typeof first.data === 'function') {
      reagent = first.data() as Reagent | null;
    }

    if (!reagent) return null;

    const meta = elementMeta[reagent.symbol as keyof typeof elementMeta];
    if (!meta) return null;

    return {
      symbol: reagent.symbol,
      name: reagent.name,
      number: meta.number,
      mass: meta.mass,
      config: meta.config,
    };
  });
</script>

<template>
  <div
    v-if="state === 'dragging' && currentElement"
    class="alchemy-overlay"
    :style="style"
  >
    <motion.div
      class="alchemy-overlay__card"
      :initial="{ scale: 0.9, opacity: 0, y: -8 }"
      :animate="{ scale: 1, opacity: 1, y: 0 }"
    >
      <AlchemyElement
        :symbol="currentElement.symbol"
        :name="currentElement.name"
        :number="currentElement.number"
        :mass="currentElement.mass"
        :config="currentElement.config"
      />
    </motion.div>
  </div>
</template>

<style scoped>
  .alchemy-overlay {
    z-index: 10000;
  }

  .alchemy-overlay__card {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 0.9rem;
    background: rgba(15, 23, 42, 0.7);
    box-shadow: 0 14px 40px rgba(15, 23, 42, 0.7);
    color: #e5e7eb;
    backdrop-filter: blur(12px) saturate(1.1);
  }
</style>
