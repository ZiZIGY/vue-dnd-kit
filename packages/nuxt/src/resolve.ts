import { collision, components, composables, CORE_PACKAGE, modifiers, sensors, types } from './manifest';

export interface AutoImportOptions {
  /** `makeDraggable`, `makeSortableList`, `makeSelectionArea`, `useDnD`, … Default `true`. */
  composables?: boolean;
  /** `restrictTo*`, `snapToGrid`, `snapCenterToCursor`. Generic names, so default `false`. */
  modifiers?: boolean;
  /** `pointerFirst`, `closestCenter`, … Default `false`. */
  collision?: boolean;
  /** `defineSensor`, `useSensor`, `pointerSensor`, `keyboardSensor`. Default `false`. */
  sensors?: boolean;
  /** Type-only imports of the option, return and event types. Default `true`. */
  types?: boolean;
}

export interface ModuleOptions {
  /** Prefix for the global component: `'Dnd'` registers `<DndDnDProvider>`. Default none. */
  prefix?: string;
  /** Register `<DnDProvider>` globally. Default `true`. */
  components?: boolean;
  /** What to auto-import; `false` turns auto-imports off. */
  autoImports?: AutoImportOptions | false;
  /**
   * The "Vue DnD Kit" tab in the Nuxt DevTools, in development, when the app has
   * `@vue-dnd-kit/devtools` installed. Default `true`.
   */
  devtools?: boolean;
}

export interface ImportEntry {
  name: string;
  from: string;
  type?: boolean;
}

export interface ComponentEntry {
  name: string;
  export: string;
  filePath: string;
}

export const resolveComponents = (options: ModuleOptions): ComponentEntry[] =>
  options.components === false
    ? []
    : components.map((name) => ({ name: `${options.prefix ?? ''}${name}`, export: name, filePath: CORE_PACKAGE }));

export const resolveImports = (options: ModuleOptions): ImportEntry[] => {
  const auto = options.autoImports;
  if (auto === false) return [];
  // `advanced` (useDnDContext, provideDnDContext) is never auto-imported.
  const names: string[] = [
    ...(auto?.composables === false ? [] : composables),
    ...(auto?.modifiers ? modifiers : []),
    ...(auto?.collision ? collision : []),
    ...(auto?.sensors ? sensors : []),
  ];
  const imports: ImportEntry[] = names.map((name) => ({ name, from: CORE_PACKAGE }));
  if (auto?.types !== false) {
    imports.push(...types.map((name) => ({ name, from: CORE_PACKAGE, type: true })));
  }
  return imports;
};
