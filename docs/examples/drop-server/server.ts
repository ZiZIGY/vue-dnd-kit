import { reactive, ref } from 'vue';
import type { Key } from '@vue-dnd-kit/core';

export interface Task {
  id: string;
  title: string;
}

/** The store: changed only once the server has agreed. */
export const board = reactive<Record<string, Task[]>>({
  backlog: [
    { id: 'search', title: 'Search in docs' },
    { id: 'avatars', title: 'Upload avatars' },
    { id: 'exports', title: 'Export to CSV' },
  ],
  sprint: [
    { id: 'login', title: 'Passwordless login' },
    { id: 'billing', title: 'Billing page' },
  ],
});

export type ServerMode = 'reliable' | 'flaky' | 'down';
export const mode = ref<ServerMode>('reliable');

/** A request is on its way: the overlay shows it. */
export const saving = ref(false);

interface Request {
  id: number;
  text: string;
  status: 'pending' | 200 | 503;
}
export const requests = ref<Request[]>([]);

let count = 0;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** A pretend `PATCH`: 0.9 s, and it fails when the server is down, or every other time when flaky. */
export async function saveMove(keys: Key[], to: { list: Key; index: number }): Promise<void> {
  const request = reactive<Request>({ id: ++count, text: `PATCH ${keys.join(',')} → ${to.list}[${to.index}]`, status: 'pending' });
  requests.value = [request, ...requests.value].slice(0, 3);
  saving.value = true;
  try {
    await wait(900);
    const ok = mode.value === 'reliable' || (mode.value === 'flaky' && request.id % 2 === 1);
    request.status = ok ? 200 : 503;
    if (!ok) throw new Error('503 Service Unavailable');
  } finally {
    saving.value = false;
  }
}
