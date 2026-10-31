<script lang="ts">
  /** What a probe can report under its area. */
  export type ProbeKey =
    | 'drags'
    | 'contextmenu'
    | 'dragstart'
    | 'pointercancel'
    | 'pageMoved'
    | 'selected'
    | 'back'
    | 'hidden'
    | 'zoom'
    | 'pointers';
</script>

<script setup lang="ts">
  import { computed, reactive, useTemplateRef } from 'vue';
  import { useEventListener } from '@vueuse/core';
  import { useDnDMonitor, type Key } from '@vue-dnd-kit/core';
  import { seenPointers } from './checks';

  /**
   * Wraps the interactive area of a check and shows what happened in it: evidence for
   * the person deciding pass or fail. Items of the area are those whose id starts with
   * one of `prefixes`.
   */
  const props = defineProps<{ prefixes: string[]; show: ProbeKey[] }>();
  const area = useTemplateRef<HTMLElement>('area');

  const inArea = (target: EventTarget | Node | null | undefined) =>
    target instanceof Node && !!area.value?.contains(target);
  const ours = (id: Key) => props.prefixes.some((prefix) => String(id).startsWith(prefix));

  const seen = reactive({
    drags: 0,
    last: '',
    contextmenu: 0,
    contextmenuBlocked: 0,
    dragstart: 0,
    dragstartBlocked: 0,
    pointercancel: 0,
    pageMoved: 0,
    selected: '',
    back: 0,
    hidden: 0,
    zoom: 1,
    pointers: new Set<string>(),
  });

  // `defaultPrevented` is final only once every listener has run.
  const afterDispatch = (event: Event, blocked: () => void) =>
    setTimeout(() => {
      if (event.defaultPrevented) blocked();
    });

  useEventListener(window, 'contextmenu', (event: Event) => {
    if (!inArea(event.target)) return;
    seen.contextmenu++;
    afterDispatch(event, () => seen.contextmenuBlocked++);
  });
  useEventListener(window, 'dragstart', (event: DragEvent) => {
    if (!inArea(event.target)) return;
    seen.dragstart++;
    afterDispatch(event, () => seen.dragstartBlocked++);
  });

  // After the drag starts the pointer is captured by <body>: its cancel is matched by id.
  let pressed: number | null = null;
  useEventListener(
    document,
    'pointerdown',
    (event: PointerEvent) => {
      if (!inArea(event.target)) return;
      pressed = event.pointerId;
      seen.pointers.add(event.pointerType);
      seenPointers.add(event.pointerType);
    },
    { capture: true },
  );
  useEventListener(
    document,
    'pointercancel',
    (event: PointerEvent) => {
      if (event.pointerId === pressed) seen.pointercancel++;
    },
    { capture: true },
  );

  useEventListener(document, 'selectionchange', () => {
    const selection = document.getSelection();
    if (selection && !selection.isCollapsed && inArea(selection.anchorNode)) {
      seen.selected = selection.toString().trim().slice(0, 24) || '(whitespace)';
    }
  });

  // How far the page scrolled during the last drag of an item of this area.
  let startY: number | null = null;
  useEventListener(window, 'scroll', () => {
    if (startY !== null) seen.pageMoved = Math.max(seen.pageMoved, Math.round(Math.abs(window.scrollY - startY)));
  });
  useDnDMonitor({
    onDragStart: (event) => {
      if (!ours(event.active.id)) return;
      seen.drags++;
      seen.last = 'dragging';
      seen.pageMoved = 0;
      startY = window.scrollY;
    },
    onDragEnd: (event) => {
      if (!ours(event.active.id)) return;
      seen.last = 'dropped';
      startY = null;
    },
    onDragCancel: (event) => {
      if (!ours(event.active.id)) return;
      seen.last = 'cancelled';
      startY = null;
    },
  });

  useEventListener(window, 'popstate', () => seen.back++);
  useEventListener(document, 'visibilitychange', () => {
    if (document.visibilityState === 'hidden') seen.hidden++;
  });
  if (window.visualViewport) {
    const viewport = window.visualViewport;
    useEventListener(viewport, 'resize', () => (seen.zoom = viewport.scale));
  }

  const parts = computed(() =>
    props.show.map((key) => {
      switch (key) {
        case 'drags':
          return `drags ${seen.drags}${seen.last ? `, last ${seen.last}` : ''}`;
        case 'contextmenu':
          return `contextmenu ${seen.contextmenu} (blocked ${seen.contextmenuBlocked})`;
        case 'dragstart':
          return `native dragstart ${seen.dragstart} (blocked ${seen.dragstartBlocked})`;
        case 'pointercancel':
          return `pointercancel ${seen.pointercancel}`;
        case 'pageMoved':
          return `page scrolled ${seen.pageMoved}px in the last drag`;
        case 'selected':
          return `selected in items: ${seen.selected ? `"${seen.selected}"` : 'nothing'}`;
        case 'back':
          return `back caught ${seen.back}`;
        case 'hidden':
          return `page hidden ${seen.hidden}`;
        case 'zoom':
          return `zoom ×${seen.zoom.toFixed(2)}`;
        case 'pointers':
          return `pointers: ${seen.pointers.size ? [...seen.pointers].join(', ') : 'none yet'}`;
      }
    }),
  );
</script>

<template>
  <div
    ref="area"
    class="area"
  >
    <slot />
  </div>
  <p
    class="probe"
    data-testid="probe"
  >
    <span
      v-for="part in parts"
      :key="part"
      >{{ part }}</span
    >
  </p>
</template>

<style scoped>
  .probe {
    display: flex;
    flex-wrap: wrap;
    gap: 2px 12px;
    margin: 8px 0 0;
    font: 12px/1.4 var(--font-mono);
    color: var(--ui-text-muted);
  }
</style>
