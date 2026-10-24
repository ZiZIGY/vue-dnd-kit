import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMeasurer, type Measurer } from './measure';
import { flip } from '../animation/layout';

interface Style {
  overflowX: string;
  overflowY: string;
  position: string;
  contain: string;
  translate: string;
}

const DEFAULT_STYLE: Style = {
  overflowX: 'visible',
  overflowY: 'visible',
  position: 'static',
  contain: 'none',
  translate: 'none',
};

const styles = new WeakMap<Element, Partial<Style>>();

type Box = [left: number, top: number, width: number, height: number];

/** An element with a mocked layout box; `move()` changes what the DOM would report. */
const box = (rect: Box, parent: Element = document.body, style: Partial<Style> = {}) => {
  const element = document.createElement('div');
  parent.appendChild(element);
  styles.set(element, style);
  let current = rect;
  const read = vi.fn(() => {
    const [left, top, width, height] = current;
    return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top } as DOMRect;
  });
  element.getBoundingClientRect = read;
  return {
    element,
    read,
    move(next: Box) {
      current = next;
    },
  };
};

/** A scroll container: `overflow: auto`, padding box = border box unless given. */
const scroller = (rect: Box, parent: Element = document.body, style: Partial<Style> = {}) => {
  const result = box(rect, parent, { overflowX: 'auto', overflowY: 'auto', ...style });
  const [, , width, height] = rect;
  Object.defineProperties(result.element, {
    clientLeft: { value: 0, configurable: true },
    clientTop: { value: 0, configurable: true },
    clientWidth: { value: width, configurable: true },
    clientHeight: { value: height, configurable: true },
    scrollLeft: { value: 0, writable: true, configurable: true },
    scrollTop: { value: 0, writable: true, configurable: true },
  });
  return result;
};

const setWindowScroll = (x: number, y: number) => {
  Object.defineProperty(window, 'scrollX', { value: x, configurable: true, writable: true });
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true });
};

