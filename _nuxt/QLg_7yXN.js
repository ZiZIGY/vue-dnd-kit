var e=[{name:`index.vue`,lang:`vue`,code:`<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import HomeScreen from './HomeScreen.vue';
<\/script>

<template>
  <DnDProvider>
    <HomeScreen />
  </DnDProvider>
</template>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> DnDProvider </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> HomeScreen </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './HomeScreen.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;DnDProvider></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;HomeScreen</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/DnDProvider></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span></code></pre>`},{name:`AppIcon.vue`,lang:`vue`,code:`<script setup lang="ts">
import { computed } from 'vue';

/** An app's icon: a rounded square with a gradient and a line drawing. */
const props = defineProps<{ id: string; lifted?: boolean }>();

// A gradient and a line drawing (SVG paths on a 24×24 grid) per app.
const icons: Record<string, { colors: [string, string]; paths: string[] }> = {
  mail: {
    colors: ['#6aaeff', '#2563eb'],
    paths: ['M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', 'm3.5 7 8.5 6 8.5-6'],
  },
  notes: {
    colors: ['#fde68a', '#f59e0b'],
    paths: ['M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M9 8h6M9 12h6M9 16h3'],
  },
  music: {
    colors: ['#fb7185', '#e11d48'],
    paths: ['M9 18V5l11-2v13', 'M3 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0', 'M14 16a3 3 0 1 0 6 0a3 3 0 1 0-6 0'],
  },
  maps: {
    colors: ['#86efac', '#16a34a'],
    paths: ['M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z', 'M9.5 10a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0'],
  },
  photos: {
    colors: ['#f0abfc', '#a855f7'],
    paths: [
      'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
      'M7 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
      'm21 15-5-5-11 10',
    ],
  },
  clock: {
    colors: ['#a1a1aa', '#3f3f46'],
    paths: ['M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0', 'M12 7v5l3 2'],
  },
  files: {
    colors: ['#7dd3fc', '#0284c7'],
    paths: ['M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'],
  },
  chat: {
    colors: ['#6ee7b7', '#2f9e6e'],
    paths: ['M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'],
  },
  camera: {
    colors: ['#71717a', '#18181b'],
    paths: [
      'M5 7h2l2-3h6l2 3h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z',
      'M8.5 13.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0',
    ],
  },
  calendar: {
    colors: ['#fca5a5', '#dc2626'],
    paths: ['M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', 'M3 10h18M8 3v4M16 3v4'],
  },
  weather: {
    colors: ['#fdba74', '#ea580c'],
    paths: [
      'M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0',
      'M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    ],
  },
  settings: {
    colors: ['#a5b4fc', '#4f46e5'],
    paths: ['M4 7h9M17 7h3M4 17h3M11 17h9', 'M13 7a2 2 0 1 0 4 0a2 2 0 1 0-4 0', 'M7 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0'],
  },
};

const icon = computed(() => icons[props.id]!);
<\/script>

<template>
  <span class="icon" :class="{ lifted }" :style="{ background: \`linear-gradient(160deg, \${icon.colors[0]}, \${icon.colors[1]})\` }">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path v-for="path in icon.paths" :key="path" :d="path" />
    </svg>
  </span>
</template>

<style scoped>
.icon {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 16px;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.35),
    inset 0 -2px 0 rgb(0 0 0 / 0.12),
    0 8px 18px -10px rgb(0 0 0 / 0.6);
  transition:
    scale 0.2s,
    box-shadow 0.2s;
}

/* Picked up: a little larger, higher above the page. */
.icon.lifted {
  scale: 1.12;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.35),
    0 22px 36px -14px rgb(0 0 0 / 0.7);
}

svg {
  width: 28px;
  height: 28px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> computed </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">/** An app's icon: a rounded square with a gradient and a line drawing. */</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> defineProps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> lifted</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> boolean</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }>();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// A gradient and a line drawing (SVG paths on a 24×24 grid) per app.</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> icons</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> Record</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">];</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[]</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  mail</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'#6aaeff'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '#2563eb'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'm3.5 7 8.5 6 8.5-6'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  notes</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'#fde68a'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '#f59e0b'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'M9 8h6M9 12h6M9 16h3'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  music</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'#fb7185'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '#e11d48'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'M9 18V5l11-2v13'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'M3 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'M14 16a3 3 0 1 0 6 0a3 3 0 1 0-6 0'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  maps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'#86efac'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '#16a34a'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'M9.5 10a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  photos</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'#f0abfc'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '#a855f7'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span></span>
<span class="line"><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">      'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">      'M7 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">      'm21 15-5-5-11 10'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">    ],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  clock</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'#a1a1aa'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '#3f3f46'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'M12 7v5l3 2'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  files</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'#7dd3fc'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '#0284c7'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  chat</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'#6ee7b7'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '#2f9e6e'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  camera</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'#71717a'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '#18181b'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span></span>
<span class="line"><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">      'M5 7h2l2-3h6l2 3h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">      'M8.5 13.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">    ],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  calendar</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'#fca5a5'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '#dc2626'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'M3 10h18M8 3v4M16 3v4'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  weather</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'#fdba74'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '#ea580c'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span></span>
<span class="line"><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">      'M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">      'M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">    ],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  settings</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    colors</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'#a5b4fc'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '#4f46e5'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">    paths</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'M4 7h9M17 7h3M4 17h3M11 17h9'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'M13 7a2 2 0 1 0 4 0a2 2 0 1 0-4 0'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'M7 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">],</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">};</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> icon </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> computed</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> icons</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]!);</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"icon"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"{ lifted }"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :style</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"{ background: \`linear-gradient(160deg, \${icon.colors[0]}, \${icon.colors[1]})\` }"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;svg</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> viewBox</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"0 0 24 24"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> aria-hidden</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"true"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;path</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-for</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"path in icon.paths"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :key</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"path"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :d</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"path"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/svg></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/span></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">icon</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> grid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  place-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 60</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 60</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-shadow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span></span>
<span class="line"><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">    inset</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> rgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">255</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 255</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 255</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> / </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.35</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span></span>
<span class="line"><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">    inset</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> -2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> rgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> / </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.12</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span></span>
<span class="line"><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">    0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 18</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> -10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> rgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> / </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.6</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  transition</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">    scale </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">s</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">    box-shadow </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">s</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">/* Picked up: a little larger, higher above the page. */</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">icon</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">lifted</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  scale</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1.12</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-shadow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span></span>
<span class="line"><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">    inset</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> rgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">255</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 255</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 255</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> / </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.35</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span></span>
<span class="line"><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">    0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 22</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 36</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> -14</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> rgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> / </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.7</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">svg</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 28</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 28</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  fill</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">fff</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1.8</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-linecap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> round</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-linejoin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> round</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`AppList.vue`,lang:`vue`,code:`<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import AppTile from './AppTile.vue';
import AppOverlay from './AppOverlay.vue';

type App = { id: string; name: string };
const apps = defineModel<App[]>({ required: true });
const props = defineProps<{ dock?: boolean; limit?: number }>();

// The grid and the dock: one group, so apps move between them. \`strategy\` says how each
// flows, in two dimensions or in a row. \`overlay\`: the icon alone follows the pointer.
const el = useTemplateRef<HTMLElement>('el');
const { items, isOver, isAccepting } = makeSortableList(el, {
  items: apps,
  // A full list takes no more apps; its own still sort.
  group: { name: 'home', put: ({ from, to }) => from === to || !props.limit || apps.value.length < props.limit },
  strategy: props.dock ? 'horizontal' : 'grid',
  overlay: AppOverlay,
});
<\/script>

<template>
  <div ref="el" :class="[dock ? 'dock' : 'grid', { full: isOver && !isAccepting }]">
    <AppTile v-for="app in items" :key="app.id" :app="app" :in-dock="dock" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 64px);
  gap: 20px 14px;
}

