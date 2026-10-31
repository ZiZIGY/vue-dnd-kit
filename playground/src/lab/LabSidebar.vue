<script setup lang="ts">
  import { nextTick, onMounted, useTemplateRef, watch } from 'vue';
  import UIcon from '@nuxt/ui/components/Icon.vue';
  import { DEMOS, SECTIONS } from '../catalog';
  import { demo } from './state';

  const sections = SECTIONS.map((section) => ({ ...section, demos: DEMOS.filter((entry) => entry.section === section.id) }));

  // The open demo stays in view: on load, and when the search or a link opens another.
  const nav = useTemplateRef<HTMLElement>('nav');
  const reveal = () => nav.value?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' });
  onMounted(reveal);
  watch(demo, () => nextTick(reveal));
</script>

<template>
  <nav
    ref="nav"
    aria-label="Demos"
    class="min-h-0 overflow-y-auto border-e border-default bg-default py-3"
  >
    <section
      v-for="section in sections"
      :key="section.id"
      class="mb-3"
    >
      <h2 class="label flex items-center justify-between px-5 py-1.5 text-[10px] text-dimmed">
        {{ section.title }}
        <span class="font-normal text-(--ui-text-dimmed)/70 tabular-nums">{{ String(section.demos.length).padStart(2, '0') }}</span>
      </h2>
      <ul>
        <li
          v-for="entry in section.demos"
          :key="entry.id"
        >
          <a
            :href="`#${entry.id}`"
            :aria-current="entry.id === demo.id ? 'page' : undefined"
            class="group relative flex items-center gap-2 px-5 py-1.5 text-sm text-muted transition-colors hover:bg-elevated/50 hover:text-highlighted aria-[current=page]:bg-elevated aria-[current=page]:font-medium aria-[current=page]:text-highlighted"
          >
            <span
              aria-hidden="true"
              class="absolute inset-y-1 start-0 w-0.5 bg-(--ui-primary) opacity-0 transition-opacity group-aria-[current=page]:opacity-100"
            />
            <span class="truncate">{{ entry.title }}</span>
            <UIcon
              v-if="entry.phone"
              name="i-lucide-smartphone"
              class="ms-auto size-3.5 shrink-0 text-dimmed"
            />
            <UIcon
              v-else-if="entry.page"
              name="i-lucide-layers"
              class="ms-auto size-3.5 shrink-0 text-dimmed"
            />
          </a>
        </li>
      </ul>
    </section>
  </nav>
</template>
