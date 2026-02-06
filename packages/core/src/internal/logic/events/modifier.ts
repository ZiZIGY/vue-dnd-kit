import type { IDnDProviderInternal } from "../../types/provider";

export const handleModifierEvents = {
  keyDown: (provider: IDnDProviderInternal) => (event: KeyboardEvent) => {
    provider.modifiers.value.add(event.code);
  },

  keyUp: (provider: IDnDProviderInternal) => (event: KeyboardEvent) => {
    provider.modifiers.value.delete(event.code);
  },

  clear: (provider: IDnDProviderInternal) => () => {
    provider.modifiers.value.clear();
  }
};