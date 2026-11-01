export interface Candidate {
  id: string;
  name: string;
  role: string;
  hue: number;
  /** The interviewers' score, out of 5. */
  score: number;
}
