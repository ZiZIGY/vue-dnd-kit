<script setup lang="ts">
import { ref } from 'vue';
import { useDnDMonitor } from '@vue-dnd-kit/core';
import Track from './Track.vue';

const SECOND = 36; // pixels per second
const SECONDS = 12;
const TRACKS = ['video', 'audio'];

const clips = ref([
  { id: 'intro', name: 'Intro', track: 'video', start: 0, length: 3, hue: 205 },
  { id: 'scene', name: 'Scene 1', track: 'video', start: 4, length: 5, hue: 265 },
  { id: 'music', name: 'Music', track: 'audio', start: 1, length: 7, hue: 150 },
  { id: 'voice', name: 'Voice', track: 'audio', start: 9, length: 2.5, hue: 30 },
]);
const locked = ref(true);

// A clip lands where it was dropped, on the track it was dropped on, to a quarter second.
useDnDMonitor({
  onDragEnd({ active, over, position }) {
    const clip = clips.value.find((item) => item.id === active.id);
    if (!clip || !over || !position) return;
    clip.track = String(over.id);
    clip.start = Math.max(0, Math.round((position.x / SECOND) * 4) / 4);
  },
});
</script>

<template>
  <div class="editor">
    <label class="switch">
      <input v-model="locked" type="checkbox" />
      Keep clips on their track: <code>axis: 'x'</code>
    </label>
    <div class="timeline" :style="{ '--second': `${SECOND}px`, '--seconds': SECONDS }">
      <div class="ruler" aria-hidden="true">
        <span v-for="second in SECONDS" :key="second">{{ second - 1 }}s</span>
      </div>
      <Track
        v-for="track in TRACKS"
        :id="track"
        :key="track"
        :clips="clips.filter((clip) => clip.track === track)"
        :locked="locked"
      />
    </div>
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.switch {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.switch input {
  accent-color: #42b883;
}

code {
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.7;
}

.timeline {
  overflow-x: auto;
  padding: 10px;
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 4%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
}

.ruler {
  display: flex;
  margin-left: 64px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.ruler span {
  flex: none;
  width: var(--second);
  padding: 0 0 6px 3px;
  box-sizing: border-box;
  border-left: 1px solid color-mix(in srgb, currentColor 30%, transparent);
}
</style>
