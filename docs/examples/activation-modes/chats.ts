export interface Chat {
  id: string;
  name: string;
  text: string;
  time: string;
  hue: number;
}

export const CHATS: Chat[] = [
  { id: 'mia', name: 'Mia', text: 'The deck is ready, have a look?', time: '9:41', hue: 168 },
  { id: 'design', name: 'Design team', text: 'Leo: new icons are in Figma', time: '9:12', hue: 280 },
  { id: 'noah', name: 'Noah', text: 'Lunch at one?', time: '8:55', hue: 24 },
  { id: 'ops', name: 'On-call', text: 'All checks green again', time: 'Mon', hue: 200 },
  { id: 'ava', name: 'Ava', text: 'Sent you the photos from Sunday', time: 'Sun', hue: 330 },
];
