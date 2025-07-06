import { computed, onBeforeUnmount, onMounted } from 'vue';
import { useDnDProvider } from '../provider/context';
import { IDraggableOptions, TDnDNode } from '../@types';
import { getElementFromRef } from '../utils/vue';
import { setupDnDAttributes } from '../utils/dom';

export const makeDraggable = (
  ref: TDnDNode,
  options: IDraggableOptions,
  dependencies?: () => [any[], number]
) => {
  const provider = useDnDProvider();

  const isDragging = computed(() => {
    const element = getElementFromRef(ref);
    return provider.draggingMap.has(element);
  });

  const handleDragStart = (event: PointerEvent | KeyboardEvent) => {
    const element = getElementFromRef(ref);
    provider.handlePointerDown(event, element);
  };

  onMounted(() => {
    if (!ref.value) return;

    const element = getElementFromRef(ref);

    provider.elementsMap.set(element, {
      node: element,
      disabled: options.disabled as boolean,
      groups: options.groups as string[],
      dependencies: dependencies
        ? (computed(dependencies) as unknown as [any[], number])
        : undefined,
      view: options.view,
      overlay: options.overlay,
      events: options.events,
    });

    setupDnDAttributes(element, 'draggable');

    provider.observeElement('add', element);
  });

  onBeforeUnmount(() => {
    const element = getElementFromRef(ref);

    provider.elementsMap.delete(element);
    provider.observeElement('remove', element);
  });

  return {
    isDragging,
    handleDragStart,
  };
};
