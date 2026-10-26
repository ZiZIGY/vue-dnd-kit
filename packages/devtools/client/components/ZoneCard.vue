<script setup lang="ts">
  /**
   * One zone of the mini-map, live: the zone's shell with copies of its items where they
   * are on the page, scaled to the card, and the drag drawn over them (the placeholder,
   * the pointer, the overlay box, the insertion line). The copies are patched in place
   * as frames come; an item's copy is rebuilt only when the page sends a new one.
   */
  import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue';
  import type { Key, MapFrame, Rect, ZoneFrame } from '../../src/protocol';
  import { copies, copiesVersion } from '../utils/connection';
  import { createRoot, fromHtml, release } from '../utils/shadow';

  const props = defineProps<{ zone: ZoneFrame; frame: MapFrame; chosen: Key | null }>();
  const emit = defineEmits<{ pick: [id: Key]; open: [id: Key]; zone: [] }>();

  /** Tallest a card gets: a long list scrolls in it. */
  const MAX_HEIGHT = 260;

  const body = useTemplateRef<HTMLElement>('body');
  const host = useTemplateRef<HTMLElement>('host');
  const width = ref(220);
  const scale = computed(() => Math.min(1, Math.max(width.value - 2, 40) / Math.max(props.zone.rect.w, 1)));

  let root: ShadowRoot | null = null;
  let zoneElement: HTMLElement | null = null;
  let shell = -1;
  const items = new Map<Key, { element: HTMLElement; copy: number }>();
  const keys = new WeakMap<Element, Key>();
  const marks: Record<'pointer' | 'overlay' | 'indicator', HTMLElement | null> = { pointer: null, overlay: null, indicator: null };

  const place = (element: HTMLElement, rect: Rect) => {
    const { x, y } = props.zone.rect;
    Object.assign(element.style, { left: `${rect.x - x}px`, top: `${rect.y - y}px`, width: `${rect.w}px`, height: `${rect.h}px` });
  };

  /** The zone's shell (or a plain box), with its items to be put in again. */
  const buildShell = () => {
    if (!root) return;
    for (const child of [...root.children]) if (child.localName !== 'style') child.remove();
    items.clear();
    const html = props.zone.shell ? copies.get(props.zone.shell) : undefined;
    const outer = html ? fromHtml(html) : null;
    zoneElement = outer?.matches('[data-devtools-zone]') ? outer : (outer?.querySelector<HTMLElement>('[data-devtools-zone]') ?? null);
    if (!zoneElement) {
      zoneElement = document.createElement('div');
      zoneElement.setAttribute('data-devtools-zone', '');
      root.appendChild(zoneElement);
    } else root.appendChild(outer!);
    for (const name of ['overlay', 'pointer', 'indicator'] as const) {
      const mark = document.createElement('div');
      mark.className = `dt-${name}`;
      mark.style.display = 'none';
      zoneElement.appendChild(mark);
      marks[name] = mark;
    }
    shell = props.zone.shell;
  };

  const inside = (rect: Rect, margin = 0) => {
    const zone = props.zone.rect;
    return rect.x + rect.w >= zone.x - margin && rect.x <= zone.x + zone.w + margin && rect.y + rect.h >= zone.y - margin && rect.y <= zone.y + zone.h + margin;
  };

  const showMark = (name: keyof typeof marks, rect: Rect | null) => {
    const mark = marks[name];
    if (!mark) return;
    mark.style.display = rect && inside(rect, 8) ? '' : 'none';
    if (rect) place(mark, rect);
  };

  const render = () => {
    if (!root || !host.value) return;
    const { zone, frame } = props;
    if (zone.shell !== shell || !zoneElement?.isConnected) buildShell();
    if (!zoneElement) return;
    Object.assign(zoneElement.style, { width: `${zone.rect.w}px`, height: `${zone.rect.h}px` });
    const seen = new Set<Key>();
    for (const item of zone.items) {
      seen.add(item.id);
      let entry = items.get(item.id);
      if (!entry || entry.copy !== item.copy) {
        const html = copies.get(item.copy);
        const element = (html && fromHtml(html)) || Object.assign(document.createElement('div'), { textContent: String(item.id) });
        element.setAttribute('data-devtools-item', '');
        if (!html) element.setAttribute('data-devtools-box', '');
        keys.set(element, item.id);
        if (entry) entry.element.replaceWith(element);
        else zoneElement.insertBefore(element, marks.overlay);
        entry = { element, copy: item.copy };
        items.set(item.id, entry);
      }
      const { element } = entry;
      place(element, item.rect);
      element.toggleAttribute('data-placeholder', item.placeholder);
      element.toggleAttribute('data-left', item.dragging && !item.placeholder);
      element.toggleAttribute('data-disabled', item.disabled);
      element.toggleAttribute('data-chosen', item.id === props.chosen);
    }
    for (const [id, entry] of items) {
      if (seen.has(id)) continue;
      entry.element.remove();
      items.delete(id);
    }
    const pointer = frame.pointer;
    showMark('pointer', pointer && { x: pointer.x, y: pointer.y, w: 0, h: 0 });
    showMark('overlay', frame.overlay);
    const line = frame.indicator;
    showMark('indicator', line && line.provider === zone.provider && line.list === zone.id ? line.rect : null);
    host.value.style.setProperty('--dt-scale', String(scale.value));
  };

  const onClick = (event: Event) => {
    const item = (event.target as Element | null)?.closest?.('[data-devtools-item]');
    event.preventDefault();
    const id = item && keys.get(item);
    if (id == null) return;
    if (event.type === 'dblclick') emit('open', id);
    else emit('pick', id);
  };

  let observer: ResizeObserver | null = null;
  onMounted(() => {
    root = createRoot(host.value!);
    root.addEventListener('click', onClick);
    root.addEventListener('dblclick', onClick);
    root.addEventListener('submit', (event) => event.preventDefault(), true);
    observer = new ResizeObserver(([entry]) => (width.value = entry!.contentRect.width));
    observer.observe(body.value!);
    render();
  });
  onBeforeUnmount(() => {
    observer?.disconnect();
    if (root) release(root);
  });
  watch([() => props.zone, () => props.frame, () => props.chosen, copiesVersion, scale], render, { flush: 'post' });

  const title = computed(() => {
    const { kind, id } = props.zone;
    return kind === 'free' ? 'draggables' : `${kind === 'droppable' ? 'zone' : kind} ${String(id)}`;
  });
  const size = computed(() => ({
    width: `${props.zone.rect.w * scale.value}px`,
    height: `${props.zone.rect.h * scale.value}px`,
  }));
