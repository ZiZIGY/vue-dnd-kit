export interface ICoordinates {
  x: number;
  y: number;
}

export type TPointerState = {
  start: ICoordinates;
  current: ICoordinates;
  offset: ICoordinates;
} | undefined | null
