import { useState } from 'react';
import QuestList, { Quest } from '~/components/QuestList';
import QuestDetail from '~/components/QuestDetail';
import ParticipantList from '~/components/ParticipantList';
import { Participants } from '../assets/dummy/classroomData';
import Chat from '~/components/Chat';

interface ClassroomPageProps {
  questList: Quest[]; // 라우트에서 받아온 데이터
}

export default function ClassroomPage({ questList }: ClassroomPageProps): JSX.Element {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const classroomCode = '12345';
  const userName = '사용자 이름';

  const handleQuestSelect = (quest: Quest): void => {
    setSelectedQuest(quest);
    console.log('퀘스트 선택:', quest);
  };

  return (
    <div style={{ minHeight: '85vh', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
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
            <p style={{ margin: 0 }}>강의실 코드: {classroomCode}</p>
          </div>
          <button
            style={{
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            }}
          >
            나가기
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
          <Chat
            roomCode={classroomCode}
            userName={userName}
          />
        </div>
      </div>
    </div>
  );
}
