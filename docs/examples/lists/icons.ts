/** App icons: a gradient and a line drawing (SVG paths on a 24×24 grid). */
export const icons: Record<string, { colors: [string, string]; paths: string[] }> = {
  mail: {
    colors: ['#6aaeff', '#2563eb'],
    paths: ['M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', 'm3.5 7 8.5 6 8.5-6'],
  },
  notes: {
    colors: ['#fde68a', '#f59e0b'],
    paths: ['M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M9 8h6M9 12h6M9 16h3'],
  },
  music: {
    colors: ['#fb7185', '#e11d48'],
    paths: ['M9 18V5l11-2v13', 'M3 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0', 'M14 16a3 3 0 1 0 6 0a3 3 0 1 0-6 0'],
  },
  maps: {
    colors: ['#86efac', '#16a34a'],
    paths: ['M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z', 'M9.5 10a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0'],
  },
  photos: {
    colors: ['#f0abfc', '#a855f7'],
    paths: [
      'M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
      'M7 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
      'm21 15-5-5-11 10',
    ],
  },
  clock: {
    colors: ['#a1a1aa', '#3f3f46'],
    paths: ['M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0', 'M12 7v5l3 2'],
  },
  files: {
    colors: ['#7dd3fc', '#0284c7'],
    paths: ['M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'],
  },
  chat: {
    colors: ['#6ee7b7', '#2f9e6e'],
    paths: ['M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'],
  },
  camera: {
    colors: ['#71717a', '#18181b'],
    paths: [
      'M5 7h2l2-3h6l2 3h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z',
      'M8.5 13.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0',
    ],
  },
  calendar: {
    colors: ['#fca5a5', '#dc2626'],
    paths: ['M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', 'M3 10h18M8 3v4M16 3v4'],
  },
  weather: {
    colors: ['#fdba74', '#ea580c'],
    paths: [
      'M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0',
      'M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    ],
  },
  settings: {
    colors: ['#a5b4fc', '#4f46e5'],
    paths: ['M4 7h9M17 7h3M4 17h3M11 17h9', 'M13 7a2 2 0 1 0 4 0a2 2 0 1 0-4 0', 'M7 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0'],
  },
};
