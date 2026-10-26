import { effectScope, nextTick, shallowRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DnDStatus } from '../types';
import type { DnDManager } from '../core/manager';
import { useCopyModifier } from './modifier';

const status = shallowRef<DnDStatus>('idle');
const scheduleFrame = vi.fn();
const manager = { props: {}, status, scheduleFrame } as unknown as DnDManager;

const press = (type: 'keydown' | 'keyup') => document.dispatchEvent(new KeyboardEvent(type, { key: 'Alt' }));

/** A sortable group reading the tracker in a scope of its own. */
const group = () => {
  const scope = effectScope(true);
  const held = scope.run(() => useCopyModifier(manager))!;
  return { held, stop: () => scope.stop() };
};

describe('copy modifier tracking', () => {
  const groups: Array<{ stop: () => void }> = [];

  afterEach(async () => {
    groups.splice(0).forEach((entry) => entry.stop());
    status.value = 'idle';
    await nextTick();
    scheduleFrame.mockClear();
  });

  it('listens only while a press waits or a drag runs', async () => {
    const a = group();
    groups.push(a);
    press('keydown');
    expect(a.held()).toBe(false);

    status.value = 'activating';
    await nextTick();
    press('keydown');
    expect(a.held()).toBe(true);
    // The press becomes a drag (through `idle` for a moment): what was read is kept.
    status.value = 'idle';
    status.value = 'dragging';
    await nextTick();
    expect(a.held()).toBe(true);
    press('keyup');
    expect(a.held()).toBe(false);
    expect(scheduleFrame).toHaveBeenCalledTimes(1);

    status.value = 'idle';
    await nextTick();
    press('keydown');
    expect(a.held()).toBe(false);
  });

  it("is one tracker for the provider's groups, stopped with the last of them", async () => {
    const a = group();
    const b = group();
    expect(a.held).toBe(b.held);
    status.value = 'dragging';
    await nextTick();
    a.stop();
    press('keydown');
    expect(b.held()).toBe(true);
    press('keyup');
    b.stop();
    press('keydown');
    expect(b.held()).toBe(false);
    // A new group gets a tracker of its own.
    const c = group();
    groups.push(c);
    expect(c.held).not.toBe(b.held);
  });
});
