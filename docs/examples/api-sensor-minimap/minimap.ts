import { shallowRef } from 'vue';
import { defineSensor, type Coordinates, type Key, type SensorContext, type SensorDrag } from '@vue-dnd-kit/core';

/**
 * A sensor that drags the pieces of a board from its minimap: a press on a piece's dot
 * picks the piece up, moves on the minimap move it on the board, the release drops it.
 * The sensor only says "drag this from here", where it moved and "drop": the provider
 * does the rest (the overlay, targets, the drop). `log` keeps what happened, newest first.
 */
export function createMinimapSensor(board: () => HTMLElement | null, scale: number) {
  const log = shallowRef<string[]>([]);
  /** The pointer on the minimap while it drags (minimap coordinates). */
  const cursor = shallowRef<Coordinates | null>(null);
  let context: SensorContext | null = null;
  let drag: SensorDrag | null = null;
  let moves = 0;

  const write = (line: string) => (log.value = [line, ...log.value].slice(0, 5));

  const sensor = defineSensor({
    name: 'minimap',
    // Once per provider, in the browser: keep the context to start drags with.
    setup(ctx) {
      context = ctx;
      write('setup(context)');
      return () => {
        context = null;
        drag = null;
      };
    },
  });

  /** A point of the minimap, on the board, in viewport coordinates: what the provider takes. */
  const toBoard = ({ x, y }: Coordinates): Coordinates => {
    const box = board()?.getBoundingClientRect();
    return { x: (box?.left ?? 0) + x / scale, y: (box?.top ?? 0) + y / scale };
  };

  /** A press on a piece's dot. Returns whether a drag is on its way. */
  const press = (id: Key, at: Coordinates) => {
    if (!context) return false;
    moves = 0;
    drag = context.activate({
      target: id, // an id: the piece is dragged wherever the input is
      point: toBoard(at),
      activation: { distance: 3 }, // a click on a dot isn't a drag
      onStart: (started) => write(`onStart(drag) · state: '${started.state}'`),
      onEnd: (ended) => {
        write(`onEnd(drag) · state: '${ended.state}', started: ${ended.started}`);
        if (drag === ended) drag = null;
        cursor.value = null;
      },
    });
    write(`activate({ target: '${id}' }) → ${drag ? `state: '${drag.state}'` : 'null'}`);
    if (drag) cursor.value = at;
    return !!drag;
  };

  const move = (at: Coordinates) => {
    if (!drag) return;
    cursor.value = at;
    drag.move(toBoard(at));
    if (drag.state !== 'dragging') return;
    // One line for all the moves.
    const line = `move(point) ×${++moves}`;
    log.value = log.value[0]?.startsWith('move') ? [line, ...log.value.slice(1)] : [line, ...log.value].slice(0, 5);
  };

  const release = () => {
    const current = drag;
    if (!current) return;
    // Resolves once the drag has ended and landed: false when nothing was dropped.
    void current.drop().then((dropped) => write(`drop() → ${dropped}`));
  };

  const cancel = () => drag?.cancel();

  return { sensor, log, cursor, press, move, release, cancel };
}
