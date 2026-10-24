import { computed, ref, type ShallowRef } from 'vue';
import { describe, expect, it } from 'vitest';
import type { Key, MaybeElementRef, MaybeReadonlyRefOrGetter } from './types';

// Compile-time checks (run by `yarn typecheck`): the refs users actually have must
// be accepted by option types.
const accepts = <T>(value: T): T => value;

describe('public option types', () => {
  it('accept readonly template refs, narrower refs, computeds and getters', () => {
    const templateRef = ref(null) as unknown as Readonly<ShallowRef<HTMLElement | null>>;
    accepts<MaybeElementRef>(templateRef);
    accepts<MaybeElementRef>(() => document.body);
    accepts<MaybeReadonlyRefOrGetter<Key>>(ref('a'));
    accepts<MaybeReadonlyRefOrGetter<Key>>(computed(() => 1));
    accepts<MaybeReadonlyRefOrGetter<boolean>>(() => true);
    expect(true).toBe(true);
  });
});
