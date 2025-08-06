export interface ClassroomInfo {
  classroom_id: string;
  name: string;
  max_participants: number;
}

export interface Participant {
  userId: string;
  username: string;
  isManager: boolean;
}

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

export interface Quest { //이 인터페이스는 다른 곳으로 옮겨야함 더미데이터 파일 삭제할 예정
  quest_id: string;
  quest_description: string;
  quest_difficulty: number;
  quest_type: string;
  solve_status: number;
}

export const ClassroomInfo: ClassroomInfo = {
  classroom_id: '12345',
  name: 'JavaScript 기초 수업',
  max_participants: 20,
};

export const Participants: Participant[] = [
  { userId: '1', username: '김학생', isManager: true },
  { userId: '2', username: '이학생', isManager: false },
  { userId: '3', username: '박학생', isManager: false },
  { userId: '4', username: '최학생', isManager: false },
];
