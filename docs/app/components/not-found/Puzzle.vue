<script setup lang="ts">
  import { makeDragArea, makeDroppable, type Key } from '@vue-dnd-kit/core';
  import { useElementSize, usePreferredReducedMotion } from '@vueuse/core';

  /**
   * The page's number, fallen apart: its digits lie on the paper, and the row above keeps a
   * slot for each. Rendered whole (before any script runs), it falls apart once the page is
   * up; put back together, it lights up.
   */
  const { t } = useI18n();
  const route = useRoute();
  const log = useNotFoundLog();

  const SLOTS = ['4', '0', '4'];
  /** Where each digit falls: a share of the room it has on the paper (0–1 across, down), and its tilt. */
  const SCATTER = [
    { x: 0.04, y: 0.92, tilt: -14 },
    { x: 0.96, y: 0.86, tilt: 10 },
    { x: 0.52, y: 1, tilt: -6 },
  ];

  interface Digit {
    id: string;
    glyph: string;
    slot: number | null;
    x: number;
    y: number;
    tilt: number;
  }
  const digits = ref<Digit[]>(SLOTS.map((glyph, index) => ({ id: `digit-${index + 1}`, glyph, slot: index, x: 0, y: 0, tilt: 0 })));
  /** `whole` until it falls apart, `falling` while it does, `loose` in play, `assembled` once put back. */
  const phase = ref<'whole' | 'falling' | 'loose' | 'assembled'>('whole');
  const inSlot = (index: number) => digits.value.find((digit) => digit.slot === index) ?? null;
  const loose = computed(() => digits.value.filter((digit) => digit.slot === null));

  // A loose digit's place, from its shares of the room left around it on the paper.
  const board = useTemplateRef<HTMLElement>('board');
  const row = useTemplateRef<HTMLElement>('row');
  const { width, height } = useElementSize(board);
  const { width: boxWidth, height: boxHeight } = useElementSize(() => row.value?.firstElementChild as HTMLElement | undefined);
  const room = computed(() => ({ x: Math.max(1, width.value - boxWidth.value), y: Math.max(1, height.value - boxHeight.value) }));
  const placeOf = (digit: Digit) => ({ left: `${digit.x * room.value.x}px`, top: `${digit.y * room.value.y}px` });
  const clamp = (value: number) => Math.min(1, Math.max(0, value));

  // The digits stay on the paper, and one let go anywhere on it lies there, straight.
  makeDragArea(board, { restrictToArea: true, disabled: () => phase.value === 'whole' || phase.value === 'falling' });
  makeDroppable(board, {
    id: 'paper',
    label: 'paper',
    accept: 'digit',
    onDrop: ({ active, position }) => {
      const digit = digits.value.find((item) => item.id === active.id);
      if (!digit || !position) return;
      Object.assign(digit, { slot: null, x: clamp(position.x / room.value.x), y: clamp(position.y / room.value.y), tilt: 0 });
      phase.value = 'loose';
    },
  });

  const place = (id: Key, slot: number) => {
    const digit = digits.value.find((item) => item.id === id);
    if (!digit) return;
    Object.assign(digit, { slot, tilt: 0 });
    if (SLOTS.every((_, index) => inSlot(index))) {
      phase.value = 'assembled';
      log.write('assembled', '4 0 4 · the page is still missing', 'ok');
    }
  };

  // Falling apart: each digit leaves its place for a spot on the paper (a FLIP from where it
  // was), shakes loose, drops, bounces once. Without motion, they are just there.
  const reduced = usePreferredReducedMotion();
  const jitter = (value: number, by: number) => value + (Math.random() * 2 - 1) * by;
  const elements = () => [...(board.value?.querySelectorAll<HTMLElement>('[data-digit]') ?? [])];
  const fall = async () => {
    const before = new Map(elements().map((element) => [element.dataset.digit, element.getBoundingClientRect()]));
    phase.value = 'falling';
    digits.value.forEach((digit, index) => {
      const spot = SCATTER[index]!;
      Object.assign(digit, { slot: null, x: clamp(jitter(spot.x, 0.04)), y: clamp(jitter(spot.y, 0.06)), tilt: Math.round(jitter(spot.tilt, 4)) });
    });
    log.write('layout', '404 fell apart · 3 digits on the paper', 'error');
    await nextTick();
    const flights = reduced.value === 'reduce' ? [] : elements().map((element, index) => {
      const from = before.get(element.dataset.digit);
      const tilt = digits.value.find((digit) => digit.id === element.dataset.digit)?.tilt ?? 0;
      if (!from) return Promise.resolve();
      const to = element.getBoundingClientRect();
      const [dx, dy] = [from.left - to.left, from.top - to.top];
      const bounce = Math.min(28, to.height * 0.14);
      const timing = { duration: 1000, delay: 140 * index, fill: 'backwards' as const };
      element.firstElementChild?.animate(
        [{ rotate: '0deg' }, { rotate: `${-tilt * 0.15}deg`, offset: 0.12 }, { rotate: `${tilt * 1.3}deg`, offset: 0.66 }, { rotate: `${tilt}deg` }],
        timing,
      );
      return element.animate(
        [
          { translate: `${dx}px ${dy}px` },
          { translate: `${dx + 4}px ${dy}px`, offset: 0.05 },
          { translate: `${dx - 4}px ${dy}px`, offset: 0.1 },
          { translate: `${dx}px ${dy}px`, offset: 0.15, easing: 'cubic-bezier(0.55, 0, 0.85, 0.35)' },
          { translate: '0 0', offset: 0.62, easing: 'cubic-bezier(0.2, 0.7, 0.4, 1)' },
          { translate: `0 ${-bounce}px`, offset: 0.8, easing: 'cubic-bezier(0.6, 0, 0.85, 0.4)' },
          { translate: '0 0' },
        ],
        timing,
      ).finished;
    });
    await Promise.allSettled(flights);
    phase.value = 'loose';
  };

  let timer: ReturnType<typeof setTimeout> | undefined;
  onMounted(() => (timer = setTimeout(fall, 900)));
  onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <SiteSection>
    <div
      aria-hidden="true"
      class="grid-paper fade-radial pointer-events-none absolute inset-0 opacity-70"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_42%_at_50%_40%,rgba(66,184,131,0.14),transparent_70%)]"
    />
    <DecorBeam class="inset-y-0 -left-px w-px" />
    <DecorBeam
      class="inset-y-0 -right-px w-px"
      delay="-2.5s"
    />
    <div class="label relative flex items-center justify-between gap-6 px-(--gutter) pt-6 text-[10px] text-dimmed">
      <span class="flex items-center gap-2">
        <span class="size-1.5 animate-blink bg-(--ui-primary)" />
        {{ t('notFound.label') }}
      </span>
      <span class="hidden truncate normal-case sm:block">GET {{ route.path }} → 404</span>
    </div>

    <div
      ref="board"
      role="group"
      aria-label="404"
      class="board relative mx-(--gutter) mt-4"
      :class="phase"
    >
      <div
        ref="row"
        class="slots"
      >
        <NotFoundSlot
          v-for="(glyph, index) in SLOTS"
          :key="index"
          :index="index"
          :glyph="glyph"
          :digit="inSlot(index)"
          :shown="phase !== 'whole'"
          :style="{ '--at': index }"
          @drop="place($event, index)"
        >
          <NotFoundDigit
            v-if="inSlot(index)"
            :digit="inSlot(index)!"
          />
        </NotFoundSlot>
      </div>
      <NotFoundDigit
        v-for="digit in loose"
        :key="digit.id"
        :digit="digit"
        class="absolute"
        :style="placeOf(digit)"
      />
      <span
        v-if="phase === 'assembled'"
        aria-hidden="true"
        class="sweep"
      />
    </div>

    <div class="relative flex min-h-20 flex-wrap items-center justify-center gap-x-4 gap-y-2 px-(--gutter) pt-6 pb-8">
      <p
        class="label text-center text-[10px] transition-colors"
        :class="phase === 'assembled' ? 'text-(--ui-primary)' : 'text-dimmed'"
      >
        {{ phase === 'assembled' ? t('notFound.done') : t('notFound.hint') }}
      </p>
      <UButton
        v-if="phase === 'assembled'"
        size="xs"
        color="neutral"
        variant="outline"
        icon="i-lucide-shuffle"
        :label="t('notFound.again')"
        @click="fall"
      />
    </div>
  </SiteSection>
