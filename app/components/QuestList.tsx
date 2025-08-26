import { IoListOutline, IoLockClosed } from 'react-icons/io5';

export interface Quest {
  quest_id: string;
  quest_description: string;
  quest_difficulty: number;
  quest_type: string;
  solve_status: number;
}

interface QuestListProps {
  quests: Quest[];
  selectedQuest: Quest | null;
  onQuestSelect: (quest: Quest) => void;
  isManager?: boolean;
}

export default function QuestList({ quests, selectedQuest, onQuestSelect, isManager }: QuestListProps): JSX.Element {
  const handleQuestClick = (quest: Quest) => {
    if (!isManager) {
      alert('개설자만 퀘스트를 선택할 수 있습니다.');
      return;
    }
    onQuestSelect(quest);
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #ddd' }}>
      <h5 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IoListOutline size={20} />
        퀘스트 목록
      </h5>

      {!isManager && (
        <div
          style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            padding: '8px 12px',
            marginBottom: '15px',
            fontSize: '13px',
            color: '#856404',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <IoLockClosed size={16} />
          개설자만 퀘스트를 선택할 수 있습니다
        </div>
      )}

      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {quests.map((quest) => {
          return (
            <button
              key={quest.quest_id}
              style={{
                backgroundColor:
                  selectedQuest?.quest_id === quest.quest_id ? '#e3f2fd' : isManager ? '#f8f9fa' : '#f1f1f1',
                border: selectedQuest?.quest_id === quest.quest_id ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                cursor: isManager ? 'pointer' : 'not-allowed',
                width: '100%',
                textAlign: 'left',
                opacity: isManager ? 1 : 0.6,
                transition: 'all 0.2s ease',
              }}
              onClick={() => {
                handleQuestClick(quest);
              }}
              disabled={!isManager}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h6 style={{ marginBottom: '5px', color: isManager ? '#333' : '#666' }}>{quest.quest_description}</h6>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{quest.quest_description}</p>
                  <small style={{ color: '#888' }}>난이도: {quest.quest_difficulty}</small>
                </div>
                <span
                  style={{
                    padding: '4px auto',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: 'white',
                    backgroundColor:
                      quest.solve_status === 1 ? '#28a745' : quest.solve_status === 2 ? '#ffc107' : '#6c757d',
                    display: 'inline-block',
                    minWidth: '60px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    opacity: isManager ? 1 : 0.7,
                  }}
                >
                  {quest.quest_type}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
