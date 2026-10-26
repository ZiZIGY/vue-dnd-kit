/**
 * The API reference, read from the library's types (`packages/core/src/types/*.ts`) at
 * build time: every exported interface with its members, their types and JSDoc. The
 * reference can't drift from the code. English comes from the JSDoc; translations from
 * `i18n/api/<locale>.json` (`"Interface.member": "…"`), applied by the `ApiTable` component.
 *
 * Generates `#api`: `api[name] = { description, members: [{ name, type, optional, reactive, description }] }`.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { addTemplate, createResolver, defineNuxtModule, updateTemplates } from '@nuxt/kit';
import ts from 'typescript';

export interface ApiMember {
  name: string;
  /** The type as written, unwrapped from the reactive wrappers below. */
  type: string;
  optional: boolean;
  /** `'getter'`: a value, a ref or a getter; `'ref'`: a value or a ref. */
  reactive?: 'getter' | 'ref';
  description: string;
  deprecated?: string;
}

export interface ApiEntry {
  kind: 'interface' | 'type';
  description: string;
  members: ApiMember[];
  /** Type aliases: their definition. */
  type?: string;
}

const WRAPPERS: Record<string, ApiMember['reactive']> = {
  MaybeReadonlyRefOrGetter: 'getter',
  MaybeReadonlyRef: 'ref',
};

const docOf = (node: ts.Node): { description: string; deprecated?: string } => {
  const docs = (node as { jsDoc?: ts.JSDoc[] }).jsDoc;
  const doc = docs?.at(-1);
  if (!doc) return { description: '' };
  const description = (ts.getTextOfJSDocComment(doc.comment) ?? '').trim();
  const deprecated = doc.tags?.find((tag) => tag.tagName.text === 'deprecated');
  return {
    description,
    deprecated: deprecated ? (ts.getTextOfJSDocComment(deprecated.comment) ?? '').trim() || 'Deprecated.' : undefined,
  };
};

const squeeze = (text: string) => text.replace(/\s+/g, ' ').trim();

const memberOf = (member: ts.TypeElement, source: ts.SourceFile): ApiMember | null => {
  const name = member.name?.getText(source);
  if (!name) return null;
  let type = '';
  let reactive: ApiMember['reactive'];
  if (ts.isPropertySignature(member) && member.type) {
    const node = member.type;
    if (ts.isTypeReferenceNode(node) && WRAPPERS[node.typeName.getText(source)] && node.typeArguments?.length === 1) {
      reactive = WRAPPERS[node.typeName.getText(source)];
      type = node.typeArguments[0]!.getText(source);
    } else {
      type = node.getText(source);
    }
  } else if (ts.isMethodSignature(member)) {
    const params = member.parameters.map((param) => param.getText(source)).join(', ');
    type = `(${params}) => ${member.type?.getText(source) ?? 'void'}`;
  } else {
    type = member.getText(source);
  }
  const optional = !!member.questionToken;
  // `| undefined` on an optional member says nothing more.
  if (optional) type = type.replace(/\s*\|\s*undefined$/, '');
  return { name, type: squeeze(type), optional, reactive, ...docOf(member) };
};

const readTypes = (dir: string): Record<string, ApiEntry> => {
  const entries: Record<string, ApiEntry> = {};
  for (const file of readdirSync(dir).filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))) {
    const path = join(dir, file);
    const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
    source.forEachChild((node) => {
      const exported = ts.canHaveModifiers(node) && ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!exported) return;
      if (ts.isInterfaceDeclaration(node)) {
        const members = node.members.map((member) => memberOf(member, source)).filter((m): m is ApiMember => !!m);
        entries[node.name.text] = { kind: 'interface', description: docOf(node).description, members };
      } else if (ts.isTypeAliasDeclaration(node)) {
        entries[node.name.text] = {
          kind: 'type',
          description: docOf(node).description,
          members: [],
          type: squeeze(node.type.getText(source)),
        };
      }
    });
  }
  return entries;
};

export default defineNuxtModule({
  meta: { name: 'docs-api' },
  setup(_, nuxt) {
    const { resolve: resolvePath } = createResolver(import.meta.url);
    const typesDir = resolve(resolvePath('..'), '../packages/core/src/types');

    const template = addTemplate({
      filename: 'api/index.mjs',
      getContents: () => `export const api = ${JSON.stringify(readTypes(typesDir))};\n`,
    });
    addTemplate({
      filename: 'api/index.d.mts',
      getContents: () =>
        [
          "export type { ApiEntry, ApiMember } from '../../modules/api';",
          "import type { ApiEntry } from '../../modules/api';",
          'export declare const api: Record<string, ApiEntry>;',
        ].join('\n'),
    });
    nuxt.options.alias['#api'] = template.dst;

    nuxt.hook('builder:watch', async (_event, path) => {
      if (!resolve(nuxt.options.rootDir, path).startsWith(typesDir)) return;
      await updateTemplates({ filter: (entry) => entry.filename.startsWith('api/') });
    });
  },
});
