export interface Participant {
  userId: string;
  username: string;
  isManager: boolean;
}

export const Participants: Participant[] = [
  { userId: '1', username: '김학생', isManager: true },
  { userId: '2', username: '이학생', isManager: false },
  { userId: '3', username: '박학생', isManager: false },
  { userId: '4', username: '최학생', isManager: false },
];
