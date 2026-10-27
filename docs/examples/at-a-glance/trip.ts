export interface Stop {
  id: string;
  time: string;
  title: string;
  tone: string;
}

export interface Day {
  id: string;
  title: string;
  stops: Stop[];
}

const FOOD = '#f59e0b';
const SIGHT = '#3b82f6';
const WALK = '#42b883';

export const DAYS: Day[] = [
  {
    id: 'ideas',
    title: 'Ideas',
    stops: [
      { id: 'market', time: '—', title: 'Flea market', tone: SIGHT },
      { id: 'ramen', time: '—', title: 'Late ramen', tone: FOOD },
      { id: 'river', time: '—', title: 'River walk', tone: WALK },
    ],
  },
  {
    id: 'sat',
    title: 'Saturday',
    stops: [
      { id: 'coffee', time: '09:00', title: 'Coffee at Mo’s', tone: FOOD },
      { id: 'museum', time: '11:00', title: 'Design museum', tone: SIGHT },
      { id: 'park', time: '15:00', title: 'Botanic park', tone: WALK },
    ],
  },
  {
    id: 'sun',
    title: 'Sunday',
    stops: [
      { id: 'brunch', time: '10:30', title: 'Brunch', tone: FOOD },
      { id: 'tower', time: '13:00', title: 'Old tower', tone: SIGHT },
    ],
  },
];

let copies = 0;
/** A copy (Alt-drag) is a new stop: same plan, its own id. */
export const copyStop = (stop: Stop): Stop => ({ ...stop, id: `${stop.id}-copy-${++copies}` });
