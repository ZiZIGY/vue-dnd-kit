import { IDnDStore } from '../types';
export declare class DnDOperations {
    static remove: (source?: any[], index?: number) => any;
    static insert: (target?: any[], index?: number, item?: any) => void;
    static move: (source?: any[], sourceIndex?: number, target?: any[], targetIndex?: number) => void;
    static swap: (source?: any[], sourceIndex?: number, target?: any[], targetIndex?: number) => void;
    static copy: (source?: any[], index?: number, target?: any[], targetIndex?: number) => void;
    static applyTransfer: (store: IDnDStore) => void;
    static applyCopy: (store: IDnDStore) => void;
    static applySwap: (store: IDnDStore) => void;
    static applyRemove: (store: IDnDStore) => void;
    static applyInsert: (store: IDnDStore, items: any[]) => void;
}
