<script setup lang="ts">
import { computed, inject } from 'vue';
import ColorField from './ColorField.vue';
import Icon from './Icon.vue';
import ImageArt from './ImageArt.vue';
import NumberField from './NumberField.vue';
import ToolButton from './ToolButton.vue';
import { KINDS, type Artwork, type Layer } from './design';
import { EDITOR, MOD } from './editor';
import type { Alignment } from './geometry';
import type { IconName } from './icons';

const editor = inject(EDITOR)!;
const { selected } = editor;

const single = computed(() => (selected.value.length === 1 ? selected.value[0]! : null));
const set = (patch: Partial<Layer>) => single.value && editor.update(single.value, patch);

/** The frame the selected layer is in: its position counts from the frame's corner. */
const frame = computed(() => (single.value ? editor.parentOf(single.value.id) : null));
// One layer lines up with its frame, several with each other.
const canAlign = computed(() => selected.value.length > 1 || !!frame.value);
const ALIGNMENTS: { alignment: Alignment; icon: IconName; label: string }[] = [
  { alignment: 'left', icon: 'align-left', label: 'Align left' },
  { alignment: 'center', icon: 'align-center', label: 'Align centre' },
  { alignment: 'right', icon: 'align-right', label: 'Align right' },
  { alignment: 'top', icon: 'align-top', label: 'Align top' },
  { alignment: 'middle', icon: 'align-middle', label: 'Align middle' },
  { alignment: 'bottom', icon: 'align-bottom', label: 'Align bottom' },
];

const SWATCHES = ['#0f172a', '#64748b', '#ffffff', '#0d99ff', '#6366f1', '#f43f5e', '#f59e0b', '#10b981'];
const WEIGHTS = [
  { value: 400, name: 'Regular' },
  { value: 600, name: 'Semibold' },
  { value: 700, name: 'Bold' },
];
const TEXT_ALIGN = [
  { value: 'left', icon: 'text-left', label: 'Align text left' },
  { value: 'center', icon: 'text-center', label: 'Centre text' },
  { value: 'right', icon: 'text-right', label: 'Align text right' },
] as const;
const ARTWORKS: Artwork[] = ['mountains', 'portrait', 'dunes'];

const SHORTCUTS = [
  ['Move', 'Drag · Enter, arrows'],
  ['Select several', 'Shift-click · a box'],
  ['Drop copies', 'Alt while dropping'],
  ['Pan', 'Space-drag · wheel'],
  ['Zoom', `${MOD} + wheel`],
  ['Nudge', 'Arrows · Shift ×10'],
  ['Undo · redo', `${MOD} Z · ${MOD} Shift Z`],
  ['Duplicate · delete', `${MOD} D · Delete`],
];
</script>

