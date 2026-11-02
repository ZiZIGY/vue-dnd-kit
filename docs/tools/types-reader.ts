/**
 * Reads the library's public API from its sources:
 *
 * - its types (`packages/core/src/types/*.ts`): every exported interface with its members,
 *   their types and JSDoc, and every exported type alias;
 * - its exports (`packages/core/src/index.ts`): the signature and JSDoc of every function,
 *   component and value, and the names of the public types.
 *
 * Used by the API reference (`modules/api.ts`), the translation tool (`tools/i18n.ts`) and the
 * coverage check (`tools/api-check.ts`).
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
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
  // A brand (`readonly [brand]: true`, keyed by a symbol of the file) makes a type opaque: no member anyone uses.
  if (member.name && ts.isComputedPropertyName(member.name) && ts.isIdentifier(member.name.expression)) return null;
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

/* --- Exports: the functions, components and values of `index.ts`, and its public types. */

export interface ApiSignature {
  kind: 'function' | 'component' | 'value';
  /** The translations of its description are in `i18n/api/<locale>/exports.json`. */
  file: 'exports';
  /** The declaration, as the API page shows it: `function makeDraggable<TData = unknown>(…): DraggableReturn;`. */
  code: string;
  /** Its type on one line, for lists: `(target: MaybeElementRef) => Modifier`, `Modifier`. */
  type: string;
  description: string;
  deprecated?: string;
  /** Where it is declared, relative to `packages/core/src`. */
  source: string;
  /** Why its signature can't be read from the declaration (reported by `tools/api-check.ts`). */
  problem?: string;
}

export interface LibraryApi {
  /** The interfaces and type aliases of `types/*.ts`, public or not. */
  types: Record<string, ApiEntry>;
  /** The functions, components and values `index.ts` exports, by name. */
  signatures: Record<string, ApiSignature>;
  /** The types `index.ts` exports, and the module each comes from (`./types`). */
  publicTypes: { name: string; module: string }[];
}

/** A declaration longer than this breaks its parameters over lines. */
const WIDTH = 80;

const isExported = (node: ts.Node) =>
  ts.canHaveModifiers(node) && !!ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);

const parse = (path: string) => ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);

/** `./core/makeDraggable` → its file. */
const resolveModule = (srcDir: string, module: string) =>
  [`${module}.ts`, `${module}/index.ts`].map((path) => join(srcDir, path)).find((path) => existsSync(path));

const unwrap = (node: ts.Expression): ts.Expression =>
  ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node) ? unwrap(node.expression) : node;

interface FunctionShape {
  typeParameters: string;
  parameters: string[];
  returns: string;
}

/** Parameters as a declaration shows them: a default value makes one optional. */
const shapeOf = (node: ts.SignatureDeclarationBase, source: ts.SourceFile): FunctionShape | string => {
  if (!node.type) return 'no declared return type';
  const parameters: string[] = [];
  for (const param of node.parameters) {
    if (!param.type) return `no declared type for the parameter \`${param.name.getText(source)}\``;
    const optional = param.questionToken || param.initializer ? '?' : '';
    parameters.push(`${param.dotDotDotToken ? '...' : ''}${param.name.getText(source)}${optional}: ${squeeze(param.type.getText(source))}`);
  }
  const typeParameters = node.typeParameters?.length
    ? `<${node.typeParameters.map((param) => squeeze(param.getText(source))).join(', ')}>`
    : '';
  return { typeParameters, parameters, returns: squeeze(node.type.getText(source)) };
};

const functionCode = (name: string, { typeParameters, parameters, returns }: FunctionShape) => {
  const line = `function ${name}${typeParameters}(${parameters.join(', ')}): ${returns};`;
  if (line.length <= WIDTH || !parameters.length) return line;
  return `function ${name}${typeParameters}(\n${parameters.map((param) => `  ${param},\n`).join('')}): ${returns};`;
};

const functionType = ({ typeParameters, parameters, returns }: FunctionShape) =>
  `${typeParameters}(${parameters.join(', ')}) => ${returns}`;

/** The `export { … } from` and `export type { … } from` of `index.ts`. */
const readIndex = (path: string) => {
  const values: { name: string; local: string; module: string }[] = [];
  const types: { name: string; module: string }[] = [];
  for (const node of parse(path).statements) {
    if (!ts.isExportDeclaration(node) || !node.moduleSpecifier || !node.exportClause || !ts.isNamedExports(node.exportClause)) continue;
    const module = (node.moduleSpecifier as ts.StringLiteral).text;
    for (const element of node.exportClause.elements) {
      const name = element.name.text;
      if (node.isTypeOnly || element.isTypeOnly) types.push({ name, module });
      else values.push({ name, local: element.propertyName?.text ?? name, module });
    }
  }
  return { values, types };
};

