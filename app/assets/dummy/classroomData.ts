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

export interface Quest {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  status: string;
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

export const ChatMessages: ChatMessage[] = [
  { sender: 'System', message: '강의실에 오신 것을 환영합니다!', timestamp: '14:00:00' },
  { sender: '김학생', message: '안녕하세요! 오늘도 열심히 해봅시다.', timestamp: '14:01:15' },
  { sender: '이학생', message: '네, 잘 부탁드립니다!', timestamp: '14:01:30' },
  { sender: 'System', message: '박학생님이 강의실에 참여하셨습니다.', timestamp: '14:02:00' },
];

export const Quests: Quest[] = [
  {
    id: 1,
    title: '변수와 상수',
    description: 'JavaScript에서 변수를 선언하고 사용하는 방법을 학습합니다.',
    difficulty: '초급',
    status: '완료',
  },
  {
    id: 2,
    title: '함수 만들기',
    description: '함수를 정의하고 호출하는 방법을 익힙니다.',
    difficulty: '초급',
    status: '진행중',
  },
  {
    id: 3,
    title: '조건문 활용',
    description: 'if-else 문을 사용하여 조건에 따른 동작을 구현합니다.',
    difficulty: '중급',
    status: '대기중',
  },
  {
    id: 4,
    title: '배열과 반복문',
    description: '배열을 생성하고 반복문을 사용하여 데이터를 처리합니다.',
    difficulty: '중급',
    status: '대기중',
  },
  {
    id: 5,
    title: '객체와 클래스',
    description: '객체 지향 프로그래밍의 기초를 배우고 클래스를 정의합니다.',
    difficulty: '고급',
    status: '대기중',
  },
];
