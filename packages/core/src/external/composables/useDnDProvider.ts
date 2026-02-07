import type { IDnDProviderExternal } from "../types";
import { useDnDProviderInternal } from "../../internal/composables/useDnDProviderInternal";

export const useDnDProvider = (): IDnDProviderExternal => {
  const provider = useDnDProviderInternal();
  
  return {
    overlay: provider.overlay,
    delay: provider.delay,
    distanceProgress: provider.distanceProgress,
    entities: provider.entities,
    pointer: provider.pointer,
    state: provider.state,
    scrollPosition: provider.scrollPosition,
    modifiers: provider.modifiers,
    hovered: provider.hovered,
    collision: provider.collision,
  }
}