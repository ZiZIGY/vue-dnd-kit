/** Internal: options for auto-scroll controller (same shape as IAutoScrollOptions for compatibility) */
export interface IAutoScrollOptionsInternal {
  threshold?: number | { top?: number; right?: number; bottom?: number; left?: number };
  speed?: number;
  disabled?: boolean;
}

export interface IScrollState {
  scrollTop: number;
  scrollLeft: number;
  rect: DOMRect;
}

export interface IScrollAdapter {
  getScrollState(el: HTMLElement): IScrollState;
  setScroll(el: HTMLElement, scrollTop: number, scrollLeft: number): void;
}

export type TOverlayPoint = { x: number; y: number } | null;
