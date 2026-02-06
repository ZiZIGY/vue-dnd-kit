import type { IDnDProviderExternal } from "../types";
import { useDnDProviderInternal } from "../../internal/composables/useDnDProviderInternal";

export const useDnDProvider = (): IDnDProviderExternal => {
  const provider = useDnDProviderInternal();
  
  return {
    delayProgress: provider.delayProgress,
    distanceProgress: provider.distanceProgress,
    entities: provider.entities,
    overlayStyle: provider.overlayStyle,
    pointer: provider.pointer,
    state: provider.state,
    scrollPosition: provider.scrollPosition,
    delayStartTime: provider.delayStartTime,
    modifiers: provider.modifiers
  }
}