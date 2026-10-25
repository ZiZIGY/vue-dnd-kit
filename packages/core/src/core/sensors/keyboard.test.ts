import { createApp, defineComponent, h, nextTick, useTemplateRef, type App } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import type { DnDState } from '../../types';
import { DnDProvider } from '../DnDProvider';
import { makeDraggable } from '../makeDraggable';
import { useDnD } from '../context';

/**
 * UI kits handle keys on their own elements: Vuetify's <v-list> moves focus on arrows,
 * its clickable <v-list-item> turns Enter/Space into a click and stops propagation,
 * and its overlays close on Escape from a window listener.
 */
const mountKitLikeList = () => {
  const seen: string[] = [];
  let state!: DnDState;

  const Item = defineComponent({
    setup() {
      makeDraggable(useTemplateRef<HTMLElement>('el'), { id: 'item' });
      state = useDnD();
      return () =>
        h(
          'div',
          {
            ref: 'el',
            'data-testid': 'item',
            onKeydown: (event: KeyboardEvent) => {
              seen.push(`item:${event.key}`);
              if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
            },
          },
          'Item',
        );
    },
  });

  const App = defineComponent({
    setup: () => () =>
      h(DnDProvider, null, {
        default: () =>
          h('div', { onKeydown: (event: KeyboardEvent) => seen.push(`list:${event.key}`) }, [h(Item)]),
      }),
  });

  const onWindowKey = (event: KeyboardEvent) => seen.push(`window:${event.key}`);
  window.addEventListener('keydown', onWindowKey);
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app: App = createApp(App);
  app.mount(container);
  const item = container.querySelector<HTMLElement>('[data-testid="item"]')!;
  const press = (key: string, code = key) =>
    item.dispatchEvent(new KeyboardEvent('keydown', { key, code, bubbles: true, cancelable: true, composed: true }));

  return {
    seen,
    item,
    press,
    state: () => state,
    unmount: () => {
      window.removeEventListener('keydown', onWindowKey);
      app.unmount();
    },
  };
};

describe('keyboard sensor inside UI kit components', () => {
  let cleanup: (() => void) | undefined;
  afterEach(() => {
    cleanup?.();
    document.body.innerHTML = '';
  });

  it('starts even when the item stops the propagation of Space', async () => {
    const list = mountKitLikeList();
    cleanup = list.unmount;
    await nextTick();
    list.item.focus();
    list.press(' ', 'Space');
    expect(list.state().status.value).toBe('dragging');
    // The key started the drag: the item didn't also click itself.
    expect(list.seen).toEqual([]);
  });

  it('keeps the arrows, drop and cancel keys of a drag away from the kit', async () => {
    const list = mountKitLikeList();
    cleanup = list.unmount;
    await nextTick();
    list.item.focus();
    list.press(' ', 'Space');
    list.press('ArrowDown');
    list.press('Escape');
    expect(list.seen).toEqual([]);
    expect(list.state().status.value).not.toBe('dragging');
  });

  it('leaves other keys and keys without a drag to the page', async () => {
    const list = mountKitLikeList();
    cleanup = list.unmount;
    await nextTick();
    list.press('ArrowDown');
    list.press('Escape');
    list.press('a', 'KeyA');
    expect(list.seen).toEqual([
      'item:ArrowDown',
      'list:ArrowDown',
      'window:ArrowDown',
      'item:Escape',
      'list:Escape',
      'window:Escape',
      'item:a',
      'list:a',
      'window:a',
    ]);
    expect(list.state().status.value).toBe('idle');
  });
});