/* Room for four icons, whatever it holds. */
.dock {
  display: flex;
  gap: 14px;
  box-sizing: border-box;
  min-width: 298px;
  min-height: 88px;
  padding: 12px;
  border-radius: 22px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  transition: box-shadow 0.15s;
}

.dock.full {
  box-shadow: inset 0 0 0 1.5px #e5484d;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useTemplateRef </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> makeSortableList </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> AppTile </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './AppTile.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> AppOverlay </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './AppOverlay.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">type</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> App</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> };</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> apps </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> defineModel</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">App</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[]>({</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> required</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> true</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> });</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> defineProps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> dock</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> boolean</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> limit</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> number</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }>();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// The grid and the dock: one group, so apps move between them. \`strategy\` says how each</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// flows, in two dimensions or in a row. \`overlay\`: the icon alone follows the pointer.</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> el </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'el'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> isOver</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> isAccepting </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> makeSortableList</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">el</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> apps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">  // A full list takes no more apps; its own still sort.</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  group</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'home'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> put</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ({</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> from</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> to</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> })</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> from </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">===</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> to </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">||</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> !</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">limit </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">||</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> apps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">length </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">limit </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">},</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  strategy</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">dock </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'horizontal'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'grid'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  overlay</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> AppOverlay</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">});</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"el"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"[dock ? 'dock' : 'grid', { full: isOver &#x26;&#x26; !isAccepting }]"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;AppTile</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> v-for</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">app </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">in</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> items</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">key</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">app</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">id</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">app</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">app</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in-dock</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">dock</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">grid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> grid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  grid-template-columns</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> repeat</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">4</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 64</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 20</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 14</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">/* Room for four icons, whatever it holds. */</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">dock</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 14</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-sizing</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> border-box</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  min-width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 298</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  min-height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 88</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 22</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  transition</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> box-shadow </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.15</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">s</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">dock</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">full</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-shadow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> inset</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1.5</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">e5484d</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`AppOverlay.vue`,lang:`vue`,code:`<script setup lang="ts">
import { computed } from 'vue';
import type { DnDStatus, DragItem } from '@vue-dnd-kit/core';
import AppIcon from './AppIcon.vue';

// The app in hand: only its icon, lifted; the name stays behind.
// The overlay's props it needs (see \`OverlayProps\`): the dragged items and the status.
const props = defineProps<{ items: DragItem[]; status: DnDStatus }>();
const app = computed(() => props.items[0]?.item as { id: string } | undefined);
<\/script>

<template>
  <div class="overlay">
    <AppIcon v-if="app" :id="app.id" :lifted="status === 'dragging'" />
  </div>
</template>

<style scoped>
.overlay {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> computed </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> type</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> DnDStatus</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> DragItem </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> AppIcon </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './AppIcon.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// The app in hand: only its icon, lifted; the name stays behind.</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// The overlay's props it needs (see \`OverlayProps\`): the dragged items and the status.</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> defineProps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> DragItem</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[];</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> status</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> DnDStatus</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }>();</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> app </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> computed</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]?.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">item </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">as</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> |</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> undefined</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"overlay"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;AppIcon</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> v-if</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">app</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">app</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">id</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">lifted</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">status </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">===</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'dragging'"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">overlay</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  justify-content</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 100</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 100</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`AppTile.vue`,lang:`vue`,code:`<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import AppIcon from './AppIcon.vue';

const props = defineProps<{ app: { id: string; name: string }; inDock?: boolean }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.app });
<\/script>

<template>
  <div ref="el" class="tile">
    <AppIcon :id="app.id" />
    <!-- In the dock, the icon alone. -->
    <span v-if="!inDock" class="name">{{ app.name }}</span>
  </div>
</template>

<style scoped>
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: grab;
  user-select: none;
}

