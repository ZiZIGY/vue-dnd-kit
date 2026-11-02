var e=[{name:`index.vue`,lang:`vue`,code:`<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import ReadingList from './ReadingList.vue';
<\/script>

<template>
  <DnDProvider>
    <ReadingList />
  </DnDProvider>
</template>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> DnDProvider </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> ReadingList </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './ReadingList.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;DnDProvider></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;ReadingList</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/DnDProvider></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span></code></pre>`},{name:`BookRow.vue`,lang:`vue`,code:`<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{
  book: { id: string; title: string; author: string };
  index: number;
  count: number;
  /** Take the focus: the row before it was just marked as read. */
  focused: boolean;
}>();
const emit = defineEmits<{ move: [to: number]; finish: [] }>();

const el = useTemplateRef<HTMLElement>('el');
// The grip drags (pointer and keyboard); the buttons move without dragging.
makeSortableItem(el, { item: () => props.book, handle: '.grip' });

const up = useTemplateRef<HTMLButtonElement>('up');
const down = useTemplateRef<HTMLButtonElement>('down');
const done = useTemplateRef<HTMLButtonElement>('done');

const move = async (direction: 'up' | 'down') => {
  emit('move', direction === 'up' ? props.index - 1 : props.index + 1);
  await nextTick();
  // Moving the row in the DOM loses the focus: put it back on the same button, or on
  // the other one when this one is now disabled (the top or the bottom of the list).
  const same = direction === 'up' ? up.value : down.value;
  const other = direction === 'up' ? down.value : up.value;
  (same?.disabled ? other : same)?.focus();
};

watch(
  () => props.focused,
  (value) => value && done.value?.focus(),
  { flush: 'post' },
);
<\/script>

<template>
  <li ref="el" class="book">
    <button type="button" class="grip" :aria-label="\`Drag \${book.title}\`">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5h.01M10 3.5h.01M6 8h.01M10 8h.01M6 12.5h.01M10 12.5h.01" /></svg>
    </button>
    <span class="text">
      <span class="title">{{ book.title }}</span>
      <span class="author">{{ book.author }}</span>
    </span>
    <span class="actions">
      <button ref="up" type="button" :disabled="index === 0" :aria-label="\`Move \${book.title} up\`" @click="move('up')">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 10 4-4 4 4" /></svg>
      </button>
      <button
        ref="down"
        type="button"
        :disabled="index === count - 1"
        :aria-label="\`Move \${book.title} down\`"
        @click="move('down')"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
      </button>
      <button ref="done" type="button" class="done" :aria-label="\`Mark \${book.title} as read\`" @click="emit('finish')">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>
      </button>
    </span>
  </li>
</template>

<style scoped>
.book {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px 7px 4px;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
}

.book[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 70%, transparent);
}

/* \`opacity\`, not \`visibility: hidden\`: a hidden grip would lose the keyboard focus. */
.book[data-dnd-placeholder] > * {
  opacity: 0;
}

.text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.title {
  font-size: 13px;
  font-weight: 600;
}

.author {
  overflow: hidden;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.55;
}

.actions {
  display: flex;
  gap: 2px;
}

button {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: color-mix(in srgb, currentColor 10%, transparent);
}

button:disabled {
  cursor: default;
  opacity: 0.25;
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.grip {
  width: 24px;
  cursor: grab;
}

.done:hover {
  color: #42b883;
}

svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.grip svg {
  stroke-width: 2.6;
  opacity: 0.5;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> nextTick</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> watch </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> makeSortableItem </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> defineProps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> author</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> };</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  index</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> number</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  count</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> number</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">  /** Take the focus: the row before it was just marked as read. */</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  focused</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> boolean</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}>();</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> emit </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> defineEmits</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> move</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">to</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> number</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">];</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> finish</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> []</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }>();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> el </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'el'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// The grip drags (pointer and keyboard); the buttons move without dragging.</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">makeSortableItem</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">el</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> item</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> handle</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '.grip'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> up </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLButtonElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'up'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> down </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLButtonElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'down'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> done </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLButtonElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'done'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> move</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> async</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> (</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">direction</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'up'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> |</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'down'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  emit</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'move'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> direction </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">===</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'up'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ?</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">index </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">-</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">index </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">+</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">  await</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> nextTick</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">();</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">  // Moving the row in the DOM loses the focus: put it back on the same button, or on</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">  // the other one when this one is now disabled (the top or the bottom of the list).</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">  const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> same </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> direction </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">===</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'up'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ?</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> up</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> down</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">  const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> other </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> direction </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">===</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'up'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ?</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> down</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> up</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  (</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">same</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">disabled </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> other </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> same</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)?.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">focus</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">();</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">};</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">watch</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">focused</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  (</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> value </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x26;&#x26;</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> done</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">focus</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(),</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> flush</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'post'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;li</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"el"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"book"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;button</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> type</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"button"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"grip"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :aria-label</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"\`Drag \${book.title}\`"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;svg</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> viewBox</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"0 0 16 16"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> aria-hidden</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"true"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">>&#x3C;path</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> d</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"M6 3.5h.01M10 3.5h.01M6 8h.01M10 8h.01M6 12.5h.01M10 12.5h.01"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> />&#x3C;/svg></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/button></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"text"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"title"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ book.title }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/span></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"author"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ book.author }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/span></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/span></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"actions"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;button</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"up"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> type</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"button"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :disabled</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"index === 0"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :aria-label</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"\`Move \${book.title} up\`"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> @click</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"move('up')"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;svg</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> viewBox</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"0 0 16 16"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> aria-hidden</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"true"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">>&#x3C;path</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> d</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"m4 10 4-4 4 4"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> />&#x3C;/svg></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;/button></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;button</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">        ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"down"</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">        type</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"button"</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">        :disabled</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"index === count - 1"</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">        :aria-label</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"\`Move \${book.title} down\`"</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">        @click</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"move('down')"</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      ></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;svg</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> viewBox</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"0 0 16 16"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> aria-hidden</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"true"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">>&#x3C;path</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> d</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"m4 6 4 4 4-4"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> />&#x3C;/svg></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;/button></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;button</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"done"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> type</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"button"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"done"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :aria-label</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"\`Mark \${book.title} as read\`"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> @click</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"emit('finish')"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;svg</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> viewBox</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"0 0 16 16"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> aria-hidden</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"true"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">>&#x3C;path</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> d</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"m3.5 8.5 3 3 6-7"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> />&#x3C;/svg></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;/button></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/span></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/li></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 7</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 7</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 4</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Canvas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-shadow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">data-dnd-placeholder</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-shadow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> inset</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1.5</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883 </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">70</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">/* \`opacity\`, not \`visibility: hidden\`: a hidden grip would lose the keyboard focus. */</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">data-dnd-placeholder</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ></span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> *</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">text</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-direction</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> column</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  min-width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-size</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 13</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-weight</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 600</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">author</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  overflow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> hidden</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-size</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  white-space</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> nowrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  text-overflow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> ellipsis</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.55</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">actions</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">button</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> grid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  place-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 30</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 30</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 7</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  color</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> inherit</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  cursor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> pointer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">button</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">hover</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">not</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">disabled</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">button</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">disabled</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  cursor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> default</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.25</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">button</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">focus-visible</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline-offset</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> -2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">grip</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 24</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  cursor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> grab</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">done</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">hover</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  color</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">svg</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  fill</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1.8</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-linecap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> round</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-linejoin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> round</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">grip</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> svg</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2.6</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.5</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`ReadingList.vue`,lang:`vue`,code:`<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import BookRow from './BookRow.vue';

const books = ref([
  { id: 'dune', title: 'Dune', author: 'Frank Herbert' },
  { id: 'emma', title: 'Emma', author: 'Jane Austen' },
  { id: 'beloved', title: 'Beloved', author: 'Toni Morrison' },
  { id: 'solaris', title: 'Solaris', author: 'Stanisław Lem' },
]);

const list = useTemplateRef<HTMLElement>('list');
// \`animateChanges\`: moves made by the buttons (no drag) slide too, and stay still for users
// who ask for reduced motion.
const { items } = makeSortableList(list, { id: 'reading', items: books, animateChanges: true });

// Buttons change the data, not a drag: the provider says nothing, so this region does.
const message = ref('');

const move = (from: number, to: number) => {
  const next = [...books.value];
  const [book] = next.splice(from, 1);
  next.splice(to, 0, book!);
  books.value = next;
  message.value = \`\${book!.title} moved to position \${to + 1} of \${next.length}.\`;
};

// The row of the book marked as read goes away, and its focus with it: the next row
// (or the last one) takes it.
const focused = ref<string | null>(null);
const finish = (index: number) => {
  const [book] = books.value.splice(index, 1);
  message.value = \`\${book!.title} marked as read. \${books.value.length} left.\`;
  focused.value = books.value[Math.min(index, books.value.length - 1)]?.id ?? null;
};
<\/script>

<template>
  <section class="reading">
    <h3>Up next</h3>
    <ol ref="list" class="books">
      <BookRow
        v-for="(book, index) in items"
        :key="book.id"
        :book="book"
        :index="index"
        :count="items.length"
        :focused="focused === book.id"
        @move="(to) => move(index, to)"
        @finish="finish(index)"
      />
    </ol>
    <p v-if="!items.length" class="empty">All read.</p>
    <p class="status" role="status">{{ message }}</p>
  </section>
</template>

<style scoped>
.reading {
  width: min(100%, 420px);
  margin: 0 auto;
}

h3 {
  margin: 0 4px 10px;
  font-size: 13px;
  font-weight: 600;
}

.books {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.empty {
  margin: 0;
  padding: 18px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  font-size: 13px;
  text-align: center;
  opacity: 0.6;
}

.status {
  min-height: 17px;
  margin: 12px 4px 0;
  font: 11px/1.5 ui-monospace, Menlo, Consolas, monospace;
  color: #42b883;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useTemplateRef </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> makeSortableList </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> BookRow </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './BookRow.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> books </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">([</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'dune'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Dune'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> author</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Frank Herbert'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'emma'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Emma'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> author</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Jane Austen'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'beloved'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Beloved'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> author</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Toni Morrison'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'solaris'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Solaris'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> author</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Stanisław Lem'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> list </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'list'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// \`animateChanges\`: moves made by the buttons (no drag) slide too, and stay still for users</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// who ask for reduced motion.</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> items </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> makeSortableList</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">list</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'reading'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> books</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> animateChanges</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> true</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// Buttons change the data, not a drag: the provider says nothing, so this region does.</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> message </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">''</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> move</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> (</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">from</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> number</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> to</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> number</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">  const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> next </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [...</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">books</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">];</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">  const</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> next</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">splice</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">from</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  next</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">splice</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">to</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">!);</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  books</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> next</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  message</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> \`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">!.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> moved to position </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">to </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">+</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> of </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">next</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">length</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">.\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">};</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// The row of the book marked as read goes away, and its focus with it: the next row</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// (or the last one) takes it.</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> focused </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> |</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> null</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">null</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> finish</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> (</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">index</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> number</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">  const</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> books</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">splice</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">index</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  message</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> \`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">!.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> marked as read. </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">books</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">length</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> left.\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  focused</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> books</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">Math</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">min</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">index</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> books</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">length </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">-</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)]?.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">id </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">??</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> null</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">};</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;section</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"reading"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;h3></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">Up next</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/h3></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;ol</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"list"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"books"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;BookRow</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">        v-for</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> index</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> in</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> items</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">        :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">key</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">id</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">        :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">book</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">        :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">index</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">index</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">        :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">count</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">length</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">        :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">focused</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">focused </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">===</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> book</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">id</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">        @</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">move</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">to</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> move</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">index</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> to</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">        @</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">finish</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">finish</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">index</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/ol></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;p</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-if</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"!items.length"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"empty"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">All read.</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/p></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;p</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"status"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> role</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"status"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ message }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/p></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/section></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">reading</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> min</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">100</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 420</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> auto</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">h3</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 4</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-size</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 13</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-weight</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 600</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">books</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-direction</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> column</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 6</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  list-style</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">empty</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 18</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 5</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-size</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 13</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  text-align</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.6</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">status</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  min-height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 17</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 4</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 11</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">/</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">1.5</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> ui-monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Menlo</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Consolas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  color</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`}];export{e as default};