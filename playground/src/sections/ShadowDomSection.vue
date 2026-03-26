<script lang="ts">
  import { defineComponent, shallowRef, h } from 'vue';
  import { makeDraggable } from '../../../packages/core/src/external/index';

  interface Item {
    id: string;
    label: string;
  }

  // ── NormalItem: individual draggable for the normal list ──────────────────────
  // Must live in a regular <script> block so it can be exported as a component option.
  const NormalItem = defineComponent({
    name: 'NormalItem',
    props: {
      item: { type: Object as () => Item, required: true },
      index: { type: Number, required: true },
      items: { type: Array as () => Item[], required: true },
    },
    setup(props) {
      const el = shallowRef<HTMLElement | null>(null);
      const { isDragging } = makeDraggable(el, { groups: ['sd'] }, () => [
        props.index,
        props.items,
      ]);
      return () =>
        h(
          'div',
          {
            ref: el,
            class: ['sort-item', isDragging.value && 'sort-item--dragging'],
          },
          [h('span', { class: 'handle' }, '⠿'), props.item.label]
        );
    },
  });

  export default { components: { NormalItem } };
</script>

<script setup lang="ts">
  import {
    ref,
    shallowRef,
    useTemplateRef,
    onMounted,
    createApp,
    defineComponent,
    h,
    inject,
  } from 'vue';
  import {
    makeDraggable,
    makeDroppable,
    injectionKey,
  } from '../../../packages/core/src/external/index';
  import type { IDragEvent } from '../../../packages/core/src/external/types';

  interface Item {
    id: string;
    label: string;
  }

  const ITEMS: Item[] = [
    { id: '1', label: 'Apple' },
    { id: '2', label: 'Banana' },
    { id: '3', label: 'Cherry' },
    { id: '4', label: 'Date' },
  ];

  // ── Normal list (uses App.vue's outer DnDProvider) ────────────────────────────
  const normalItems = ref<Item[]>([...ITEMS]);
  const normalListRef = useTemplateRef<HTMLElement>('normalListRef');

  makeDroppable(
    normalListRef,
    { groups: ['sd'], events: { onDrop: handleNormalDrop } },
    () => normalItems.value
  );

  function handleNormalDrop(e: IDragEvent) {
    const r = e.helpers.suggestSort('vertical');
    if (!r) return;
    normalItems.value = r.targetItems as Item[];
    if (!r.sameList) {
      const src = e.draggedItems[0].items as Item[];
      src.splice(0, src.length, ...(r.sourceItems as Item[]));
    }
  }

  // ── Shadow DOM ────────────────────────────────────────────────────────────────
  // Mount a Vue app inside an attached shadow root and share the OUTER DnDProvider
  // context with it. A separate createApp is needed because shadow roots are
  // isolated DOM trees, but we inject the outer provider so all elements register
  // in the same draggableMap / droppableMap and participate in the same drag session.

  const ITEM_STYLE = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#ef4444',
    color: '#fff',
    borderRadius: '6px',
    cursor: 'grab',
    userSelect: 'none' as const,
    transition: 'opacity 0.15s',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  };

  const ShadowItem = defineComponent({
    name: 'ShadowItem',
    props: {
      item: { type: Object as () => Item, required: true },
      index: { type: Number, required: true },
      items: { type: Array as () => Item[], required: true },
    },
    setup(props) {
      const el = shallowRef<HTMLElement | null>(null);
      const { isDragging } = makeDraggable(el, { groups: ['sd'] }, () => [
        props.index,
        props.items,
      ]);
      return () =>
        h(
          'div',
          {
            ref: el,
            style: { ...ITEM_STYLE, opacity: isDragging.value ? '0.35' : '1' },
          },
          [h('span', { style: 'opacity:0.6' }, '⠿'), props.item.label]
        );
    },
  });

  // ShadowList runs setup() as a child of DnDProvider — inject() finds the context
  const ShadowList = defineComponent({
    name: 'ShadowList',
    setup() {
      const items = ref<Item[]>([...ITEMS]);
      const listEl = shallowRef<HTMLElement | null>(null);

      makeDroppable(
        listEl,
        {
          groups: ['sd'],
          events: {
            onDrop(e: IDragEvent) {
              const r = e.helpers.suggestSort('vertical');
              if (!r) return;
              items.value = r.targetItems as Item[];
              if (!r.sameList) {
                const src = e.draggedItems[0].items as Item[];
                src.splice(0, src.length, ...(r.sourceItems as Item[]));
              }
            },
          },
        },
        () => items.value
      );

      return () =>
        h(
          'div',
          { ref: listEl, class: 'sort-list' },
          items.value.map((item, i) =>
            h(ShadowItem, { key: item.id, item, index: i, items: items.value })
          )
        );
    },
  });

  // Grab the outer provider so shadow DOM components can share the same DnD context.
  // inject() works here because ShadowDomSection is a child of the outer DnDProvider.
  const outerProvider = inject(injectionKey);

  const shadowHostRef = useTemplateRef<HTMLElement>('shadowHostRef');

  onMounted(() => {
    const host = shadowHostRef.value!;
    const shadow = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      .sort-list { display: flex; flex-direction: column; gap: 6px; padding: 4px; }
    `;
    shadow.appendChild(style);

    const container = document.createElement('div');
    shadow.appendChild(container);

    // Mount ShadowList directly — no DnDProvider wrapper.
    // Provide the outer provider under the same key so makeDraggable/makeDroppable
    // inside the shadow root register into the same maps and react to the same events.
    createApp({ render: () => h(ShadowList) })
      .provide(injectionKey, outerProvider)
      .mount(container);
  });
</script>

<template>
  <div>
    <p class="hint">
      Drag &amp; drop inside a normal DOM vs inside a Shadow DOM (<code
        >attachShadow({ mode: 'open' })</code
      >). Both lists use identical code — same items, same DnD setup.
    </p>

    <div class="panels">
      <!-- Normal DOM -->
      <div class="panel">
        <h3 class="panel-title">
          Normal DOM
          <span class="badge badge--ok">✓ works</span>
        </h3>

        <div
          ref="normalListRef"
          class="sort-list"
        >
          <NormalItem
            v-for="(item, i) in normalItems"
            :key="item.id"
            :item="item"
            :index="i"
            :items="normalItems"
          />
        </div>
      </div>

      <!-- Shadow DOM -->
      <div class="panel">
        <h3 class="panel-title">
          Shadow DOM
          <span class="badge badge--ok">✓ fixed</span>
        </h3>
        <p class="panel-note">
          One <code>DnDProvider</code> at the top. Shadow root mounts a separate
          Vue app but shares the outer provider via
          <code>app.provide(injectionKey, outerProvider)</code>.
        </p>

        <!-- Vue app (with its own DnDProvider) is mounted into this shadow root -->
        <div ref="shadowHostRef" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 0.95rem;
  }

  .panel-note {
    font-size: 0.78rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
  }

  .badge {
    font-size: 0.65rem;
    font-weight: 600;
    padding: 0.15rem 0.45rem;
    border-radius: 4px;
  }

  .badge--ok {
    background: #dcfce7;
    color: #15803d;
  }

  .badge--fail {
    background: #fee2e2;
    color: #b91c1c;
  }

  .sort-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 4px;
    border: 1px dashed #d1d5db;
    border-radius: 8px;
    min-height: 60px;
  }

  .sort-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #3b82f6;
    color: #fff;
    border-radius: 6px;
    cursor: grab;
    user-select: none;
    transition: opacity 0.15s;
  }

  .sort-item--dragging {
    opacity: 0.35;
  }

  .handle {
    opacity: 0.6;
  }
</style>
