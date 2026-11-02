var e=[{name:`index.vue`,lang:`vue`,code:`<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import Tasks from './Tasks.vue';
import StatePanel from './StatePanel.vue';
<\/script>

<template>
  <!-- One provider: the list drags, the panel reads the drag. Neither imports the other. -->
  <DnDProvider>
    <div class="demo">
      <Tasks />
      <StatePanel />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 24px;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> DnDProvider </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Tasks </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './Tasks.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> StatePanel </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './StatePanel.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">  &#x3C;!-- One provider: the list drags, the panel reads the drag. Neither imports the other. --></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;DnDProvider></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"demo"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;Tasks</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;StatePanel</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/DnDProvider></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">demo</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-wrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> wrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex-start</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  justify-content</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 24</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`StatePanel.vue`,lang:`vue`,code:`<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDnD, useDnDMonitor } from '@vue-dnd-kit/core';

// The drag as reactive state, anywhere under the provider.
const { status, active, over, pointer } = useDnD();

const rows = computed(() => [
  { name: 'status', value: status.value },
  { name: 'active', value: active.value?.id ?? '—' },
  { name: 'over', value: over.value?.id ?? '—' },
  { name: 'pointer', value: pointer.value ? \`\${Math.round(pointer.value.x)}, \${Math.round(pointer.value.y)}\` : '—' },
]);

// Every drag's events, wherever it starts. The newest first.
const events = ref<{ id: number; text: string }[]>([]);
let count = 0;
const log = (text: string) => {
  events.value = [{ id: ++count, text }, ...events.value].slice(0, 5);
};

useDnDMonitor({
  onDragStart: ({ active }) => log(\`start   \${active.id}\`),
  onDragOver: ({ over }) => log(\`over    \${over?.id ?? '—'}\`),
  onDragEnd: ({ active, over }) => log(\`end     \${active.id} → \${over?.id ?? '—'}\`),
  onDragCancel: ({ active }) => log(\`cancel  \${active.id}\`),
});
<\/script>

<template>
  <section class="panel">
    <h4>useDnD()</h4>
    <dl>
      <template v-for="row in rows" :key="row.name">
        <dt>{{ row.name }}</dt>
        <dd :class="{ live: row.value !== '—' && row.value !== 'idle' }">{{ row.value }}</dd>
      </template>
    </dl>
    <h4>useDnDMonitor()</h4>
    <ol class="events">
      <li v-for="event in events" :key="event.id">{{ event.text }}</li>
      <li v-if="!events.length" class="empty">No events yet</li>
    </ol>
  </section>
</template>

<style scoped>
.panel {
  box-sizing: border-box;
  width: 260px;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font: 12px/1.6 ui-monospace, Menlo, Consolas, monospace;
}

h4 {
  margin: 0 0 6px;
  font: inherit;
  font-weight: 600;
  opacity: 0.55;
}

dl {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2px 16px;
  margin: 0 0 14px;
}

dt {
  opacity: 0.55;
}

dd {
  overflow: hidden;
  margin: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
}

dd.live {
  color: #42b883;
}

.events {
  min-height: 96px;
  margin: 0;
  padding: 0;
  list-style: none;
  white-space: pre;
}

.events li:first-child {
  color: #42b883;
}

.events li.empty {
  color: inherit;
  opacity: 0.45;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> computed</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> ref </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useDnD</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useDnDMonitor </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// The drag as reactive state, anywhere under the provider.</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> status</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> active</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> over</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> pointer </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useDnD</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> rows </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> computed</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'status'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> status</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">},</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'active'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> active</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">id </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">??</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '—'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'over'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> over</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">id </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">??</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '—'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'pointer'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> pointer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> \`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">Math</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">round</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">pointer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">x</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">, </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">Math</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">round</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">pointer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">y</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '—'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// Every drag's events, wherever it starts. The newest first.</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> events </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> number</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> text</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }[]>([]);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">let</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> count </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> log</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> (</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">text</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">  events</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [{</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ++</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">count</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> text </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">},</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ...</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">events</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">].</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">slice</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 5</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">};</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">useDnDMonitor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">({</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  onDragStart</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ({</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> active</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> })</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> log</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`start   </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">active</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  onDragOver</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ({</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> over</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> })</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> log</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`over    </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">over</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">id </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">??</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '—'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  onDragEnd</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ({</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> active</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> over</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> })</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> log</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`end     </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">active</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> → </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">over</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">id </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">??</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '—'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  onDragCancel</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ({</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> active</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> })</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> log</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`cancel  </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">active</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">});</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;section</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"panel"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;h4></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">useDnD()</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/h4></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;dl></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;template</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> v-for</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">row </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">in</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> rows</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">key</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">row</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">name</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;dt></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ row.name }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/dt></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;dd</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"{ live: row.value !== '—' &#x26;&#x26; row.value !== 'idle' }"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ row.value }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/dd></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;/template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/dl></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;h4></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">useDnDMonitor()</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/h4></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;ol</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"events"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;li</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-for</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"event in events"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :key</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"event.id"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ event.text }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/li></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;li</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-if</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"!events.length"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"empty"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">No events yet</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/li></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/ol></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/section></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">panel</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-sizing</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> border-box</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 260</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 14</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 3</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> Canvas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">/</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">1.6</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> ui-monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Menlo</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Consolas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">h4</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 6</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> inherit</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-weight</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 600</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.55</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">dl</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> grid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  grid-template-columns</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> auto</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">fr</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 14</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">dt</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.55</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">dd</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  overflow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> hidden</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  white-space</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> nowrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  text-overflow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> ellipsis</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">dd</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">live</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  color</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">events</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  min-height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 96</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  list-style</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  white-space</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> pre</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">events</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> li</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">first-child</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  color</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">events</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> li</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">empty</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  color</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> inherit</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.45</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`TaskRow.vue`,lang:`vue`,code:`<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: { id: string; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.task });
