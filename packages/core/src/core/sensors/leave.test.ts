import { afterEach, describe, expect, it } from 'vitest';
import { leavePressed } from './leave';

const build = () => {
  document.body.innerHTML = '<div id="list"><div id="item"><span id="inner"><b id="pressed"></b></span></div></div>';
  const byId = (id: string) => document.getElementById(id)!;
  const heard: string[] = [];
  for (const id of ['list', 'item', 'inner', 'pressed']) {
    for (const type of ['mouseleave', 'pointerleave']) byId(id).addEventListener(type, () => heard.push(`${type}:${id}`));
  }
  return { byId, heard };
};

describe('leavePressed', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('tells the pressed element and its ancestors up to the dragged item that the pointer left', () => {
    const { byId, heard } = build();
    leavePressed(byId('pressed'), byId('item'));
    expect(heard).toEqual([
      'pointerleave:pressed',
      'mouseleave:pressed',
      'pointerleave:inner',
      'mouseleave:inner',
      'pointerleave:item',
      'mouseleave:item',
    ]);
  });

  it('stops at the item: the pointer is still over the list', () => {
    const { byId, heard } = build();
    leavePressed(byId('pressed'), byId('item'));
    expect(heard.some((event) => event.endsWith(':list'))).toBe(false);
  });

  it('does nothing when the press was outside the item', () => {
    const { byId, heard } = build();
    leavePressed(byId('list'), byId('item'));
    expect(heard).toEqual([]);
  });
});
