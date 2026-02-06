import type { IDnDProviderInternal } from '../../types/provider';

export const handleScrollEvent = (provider: IDnDProviderInternal) => () => {
  if (provider.state.value) {
    provider.scrollPosition.x = window.scrollX;
    provider.scrollPosition.y = window.scrollY;
  }
};
