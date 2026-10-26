/**
 * Copies of the page's elements in the tab live in shadow roots, styled by the page's CSS
 * (one constructed sheet that every root adopts: it is parsed once) and the tab's marks
 * on top (the placeholder, the selection, the pointer, the insertion line, the overlay).
 * `@import`s of other origins' sheets can't be in a constructed sheet: a `<style>` per
 * root has them.
 */

import { watch } from 'vue';
import { css } from './connection';

const constructable = 'adoptedStyleSheets' in Document.prototype && 'replaceSync' in CSSStyleSheet.prototype;
const pageSheet = constructable ? new CSSStyleSheet() : null;
const marksSheet = constructable ? new CSSStyleSheet() : null;

/** The tab's marks. Sizes are divided by the copy's scale (`--dt-scale`): a mark keeps its size in the tab. */
const MARKS = `
:host { all: initial; display: block; --dt-px: calc(1px / var(--dt-scale, 1)); }
[data-devtools-zone] { position: relative !important; }
[data-devtools-item] { position: absolute !important; margin: 0 !important; box-sizing: border-box !important;
  transition: none !important; animation: none !important; translate: none !important; cursor: pointer;
  pointer-events: auto !important; }
[data-devtools-item] * { pointer-events: none !important; }
[data-devtools-item][data-placeholder] { outline: calc(2 * var(--dt-px)) dashed #42b883 !important;
  outline-offset: calc(-2 * var(--dt-px)) !important; opacity: 0.55 !important; }
[data-devtools-item][data-left] { opacity: 0.35 !important; }
[data-devtools-item][data-disabled] { filter: grayscale(1) !important; opacity: 0.6 !important; }
[data-devtools-item][data-chosen] { box-shadow: 0 0 0 calc(2 * var(--dt-px)) #3b82f6,
  0 0 0 calc(5 * var(--dt-px)) rgb(59 130 246 / 0.25) !important; z-index: 1; }
[data-devtools-box] { display: flex; align-items: center; justify-content: center; background: #94a3b833;
  border: 1px solid #94a3b8; font: 12px ui-monospace, monospace; color: #475569; width: 100%; height: 100%; }
.dt-pointer { position: absolute; width: calc(12 * var(--dt-px)); height: calc(12 * var(--dt-px));
  margin: calc(-6 * var(--dt-px)); border-radius: 50%; background: #f59e0b;
  box-shadow: 0 0 0 calc(3 * var(--dt-px)) rgb(245 158 11 / 0.35); z-index: 4; pointer-events: none; }
.dt-overlay { position: absolute; border: calc(2 * var(--dt-px)) dashed #8b5cf6; background: rgb(139 92 246 / 0.08);
  z-index: 3; pointer-events: none; box-sizing: border-box; }
.dt-indicator { position: absolute; background: #ef4444; z-index: 4; pointer-events: none;
  min-width: calc(3 * var(--dt-px)); min-height: calc(3 * var(--dt-px)); }
`;

const IMPORT = /@import[^;]+;/g;
/** Roots without constructed sheets get a `<style>` with all of it; the others, the imports only. */
const roots = new Map<ShadowRoot, HTMLStyleElement>();

const styleText = (text: string) => {
  const imports = (text.match(IMPORT) ?? []).join('\n');
  return constructable ? imports : `${imports}\n${MARKS}\n${text.replace(IMPORT, '')}`;
};

marksSheet?.replaceSync(MARKS);
watch(css, (text) => {
  pageSheet?.replaceSync(text.replace(IMPORT, ''));
  for (const style of roots.values()) style.textContent = styleText(text);
});

/** A shadow root on `host` with the page's CSS and the marks. Call `release` when the host goes. */
export const createRoot = (host: HTMLElement): ShadowRoot => {
  const root = host.attachShadow({ mode: 'open' });
  // The page's last: its `:host` rule (the page's font and color, `frames.ts`) is over the marks' reset.
  if (pageSheet && marksSheet) root.adoptedStyleSheets = [marksSheet, pageSheet];
  const style = document.createElement('style');
  style.textContent = styleText(css.value);
  root.appendChild(style);
  roots.set(root, style);
  return root;
};

export const release = (root: ShadowRoot): void => {
  roots.delete(root);
};

/** An element from a copy's HTML (`null` when it has none), without what would run in the tab. */
export const fromHtml = (html: string): HTMLElement | null => {
  const template = document.createElement('template');
  template.innerHTML = html;
  const { content } = template;
  content.querySelectorAll('script, iframe, object, embed').forEach((element) => element.remove());
  for (const element of content.querySelectorAll('*')) {
    for (const name of element.getAttributeNames()) if (name.startsWith('on')) element.removeAttribute(name);
  }
  return content.firstElementChild as HTMLElement | null;
};
