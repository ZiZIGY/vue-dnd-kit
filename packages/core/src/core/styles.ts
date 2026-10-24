/**
 * Default styles, injected once per document when a provider mounts.
 * `:where()` keeps specificity at zero, so any user CSS overrides them.
 * While dragging, `<html>` gets `data-dnd-dragging` instead of inline body styles,
 * so nothing the page set inline is ever overwritten.
 */

const STYLE_ID = 'vue-dnd-kit-styles';

const CSS = `
:where([data-dnd-placeholder]) { opacity: 0.4; }
:where(html[data-dnd-dragging]),
:where(html[data-dnd-dragging] *) { user-select: none !important; -webkit-user-select: none !important; overflow-anchor: none !important; }
:where(html[data-dnd-dragging="pointer"]),
:where(html[data-dnd-dragging="pointer"] *) { cursor: grabbing !important; }
`;

export const injectDefaultStyles = (): void => {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
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
