import { createApp, defineComponent, h, nextTick, useTemplateRef, type App } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import type { DnDContext, DnDState } from '../types';
import { DnDProvider } from './DnDProvider';
import { provideDnDContext, useDnD, useDnDContext, useManager } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';

const apps: App[] = [];

afterEach(() => {
  apps.splice(0).forEach((app) => app.unmount());
  document.body.innerHTML = '';
});

const mountApp = (app: App) => {
  apps.push(app);
  app.mount(document.body.appendChild(document.createElement('div')));
};

describe('useDnDContext / provideDnDContext', () => {
  it('bridge a provider into another Vue app (e.g. one in a shadow root)', async () => {
    let context: DnDContext | undefined;
    let manager: DnDManager | undefined;
    mountApp(
      createApp({
        setup: () => () =>
          h(DnDProvider, null, {
            default: () =>
              h({
                setup() {
                  context = useDnDContext();
                  manager = useManager();
                  return () => null;
                },
              }),
          }),
      }),
    );
    // The handle is the provider itself, without its members in the types.
    expect(context).toBe(manager);

    let state: DnDState | undefined;
    const other = createApp(
      defineComponent({
        setup() {
          state = useDnD();
          makeDraggable(useTemplateRef<HTMLElement>('el'), { id: 'guest' });
          return () => h('div', { ref: 'el' }, 'guest');
        },
      }),
    );
    provideDnDContext(other, context!);
    mountApp(other);
    await nextTick();

    // The other app's draggable registered with the same provider, and sees its drags.
    expect(manager!.start('guest', { x: 0, y: 0 }, 'pointer')).toBe(true);
    expect(state!.status.value).toBe('dragging');
    expect(state!.active.value?.id).toBe('guest');
    manager!.cancel();
  });

  it('throw without a provider', () => {
    const errors: unknown[] = [];
    const app = createApp({
      setup() {
        useDnDContext();
        return () => null;
      },
    });
    app.config.errorHandler = (error) => errors.push(error);
    mountApp(app);
    expect(String(errors[0])).toContain('No <DnDProvider> found');
  });
});
