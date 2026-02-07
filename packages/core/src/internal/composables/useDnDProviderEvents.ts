import { handleModifierEvents } from '../logic/modifier';
import { createPointerHandlers } from '../logic/pointer';
import { handleScrollEvent } from '../logic/scroll';
import type { IDnDProviderInternal } from '../types/provider';

export const useDnDProviderEvents = (provider: IDnDProviderInternal) => {
  const handlers = createPointerHandlers(provider);

  const registerEvents = () => {
    document.addEventListener('keydown', handleModifierEvents.keyDown(provider));
    document.addEventListener('keyup', handleModifierEvents.keyUp(provider));
    document.addEventListener('blur', handleModifierEvents.clear(provider));
    document.addEventListener('scroll', handleScrollEvent(provider), true);
    document.addEventListener('pointerdown', handlers.pointerDown);
  };

  const unregisterEvents = () => {
    document.removeEventListener('pointerdown', handlers.pointerDown);
    document.removeEventListener('pointerup', handlers.pointerUp);
    document.removeEventListener('pointermove', handlers.pointerMove);
    document.removeEventListener('keydown', handleModifierEvents.keyDown(provider));
    document.removeEventListener('keyup', handleModifierEvents.keyUp(provider));
    document.removeEventListener('blur', handleModifierEvents.clear(provider));
    document.removeEventListener('scroll', handleScrollEvent(provider), true);
    handlers.cleanup();
  };

  return { registerEvents, unregisterEvents };
};
