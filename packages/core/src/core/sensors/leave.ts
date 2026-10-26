import { parentOf } from '../../utils/dom';

/**
 * A pointer-like drag captures the pointer on <body> (the item may be recreated mid-drag):
 * from then on `mouseup` and `mouseleave` go to the capture target, and the pressed element
 * and its ancestors never see the pointer leave them. UI kits end their press and hover
 * effects on those events (Vuetify's ripple stays frozen in the item otherwise). The item
 * now travels in the overlay, away from the pointer: they are told so, as the browser would
 * have, from the pressed element up to the dragged item. Not beyond it: the pointer is
 * still over the list and the rest of the page (a menu opened by hovering must stay open).
 */
export const leavePressed = (pressed: Element, item: Element): void => {
  const chain: Element[] = [];
  for (let node: Element | null = pressed; node; node = parentOf(node)) {
    chain.push(node);
    if (node === item) break;
  }
  if (chain.at(-1) !== item) return;
  const init = { bubbles: true, composed: true, relatedTarget: document.body };
  const dispatch = (node: Element, type: string, bubbles: boolean) => {
    const Event = type.startsWith('pointer') && typeof PointerEvent === 'function' ? PointerEvent : MouseEvent;
    node.dispatchEvent(new Event(type, { ...init, bubbles }));
  };
  dispatch(pressed, 'pointerout', true);
  dispatch(pressed, 'mouseout', true);
  for (const node of chain) {
    dispatch(node, 'pointerleave', false);
    dispatch(node, 'mouseleave', false);
  }
};
