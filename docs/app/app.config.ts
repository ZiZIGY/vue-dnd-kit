/**
 * Nuxt UI themed as a blueprint: monochrome, no radius, 1px rings instead of shadows,
 * medium weights only, mono labels. Prose components (Markdown) follow the same rules.
 */

/** A callout of any kind; overrides the coloured code and links the theme gives each one. */
const CALLOUT =
  'bg-muted border-0 ring-default text-default [&_code]:bg-default [&_code]:text-highlighted [&_code]:border-0 [&_a]:text-highlighted [&_a]:hover:border-(--ui-text-highlighted) [&>ul]:marker:text-dimmed';

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'neutral',
      neutral: 'neutral',
    },
    icons: {
      copy: 'i-lucide-copy',
      copyCheck: 'i-lucide-check',
    },
    button: {
      slots: {
        base: 'rounded-none font-medium tracking-tight cursor-pointer select-none transition-[background-color,color,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-(--ui-bg) focus-visible:ring-primary',
      },
      variants: {
        size: {
          lg: { base: 'h-10 px-4 text-sm gap-2' },
          xl: { base: 'h-12 px-6 text-sm gap-2' },
        },
      },
      compoundVariants: [
        { color: 'primary', variant: 'solid', class: 'bg-primary text-inverted hover:bg-primary/80 active:bg-primary/70' },
        {
          color: 'neutral',
          variant: 'outline',
          class: 'ring-1 ring-inset ring-accented text-highlighted bg-default hover:bg-elevated active:bg-accented',
        },
        { color: 'neutral', variant: 'ghost', class: 'text-muted hover:text-highlighted hover:bg-elevated' },
      ],
    },
    badge: {
      slots: { base: 'rounded-none font-mono uppercase tracking-[0.12em]' },
      compoundVariants: [
        { color: 'neutral', variant: 'outline', class: 'ring-1 ring-inset ring-default text-muted bg-transparent' },
      ],
    },
    kbd: {
      base: 'font-mono',
    },
    dropdownMenu: {
      slots: {
        content: 'rounded-none shadow-none ring-1 ring-default bg-default',
        item: 'rounded-none before:rounded-none text-sm cursor-pointer',
        group: 'p-0',
        viewport: 'divide-y divide-default',
      },
    },
    tooltip: {
      slots: { content: 'rounded-none shadow-none ring-1 ring-default bg-default text-highlighted font-mono text-xs' },
    },
    modal: {
      slots: { content: 'rounded-none shadow-none ring-1 ring-default divide-default' },
    },
    commandPalette: {
      slots: {
        input: '[&>input]:h-12',
        group: 'p-0',
        label: 'px-4 pt-4 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-dimmed',
        item: 'rounded-none px-4 py-2.5 before:rounded-none',
      },
    },
    contentToc: {
      slots: {
        title: 'font-mono text-[10px] uppercase tracking-[0.2em] text-dimmed',
        link: 'text-xs',
      },
    },
    contentNavigation: {
      slots: {
        root: 'text-sm',
        link: 'rounded-none before:rounded-none',
        linkLeadingIcon: 'size-4',
      },
    },
    prose: {
      h1: { slots: { base: 'text-3xl sm:text-4xl font-medium tracking-[-0.03em] text-highlighted mb-6' } },
      h2: {
        slots: {
          base: 'relative mt-14 mb-5 text-2xl font-medium tracking-tight text-highlighted scroll-mt-[calc(48px+var(--ui-header-height))] [&>a>code]:text-xl/7 [&>a>code]:font-medium',
          leading: 'absolute -ms-8 top-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-elevated text-muted hidden lg:flex transition',
        },
      },
      h3: {
        slots: {
          base: 'relative mt-10 mb-3 text-lg font-medium tracking-tight text-highlighted scroll-mt-[calc(32px+var(--ui-header-height))] [&>a>code]:text-lg/6 [&>a>code]:font-medium',
          leading: 'absolute -ms-8 top-0.5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-elevated text-muted hidden lg:flex transition',
        },
      },
      h4: { slots: { base: 'mt-8 mb-2 text-base font-medium text-highlighted' } },
      p: { base: 'my-5 leading-7 text-pretty text-default' },
      strong: { base: 'font-medium text-highlighted' },
      a: {
        base: 'text-highlighted underline decoration-(--ui-border-accented) underline-offset-4 hover:decoration-(--ui-text-highlighted) transition-colors font-normal [&>code]:hover:text-highlighted',
      },
      ul: { base: 'list-none ps-0 my-5 [&>li]:relative [&>li]:ps-6 [&>li]:before:absolute [&>li]:before:start-1 [&>li]:before:top-[0.7em] [&>li]:before:size-1.5 [&>li]:before:border [&>li]:before:border-(--ui-text-dimmed)' },
      ol: { base: 'list-decimal ps-6 my-5 marker:font-mono marker:text-xs marker:text-dimmed' },
      li: { base: 'my-2 leading-7' },
      code: {
        base: 'inline px-1 py-px text-[0.875em] font-mono font-normal',
        variants: {
          color: {
            primary: 'border-0 bg-elevated text-highlighted',
            neutral: 'border-0 bg-elevated text-highlighted',
            success: 'border-0 bg-elevated text-success',
            warning: 'border-0 bg-elevated text-warning',
            error: 'border-0 bg-elevated text-error',
            info: 'border-0 bg-elevated text-highlighted',
          },
        },
      },
      pre: {
        slots: {
          root: 'relative my-6 group',
          header:
            'flex items-center gap-2 px-4 py-2 bg-muted ring-1 ring-inset ring-default border-0 font-mono text-[10px] uppercase tracking-[0.2em] text-dimmed',
          filename: 'text-dimmed text-[10px]',
          icon: 'size-3.5 shrink-0 grayscale',
          copy: 'absolute top-1.5 end-1.5 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 transition',
          base: 'group font-mono text-[13px]/6 ring-1 ring-inset ring-default border-0 bg-muted px-5 py-4 whitespace-pre overflow-x-auto focus-visible:outline-2 focus-visible:outline-primary **:[.line]:block',
        },
      },
      codeGroup: {
        slots: {
          list: 'relative flex items-center gap-0 ring-1 ring-inset ring-default border-0 bg-muted overflow-x-auto p-0',
          indicator: 'absolute left-0 bottom-0 h-px w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) bg-primary transition-[translate,width] duration-200',
          trigger:
            'relative inline-flex items-center gap-1.5 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted data-[state=active]:text-highlighted hover:text-highlighted transition-colors',
          // Brand icons stay monochrome, like everything else.
          triggerIcon: 'size-3.5 shrink-0 grayscale',
        },
      },
      callout: {
        slots: {
          base: 'group relative block my-6 px-5 py-4 text-sm/6 bg-muted ring-1 ring-inset ring-default border-0 text-default [&_code]:bg-default *:last:mb-0!',
          icon: 'size-4 shrink-0 align-sub me-2 inline-block text-highlighted',
        },
        // Every kind looks the same but for its icon; code and links inside stay monochrome.
        variants: {
          color: {
            primary: { base: CALLOUT, icon: 'text-highlighted' },
            neutral: { base: CALLOUT, icon: 'text-highlighted' },
            success: { base: CALLOUT, icon: 'text-highlighted' },
            warning: { base: CALLOUT, icon: 'text-warning' },
            error: { base: CALLOUT, icon: 'text-error' },
            info: { base: CALLOUT, icon: 'text-highlighted' },
          },
        },
      },
      table: {
        slots: {
          root: 'relative my-6 overflow-x-auto ring-1 ring-inset ring-default',
          base: 'w-full border-separate border-spacing-0',
        },
      },
      th: {
        base: 'rule-dashed-b px-4 py-3 text-start font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-dimmed border-0',
      },
      td: {
        base: 'rule-dashed-b px-4 py-3 text-sm align-top text-default border-0 [&_code]:text-xs/5 [&_p]:my-0',
      },
      hr: { base: 'my-12 border-0 h-px line-dashed-x' },
      blockquote: { base: 'my-6 border-s border-default ps-6 text-lg leading-snug tracking-tight text-highlighted' },
      steps: {
        base: 'ms-3 border-s border-default ps-8 [counter-reset:step]',
        variants: {
          level: {
            '3': '[&>h3]:[counter-increment:step] [&>h3]:relative [&>h3]:before:absolute [&>h3]:before:size-6 [&>h3]:before:bg-default [&>h3]:before:ring-1 [&>h3]:before:ring-accented [&>h3]:before:font-mono [&>h3]:before:text-[11px] [&>h3]:before:text-highlighted [&>h3]:before:inline-flex [&>h3]:before:items-center [&>h3]:before:justify-center [&>h3]:before:-ms-[44.5px] [&>h3]:before:content-[counter(step,decimal-leading-zero)] [&>h3>a>span.absolute]:hidden',
          },
        },
      },
    },
  },
});
