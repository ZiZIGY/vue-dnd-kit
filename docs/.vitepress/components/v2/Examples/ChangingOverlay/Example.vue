<script setup lang="ts">
  import { computed, ref, markRaw } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import AlchemyDraggable from './AlchemyDraggable.vue';
  import ReactionZone from './ReactionZone.vue';
  import AlchemyOverlay from './AlchemyOverlay.vue';

  interface Reagent {
    id: string;
    symbol: string;
    name: string;
  }

  const reagents: Reagent[] = [
    { id: 'h', symbol: 'H', name: 'Hydrogen' },
    { id: 'o', symbol: 'O', name: 'Oxygen' },
    { id: 'na', symbol: 'Na', name: 'Sodium' },
    { id: 'cl', symbol: 'Cl', name: 'Chlorine' },
  ];

  const reactionItems = ref<Reagent[]>([]);

  const result = ref<string | null>(null);
  const explanation = ref<string | null>(null);

  function handleDrop(e: IDragEvent) {
    for (const d of e.draggedItems) {
      const payload = d.item as Reagent | undefined;
      if (!payload) continue;

      reactionItems.value.push({
        id: `${payload.id}-${Date.now()}-${Math.random()
          .toString(16)
          .slice(2, 6)}`,
        symbol: payload.symbol,
        name: payload.name,
      });
    }
  }

  const counts = computed(() => {
    const map: Record<string, number> = {};
    for (const item of reactionItems.value) {
      map[item.symbol] = (map[item.symbol] ?? 0) + 1;
    }
    return map;
  });

  function runReaction() {
    const h = counts.value['H'] ?? 0;
    const o = counts.value['O'] ?? 0;
    const na = counts.value['Na'] ?? 0;
    const cl = counts.value['Cl'] ?? 0;

    if (!h && !o && !na && !cl) {
      result.value = null;
      explanation.value =
        'Add reagents to the reaction zone first: drag H (hydrogen), O (oxygen), Na (sodium) or Cl (chlorine).';
      return;
    }

    if (h >= 2 && o >= 1 && na === 0 && cl === 0) {
      result.value = 'H₂O';
      explanation.value =
        'You created water: 2 hydrogens (H) and 1 oxygen (O) combine into H₂O.';
      return;
    }

    if (h >= 2 && o === 0 && na === 0 && cl === 0) {
      result.value = 'H₂';
      explanation.value = 'Only hydrogen present — you get hydrogen gas (H₂).';
      return;
    }

    if (o >= 2 && h === 0 && na === 0 && cl === 0) {
      result.value = 'O₂';
      explanation.value = 'Only oxygen present — you get oxygen gas (O₂).';
      return;
    }

    if (na >= 1 && cl >= 1 && h === 0 && o === 0) {
      result.value = 'NaCl';
      explanation.value =
        'Sodium (Na) and chlorine (Cl) combine into sodium chloride (NaCl) — common salt.';
      return;
    }

    if (h >= 2 && o >= 1) {
      result.value = 'H₂ + O₂ (mixture)';
      explanation.value =
        'You created an oxyhydrogen mixture (H₂ + O₂). To get pure water, try 2 H and 1 O.';
      return;
    }

    if (na >= 1 && cl >= 1) {
      result.value = 'NaCl + mixture';
      explanation.value =
        'There is enough Na and Cl for NaCl, but other reagents are mixed in. Try isolating Na and Cl for a clean reaction.';
      return;
    }

    result.value = 'Unbalanced mixture';
    explanation.value =
      'This combination does not match any of the simple reactions in this demo. Try 2×H + 1×O for water, or Na + Cl for salt.';
  }

  function reset() {
    reactionItems.value = [];
    result.value = null;
    explanation.value = null;
  }
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-3">
          <h3 class="text-base font-semibold">Chemical playground</h3>
          <p class="text-xs sm:text-sm text-(--vp-c-text-2)">
            Drag reagents into the reaction zone. Then press
            <code>Run reaction</code> to see what you get. This example uses
            <b>copy</b>: the source list never changes.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)]">
          <div class="flex flex-col gap-2">
            <h4 class="text-sm font-semibold">Reagents</h4>
            <div class="flex flex-wrap gap-2">
              <AlchemyDraggable
                v-for="(r, index) in reagents"
                :key="r.id"
                :index="index"
                :items="reagents"
                :reagent="r"
              />
            </div>
            <p class="mt-1 text-xs text-(--vp-c-text-2)">
              All reagents stay here — dropping only adds copies to the reaction
              zone.
            </p>
          </div>

          <div class="flex flex-col gap-3">
            <h4 class="text-sm font-semibold">Reaction zone</h4>
            <ReactionZone
              :items="reactionItems"
              @drop="handleDrop"
              @enter="
                $event.provider.overlay.render.value = markRaw(AlchemyOverlay)
              "
              @leave="$event.provider.overlay.render.value = null"
            />

            <div class="mt-1 flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="glass-btn text-xs sm:text-sm !px-2"
                @click="runReaction"
              >
                Run reaction
              </button>
              <button
                type="button"
                class="glass-btn text-xs sm:text-sm !px-2"
                @click="reset"
              >
                Reset
              </button>
            </div>

            <div
              v-if="result || explanation"
              class="mt-1 inline-flex flex-col gap-1 rounded-xl border border-emerald-400/60 bg-emerald-500/10 px-3 py-2 text-xs sm:text-sm"
            >
              <span
                v-if="result"
                class="font-semibold text-emerald-300"
              >
                Result: {{ result }}
              </span>
              <span
                v-if="explanation"
                class="text-(--vp-c-text-2)"
              >
                {{ explanation }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>
