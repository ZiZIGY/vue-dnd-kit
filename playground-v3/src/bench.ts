/**
 * Instrumentation for e2e/bench.spec.ts (same `window.__bench` shape as BenchDemo).
 * - reorders: from the draft change to the end of the Vue flush that renders it
 *   (draft computed, patch, post-flush FLIP); one entry per change, even when a
 *   cross-list move updates two lists in the same tick;
 * - frames: every rAF interval while `recording`.
 */

import { nextTick, onBeforeUnmount, watch, type WatchSource } from 'vue';

type BenchState = NonNullable<Window['__bench']>;

let pending = false;

export const useBench = (): BenchState => {
  const bench = (window.__bench ??= { reorders: [], frames: [], recording: false });
  let last = 0;
  let frame = requestAnimationFrame(function tick(now) {
    if (bench.recording && last) bench.frames.push(now - last);
    last = now;
    frame = requestAnimationFrame(tick);
  });
  onBeforeUnmount(() => cancelAnimationFrame(frame));
  return bench;
};

export const trackReorders = (bench: BenchState, source: WatchSource): void => {
  watch(
    source,
    () => {
      if (pending) return;
      pending = true;
      const start = performance.now();
      // The flush may not be queued yet when a sync watcher runs: wait a microtask,
      // then for the end of the flush that is in progress or queued.
      queueMicrotask(
        () =>
          void nextTick(() => {
            pending = false;
            bench.reorders.push(performance.now() - start);
          }),
      );
    },
    { flush: 'sync' },
  );
};
