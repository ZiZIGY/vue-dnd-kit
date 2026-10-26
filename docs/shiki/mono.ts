/**
 * Monochrome code themes, in the site's "blueprint" style: no hues, only steps of grey.
 * Keywords and names stand out by brightness, strings recede, comments are dimmed.
 * Used by the Markdown code blocks (Nuxt Content) and by the live examples' sources.
 */

import type { ThemeRegistrationRaw } from 'shiki';

interface Palette {
  name: string;
  type: 'light' | 'dark';
  fg: string;
  strong: string;
  name_: string;
  string: string;
  comment: string;
  punctuation: string;
}

const theme = (palette: Palette): ThemeRegistrationRaw => ({
  name: palette.name,
  type: palette.type,
  colors: {
    'editor.foreground': palette.fg,
    'editor.background': '#00000000',
  },
  settings: [
    { settings: { foreground: palette.fg, background: '#00000000' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: palette.comment, fontStyle: 'italic' } },
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier', 'keyword.control', 'keyword.operator.new', 'variable.language'],
      settings: { foreground: palette.strong },
    },
    {
      scope: ['string', 'string.quoted', 'string.template', 'punctuation.definition.string', 'markup.inline.raw'],
      settings: { foreground: palette.string },
    },
    { scope: ['constant.numeric', 'constant.language', 'support.constant'], settings: { foreground: palette.strong } },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call', 'entity.name.tag', 'support.class.component'],
      settings: { foreground: palette.name_ },
    },
    { scope: ['entity.name.type', 'support.type', 'entity.name.class', 'support.class'], settings: { foreground: palette.name_ } },
    { scope: ['entity.other.attribute-name', 'variable.parameter', 'meta.object-literal.key'], settings: { foreground: palette.fg } },
    {
      scope: ['punctuation', 'meta.brace', 'keyword.operator', 'punctuation.separator', 'punctuation.terminator', 'punctuation.definition.tag'],
      settings: { foreground: palette.punctuation },
    },
    { scope: ['markup.heading', 'markup.bold'], settings: { foreground: palette.strong } },
  ],
});

export const monoDark = theme({
  name: 'dnd-mono-dark',
  type: 'dark',
  fg: '#c9c9c9',
  strong: '#ffffff',
  name_: '#ededed',
  string: '#9a9a9a',
  comment: '#6e6e6e',
  punctuation: '#8a8a8a',
});

export const monoLight = theme({
  name: 'dnd-mono-light',
  type: 'light',
  fg: '#404040',
  strong: '#000000',
  name_: '#171717',
  string: '#6b6b6b',
  comment: '#767676',
  punctuation: '#737373',
});
