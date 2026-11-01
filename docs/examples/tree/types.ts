export interface Thing {
  id: string;
  name: string;
  icon: string;
  /** Items weigh something; a container weighs what it holds. */
  weight?: number;
  /** A bag, a pouch, a chest: it holds things. */
  container?: boolean;
  children?: Thing[];
}

/** What a thing weighs, with everything inside it. */
export const weightOf = (thing: Thing): number =>
  (thing.weight ?? 0) + (thing.children ?? []).reduce((sum, child) => sum + weightOf(child), 0);
