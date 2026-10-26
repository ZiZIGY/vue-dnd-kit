<script setup lang="ts">
  /** A value of the page (`Preview`), expandable when it is an object, an array, a map or a set. */
  import { computed, ref } from 'vue';
  import { TAG, type Preview } from '../../src/protocol';
  import { isTagged, short } from '../lib/format';

  defineOptions({ name: 'ValueView' });
  const props = defineProps<{ value: Preview; depth?: number }>();

  const open = ref((props.depth ?? 0) < 1);

  /** Entries of a value that has some: `[key, value]`. */
  const entries = computed<Array<[string, Preview]> | null>(() => {
    const { value } = props;
    if (value === null || typeof value !== 'object') return null;
    if (isTagged(value)) {
      if (value[TAG] === 'map') return (value.entries as Array<[Preview, Preview]>).map(([key, entry]) => [short(key, 30), entry]);
      if (value[TAG] === 'set') return (value.values as Preview[]).map((entry, index) => [String(index), entry]);
      return null;
    }
    return Array.isArray(value) ? value.map((entry, index) => [String(index), entry]) : Object.entries(value);
  });

  const kind = computed(() => {
    const { value } = props;
    if (isTagged(value)) return value[TAG] === 'function' ? 'fn' : value[TAG] === 'element' ? 'el' : 'tag';
    return value === null ? 'null' : typeof value;
  });
</script>

<template>
  <span v-if="!entries || !entries.length" class="leaf mono" :class="kind">{{ short(value, 200) }}</span>
  <span v-else class="tree">
    <button class="toggle mono" @click="open = !open">{{ open ? '▾' : '▸' }} {{ short(value, open ? 20 : 80) }}</button>
    <span v-if="open" class="children">
      <span v-for="[key, entry] in entries" :key="key" class="row">
        <span class="key mono">{{ key }}:</span>
        <ValueView :value="entry" :depth="(depth ?? 0) + 1" />
      </span>
    </span>
  </span>
</template>

<style scoped>
  .tree {
    display: inline-block;
    vertical-align: top;
  }

  .toggle {
    border: 0;
    background: none;
    padding: 0;
    color: var(--text-soft);
    text-align: left;
  }

  .children {
    display: block;
    padding-left: 12px;
  }

  .row {
    display: block;
  }

  .key {
    color: var(--purple);
    margin-right: 4px;
  }

  .leaf.string {
    color: #c2410c;
  }

  .leaf.number,
  .leaf.boolean {
    color: var(--blue);
  }

  .leaf.null,
  .leaf.tag {
    color: var(--text-mute);
  }

  .leaf.fn,
  .leaf.el {
    color: var(--accent);
  }
</style>
