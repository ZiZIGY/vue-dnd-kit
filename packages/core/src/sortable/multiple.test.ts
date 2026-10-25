import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRect } from '../animation/layout';
import { collapseIntoOverlay } from './multiple';

describe('collapseIntoOverlay', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('gives each ghost the size of its source, not the viewport', () => {
    const source = document.createElement('div');
    source.textContent = 'a4';
    document.body.appendChild(source);
    vi.spyOn(source, 'getBoundingClientRect').mockReturnValue(new DOMRect(24, 340, 304, 42));
    // The ghost is a clone: stub the animation so it stays in the document.
    const animation = { addEventListener: vi.fn() } as unknown as Animation;
    const animate = vi.fn(() => animation);
    Object.defineProperty(HTMLElement.prototype, 'animate', { value: animate, configurable: true });

    collapseIntoOverlay([source], createRect(24, 100, 304, 42), { duration: 100 });

    const ghost = document.querySelector<HTMLElement>('[data-dnd-ghost]');
    expect(ghost).not.toBeNull();
    // clonePreview makes the clone fill its box; a ghost on <body> sizes itself.
    expect(ghost!.style.width).toBe('304px');
    expect(ghost!.style.height).toBe('42px');
    expect(animate).toHaveBeenCalledOnce();
  });
});
