import { computed, inject, ref, type InjectionKey } from 'vue';
import {
  BLOCKS,
  copySection,
  createBlock,
  createPage,
  createSection,
  type Block,
  type BlockKind,
  type Column,
  type Section,
  type SectionKind,
} from './page';

/**
 * The editor's state: the page, what is selected and edited, the preview width, and the
 * history. Drops change the page through the lists; the buttons and shortcuts call the
 * actions here. Each change is then one step of undo.
 */

/** The sortable lists' ids: drop events, the overlay's `to` and announcements name them. */
export const PAGE = 'page';
export const LAYERS = 'layers';

export type Device = 'desktop' | 'tablet' | 'mobile';
export const DEVICES: Record<Device, { name: string; width: string }> = {
  desktop: { name: 'Desktop', width: '100%' },
  tablet: { name: 'Tablet', width: '768px' },
  mobile: { name: 'Mobile', width: '390px' },
};

/** Where a node is on the page: its section, and for a column or a block, its column. */
interface Place {
  section: Section;
  sectionIndex: number;
  column?: Column;
  block?: Block;
  blockIndex: number;
}

/** History steps kept for undo. */
const HISTORY = 100;

export function createBuilder() {
  const sections = ref<Section[]>(createPage());
  /** The selected section or block, by id: the hero to start with. */
  const selected = ref<string | null>(sections.value[1]?.id ?? null);
  /** The node under the pointer in the layers panel: the canvas outlines it. */
  const hovered = ref<string | null>(null);
  /** The block whose texts are being edited. */
  const editing = ref<string | null>(null);
  const device = ref<Device>('desktop');
  /** The page's width on screen: its type scale, read by the overlays too. */
  const pageWidth = ref(0);

  const find = (id: string | null): Place | null => {
    if (!id) return null;
    for (const [sectionIndex, section] of sections.value.entries()) {
      if (section.id === id) return { section, sectionIndex, blockIndex: -1 };
      for (const column of section.columns) {
        if (column.id === id) return { section, sectionIndex, column, blockIndex: -1 };
        const blockIndex = column.blocks.findIndex((block) => block.id === id);
        if (blockIndex >= 0) return { section, sectionIndex, column, block: column.blocks[blockIndex], blockIndex };
      }
    }
    return null;
  };

  const select = (id: string | null) => {
    selected.value = id;
    if (editing.value !== id) editing.value = null;
  };

  // ─── History: the page as JSON after each change ─────────────────────────────

  const past = ref<string[]>([]);
  const future = ref<string[]>([]);
  let present = JSON.stringify(sections.value);

  /** Records the page as it is now: after a drop, a button, an edited text. */
  const commit = () => {
    const now = JSON.stringify(sections.value);
    if (now === present) return;
    past.value = [...past.value.slice(-HISTORY + 1), present];
    future.value = [];
    present = now;
  };

  const restore = (snapshot: string) => {
    present = snapshot;
    // New objects with the same ids: the lists animate what moved, nothing else re-renders.
    sections.value = JSON.parse(snapshot);
    editing.value = null;
    if (!find(selected.value)) selected.value = null;
  };

  const undo = () => {
    const previous = past.value.at(-1);
    if (previous === undefined) return;
    past.value = past.value.slice(0, -1);
    future.value = [...future.value, present];
    restore(previous);
  };

  const redo = () => {
    const next = future.value.at(-1);
    if (next === undefined) return;
    future.value = future.value.slice(0, -1);
    past.value = [...past.value, present];
    restore(next);
  };

  // ─── Actions without a drag: clicks, toolbar buttons, shortcuts ──────────────

  const insertSection = (section: Section, index: number) => {
    sections.value = sections.value.toSpliced(index, 0, section);
    selected.value = section.id;
  };

  const insertBlock = (column: Column, block: Block, index: number) => {
    column.blocks = column.blocks.toSpliced(index, 0, block);
    selected.value = block.id;
  };

  /** A template clicked: a new section after the selected one, else at the end. */
  const addSection = (kind: SectionKind) => {
    const at = find(selected.value);
    insertSection(createSection(kind), at ? at.sectionIndex + 1 : sections.value.length);
    commit();
  };

  /** A chip clicked: a new block after the selected block, else at the end of the selected (or last) section's first column. */
  const addBlock = (kind: BlockKind) => {
    const at = find(selected.value ?? sections.value.at(-1)?.id ?? null);
    const column = at?.column ?? at?.section.columns[0];
    if (!at || !column) return;
    insertBlock(column, createBlock(BLOCKS[kind].spec), at.block ? at.blockIndex + 1 : column.blocks.length);
    commit();
  };

  /** A section one slot up (`-1`) or down (`1`). */
  const moveSection = (id: string, by: -1 | 1) => {
    const at = find(id);
    const to = at ? at.sectionIndex + by : -1;
    if (!at || at.column || to < 0 || to >= sections.value.length) return;
    sections.value = sections.value.toSpliced(at.sectionIndex, 1).toSpliced(to, 0, at.section);
    commit();
  };

  /** A copy right after a section or a block, selected. */
  const duplicate = (id: string) => {
    const at = find(id);
    if (at?.block && at.column) insertBlock(at.column, createBlock(at.block), at.blockIndex + 1);
    else if (at && !at.column) insertSection(copySection(at.section), at.sectionIndex + 1);
    else return;
    commit();
  };

  /** Removes a section, or a block (its section is selected then). */
  const remove = (id: string) => {
    const at = find(id);
    if (at?.block && at.column) {
      at.column.blocks = at.column.blocks.filter((block) => block.id !== id);
      select(at.section.id);
    } else if (at && !at.column) {
      sections.value = sections.value.filter((section) => section.id !== id);
      select(null);
    } else return;
    commit();
  };

  return {
    sections,
    selected,
    hovered,
    editing,
    device,
    pageWidth,
    canUndo: computed(() => past.value.length > 0),
    canRedo: computed(() => future.value.length > 0),
    find,
    select,
    commit,
    undo,
    redo,
    addSection,
    addBlock,
    moveSection,
    duplicate,
    remove,
  };
}

export type Builder = ReturnType<typeof createBuilder>;
export const BUILDER: InjectionKey<Builder> = Symbol('builder');

/** The editor's state, provided by index.vue above the provider: the overlays read it too. */
export const useBuilder = () => inject(BUILDER)!;

/** Scrolls `container` just enough to show `element`, without scrolling the page around it. */
export const reveal = (container: HTMLElement | null, element: Element | null | undefined) => {
  if (!container || !element) return;
  const box = container.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  if (rect.top < box.top) container.scrollBy({ top: rect.top - box.top - 16, behavior });
  else if (rect.bottom > box.bottom) container.scrollBy({ top: Math.min(rect.bottom - box.bottom + 16, rect.top - box.top - 16), behavior });
};
