import { IBoundingBox, IPoint } from "../types";

export declare const checkCollision: (boxA: IBoundingBox, boxB: IBoundingBox) => boolean;
export declare const getBoundingBox: (element: HTMLElement | null) => IBoundingBox;
export declare const getCenter: (box: IBoundingBox) => IPoint;
export declare const getOffset: (element: HTMLElement | null, pointer: IPoint) => {
    pixel: {
        x: number;
        y: number;
    };
    percent: {
        x: number;
        y: number;
    };
};
export declare const getDistance: (pointA: IPoint, pointB: IPoint) => number;
export declare const getOverlapPercent: (boxA: IBoundingBox, boxB: IBoundingBox) => number;
