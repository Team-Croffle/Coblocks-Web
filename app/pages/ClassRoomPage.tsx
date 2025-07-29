import { useState } from 'react';
import {
  Quest,
  mockClassroomInfo,
  mockParticipants,
  mockChatMessages,
  mockQuests,
} from '../assets/dummy/classroomData';
import QuestList from '../components/QuestList';
import QuestDetail from '../components/QuestDetail';
import ParticipantList from '../components/ParticipantList';
import Chat from '../components/Chat';

export default function ClassRoom_Page(): JSX.Element {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const handleQuestSelect = (quest: Quest): void => {
    setSelectedQuest(quest);
    console.log('퀘스트 선택:', quest);
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
            <h2>📚 {mockClassroomInfo.name}</h2>
            <p style={{ margin: 0 }}>강의실 ID: {mockClassroomInfo.classroom_id}</p>
          </div>
          <button
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
        {/* 왼쪽: 퀘스트 목록 */}
        <QuestList
          quests={mockQuests}
          selectedQuest={selectedQuest}
          onQuestSelect={handleQuestSelect}
        />

        {/* 중앙: 선택된 퀘스트 상세 */}
        <QuestDetail selectedQuest={selectedQuest} />

        {/* 오른쪽: 참여자 목록 및 채팅 */}
        <div>
          {/* 참여자 목록 */}
          <ParticipantList participants={mockParticipants} />

          {/* 채팅 */}
          <Chat messages={mockChatMessages} />
        </div>
      </div>
    </div>
  );
}
