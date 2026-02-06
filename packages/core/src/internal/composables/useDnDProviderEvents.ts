import { handleModifierEvents } from '../logic/events/modifier';
import { handlePointerEvents } from '../logic/events/pointer';
import { handleScrollEvent } from '../logic/events/scroll';
import type { IDnDProviderInternal } from '../types/provider';

export const useDnDProviderEvents = (
  provider: IDnDProviderInternal
) => {
  const registerEvents = () => {
    document.addEventListener('keydown', handleModifierEvents.keyDown(provider));
    document.addEventListener('keyup', handleModifierEvents.keyUp(provider));
    document.addEventListener('blur', handleModifierEvents.clear(provider));
    document.addEventListener('scroll', handleScrollEvent(provider), true);
    document.addEventListener('pointerdown', handlePointerEvents.pointerDown(provider));
  };

  const unregisterEvents = () => {
    document.removeEventListener('pointerdown', handlePointerEvents.pointerDown(provider));
    document.removeEventListener('pointerup', handlePointerEvents.pointerUp(provider));
    document.removeEventListener('pointermove', handlePointerEvents.pointerMove(provider));
    document.removeEventListener('keydown', handleModifierEvents.keyDown(provider));
    document.removeEventListener('keyup', handleModifierEvents.keyUp(provider));
    document.removeEventListener('blur', handleModifierEvents.clear(provider));
    document.removeEventListener('scroll', handleScrollEvent(provider), true);
    
    handlePointerEvents.cleanup(provider);
  };

  return { registerEvents, unregisterEvents };
};
