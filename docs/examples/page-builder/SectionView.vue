<script setup lang="ts">
import { computed } from 'vue';
import BlockView from './BlockView.vue';
import ColumnList from './ColumnList.vue';
import { SECTIONS, TONES, type Section } from './page';

/**
 * A section of the site, as visitors see it. `editable` on the canvas: its columns are
 * sortable lists of blocks. Without it, a picture of the section: in the overlay, in the
 * templates of the palette.
 */
const props = defineProps<{ section: Section; editable?: boolean }>();
const look = computed(() => SECTIONS[props.section.kind]);
</script>

<template>
  <section
    class="site-section"
    :class="{ cards: look.cards }"
    :data-layout="look.layout"
    :data-kind="section.kind"
    :style="TONES[look.tone]"
  >
    <div class="columns" :style="{ '--count': section.columns.length - 1 }">
      <template v-if="editable">
        <ColumnList v-for="column in section.columns" :key="column.id" :column="column" />
      </template>
      <!-- Each block in a div, as on the canvas (PageBlock): the picture lays out the same. -->
      <template v-else>
        <div v-for="column in section.columns" :key="column.id" class="column">
          <div v-for="block in column.blocks" :key="block.id">
            <BlockView :block="block" />
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
/* The site's own look, light whatever the docs' theme: it is the page being built. */
.site-section {
  padding: var(--pad) var(--gutter);
  background: var(--surface);
  color: var(--ink);
  font: 400 var(--t-md) / 1.55 ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: normal;
  text-align: left;
}

.site-section[data-layout='bar'] {
  padding-block: calc(var(--pad) * 0.2);
}

.columns {
  display: grid;
  gap: var(--gap);
  max-width: 1120px;
  margin: 0 auto;
}

/* `.column`: a list of blocks (ColumnList's root) on the canvas, a plain div in a picture. */
.column {
  display: flex;
  flex-direction: column;
  gap: calc(var(--gap) * 0.34);
  min-width: 0;
}

[data-layout='bar'] .columns {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 28px;
}

[data-layout='split'] .columns {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
}

[data-layout='center'] .columns {
  max-width: 680px;
  text-align: center;
}

[data-layout='grid'] .columns {
  grid-template-columns: repeat(var(--count), minmax(0, 1fr));
}

/* A grid's first column is its header, over the others. */
[data-layout='grid'] .column:first-child {
  grid-column: 1 / -1;
  width: min(100%, 620px);
  margin: 0 auto calc(var(--gap) * 0.2);
  text-align: center;
}

.cards .column:not(:first-child) {
  padding: calc(var(--gap) * 0.6);
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--card);
}

/* The plan in the middle stands out. */
[data-kind='pricing'] .column:nth-child(3) {
  border-color: var(--accent);
  box-shadow: 0 22px 44px -26px color-mix(in srgb, var(--accent) 70%, transparent);
}

/* A phone-sized page: one column, the bar centered. */
@container page (max-width: 600px) {
  [data-layout='split'] .columns,
  [data-layout='grid'] .columns {
    grid-template-columns: minmax(0, 1fr);
  }

  [data-layout='bar'] .columns {
    justify-content: center;
  }
}
</style>
