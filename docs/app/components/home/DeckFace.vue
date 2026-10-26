<script setup lang="ts">
  import type { DeckCard } from '~/data/deck';

  /** The face of a deck card: a label, a small drawing of the feature, its name. */
  const props = defineProps<{ card: DeckCard; lifted?: boolean }>();
  const { t } = useI18n();

  const TONES = {
    accent: 'bg-[#42b883] text-[#04130c] ring-[#42b883]',
    ink: 'bg-[#0f0f11] text-[#f4f4f5] ring-white/10',
    plain: 'bg-elevated text-highlighted ring-accented',
  };
  const index = computed(() => String(['kanban', 'tree', 'multi', 'sortable', 'animate', 'keyboard', 'virtual'].indexOf(props.card.kind) + 1).padStart(2, '0'));
</script>

<template>
  <div
    class="relative flex size-full flex-col justify-between overflow-hidden rounded-xl p-4 ring-1 ring-inset"
    :class="[TONES[card.tone], lifted ? 'shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]' : '']"
  >
    <div class="flex items-center justify-between font-mono text-[10px] font-semibold uppercase tracking-[0.1em] opacity-70">
      <span>{{ index }}</span>
      <span>{{ t(`home.deck.${card.kind}.label`) }}</span>
    </div>

    <!-- A drawing of the feature, in currentColor. -->
    <div
      aria-hidden="true"
      class="mx-auto flex h-24 w-full items-center justify-center"
    >
      <div
        v-if="card.kind === 'sortable'"
        class="flex w-28 flex-col gap-1.5"
      >
        <span class="h-3 rounded-sm bg-current opacity-30" />
        <span class="h-3 translate-x-3 rounded-sm bg-current shadow-lg" />
        <span class="h-3 rounded-sm border border-dashed border-current opacity-50" />
        <span class="h-3 rounded-sm bg-current opacity-30" />
      </div>
      <div
        v-else-if="card.kind === 'kanban'"
        class="flex gap-1.5"
      >
        <div
          v-for="(count, column) in [3, 2, 1]"
          :key="column"
          class="flex w-9 flex-col gap-1 rounded-sm bg-current/10 p-1"
        >
          <span
            v-for="row in count"
            :key="row"
            class="h-3 rounded-[2px] bg-current"
            :class="column === 1 && row === 1 ? 'opacity-100' : 'opacity-40'"
          />
        </div>
      </div>
      <div
        v-else-if="card.kind === 'tree'"
        class="flex w-28 flex-col gap-1.5"
      >
        <span
          v-for="(depth, row) in [0, 1, 2, 1, 0]"
          :key="row"
          class="flex items-center gap-1.5"
          :style="{ paddingLeft: `${depth * 14}px` }"
        >
          <span
            class="size-2.5 rounded-[2px] bg-current"
            :class="row === 2 ? 'bg-[#42b883]' : 'opacity-60'"
          />
          <span class="h-1.5 flex-1 rounded-full bg-current opacity-30" />
        </span>
      </div>
      <div
        v-else-if="card.kind === 'multi'"
        class="relative size-20"
      >
        <span class="absolute left-0 top-0 size-12 rounded-md bg-current opacity-20" />
        <span class="absolute left-3 top-3 size-12 rounded-md bg-current opacity-40" />
        <span class="absolute left-6 top-6 size-12 rounded-md bg-current" />
        <span
          class="absolute -right-2 top-3 grid size-6 place-items-center rounded-full bg-[#42b883] font-mono text-[11px] font-bold text-[#04130c]"
          >3</span
        >
      </div>
      <svg
        v-else-if="card.kind === 'animate'"
        class="h-20 w-32"
        viewBox="0 0 128 80"
        fill="none"
      >
        <path
          d="M8 70 C 40 70, 40 12, 72 12 S 112 40, 120 10"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-dasharray="3 4"
          opacity="0.5"
        />
        <circle
          cx="8"
          cy="70"
          r="4"
          fill="currentColor"
          opacity="0.35"
        />
        <circle
          cx="72"
          cy="12"
          r="4"
          fill="currentColor"
          opacity="0.6"
        />
        <rect
          x="110"
          y="0"
          width="20"
          height="20"
          rx="3"
          fill="#42b883"
        />
      </svg>
      <div
        v-else-if="card.kind === 'keyboard'"
        class="flex flex-col items-center gap-1.5 font-mono text-[11px] font-semibold"
      >
        <span class="grid h-7 w-24 place-items-center rounded-md ring-1 ring-current/40">space</span>
        <span class="flex gap-1.5">
          <span
            v-for="arrow in ['←', '↑', '↓', '→']"
            :key="arrow"
            class="grid size-7 place-items-center rounded-md ring-1 ring-current/40"
            :class="arrow === '↓' ? 'bg-[#42b883] text-[#04130c] ring-[#42b883]' : ''"
            >{{ arrow }}</span
          >
        </span>
      </div>
      <div
        v-else
        class="flex w-28 flex-col gap-1"
      >
        <span
          v-for="row in 9"
          :key="row"
          class="h-1 rounded-full bg-current"
          :style="{ opacity: 0.9 - row * 0.09 }"
        />
      </div>
    </div>

    <p class="text-[19px] font-bold leading-[1.05] tracking-[-0.035em]">{{ t(`home.deck.${card.kind}.title`) }}</p>
  </div>
</template>