describe('measuring service', () => {
  let measurer: Measurer;

  beforeEach(() => {
    vi.stubGlobal('getComputedStyle', (element: Element) => ({
      ...DEFAULT_STYLE,
      ...styles.get(element),
    }));
    setWindowScroll(0, 0);
    measurer = createMeasurer();
  });

  afterEach(() => {
    measurer.end();
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('reads fresh rects outside a session', () => {
    const item = box([10, 20, 100, 30]);
    expect(measurer.measure(item.element)).toMatchObject({ left: 10, top: 20, right: 110, bottom: 50 });
    item.move([10, 40, 100, 30]);
    expect(measurer.measure(item.element).top).toBe(40);
    expect(item.read).toHaveBeenCalledTimes(2);
  });

  it('caches during a session and adds the scroll delta without re-measuring', () => {
    const list = scroller([0, 0, 300, 200]);
    const item = box([10, 120, 100, 40], list.element);
    measurer.begin();
    expect(measurer.measure(item.element).top).toBe(120);

    list.element.scrollTop = 50;
    list.element.scrollLeft = 5;
    measurer.nextFrame();
    expect(measurer.measure(item.element)).toMatchObject({ left: 5, top: 70, bottom: 110 });

    setWindowScroll(0, 30);
    measurer.nextFrame();
    expect(measurer.measure(item.element).top).toBe(40);
    expect(item.read).toHaveBeenCalledTimes(1);
  });

  it('reads scroll offsets once per frame', () => {
    const list = scroller([0, 0, 300, 200]);
    const item = box([0, 100, 100, 40], list.element);
    measurer.begin();
    measurer.measure(item.element);
    // A scroll the frame hasn't seen yet: the frame keeps one consistent reading.
    list.element.scrollTop = 20;
    expect(measurer.measure(item.element).top).toBe(100);
    measurer.nextFrame();
    expect(measurer.measure(item.element).top).toBe(80);
  });

  it('ignores the window scroll under a fixed ancestor', () => {
    const panel = box([0, 500, 300, 200], document.body, { position: 'fixed' });
    const zone = box([10, 520, 100, 40], panel.element);
    const trash = box([400, 600, 50, 50], document.body, { position: 'fixed' });
    measurer.begin();
    measurer.measure(zone.element);
    measurer.measure(trash.element);
    setWindowScroll(0, 100);
    measurer.nextFrame();
    expect(measurer.measure(zone.element).top).toBe(520);
    expect(measurer.measure(trash.element).top).toBe(600);
  });

  it('excludes the in-flight FLIP translate', () => {
    const item = box([0, 100, 100, 40]);
    styles.set(item.element, { translate: '0px 25px' });
    // A custom layout animation that is still running.
    const running = { playState: 'running', cancel() {}, addEventListener() {} } as unknown as Animation;
    flip([{ key: 'a', element: item.element, first: { left: 0, top: 125, width: 100, height: 40, right: 100, bottom: 165 } }], () => running);
    item.move([0, 125, 100, 40]);
    expect(measurer.measure(item.element).top).toBe(100);
  });

  it('clips by scroll containers and the viewport', () => {
    const list = scroller([0, 0, 300, 200]);
    const partial = box([0, 180, 100, 40], list.element);
    const overscan = box([0, 240, 100, 40], list.element);
    const offscreen = box([0, 750, 100, 40]);
    measurer.begin();
    expect(measurer.measureVisible(partial.element)).toMatchObject({ top: 180, bottom: 200, height: 20 });
    // Mounted but scrolled out of view: not hittable.
    expect(measurer.measureVisible(overscan.element)).toBeNull();
    // The viewport is 768px tall in happy-dom.
    expect(measurer.measureVisible(offscreen.element)).toMatchObject({ top: 750, bottom: 768 });
    // The unclipped rect is still available.
    expect(measurer.measure(overscan.element).top).toBe(240);
  });

  it('clips at the padding box, without borders and scrollbars', () => {
    const list = scroller([0, 0, 300, 200]);
    Object.defineProperties(list.element, {
      clientLeft: { value: 2 },
      clientTop: { value: 2 },
      clientWidth: { value: 281 },
      clientHeight: { value: 196 },
    });
    const item = box([0, 150, 300, 100], list.element);
    measurer.begin();
    expect(measurer.measureVisible(item.element)).toMatchObject({ left: 2, right: 283, top: 150, bottom: 198 });
  });

  it('intersects nested scroll containers and follows their scrolling', () => {
    const outer = scroller([0, 0, 400, 300]);
    const inner = scroller([0, 200, 400, 300], outer.element);
    const item = box([0, 260, 100, 40], inner.element);
    measurer.begin();
    expect(measurer.measureVisible(item.element)).toMatchObject({ top: 260, bottom: 300 });

    // Scrolling the outer container moves the inner one and its content.
    outer.element.scrollTop = 100;
    measurer.nextFrame();
    expect(measurer.measureVisible(item.element)).toMatchObject({ top: 160, bottom: 200 });
    expect(item.read).toHaveBeenCalledTimes(1);
    expect(inner.read).toHaveBeenCalledTimes(1);
  });

  it('clips only the axes with overflow', () => {
    const strip = scroller([0, 0, 200, 100], document.body, { overflowY: 'visible' });
    const item = box([150, 80, 100, 50], strip.element);
    measurer.begin();
    expect(measurer.measureVisible(item.element)).toMatchObject({ left: 150, right: 200, top: 80, bottom: 130 });
  });

  it('treats overflow on <body> as the viewport', () => {
    styles.set(document.body, { overflowX: 'hidden', overflowY: 'auto' });
    const item = box([0, 500, 100, 40]);
    measurer.begin();
    expect(measurer.measureVisible(item.element)).toMatchObject({ top: 500, bottom: 540 });
  });

  it('re-measures sticky elements every frame', () => {
    const header = box([0, 0, 300, 40], document.body, { position: 'sticky' });
    measurer.begin();
    measurer.measure(header.element);
    measurer.measure(header.element);
    expect(header.read).toHaveBeenCalledTimes(1);
    measurer.nextFrame();
    measurer.measure(header.element);
    expect(header.read).toHaveBeenCalledTimes(2);
  });

  it('invalidates all rects or only the given elements', () => {
    const a = box([0, 0, 100, 40]);
    const b = box([0, 50, 100, 40]);
    measurer.begin();
    measurer.measure(a.element);
    measurer.measure(b.element);
    a.move([0, 10, 100, 40]);
    b.move([0, 60, 100, 40]);

    measurer.invalidate([a.element]);
    expect(measurer.measure(a.element).top).toBe(10);
    expect(measurer.measure(b.element).top).toBe(50);

    measurer.invalidate();
    expect(measurer.measure(b.element).top).toBe(60);
  });

  it('lets the FLIP estimate reuse stale rects while exact reads re-measure', () => {
    const list = scroller([0, 0, 300, 200]);
    const far = box([0, 1000, 100, 40], list.element);
    measurer.begin();
    expect(measurer.isNearViewport(far.element)).toBe(false);
    far.move([0, 300, 100, 40]);
    measurer.invalidate();
    // Estimate: the stale rect, no read.
    expect(measurer.isNearViewport(far.element)).toBe(false);
    expect(far.read).toHaveBeenCalledTimes(1);
    // Exact: re-measured, and the estimate now uses the fresh rect.
    expect(measurer.measure(far.element).top).toBe(300);
    expect(measurer.isNearViewport(far.element)).toBe(true);
    expect(far.read).toHaveBeenCalledTimes(2);
  });

  it('invalidates on window resize and drops the cache at the end of the session', () => {
    const item = box([0, 0, 100, 40]);
    measurer.begin();
    measurer.measure(item.element);
    item.move([0, 30, 100, 40]);
    window.dispatchEvent(new Event('resize'));
    expect(measurer.measure(item.element).top).toBe(30);

    measurer.end();
    item.move([0, 90, 100, 40]);
    // No session: resize listeners are gone and every read is fresh.
    expect(measurer.measure(item.element).top).toBe(90);
  });

  it('invalidates when an observed element resizes, ignoring the initial notification', () => {
    let callback: ResizeObserverCallback = () => {};
    const observed: Element[] = [];
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(cb: ResizeObserverCallback) {
          callback = cb;
        }
        observe(element: Element) {
          observed.push(element);
        }
        disconnect() {}
      },
    );
    const zone = box([0, 0, 200, 100]);
    const notify = (width: number) =>
      callback(
        [{ target: zone.element, contentRect: { width, height: 100 } } as unknown as ResizeObserverEntry],
        {} as ResizeObserver,
      );
    measurer.begin();
    measurer.observe(zone.element);
    measurer.observe(zone.element);
    expect(observed).toEqual([zone.element]);
    measurer.measure(zone.element);

    zone.move([0, 0, 250, 100]);
    notify(200);
    expect(measurer.measure(zone.element).width).toBe(200);
    notify(250);
    expect(measurer.measure(zone.element).width).toBe(250);
  });

  it('tells which elements are near the visible part of their scroll container', () => {
    const list = scroller([0, 0, 300, 200]);
    const visible = box([0, 50, 100, 40], list.element);
    const below = box([0, 350, 100, 40], list.element);
    const far = box([0, 450, 100, 40], list.element);
    const page = box([0, 2000, 100, 40]);
    measurer.begin();
    expect(measurer.isNearViewport(visible.element)).toBe(true);
    // Within one container height below the visible area.
    expect(measurer.isNearViewport(below.element)).toBe(true);
    expect(measurer.isNearViewport(far.element)).toBe(false);
    // Window-level content: within one viewport height.
    expect(measurer.isNearViewport(page.element)).toBe(false);
    expect(measurer.isNearViewport(page.element, 2)).toBe(true);
  });

  it('reports scrolling inside shadow roots, whose scroll events never reach the document', () => {
    const onShadowScroll = vi.fn();
    const shadowMeasurer = createMeasurer({ onShadowScroll });
    const host = box([0, 0, 300, 600]);
    const root = host.element.attachShadow({ mode: 'open' });
    const list = scroller([0, 0, 300, 200], root as unknown as Element);
    const item = box([0, 50, 100, 40], list.element);
    shadowMeasurer.begin();
    shadowMeasurer.measure(item.element);
    list.element.dispatchEvent(new Event('scroll'));
    expect(onShadowScroll).toHaveBeenCalledTimes(1);
    shadowMeasurer.end();
    list.element.dispatchEvent(new Event('scroll'));
    expect(onShadowScroll).toHaveBeenCalledTimes(1);
  });

  it('measures through open shadow roots', () => {
    const list = scroller([0, 0, 300, 200]);
    const host = box([0, 0, 300, 600], list.element);
    const root = host.element.attachShadow({ mode: 'open' });
    const item = box([0, 250, 100, 40], root as unknown as Element);
    measurer.begin();
    expect(measurer.measureVisible(item.element)).toBeNull();
    list.element.scrollTop = 100;
    measurer.nextFrame();
    expect(measurer.measureVisible(item.element)).toMatchObject({ top: 150, bottom: 190 });
  });
});
