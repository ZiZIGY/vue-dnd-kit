import { IDnDPayload, IDnDStore } from '../types';

export const preventEvent = (event: Event) => {
  event.preventDefault();
};

export const createPayload = (store: IDnDStore): IDnDPayload => {
  return {
    items: Array.from(store.draggingElements.value.values()),
  };
};
