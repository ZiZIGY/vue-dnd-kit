/** Auto-scroll configuration options */
export interface IAutoScrollOptions {
  /** Distance from edge to start auto-scrolling (px) */
  threshold?: number;
  /** Scrolling speed (px/frame) */
  speed?: number;
  /** Whether auto-scroll is disabled */
  disabled?: boolean;
}
