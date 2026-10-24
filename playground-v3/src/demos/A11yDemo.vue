<script setup lang="ts">
  import { shallowRef } from 'vue';
  import { DnDProvider, type Announcements, type Key } from '@vue-dnd-kit/core';
  import A11yItem from '../components/A11yItem.vue';
  import HandleItem from '../components/HandleItem.vue';
  import DropZone from '../components/DropZone.vue';

  const customAnnouncements: Partial<Announcements> = {
    onDragStart: ({ active }) => `Custom pickup of ${active.id}.`,
    onDragCancel: ({ active }) => `Custom cancel of ${active.id}.`,
  };

  // The app re-renders the item inside the zone it was dropped on: a new element.
  const home = shallowRef('zone-c');
  const moveHome = (zone: string, id: Key) => {
    if (id === 'movable') home.value = zone;
  };
</script>

<template>
  <section>
    <h2>Accessibility</h2>
    <div
      class="a11y-row"
      data-testid="attributes"
    >
      <A11yItem
        item-id="plain"
        label="Plain draggable"
        data-testid="plain"
      />
      <!-- Everything set here must survive: the library never overrides user attributes. -->
      <A11yItem
        item-id="custom"
        label="Custom attributes"
        data-testid="custom"
        role="option"
        tabindex="-1"
        aria-roledescription="custom card"
        aria-describedby="custom-help"
        aria-disabled="true"
      />
      <HandleItem
        item-id="handled"
        data-testid="handled"
      />
      <A11yItem
        item-id="locked"
        label="Disabled draggable"
        data-testid="locked"
        disabled
      />
      <span id="custom-help">Custom help text</span>
    </div>
    <div class="a11y-row">
      <DropZone
        zone-id="zone-a"
        data-testid="zone-a"
      />
      <DropZone
        zone-id="zone-b"
        data-testid="zone-b"
      />
    </div>
    <div class="a11y-row">
      <DropZone
        v-for="zone in ['zone-c', 'zone-d']"
        :key="zone"
        :zone-id="zone"
        :data-testid="zone"
        @drop="(id) => moveHome(zone, id)"
      >
        <A11yItem
          v-if="home === zone"
          item-id="movable"
          label="No overlay"
          data-testid="movable"
          no-overlay
        />
      </DropZone>
    </div>

    <h3>Nested providers</h3>
    <DnDProvider
      :announcements="customAnnouncements"
      screen-reader-instructions="Custom instructions for this provider."
    >
      <div class="a11y-row">
        <A11yItem
          item-id="announce-custom"
          label="Custom announcements"
          data-testid="announce-custom"
        />
      </div>
    </DnDProvider>
    <DnDProvider :announcements="false">
      <div class="a11y-row">
        <A11yItem
          item-id="announce-silent"
          label="Silent provider"
          data-testid="announce-silent"
        />
      </div>
    </DnDProvider>
  </section>
</template>
