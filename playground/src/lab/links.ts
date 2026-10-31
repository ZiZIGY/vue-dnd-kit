import type { DemoEntry } from '../catalog';

/** The docs site; `VITE_DOCS_URL` points it elsewhere (the local docs: `http://localhost:3000/vue-dnd-kit`). */
export const DOCS_URL: string = import.meta.env.VITE_DOCS_URL ?? 'https://zizigy.github.io/vue-dnd-kit';

export const REPO_URL = 'https://github.com/ZiZIGY/vue-dnd-kit';

export const docsOf = (entry: DemoEntry): string | null => (entry.docs ? `${DOCS_URL}/docs/${entry.docs}` : null);
