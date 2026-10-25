import { computed, defineComponent, ref, type ShallowRef } from 'vue';
import { describe, expect, it } from 'vitest';
import type { Key, MaybeElementRef, MaybeReadonlyRefOrGetter } from './types';

/** A component with typed emits, like most UI kit components (`<v-list-item>`, `<UTooltip>`). */
const KitComponent = defineComponent({
  props: { title: String },
  emits: { click: (_event: MouseEvent) => true, 'update:open': (_value: boolean) => true },
  setup: () => () => null,
});

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

  it('accept template refs to components with typed emits', () => {
    const componentRef = ref(null) as unknown as Readonly<ShallowRef<InstanceType<typeof KitComponent> | null>>;
    accepts<MaybeElementRef>(componentRef);
    accepts<MaybeElementRef>(() => componentRef.value);
    expect(true).toBe(true);
  });
});