export const readApi = (srcDir: string): LibraryApi => {
  const types = readTypes(join(srcDir, 'types'));
  const index = readIndex(join(srcDir, 'index.ts'));
  const publicTypes = new Set(index.types.map(({ name }) => name));
  const signatures: Record<string, ApiSignature> = {};
  /** Return types of the exported functions: a value made by calling one (`defineSensor(…)`) has its type. */
  const returns: Record<string, string> = {};
  const pending: (() => void)[] = [];

  for (const { name, local, module } of index.values) {
    const path = resolveModule(srcDir, module);
    const source = path?.slice(srcDir.length + 1).replaceAll('\\', '/') ?? `${module}.ts`;
    const entry = (fields: Pick<ApiSignature, 'kind' | 'code' | 'type' | 'problem'>, node?: ts.Node) => {
      signatures[name] = { ...fields, file: 'exports', source, ...(node ? docOf(node) : { description: '' }) };
    };
    const unreadable = (problem: string, node?: ts.Node) => entry({ kind: 'value', code: `const ${name}: unknown;`, type: 'unknown', problem }, node);
    if (!path) {
      unreadable(`module \`${module}\` not found`);
      continue;
    }
    const file = parse(path);
    const functions = file.statements.filter(
      (node): node is ts.FunctionDeclaration => ts.isFunctionDeclaration(node) && node.name?.text === local && isExported(node),
    );
    if (functions.length) {
      // Overloads: their signatures, not the implementation's.
      const declared = functions.length > 1 ? functions.filter((node) => !node.body) : functions;
      const shapes = declared.map((node) => shapeOf(node, file));
      const problem = shapes.find((shape): shape is string => typeof shape === 'string');
      if (problem) {
        unreadable(problem, declared[0]);
        continue;
      }
      const readable = shapes as FunctionShape[];
      returns[name] = readable[0]!.returns;
      entry({ kind: 'function', code: readable.map((shape) => functionCode(name, shape)).join('\n'), type: functionType(readable[0]!) }, declared[0]);
      continue;
    }
    const statement = file.statements.find(
      (node): node is ts.VariableStatement =>
        ts.isVariableStatement(node) &&
        isExported(node) &&
        node.declarationList.declarations.some((declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === local),
    );
    const declaration = statement?.declarationList.declarations.find((node) => ts.isIdentifier(node.name) && node.name.text === local);
    if (!statement || !declaration) {
      unreadable(`no exported \`${local}\` in ${source}`);
      continue;
    }
    const initializer = declaration.initializer && unwrap(declaration.initializer);
    if (declaration.type) {
      const type = squeeze(declaration.type.getText(file));
      entry({ kind: 'value', code: `const ${name}: ${type};`, type }, statement);
    } else if (initializer && (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer))) {
      const shape = shapeOf(initializer, file);
      if (typeof shape === 'string') {
        unreadable(shape, statement);
        continue;
      }
      returns[name] = shape.returns;
      entry({ kind: 'function', code: functionCode(name, shape), type: functionType(shape) }, statement);
    } else if (initializer && ts.isCallExpression(initializer) && ts.isIdentifier(initializer.expression)) {
      const callee = initializer.expression.text;
      if (callee === 'defineComponent') {
        // A component: its props are the public `<Name>Props`.
        const props = `${name}Props`;
        if (publicTypes.has(props)) {
          const type = `Component<${props}>`;
          entry({ kind: 'component', code: `const ${name}: ${type};`, type }, statement);
        } else unreadable(`a component without a public \`${props}\` type`, statement);
      } else {
        // Its type is what the function it calls returns, once every function is read.
        pending.push(() => {
          const type = returns[callee];
          if (type) entry({ kind: 'value', code: `const ${name}: ${type};`, type }, statement);
          else unreadable(`made by \`${callee}()\`, whose return type isn't declared: annotate its type`, statement);
        });
      }
    } else unreadable('no declared type: annotate it', statement);
  }
  for (const run of pending) run();

  // The order of `index.ts`.
  const ordered = Object.fromEntries(index.values.map(({ name }) => [name, signatures[name]!]));
  return { types, signatures: ordered, publicTypes: index.types };
};

/** The texts to translate: every description, keyed `Name` (a type's or an export's own) and `Name.member`. */
export const apiTexts = ({ types, signatures }: Pick<LibraryApi, 'types' | 'signatures'>) => [
  ...Object.entries(types).flatMap(([name, entry]) => [
    ...(entry.description ? [{ file: entry.file, key: name, text: entry.description }] : []),
    ...entry.members
      .filter((member) => member.description)
      .map((member) => ({ file: entry.file, key: `${name}.${member.name}`, text: member.description })),
  ]),
  ...Object.entries(signatures)
    .filter(([, entry]) => entry.description)
    .map(([name, entry]) => ({ file: entry.file, key: name, text: entry.description })),
];

/** A translated API text, as stored in `i18n/api/<locale>/<file>.json`. */
export interface ApiTranslation {
  /** Hash of the English it translates (`tools/source.ts`). */
  source: string;
  text: string;
  /** The English to translate, written by `tools/i18n.ts prepare`; removed once translated. */
  en?: string;
}
