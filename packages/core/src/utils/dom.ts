import { getCurrentInstance, useId } from 'vue';
import { unrefElement } from '@vueuse/core';
import type { MaybeElementRef } from '../types';

let uid = 0;

/**
 * Default id of a composable. In a component: `useId()`, the same on the server and
 * the client, unique per app (`app.config.idPrefix` tells apps sharing a provider
 * apart). Without a component instance (a detached `effectScope`): a module counter.
 */
export const createId = (prefix: string): string =>
  `${prefix}-${getCurrentInstance() ? useId() : ++uid}`;

export const isClient = typeof window !== 'undefined';

const ELEMENT_NODE = 1;

/**
 * Resolves an element, component ref or getter to a DOM element. A component with
 * several root nodes (a fragment, common in UI kits) exposes an anchor text node as
 * `$el`: its first element is used instead.
 */
export const toElement = (target: MaybeElementRef): HTMLElement | null => {
  const node = unrefElement(target as Parameters<typeof unrefElement>[0]) as Node | null | undefined;
  if (!node) return null;
  if (node.nodeType === ELEMENT_NODE) return node as HTMLElement;
  return ((node as CharacterData).nextElementSibling as HTMLElement | null) ?? null;
};

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
