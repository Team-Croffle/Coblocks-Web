import { QuestItem } from '../pages/ClassRoomPage';

interface QuestDetailProps {
  selectedQuest: QuestItem | null;
}

export default function QuestDetail({ selectedQuest }: QuestDetailProps): JSX.Element {
  // 난이도 텍스트 변환 함수
  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "쉬움";
      case 2: return "보통";
      case 3: return "어려움";
      case 4: return "매우 어려움";
      default: return "알 수 없음";
    }
  };

  // 상태 텍스트 변환 함수
  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return "비공개";
      case 1: return "공개";
      case 2: return "해결됨";
      default: return "알 수 없음";
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #ddd' }}>
      <h5 style={{ marginBottom: '15px' }}>퀘스트 상세</h5>
      {selectedQuest ? (
        <div>
          <h4>{selectedQuest.quest_description}</h4>
          <p style={{ color: '#666' }}>유형: {selectedQuest.quest_type}</p>
          <div style={{ marginBottom: '15px' }}>
            <strong>난이도:</strong>
            <span
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                marginLeft: '8px',
                fontSize: '12px',
              }}
            >
              {getDifficultyText(selectedQuest.quest_difficulty)}
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
                backgroundColor:
                  selectedQuest.solve_status === 2
                    ? '#28a745'
                    : selectedQuest.solve_status === 1
                      ? '#ffc107'
                      : '#6c757d',
              }}
            >
              {getStatusText(selectedQuest.solve_status)}
            </span>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>퀘스트 ID:</strong>
            <span style={{ marginLeft: '8px', color: '#666', fontSize: '12px' }}>
              {selectedQuest.quest_id}
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
                cursor: 'pointer',
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
                cursor: 'pointer',
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
  );
}