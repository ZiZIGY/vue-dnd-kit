export interface Link {
  id: string;
  title: string;
  host: string;
  hue: number;
}

export interface Folder {
  id: string;
  title: string;
  links: Link[];
}

export const isFolder = (entry: Link | Folder): entry is Folder => 'links' in entry;
