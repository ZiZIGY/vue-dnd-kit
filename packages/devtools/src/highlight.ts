/**
 * Highlights an element on the page for a moment, with a label: the element of the
 * inspector node just selected. One box in `<body>`, fixed over the element's rect
 * (shadow roots included); it takes no pointer events, so no drop target detection
 * (`elementFromPoint`) ever sees it.
 */

const SHOWN_FOR = 1600;
const COLOR = '#42b883';

let box: HTMLElement | null = null;
let label: HTMLElement | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;

const create = () => {
  box = document.createElement('div');
  box.setAttribute('data-dnd-devtools-highlight', '');
  box.setAttribute('aria-hidden', 'true');
  Object.assign(box.style, {
    position: 'fixed',
    zIndex: '2147483647',
    pointerEvents: 'none',
    boxSizing: 'border-box',
    border: `2px solid ${COLOR}`,
    borderRadius: '4px',
    background: 'rgba(66, 184, 131, 0.15)',
    transition: 'opacity 0.25s',
  } satisfies Partial<CSSStyleDeclaration>);
  label = document.createElement('div');
  Object.assign(label.style, {
    position: 'absolute',
    left: '-2px',
    bottom: '100%',
    padding: '1px 6px',
    borderRadius: '3px',
    background: COLOR,
    color: '#fff',
    font: '11px/16px ui-monospace, SFMono-Regular, Menlo, monospace',
    whiteSpace: 'nowrap',
  } satisfies Partial<CSSStyleDeclaration>);
  box.appendChild(label);
};

/** Hides the highlight. */
export const unhighlight = (): void => {
  clearTimeout(timer);
  if (box) box.style.opacity = '0';
};

/** Shows `element` with `text` for a moment; nothing for an element that isn't on the page. */
export const highlight = (element: Element | null, text: string): void => {
  if (!element?.isConnected) return unhighlight();
  if (!box?.isConnected) create();
  const rect = element.getBoundingClientRect();
  Object.assign(box!.style, {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    opacity: '1',
  });
  label!.textContent = text;
  if (!box!.isConnected) document.body.appendChild(box!);
  clearTimeout(timer);
  timer = setTimeout(unhighlight, SHOWN_FOR);
};

/** Scrolls `element` into view (when it is out of it), then highlights it. */
export const reveal = (element: Element | null, text: string): void => {
  if (!element?.isConnected) return;
  element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  requestAnimationFrame(() => highlight(element, text));
};
