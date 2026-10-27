export interface Member {
  id: string;
  name: string;
  kind: 'team' | 'person';
  /** People only. */
  role?: string;
  /** Can't move, and takes no one in. */
  locked?: boolean;
  /** A team's members: the tree's children live here, not in `children`. */
  members?: Member[];
}

const person = (id: string, name: string, role: string, locked?: boolean): Member => ({
  id,
  name,
  role,
  kind: 'person',
  locked,
});

export const createOrg = (): Member[] => [
  {
    id: 'leadership',
    name: 'Leadership',
    kind: 'team',
    locked: true,
    members: [person('ada', 'Ada Park', 'CEO', true), person('raj', 'Raj Mehta', 'CTO', true)],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    kind: 'team',
    members: [
      person('mia', 'Mia Chen', 'Engineering manager'),
      {
        id: 'web',
        name: 'Web',
        kind: 'team',
        members: [person('lena', 'Lena Ortiz', 'Frontend'), person('tom', 'Tom Hughes', 'Backend')],
      },
    ],
  },
  {
    id: 'design',
    name: 'Design',
    kind: 'team',
    members: [person('sam', 'Sam Okafor', 'Product designer')],
  },
  person('noor', 'Noor Haddad', 'New hire'),
];

/** People in a member's subtree: a team's headcount. */
export const headcount = (member: Member): number =>
  member.kind === 'person' ? 1 : (member.members ?? []).reduce((sum, child) => sum + headcount(child), 0);
