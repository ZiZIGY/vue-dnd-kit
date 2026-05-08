import { computed, shallowRef, watch } from "vue";
import type { Ref } from "vue";
import { useDnDProvider } from "./useDnDProvider";
import { createAutoScrollController } from "../../internal/utils/auto-scroll";
import type { IAutoScrollOptions } from "../types";

export type { IAutoScrollOptions };

/**
 * Auto-scroll when the drag overlay is near container edges, and the
 * container is the drop target. Element scroll only.
 *
 * @param container - Ref to the scrollable element
 * @param options - threshold, speed, disabled
 * @returns { isScrolling }
 */
export const makeAutoScroll = (
  container: Ref<HTMLElement | null>,
  options?: IAutoScrollOptions,
) => {
  const provider = useDnDProvider();
  const isScrolling = shallowRef(false);

  const getOverlayPoint = () => {
    if (provider.state.value !== "dragging") return null;
    const position = provider.preview.position.value;
    const size = provider.preview.size.value;
    if (!position) return null;
    if (size?.width && size?.height) {
      return {
        x: position.x + size.width / 2,
        y: position.y + size.height / 2,
      };
    }
    return position;
  };

  const controller = createAutoScrollController(
    container,
    options ?? {},
    getOverlayPoint,
    undefined,
    isScrolling,
  );

  const isHovered = computed(() => {
    const element = container.value;
    return element != null && provider.hovered.droppable.has(element);
  });

  watch(
    [() => provider.state.value, isHovered],
    ([state, hovered]) => {
      if (state === "dragging" && hovered) {
        controller.run();
      } else {
        controller.stop();
      }
    },
  );

  return { isScrolling };
};
