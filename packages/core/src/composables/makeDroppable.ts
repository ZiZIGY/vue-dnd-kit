import { onMounted } from 'vue';
import { TDnDNode } from '../@types';
import { useDnDProvider } from '../provider/context';
import { getElementFromRef } from '../utils/vue';

export const makeDroppable = (ref: TDnDNode) => {
  const provider = useDnDProvider();

  onMounted(() => {
    if (!ref.value) return;

    const element = getElementFromRef(ref);

    provider.droppableMap.set(element, {
      node: element,
    });
  });
};
