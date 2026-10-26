/**
 * Overlay clone of the dragged element. Taken synchronously at drag start,
 * before the placeholder re-renders, and detached from page-level side effects.
 */

import { parentOf } from '../utils/dom';
import { snapshotStyles } from './snapshot';

let radioGroup = 0;

const copyFormState = (source: Element, clone: Element) => {
  const sourceFields = source.querySelectorAll('input, textarea, select');
  const cloneFields = clone.querySelectorAll('input, textarea, select');
  const suffix = `-dnd-clone-${++radioGroup}`;
  sourceFields.forEach((field, index) => {
    const target = cloneFields[index];
    if (!target) return;
    if (field instanceof HTMLInputElement && target instanceof HTMLInputElement) {
      target.value = field.value;
      target.checked = field.checked;
      // A cloned radio would join (and steal from) the original group.
      if (field.type === 'radio' && field.name) target.name = field.name + suffix;
    } else if (field instanceof HTMLTextAreaElement && target instanceof HTMLTextAreaElement) {
      target.value = field.value;
    } else if (field instanceof HTMLSelectElement && target instanceof HTMLSelectElement) {
      target.selectedIndex = field.selectedIndex;
    }
  });
};

const copyCanvases = (source: Element, clone: Element) => {
  const sourceCanvases = source.querySelectorAll('canvas');
  const cloneCanvases = clone.querySelectorAll('canvas');
  sourceCanvases.forEach((canvas, index) => {
    const target = cloneCanvases[index];
    try {
      target?.getContext('2d')?.drawImage(canvas, 0, 0);
    } catch {
      // Tainted or WebGL canvases can't be copied; the clone stays blank.
    }
  });
};

const wrapTableRow = (row: HTMLElement, source: HTMLElement): HTMLElement => {
  const table = document.createElement('table');
  const body = document.createElement('tbody');
  table.style.borderCollapse = 'collapse';
  table.style.width = '100%';
  table.style.height = '100%';
  const sourceCells = source.children;
  Array.from(row.children).forEach((cell, index) => {
    const width = sourceCells[index]?.getBoundingClientRect().width;
    if (width) (cell as HTMLElement).style.width = `${width}px`;
  });
  body.appendChild(row);
  table.appendChild(body);
  return table;
};

/** `transparent`, `rgba(…, 0)` and the `… / 0)` forms (oklch, color()) of a zero alpha. */
export const isTransparent = (color: string): boolean =>
  !color || color === 'transparent' || /^rgba\(.*,\s*0(?:\.0*)?\)$|\/\s*0(?:\.0*)?\)$/.test(color);

/** Background painted behind `element`: the first ancestor (flat tree) that has one. */
const findBackdrop = (element: Element): string | null => {
  for (let parent = parentOf(element); parent; parent = parentOf(parent)) {
    const color = getComputedStyle(parent).backgroundColor;
    if (!isTransparent(color)) return color;
  }
  return null;
};

export interface CloneOptions {
  /**
   * A source without a background of its own gets the one painted behind it. List
   * items and table rows (UI kits' in particular) take their color from the list or
   * table; a transparent clone floating over other items would let them show through.
   */
  opaque?: boolean;
  /** Where the clone will be shown (the overlay's parent): the styles it loses there are inlined. */
  container?: Element | null;
}

/**
 * Effects UI kits add inside an element while it's pressed: Vuetify's ripple, Quasar's,
 * PrimeVue's ink, Naive UI's wave. A copy would freeze them mid-animation.
 */
const PRESS_EFFECTS = '.v-ripple__container, .q-ripple, .p-ink, .n-base-wave';

/** Nodes of copies marked `data-dnd-no-clone` in their source (the mark itself is stripped). */
const leftOut = new WeakSet<Element>();

/**
 * Takes out of a copy what shouldn't travel with it: press effects of UI kits and elements
 * marked `data-dnd-no-clone`. After the style snapshot, which pairs the copy's elements
 * with the source's by position.
 */
export const removeTransient = (copy: Element): void => {
  for (const element of copy.querySelectorAll('*')) {
    if (leftOut.has(element) || element.matches(PRESS_EFFECTS)) element.remove();
  }
};

/**
 * A deep copy of `source` that stays out of the page's way: no ids, no `data-dnd-*` marks,
 * hidden from assistive tech, with what `cloneNode` leaves out (form state, canvas pixels).
 * `source` may be detached (an item Vue just removed).
 */
export const copyElement = (source: HTMLElement): HTMLElement => {
  const clone = source.cloneNode(true) as HTMLElement;
  for (const element of [clone, ...clone.querySelectorAll('*')]) {
    element.removeAttribute('id');
    if (element.hasAttribute('data-dnd-no-clone')) leftOut.add(element);
    for (const name of element.getAttributeNames()) {
      if (name.startsWith('data-dnd-')) element.removeAttribute(name);
    }
  }
  copyFormState(source, clone);
  copyCanvases(source, clone);
  clone.setAttribute('aria-hidden', 'true');
  clone.removeAttribute('tabindex');
  return clone;
};

/**
 * The overlay's clone of `source`: a copy that fills the overlay box, with the computed
 * styles it would lose outside its list inlined (`snapshot.ts`). A table row comes in a
 * table of its own.
 */
export const clonePreview = (source: HTMLElement, { opaque = false, container }: CloneOptions = {}): HTMLElement => {
  const clone = copyElement(source);
  const computed = getComputedStyle(source);
  const hasImage = !!computed.backgroundImage && computed.backgroundImage !== 'none';
  const backdrop = opaque && !hasImage && isTransparent(computed.backgroundColor) ? findBackdrop(source) : null;
  for (let index = 0; index < computed.length; index++) {
    const property = computed.item(index);
    if (property.startsWith('--')) {
      clone.style.setProperty(property, computed.getPropertyValue(property));
    }
  }
  // The clone fills the overlay box: when the box takes the size of another list's
  // items, the content re-lays out at that size instead of being scaled.
  Object.assign(clone.style, {
    width: '100%',
    height: '100%',
    margin: '0',
    boxSizing: 'border-box',
    transform: 'none',
    translate: 'none',
    transition: 'none',
    pointerEvents: 'none',
  });

  const preview = source.tagName === 'TR' ? wrapTableRow(clone, source) : clone;
  // Laid out as the overlay will show it: the root's styles above are in place.
  snapshotStyles(source, clone, preview, container ?? document.body);
  removeTransient(clone);
  if (backdrop) clone.style.setProperty('background-color', backdrop);
  // A positioned source (a piece on a board) would keep its offsets inside the overlay.
  // `relative` keeps it a containing block for its own positioned children.
  if (computed.position !== 'static') Object.assign(clone.style, { position: 'relative', inset: 'auto' });
  return preview;
};
