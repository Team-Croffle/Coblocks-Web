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
  isManager?: boolean; // ⭐ isManager prop 추가
}

export default function QuestList({ 
  quests, 
  selectedQuest, 
  onQuestSelect,
  isManager,// ⭐ 기본값 true
}: QuestListProps): JSX.Element {

  // ⭐ 퀘스트 클릭 핸들러
  const handleQuestClick = (quest: Quest) => {
    if (!isManager) {
      alert('개설자만 퀘스트를 선택할 수 있습니다.');
      return;
    }
    onQuestSelect(quest);
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #ddd' }}>
      <h5 style={{ marginBottom: '15px' }}>📋 퀘스트 목록</h5>
      
      {/* ⭐ 권한 안내 메시지 추가 */}
      {!isManager && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '8px 12px',
          marginBottom: '15px',
          fontSize: '13px',
          color: '#856404'
        }}>
          🔒 개설자만 퀘스트를 선택할 수 있습니다
        </div>
      )}

      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {quests.map((quest) => {
          return (
            <button  //퀘스트 목록 버튼
              key={quest.quest_id}
              style={{
                backgroundColor: selectedQuest?.quest_id === quest.quest_id ? '#e3f2fd' : (isManager ? '#f8f9fa' : '#f1f1f1'), // ⭐ 비개설자는 회색
                border: selectedQuest?.quest_id === quest.quest_id ? '2px solid #007bff' : '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                cursor: isManager ? 'pointer' : 'not-allowed', // ⭐ 커서 변경
                width: '100%',
                textAlign: 'left',
                opacity: isManager ? 1 : 0.6, // ⭐ 비개설자는 흐리게
                transition: 'all 0.2s ease',
              }}
              onClick={() => {handleQuestClick(quest)}} // ⭐ 수정된 핸들러 사용
              disabled={!isManager} // ⭐ 비개설자는 비활성화
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h6 style={{ marginBottom: '5px', color: isManager ? '#333' : '#666' }}>{quest.quest_description}</h6> {/* 퀘스트 제목 */}
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>{quest.quest_description}</p> {/* 퀘스트 설명 */}
                  <small style={{ color: '#888' }}>난이도: {quest.quest_difficulty}</small> {/* 난이도 표시 */}
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
                    opacity: isManager ? 1 : 0.7 // ⭐ 비개설자는 흐리게
                  }}
                > {/* 퀘스트 상태 표시 */}
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