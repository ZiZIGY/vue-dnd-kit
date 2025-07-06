import { TDnDNode } from '../@types';

export const getElementFromRef = (ref: TDnDNode) => {
  return ref.value instanceof HTMLElement
    ? ref.value
    : (ref.value?.$el as HTMLElement);
};
