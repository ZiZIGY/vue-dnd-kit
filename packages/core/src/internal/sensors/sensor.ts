import {
  getBoundingBox,
  getCenter,
  getDistance,
  getOverlapPercent,
  containsPoint,
  type IBoundingBox,
} from '../utils/geometry';
import { isDescendant } from '../utils/dom';
import type { IDnDProviderInternal } from '../types/provider';

export type CollisionDetectionFn = (
  provider: IDnDProviderInternal
) => { elements: HTMLElement[]; zones: HTMLElement[] };

export type TContainerFn = (provider: IDnDProviderInternal) => HTMLElement | null;
export type TContainerBoxFn = (provider: IDnDProviderInternal) => IBoundingBox;
export type TCandidatesFn = (provider: IDnDProviderInternal) => Iterable<HTMLElement>;
export type TFilterFn = (node: HTMLElement, provider: IDnDProviderInternal) => boolean;
export type TCollisionContext = { containerBox: IBoundingBox; pointer: { x: number; y: number } };
export type TCollisionCheckFn = (nodeBox: IBoundingBox, ctx: TCollisionContext) => boolean;
export type TSortCompareFn = (
  a: { node: HTMLElement; box: IBoundingBox; meta: ICollisionMeta },
  b: { node: HTMLElement; box: IBoundingBox; meta: ICollisionMeta },
  ctx: { containerBox: IBoundingBox; pointer: { x: number; y: number } }
) => number;

export interface ICollisionMeta {
  isPointerInElement: boolean;
  overlapPercent: number;
  depth: number;
  centerDistance: number;
}

interface ISensorConfig {
  container: TContainerFn;
  containerBox?: TContainerBoxFn;
  elements: TCandidatesFn;
  zones: TCandidatesFn;
  filterElements: TFilterFn;
  filterZones: TFilterFn;
  collision: TCollisionCheckFn;
  sortElements: TSortCompareFn;
  sortZones: TSortCompareFn;
}

const defaultFilter = () => true;
const defaultSort = () => 0;

const createBuilder = (): ISensorBuilder => {
  const config: Partial<ISensorConfig> = {
    filterElements: defaultFilter,
    filterZones: defaultFilter,
    sortElements: defaultSort,
    sortZones: defaultSort,
  };

  const run = (
    provider: IDnDProviderInternal,
    containerBox: IBoundingBox,
    pointer: { x: number; y: number },
    candidates: Iterable<HTMLElement>,
    filter: TFilterFn,
    sortFn: TSortCompareFn,
    collisionCheck: TCollisionCheckFn
  ): HTMLElement[] => {
    const nodeSet = new Set(candidates);
    const ctx = { containerBox, pointer };

    const entries = [...candidates]
      .filter((node) => filter(node, provider))
      .map((node) => {
        const nodeBox = getBoundingBox(node);
        if (!collisionCheck(nodeBox, ctx)) return null;

        let depth = 0;
        for (const parent of nodeSet) {
          if (parent !== node && isDescendant(parent, node)) depth++;
        }

        return {
          node,
          box: nodeBox,
          meta: {
            isPointerInElement: containsPoint(nodeBox, pointer.x, pointer.y),
            overlapPercent: getOverlapPercent(nodeBox, containerBox),
            depth,
            centerDistance: getDistance(getCenter(containerBox), getCenter(nodeBox)),
          },
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);

    entries.sort((a, b) => sortFn(a, b, ctx));

    return entries.map((e) => e.node);
  };

  const builder: ISensorBuilder = {
    container(fn) {
      config.container = fn;
      return builder;
    },

    containerBox(fn) {
      config.containerBox = fn;
      return builder;
    },

    elements(fn) {
      config.elements = fn;
      return builder;
    },

    zones(fn) {
      config.zones = fn;
      return builder;
    },

    filterElements(fn) {
      config.filterElements = fn;
      return builder;
    },

    filterZones(fn) {
      config.filterZones = fn;
      return builder;
    },

    collision(fn) {
      config.collision = fn;
      return builder;
    },

    sortElements(fn) {
      config.sortElements = fn;
      return builder;
    },

    sortZones(fn) {
      config.sortZones = fn;
      return builder;
    },

    build(): CollisionDetectionFn {
      const cfg = config as ISensorConfig;
      if (!cfg.container || !cfg.elements || !cfg.zones || !cfg.collision) {
        throw new Error('sensor: container, elements, zones, collision are required');
      }

      return (provider: IDnDProviderInternal) => {
        const containerEl = cfg.container(provider);
        if (!containerEl) return { elements: [], zones: [] };

        const containerBox = cfg.containerBox
          ? cfg.containerBox(provider)
          : getBoundingBox(containerEl);
        const pointer = provider.pointer.value?.current ?? { x: 0, y: 0 };

        return {
          elements: run(
            provider,
            containerBox,
            pointer,
            cfg.elements(provider),
            cfg.filterElements,
            cfg.sortElements,
            cfg.collision
          ),
          zones: run(
            provider,
            containerBox,
            pointer,
            cfg.zones(provider),
            cfg.filterZones,
            cfg.sortZones,
            cfg.collision
          ),
        };
      };
    },
  };

  return builder;
};

export interface ISensorBuilder {
  container(fn: TContainerFn): ISensorBuilder;
  containerBox(fn: TContainerBoxFn): ISensorBuilder;
  elements(fn: TCandidatesFn): ISensorBuilder;
  zones(fn: TCandidatesFn): ISensorBuilder;
  filterElements(fn: TFilterFn): ISensorBuilder;
  filterZones(fn: TFilterFn): ISensorBuilder;
  collision(fn: TCollisionCheckFn): ISensorBuilder;
  sortElements(fn: TSortCompareFn): ISensorBuilder;
  sortZones(fn: TSortCompareFn): ISensorBuilder;
  build(): CollisionDetectionFn;
}

export const createSensor = () => createBuilder();
