import { unrefElement } from '@vueuse/core';
import type { MaybeElementRef } from '../types';

let uid = 0;

export const createId = (prefix: string): string => `${prefix}-${++uid}`;

export const isClient = typeof window !== 'undefined';

/** Resolves an element, component ref or getter to a DOM element. */
export const toElement = (target: MaybeElementRef): HTMLElement | null =>
  (unrefElement(target as Parameters<typeof unrefElement>[0]) as
    | HTMLElement
    | null
    | undefined) ?? null;

/**
 * Parent in the flat tree: slotted elements go to their slot, shadow roots to their
 * host. This is the tree that lays out, clips and scrolls an element, and the one
 * hit-testing walks.
 */
export const parentOf = (element: Element): Element | null =>
  element.assignedSlot ??
  element.parentElement ??
  ((element.getRootNode() as ShadowRoot).host as Element | undefined) ??
  null;

/** `ancestor.contains(node)` across shadow roots and slots. */
export const containsComposed = (ancestor: Element, node: Element): boolean => {
  if (ancestor.contains(node)) return true;
  // In the same tree, a flat-tree ancestor is always a DOM ancestor too.
  if (ancestor.getRootNode() === node.getRootNode()) return false;
  for (let element = parentOf(node); element; element = parentOf(element)) {
    if (element === ancestor) return true;
  }
  return false;
};

/** Real event target, not retargeted to a shadow host (open shadow roots). */
export const getEventTarget = (event: Event): EventTarget | null =>
  event.composedPath?.()[0] ?? event.target;

/** Topmost element at a point, descending into open shadow roots. */
export const elementFromPoint = (x: number, y: number): Element | null => {
  let element = document.elementFromPoint(x, y);
  while (element?.shadowRoot) {
    const inner = element.shadowRoot.elementFromPoint(x, y);
    if (!inner || inner === element) break;
    element = inner;
  }
  return element;
};

const INTERACTIVE =
  'input, textarea, select, option, button, [contenteditable]:not([contenteditable="false"])';

/** True when `target` sits inside an interactive element nested in `container`. */
export const isInsideInteractive = (
  target: Element,
  container: Element,
): boolean => {
  const interactive = target.closest(INTERACTIVE);
  return (
    !!interactive && interactive !== container && container.contains(interactive)
  );
};

export const isEditable = (element: Element): boolean =>
  element.matches(
    'input, textarea, select, [contenteditable]:not([contenteditable="false"])',
  );

const FOCUSABLE =
  'a[href], button, input, select, textarea, [contenteditable]:not([contenteditable="false"])';

export const isNativelyFocusable = (element: Element): boolean =>
  element.matches(FOCUSABLE);

export const nextFrame = (): Promise<void> =>
  new Promise((resolve) => requestAnimationFrame(() => resolve()));