<\/script>

<template>
  <li ref="el" class="task">
    <span class="title">{{ task.title }}</span>
    <code>{{ task.id }}</code>
  </li>
</template>

<style scoped>
.task {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 14px;
  border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 4%, Canvas);
  font-size: 14px;
  cursor: grab;
  user-select: none;
}

.task:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

code {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useTemplateRef </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> makeSortableItem </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> defineProps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> task</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }>();</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> el </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'el'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">makeSortableItem</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">el</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> item</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">task </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">});</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;li</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"el"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"task"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"title"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ task.title }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/span></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;code></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ task.id }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/code></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/li></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">task</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  justify-content</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> space-between</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 11</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 14</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 4</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> Canvas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-size</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 14</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  cursor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> grab</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  user-select</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">task</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">focus-visible</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline-offset</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">code</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 11</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">/</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">1</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> ui-monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Menlo</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Consolas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.5</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`Tasks.vue`,lang:`vue`,code:`<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import TaskRow from './TaskRow.vue';

const tasks = ref([
  { id: 'design', title: 'Design the board' },
  { id: 'build', title: 'Build the list' },
  { id: 'test', title: 'Test the drops' },
  { id: 'ship', title: 'Ship it' },
]);

const list = useTemplateRef<HTMLElement>('list');
// \`id\` names the list in the drag state: \`over\` reads \`tasks\` while a task is over it.
const { items } = makeSortableList(list, { id: 'tasks', items: tasks });
<\/script>

<template>
  <ul ref="list" class="tasks">
    <TaskRow v-for="task in items" :key="task.id" :task="task" />
  </ul>
</template>

<style scoped>
.tasks {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 240px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useTemplateRef </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> makeSortableList </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> TaskRow </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './TaskRow.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> tasks </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">([</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'design'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Design the board'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'build'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Build the list'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'test'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Test the drops'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'ship'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Ship it'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> list </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'list'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// \`id\` names the list in the drag state: \`over\` reads \`tasks\` while a task is over it.</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> items </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> makeSortableList</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">list</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'tasks'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> tasks </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">});</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;ul</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"list"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"tasks"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;TaskRow</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> v-for</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">task </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">in</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> items</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">key</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">task</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">id</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">task</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">task</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/ul></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">tasks</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-direction</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> column</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 6</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 240</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  list-style</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`}];export{e as default};