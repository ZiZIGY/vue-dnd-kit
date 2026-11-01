import { computed, reactive, ref, shallowRef, type InjectionKey } from 'vue';
import { useKeyModifier } from '@vueuse/core';
import type { DnDSelection, Key } from '@vue-dnd-kit/core';
import { copyLayer, createDesign, createLayer, KINDS, type Layer, type LayerKind } from './design';
import { aligned, distributed, NO_GUIDES, union, type Alignment, type Axis, type Box, type Guides, type Point } from './geometry';

const ZOOM = { min: 0.1, max: 8, fit: 1.5 };
/** Room around the design when it is fitted into the canvas, in screen pixels (less on a phone). */
const FIT_PADDING = 48;
const HISTORY = 100;

export type Tool = 'move' | 'hand';

/** How close an edge or a centre comes to another layer's line before it snaps, in screen pixels. */
export const SNAP = 6;

/** The modifier key the shortcuts are shown with. */
export const MOD = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘' : 'Ctrl';

/** The `data` of a layer's draggable: the overlay lays the dragged layers out by `left` and `top`. */
export interface DragData {
  layer: Layer;
  left: number;
  top: number;
}

/**
 * The editor's state, shared by the toolbar, the canvas and the panels: the design and its
 * history, the view (pan and zoom), the tool, what is hovered and the smart guides. The
 * selection is the provider's: dragging a selected layer drags every selected one, and the
 * rubber band fills it.
 */
