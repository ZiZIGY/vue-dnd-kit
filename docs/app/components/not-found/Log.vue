<script setup lang="ts">
  import { useDnDMonitor, type DnDEvent } from '@vue-dnd-kit/core';

  /** The page's event log: how the visit ended up here, then every drag on the page as it happens. */
  const { t } = useI18n();
  const log = useNotFoundLog();

  const who = (event: DnDEvent) => event.active.label ?? String(event.active.id);
  const where = (event: DnDEvent) => event.over?.label ?? String(event.over?.id);
  useDnDMonitor({
    onDragStart: (event) => log.write('dragstart', who(event)),
    onDragOver: (event) => {
      if (!event.over) return log.write('over', 'nothing', 'muted');
      if (event.over.accepted) return log.write('over', where(event));
      log.write('over', `${where(event)} · refuses ${who(event)}`, 'error');
    },
    onDragEnd: (event) => {
      if (event.dropped) return log.write('drop', `${who(event)} → ${where(event)}`, 'ok');
      log.write('drop', `${who(event)} → over: null · still lost`, 'error');
    },
    onDragCancel: (event) => log.write('cancel', `${who(event)}${event.over ? ` refused by ${where(event)}` : ''} · flew back`, 'muted'),
  });

  /** `mm:ss.mmm` */
  const time = (ms: number) => {
    const total = Math.max(0, Math.round(ms));
    const pad = (value: number, size = 2) => String(value).padStart(size, '0');
    return `${pad(Math.floor(total / 60_000))}:${pad(Math.floor(total / 1000) % 60)}.${pad(total % 1000, 3)}`;
  };
  const TONES = { ok: 'text-(--ui-primary)', error: 'text-rose-600 dark:text-rose-400', muted: 'text-dimmed' };

  // The newest line stays in view: the log scrolls, not the page.
  const list = useTemplateRef<HTMLElement>('list');
  watch(
    () => log.lines.value.at(-1)?.id,
    () => list.value?.scrollTo({ top: list.value.scrollHeight }),
    { flush: 'post' },
  );
</script>

<template>
  <SiteSection>
    <div class="stage">
      <div class="flex h-11 items-center gap-4 border-b border-default px-(--gutter)">
        <span class="label inline-flex items-center gap-2 text-[10px] text-(--ui-primary)">
          <span class="size-1.5 animate-blink bg-(--ui-primary)" />
          Live
        </span>
        <span class="label truncate text-[10px] text-dimmed">{{ t('notFound.log') }}</span>
        <span
          aria-hidden="true"
          class="ms-auto hidden font-mono text-[10px] tracking-[0.08em] text-dimmed sm:block"
          >tail -f dnd.log</span
        >
      </div>
      <ol
        ref="list"
        class="h-64 overflow-y-auto px-(--gutter) py-4 font-mono text-[12px] leading-6"
      >
        <li
          v-for="line in log.lines.value"
          :key="line.id"
          class="line grid grid-cols-[auto_5.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[auto_7rem_minmax(0,1fr)]"
        >
          <span class="text-dimmed tabular-nums">{{ time(line.at) }}</span>
          <span
            class="font-semibold"
            :class="line.tone ? TONES[line.tone] : 'text-highlighted'"
            >{{ line.kind }}</span
          >
          <span
            class="truncate"
            :class="line.tone ? TONES[line.tone] : 'text-muted'"
            >{{ line.text }}</span
          >
        </li>
        <li
          aria-hidden="true"
          class="flex items-center gap-2 text-dimmed"
        >
          ›
          <span class="h-4 w-2 animate-blink bg-(--ui-primary)" />
        </li>
      </ol>
    </div>
  </SiteSection>
</template>

<style scoped>
  .line {
    animation: line-in 0.35s var(--ease-out-expo) both;
  }

  @keyframes line-in {
    from {
      opacity: 0;
      translate: -6px 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .line {
      animation: none;
    }
  }
</style>
