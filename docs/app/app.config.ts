/**
 * Nuxt UI themed for the docs: mono uppercase controls, a solid green primary, bold tight
 * headings, flat panels for code and callouts. Prose components (Markdown) follow suit.
 */

const CALLOUT = 'bg-elevated/60 border-0 border-s-2 text-default [&_code]:bg-accented/60 [&_a]:text-highlighted';

export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'zinc',
    },
    icons: {
      copy: 'i-lucide-copy',
      copyCheck: 'i-lucide-check',
    },
    button: {
      slots: {
        base: 'rounded-(--ui-radius) font-mono font-semibold uppercase tracking-[0.08em] cursor-pointer select-none transition-colors duration-150',
      },
      variants: {
        size: {
          sm: { base: 'h-8 px-3 text-[11px] gap-1.5' },
          md: { base: 'h-9 px-3.5 text-[11px] gap-2' },
          lg: { base: 'h-11 px-5 text-xs gap-2' },
          xl: { base: 'h-12 px-6 text-xs gap-2.5' },
        },
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          class: 'bg-(--color-accent) text-(--color-on-accent) hover:bg-(--color-accent-strong) active:bg-(--color-accent-strong)',
        },
        {
          color: 'neutral',
          variant: 'outline',
          class: 'ring-1 ring-inset ring-accented text-highlighted bg-transparent hover:bg-elevated',
        },
        { color: 'neutral', variant: 'ghost', class: 'text-muted hover:text-highlighted hover:bg-elevated' },
        { color: 'neutral', variant: 'link', class: 'text-highlighted hover:text-(--ui-primary) px-0' },
      ],
    },
    badge: {
      slots: { base: 'rounded-(--ui-radius) font-mono font-semibold uppercase tracking-[0.08em]' },
    },
    kbd: {
      base: 'font-mono',
    },
    dropdownMenu: {
      slots: {
        content: 'shadow-xl ring-1 ring-default bg-elevated',
        item: 'text-sm cursor-pointer',
        label: 'label text-[10px] text-dimmed',
      },
    },
    tooltip: {
      slots: { content: 'ring-1 ring-default bg-elevated text-highlighted font-mono text-[11px]' },
    },
    contentToc: {
      slots: {
        title: 'label text-[11px] text-highlighted',
        link: 'text-[13px]',
      },
    },
    prose: {
      h1: { slots: { base: 'heading text-4xl mb-6' } },
      h2: {
        slots: {
          base: 'relative heading text-[1.75rem] mt-16 mb-5 scroll-mt-[calc(32px+var(--ui-header-height))] [&>a>code]:text-2xl',
          leading: 'absolute -ms-8 top-1.5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 text-dimmed hidden lg:flex transition',
        },
      },
      h3: {
        slots: {
          base: 'relative heading text-xl tracking-[-0.025em] mt-10 mb-3 scroll-mt-[calc(32px+var(--ui-header-height))]',
          leading: 'absolute -ms-8 top-0.5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 text-dimmed hidden lg:flex transition',
        },
      },
      h4: { slots: { base: 'mt-8 mb-2 text-base font-semibold text-highlighted' } },
      p: { base: 'my-5 leading-7 text-pretty text-default' },
      strong: { base: 'font-semibold text-highlighted' },
      a: {
        base: 'font-medium text-highlighted underline decoration-(--ui-primary)/50 decoration-2 underline-offset-4 hover:decoration-(--ui-primary) transition-colors',
      },
      ul: { base: 'list-disc ps-5 my-5 marker:text-(--ui-primary)' },
      ol: { base: 'list-decimal ps-5 my-5 marker:font-mono marker:text-sm marker:text-(--ui-primary)' },
      li: { base: 'my-2 ps-1 leading-7' },
      code: {
        base: 'px-1.5 py-0.5 text-[0.85em] font-mono font-medium rounded-(--ui-radius)',
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
      // Code blocks look like the file tabs of the live examples: the name as it is, mono.
      pre: {
        slots: {
          root: 'relative my-6 group overflow-hidden rounded-(--ui-radius) ring-1 ring-default',
          header: 'flex h-11 items-center gap-2 px-4 bg-default border-0 border-b border-default font-mono text-[12px] text-highlighted',
          filename: 'text-highlighted',
          icon: 'size-4 shrink-0',
          copy: 'absolute top-2 end-2 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 transition',
          base: 'group font-mono text-[13px]/6 border-0 bg-(--code-bg) px-5 py-4 whitespace-pre overflow-x-auto focus-visible:outline-2 focus-visible:outline-(--ui-primary) **:[.line]:block',
        },
      },
      codeGroup: {
        slots: {
          // Its blocks sit inside its frame: no frame of their own.
          root: 'relative my-6 overflow-hidden rounded-(--ui-radius) ring-1 ring-default *:not-first:ring-0 *:not-first:rounded-none',
          list: 'relative flex items-stretch border-0 border-b border-default bg-(--code-bg) overflow-x-auto',
          indicator: 'hidden',
          trigger: 'relative inline-flex h-11 shrink-0 items-center gap-2 px-4 border-e border-default font-mono text-[12px] text-dimmed data-[state=active]:bg-default data-[state=active]:text-highlighted hover:text-highlighted transition-colors',
          triggerIcon: 'size-4 shrink-0 [[data-state=inactive]_&]:opacity-60 [[data-state=inactive]_&]:grayscale',
        },
      },
      callout: {
        slots: {
          base: 'group relative block my-6 px-5 py-4 text-sm/6 rounded-(--ui-radius) *:last:mb-0!',
          icon: 'size-4 shrink-0 align-sub me-2 inline-block',
        },
        variants: {
          color: {
            primary: { base: `${CALLOUT} border-(--ui-primary)`, icon: 'text-(--ui-primary)' },
            neutral: { base: `${CALLOUT} border-accented`, icon: 'text-highlighted' },
            success: { base: `${CALLOUT} border-(--ui-primary)`, icon: 'text-(--ui-primary)' },
            warning: { base: `${CALLOUT} border-warning`, icon: 'text-warning' },
            error: { base: `${CALLOUT} border-error`, icon: 'text-error' },
            info: { base: `${CALLOUT} border-info`, icon: 'text-info' },
          },
        },
      },
      table: {
        slots: {
          root: 'relative my-6 overflow-x-auto',
          base: 'w-full border-separate border-spacing-0',
        },
      },
      th: { base: 'px-4 py-3 text-start label text-[10px] text-dimmed border-0 border-b border-default' },
      td: { base: 'px-4 py-3 text-sm align-top text-default border-0 border-b border-default [&_code]:text-xs/5 [&_p]:my-0' },
      hr: { base: 'my-12 border-default' },
      blockquote: { base: 'my-6 border-s-2 border-(--ui-primary) ps-6 text-lg leading-snug text-highlighted' },
      steps: {
        base: 'ms-3.5 border-s border-default ps-8 [counter-reset:step]',
        variants: {
          level: {
            '3': '[&>h3]:[counter-increment:step] [&>h3]:relative [&>h3]:before:absolute [&>h3]:before:size-7 [&>h3]:before:bg-(--ui-primary) [&>h3]:before:text-(--color-on-accent) [&>h3]:before:font-mono [&>h3]:before:text-xs [&>h3]:before:font-semibold [&>h3]:before:inline-flex [&>h3]:before:items-center [&>h3]:before:justify-center [&>h3]:before:rounded-(--ui-radius) [&>h3]:before:-ms-[46.5px] [&>h3]:before:content-[counter(step)] [&>h3>a>span.absolute]:hidden',
          },
        },
      },
    },
  },
});