export function createEditor(selection: DnDSelection) {
  const layers = ref<Layer[]>(createDesign());

  // ─── Lookups ─────────────────────────────────────────────────────────────────

  /** Every layer by id with the frame it is in, in the order of the layers panel. */
  const index = computed(() => {
    const entries = new Map<string, { layer: Layer; parent: Layer | null }>();
    for (const layer of layers.value) {
      entries.set(layer.id, { layer, parent: null });
      for (const child of layer.children ?? []) entries.set(child.id, { layer: child, parent: layer });
    }
    return entries;
  });

  const find = (id: Key) => index.value.get(String(id))?.layer;
  const parentOf = (id: Key) => index.value.get(String(id))?.parent ?? null;
  /** The layers of `frame`, or of the canvas: front first. */
  const childrenOf = (frame: Layer | null) => (frame ? (frame.children ??= []) : layers.value);

  /** Where a layer is on the canvas, in world units: its frame's corner plus its own position. */
  const boxOf = (layer: Layer): Box => {
    const parent = parentOf(layer.id);
    return { x: layer.x + (parent?.x ?? 0), y: layer.y + (parent?.y ?? 0), width: layer.width, height: layer.height };
  };

  /** The layers of `ids` whose frame isn't one of them: a frame brings its layers along. */
  const topLevel = (ids: Iterable<Key>) => {
    const wanted = new Set([...ids].map(String));
    return [...index.value.values()]
      .filter(({ layer, parent }) => wanted.has(layer.id) && !(parent && wanted.has(parent.id)))
      .map(({ layer }) => layer);
  };

  const visible = computed(() => [...index.value.values()].filter(({ layer, parent }) => !layer.hidden && !parent?.hidden));

  /** The box around the layers of `ids`; `null` when none is a layer (a tool from the toolbar). */
  const boundsOf = (ids: Key[]) => union(topLevel(ids).map(boxOf));

  /** What the dragged layers line up with: every other visible layer, frames included. */
  const snapTargets = (ids: Key[]) => {
    const moving = new Set(ids.map(String));
    return visible.value
      .filter(({ layer, parent }) => !moving.has(layer.id) && !(parent && moving.has(parent.id)))
      .map(({ layer }) => boxOf(layer));
  };

  // ─── Selection ───────────────────────────────────────────────────────────────

  const selected = computed(() => topLevel(selection.ids));

  /**
   * A click picks one layer; with Shift it is added or taken out. A frame and a layer in it
   * are never selected together: dragged, the layer would move twice.
   */
  const select = (id: string, additive = false) => {
    if (!additive) return selection.set([id]);
    if (selection.has(id)) return selection.delete(id);
    const related = [parentOf(id), ...(find(id)?.children ?? [])].flatMap((layer) => (layer ? [layer.id] : []));
    selection.delete(...related);
    selection.add(id);
  };

  const selectAll = () => selection.set(layers.value.filter((layer) => !layer.hidden).map((layer) => layer.id));

  // ─── History ─────────────────────────────────────────────────────────────────

  /** The design before each change, as JSON, and the changes undone. */
  const past = shallowRef<string[]>([]);
  const future = shallowRef<string[]>([]);
  let lastKey: string | null = null;

  /**
   * Saves the design before a change: one undo step. Changes with the same `key` in a row
   * (one field typed into, one handle dragged) make a single step.
   */
  const record = (key: string | null = null) => {
    if (key !== null && key === lastKey) return;
    lastKey = key;
    past.value = [...past.value.slice(1 - HISTORY), JSON.stringify(layers.value)];
    future.value = [];
  };

  const restore = (snapshot: string) => {
    layers.value = JSON.parse(snapshot);
    lastKey = null;
    // Layers that the restored design doesn't have can't stay selected.
    selection.set([...selection.ids].filter((id) => index.value.has(String(id))));
  };

  const undo = () => {
    const snapshot = past.value.at(-1);
    if (snapshot === undefined) return;
    future.value = [...future.value, JSON.stringify(layers.value)];
    past.value = past.value.slice(0, -1);
    restore(snapshot);
  };

  const redo = () => {
    const snapshot = future.value.at(-1);
    if (snapshot === undefined) return;
    past.value = [...past.value, JSON.stringify(layers.value)];
    future.value = future.value.slice(0, -1);
    restore(snapshot);
  };

  // ─── Changes ─────────────────────────────────────────────────────────────────

  const detach = (layer: Layer) => {
    const siblings = childrenOf(parentOf(layer.id));
    siblings.splice(siblings.indexOf(layer), 1);
  };

  /**
   * Moves layers by `shift` (world units) into `frame`, or onto the canvas (`null`). A layer
   * that changes frames goes on top of the layers there; frames stay on the canvas. `copy`
   * leaves the layers where they are and puts copies there instead, selected.
   */
  const move = (ids: Key[], shift: Point, frame: Layer | null, copy = false) => {
    record();
    const arrivals = new Map<Layer | null, Layer[]>();
    for (const layer of topLevel(ids)) {
      const box = boxOf(layer);
      const into = layer.kind === 'frame' ? null : frame;
      const moved = copy ? copyLayer(layer) : layer;
      moved.x = Math.round(box.x + shift.x - (into?.x ?? 0));
      moved.y = Math.round(box.y + shift.y - (into?.y ?? 0));
      if (!copy && parentOf(layer.id) === into) continue;
      if (!copy) detach(layer);
      arrivals.set(into, [...(arrivals.get(into) ?? []), moved]);
    }
    for (const [into, arrived] of arrivals) childrenOf(into).unshift(...arrived);
    if (copy) selection.set([...arrivals.values()].flat().map((layer) => layer.id));
  };

  /** Adds a layer of `kind` centred on `center` (world units), in `frame` or on the canvas. */
  const add = (kind: LayerKind, center: Point, frame: Layer | null = null) => {
    record();
    const into = kind === 'frame' ? null : frame;
    const { name, width, height } = KINDS[kind];
    const count = [...index.value.values()].filter(({ layer }) => layer.kind === kind).length + 1;
    const x = Math.round(center.x - width / 2 - (into?.x ?? 0));
    const y = Math.round(center.y - height / 2 - (into?.y ?? 0));
    const layer = createLayer(kind, `${name} ${count}`, x, y);
    childrenOf(into).unshift(layer);
    selection.set([layer.id]);
  };

  const remove = () => {
    const doomed = selected.value;
    if (!doomed.length) return;
    record();
    doomed.forEach(detach);
    selection.clear();
  };

  /** Copies of the selected layers, a little down and to the right, just in front of them. */
  const duplicate = () => {
    const sources = selected.value;
    if (!sources.length) return;
    record();
    const copies = sources.map((source) => {
      const copy = { ...copyLayer(source), x: source.x + 16, y: source.y + 16 };
      const siblings = childrenOf(parentOf(source.id));
      siblings.splice(siblings.indexOf(source), 0, copy);
      return copy;
    });
    selection.set(copies.map((copy) => copy.id));
  };

  /** Moves the selection with the arrow keys; pressing them in a row is one undo step. */
  const nudge = (x: number, y: number) => {
    if (!selected.value.length) return;
    record(`nudge:${[...selection.ids].join()}`);
    for (const layer of selected.value) {
      layer.x += x;
      layer.y += y;
    }
  };

  /** Edits of a layer: edits of one field in a row are one undo step, as are those with the same `key`. */
  const update = (layer: Layer, patch: Partial<Layer>, key = `${Object.keys(patch).join()}:${layer.id}`) => {
    record(key);
    Object.assign(layer, patch);
  };

  const rename = (layer: Layer, name: string) => {
    record();
    layer.name = name;
  };

  const setHidden = (layer: Layer, hidden: boolean) => {
    record();
    layer.hidden = hidden;
    // A hidden layer isn't on the canvas: nothing to select or drag.
    if (hidden) selection.delete(layer.id, ...(layer.children ?? []).map((child) => child.id));
  };

  /** Several layers line up with each other; one layer lines up with its frame. */
  const align = (alignment: Alignment) => {
    const targets = selected.value;
    const frame = targets.length === 1 ? parentOf(targets[0]!.id) : null;
    const bounds = frame ? boxOf(frame) : targets.length > 1 ? union(targets.map(boxOf)) : null;
    if (!bounds) return;
    record();
    for (const layer of targets) {
      const box = boxOf(layer);
      const to = aligned(box, bounds, alignment);
      layer.x += Math.round(to.x - box.x);
      layer.y += Math.round(to.y - box.y);
    }
  };

  /** Equal space between three or more layers, the outer ones staying where they are. */
  const distribute = (axis: Axis) => {
    const targets = selected.value;
    if (targets.length < 3) return;
    record();
    const boxes = targets.map(boxOf);
    distributed(boxes, axis).forEach((start, index) => (targets[index]![axis] += Math.round(start - boxes[index]![axis])));
  };

  // ─── View ────────────────────────────────────────────────────────────────────

  /** Pan and zoom: a point of the world is drawn at `x + point × zoom` in the canvas. */
  const view = reactive({ x: 0, y: 0, zoom: 1 });
  const viewport = { width: 0, height: 0 };
  /** Until the view is panned or zoomed, the design is fitted again when the canvas resizes. */
  let fitted = true;

  const fit = () => {
    const bounds = union(visible.value.filter(({ parent }) => !parent).map(({ layer }) => boxOf(layer)));
    if (!bounds || !viewport.width) return;
    const padding = Math.min(FIT_PADDING, viewport.width * 0.08);
    const room = { width: viewport.width - 2 * padding, height: viewport.height - 2 * padding };
    const zoom = Math.max(ZOOM.min, Math.min(room.width / bounds.width, room.height / bounds.height, ZOOM.fit));
    view.zoom = zoom;
    view.x = Math.round((viewport.width - bounds.width * zoom) / 2 - bounds.x * zoom);
    view.y = Math.round((viewport.height - bounds.height * zoom) / 2 - bounds.y * zoom);
    fitted = true;
  };

  const setViewport = (width: number, height: number) => {
    Object.assign(viewport, { width, height });
    if (fitted) fit();
  };

  const panBy = (x: number, y: number) => {
    view.x += x;
    view.y += y;
    fitted = false;
  };

  /** Zooms by `factor` around a point of the canvas (its centre by default), which stays put. */
  const zoomBy = (factor: number, around: Point = { x: viewport.width / 2, y: viewport.height / 2 }) => {
    const zoom = Math.min(ZOOM.max, Math.max(ZOOM.min, view.zoom * factor));
    view.x = around.x - ((around.x - view.x) * zoom) / view.zoom;
    view.y = around.y - ((around.y - view.y) * zoom) / view.zoom;
    view.zoom = zoom;
    fitted = false;
  };

  /** What a dragged layer carries: itself, and where it is drawn in the world, in screen pixels. */
  const dragData = (layer: Layer): DragData => {
    const box = boxOf(layer);
    return { layer, left: box.x * view.zoom, top: box.y * view.zoom };
  };

  /** The centre of the canvas, in world units: where a clicked tool adds its layer. */
  const center = (): Point => ({
    x: (viewport.width / 2 - view.x) / view.zoom,
    y: (viewport.height / 2 - view.y) / view.zoom,
  });

  // ─── Tools and transient state ───────────────────────────────────────────────

  const tool = ref<Tool>('move');
  /** Space held: the hand tool for as long as it is. */
  const spaceHeld = ref(false);
  const panning = computed(() => tool.value === 'hand' || spaceHeld.value);
  /** Alt held while a drag drops: copies land, the layers stay. */
  const altHeld = useKeyModifier('Alt', { initial: false });
  /** Shift held when a band starts: it adds to the selection. */
  const shiftHeld = useKeyModifier('Shift', { initial: false });
  const hovered = ref<string | null>(null);
  const guides = shallowRef<Guides>(NO_GUIDES);

  return {
    layers,
    find,
    parentOf,
    boxOf,
    dragData,
    boundsOf,
    snapTargets,
    selected,
    select,
    selectAll,
    record,
    undo,
    redo,
    canUndo: computed(() => past.value.length > 0),
    canRedo: computed(() => future.value.length > 0),
    move,
    add,
    remove,
    duplicate,
    nudge,
    update,
    rename,
    setHidden,
    align,
    distribute,
    view,
    fit,
    setViewport,
    panBy,
    zoomBy,
    center,
    tool,
    spaceHeld,
    panning,
    altHeld,
    shiftHeld,
    hovered,
    guides,
  };
}

export type Editor = ReturnType<typeof createEditor>;

export const EDITOR: InjectionKey<Editor> = Symbol('editor');
