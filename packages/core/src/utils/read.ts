import { toValue, type MaybeRefOrGetter } from 'vue';
import type { MaybeReadonlyRefOrGetter } from '../types';

/** `toValue` for read-only option values (see `MaybeReadonlyRefOrGetter`). */
export const read = <T>(source: MaybeReadonlyRefOrGetter<T>): T =>
  toValue(source as MaybeRefOrGetter<T>);