<template>
  <section class="inspector" aria-label="Design">
    <header class="head">
      <template v-if="single">
        <Icon :name="single.kind" class="kind" />
        <h3>{{ single.name }}</h3>
        <span class="tag">{{ KINDS[single.kind].name }}</span>
      </template>
      <h3 v-else-if="selected.length">{{ selected.length }} layers</h3>
      <h3 v-else>Design</h3>
    </header>

    <div v-if="selected.length" class="sections">
      <div class="section">
        <div class="buttons">
          <ToolButton
            v-for="{ alignment, icon, label } in ALIGNMENTS"
            :key="alignment"
            :icon="icon"
            :label="label"
            :disabled="!canAlign"
            @click="editor.align(alignment)"
          />
        </div>
        <div class="buttons">
          <ToolButton icon="distribute-x" label="Distribute horizontally" :disabled="selected.length < 3" @click="editor.distribute('x')" />
          <ToolButton icon="distribute-y" label="Distribute vertically" :disabled="selected.length < 3" @click="editor.distribute('y')" />
          <span class="gap" />
          <ToolButton icon="copy" label="Duplicate" :shortcut="`${MOD} D`" @click="editor.duplicate()" />
          <ToolButton icon="trash" label="Delete" shortcut="Del" @click="editor.remove()" />
        </div>
      </div>

      <template v-if="single">
        <div class="section">
          <h4>{{ frame ? `Position in ${frame.name}` : 'Position' }}</h4>
          <div class="pair">
            <NumberField label="X" name="X" :value="single.x" @change="set({ x: $event })" />
            <NumberField label="Y" name="Y" :value="single.y" @change="set({ y: $event })" />
            <NumberField label="W" name="Width" :value="single.width" :min="1" @change="set({ width: $event })" />
            <NumberField label="H" name="Height" :value="single.height" :min="1" @change="set({ height: $event })" />
            <NumberField
              v-if="single.kind !== 'ellipse' && single.kind !== 'text'"
              label="R"
              name="Corner radius"
              :value="single.radius"
              :min="0"
              @change="set({ radius: $event })"
            />
          </div>
        </div>

        <div v-if="single.kind === 'image'" class="section">
          <h4>Image</h4>
          <div class="artworks">
            <button
              v-for="art in ARTWORKS"
              :key="art"
              type="button"
              class="artwork"
              :aria-label="`Picture: ${art}`"
              :aria-pressed="single.image === art"
              @click="set({ image: art })"
            >
              <ImageArt :art="art" />
            </button>
          </div>
        </div>

        <div v-else class="section">
          <h4>{{ single.kind === 'text' ? 'Colour' : 'Fill' }}</h4>
          <ColorField :name="single.kind === 'text' ? 'Text colour' : 'Fill'" :value="single.fill" @change="set({ fill: $event })" />
          <div class="swatches">
            <button
              v-for="swatch in SWATCHES"
              :key="swatch"
              type="button"
              class="swatch"
              :style="{ background: swatch }"
              :aria-label="`Fill ${swatch}`"
              :aria-pressed="single.fill === swatch"
              @click="set({ fill: swatch })"
            />
          </div>
        </div>

        <div v-if="single.kind === 'text'" class="section">
          <h4>Text</h4>
          <textarea
            class="words"
            rows="2"
            aria-label="Text"
            :value="single.content"
            @input="set({ content: ($event.target as HTMLTextAreaElement).value })"
          />
          <div class="pair">
            <NumberField label="Aa" name="Font size" :value="single.fontSize ?? 12" :min="1" @change="set({ fontSize: $event })" />
            <select
              class="weight"
              aria-label="Font weight"
              :value="single.fontWeight"
              @change="set({ fontWeight: Number(($event.target as HTMLSelectElement).value) })"
            >
              <option v-for="weight in WEIGHTS" :key="weight.value" :value="weight.value">{{ weight.name }}</option>
            </select>
          </div>
          <div class="buttons">
            <ToolButton
              v-for="option in TEXT_ALIGN"
              :key="option.value"
              :icon="option.icon"
              :label="option.label"
              :pressed="single.align === option.value"
              @click="set({ align: option.value })"
            />
          </div>
        </div>
      </template>
    </div>

    <dl v-else class="shortcuts">
      <template v-for="[action, keys] in SHORTCUTS" :key="action">
        <dt>{{ action }}</dt>
        <dd>{{ keys }}</dd>
      </template>
    </dl>
  </section>
</template>

<style scoped>
.inspector {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.head {
  display: flex;
  flex: none;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
}

h3 {
  flex: 1;
  min-width: 0;
  margin: 0;
  overflow: hidden;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.kind {
  width: 14px;
  height: 14px;
  color: #0d99ff;
}

.tag {
  color: var(--dc-muted);
  font-size: 10px;
}

.sections {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px 12px;
  border-top: 1px solid var(--dc-line);
}

h4 {
  margin: 0;
  overflow: hidden;
  color: var(--dc-muted);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.buttons .gap {
  flex: 1;
}

.pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.swatch {
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.14);
  cursor: pointer;
  transition: transform 0.12s;
}

.swatch:hover {
  transform: scale(1.15);
}

.swatch[aria-pressed='true'] {
  box-shadow:
    inset 0 0 0 1px rgb(0 0 0 / 0.14),
    0 0 0 2px var(--dc-panel),
    0 0 0 3.5px #0d99ff;
}

.swatch:focus-visible,
.artwork:focus-visible {
  outline: 2px solid #0d99ff;
  outline-offset: 2px;
}

.artworks {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.artwork {
  height: 40px;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0.75;
  transition: opacity 0.12s;
}

.artwork:hover,
.artwork[aria-pressed='true'] {
  opacity: 1;
}

.artwork[aria-pressed='true'] {
  box-shadow: 0 0 0 2px #0d99ff;
}

.words,
.weight {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  border: 1px solid transparent;
  border-radius: 6px;
  outline: none;
  background: var(--dc-field);
  color: inherit;
  font: inherit;
  font-size: 12px;
}

.words {
  padding: 6px 8px;
  resize: vertical;
}

.weight {
  height: 28px;
  padding: 0 6px;
}

.words:hover,
.weight:hover {
  border-color: var(--dc-line);
}

.words:focus,
.weight:focus {
  border-color: #0d99ff;
}

.shortcuts {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px 12px;
  margin: 0;
  padding: 10px 12px 14px;
  overflow: auto;
  border-top: 1px solid var(--dc-line);
  font-size: 11px;
}

dt {
  color: var(--dc-muted);
}

dd {
  margin: 0;
  text-align: right;
}

@media (prefers-reduced-motion: reduce) {
  .swatch,
  .artwork {
    transition: none;
  }
}
</style>
