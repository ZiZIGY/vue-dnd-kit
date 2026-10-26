<script setup lang="ts">
  import type { DropdownMenuItem } from '@nuxt/ui';
  import { LOCALES } from '~~/i18n/locales';

  /** Language switcher: the current page in another language. Every translation is AI-made. */
  const { locale, t } = useI18n();
  const switchLocalePath = useSwitchLocalePath();

  /** The English home won't send this visitor to their browser's language any more. */
  const remember = (code: string) => {
    try {
      localStorage.setItem('vdk_locale', code);
    } catch {
      // Storage may be blocked: the choice then holds for this visit only.
    }
  };

  const items = computed<DropdownMenuItem[][]>(() => [
    [{ type: 'label', label: t('language.aiNote') }],
    LOCALES.map((entry) => ({
      label: entry.name,
      to: switchLocalePath(entry.code),
      active: entry.code === locale.value,
      icon: entry.code === locale.value ? 'i-lucide-check' : undefined,
      onSelect: () => remember(entry.code),
    })),
  ]);
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end' }"
    :ui="{ label: 'font-mono text-[10px] uppercase tracking-[0.2em] text-dimmed px-3 py-2' }"
  >
    <UButton
      color="neutral"
      variant="ghost"
      :aria-label="t('language.label')"
      class="font-mono text-xs uppercase tracking-[0.14em]"
      icon="i-lucide-languages"
      :label="locale"
    />
  </UDropdownMenu>
</template>
