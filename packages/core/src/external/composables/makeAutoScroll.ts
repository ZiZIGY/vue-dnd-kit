import { shallowRef, watch } from "vue";
import type { Ref } from "vue";
import { useDnDProvider } from "./useDnDProvider";
import { createAutoScrollController } from "../../internal/utils/auto-scroll";
import type { IAutoScrollOptions } from "../types";

export type { IAutoScrollOptions };

/**
 * Auto-scroll when the drag overlay is near container edges. Element scroll only.
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
    const position = provider.overlay.position.value;
    const size = provider.overlay.size.value;
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

  watch(
    () => provider.state.value,
    (state) => {
      if (state === "dragging") controller.run();
      else controller.stop();
    },
  );

  return { isScrolling };
};
