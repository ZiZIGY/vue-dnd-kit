export type Message = {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  time: string;
  folder: string;
  hue: number;
};

export type Folder = { id: string; name: string; icon: 'inbox' | 'archive' | 'later' | 'receipts' };

export const FOLDERS: Folder[] = [
  { id: 'inbox', name: 'Inbox', icon: 'inbox' },
  { id: 'archive', name: 'Archive', icon: 'archive' },
  { id: 'later', name: 'Later', icon: 'later' },
  { id: 'receipts', name: 'Receipts', icon: 'receipts' },
];

export const MESSAGES: Message[] = [
  { id: 'm1', from: 'Maya Chen', subject: 'Q3 roadmap review', snippet: 'Here are the slides for Thursday…', time: '9:41', folder: 'inbox', hue: 160 },
  { id: 'm2', from: 'Stripe', subject: 'Your receipt from Acme Cloud', snippet: 'Amount paid $49.00 · Invoice #2041', time: '8:12', folder: 'inbox', hue: 250 },
  { id: 'm3', from: 'Leo Martins', subject: 'Design crit notes', snippet: 'Two things stood out in the onboarding…', time: 'Tue', folder: 'inbox', hue: 25 },
  { id: 'm4', from: 'GitHub', subject: '[vue-dnd-kit] New release v3.0.0', snippet: 'Drop targets can now shape the overlay…', time: 'Tue', folder: 'inbox', hue: 210 },
  { id: 'm5', from: 'Ana Ruiz', subject: 'Offsite in Lisbon 🌊', snippet: 'Flights are booked, hotel options inside', time: 'Mon', folder: 'inbox', hue: 330 },
];
