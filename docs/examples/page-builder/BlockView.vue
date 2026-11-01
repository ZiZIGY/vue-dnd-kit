<script setup lang="ts">
import { computed } from 'vue';
import EditableText from './EditableText.vue';
import Icon from './Icon.vue';
import type { IconName } from './icons';
import type { Block } from './page';

/** A block of the site, as visitors see it. Its texts become editable while `editing`. */
const props = defineProps<{ block: Block; editing?: boolean }>();
const emit = defineEmits<{ finish: [] }>();

// What every text of the block gets: editable or not, and Enter or Escape to finish.
const field = computed(() => ({ editing: props.editing, onFinish: () => emit('finish') }));
const initials = computed(() =>
  props.block.note
    .split(/[\s,]+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join(''),
);
/** The bars of the dashboard's chart, in % of its height. */
const BARS = [38, 54, 46, 70, 58, 86, 74, 92];
</script>

<template>
  <div v-if="block.kind === 'logo'" class="b-logo">
    <span class="mark" />
    <EditableText v-model="block.text" v-bind="field" />
  </div>

  <nav v-else-if="block.kind === 'links'" class="b-links">
    <EditableText
      v-for="(item, index) in block.items"
      :key="index"
      :model-value="item"
      v-bind="field"
      @update:model-value="block.items[index] = $event"
    />
  </nav>

  <p v-else-if="block.kind === 'badge'" class="b-badge">
    <span class="dot" />
    <EditableText v-model="block.text" v-bind="field" />
  </p>

  <EditableText v-else-if="block.kind === 'heading'" v-model="block.text" v-bind="field" tag="h2" class="b-heading" :data-size="block.size" />

  <EditableText v-else-if="block.kind === 'text'" v-model="block.text" v-bind="field" tag="p" class="b-text" :data-size="block.size" />

  <p v-else-if="block.kind === 'button'" class="b-button">
    <EditableText v-model="block.text" v-bind="field" :data-variant="block.variant" />
  </p>

  <div v-else-if="block.kind === 'image'" class="b-image" :data-variant="block.variant">
    <template v-if="block.variant === 'dashboard'">
      <div class="shot-bar"><i /><i /><i /></div>
      <div class="shot-body">
        <div class="shot-side"><i /><i /><i /><i /></div>
        <div class="shot-main">
          <div class="shot-stats"><i /><i /><i /></div>
          <div class="shot-chart">
            <i v-for="(height, index) in BARS" :key="index" :style="{ height: `${height}%` }" />
          </div>
        </div>
      </div>
    </template>
  </div>

  <ul v-else-if="block.kind === 'list'" class="b-list">
    <li v-for="(item, index) in block.items" :key="index">
      <Icon name="check" />
      <EditableText :model-value="item" v-bind="field" @update:model-value="block.items[index] = $event" />
    </li>
  </ul>

  <figure v-else-if="block.kind === 'quote'" class="b-quote">
    <EditableText v-model="block.text" v-bind="field" tag="blockquote" />
    <figcaption>
      <span class="avatar">{{ initials }}</span>
      <EditableText v-model="block.note" v-bind="field" />
    </figcaption>
  </figure>

  <p v-else-if="block.kind === 'price'" class="b-price">
    <EditableText v-model="block.text" v-bind="field" class="amount" />
    <EditableText v-model="block.note" v-bind="field" class="period" />
  </p>

  <div v-else-if="block.kind === 'logos'" class="b-logos">
    <span v-for="(name, index) in block.items" :key="name" :data-style="index % 4">{{ name }}</span>
  </div>

  <span v-else class="b-icon"><Icon :name="block.variant as IconName" /></span>
</template>

<style scoped>
/* Colors come from the section around (its tone's variables), sizes from the page's type scale. */
p,
h2,
ul,
figure,
blockquote {
  margin: 0;
}

.b-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: calc(var(--h-sm) * 1.05);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.mark {
  flex: none;
  width: 1.4em;
  height: 1.4em;
  border-radius: 0.42em;
  background:
    radial-gradient(circle at 50% 50%, #fff 0 0.2em, transparent 0.24em),
    linear-gradient(135deg, #6366f1, #a855f7);
}

.b-links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 22px;
  color: var(--body);
  font-size: var(--t-sm);
  font-weight: 500;
}

/* Inline-level, like the button, the price and the icon: a centered column centers them. */
.b-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 4px 11px 4px 9px;
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: 99px;
  background: var(--soft);
  color: var(--accent);
  font-size: var(--t-sm);
  font-weight: 600;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 22%, transparent);
}

.b-heading {
  color: var(--ink);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.15;
  text-wrap: balance;
}

.b-heading[data-size='xl'] {
  font-size: var(--h-xl);
  letter-spacing: -0.035em;
  line-height: 1.05;
}

.b-heading[data-size='lg'] {
  font-size: var(--h-lg);
  letter-spacing: -0.03em;
}

