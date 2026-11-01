/** The caret in a plain-text field (`contenteditable="plaintext-only"`), counted in characters. */

export type Caret = 'start' | 'end' | number;

/** Where the caret is in the field's text; `null` when it isn't there, or text is selected. */
export const caretOffset = (field: HTMLElement): number | null => {
  const selection = getSelection();
  if (!selection?.rangeCount || !selection.isCollapsed) return null;
  const caret = selection.getRangeAt(0);
  if (!field.contains(caret.startContainer)) return null;
  const before = document.createRange();
  before.selectNodeContents(field);
  before.setEnd(caret.startContainer, caret.startOffset);
  return before.toString().length;
};

/** Focuses the field with the caret at its start, its end or an offset of its text. */
export const placeCaret = (field: HTMLElement, at: Caret) => {
  field.focus({ preventScroll: true });
  field.scrollIntoView({ block: 'nearest' });
  const length = field.textContent?.length ?? 0;
  let rest = at === 'start' ? 0 : at === 'end' ? length : Math.min(at, length);
  const range = document.createRange();
  range.selectNodeContents(field);
  range.collapse(false); // the end, unless a text node holds the offset
  const texts = document.createTreeWalker(field, NodeFilter.SHOW_TEXT);
  for (let node = texts.nextNode(); node; node = texts.nextNode()) {
    const size = node.textContent!.length;
    if (rest <= size) {
      range.setStart(node, rest);
      range.collapse(true);
      break;
    }
    rest -= size;
  }
  getSelection()?.removeAllRanges();
  getSelection()?.addRange(range);
};

/**
 * Whether the caret is on the field's first line (`-1`) or last line (`1`): the arrow keys
 * go on to the next field from there, and move between lines inside it otherwise.
 */
export const caretOnEdgeLine = (field: HTMLElement, side: 1 | -1): boolean => {
  const selection = getSelection();
  const caret = selection?.rangeCount ? selection.getRangeAt(0).getClientRects()[0] : undefined;
  if (!caret) return true; // an empty field: one line
  const box = field.getBoundingClientRect();
  const line = parseFloat(getComputedStyle(field).lineHeight) || caret.height;
  return side === -1 ? caret.top - box.top < line * 0.75 : box.bottom - caret.bottom < line * 0.75;
};
