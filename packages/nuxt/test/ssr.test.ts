import { fileURLToPath } from 'node:url';
import { $fetch, setup } from '@nuxt/test-utils/e2e';
import { describe, expect, it } from 'vitest';

describe('module in a Nuxt app (SSR)', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
    server: true,
    browser: false,
  });

  it('resolves the component and the auto-imports and renders the list on the server', async () => {
    const html = await $fetch<string>('/');
    expect(html).toContain('data-id="a"');
    expect(html).toContain('data-id="c"');
    expect(html).toMatch(/data-testid="status"[^>]*>\s*idle\s*</);
    // Overlay, instructions and live region are client-only (no teleport in the SSR HTML).
    expect(html).not.toContain('role="status"');
  });
});