</template>

<style scoped>
  /* Sized by its digits: a row of slots on top (their numbers under them), room under it for them to lie in. */
  .board {
    height: calc(var(--digit) * 2.25 + 2rem);
    font-size: var(--digit);
    --digit: clamp(6.5rem, 16vw, 14rem);
  }

  .slots {
    display: flex;
    justify-content: center;
    gap: 0.14em;
    padding-top: 0.12em;
  }

  /* Put back together: the digits light up one after another, and a light runs across them. */
  .assembled :deep(.glyph) {
    color: var(--ui-primary);
    animation: pop 0.6s var(--ease-spring) calc(var(--at) * 90ms) both;
  }

  @keyframes pop {
    40% {
      scale: 1.1;
    }
  }

  .sweep {
    position: absolute;
    inset: 0 0 auto;
    height: calc(1.14em);
    overflow: hidden;
    pointer-events: none;
  }

  .sweep::after {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 30%;
    background: linear-gradient(to right, transparent, color-mix(in oklab, var(--color-accent) 35%, transparent), transparent);
    animation: sweep 1.1s var(--ease-out-expo) 0.15s both;
  }

  @keyframes sweep {
    from {
      translate: -100% 0;
    }
    to {
      translate: 400% 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .assembled :deep(.glyph),
    .sweep::after {
      animation: none;
    }
  }
</style>
