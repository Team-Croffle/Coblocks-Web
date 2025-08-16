import { useState } from 'react';
import QuestList, { Quest } from '~/components/QuestList';
import QuestDetail from '~/components/QuestDetail';
import ParticipantList from '~/components/ParticipantList';
import { Participants } from '../assets/dummy/classroomData';

interface ClassroomPageProps {
  questList: Quest[]; // 라우트에서 받아온 데이터
}

export default function ClassroomPage({ questList }: ClassroomPageProps): JSX.Element {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const classroomId = '12345';

  const handleQuestSelect = (quest: Quest): void => {
    setSelectedQuest(quest);
    console.log('퀘스트 선택:', quest);
  };

  const handleRefresh = (): void => {
    window.location.reload();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' }}>
      {/* 헤더 */}
      <div
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>📚 강의실</h2>
            <p style={{ margin: 0 }}>강의실 ID: {classroomId}</p>
          </div>
          <button
            onClick={handleRefresh}
            style={{
              backgroundColor: 'white',
              color: '#007bff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            🔄 새로고침
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '20px' }}>
        <QuestList
          quests={questList}
          selectedQuest={selectedQuest}
          onQuestSelect={handleQuestSelect}
        />

        <QuestDetail selectedQuest={selectedQuest} />

        <div>
          <ParticipantList participants={Participants} />
        </div>
      </div>
    </div>
  );
}