</script>

<template>
  <section
    class="card"
    :data-over="zone.over || undefined"
    :data-accepting="zone.accepting === null ? undefined : String(zone.accepting)"
    :data-testid="`zone-${zone.id ?? 'free'}`"
  >
    <header :title="zone.id == null ? undefined : 'Its options and state'" @click="zone.id != null && emit('zone')">
      <span class="name mono">{{ title }}</span>
      <span class="chip">{{ zone.items.length }}</span>
      <span v-if="zone.over" class="chip green">over</span>
      <span v-if="zone.accepting === true" class="chip blue">accepts</span>
      <span v-else-if="zone.accepting === false && !zone.disabled" class="chip red">refuses</span>
      <span v-if="zone.disabled" class="chip">disabled</span>
    </header>
    <div ref="body" class="body" :style="{ maxHeight: `${MAX_HEIGHT}px` }">
      <div class="frame" :style="size">
        <div
          ref="host"
          class="host"
          :style="{ width: `${zone.rect.w}px`, height: `${zone.rect.h}px`, transform: `scale(${scale})` }"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
  .card {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg);
    overflow: hidden;
    min-width: 0;
  }

  .card[data-accepting='true'] {
    border-color: var(--blue);
  }

  .card[data-accepting='false'] {
    border-color: var(--red);
  }

  .card[data-over] {
    box-shadow: 0 0 0 2px var(--accent);
  }

  header {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 3px 6px;
    background: var(--bg-soft);
    border-bottom: 1px solid var(--border);
  }

  header[title] {
    cursor: pointer;
  }

  .name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .body {
    overflow: auto;
    padding: 1px;
  }

  .frame {
    position: relative;
    overflow: hidden;
  }

  .host {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: 0 0;
  }
</style>
