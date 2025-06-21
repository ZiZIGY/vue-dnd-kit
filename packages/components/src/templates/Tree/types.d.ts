export type TValidItemKeys<T> = {
  [K in keyof T]-?: T[K] extends string | number ? K : never;
}[keyof T];

export type TValidNestingKeys<T> = {
  [K in keyof T]: T[K] extends T[] | undefined ? K : never;
}[keyof T];
