import type {
  IDnDProvider,
  TDnDNodeRef,
  TDragAxis,
} from '../types';
import { inject, onBeforeUnmount, onMounted, type Ref } from 'vue';
import { DnDAttributes, injectionKey } from '../utils/namespaces';
import { getNode } from '../utils/dom';

export interface IMakeBoundingBoxOptions {
  axis?: TDragAxis | Ref<TDragAxis>;
  restrictToArea?: boolean | Ref<boolean>;
}

export function makeBoundingBox(
  ref: TDnDNodeRef,
  options?: IMakeBoundingBoxOptions
) {
  const provider = inject<IDnDProvider>(injectionKey);
  if (!provider) throw Error('DnD provider not found');
  let container: HTMLElement | null = null;

  onMounted(() => {
    container = getNode(ref);
    if (!container) return;

    container.setAttribute(DnDAttributes.CONSTRAINT_AREA, '');

    provider.entities.constraintsAreaMap.set(container, {
      axis: (options?.axis || 'both') as TDragAxis,
      restrictToArea: (options?.restrictToArea || false) as boolean,
    });
  });

  onBeforeUnmount(() => {
    if (!container) return;
    provider.entities.constraintsAreaMap.delete(container);
  });

  return {};
}
