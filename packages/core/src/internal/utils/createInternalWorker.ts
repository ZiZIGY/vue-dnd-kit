export interface IInternalWorker<T, R> {
  run: (data: T) => Promise<R>;
  terminate: () => void;
  readonly isSupported: boolean;
}

export interface ICreateInternalWorkerOptions {
  localDependencies?: Function[];
}

// Runs inside the worker. Serialized via .toString() — no closures, no imports.
function _workerMessageHandler(fn: (data: unknown) => unknown): void {
  (globalThis as any).onmessage = (e: MessageEvent) => {
    const { callId, data } = e.data as { callId: number; data: unknown };
    try {
      const result = fn(data);
      (globalThis as any).postMessage({ callId, ok: true, result });
    } catch (err) {
      (globalThis as any).postMessage({ callId, ok: false, error: String(err) });
    }
  };
}

function buildWorkerSource(fn: Function, localDeps: Function[]): string {
  const depsSrc = localDeps.map((d) => d.toString()).join('\n\n');
  return [
    depsSrc,
    `var __fn = ${fn.toString()};`,
    `(${_workerMessageHandler.toString()})(__fn);`,
  ].join('\n\n');
}

export function createInternalWorker<T, R>(
  fn: (data: T) => R,
  options?: ICreateInternalWorkerOptions
): IInternalWorker<T, R> {
  let worker: Worker | null = null;
  let blobUrl: string | null = null;
  let supported = false;
  let currentCallId = 0;
  const pending = new Map<number, { resolve: (r: R) => void; reject: (e: Error) => void }>();

  try {
    const src = buildWorkerSource(fn, options?.localDependencies ?? []);
    const blob = new Blob([src], { type: 'application/javascript' });
    blobUrl = URL.createObjectURL(blob);
    worker = new Worker(blobUrl);
    supported = true;

    worker.onmessage = (e: MessageEvent) => {
      const cb = pending.get(e.data.callId);
      if (!cb) return;
      pending.delete(e.data.callId);
      e.data.ok ? cb.resolve(e.data.result as R) : cb.reject(new Error(e.data.error));
    };

    worker.onerror = (e: ErrorEvent) => {
      supported = false;
      for (const cb of pending.values()) cb.reject(new Error(e.message));
      pending.clear();
      worker?.terminate();
      worker = null;
    };
  } catch {
    supported = false;
  }

  const run = (data: T): Promise<R> => {
    if (!worker || !supported) {
      try {
        return Promise.resolve(fn(data));
      } catch (err) {
        return Promise.reject(err instanceof Error ? err : new Error(String(err)));
      }
    }
    const callId = ++currentCallId;
    return new Promise<R>((resolve, reject) => {
      pending.set(callId, { resolve, reject });
      worker!.postMessage({ callId, data });
    });
  };

  const terminate = () => {
    for (const cb of pending.values()) cb.reject(new Error('Worker terminated'));
    pending.clear();
    worker?.terminate();
    worker = null;
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      blobUrl = null;
    }
    supported = false;
  };

  return {
    run,
    terminate,
    get isSupported() {
      return supported;
    },
  };
}
