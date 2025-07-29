import { Quest } from '../assets/dummy/classroomData';

interface QuestListProps {
  quests: Quest[];
  selectedQuest: Quest | null;
  onQuestSelect: (quest: Quest) => void;
}

export default function QuestList({ quests, selectedQuest, onQuestSelect }: QuestListProps): JSX.Element {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #ddd' }}>
      <h5 style={{ marginBottom: '15px' }}>📋 퀘스트 목록</h5>
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {quests.map((quest) => {
          return (
            <button  //퀘스트 목록 버튼
              key={quest.id}
              style={{
                backgroundColor: selectedQuest?.id === quest.id ? '#e3f2fd' : '#f8f9fa',
                border: selectedQuest?.id === quest.id ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
              }}
              onClick={() => {
                return onQuestSelect(quest);
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h6 style={{ marginBottom: '5px' }}>{quest.title}</h6> {/* 퀘스트 제목 */}
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{quest.description}</p> {/* 퀘스트 설명 */}
                  <small style={{ color: '#888' }}>난이도: {quest.difficulty}</small> {/* 난이도 표시 */}
                </div>
                <span
                  style={{
                    padding: '4px auto',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: 'white',
                    backgroundColor:
                      quest.status === '완료' ? '#28a745' : quest.status === '진행중' ? '#ffc107' : '#6c757d',
                    display: 'inline-block',
                    minWidth: '60px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                > {/* 퀘스트 상태 표시 */}
                  {quest.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
