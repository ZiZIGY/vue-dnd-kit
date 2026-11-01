/** What `onBeforeDrop` answers here: words it understands as they are. */
export type Answer = 'accept' | 'reject' | 'continue';

export const ANSWERS: Answer[] = ['accept', 'reject', 'continue'];

/** Adds a line to the list of hooks: who ran it, and what. */
export type Trace = (who: string, what: string) => void;
