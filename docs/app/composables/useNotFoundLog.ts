import type { InjectionKey, Ref } from 'vue';

/** A line of the 404's event log; `at` is in ms since the page opened. */
export interface NotFoundLogLine {
  id: number;
  at: number;
  kind: string;
  text: string;
  tone?: 'ok' | 'error' | 'muted';
}

export interface NotFoundLog {
  lines: Readonly<Ref<readonly NotFoundLogLine[]>>;
  write(kind: string, text: string, tone?: NotFoundLogLine['tone']): void;
}

const KEY: InjectionKey<NotFoundLog> = Symbol('not-found-log');
/** Older lines scroll out of the log. */
const KEEP = 60;

/**
 * The 404's log, for the components of the page: it opens with how the visit got here (the
 * same lines on the server and the client), then takes what happens on the page.
 */
export const provideNotFoundLog = (path: string): NotFoundLog => {
  const lines = ref<NotFoundLogLine[]>([
    { id: 0, at: 0, kind: 'GET', text: path, tone: 'muted' },
    { id: 1, at: 3, kind: 'resolve', text: 'no route matches', tone: 'muted' },
    { id: 2, at: 4, kind: 'drop', text: 'page → over: null' },
    { id: 3, at: 4, kind: '404', text: 'DropTargetNotFound: no droppable takes this page', tone: 'error' },
  ]);
  let next = lines.value.length;
  // The clock starts where the opening lines end.
  let origin = 0;
  onMounted(() => (origin = performance.now() - 5));

  const log: NotFoundLog = {
    lines,
    write(kind, text, tone) {
      lines.value.push({ id: next++, at: performance.now() - origin, kind, text, tone });
      if (lines.value.length > KEEP) lines.value.shift();
    },
  };
  provide(KEY, log);
  return log;
};

export const useNotFoundLog = (): NotFoundLog => {
  const log = inject(KEY);
  if (!log) throw new Error('useNotFoundLog() needs provideNotFoundLog() above it');
  return log;
};
