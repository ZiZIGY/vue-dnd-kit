/** Internal: options for auto-scroll controller (same shape as IAutoScrollOptions for compatibility) */
export interface IAutoScrollOptionsInternal {
  threshold?: number | { top?: number; right?: number; bottom?: number; left?: number };
  speed?: number;
  disabled?: boolean;
}

export interface IScrollState {
  scrollTop: number;
  scrollLeft: number;
}

export interface IScrollAdapter {
  getScrollState(el: HTMLElement): IScrollState;
  setScroll(el: HTMLElement, scrollTop: number, scrollLeft: number): void;
  /** Override rect calculation. Defaults to el.getBoundingClientRect(). */
  getRect?(el: HTMLElement): DOMRect;
}

export type TOverlayPoint = { x: number; y: number } | null;
