<script setup lang="ts">
  import { computed } from 'vue';
  import { useColorMode } from '@vueuse/core';
  import UButton from '@nuxt/ui/components/Button.vue';
  import UIcon from '@nuxt/ui/components/Icon.vue';
  import UKbd from '@nuxt/ui/components/Kbd.vue';
  import UTooltip from '@nuxt/ui/components/Tooltip.vue';
  import { DOCS_URL, REPO_URL } from './links';

  defineEmits<{ search: [] }>();

  // The docs' modes. The demo page and the kit pages read the same stored mode.
  const mode = useColorMode({ emitAuto: true });
  const MODES = [
    { value: 'auto', label: 'System theme', icon: 'i-lucide-monitor' },
    { value: 'light', label: 'Light theme', icon: 'i-lucide-sun' },
    { value: 'dark', label: 'Dark theme', icon: 'i-lucide-moon' },
  ] as const;
  const current = computed(() => MODES.find((entry) => entry.value === mode.value) ?? MODES[0]);
  const cycle = () => {
    const index = MODES.findIndex((entry) => entry.value === mode.value);
    mode.value = MODES[(index + 1) % MODES.length]!.value;
  };

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
</script>

<template>
  <header class="flex h-14 shrink-0 items-center gap-4 border-b border-default bg-default px-4">
    <a
      href="#"
      class="flex items-center gap-2 text-highlighted"
      aria-label="Playground home"
    >
      <!-- The white chevron needs an edge on a light page; on a dark one it has its own. -->
      <img
        src="/logo.png"
        alt=""
        width="28"
        height="28"
        class="size-7 shrink-0 object-contain drop-shadow-[0_1px_1.5px_rgb(0_0_0/0.35)] dark:drop-shadow-none"
      />
      <span class="text-[17px] font-bold tracking-[-0.04em] whitespace-nowrap"><span class="font-semibold text-muted">vue-</span>dnd-kit</span>
      <span class="label ms-1 hidden text-[10px] text-(--ui-primary) sm:inline">Playground</span>
    </a>

    <button
      type="button"
      class="ms-4 hidden h-9 w-72 items-center gap-2 rounded-(--ui-radius) bg-elevated/60 px-3 text-sm text-dimmed ring-1 ring-default ring-inset transition-colors hover:bg-elevated hover:text-muted md:flex"
      @click="$emit('search')"
    >
      <UIcon
        name="i-lucide-search"
        class="size-4 shrink-0"
      />
      Search demos…
      <span class="ms-auto flex gap-0.5">
        <UKbd :value="isMac ? 'meta' : 'ctrl'" />
        <UKbd value="K" />
      </span>
    </button>

    <nav class="ms-auto flex items-center gap-1">
      <UButton
        class="md:hidden"
        icon="i-lucide-search"
        color="neutral"
        variant="ghost"
        aria-label="Search demos"
        @click="$emit('search')"
      />
      <UButton
        :href="`${DOCS_URL}/docs/getting-started/introduction`"
        target="_blank"
        label="Docs"
        trailing-icon="i-lucide-arrow-up-right"
        color="neutral"
        variant="ghost"
        class="font-mono text-[11px] font-semibold tracking-[0.08em] uppercase"
      />
      <UButton
        :href="REPO_URL"
        target="_blank"
        icon="i-lucide-github"
        color="neutral"
        variant="ghost"
        aria-label="GitHub"
      />
      <UTooltip :text="current.label">
        <UButton
          :icon="current.icon"
          color="neutral"
          variant="ghost"
          :aria-label="current.label"
          data-testid="theme"
          @click="cycle"
        />
      </UTooltip>
    </nav>
  </header>
</template>
