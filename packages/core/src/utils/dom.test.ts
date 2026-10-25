import { createApp, defineComponent, h, Teleport, type Component, type ComponentPublicInstance } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { containsComposed, getEventTarget, isFocusLost, nextFrame, parentOf, toElement } from './dom';

describe('shadow-aware DOM helpers', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  const setup = () => {
    const outer = document.createElement('div');
    const host = document.createElement('div');
    outer.appendChild(host);
    document.body.appendChild(outer);
    const root = host.attachShadow({ mode: 'open' });
    const list = document.createElement('ul');
    const item = document.createElement('li');
    list.appendChild(item);
    root.appendChild(list);
    return { outer, host, list, item };
  };

  it('walks from a shadow root to its host', () => {
    const { host, list, item } = setup();
    expect(parentOf(item)).toBe(list);
    expect(parentOf(list)).toBe(host);
  });

  it('checks containment across shadow roots', () => {
    const { outer, host, list, item } = setup();
    expect(containsComposed(outer, item)).toBe(true);
    expect(containsComposed(host, item)).toBe(true);
    expect(containsComposed(list, item)).toBe(true);
    expect(containsComposed(item, list)).toBe(false);
    expect(containsComposed(document.createElement('div'), item)).toBe(false);
  });

  it('resolves the real target of an event from inside a shadow root', () => {
    const { item } = setup();
    let target: EventTarget | null = null;
    document.addEventListener('keydown', (event) => (target = getEventTarget(event)), { once: true });
    item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, composed: true }));
    expect(target).toBe(item);
  });
});

describe('toElement', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  /** Mounts `Inner` between two sibling elements and returns its component instance. */
  const mountBetweenSiblings = (Inner: Component) => {
    let instance: ComponentPublicInstance | null = null;
    const App = defineComponent({
      setup: () => () => [
        h('i', { id: 'before' }),
        h(Inner, { ref: (value: unknown) => (instance = value as ComponentPublicInstance | null) }),
        h('i', { id: 'after' }),
      ],
    });
    const container = document.createElement('div');
    document.body.appendChild(container);
    const app = createApp(App);
    app.mount(container);
    return { instance: () => instance, unmount: () => app.unmount() };
  };

  it('resolves a fragment-root component (a kit tooltip: activator, then a teleport) to its activator', () => {
    const Tooltip = defineComponent({
      setup: () => () => [
        h('span', { id: 'activator' }),
        h(Teleport, { to: 'body' }, [h('div', { id: 'tooltip' })]),
      ],
    });
    // A wrapper whose root is another component, like <UTooltip> rendering <TooltipRoot>.
    const Wrapper = defineComponent({ setup: () => () => h(Tooltip) });
    const { instance, unmount } = mountBetweenSiblings(Wrapper);
    expect(toElement(instance())?.id).toBe('activator');
    unmount();
  });

  it('never resolves to an element that follows the component', () => {
    const OnlyTeleported = defineComponent({
      setup: () => () => [h(Teleport, { to: 'body' }, [h('div', { id: 'content' })])],
    });
    const Hidden = defineComponent({ setup: () => () => (false as boolean) ? h('div') : null });
    for (const Inner of [OnlyTeleported, Hidden]) {
      const { instance, unmount } = mountBetweenSiblings(Inner);
      expect(toElement(instance())).toBeNull();
      unmount();
    }
  });

  it('resolves elements, getters and the first element of a fragment anchor', () => {
    const parent = document.createElement('div');
    const anchor = document.createTextNode('');
    const first = document.createElement('span');
    parent.append(anchor, first);
    expect(toElement(first)).toBe(first);
    expect(toElement(() => first)).toBe(first);
    // A fragment-root component: `$el` is the anchor text node.
    expect(toElement({ $el: anchor } as never)).toBe(first);
    expect(toElement(null)).toBeNull();
  });
});

describe('isFocusLost', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('is false while an element has the focus, true once that element left the document', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();
    expect(isFocusLost()).toBe(false);
    // A re-render replaces the focused element: the focus falls back to <body>.
    button.remove();
    expect(isFocusLost()).toBe(true);
  });
});

describe('nextFrame', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('resolves even when no frame comes (hidden tab, stalled compositor)', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', () => 1);
    let resolved = false;
    void nextFrame().then(() => (resolved = true));
    await vi.advanceTimersByTimeAsync(99);
    expect(resolved).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(resolved).toBe(true);
  });

  it('resolves on the frame and drops the fallback timer', async () => {
    vi.useFakeTimers();
    let tick: FrameRequestCallback | undefined;
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => ((tick = callback), 1));
    const done = nextFrame();
    tick!(0);
    await done;
    expect(vi.getTimerCount()).toBe(0);
  });
});
