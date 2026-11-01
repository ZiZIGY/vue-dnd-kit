export interface Attachment {
  id: string;
  name: string;
  /** In megabytes. */
  size: number;
}

/** The largest attachment both places take, in megabytes. */
export const LIMIT = 10;

export const fits = (files: Attachment[]) => files.every((file) => file.size <= LIMIT);
