/**
 * Reads the library's types (`packages/core/src/types/*.ts`): every exported interface with its
 * members, their types and JSDoc, and every exported type alias. Used by the API reference
 * (`modules/api.ts`) and the translation tool (`tools/i18n.ts`).
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
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
  /** The types file it is declared in, without `.ts`: its translations are in `i18n/api/<locale>/<file>.json`. */
  file: string;
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
  // Line breaks as LF, whatever the checkout's line endings.
  const text = (comment: ts.JSDoc['comment']) => (ts.getTextOfJSDocComment(comment) ?? '').replace(/\r\n/g, '\n').trim();
  const deprecated = doc.tags?.find((tag) => tag.tagName.text === 'deprecated');
  return {
    description: text(doc.comment),
    deprecated: deprecated ? text(deprecated.comment) || 'Deprecated.' : undefined,
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

export const readTypes = (dir: string): Record<string, ApiEntry> => {
  const entries: Record<string, ApiEntry> = {};
  for (const name of readdirSync(dir).filter((entry) => entry.endsWith('.ts') && !entry.endsWith('.test.ts'))) {
    const path = join(dir, name);
    const file = name.slice(0, -'.ts'.length);
    const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
    source.forEachChild((node) => {
      const exported = ts.canHaveModifiers(node) && ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!exported) return;
      if (ts.isInterfaceDeclaration(node)) {
        const members = node.members.map((member) => memberOf(member, source)).filter((m): m is ApiMember => !!m);
        entries[node.name.text] = { kind: 'interface', file, description: docOf(node).description, members };
      } else if (ts.isTypeAliasDeclaration(node)) {
        entries[node.name.text] = {
          kind: 'type',
          file,
          description: docOf(node).description,
          members: [],
          type: squeeze(node.type.getText(source)),
        };
      }
    });
  }
  return entries;
};

/** The texts to translate: every description, keyed `Name` (the type's own) and `Name.member`. */
export const apiTexts = (entries: Record<string, ApiEntry>) =>
  Object.entries(entries).flatMap(([name, entry]) => [
    ...(entry.description ? [{ file: entry.file, key: name, text: entry.description }] : []),
    ...entry.members
      .filter((member) => member.description)
      .map((member) => ({ file: entry.file, key: `${name}.${member.name}`, text: member.description })),
  ]);

/** A translated API text, as stored in `i18n/api/<locale>/<file>.json`. */
export interface ApiTranslation {
  /** Hash of the English it translates (`tools/source.ts`). */
  source: string;
  text: string;
  /** The English to translate, written by `tools/i18n.ts prepare`; removed once translated. */
  en?: string;
}
