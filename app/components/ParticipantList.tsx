import { Participant } from '../assets/dummy/classroomData';

interface ParticipantListProps {
  participants: Participant[];
}

export default function ParticipantList({ participants }: ParticipantListProps): JSX.Element {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '15px',
        border: '1px solid #ddd',
        marginBottom: '15px',
      }}
    >
      {/* 헤더 부분 - 새로고침 버튼 추가 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h6 style={{ margin: 0 }}>👥 참여자 ({participants.length}명)</h6>
        
        {/* ⭐ 새로고침 버튼 */}
        <button
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            e.currentTarget.style.transform = 'rotate(180deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
          onClick={() => {
            // 새로고침 로직
            console.log('참여자 목록 새로고침');
          }}
        >
          🔄
        </button>
      </div>
      
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {participants.map((participant) => {
          return (
            <div
              key={participant.userId}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}
            >
              <span>{participant.username}</span>
              {participant.isManager && (
                <span
                  style={{
                    backgroundColor: '#ffc107',
                    color: '#212529',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}
                >
                  관리자
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}