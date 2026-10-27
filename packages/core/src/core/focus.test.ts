import { createApp, defineComponent, h, nextTick, useTemplateRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DnDProvider } from './DnDProvider';
import { useManager } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';

let manager: DnDManager;
let unmount: (() => void) | null = null;

const mount = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const Chip = defineComponent({
    setup() {
      manager = useManager();
      makeDraggable(useTemplateRef<HTMLElement>('el'), { id: 'chip' });
      return () => h('button', { ref: 'el', type: 'button' }, 'chip');
    },
  });
  const app = createApp({ setup: () => () => h(DnDProvider, { dropAnimation: false }, { default: () => h(Chip) }) });
  app.mount(container);
  unmount = () => {
    app.unmount();
    container.remove();
  };
  return container.querySelector('button')!;
};

afterEach(() => {
  unmount?.();
  unmount = null;
  vi.restoreAllMocks();
});

describe('focus after a keyboard drag', () => {
  it('comes back to the item when it can take it again, also if it was lost mid-drag', async () => {
    const chip = mount();
    chip.focus();
    manager.start('chip', { x: 0, y: 0 }, 'keyboard');
    await nextTick();
    // Lost while dragging (the slot hid its handle), not by a re-render.
    chip.blur();
    expect(document.activeElement).toBe(document.body);
    // The first frames after the drop it still can't take the focus.
    const focus = HTMLElement.prototype.focus;
    let refused = 2;
    vi.spyOn(chip, 'focus').mockImplementation(function (this: HTMLElement, options?: FocusOptions) {
      if (refused-- > 0) return;
      focus.call(this, options);
    });
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    await vi.waitFor(() => expect(document.activeElement).toBe(chip));
  });
});
