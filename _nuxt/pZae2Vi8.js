var e=[{name:`index.vue`,lang:`vue`,code:`<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import MenuTree from './MenuTree.vue';
import Template from './Template.vue';
<\/script>

<template>
  <DnDProvider>
    <div class="editor">
      <aside class="templates">
        <h3>Add</h3>
        <Template title="Page" kind="page" />
        <Template title="Link" kind="link" />
        <Template title="Group" kind="group" />
      </aside>
      <MenuTree />
    </div>
  </DnDProvider>
</template>

<style scoped>
.editor {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
}

.templates {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 120px;
}

h3 {
  margin: 0 0 2px;
  font: 600 10px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> DnDProvider </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> MenuTree </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './MenuTree.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Template </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './Template.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;DnDProvider></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"editor"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;aside</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"templates"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;h3></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">Add</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/h3></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;Template</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"Page"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"page"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;Template</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"Link"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"link"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;Template</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"Group"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"group"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;/aside></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;MenuTree</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/DnDProvider></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">editor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-wrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> wrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex-start</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  justify-content</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 20</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">templates</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-direction</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> column</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 120</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">h3</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 600</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">/</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">1</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> ui-monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Menlo</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Consolas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  letter-spacing</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.08</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">em</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  text-transform</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> uppercase</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.55</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`MenuRow.vue`,lang:`vue`,code:`<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem, type FlatNode } from '@vue-dnd-kit/core';

const props = defineProps<{
  node: FlatNode<{ id: string; title: string; kind: 'page' | 'link' | 'group' }>;
  indent: number;
}>();
const el = useTemplateRef<HTMLElement>('el');
const { indicator } = makeSortableItem(el, { id: () => props.node.key });

// Where the drop goes, around this row: \`inside\` it (its first child), or a line
// \`before\` / \`after\` it, starting at the indentation of the level the drop lands at
// (measured from this row, which is indented to its own level).
const inside = computed(() => indicator.value?.side === 'inside');
const line = computed(() => {
  const value = indicator.value;
  if (!value || value.side === 'inside') return null;
  return { side: value.side, left: \`\${((value.depth ?? 0) - props.node.depth) * props.indent}px\` };
});
<\/script>

<template>
  <div ref="el" class="item" :class="{ inside }" :style="{ marginLeft: \`\${node.depth * indent}px\` }">
    <svg class="icon" viewBox="0 0 16 16" aria-hidden="true">
      <path v-if="node.item.kind === 'page'" d="M4 1.5h5l3 3v10H4zM9 1.5V5h3" />
      <path v-else-if="node.item.kind === 'link'" d="M6 3.5H3.5v9h9V10M9 2.5h4.5V7M13.5 2.5 7.5 8.5" />
      <path v-else d="M2.5 4h11M2.5 8h11M2.5 12h7" />
    </svg>
    <span class="title">{{ node.item.title }}</span>
    <span class="kind">{{ node.item.kind }}</span>
    <span v-if="line" class="line" :class="line.side" :style="{ left: line.left }" />
  </div>
</template>

<style scoped>
.item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
  transition:
    background 0.15s,
    box-shadow 0.15s;
}

.item:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The row the drop goes into. */
.item.inside {
  background: color-mix(in srgb, #42b883 14%, Canvas);
  box-shadow: 0 0 0 1.5px #42b883;
}

/* The dragged row stays where it is: dim it. */
.item[data-dnd-placeholder] {
  opacity: 0.35;
}

.icon {
  flex: none;
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.7;
}

.title {
  flex: 1;
  font-weight: 500;
}

.kind {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.45;
}

/* The insertion line, in the 4px gap between rows, from the drop's level to the right edge. */
.line {
  position: absolute;
  right: 0;
  height: 2px;
  border-radius: 1px;
  background: #42b883;
  pointer-events: none;
}

.line::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -4px;
  width: 8px;
  height: 8px;
  box-sizing: border-box;
  border: 2px solid #42b883;
  border-radius: 50%;
  background: Canvas;
}

.line.before {
  top: -3px;
}

.line.after {
  bottom: -3px;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> computed</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useTemplateRef </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> makeSortableItem</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> type</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> FlatNode </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> defineProps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  node</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> FlatNode</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'page'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> |</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'link'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> |</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'group'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }>;</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  indent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> number</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}>();</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> el </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'el'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> indicator </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> makeSortableItem</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">el</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">node</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">key </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">});</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// Where the drop goes, around this row: \`inside\` it (its first child), or a line</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// \`before\` / \`after\` it, starting at the indentation of the level the drop lands at</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// (measured from this row, which is indented to its own level).</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> inside </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> computed</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> indicator</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">side </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">===</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'inside'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> line </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> computed</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">  const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> value </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> indicator</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">  if</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> (!</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">||</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">side </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">===</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'inside'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> return</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> null</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">  return</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> side</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">side</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> left</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> \`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">((</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">depth </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">??</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> -</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">node</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">depth</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> *</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">indent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">px\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> };</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">});</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"el"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"item"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"{ inside }"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :style</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"{ marginLeft: \`\${node.depth * indent}px\` }"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;svg</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"icon"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> viewBox</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"0 0 16 16"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> aria-hidden</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"true"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;path</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-if</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"node.item.kind === 'page'"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> d</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"M4 1.5h5l3 3v10H4zM9 1.5V5h3"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;path</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-else-if</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"node.item.kind === 'link'"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> d</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"M6 3.5H3.5v9h9V10M9 2.5h4.5V7M13.5 2.5 7.5 8.5"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;path</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-else</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> d</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"M2.5 4h11M2.5 8h11M2.5 12h7"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/svg></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"title"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ node.item.title }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/span></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"kind"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ node.item.kind }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/span></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-if</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"line"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"line"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"line.side"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :style</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"{ left: line.left }"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> /</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">item</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  position</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> relative</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 9</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 36</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Canvas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-shadow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-size</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 13</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  cursor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> grab</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  user-select</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  transition</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">    background </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.15</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">s</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">    box-shadow </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.15</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">s</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">item</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">focus-visible</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline-offset</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">/* The row the drop goes into. */</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">item</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">inside</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883 </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">14</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> Canvas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-shadow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1.5</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">/* The dragged row stays where it is: dim it. */</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">item</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">data-dnd-placeholder</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.35</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">icon</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 15</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 15</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  fill</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1.4</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-linecap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> round</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-linejoin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> round</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.7</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-weight</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 500</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">/</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">1</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> ui-monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Menlo</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Consolas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.45</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">/* The insertion line, in the 4px gap between rows, from the drop's level to the right edge. */</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">line</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  position</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> absolute</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  right</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  pointer-events</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">line</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">::</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">before</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  content</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> ''</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  position</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> absolute</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  top</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> -3</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  left</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> -4</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-sizing</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> border-box</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 50</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Canvas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">line</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">before</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  top</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> -3</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">line</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">after</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  bottom</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> -3</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`MenuTree.vue`,lang:`vue`,code:`<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableTree } from '@vue-dnd-kit/core';
import MenuRow from './MenuRow.vue';

interface MenuItem {
  id: string;
  title: string;
  kind: 'page' | 'link' | 'group';
  children?: MenuItem[];
}

const menu = ref<MenuItem[]>([
  { id: 'home', title: 'Home', kind: 'page' },
  {
    id: 'products',
    title: 'Products',
    kind: 'group',
    children: [
      { id: 'analytics', title: 'Analytics', kind: 'page' },
      { id: 'billing', title: 'Billing', kind: 'page' },
    ],
  },
  { id: 'pricing', title: 'Pricing', kind: 'page' },
  { id: 'company', title: 'Company', kind: 'group', children: [{ id: 'careers', title: 'Careers', kind: 'link' }] },
]);

const INDENT = 24;
let created = 0;
const root = useTemplateRef<HTMLElement>('root');
const { items } = makeSortableTree(root, {
  items: menu,
  indentation: INDENT,
  // The tree stays still while dragging: each row draws the line from its \`indicator\`.
  placeholder: 'indicator',
  // A menu bar with dropdowns: two levels, and links open no dropdown.
  maxDepth: 1,
  canNest: (_item, parent) => parent.kind !== 'link',
  // A template dragged in from the side becomes a new item, where the line is.
  createItem: (active) => {
    const template = active.data as Pick<MenuItem, 'title' | 'kind'>;
    return { id: \`new-\${++created}\`, title: \`New \${template.title.toLowerCase()}\`, kind: template.kind };
  },
});
<\/script>

<template>
  <section class="builder">
    <!-- The menu as visitors see it: the saved data, not the draft. -->
    <nav class="preview" aria-label="Preview">
      <span v-for="item in menu" :key="item.id" class="entry">
        {{ item.title }}<span v-if="item.children?.length" class="caret" aria-hidden="true">▾</span>
      </span>
    </nav>
    <div ref="root" class="menu">
      <MenuRow v-for="node in items" :key="node.key" :node="node" :indent="INDENT" />
    </div>
  </section>
</template>

<style scoped>
.builder {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(100%, 330px);
}

.preview {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  min-height: 36px;
  align-items: center;
  padding: 0 14px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font-size: 12px;
  font-weight: 600;
}

.caret {
  margin-left: 3px;
  font-size: 9px;
  opacity: 0.6;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 120px;
  padding: 8px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useTemplateRef </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> makeSortableTree </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> MenuRow </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './MenuRow.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">interface</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> MenuItem</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'page'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> |</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'link'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> |</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'group'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  children</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> MenuItem</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[];</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> menu </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">MenuItem</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[]>([</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'home'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Home'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'page'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'products'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Products'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'group'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    children</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">      {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'analytics'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Analytics'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'page'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">      {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'billing'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Billing'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'page'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">    ],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'pricing'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Pricing'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'page'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'company'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Company'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'group'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> children</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [{</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'careers'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Careers'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'link'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }]</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> INDENT </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 24</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">let</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> created </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> root </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'root'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> items </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> makeSortableTree</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">root</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> menu</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  indentation</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> INDENT</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">  // The tree stays still while dragging: each row draws the line from its \`indicator\`.</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  placeholder</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'indicator'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">  // A menu bar with dropdowns: two levels, and links open no dropdown.</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  maxDepth</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  canNest</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> (</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">_item</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> parent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> parent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">kind </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">!==</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'link'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">  // A template dragged in from the side becomes a new item, where the line is.</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  createItem</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> (</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">active</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">    const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> template </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> active</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">data </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">as</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> Pick</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">MenuItem</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'title'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> |</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'kind'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">    return</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> \`new-</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">++</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">created</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> \`New </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">template</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">toLowerCase</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">()</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> template</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">kind </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">};</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">});</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;section</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"builder"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">    &#x3C;!-- The menu as visitors see it: the saved data, not the draft. --></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;nav</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"preview"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> aria-label</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"Preview"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-for</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"item in menu"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :key</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"item.id"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"entry"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">        {{ item.title }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-if</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"item.children?.length"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"caret"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> aria-hidden</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"true"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">▾</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/span></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;/span></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/nav></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"root"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"menu"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;MenuRow</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> v-for</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">node </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">in</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> items</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">key</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">node</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">key</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">node</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">node</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">indent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">INDENT</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/section></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">builder</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-direction</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> column</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> min</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">100</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 330</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">preview</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-wrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> wrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 4</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 14</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  min-height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 36</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 14</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-size</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-weight</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 600</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">caret</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin-left</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 3</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-size</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 9</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.6</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">menu</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-direction</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> column</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 4</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  min-height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 120</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 3</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> Canvas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`Template.vue`,lang:`vue`,code:`<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ title: string; kind: 'page' | 'link' | 'group' }>();
const el = useTemplateRef<HTMLElement>('el');
// A plain draggable: it stays in the sidebar, the tree's \`createItem\` makes the new item.
makeDraggable(el, { id: () => \`template-\${props.kind}\`, data: () => ({ title: props.title, kind: props.kind }) });
<\/script>

<template>
  <div ref="el" class="template">
    <span class="plus" aria-hidden="true">+</span>
    {{ title }}
  </div>
</template>

<style scoped>
.template {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px 8px 8px;
  border: 1px dashed color-mix(in srgb, currentColor 28%, transparent);
  border-radius: 9px;
  background: Canvas;
  font-size: 13px;
  font-weight: 500;
  cursor: grab;
  user-select: none;
}

.template:hover {
  border-color: #42b883;
}

.template:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.plus {
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: color-mix(in srgb, #42b883 18%, transparent);
  color: #42b883;
  font-weight: 700;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useTemplateRef </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> makeDraggable </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> defineProps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'page'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> |</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'link'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> |</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'group'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }>();</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> el </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'el'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// A plain draggable: it stays in the sidebar, the tree's \`createItem\` makes the new item.</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">makeDraggable</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">el</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> \`template-</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> data</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ({</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> kind</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">kind </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">})</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> });</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"el"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"template"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"plus"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> aria-hidden</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"true"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">+</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/span></span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">    {{ title }}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">template</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> dashed</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 28</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 9</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Canvas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-size</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 13</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-weight</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 500</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  cursor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> grab</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  user-select</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">template</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">hover</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-color</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">template</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">focus-visible</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline-offset</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">plus</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> grid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  place-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 20</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 20</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 6</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883 </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">18</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  color</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-weight</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 700</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`}];export{e as default};