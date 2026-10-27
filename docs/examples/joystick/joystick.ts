import { shallowRef } from 'vue';
import { defineSensor, type Coordinates, type SensorContext, type SensorDrag } from '@vue-dnd-kit/core';

/**
 * An on-screen gamepad as a sensor. It moves a cursor over `stage`; holding A picks up what
 * is under the cursor, the pad then drags it, A drops and B cancels. The sensor only says
 * "drag this from here", where it moved, drop or cancel: the provider does the rest.
 */
export function createJoystick(stage: () => HTMLElement | null) {
  /** In the stage's coordinates: the cursor scrolls with the page. */
  const cursor = shallowRef<Coordinates>({ x: 0, y: 0 });
  let context: SensorContext | null = null;
  let drag: SensorDrag | null = null;

  const sensor = defineSensor({
    name: 'joystick',
    // Once per provider, in the browser. The cleanup runs when the provider unmounts.
    setup(ctx) {
      context = ctx;
      return () => {
        context = null;
        drag = null;
      };
    },
  });

  /** The cursor in viewport coordinates: what the provider takes. */
  const point = (): Coordinates => {
    const box = stage()?.getBoundingClientRect();
    return { x: (box?.left ?? 0) + cursor.value.x, y: (box?.top ?? 0) + cursor.value.y };
  };

  /** Puts the cursor on the middle of an element. */
  const aim = (element: Element) => {
    const box = element.getBoundingClientRect();
    const origin = stage()?.getBoundingClientRect() ?? { left: 0, top: 0 };
    cursor.value = { x: box.left + box.width / 2 - origin.left, y: box.top + box.height / 2 - origin.top };
  };

  /** The pad: the cursor moves, and the drag with it (one position per frame). */
  const move = (dx: number, dy: number) => {
    const box = stage()?.getBoundingClientRect();
    if (!box) return;
    cursor.value = {
      x: Math.min(Math.max(cursor.value.x + dx, 0), box.width),
      y: Math.min(Math.max(cursor.value.y + dy, 0), box.height),
    };
    drag?.move(point());
  };

  /** A goes down: drops a running drag, or starts a hold over what is under the cursor. */
  const press = () => {
    if (drag?.state === 'dragging') return void drag.drop();
    const at = point();
    const target = document.elementFromPoint(at.x, at.y);
    if (!target || !context) return;
    drag = context.activate({
      target, // checked like a real press: a draggable of this provider, not disabled
      point: at,
      type: 'pointer', // follows points: lists sort under it, containers auto-scroll
      activation: { delay: 300 }, // `useDnD().activation.progress` runs meanwhile
      onEnd: (ended) => {
        if (drag === ended) drag = null;
      },
    }); // null: nothing to drag there
  };

  /** A goes up before the hold is over: no drag. */
  const release = () => {
    if (drag?.state === 'pending') drag.cancel();
  };

  const cancel = () => drag?.cancel();

  return { sensor, cursor, aim, move, press, release, cancel };
}

export type Joystick = ReturnType<typeof createJoystick>;
