import { IoRefresh, IoPeopleOutline } from 'react-icons/io5';

// 소켓에서 받는 데이터 구조에 맞춘 타입
interface Participant {
  userName: string;
  isManager: boolean;
}

interface ParticipantListProps {
  participants: Participant[];
}

export default function ParticipantList({ participants}: ParticipantListProps): JSX.Element {
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h6 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IoPeopleOutline size={18} />
          참여자 ({participants.length}명)
        </h6>

        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
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
            console.log('참여자 목록 새로고침');
          }}
        >
          <IoRefresh size={18} />
        </button>
      </div>

      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {participants.map((participant, index) => {
          // userName과 managerName 비교로 관리자 판단
          const isManager = participant.isManager;

          return (
            <div
              key={`${participant.userName}-${index}`} // userName + index로 고유 key 생성
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '8px 0',
                borderBottom: index === participants.length - 1 ? 'none' : '1px solid #f0f0f0'
              }}
            >
              <span style={{ fontWeight: isManager ? 'bold' : 'normal' }}>
                {participant.userName}
                {isManager} 
              </span>
              {isManager && (
                <span
                  style={{
                    backgroundColor: '#ffc107',
                    color: '#212529',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                >
                  관리자
                </span>
              )}
            </div>
          );
        })}
        
        {/* 참가자가 없을 때 표시 */}
        {participants.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            fontStyle: 'italic',
            padding: '20px 0' 
          }}>
            참가자가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}