.b-heading[data-size='md'] {
  font-size: var(--h-md);
}

.b-heading[data-size='sm'] {
  font-size: var(--h-sm);
  letter-spacing: -0.01em;
}

.b-text {
  color: var(--body);
  font-size: var(--t-md);
  text-wrap: pretty;
}

.b-text[data-size='lg'] {
  font-size: var(--t-lg);
}

.b-text[data-size='sm'] {
  font-size: var(--t-sm);
}

.b-button [data-variant] {
  display: inline-block;
  padding: 0.7em 1.25em;
  border-radius: 10px;
  font-size: var(--t-sm);
  font-weight: 600;
  line-height: 1.2;
}

.b-button [data-variant='primary'] {
  background: var(--accent);
  color: var(--accent-ink);
  box-shadow: 0 8px 18px -10px var(--accent);
}

.b-button [data-variant='ghost'] {
  box-shadow: inset 0 0 0 1px var(--line);
  color: var(--ink);
}

/* ─── Pictures, drawn in CSS ──────────────────────────────────────────────── */

.b-image {
  overflow: hidden;
  border-radius: 14px;
  box-shadow:
    0 0 0 1px rgb(15 23 42 / 0.08),
    0 30px 60px -30px rgb(15 23 42 / 0.5);
}

.b-image[data-variant='photo'] {
  aspect-ratio: 16 / 10;
  background:
    radial-gradient(circle at 72% 32%, #fff7d6 0 7%, transparent 7.5%),
    radial-gradient(120% 70% at 20% 110%, #4c5fd5 0 45%, transparent 45.5%),
    radial-gradient(120% 80% at 85% 120%, #7c6fe8 0 50%, transparent 50.5%),
    linear-gradient(#ffc9a8, #e8d8ff 70%);
  box-shadow: 0 0 0 1px rgb(15 23 42 / 0.06);
}

.b-image[data-variant='dashboard'] {
  display: flex;
  flex-direction: column;
  aspect-ratio: 4 / 3;
  background: #fff;
}

.shot-bar {
  display: flex;
  gap: 4%;
  padding: 3.5% 4%;
  border-bottom: 1px solid #eef0f5;
}

.shot-bar i {
  width: 2.2%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #e2e6ee;
}

.shot-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.shot-side {
  display: flex;
  flex-direction: column;
  gap: 8%;
  width: 24%;
  padding: 5% 4%;
  background: #f7f8fc;
}

.shot-side i {
  height: 5%;
  border-radius: 4px;
  background: #e3e6f3;
}

.shot-side i:first-child {
  background: #c9ccf6;
}

.shot-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6%;
  padding: 5%;
}

.shot-stats {
  display: flex;
  gap: 5%;
  height: 22%;
}

.shot-stats i {
  flex: 1;
  border-radius: 8px;
  background: #f1f2fb;
  box-shadow: inset 0 -3px 0 #c7c9f5;
}

.shot-chart {
  display: flex;
  flex: 1;
  align-items: flex-end;
  gap: 4%;
  padding: 4% 4% 0;
  border-radius: 8px;
  background: linear-gradient(#fff, #f6f6fe);
}

.shot-chart i {
  flex: 1;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(#8b8cf0, #5b5bd6);
}

/* ─── The rest ────────────────────────────────────────────────────────────── */

.b-list {
  display: grid;
  gap: 8px;
  padding: 0;
  color: var(--body);
  font-size: var(--t-sm);
  list-style: none;
}

.b-list li {
  display: flex;
  align-items: baseline;
  gap: 9px;
}

.b-list svg {
  translate: 0 2px;
  color: var(--accent);
  stroke-width: 2.6;
}

.b-quote {
  display: grid;
  gap: 16px;
}

.b-quote blockquote {
  color: var(--ink);
  font-size: var(--t-lg);
  font-weight: 500;
  line-height: 1.45;
  text-wrap: pretty;
}

.b-quote blockquote::before {
  content: '“';
}

.b-quote blockquote::after {
  content: '”';
}

.b-quote figcaption {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--body);
  font-size: var(--t-sm);
}

.avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--soft);
  color: var(--accent);
  font-size: 11px;
  font-weight: 700;
}

.b-price {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}

.amount {
  color: var(--ink);
  font-size: var(--h-lg);
  font-weight: 700;
  letter-spacing: -0.03em;
}

.period {
  color: var(--body);
  font-size: var(--t-sm);
}

.b-logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px 36px;
  color: color-mix(in srgb, var(--ink) 45%, transparent);
  font-size: var(--h-sm);
  font-weight: 700;
}

/* Five companies, four lettering styles. */
.b-logos [data-style='1'] {
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
}

.b-logos [data-style='2'] {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: -0.04em;
}

.b-logos [data-style='3'] {
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.8em;
}

.b-icon {
  display: inline-grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: var(--soft);
  color: var(--accent);
  font-size: 20px;
  vertical-align: top;
}
</style>
