export interface ISizeObserverWrapper {
  observe: (element: HTMLElement) => void;
  unobserve: (element: HTMLElement) => void;
  disconnect: () => void;
}

export interface IIntersectionObserverWrapper {
  observe: (element: HTMLElement) => void;
  unobserve: (element: HTMLElement) => void;
  disconnect: () => void;
}