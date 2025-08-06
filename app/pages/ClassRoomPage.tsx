import { useState, useEffect } from 'react';
import { Quest, ClassroomInfo, Participant } from '../assets/dummy/classroomData';
import { classroomService } from '../services/classroomService';
import QuestList from '../components/QuestList';
import QuestDetail from '../components/QuestDetail';
import ParticipantList from '../components/ParticipantList';
import Chat from '../components/Chat';
import { useLoaderData } from '@remix-run/react';

export default function ClassRoom_Page(): JSX.Element {
  

  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 가져올 데이터 상태들
  const [classroomInfo, setClassroomInfo] = useState<ClassroomInfo | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  
  const [quests, setQuests] = useState<Quest[]>([]);

  // 임시 강의실 ID (실제로는 URL 파라미터나 props에서 가져와야 함)
  const classroomId = '12345';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ 이 부분이 Remix 백엔드 API 호출!
        // /api/classrooms/12345 엔드포인트를 호출
        const data = await classroomService.getAllClassroomData(classroomId);
        setClassroomInfo(data.classroomInfo);
        setParticipants(data.participants);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
        console.error('Failed to fetch classroom data:', err);
      } finally {
        setLoading(false);
      }
    };
    

    fetchData();
  }, [classroomId]);
    const questData = useLoaderData<Quest[]>();
    setQuests(questData);
  const handleQuestSelect = (quest: Quest): void => {
    setSelectedQuest(quest);
    console.log('퀘스트 선택:', quest);
  };

  const handleRefresh = async (): Promise<void> => {
    // 데이터 새로고침
    window.location.reload();
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <div>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ color: '#dc3545' }}>오류 발생: {error}</div>
        <button
          onClick={handleRefresh}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

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
            <h2>📚 {classroomInfo?.name || '강의실'}</h2>
            <p style={{ margin: 0 }}>강의실 ID: {classroomInfo?.classroom_id || classroomId}</p>
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
        {/* 왼쪽: 퀘스트 목록 */}
        <QuestList
          quests={quests}
          selectedQuest={selectedQuest}
          onQuestSelect={handleQuestSelect}
        />

        {/* 중앙: 선택된 퀘스트 상세 */}
        <QuestDetail selectedQuest={selectedQuest} />

        {/* 오른쪽: 참여자 목록 및 채팅 */}
        <div>
          {/* 참여자 목록 */}
          <ParticipantList participants={participants} />

          {/* 채팅 */}
          <Chat  />
        </div>
      </div>
    </div>
  );
}
