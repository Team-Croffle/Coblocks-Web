import { Quest } from '../assets/dummy/classroomData';

interface QuestDetailProps {
  selectedQuest: Quest | null;
}

export default function QuestDetail({ selectedQuest }: QuestDetailProps): JSX.Element {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #ddd' }}>
      <h5 style={{ marginBottom: '15px' }}>퀘스트 상세</h5>
      {selectedQuest ? (
        <div>
          <h4>{selectedQuest.title}</h4>
          <p style={{ color: '#666' }}>{selectedQuest.description}</p>
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
                backgroundColor:
                  selectedQuest.status === '완료'
                    ? '#28a745'
                    : selectedQuest.status === '진행중'
                      ? '#ffc107'
                      : '#6c757d',
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
