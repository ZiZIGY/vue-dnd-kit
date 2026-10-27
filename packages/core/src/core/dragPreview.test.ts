import { createApp, h, nextTick } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DnDProvider } from './DnDProvider';
import { DragPreview } from './DragPreview';

let unmount: (() => void) | null = null;

const render = (slot?: () => unknown) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, null, {
        default: () => h(DragPreview, { id: 'no-clone', class: 'cell', style: { width: '40px' } }, slot && { default: slot }),
      }),
  });
  app.mount(container);
  unmount = () => {
    app.unmount();
    container.remove();
  };
  return container;
};

afterEach(() => {
  unmount?.();
  unmount = null;
  vi.restoreAllMocks();
});

describe('DragPreview of an item without a clone', () => {
  it('renders its slot in an element that takes class and style', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const container = render(() => 'Item 6');
    await nextTick();
    const cell = container.querySelector('.cell') as HTMLElement;
    expect(cell?.textContent).toBe('Item 6');
    expect(cell.style.width).toBe('40px');
    expect(warn).not.toHaveBeenCalled();
  });

  it('renders nothing without a slot', async () => {
    const container = render();
    await nextTick();
    expect(container.querySelector('.cell')).toBeNull();
  });
});
