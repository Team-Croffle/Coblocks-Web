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
      <h6 style={{ marginBottom: '10px' }}>👥 참여자 ({participants.length}명)</h6>
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
