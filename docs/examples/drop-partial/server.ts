export interface Person {
  id: string;
  name: string;
  hue: number;
}

export const CAPACITY = 5;

/**
 * The booking server: how many seats are left for the people being added. Others book
 * the workshop too, so the count is only known when asked: sometimes a seat has just gone.
 */
export const seatsLeft = (booked: number): Promise<{ free: number; takenElsewhere: number }> =>
  new Promise((resolve) =>
    setTimeout(() => {
      const takenElsewhere = Math.min(Math.random() < 0.5 ? 1 : 0, CAPACITY - booked);
      resolve({ free: CAPACITY - booked - takenElsewhere, takenElsewhere });
    }, 700),
  );
