export interface Notice {
  id: string;
  kind: 'merged' | 'failed' | 'mention' | 'review';
  title: string;
  repo: string;
  time: string;
}

/** An icon (24×24 path) and a colour per kind of notification. */
export const KINDS: Record<Notice['kind'], { icon: string; color: string }> = {
  merged: { icon: 'M6 21V9a9 9 0 0 0 9 9M18 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', color: '#a855f7' },
  failed: { icon: 'M12 4l9 16H3zM12 10v4M12 17v.01', color: '#f43f5e' },
  mention: { icon: 'M16 12a4 4 0 1 1-1.2-2.8M16 9v4a2 2 0 0 0 4 0v-1a8 8 0 1 0-3 6.2', color: '#3b82f6' },
  review: { icon: 'M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', color: '#f59e0b' },
};

export const NOTICES: Notice[] = [
  { id: 'n1', kind: 'failed', title: 'Build failed on main', repo: 'vue-dnd-kit', time: '2m' },
  { id: 'n2', kind: 'review', title: 'Review requested: #212', repo: 'docs', time: '14m' },
  { id: 'n3', kind: 'mention', title: '@you in “Touch drags on iOS”', repo: 'vue-dnd-kit', time: '1h' },
  { id: 'n4', kind: 'merged', title: 'Merged: sortable trees', repo: 'vue-dnd-kit', time: '3h' },
  { id: 'n5', kind: 'merged', title: 'Merged: docs search', repo: 'docs', time: '5h' },
];
