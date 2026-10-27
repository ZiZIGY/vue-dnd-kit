/**
 * Default styles, injected once per document when a provider mounts.
 * `:where()` keeps specificity at zero, so any user CSS overrides them. The looks
 * (opacity) sit in the cascade layer `vue-dnd-kit`, first in the document, so layered
 * CSS (Tailwind v4 utilities, UI kits) overrides them too.
 * While dragging, `<html>` gets `data-dnd-dragging` instead of inline body styles,
 * so nothing the page set inline is ever overwritten.
 */

const STYLE_ID = 'vue-dnd-kit-styles';

// `[data-dnd-dragging]` on an item: dragged along but left in place (multi-drag 'gaps').
// <html> carries the same attribute for the whole drag, hence `:not(html)`.
// A touch drag starts (200ms) before iOS shows its link callout and magnifier (~500ms),
// and WebKit reads `-webkit-touch-callout` when it recognises that long press.
// The `!important` rules stay out of the layer: in one, they would beat the page's own.
const CSS = `
@layer vue-dnd-kit {
  :where([data-dnd-placeholder]) { opacity: 0.4; }
  :where([data-dnd-dragging]:not(html)) { opacity: 0.4; }
}
:where(html[data-dnd-dragging]),
:where(html[data-dnd-dragging] *) { user-select: none !important; -webkit-user-select: none !important; overflow-anchor: none !important; }
:where(html[data-dnd-dragging="pointer"]),
:where(html[data-dnd-dragging="pointer"] *) { cursor: grabbing !important; -webkit-touch-callout: none !important; }
`;

export const injectDefaultStyles = (): void => {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  // First: the layer is declared before the page's, which makes it the weakest.
  document.head.prepend(style);
};

/** Marks the document as dragging; returns the restore function. */
export const markDocumentDragging = (sensor: 'pointer' | 'keyboard'): (() => void) => {
  const root = document.documentElement;
  root.setAttribute('data-dnd-dragging', sensor);
  document.getSelection()?.removeAllRanges();
  const preventSelection = (event: Event) => event.preventDefault();
  document.addEventListener('selectstart', preventSelection);
  return () => {
    root.removeAttribute('data-dnd-dragging');
    document.removeEventListener('selectstart', preventSelection);
  };
};
