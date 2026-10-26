/**
 * `v-reveal`: the element's content slides out of a slit (translateY inside `overflow:
 * hidden`) the first time it scrolls into view. Only on the first load: after a client
 * navigation the view transition shows the new page, and content appears at once.
 *
 * `v-reveal="0.2"` delays it; `v-reveal:text` marks a `RevealText` root (words, not one block).
 * The hidden state needs `html.reveal-ready`, set by an inline head script before the first
 * paint and dropped again if the app never starts, so the page reads without JS.
 */

import type { Directive } from 'vue';

declare global {
  interface Window {
    __revealOn?: boolean;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  let firstLoad = true;
  let observer: IntersectionObserver | null = null;

  if (import.meta.client) {
    window.__revealOn = true;
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer?.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    // From the second page on, nothing waits to be revealed.
    useRouter().beforeEach((_to, from) => {
      if (from.matched.length) firstLoad = false;
    });
  }

  const reveal: Directive<HTMLElement, number | undefined> = {
    // The delay is set on mount: it only matters on the client, and an SSR style would
    // differ from the element's own `style` at hydration.
    getSSRProps: (binding) => ({ [binding.arg === 'text' ? 'data-reveal-text' : 'data-reveal']: '' }),
    mounted(element, binding) {
      element.setAttribute(binding.arg === 'text' ? 'data-reveal-text' : 'data-reveal', '');
      if (binding.value) element.style.setProperty('--reveal-delay', `${binding.value}s`);
      if (!firstLoad || !observer) {
        element.classList.add('is-revealed');
        return;
      }
      observer.observe(element);
    },
    unmounted(element) {
      observer?.unobserve(element);
    },
  };

  nuxtApp.vueApp.directive('reveal', reveal);
});
