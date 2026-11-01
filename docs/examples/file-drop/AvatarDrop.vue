<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

const url = ref<string | null>(null);

const show = (file: File) => {
  if (url.value) URL.revokeObjectURL(url.value);
  url.value = URL.createObjectURL(file);
};
onBeforeUnmount(() => url.value && URL.revokeObjectURL(url.value));

const el = useTemplateRef<HTMLElement>('el');
// One image: a drag of several files, or of a PDF, is refused while it is held over.
const { isOver, isAccepting } = makeDroppable(el, {
  external: { files: 'image/*', multiple: false },
  onDrop: (e) => show(e.external!.files[0]!),
});

const hint = computed(() => {
  if (!isOver.value) return url.value ? 'Drop another to replace it' : 'Drop an image here';
  return isAccepting.value ? 'Drop to set it' : 'One image only';
});

// Not everyone can drag files: the same, from a file picker.
const pick = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) show(file);
};
</script>

<template>
  <section ref="el" class="zone" :class="{ taking: isOver && isAccepting, refusing: isOver && !isAccepting }">
    <h4>Avatar</h4>
    <div class="avatar">
      <img v-if="url" :src="url" alt="Your avatar" />
      <svg v-else viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
    </div>
    <p class="hint">{{ hint }}</p>
    <label class="browse">
      Browse…
      <input type="file" accept="image/*" @change="pick" />
    </label>
  </section>
</template>

<style scoped>
.zone {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  padding: 14px;
  border: 1.5px dashed color-mix(in srgb, currentColor 22%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

/* Files it takes are held over it. */
.zone.taking {
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 10%, Canvas);
}

/* Files it refuses: the browser shows its no-drop cursor too. */
.zone.refusing {
  border-color: #ef4444;
  background: color-mix(in srgb, #ef4444 8%, Canvas);
}

h4 {
  align-self: flex-start;
  margin: 0 0 12px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

.avatar {
  display: grid;
  place-items: center;
  width: 96px;
  height: 96px;
  overflow: hidden;
  border-radius: 50%;
  background: color-mix(in srgb, currentColor 8%, Canvas);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar svg {
  width: 48px;
  height: 48px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  opacity: 0.4;
}

.hint {
  margin: 12px 0 10px;
  font-size: 12px;
  text-align: center;
  opacity: 0.7;
}

.browse {
  position: relative;
  padding: 6px 12px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 8%, Canvas);
  font-size: 12px;
  cursor: pointer;
}

.browse:focus-within {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

.browse input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
