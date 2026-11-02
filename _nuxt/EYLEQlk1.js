var e=[{name:`index.vue`,lang:`vue`,code:`<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Monitor from './Monitor.vue';
import Notes from './Notes.vue';
import { ANSWERS, type Answer } from './types';

const monitorAnswer = ref<Answer>('accept');
const targetAnswer = ref<Answer>('accept');

// Every hook of the last drop, in the order they ran.
const steps = ref<{ who: string; what: string }[]>([]);
const trace = (who: string, what: string) => steps.value.push({ who, what });
<\/script>

<template>
  <DnDProvider
    @drag-start="steps = []"
    @drag-end="trace('provider', '@drag-end')"
    @drag-cancel="trace('provider', '@drag-cancel')"
    @drag-settle="trace('provider', '@drag-settle: landed')"
  >
    <div class="demo">
      <div class="switches">
        <fieldset>
          <legend>monitor answers</legend>
          <label v-for="value in ANSWERS" :key="value" :class="{ on: monitorAnswer === value }">
            <input v-model="monitorAnswer" type="radio" :value="value" />
            {{ value }}
          </label>
        </fieldset>
        <fieldset>
          <legend>target answers</legend>
          <label v-for="value in ANSWERS" :key="value" :class="{ on: targetAnswer === value }">
            <input v-model="targetAnswer" type="radio" :value="value" />
            {{ value }}
          </label>
        </fieldset>
      </div>
      <div class="layout">
        <Notes :answer="targetAnswer" :trace="trace" />
        <ol class="steps" aria-label="Hooks of the last drop">
          <li v-for="(step, index) in steps" :key="index">
            <span class="who">{{ step.who }}</span>{{ step.what }}
          </li>
          <li v-if="!steps.length" class="empty">Move a note, or drop one in the trash</li>
        </ol>
      </div>
      <Monitor :answer="monitorAnswer" :trace="trace" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.switches {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 16px;
}

fieldset {
  display: inline-flex;
  margin: 0;
  padding: 3px;
  border: 0;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

legend {
  float: left;
  align-self: center;
  padding: 0 8px 0 6px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

label {
  padding: 5px 10px;
  border-radius: 6px;
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

label.on {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
  font-weight: 600;
}

label:has(input:focus-visible) {
  outline: 2px solid #42b883;
}

input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.layout {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;
}

.steps {
  box-sizing: border-box;
  min-width: 220px;
  min-height: 150px;
  margin: 0;
  padding: 10px 14px 10px 32px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  font: 11px/1.8 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  list-style: decimal;
}

.steps li::marker {
  color: color-mix(in srgb, currentColor 45%, transparent);
}

.who {
  display: inline-block;
  min-width: 60px;
  color: #42b883;
}

.steps li.empty {
  margin-left: -18px;
  list-style: none;
  opacity: 0.45;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> ref </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> DnDProvider </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Monitor </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './Monitor.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Notes </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './Notes.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> ANSWERS</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> type</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Answer </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './types'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> monitorAnswer </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">Answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'accept'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> targetAnswer </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">Answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'accept'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// Every hook of the last drop, in the order they ran.</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> steps </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> who</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> what</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }[]>([]);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> (</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">who</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> what</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> steps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">push</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">({</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> who</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> what </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">});</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;DnDProvider</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">    @</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">drag-start</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">steps </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> []</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">    @</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">drag-end</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'provider'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@drag-end'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">    @</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">drag-cancel</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'provider'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@drag-cancel'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">    @</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">drag-settle</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'provider'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@drag-settle: landed'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  ></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"demo"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"switches"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;fieldset></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">          &#x3C;legend></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">monitor answers</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/legend></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">          &#x3C;label</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-for</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"value in ANSWERS"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :key</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"value"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"{ on: monitorAnswer === value }"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">            &#x3C;input</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-model</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"monitorAnswer"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> type</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"radio"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"value"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">            {{ value }}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">          &#x3C;/label></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;/fieldset></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;fieldset></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">          &#x3C;legend></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">target answers</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/legend></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">          &#x3C;label</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-for</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"value in ANSWERS"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :key</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"value"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"{ on: targetAnswer === value }"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">            &#x3C;input</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-model</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"targetAnswer"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> type</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"radio"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :value</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"value"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">            {{ value }}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">          &#x3C;/label></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;/fieldset></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"layout"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;Notes</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">targetAnswer</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">trace</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;ol</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"steps"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> aria-label</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"Hooks of the last drop"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">          &#x3C;li</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-for</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"(step, index) in steps"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :key</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"index"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">            &#x3C;span</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"who"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ step.who }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/span></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ step.what }}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">          &#x3C;/li></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">          &#x3C;li</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> v-if</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"!steps.length"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"empty"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">Move a note, or drop one in the trash</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/li></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">        &#x3C;/ol></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;Monitor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">monitorAnswer</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">trace</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/DnDProvider></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">demo</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-direction</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> column</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">switches</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-wrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> wrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  justify-content</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">fieldset</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> inline-flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 3</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 9</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 7</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">legend</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  float</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> left</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-self</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 6</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">/</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">1</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> ui-monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Menlo</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Consolas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.55</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">label</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 5</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 6</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">/</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">1.2</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> ui-monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Menlo</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Consolas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  cursor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> pointer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">label</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">on</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Canvas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-shadow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 3</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> rgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> / </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.25</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-weight</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 600</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">label</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">has</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">input</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">focus-visible</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">input</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  position</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> absolute</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  pointer-events</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">layout</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-wrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> wrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex-start</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  justify-content</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">steps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-sizing</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> border-box</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  min-width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 220</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  min-height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 150</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 14</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 32</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 5</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 11</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">/</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">1.8</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> ui-monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Menlo</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Consolas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  white-space</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> nowrap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  list-style</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> decimal</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">steps</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> li</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">::</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">marker</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  color</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 45</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">who</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> inline-block</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  min-width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 60</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  color</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">steps</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> li</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">empty</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin-left</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> -18</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  list-style</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.45</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`Card.vue`,lang:`vue`,code:`<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ task: { id: string; title: string } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.task });
