export interface DeskFile {
  id: string;
  name: string;
  type: 'image' | 'text' | 'audio';
  icon: string;
}

export const FILES: DeskFile[] = [
  { id: 'photo', name: 'beach.png', type: 'image', icon: '🏖️' },
  { id: 'notes', name: 'notes.md', type: 'text', icon: '📝' },
  { id: 'song', name: 'demo.mp3', type: 'audio', icon: '🎵' },
  { id: 'logo', name: 'logo.svg', type: 'image', icon: '🎨' },
];
