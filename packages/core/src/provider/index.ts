import { inject, provide, reactive, watch } from 'vue';
import { createDnDEvents } from './events';
import type { IDnDProvider } from '../types';

export const createDnDProvider = () => {
  const events = createDnDEvents();

  const provider = reactive<IDnDProvider>({
    events,
    entities: {
      draggableMap: new Map(),
      droppableMap: new Map(),
      selectableAreasMap: new Map(),
    },
  });

  provide('DnDProvider', provider);

  return provider;
};

export const getDnDProvider = () => {
  return inject<IDnDProvider>('DnDProvider');
};
