/**
 * The windows a provider works in. An app may show part of itself in another window of its
 * own (a popup opened with `window.open`, a detached panel), rendering into it with a
 * teleport: one provider, several documents. Each window needs its own listeners (input,
 * scroll, the browser's drags), styles and frames.
 *
 * A window joins when an element of the provider is seen in it (`track`, at registration)
 * or when the app names it (`add`, `useDnD().addWindow`): teleported content moves its nodes
 * into the other document without registering anything again. It leaves when it closes.
 * The page's own window is always there.
 */

import { effectScope, getCurrentScope, onScopeDispose, type EffectScope } from 'vue';
import { isClient } from '../../utils/dom';

/** Runs once per window; may return a cleanup, run when that window leaves or the setup stops. */
export type WindowSetup = (view: Window) => void | (() => void);

interface Registration {
  setup: WindowSetup;
  scopes: Map<Window, EffectScope>;
}

export type Windows = ReturnType<typeof createWindows>;

export function createWindows() {
  /** Window → how many `add` calls hold it (the page's and tracked ones: never let go). */
  const views = new Map<Window, { holds: number; tracked: boolean; off: () => void }>();
  const registrations = new Set<Registration>();

  const run = (registration: Registration, view: Window) => {
    const scope = effectScope(true);
    scope.run(() => {
      try {
        const cleanup = registration.setup(view);
        if (typeof cleanup === 'function') onScopeDispose(cleanup);
      } catch (error) {
        console.error(error);
      }
    });
    registration.scopes.set(view, scope);
  };

  const leave = (view: Window) => {
    const known = views.get(view);
    if (!known) return;
    known.off();
    views.delete(view);
    for (const registration of registrations) {
      registration.scopes.get(view)?.stop();
      registration.scopes.delete(view);
    }
  };

  const join = (view: Window, tracked: boolean) => {
    const known = views.get(view);
    if (known) {
      known.tracked ||= tracked;
      if (!tracked) known.holds++;
      return;
    }
    // A closed window keeps its object: what is left of it must not stay a target.
    const onHide = () => {
      if (view !== window) leave(view);
    };
    view.addEventListener('pagehide', onHide);
    views.set(view, {
      holds: tracked ? 0 : 1,
      tracked,
      off: () => view.removeEventListener('pagehide', onHide),
    });
    for (const registration of registrations) run(registration, view);
  };

  if (isClient) join(window, true);

  return {
    /** The windows it works in now, the page's first. */
    get list(): Window[] {
      return [...views.keys()];
    },
    /** A window an element of the provider is in joins; seen once, it stays until it closes. */
    track(node: Node | null | undefined) {
      const view = node?.ownerDocument?.defaultView;
      if (!view || view.closed) return;
      const known = views.get(view);
      if (known) known.tracked = true;
      else join(view, true);
    },
    /** The app names a window (see `DnDState.addWindow`); the returned function lets go of it. */
    add(view: Window): () => void {
      if (!isClient || view.closed) return () => {};
      join(view, false);
      let held = true;
      return () => {
        if (!held) return;
        held = false;
        const known = views.get(view);
        if (!known) return;
        known.holds--;
        if (known.holds <= 0 && !known.tracked && view !== window) leave(view);
      };
    },
    /**
     * Runs `setup` in every window, now and as they join, inside an effect scope of its own
     * (so `useEventListener` there cleans up with it). Stops with the calling scope, or
     * with the returned function.
     */
    each(setup: WindowSetup): () => void {
      const registration: Registration = { setup, scopes: new Map() };
      registrations.add(registration);
      for (const view of views.keys()) run(registration, view);
      const stop = () => {
        if (!registrations.delete(registration)) return;
        for (const scope of registration.scopes.values()) scope.stop();
        registration.scopes.clear();
      };
      if (getCurrentScope()) onScopeDispose(stop);
      return stop;
    },
    /** The provider unmounts. */
    destroy() {
      for (const registration of [...registrations]) {
        for (const scope of registration.scopes.values()) scope.stop();
      }
      registrations.clear();
      for (const known of views.values()) known.off();
      views.clear();
    },
  };
}
