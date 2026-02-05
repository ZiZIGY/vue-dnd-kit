import { inject } from "vue"
import { injectionKey } from "../utils/namespaces"
import type { IDnDProvider } from "../types";

export const useDnDProvider = () => {
  const provider = inject<IDnDProvider>(injectionKey)
  if (!provider) throw Error('DnD provider not found');
  return provider;
}