.name {
  font-size: 12px;
  opacity: 0.75;
}

.tile:focus-visible {
  outline: none;
}

.tile:focus-visible .icon {
  outline: 2px solid #42b883;
  outline-offset: 3px;
}

/* The slot the dragged app will land in. */
.tile[data-dnd-placeholder] {
  opacity: 1;
}

.tile[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  top: 0;
  left: 2px;
  width: 60px;
  height: 60px;
  border: 1.5px dashed color-mix(in srgb, currentColor 35%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.tile[data-dnd-placeholder] .name {
  opacity: 0;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useTemplateRef </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> makeSortableItem </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> AppIcon </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './AppIcon.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> defineProps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> app</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> };</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> inDock</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> boolean</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }>();</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> el </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'el'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">makeSortableItem</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">el</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> item</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">app </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">});</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"el"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"tile"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;AppIcon</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">app</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">id</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">    &#x3C;!-- In the dock, the icon alone. --></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-if</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"!inDock"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"name"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ app.name }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/span></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">tile</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  position</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> relative</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-direction</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> column</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  cursor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> grab</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  user-select</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-size</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.75</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">tile</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">focus-visible</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">tile</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">focus-visible</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> .</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">icon</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline-offset</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 3</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">/* The slot the dragged app will land in. */</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">tile</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">data-dnd-placeholder</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">tile</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">data-dnd-placeholder</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]::</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">after</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  content</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> ''</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  position</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> absolute</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  top</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  left</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 60</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 60</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1.5</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> dashed</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 35</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 3</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> Canvas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">tile</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">data-dnd-placeholder</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> .</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`HomeScreen.vue`,lang:`vue`,code:`<script setup lang="ts">
import { ref } from 'vue';
import AppList from './AppList.vue';

const apps = ref([
  { id: 'notes', name: 'Notes' },
  { id: 'maps', name: 'Maps' },
  { id: 'photos', name: 'Photos' },
  { id: 'clock', name: 'Clock' },
  { id: 'files', name: 'Files' },
  { id: 'calendar', name: 'Calendar' },
  { id: 'weather', name: 'Weather' },
  { id: 'settings', name: 'Settings' },
]);
const dock = ref([
  { id: 'mail', name: 'Mail' },
  { id: 'chat', name: 'Chat' },
  { id: 'camera', name: 'Camera' },
]);
<\/script>

<template>
  <!-- Each list in a component of its own: one sortable list per component. -->
  <div class="screen">
    <AppList v-model="apps" />
    <AppList v-model="dock" dock :limit="4" />
  </div>
</template>

<style scoped>
.screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 24px 20px 14px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 28px;
  background:
    radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, #42b883 16%, transparent), transparent 60%),
    color-mix(in srgb, currentColor 3%, Canvas);
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> ref </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> AppList </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './AppList.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> apps </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">([</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'notes'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Notes'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'maps'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Maps'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'photos'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Photos'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'clock'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Clock'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'files'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Files'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'calendar'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Calendar'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'weather'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Weather'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'settings'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Settings'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> dock </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">([</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'mail'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Mail'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'chat'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Chat'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'camera'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> name</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Camera'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]);</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">  &#x3C;!-- Each list in a component of its own: one sortable list per component. --></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"screen"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;AppList</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-model</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">apps</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;AppList</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-model</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">dock</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> dock</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">limit</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">4</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">screen</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-direction</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> column</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 28</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 24</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 20</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 14</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 28</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">    radial-gradient</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">120</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 80</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> at</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883 </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 60</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">    color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 3</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> Canvas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`}];export{e as default};