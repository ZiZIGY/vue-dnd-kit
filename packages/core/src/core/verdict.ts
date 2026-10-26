import type { BeforeDropResult, Key } from '../types';

/** An `onBeforeDrop` answer as the drop reads it: nothing is no say, the words are booleans. */
export type Verdict = boolean | Key[] | 'continue' | undefined;

/** `'accept'` is `true`, `'reject'` is `false`; ids and `'continue'` stay as they are. */
export const toVerdict = (value: BeforeDropResult): Verdict =>
  value === 'accept' ? true : value === 'reject' ? false : (value ?? undefined);

/** The answer ends the asking: no drop at all, or a drag that goes on. */
export const isFinal = (verdict: Verdict): verdict is false | 'continue' => verdict === false || verdict === 'continue';
