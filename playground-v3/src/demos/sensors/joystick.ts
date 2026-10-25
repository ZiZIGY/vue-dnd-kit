import { shallowRef } from 'vue';
import { defineSensor, type Coordinates, type SensorContext, type SensorDrag } from '@vue-dnd-kit/core';

/** Pixels per press of an arrow: half a row of the demo's list. */
export const JOYSTICK_STEP = 24;
/** How long "A" is held before the item under the cursor is picked up. */
export const GRAB_DELAY = 300;

/**
 * An on-screen joystick as a custom sensor. The pad moves a cursor; holding "A" picks up
 * the item under it (an activation delay, like a long press), the arrows then drag it,
 * "A" drops and "B" cancels.
 *
 * The sensor only tells the provider "drag what is under the cursor", where the cursor
 * went, drop or cancel. The provider does the rest: it refuses disabled items and buttons
 * inside items, runs the hold with its progress, sorts lists under the cursor (a pointer
 * drag), auto-scrolls, announces, and cancels on Escape.
 */
export function createJoystick() {
  const cursor = shallowRef<Coordinates>({ x: 0, y: 0 });
  let context: SensorContext | null = null;
  /** The joystick's drag, while it waits for the hold or runs. */
  let drag: SensorDrag | null = null;

  const sensor = defineSensor({
    name: 'joystick',
    setup(ctx) {
      context = ctx;
      return () => {
        context = null;
        drag = null;
      };
    },
  });

  /** Puts the cursor on the center of `element`. */
  const aim = (element: Element) => {
    const rect = element.getBoundingClientRect();
    cursor.value = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const move = (dx: number, dy: number) => {
    cursor.value = { x: cursor.value.x + dx * JOYSTICK_STEP, y: cursor.value.y + dy * JOYSTICK_STEP };
    drag?.move(cursor.value);
  };

  /** "A" goes down: drops a running drag, else starts holding over what is under the cursor. */
  const press = (event: PointerEvent) => {
    if (drag?.state === 'dragging') {
      void drag.drop();
      return;
    }
    const target = document.elementFromPoint(cursor.value.x, cursor.value.y);
    if (!target || !context) return;
    drag = context.activate({
      target,
      point: cursor.value,
      // On a phone the press is a touch: the drag vibrates when the hold is over (`haptics`).
      event,
      activation: { delay: GRAB_DELAY },
      onEnd: (ended) => {
        if (drag === ended) drag = null;
      },
    });
  };

  /** "A" goes up before the hold is over: no drag. */
  const release = () => {
    if (drag?.state === 'pending') drag.cancel();
  };

  const cancel = () => drag?.cancel();

  return { sensor, cursor, aim, move, press, release, cancel };
}

export type Joystick = ReturnType<typeof createJoystick>;
