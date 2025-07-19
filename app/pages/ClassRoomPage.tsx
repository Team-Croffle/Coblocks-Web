import { useState } from 'react';

// 타입 정의
interface ClassroomInfo {
  classroom_id: string;
  name: string;
  max_participants: number;
}

interface Participant {
  userId: string;
  username: string;
  isManager: boolean;
}

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

interface Quest {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  status: string;
}

export default function ClassRoom_Page(): JSX.Element {
  const [chatMessage, setChatMessage] = useState<string>('');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  // 더미 데이터
  const mockClassroomInfo: ClassroomInfo = {
    classroom_id: '12345',
    name: 'JavaScript 기초 수업',
    max_participants: 20,
  };

  const mockParticipants: Participant[] = [
    { userId: '1', username: '김학생', isManager: true },
    { userId: '2', username: '이학생', isManager: false },
    { userId: '3', username: '박학생', isManager: false },
    { userId: '4', username: '최학생', isManager: false },
  ];

  const mockChatMessages: ChatMessage[] = [
    { sender: 'System', message: '강의실에 오신 것을 환영합니다!', timestamp: '14:00:00' },
    { sender: '김학생', message: '안녕하세요! 오늘도 열심히 해봅시다.', timestamp: '14:01:15' },
    { sender: '이학생', message: '네, 잘 부탁드립니다!', timestamp: '14:01:30' },
    { sender: 'System', message: '박학생님이 강의실에 참여하셨습니다.', timestamp: '14:02:00' },
  ];

  const mockQuests: Quest[] = [
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
  ];

  const handleSendMessage = (): void => {
    if (chatMessage.trim()) {
      console.log('메시지 전송:', chatMessage);
      setChatMessage('');
    }
  };

  const handleQuestSelect = (quest: Quest): void => {
    setSelectedQuest(quest);
    console.log('퀘스트 선택:', quest);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' }}>
      {/* 헤더 */}
      <div style={{ backgroundColor: '#007bff', color: 'white', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>📚 {mockClassroomInfo.name}</h2>
            <p style={{ margin: 0 }}>강의실 ID: {mockClassroomInfo.classroom_id}</p>
          </div>
          <button style={{ backgroundColor: 'white', color: '#007bff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
            🔄 새로고침
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '20px' }}>
        {/* 왼쪽: 퀘스트 목록 */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #ddd' }}>
          <h5 style={{ marginBottom: '15px' }}>📋 퀘스트 목록</h5>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {mockQuests.map((quest) => {
              return (
                <button
                  key={quest.id}
                  style={{ 
                    backgroundColor: selectedQuest?.id === quest.id ? '#e3f2fd' : '#f8f9fa',
                    border: selectedQuest?.id === quest.id ? '2px solid #007bff' : '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '15px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                  onClick={() => {
                    return handleQuestSelect(quest);
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h6 style={{ marginBottom: '5px' }}>{quest.title}</h6>
                      <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{quest.description}</p>
                      <small style={{ color: '#888' }}>난이도: {quest.difficulty}</small>
                    </div>
                    <span 
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: 'white',
                        backgroundColor: quest.status === '완료' ? '#28a745' : quest.status === '진행중' ? '#ffc107' : '#6c757d'
                      }}
                    >
                      {quest.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 중앙: 선택된 퀘스트 상세 */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #ddd' }}>
          <h5 style={{ marginBottom: '15px' }}>퀘스트 상세</h5>
          {selectedQuest ? (
            <div>
              <h4>{selectedQuest.title}</h4>
              <p style={{ color: '#666' }}>{selectedQuest.description}</p>
              <div style={{ marginBottom: '15px' }}>
                <strong>난이도:</strong> 
                <span style={{ backgroundColor: '#17a2b8', color: 'white', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px', fontSize: '12px' }}>
                  {selectedQuest.difficulty}
                </span>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <strong>상태:</strong>
                <span 
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: 'white',
                    marginLeft: '8px',
                    backgroundColor: selectedQuest.status === '완료' ? '#28a745' : selectedQuest.status === '진행중' ? '#ffc107' : '#6c757d'
                  }}
                >
                  {selectedQuest.status}
                </span>
              </div>
              <hr />
              <div style={{ display: 'grid', gap: '10px' }}>
                <button 
                  style={{ 
                    backgroundColor: '#007bff', 
                    color: 'white', 
                    border: 'none', 
                    padding: '12px 24px', 
                    borderRadius: '4px', 
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  워크스페이스로 이동
                </button>
                <button 
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: '#6c757d', 
                    border: '1px solid #6c757d', 
                    padding: '12px 24px', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  퀘스트 정보 보기
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#666', padding: '50px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📋</div>
              <p>퀘스트를 선택하세요</p>
            </div>
          )}
        </div>

        {/* 오른쪽: 참여자 목록 및 채팅 */}
        <div>
          {/* 참여자 목록 */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', border: '1px solid #ddd', marginBottom: '15px' }}>
            <h6 style={{ marginBottom: '10px' }}>👥 참여자 ({mockParticipants.length}명)</h6>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {mockParticipants.map((participant) => {
                return (
                  <div
                    key={participant.userId}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}
                  >
                    <span>{participant.username}</span>
                    {participant.isManager && (
                      <span style={{ backgroundColor: '#ffc107', color: '#212529', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                        관리자
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 채팅 */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', border: '1px solid #ddd' }}>
            <h6 style={{ marginBottom: '10px' }}>💬 채팅</h6>
            {/* 채팅 메시지 목록 */}
            <div style={{ height: '300px', overflowY: 'auto', marginBottom: '15px', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
              {mockChatMessages.map((msg, index) => {
                return (
                  <div
                    key={index}
                    style={{ marginBottom: '10px' }}
                  >
                    <small style={{ color: '#666' }}>{msg.timestamp}</small>
                    <div style={{ color: msg.sender === 'System' ? '#17a2b8' : 'inherit' }}>
                      <strong>{msg.sender}:</strong> {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 채팅 입력 */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type='text'
                placeholder='메시지를 입력하세요...'
                value={chatMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  return setChatMessage(e.target.value);
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    return handleSendMessage();
                  }
                }}
                style={{ 
                  flex: 1, 
                  padding: '8px 12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{ 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✈️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}