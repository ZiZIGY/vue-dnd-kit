import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import * as manifest from '../src/manifest';

const CORE_INDEX = fileURLToPath(new URL('../../core/src/index.ts', import.meta.url));

/** Exports that land with later v3 modules (rfcs/0001-v3.md §15): allowed to be missing for now. */
const PENDING = new Set(['makeSortableTree']);

interface Exports {
  values: Set<string>;
  types: Set<string>;
}

const isExported = (node: ts.Node) =>
  ts.canHaveModifiers(node) &&
  !!ts.getModifiers(node)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);

/** Names a source file exports, split into values and types. Follows `export * from`. */
const readExports = (file: string, result: Exports = { values: new Set(), types: new Set() }, typeOnly = false) => {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const add = (name: string, isType: boolean) => (isType || typeOnly ? result.types : result.values).add(name);

  for (const statement of source.statements) {
    if (ts.isExportDeclaration(statement)) {
      const clause = statement.exportClause;
      if (!clause) {
        // `export * from` / `export type * from`: read the target module.
        const target = (statement.moduleSpecifier as ts.StringLiteral).text;
        readExports(resolve(dirname(file), `${target}.ts`), result, typeOnly || statement.isTypeOnly);
      } else if (ts.isNamedExports(clause)) {
        for (const element of clause.elements) {
          add(element.name.text, statement.isTypeOnly || element.isTypeOnly);
        }
      }
      continue;
    }
    if (!isExported(statement)) continue;
    if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
      add(statement.name.text, true);
    } else if (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) {
      if (statement.name) add(statement.name.text, false);
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) add(declaration.name.text, false);
      }
    }
  }
  return result;
};

const core = readExports(CORE_INDEX);

const groups = {
  components: manifest.components,
  composables: manifest.composables,
  modifiers: manifest.modifiers,
  collision: manifest.collision,
  sensors: manifest.sensors,
  advanced: manifest.advanced,
} as const;

const classified = Object.values(groups).flat() as string[];

describe('export manifest vs packages/core/src/index.ts', () => {
  it('parses the core entry', () => {
    expect(core.values.has('DnDProvider')).toBe(true);
    expect(core.types.has('SortableListOptions')).toBe(true);
  });

  it('classifies every value export of core exactly once', () => {
    const unclassified = [...core.values].filter((name) => !classified.includes(name));
    expect(unclassified, 'add new core exports to src/manifest.ts').toEqual([]);
    expect(new Set(classified).size).toBe(classified.length);
  });

  it('lists only names that core exports', () => {
    const missing = classified.filter((name) => !core.values.has(name) && !PENDING.has(name));
    expect(missing).toEqual([]);
  });

  it('lists only type names that core exports', () => {
    const missing = manifest.types.filter((name) => !core.types.has(name));
    expect(missing).toEqual([]);
  });

  it('keeps the bridge API out of the auto-imported groups', () => {
    expect(manifest.advanced).toEqual(['useDnDContext', 'provideDnDContext']);
    for (const name of manifest.advanced) expect(core.values.has(name)).toBe(true);
  });
});
