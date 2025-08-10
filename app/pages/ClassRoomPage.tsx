import { useState} from 'react';
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { createSupabaseServerClient } from "~/utils/supabase.server";
import QuestList from '../components/QuestList';
import QuestDetail from '../components/QuestDetail';
import ParticipantList from '../components/ParticipantList';
import Chat from '../components/Chat';

// 얘는 나중에 데이터 베이스로 가져오기(참여자)
import { Participants } from '../assets/dummy/classroomData'; 


// 퀘스트 데이터 타입 정의
export interface QuestItem {
  quest_id: string;
  quest_description: string;
  quest_difficulty: number;
  quest_type: string;
  solve_status: number;
}

// Loader 함수 - 서버에서 실행
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = createSupabaseServerClient({ request });

  try {
    // RPC 함수 호출
    const { data, error } = await supabase.rpc('get_questlist');

    if (error) {
      console.error('Supabase RPC 함수 호출 에러: ', error);
      return json({ questList: [] });
    }

    return json({ questList: data as QuestItem[] });
  } catch (error) {
    console.error('퀘스트 로딩 에러:', error);
    return json({ questList: [] });
  }
};

export default function ClassRoom_Page(): JSX.Element {
  const { questList } = useLoaderData<typeof loader>();
  
  // QuestItem 타입을 사용하도록 수정
  const [selectedQuest, setSelectedQuest] = useState<QuestItem | null>(null);
  
  // 임시 강의실 ID (실제로는 URL 파라미터나 props에서 가져와야 함)
  const classroomId = '12345';

  // QuestItem 타입을 사용하도록 수정
  const handleQuestSelect = (quest: QuestItem): void => {
    setSelectedQuest(quest);
    console.log('퀘스트 선택:', quest);
  };

  const handleRefresh = async (): Promise<void> => {
    // 데이터 새로고침
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
            <h2>📚 {'강의실'}</h2>
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
        {/* 왼쪽: 퀘스트 목록 */}
        <QuestList
          quests={questList}
          selectedQuest={selectedQuest}
          onQuestSelect={handleQuestSelect}
        />

        {/* 중앙: 선택된 퀘스트 상세 */}
        <QuestDetail selectedQuest={selectedQuest} />

        {/* 오른쪽: 참여자 목록 및 채팅 */}
        <div>
          {/* 참여자 목록 */}
          <ParticipantList participants={Participants} />

          {/* 채팅 */}
          <Chat />
        </div>
      </div>
    </div>
  );
}