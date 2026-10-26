import { examples, type ExampleFile } from '#examples';

/**
 * A live example of `examples/<name>/`: its demo component (lazy, client-only) and the
 * very files that run it, highlighted at build time.
 */
export async function useExample(name: string) {
  const entry = examples[name];
  if (!entry && import.meta.dev) console.warn(`[docs] No example named "${name}" in examples/.`);
  const Demo = entry ? defineAsyncComponent(entry.component) : null;
  const { data: files } = await useAsyncData(`example-${name}`, () => entry?.files() ?? Promise.resolve([] as ExampleFile[]));
  return { Demo, files };
}
