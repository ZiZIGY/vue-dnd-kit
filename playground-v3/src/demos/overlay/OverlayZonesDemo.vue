<script setup lang="ts">
  import { reactive } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import CardList from './CardList.vue';
  import ZoneOverlay from './ZoneOverlay.vue';
  import ZoneTarget from './ZoneTarget.vue';
  import { cards, cloneCard, describeColumns } from './gallery';

  const backlog = reactive({ id: 'backlog', title: 'Backlog', cards: cards('b', ['task', 'note', 'link', 'task']) });
  const sprint = reactive({ id: 'sprint', title: 'Sprint', cards: cards('s', ['task', 'photo']) });
  const frozen = reactive({ id: 'frozen', title: 'Frozen', cards: cards('f', ['note']) });
</script>

<template>
  <DnDProvider>
    <p class="lead">
      The overlay reads <code>over</code>, <code>accepted</code> and <code>mode</code>: it names the target, turns red
      where the card is not allowed (the frozen list, the locked zone) and shows a copy badge while Alt is held.
    </p>
    <div class="layout">
      <CardList
        :column="backlog"
        :options="{ group: 'zones', clone: cloneCard, overlay: ZoneOverlay }"
      />
      <CardList
        :column="sprint"
        :options="{ group: 'zones', clone: cloneCard, overlay: ZoneOverlay }"
      />
      <CardList
        :column="frozen"
        :options="{ group: { name: 'zones', put: false }, overlay: ZoneOverlay }"
      >
        <template #note>takes nothing</template>
      </CardList>
      <div class="ov-zones">
        <ZoneTarget
          id="trash"
          :data="{ label: 'Trash', tone: 'danger' }"
          remove
        >
          drops delete the card
        </ZoneTarget>
        <ZoneTarget
          id="locked"
          :data="{ label: 'Archive' }"
          :accept="['archived']"
        >
          locked: accepts nothing here
        </ZoneTarget>
      </div>
    </div>
    <pre data-testid="state">{{ describeColumns([backlog, sprint, frozen]) }}</pre>
  </DnDProvider>
</template>

<style scoped>
  .lead {
    max-width: 760px;
  }

  .layout {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: flex-start;
    --column-width: 230px;
  }

  .ov-zones {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 26px;
  }
</style>
