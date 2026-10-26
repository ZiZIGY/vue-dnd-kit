import { computed, onScopeDispose, shallowRef, watch } from 'vue';
import type { DragAreaOptions, DragAreaReturn, MaybeElementRef } from '../types';
import type { AreaEntry } from './manager';
import { useManager } from './context';
import { isPageRoot, readScrollStyle } from './autoscroll/dom';
import { parentOf, toElement } from '../utils/dom';
import { read } from '../utils/read';

/** The container auto-scroll moves for `element`: the element itself or its closest scrollable ancestor. */
const scrollContainerOf = (element: Element): Element | null => {
  for (let node: Element | null = element; node && !isPageRoot(node); node = parentOf(node)) {
    const style = readScrollStyle(node);
    if (style.x || style.y) return node;
  }
  return null;
};

/**
 * Makes an element a drag area: the drags that start inside it (draggables and sortable
 * items) follow its rules, see `DragAreaOptions`. One provider can then serve the whole
 * app, with boards, canvases and feeds that drag their own way. The closest area wins
 * when areas are nested.
 */
export function makeDragArea(target: MaybeElementRef, options: DragAreaOptions = {}): DragAreaReturn {
  const manager = useManager();
  const getElement = () => toElement(target);

  const entry: AreaEntry = {
    getElement,
    isDisabled: () => !!read(options.disabled),
    getActivation: () => read(options.activation),
    getModifiers: () => read(options.modifiers),
    getAxis: () => read(options.axis),
    restricts: () => !!read(options.restrictToArea),
  };

  let bound: HTMLElement | null = null;
  const unbind = () => {
    if (bound) manager.unbindArea(bound, entry);
    bound = null;
  };
  watch(
    getElement,
    (element) => {
      unbind();
      if (!element) return;
      manager.bindArea(element, entry);
      bound = element;
    },
    { immediate: true, flush: 'post' },
  );
  onScopeDispose(unbind);
  onScopeDispose(manager.registerAutoScroll(getElement, () => read(options.autoScroll)));

  // The area the dragged element was in when the drag started: it may leave it since.
  const startedHere = shallowRef(false);
  onScopeDispose(
    manager.addMonitor({
      onDragStart: ({ active }) => {
        startedHere.value = manager.findArea(active.element) === entry;
      },
    }),
  );
  const isDragging = computed(() => startedHere.value && !!manager.active.value);

  const isAutoScrolling = computed(() => {
    const scrollers = manager.autoScrollers.value;
    const element = getElement();
    if (!scrollers.length || !element) return false;
    const container = scrollContainerOf(element);
    return !!container && scrollers.includes(container);
  });

  return { isDragging, isAutoScrolling };
}