<\/script>

<template>
  <li ref="el" class="card"><span>{{ task.title }}</span></li>
</template>

<style scoped>
.card {
  padding: 9px 10px;
  border-radius: 8px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  font-size: 12px;
  font-weight: 500;
  cursor: grab;
  user-select: none;
}

.card:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.card[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 25%, transparent);
}

.card[data-dnd-placeholder] > * {
  visibility: hidden;
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
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;li</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"el"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"card"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">>&#x3C;span></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">{{ task.title }}</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/span>&#x3C;/li></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">card</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 9</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Canvas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-shadow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 11</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-size</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-weight</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 500</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  cursor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> grab</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  user-select</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">card</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">focus-visible</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">42b883</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  outline-offset</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 2</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">card</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">data-dnd-placeholder</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  box-shadow</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> inset</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1.5</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 25</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">card</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">data-dnd-placeholder</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ></span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> *</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  visibility</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> hidden</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`Monitor.vue`,lang:`vue`,code:`<script setup lang="ts">
import { useDnDMonitor } from '@vue-dnd-kit/core';
import type { Answer, Trace } from './types';

const props = defineProps<{ answer: Answer; trace: Trace }>();

// Hears every drag under the provider, and decides before the target does.
useDnDMonitor({
  onBeforeDrop: () => {
    props.trace('monitor', \`onBeforeDrop → \${props.answer}\`);
    return props.answer;
  },
  onDragEnd: () => props.trace('monitor', 'onDragEnd'),
  onDragCancel: () => props.trace('monitor', 'onDragCancel'),
  onDragResume: () => props.trace('monitor', 'onDragResume: click to drop'),
});
<\/script>

<template>
  <p class="note">A monitor answers every drop first: “reject” or “continue” end the asking before the target is asked.</p>
</template>

<style scoped>
.note {
  max-width: 440px;
  margin: 0;
  font: 11px/1.5 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
  opacity: 0.55;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useDnDMonitor </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> type</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Trace </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './types'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> defineProps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> Answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> Trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }>();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// Hears every drag under the provider, and decides before the target does.</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">useDnDMonitor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">({</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  onBeforeDrop</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">    props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'monitor'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> \`onBeforeDrop → </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">    return</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  onDragEnd</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'monitor'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'onDragEnd'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  onDragCancel</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'monitor'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'onDragCancel'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  onDragResume</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'monitor'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'onDragResume: click to drop'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">});</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;p</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"note"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">A monitor answers every drop first: “reject” or “continue” end the asking before the target is asked.</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/p></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">note</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  max-width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 440</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 11</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">/</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">1.5</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> ui-monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Menlo</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Consolas</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> monospace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  text-align</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  opacity</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0.55</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`Notes.vue`,lang:`vue`,code:`<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
import { makeDroppable, makeSortableList } from '@vue-dnd-kit/core';
import Card from './Card.vue';
import type { Answer, Trace } from './types';

const props = defineProps<{ answer: Answer; trace: Trace }>();

const notes = ref([
  { id: 'milk', title: 'Buy oat milk' },
  { id: 'call', title: 'Call the plumber' },
  { id: 'book', title: 'Return the book' },
  { id: 'plants', title: 'Water the plants' },
]);

const list = useTemplateRef<HTMLElement>('list');
const { items } = makeSortableList(list, {
  id: 'notes',
  items: notes,
  // Asked when the notes are reordered: the list is the target.
  onBeforeDrop: () => {
    props.trace('list', \`onBeforeDrop → \${props.answer}\`);
    return props.answer;
  },
  // Told when it is the target, and when notes leave it for the trash (\`to.index\` -1).
  onDrop: (event) => props.trace('list', event.to.index < 0 ? 'onDrop, removed' : 'onDrop'),
});

const trash = useTemplateRef<HTMLElement>('trash');
const { isOver } = makeDroppable(trash, {
  id: 'trash',
  // Asked when a note is dropped in the trash: the trash is the target.
  onBeforeDrop: () => {
    props.trace('trash', \`onBeforeDrop → \${props.answer}\`);
    return props.answer;
  },
  onDrop: (event) => {
    props.trace('trash', 'onDrop');
    event.source?.remove();
  },
});

// The library's write, the moment it happens.
watch(notes, () => props.trace('list', 'written'), { flush: 'sync' });
<\/script>

<template>
  <div class="notes">
    <ul ref="list" class="cards">
      <Card v-for="note in items" :key="note.id" :task="note" />
    </ul>
    <div ref="trash" class="trash" :class="{ over: isOver }">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13" /></svg>
      Trash
    </div>
  </div>
</template>

<style scoped>
.notes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 190px;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 8px;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, transparent);
  list-style: none;
}

.trash {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  border: 1.5px dashed color-mix(in srgb, currentColor 22%, transparent);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.trash.over {
  border-color: #e5484d;
  background: color-mix(in srgb, #e5484d 8%, transparent);
  color: #e5484d;
}

.trash svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;script</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> setup</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> lang</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"ts"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> watch </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> makeDroppable</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> makeSortableList </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> '@vue-dnd-kit/core'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Card </span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './Card.vue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">import</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> type</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> Trace </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> from</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> './types'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> defineProps</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;{</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> Answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> Trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> }>();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> notes </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">([</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'milk'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Buy oat milk'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'call'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Call the plumber'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'book'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Return the book'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'plants'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> title</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'Water the plants'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">]);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> list </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'list'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> items </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> makeSortableList</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">list</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'notes'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> notes</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">  // Asked when the notes are reordered: the list is the target.</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  onBeforeDrop</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">    props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'list'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> \`onBeforeDrop → </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">    return</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">  // Told when it is the target, and when notes leave it for the trash (\`to.index\` -1).</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  onDrop</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> (</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">event</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'list'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> event</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">to</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">index </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ?</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'onDrop, removed'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'onDrop'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">});</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> trash </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> useTemplateRef</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">&#x3C;</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">HTMLElement</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">>(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'trash'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">const</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> isOver </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> makeDroppable</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">trash</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">  id</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'trash'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">  // Asked when a note is dropped in the trash: the trash is the target.</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  onBeforeDrop</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">    props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'trash'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> \`onBeforeDrop → </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">\${</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">\`</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">    return</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">  onDrop</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> (</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">event</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">    props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'trash'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'onDrop'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">    event</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">source</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">?.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">remove</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">();</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">  },</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">});</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">// The library's write, the moment it happens.</span></span>
<span class="line"><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">watch</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">notes</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> ()</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> props</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF">trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'list'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'written'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">),</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> flush</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'sync'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> });</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/script></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;template></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"notes"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;ul</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"list"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"cards"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;Card</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> v-for</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">note </span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">in</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> items</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">key</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">note</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">id</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> :</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">task</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">note</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> /></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/ul></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;div</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> ref</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"trash"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"trash"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> :class</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"{ over: isOver }"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">      &#x3C;svg</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> viewBox</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"0 0 24 24"</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> aria-hidden</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"true"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">>&#x3C;path</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> d</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">=</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">"M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13"</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> />&#x3C;/svg></span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">      Trash</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">    &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">  &#x3C;/div></span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/template></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;style</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> scoped</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">></span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">notes</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-direction</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> column</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 190</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">cards</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  flex-direction</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> column</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 6</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  margin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 0</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> solid</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 10</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 3</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  list-style</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">trash</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  display</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> flex</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  align-items</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  justify-content</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> center</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  gap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 6</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  padding</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1.5</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> dashed</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 22</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-radius</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-size</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 12</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  font-weight</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 600</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  transition</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">    border-color </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.15</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">s</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span></span>
<span class="line"><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">    background-color </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">0.15</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">s</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">trash</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">over</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  border-color</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">e5484d</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  background</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0969DA;--shiki-dark:#7CC4FF"> color-mix</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">(</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">in</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> srgb</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">e5484d </span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261">8</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">%</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> transparent</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">);</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  color</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> #</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7">e5484d</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">.</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">trash</span><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C"> svg</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> {</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  height</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 16</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">px</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  fill</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> none</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> currentColor</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-width</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> 1.8</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-linecap</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> round</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0">  stroke-linejoin</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#BC4C00;--shiki-dark:#F4A261"> round</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">}</span></span>
<span class="line"><span style="--shiki-light:#CF2257;--shiki-dark:#FF7B9C">&#x3C;/style></span></span></code></pre>`},{name:`types.ts`,lang:`ts`,code:`/** What \`onBeforeDrop\` answers here: words it understands as they are. */
export type Answer = 'accept' | 'reject' | 'continue';

export const ANSWERS: Answer[] = ['accept', 'reject', 'continue'];

/** Adds a line to the list of hooks: who ran it, and what. */
export type Trace = (who: string, what: string) => void;`,html:`<pre class="shiki shiki-themes dnd-light dnd-dark" style="--shiki-light:#27272a;--shiki-dark:#e4e4e7;--shiki-light-bg:#00000000;--shiki-dark-bg:#00000000" tabindex="0"><code><span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">/** What \`onBeforeDrop\` answers here: words it understands as they are. */</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">export</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> type</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> Answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'accept'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> |</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'reject'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> |</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'continue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">export</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> const</span><span style="--shiki-light:#27272A;--shiki-dark:#E4E4E7"> ANSWERS</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> Answer</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">[]</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> [</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A">'accept'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'reject'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#9A6700;--shiki-dark:#E9C46A"> 'continue'</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">];</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#85858D;--shiki-light-font-style:italic;--shiki-dark:#6E6E78;--shiki-dark-font-style:italic">/** Adds a line to the list of hooks: who ran it, and what. */</span></span>
<span class="line"><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883">export</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> type</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> Trace</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> =</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9"> (</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF">who</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">,</span><span style="--shiki-light:#7C4DCC;--shiki-dark:#C3A6FF"> what</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">:</span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> string</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">)</span><span style="--shiki-light:#1F8A5B;--shiki-dark:#42B883"> =></span><span style="--shiki-light:#0F766E;--shiki-dark:#7EE0C0"> void</span><span style="--shiki-light:#5B5B63;--shiki-dark:#9F9FA9">;</span></span></code></pre>`}];export{e as default};