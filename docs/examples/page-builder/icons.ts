/**
 * The icons of the editor and of the site it builds: SVG path data on a 24×24 grid, drawn
 * with a round stroke (Icon.vue). Rectangles and circles are written as paths too.
 */

const square = 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z';
const circle = 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0';
/** A dot of the grip: a circle of radius 1, filled by the stroke around it. */
const dot = (x: number, y: number) => `M${x - 1} ${y}a1 1 0 1 0 2 0a1 1 0 1 0-2 0`;

export const ICONS = {
  // The editor
  plus: ['M5 12h14', 'M12 5v14'],
  layers: ['m12 2 10 5-10 5L2 7z', 'm2 12 10 5 10-5', 'm2 17 10 5 10-5'],
  desktop: ['M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M8 21h8', 'M12 17v4'],
  tablet: ['M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z', 'M11 18h2'],
  mobile: ['M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z', 'M11 18h2'],
  undo: ['M9 14 4 9l5-5', 'M4 9h10.5a5.5 5.5 0 0 1 0 11H11'],
  redo: ['m15 14 5-5-5-5', 'M20 9H9.5a5.5 5.5 0 0 0 0 11H13'],
  grip: [dot(9, 6), dot(9, 12), dot(9, 18), dot(15, 6), dot(15, 12), dot(15, 18)],
  up: ['m5 12 7-7 7 7', 'M12 19V5'],
  down: ['M12 5v14', 'm19 12-7 7-7-7'],
  copy: ['M11 9h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'],
  trash: ['M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
  chevron: ['m9 18 6-6-6-6'],
  close: ['M18 6 6 18', 'm6 6 12 12'],
  check: ['M20 6 9 17l-5-5'],
  column: [square, 'M12 3v18'],

  // Sections
  navbar: [square, 'M3 9h18'],
  hero: [square, 'M7 9h10', 'M9 13h6', 'M10 17h4'],
  logos: [
    'M8.3 10a.7.7 0 0 1-.6-1.1L11.4 3a.7.7 0 0 1 1.2 0l3.7 5.9a.7.7 0 0 1-.6 1.1z',
    'M4 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z',
    'M14 17.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0',
  ],
  features: [
    'M4 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z',
    'M15 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z',
    'M4 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z',
    'M15 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1z',
  ],
  pricing: ['M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', 'M2 10h20'],
  testimonials: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', 'M8 9h8', 'M8 13h5'],
  faq: [circle, 'M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3', 'M12 17h.01'],
  cta: ['m3 11 18-5v12L3 14z', 'M11.6 16.8a3 3 0 1 1-5.8-1.6'],
  footer: [square, 'M3 15h18'],

  // Blocks
  logo: ['M12 2l8.5 5v10L12 22l-8.5-5V7z'],
  links: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  badge: ['M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z', 'M7.5 7.5h.01'],
  heading: ['M6 12h12', 'M6 20V4', 'M18 20V4'],
  text: ['M4 6h16', 'M4 12h16', 'M4 18h10'],
  button: ['M8 7h8a5 5 0 0 1 0 10H8a5 5 0 0 1 0-10z', 'M9 12h6'],
  image: [square, 'M7 9a2 2 0 1 0 4 0a2 2 0 1 0-4 0', 'm21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21'],
  list: ['m3 7 2 2 4-4', 'm3 17 2 2 4-4', 'M13 6h8', 'M13 12h8', 'M13 18h8'],
  quote: ['M6 7h4v4c0 3-1.5 5-4 6', 'M14 7h4v4c0 3-1.5 5-4 6'],
  price: ['M12 2v20', 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'],
  icon: ['M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z'],

  // The site's feature icons
  zap: ['M13 2 3 14h9l-1 8 10-12h-9z'],
  chart: ['M3 3v18h18', 'M7 16v-3', 'M12 16V8', 'M17 16v-6'],
  lock: ['M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z', 'M7 11V7a5 5 0 0 1 10 0v4'],
  globe: [circle, 'M2 12h20', 'M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20'],
} satisfies Record<string, string[]>;

export type IconName = keyof typeof ICONS;
