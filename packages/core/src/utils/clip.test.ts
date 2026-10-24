import { describe, expect, it } from 'vitest';
import { createRect } from '../animation/layout';
import { clipRect } from './clip';

describe('clipRect', () => {
  const clip = createRect(0, 100, 200, 300);

  it('keeps the visible part of a row half scrolled out of the scroller', () => {
    expect(clipRect(createRect(10, 80, 100, 40), clip)).toEqual(createRect(10, 100, 100, 20));
    expect(clipRect(createRect(10, 380, 100, 40), clip)).toEqual(createRect(10, 380, 100, 20));
  });

  it('returns the rect itself when it is fully visible', () => {
    expect(clipRect(createRect(10, 150, 100, 40), clip)).toEqual(createRect(10, 150, 100, 40));
  });

  it('drops rects outside the clip, including ones that only touch its edge', () => {
    expect(clipRect(createRect(10, 20, 100, 40), clip)).toBeNull();
    expect(clipRect(createRect(10, 60, 100, 40), clip)).toBeNull();
  });
});
