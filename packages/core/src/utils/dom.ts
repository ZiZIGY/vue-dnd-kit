import { toValue, type ComponentPublicInstance, type VNode } from 'vue';
import { unrefElement } from '@vueuse/core';
import type { MaybeElementRef } from '../types';

let uid = 0;

export const createId = (prefix: string): string => `${prefix}-${++uid}`;

export const isClient = typeof window !== 'undefined';

const ELEMENT_NODE = 1;

/**
 * End anchor of a component's fragment (or teleport) root, through components that
 * render another component (`<UTooltip>` → `<TooltipRoot>` → fragment). `null` for a
 * root without a range (a comment or a text); `undefined` when `value` isn't a component.
 */
const fragmentEnd = (value: unknown): Node | null | undefined => {
  const instance = (value as Partial<ComponentPublicInstance> | null)?.$;
  if (!instance) return undefined;
  let tree: VNode | undefined = instance.subTree;
  while (tree?.component) tree = tree.component.subTree;
  return (tree?.anchor as Node | null | undefined) ?? null;
};

/**
 * Resolves an element, component ref or getter to a DOM element. A component with
 * several root nodes (a fragment, common in UI kits: tooltips and menus render their
 * activator next to a teleport) exposes the fragment's start anchor, a text node, as
 * `$el`: its first element is used instead. Nothing past the fragment's end counts:
 * a fragment with no element in place (only teleported content) resolves to `null`,
 * never to the element that follows the component.
 */
export const toElement = (target: MaybeElementRef): HTMLElement | null => {
  const node = unrefElement(target as Parameters<typeof unrefElement>[0]) as Node | null | undefined;
  if (!node) return null;
  if (node.nodeType === ELEMENT_NODE) return node as HTMLElement;
  const end = fragmentEnd(toValue(target));
  // A component that rendered a comment (`v-if`) or a text has no element.
  if (end === null) return null;
  for (let next = node.nextSibling; next && next !== end; next = next.nextSibling) {
    if (next.nodeType === ELEMENT_NODE) return next as HTMLElement;
  }
  return null;
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
