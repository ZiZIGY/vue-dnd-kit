<script setup lang="ts">
  import { makeSortableList, restrictToParent, useDnD } from '@vue-dnd-kit/core';
  import type { ExampleFile } from '#examples';

  /** The tabs: they sort along the bar and stay in it; a line slides to the open one. */
  const files = defineModel<ExampleFile[]>('files', { required: true });
  const active = defineModel<string>('active', { required: true });
  const { t } = useI18n();

  const list = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(list, {
    items: files,
    getKey: (file) => file.name,
    strategy: 'horizontal',
    axis: 'x',
    modifiers: [restrictToParent],
  });

  // The line under the open tab, measured from the layout: hidden while a tab is dragged.
  const { status } = useDnD();
  const line = ref({ x: 0, width: 0 });
  const tabOf = (name: string) => list.value?.querySelector<HTMLElement>(`[data-name="${CSS.escape(name)}"]`);
  const measure = () => {
    const tab = tabOf(active.value);
    if (tab) line.value = { x: tab.offsetLeft, width: tab.offsetWidth };
  };
  watch([active, () => files.value.map((file) => file.name).join()], () => nextTick(measure));

  onMounted(() => {
    measure();
    void document.fonts?.ready.then(measure);
    // The file shown first may sit past the edge of the bar: scroll it into view.
    const tab = tabOf(active.value);
    if (list.value && tab) list.value.scrollLeft = tab.offsetLeft + (tab.offsetWidth - list.value.clientWidth) / 2;
  });
</script>

<template>
  <div
    ref="list"
    role="tablist"
    :aria-label="t('example.code')"
    class="relative flex min-w-0 overflow-x-auto [scrollbar-width:none]"
  >
    <ExampleTab
      v-for="file in items"
      :key="file.name"
      :file="file"
      :active="file.name === active"
      @select="active = file.name"
    />
    <Motion
      aria-hidden="true"
      class="pointer-events-none absolute top-0 left-0 h-0.5 bg-(--ui-primary)"
      :animate="{ x: line.x, width: line.width, opacity: status === 'idle' ? 1 : 0 }"
      :transition="{ type: 'spring', stiffness: 520, damping: 42 }"
    />
  </div>
</template>
