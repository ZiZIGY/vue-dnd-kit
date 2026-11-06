import { getCurrentInstance, toValue, useId, type ComponentPublicInstance, type VNode } from 'vue';
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
const DOCUMENT_FRAGMENT_NODE = 11;
const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

/**
 * The document a node is in: another window's for the part of the app it shows (a popup
 * opened with `window.open` that a teleport renders into). The page's without a node.
 */
export const docOf = (node: Node | null | undefined): Document =>
  (node?.nodeType === 9 ? (node as Document) : node?.ownerDocument) ?? document;

/** The window of a node's document (see `docOf`). */
export const viewOf = (node: Node | null | undefined): Window => docOf(node).defaultView ?? window;

/**
 * An element of any window. `instanceof Element` is false for the nodes another window
 * made (its clones, the elements it parsed): each window has its own classes.
 */
export const isElement = (value: unknown): value is Element =>
  !!value && (value as Partial<Node>).nodeType === ELEMENT_NODE;

/** An HTML element of any window (see `isElement`). */
export const isHTMLElement = (value: unknown): value is HTMLElement =>
  isElement(value) && value.namespaceURI === HTML_NAMESPACE;

/** A shadow root of any window (see `isElement`). */
export const isShadowRoot = (value: unknown): value is ShadowRoot =>
  !!value && (value as Partial<Node>).nodeType === DOCUMENT_FRAGMENT_NODE && 'host' in (value as object);

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
export const parentOf = (element: Element): Element | null => {
  const parent = element.assignedSlot ?? element.parentElement;
  if (parent) return parent;
  const root = element.getRootNode();
  return isShadowRoot(root) ? root.host : null;
};

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

/** Topmost element at a point of `doc`'s viewport, descending into open shadow roots. */
export const elementFromPoint = (x: number, y: number, doc: Document = document): Element | null => {
  let element = doc.elementFromPoint(x, y);
  while (element?.shadowRoot) {
    const inner = element.shadowRoot.elementFromPoint(x, y);
    if (!inner || inner === element) break;
    element = inner;
  }
  return element;
};

/**
 * Topmost element at a point outside `skip`: what is under an element that sits on the
 * point itself (a draggable moved without an overlay). Its parent when nothing else is.
 */
export const elementBelow = (x: number, y: number, skip: Element): Element | null => {
  const doc = docOf(skip);
  const stack = doc.elementsFromPoint?.(x, y) ?? [];
  const below = stack.find((element) => !containsComposed(skip, element)) ?? parentOf(skip);
  if (!below?.shadowRoot) return below;
  const inner = elementFromPoint(x, y, doc);
  return inner && !containsComposed(skip, inner) ? inner : below;
};

const EDITABLE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';
const INTERACTIVE = `${EDITABLE}, option, button`;
const FOCUSABLE = `${EDITABLE}, a[href], button`;

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

export const isEditable = (element: Element): boolean => element.matches(EDITABLE);

export const isNativelyFocusable = (element: Element): boolean =>
  element.matches(FOCUSABLE);

/**
 * True when nothing has the focus any more: the focused element left the document
 * (re-rendered or unmounted), and the browser moved the focus back to <body>.
 */
export const isFocusLost = (doc: Document = document): boolean => {
  const focused = doc.activeElement;
  return (
    !focused ||
    focused === doc.body ||
    focused === doc.documentElement ||
    !focused.isConnected
  );
};

/**
 * An animation frame of `view`: a drag in another window runs on that window's frames, the
 * page's may be throttled behind it. The page's own goes through the global functions.
 */
export const requestFrame = (view: Window | null | undefined, callback: FrameRequestCallback): number =>
  view && view !== window ? view.requestAnimationFrame(callback) : requestAnimationFrame(callback);

/** Cancels a frame `requestFrame` asked `view` for. */
export const cancelFrame = (view: Window | null | undefined, frame: number): void => {
  if (view && view !== window) view.cancelAnimationFrame(frame);
  else cancelAnimationFrame(frame);
};

/** Frames stop in hidden tabs and can stall on a busy compositor: wait at most this long. */
const FRAME_TIMEOUT = 100;

/** Resolves on the next animation frame of `view`, or after `FRAME_TIMEOUT` ms when frames stall. */
export const nextFrame = (view?: Window | null): Promise<void> =>
  new Promise((resolve) => {
    const done = () => {
      cancelFrame(view, frame);
      clearTimeout(timer);
      resolve();
    };
    const frame = requestFrame(view, done);
    const timer = setTimeout(done, FRAME_TIMEOUT);
  });
