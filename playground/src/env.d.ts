/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

interface ImportMetaEnv {
  /** The docs the Lab links to (default: the published site). */
  readonly VITE_DOCS_URL?: string;
}

interface Window {
  /** Bench instrumentation, read by e2e/bench.spec.ts. */
  __bench?: { reorders: number[]; frames: number[]; recording: boolean };
}
