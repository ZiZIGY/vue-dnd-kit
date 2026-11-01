<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { useElementSize, useEventListener } from '@vueuse/core';
import { useDnD } from '@vue-dnd-kit/core';
import Canvas from './Canvas.vue';
import CodeView from './CodeView.vue';
import Inspector from './Inspector.vue';
import Palette from './Palette.vue';
import Preview from './Preview.vue';
import Trash from './Trash.vue';
import { useForm } from './form';

const form = useForm();
const { status } = useDnD();

// The layout follows the builder's own width, not the window's: the docs' frame is
// narrower than the screen, and full screen wider. Wide: palette, form, settings. Narrow:
// the settings take the palette's place. Compact: a strip of fields above the form, the
// settings in a sheet. Below 512px (`@lg`, as the preview's grid) the fields of a row stack.
const root = useTemplateRef<HTMLElement>('root');
const { width } = useElementSize(root);
const layout = computed(() => (width.value >= 900 ? 'wide' : width.value >= 600 ? 'narrow' : 'compact'));
const stacked = computed(() => width.value < 512);

const MODES = [
  { label: 'Build', value: 'build', icon: 'i-lucide-pencil-ruler' },
  { label: 'Preview', value: 'preview', icon: 'i-lucide-eye' },
  { label: 'Code', value: 'code', icon: 'i-lucide-code-xml' },
];
const mode = ref('build');

// Ctrl/⌘ Z and Shift Z (or Y): the form's undo and redo, while the builder is in use: since
// the last press or focus in it. A field that moved to another row, or was deleted, took
// the focus along, and the keys come from the page's body then.
let inUse = false;
const enter = (event: Event) => (inUse = !!root.value?.contains(event.target as Node));
useEventListener(document, 'pointerdown', enter);
useEventListener(document, 'focusin', enter);
useEventListener(document, 'keydown', (event: KeyboardEvent) => {
  const target = event.target as HTMLElement;
  if (!(root.value?.contains(target) || (target === document.body && inUse))) return;
  // Not in a text box, where its own undo is the one you want, nor while something is dragged.
  if (event.defaultPrevented || status.value !== 'idle' || !(event.ctrlKey || event.metaKey)) return;
  if (target.closest('input, textarea')) return;
  const key = event.key.toLowerCase();
  if (key === 'z') event.shiftKey ? form.redo() : form.undo();
  else if (key === 'y') form.redo();
  else return;
  event.preventDefault();
});

const TIPS = [
  { keys: ['alt'], text: 'drag to copy a field' },
  { keys: ['space'], text: 'pick up, arrows move' },
  { keys: ['meta', 'z'], text: 'undo' },
];
</script>

<template>
  <!-- 34rem tall on the page; `flex: 1` fills the frame when it is full screen. -->
  <div
    ref="root"
    class="@container flex h-[34rem] min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg bg-default text-default shadow-xl ring ring-default"
  >
    <header class="flex h-12 shrink-0 items-center gap-3 border-b border-default px-3">
      <div class="flex min-w-0 flex-1 items-center gap-2.5">
        <span class="grid size-7 shrink-0 place-items-center rounded-md bg-primary text-inverted">
          <UIcon name="i-lucide-text-cursor-input" class="size-4" />
        </span>
        <div class="hidden min-w-0 leading-tight @lg:block">
          <p class="truncate text-sm font-semibold text-highlighted">{{ form.state.title || 'Untitled form' }}</p>
          <p class="text-xs text-dimmed">{{ form.fields.length }} fields</p>
        </div>
      </div>

      <!-- Icons alone when narrow: the labels stay for screen readers. -->
      <UTabs v-model="mode" :items="MODES" :content="false" size="xs" :ui="{ label: 'sr-only @md:not-sr-only' }" />

      <div class="flex flex-1 justify-end gap-0.5">
        <UTooltip text="Undo" :kbds="['meta', 'z']">
          <UButton
            icon="i-lucide-undo-2"
            size="sm"
            color="neutral"
            variant="ghost"
            aria-label="Undo"
            :disabled="!form.canUndo"
            @click="form.undo()"
          />
        </UTooltip>
        <UTooltip text="Redo" :kbds="['meta', 'shift', 'z']">
          <UButton
            icon="i-lucide-redo-2"
            size="sm"
            color="neutral"
            variant="ghost"
            aria-label="Redo"
            :disabled="!form.canRedo"
            @click="form.redo()"
          />
        </UTooltip>
      </div>
    </header>

    <div v-if="mode === 'build'" class="relative flex min-h-0 flex-1" :class="{ 'flex-col': layout === 'compact' }">
      <!-- The palette, which a dragged field of the form turns into a trash. -->
      <aside v-if="layout === 'compact'" class="relative shrink-0 border-b border-default">
        <Palette strip />
        <Trash />
      </aside>
      <aside v-else class="relative w-56 shrink-0 border-e border-default @5xl:w-64">
        <Inspector v-if="layout === 'narrow' && form.selected" back />
        <Palette v-else />
        <Trash />
      </aside>

      <Canvas :stacked="stacked" class="min-h-0 min-w-0 flex-1" />

      <aside v-if="layout === 'wide'" class="w-72 shrink-0 border-s border-default @7xl:w-80">
        <Inspector v-if="form.selected" />
        <div v-else class="flex h-full flex-col justify-center gap-6 p-6">
          <UEmpty
            icon="i-lucide-mouse-pointer-click"
            title="No field selected"
            description="Click a field to edit its label, options and rules."
            variant="naked"
          />
          <ul class="mx-auto space-y-2 text-xs text-muted">
            <li v-for="tip in TIPS" :key="tip.text" class="flex items-center gap-2">
              <span class="flex gap-0.5"><UKbd v-for="key in tip.keys" :key="key" :value="key" /></span>
              {{ tip.text }}
            </li>
          </ul>
        </div>
      </aside>

      <!-- Compact: the settings slide up over the form. -->
      <Transition
        enter-from-class="translate-y-full"
        leave-to-class="translate-y-full"
        enter-active-class="transition-transform duration-300 ease-out motion-reduce:transition-none"
        leave-active-class="transition-transform duration-200 ease-in motion-reduce:transition-none"
      >
        <div
          v-if="layout === 'compact' && form.selected"
          class="absolute inset-x-0 bottom-0 z-20 h-3/5 overflow-hidden rounded-t-xl bg-default shadow-[0_-12px_40px_-12px_rgb(0_0_0/0.45)] ring ring-default"
        >
          <Inspector />
        </div>
      </Transition>
    </div>

    <Preview v-else-if="mode === 'preview'" class="min-h-0 flex-1" />
    <CodeView v-else class="min-h-0 flex-1" />
  </div>
</template>
