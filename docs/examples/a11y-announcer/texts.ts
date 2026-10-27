/** What the screen reader says, per language. `n` counts from 1. */
export interface Texts {
  name: string;
  instructions: string;
  start(title: string, n: number, total: number): string;
  move(title: string, n: number, total: number): string;
  drop(title: string, n: number, total: number): string;
  cancel(title: string, n: number): string;
  resume(title: string): string;
}

export const LANGUAGES: Record<string, Texts> = {
  en: {
    name: 'English',
    instructions:
      'To reorder the agenda, press Space on an item. Move it with the arrow keys, press Space again to drop it, or Escape to cancel.',
    start: (title, n, total) => `Picked up ${title}, item ${n} of ${total}.`,
    move: (title, n, total) => `${title} moved to item ${n} of ${total}.`,
    drop: (title, n, total) => `${title} dropped at item ${n} of ${total}.`,
    cancel: (title, n) => `Cancelled. ${title} is back at item ${n}.`,
    resume: (title) => `${title} was not dropped. It is still moving.`,
  },
  de: {
    name: 'Deutsch',
    instructions:
      'Um die Tagesordnung zu ändern, drücke die Leertaste auf einem Punkt. Verschiebe ihn mit den Pfeiltasten, lege ihn mit der Leertaste ab oder brich mit Escape ab.',
    start: (title, n, total) => `${title} aufgenommen, Punkt ${n} von ${total}.`,
    move: (title, n, total) => `${title} verschoben auf Punkt ${n} von ${total}.`,
    drop: (title, n, total) => `${title} abgelegt auf Punkt ${n} von ${total}.`,
    cancel: (title, n) => `Abgebrochen. ${title} ist wieder Punkt ${n}.`,
    resume: (title) => `${title} wurde nicht abgelegt und wird weiter verschoben.`,
  },
  es: {
    name: 'Español',
    instructions:
      'Para reordenar la agenda, pulsa Espacio sobre un punto. Muévelo con las flechas, pulsa Espacio para soltarlo o Escape para cancelar.',
    start: (title, n, total) => `${title} seleccionado, punto ${n} de ${total}.`,
    move: (title, n, total) => `${title} movido al punto ${n} de ${total}.`,
    drop: (title, n, total) => `${title} soltado en el punto ${n} de ${total}.`,
    cancel: (title, n) => `Cancelado. ${title} vuelve al punto ${n}.`,
    resume: (title) => `${title} no se ha soltado. Sigue moviéndose.`,
  },
  fr: {
    name: 'Français',
    instructions:
      'Pour réorganiser l’ordre du jour, appuyez sur Espace sur un point. Déplacez-le avec les flèches, appuyez de nouveau sur Espace pour le déposer, ou sur Échap pour annuler.',
    start: (title, n, total) => `${title} saisi, point ${n} sur ${total}.`,
    move: (title, n, total) => `${title} déplacé au point ${n} sur ${total}.`,
    drop: (title, n, total) => `${title} déposé au point ${n} sur ${total}.`,
    cancel: (title, n) => `Annulé. ${title} revient au point ${n}.`,
    resume: (title) => `${title} n’a pas été déposé. Il est toujours en mouvement.`,
  },
};
