<script setup lang="ts">
  /**
   * The tab: the registry on the left, the live mini-map (or the log) in the middle, and on
   * the right the joystick, the options and the state of the node shown. The bar on top
   * tells what the drag is doing and which page is watched.
   */
  import { computed, ref } from 'vue';
  import { choose, connect, log, send, store } from './utils/connection';
  import { running, togglePick, useShortcuts } from './utils/drive';
  import { choice, cycleTheme, useTheme } from './utils/theme';
  import ControlPanel from './components/ControlPanel.vue';
  import EventLog from './components/EventLog.vue';
  import MiniMap from './components/MiniMap.vue';
  import OptionsPanel from './components/OptionsPanel.vue';
  import RegistryTree from './components/RegistryTree.vue';
  import StatePanel from './components/StatePanel.vue';

  connect();
  useTheme();
  useShortcuts();

  const center = ref<'map' | 'log'>('map');
  const side = ref<'drive' | 'options' | 'state'>('drive');
  const tree = ref(innerWidth > 760);

  const edits = computed(() => store.providers.reduce((sum, provider) => sum + provider.overrides.length, 0));
  const embedded = window.top !== window;
  const status = computed(() => {
    const session = running.value;
    if (!session) return null;
    const over = session.over ? ` → ${String(session.over.id)} (${session.over.accepted ? 'accepts' : 'refuses'})` : '';
    return `${session.status} ${session.active ? String(session.active.id) : ''}${over}`;
  });
  const openWindow = () => window.open(location.href, 'vue-dnd-kit-devtools', 'width=1200,height=760');
</script>

<template>
  <div class="app">
    <header class="bar">
      <button class="btn" :class="{ on: tree }" title="Registry" @click="tree = !tree">☰</button>
      <strong class="brand">Vue DnD Kit</strong>
      <select
        v-if="store.pages.length > 1 || !embedded"
        class="pages"
        :value="store.page ?? ''"
        title="The page watched"
        @change="choose(($event.target as HTMLSelectElement).value || null)"
      >
        <option v-if="!store.pages.length" value="">no page yet</option>
        <option v-for="page in store.pages" :key="page.page" :value="page.page">{{ page.title || page.url }}</option>
      </select>
      <span v-if="status" class="chip green mono" data-testid="status">{{ status }}</span>
      <span v-else class="chip mono" data-testid="status">idle</span>
      <span class="spacer" />
      <button v-if="edits" class="btn danger" title="Reset every edited option" @click="send({ type: 'reset' })">
        {{ edits }} edited · reset
      </button>
      <button class="btn" :class="{ on: store.picking }" title="Pick an item on the page (P)" @click="togglePick">⌖ Pick</button>
      <button v-if="embedded" class="btn" title="Open in a window" @click="openWindow">⧉</button>
      <button class="btn" :title="`Theme: ${choice}`" @click="cycleTheme">{{ choice === 'auto' ? '◐' : choice === 'light' ? '☀' : '☾' }}</button>
    </header>

    <main class="main" :class="{ 'with-tree': tree }">
      <aside v-if="tree" class="left">
        <RegistryTree />
      </aside>

      <section class="center">
        <nav class="tabs">
          <button :class="{ active: center === 'map' }" @click="center = 'map'">Map</button>
          <button :class="{ active: center === 'log' }" data-testid="tab-log" @click="center = 'log'">
            Log <span class="chip">{{ log.length }}</span>
          </button>
        </nav>
        <div class="view">
          <MiniMap v-if="center === 'map'" />
          <EventLog v-else />
        </div>
      </section>

      <aside class="right">
        <nav class="tabs">
          <button :class="{ active: side === 'drive' }" data-testid="tab-drive" @click="side = 'drive'">Drive</button>
          <button :class="{ active: side === 'options' }" data-testid="tab-options" @click="side = 'options'">Options</button>
          <button :class="{ active: side === 'state' }" data-testid="tab-state" @click="side = 'state'">State</button>
        </nav>
        <div class="view">
          <ControlPanel v-if="side === 'drive'" />
          <OptionsPanel v-else-if="side === 'options'" />
          <StatePanel v-else />
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped>
  .app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .bar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-soft);
    flex: none;
  }

  .brand {
    color: var(--accent);
  }

  .pages {
    max-width: 220px;
  }

  .spacer {
    flex: 1;
  }

  .main {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
  }

  .main.with-tree {
    grid-template-columns: 220px minmax(0, 1fr) 300px;
  }

  .left,
  .right {
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: var(--bg);
  }

  .left {
    border-right: 1px solid var(--border);
  }

  .right {
    border-left: 1px solid var(--border);
  }

  .center {
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    background: var(--bg-soft);
  }

  .view {
    flex: 1;
    min-height: 0;
  }
</style>
