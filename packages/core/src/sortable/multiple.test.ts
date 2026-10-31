import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRect } from '../animation/layout';
import { snapshotMany } from '../core/snapshot';
import { collapseIntoOverlay } from './multiple';

// Counted, as it is: each call lays the page out once per snapshot pass.
vi.mock('../core/snapshot', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../core/snapshot')>();
  return { ...actual, snapshotMany: vi.fn(actual.snapshotMany) };
});

describe('collapseIntoOverlay', () => {
  afterEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  /** A source in a list; the ghost is a clone: the animation is stubbed so it stays in the document. */
  const setUp = () => {
    document.body.innerHTML = '<ul class="list"><li class="row">a4</li></ul>';
    const source = document.querySelector<HTMLElement>('.row')!;
    vi.spyOn(source, 'getBoundingClientRect').mockReturnValue(new DOMRect(24, 340, 304, 42));
    const animation = { addEventListener: vi.fn() } as unknown as Animation;
    const animate = vi.fn(() => animation);
    Object.defineProperty(HTMLElement.prototype, 'animate', { value: animate, configurable: true });
    collapseIntoOverlay([source], createRect(24, 100, 304, 42), { duration: 100 });
    return { ghost: document.querySelector<HTMLElement>('[data-dnd-ghost]'), animate };
  };

  it('gives each ghost the size of its source, not the viewport', () => {
    const { ghost, animate } = setUp();
    expect(ghost).not.toBeNull();
    // clonePreview makes the clone fill its box; a ghost on <body> sizes itself.
    expect(ghost!.style.width).toBe('304px');
    expect(ghost!.style.height).toBe('42px');
    expect(animate).toHaveBeenCalledOnce();
  });

  it('gives each ghost the styles its source has in the list', () => {
    const style = document.createElement('style');
    style.textContent = '.list .row { padding: 6px 10px }';
    document.head.appendChild(style);
    expect(setUp().ghost!.style.padding).toBe('6px 10px');
  });

  it('styles every ghost in one snapshot: the page lays out once per pass for all of them', () => {
    document.body.innerHTML = '<ul class="list"><li class="row">a</li><li class="row">b</li><li class="row">c</li></ul>';
    const sources = [...document.querySelectorAll<HTMLElement>('.row')];
    sources.forEach((source, index) => {
      vi.spyOn(source, 'getBoundingClientRect').mockReturnValue(new DOMRect(24, 340 + index * 42, 304, 42));
    });
    const animation = { addEventListener: vi.fn() } as unknown as Animation;
    Object.defineProperty(HTMLElement.prototype, 'animate', { value: vi.fn(() => animation), configurable: true });
    vi.mocked(snapshotMany).mockClear();
    collapseIntoOverlay(sources, createRect(24, 100, 304, 42), { duration: 100 });
    expect(document.querySelectorAll('[data-dnd-ghost]')).toHaveLength(3);
    expect(snapshotMany).toHaveBeenCalledOnce();
    expect(vi.mocked(snapshotMany).mock.calls[0]![0]).toHaveLength(3);
  });
});
