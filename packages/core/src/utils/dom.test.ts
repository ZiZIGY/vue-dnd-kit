import { afterEach, describe, expect, it } from 'vitest';
import { containsComposed, getEventTarget, parentOf } from './dom';

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
  it('resolves elements, getters and the first element of a fragment anchor', async () => {
    const { toElement } = await import('./dom');
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
