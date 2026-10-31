<script setup lang="ts">
  import { useEventListener } from '@vueuse/core';
  import UCommandPalette from '@nuxt/ui/components/CommandPalette.vue';
  import UModal from '@nuxt/ui/components/Modal.vue';
  import { DEMOS, SECTIONS } from '../catalog';
  import { open as openDemo } from './state';

  const open = defineModel<boolean>('open', { default: false });

  const groups = SECTIONS.map((section) => ({
    id: section.id,
    label: section.title,
    items: DEMOS.filter((entry) => entry.section === section.id).map((entry) => ({
      label: entry.title,
      suffix: entry.description,
      icon: entry.phone ? 'i-lucide-smartphone' : entry.page ? 'i-lucide-layers' : 'i-lucide-chevron-right',
      onSelect: () => {
        openDemo(entry.id);
        open.value = false;
      },
    })),
  }));

  // Ctrl+K (Cmd+K) anywhere in the Lab; the demo frame keeps its own keys.
  useEventListener(window, 'keydown', (event: KeyboardEvent) => {
    if (event.key.toLowerCase() !== 'k' || !(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    open.value = !open.value;
  });
</script>

<template>
  <UModal
    v-model:open="open"
    title="Search demos"
    description="Find a demo by its name or what it shows"
    :ui="{ content: 'max-w-2xl' }"
  >
    <template #content>
      <UCommandPalette
        :groups="groups"
        placeholder="Search demos…"
        class="h-[min(32rem,70vh)]"
        :fuse="{ resultLimit: 40, fuseOptions: { keys: ['label', 'suffix'], threshold: 0.35 } }"
        close
        @update:open="open = $event"
      />
    </template>
  </UModal>
</template>
