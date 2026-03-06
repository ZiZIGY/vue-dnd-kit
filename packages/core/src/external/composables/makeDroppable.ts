import type {
  IBaseOptions,
  IDroppableEvents,
  IPlacement,
  TDnDNodeRef,
  TDroppablePayload,
  TModifierMethod,
} from '../types';
import { computed, onBeforeUnmount, onMounted, type ComputedRef } from 'vue';

import { DnDAttributes } from '../../internal/utils/namespaces';
import { getNode } from '../../internal/utils/dom';
import { useDnDProviderInternal } from '../../internal/composables/useDnDProviderInternal';

interface IMakeDroppableOptions extends IBaseOptions {
  /**
   * Group matching strategy.
   * - `'every'` (default): zone is accessible only if ALL dragged items match zone's groups.
   * - `'some'`: zone is accessible if AT LEAST ONE dragged item matches.
   *   Invalid items are filtered out at drop time (or handled via `events.onValidate`).
   */
  groupMatch?: TModifierMethod;
  events?: IDroppableEvents;
  data?: () => unknown;
}

interface IMakeDroppableReturnType {
  isAllowed: ComputedRef<boolean>;
  isDragOver: ComputedRef<IPlacement | undefined>;
}

export function makeDroppable(ref: TDnDNodeRef): IMakeDroppableReturnType;
export function makeDroppable(
  ref: TDnDNodeRef,
  options: IMakeDroppableOptions,
  payload?: TDroppablePayload
): IMakeDroppableReturnType;
export function makeDroppable(
  ref: TDnDNodeRef,
  payload: TDroppablePayload
): IMakeDroppableReturnType;
export function makeDroppable(
  ref: TDnDNodeRef,
  optionsOrPayload?: IMakeDroppableOptions | TDroppablePayload,
  payload?: TDroppablePayload
): IMakeDroppableReturnType {
  const provider = useDnDProviderInternal();
  let container: HTMLElement | null = null;

  let options: IMakeDroppableOptions;
  let finalPayload: TDroppablePayload | undefined;

  if (typeof optionsOrPayload === 'function') {
    options = {};
    finalPayload = optionsOrPayload;
  } else {
    options = optionsOrPayload ?? {};
    finalPayload = payload;
  }

  const isAllowed = computed(() => {
    const container = getNode(ref);
    if (!container) return false;
    return provider.entities.allowedDroppableSet.has(container);
  });

  const isDragOver = computed(() => {
    const node = getNode(ref);
    if (!node) return undefined;
    return provider.entities.droppableMap.get(node)?.hoveredPlacement;
  });

  onMounted(() => {
    container = getNode(ref);
    if (!container) return;

    container.setAttribute(DnDAttributes.DROPPABLE, '');
    provider.lib.droppableObserver.observe(container);

    provider.entities.droppableMap.set(container, {
      disabled: (options.disabled as boolean) ?? false,
      groups: (options.groups as string[]) ?? [],
      groupMatch: options.groupMatch ?? 'every',
      events: options.events,
      payload: finalPayload,
      data: options.data,
      hoveredPlacement: undefined,
    });
  });

  onBeforeUnmount(() => {
    if (!container) return;

    provider.lib.droppableObserver.unobserve(container);
    provider.entities.visibleDroppableSet.delete(container);
    provider.entities.droppableMap.delete(container);
  });

  return {
    isAllowed,
    isDragOver,
  };
}
