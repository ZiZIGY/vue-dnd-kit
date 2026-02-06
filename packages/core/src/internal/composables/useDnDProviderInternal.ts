import { inject } from "vue"
import { injectionKey } from "../../internal/utils/namespaces"
import type { IDnDProviderInternal } from "../types/provider";

export const useDnDProviderInternal = () => {
  const provider = inject<IDnDProviderInternal>(injectionKey)
  if (!provider) throw Error('DnD provider not found');
  
  return provider;
}