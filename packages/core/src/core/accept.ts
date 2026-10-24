import type { AcceptContext, AcceptMode, AcceptRule, DragItem, Key } from '../types';

export const normalizeTypes = (type: string | string[] | null | undefined): string[] =>
  type == null ? [] : Array.isArray(type) ? type : [type];

const itemMatches = (item: DragItem, allowed: string[]) =>
  item.type.length === 0 || item.type.some((type) => allowed.includes(type));

/** Splits dragged items into accepted and rejected by a rule. */
export const partitionByRule = (
  rule: AcceptRule | undefined,
  context: AcceptContext,
): { accepted: Key[]; rejected: Key[] } => {
  if (rule == null || rule === '*') {
    return { accepted: context.items.map((item) => item.id), rejected: [] };
  }
  if (typeof rule === 'function') {
    return rule(context)
      ? { accepted: context.items.map((item) => item.id), rejected: [] }
      : { accepted: [], rejected: context.items.map((item) => item.id) };
  }
  const allowed = Array.isArray(rule) ? rule : [rule];
  const accepted: Key[] = [];
  const rejected: Key[] = [];
  for (const item of context.items) {
    (itemMatches(item, allowed) ? accepted : rejected).push(item.id);
  }
  return { accepted, rejected };
};

export const matchesRule = (
  rule: AcceptRule | undefined,
  context: AcceptContext,
  mode: AcceptMode = 'all',
): boolean => {
  const { accepted, rejected } = partitionByRule(rule, context);
  return mode === 'some' ? accepted.length > 0 : rejected.length === 0;
};
