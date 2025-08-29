import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { IoSchool, IoExitOutline } from 'react-icons/io5';
import QuestList, { Quest } from '~/components/QuestList';
import QuestDetail from '~/components/QuestDetail';
import ParticipantList from '~/components/ParticipantList';
import { Participants } from '../assets/dummy/classroomData';
import Chat from '~/components/Chat';
import { supabase } from '~/utils/supabase';

interface ClassroomPageProps {
  questList: Quest[];
}

export default function ClassroomPage({ questList }: ClassroomPageProps): JSX.Element {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const [currentToken, setCurrentToken] = useState<string | null>(null);

  const isConnected = useRef<boolean>(false); // 핵심: 연결 상태 추적

  const classroomCode = '0001';
  const userName = '사용자';
  const isManager = true;
  const socketRef = useRef<Socket | null>(null);

  const supabaseClient = supabase;

  // ===================여기서 부터 은석이 꺼==========================
  const authenticateUser = async (): Promise<string | null> => {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: '', //본인 이메일
        password: '', //본인 비밀번호 입력
      });

      if (error) throw error;

      if (data.session?.access_token) {
        return data.session.access_token;
      } else {
        throw new Error('세션 정보가 없습니다.');
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const handleAuth = async () => {
      const token = await authenticateUser();
      setCurrentToken(token);
    };
    handleAuth();
  }, []);

  useEffect(() => {
    // 이미 연결되었으면 중복 연결 방지
    if (isConnected.current) {
      return;
    }
    isConnected.current = true;

    // 소켓 연결
    const socket = io('https://coblocks-back.onrender.com/', {
      auth: {
        token: currentToken,
      },
    });
    socketRef.current = socket;

    socket.on('error', (err) => {
      console.log('❌ 소켓 오류:', err.message);
      console.log('❌ 소켓 오류 DATA:', err.data);
    });

    const payload = {
      id: `cls-${Date.now()}`,
      name: `진짜 마지막 방`,
      code: classroomCode,
      managerId: '00aac7ae-3c8a-4b5c-b117-41dcd26163a5',
      managerName: '정웅교',
    };

    // 방 참여
    socket.on('connect', () => {
      socket.emit('classroom:create', payload, (res: { success: boolean; error?: string }) => {
        if (res.error) {
          alert(res.error);
          return;
        }
        console.log('✅ 연결 성공:', socket.id, res);
      });
    });

    socket.on('disconnect', () => {
      console.log('❌ 연결 끊김');
      isConnected.current = false; // 연결 해제 시 플래그 리셋
    });

    return () => {
      if (socket.connected) {
        socket.emit('leaveRoom', { code: classroomCode, userName });
        socket.disconnect();
      }
    };
  }, []);
  // ===================여기까지 은석이 꺼==========================

  const handleQuestSelect = (quest: Quest): void => {
    setSelectedQuest(quest);
    console.log('퀘스트 선택:', quest);

    // 퀘스트 선택 시 소켓 이벤트 전송
    if (isManager && socketRef.current) {
      socketRef.current.emit('activity:selectProblem', {
        code: classroomCode,
        questId: quest.quest_id,
      });
    }
  };

  // 게임 시작 함수
  const handleGameStart = (): void => {
    if (!isManager) {
      alert('개설자만 게임을 시작할 수 있습니다.');
      return;
    }

    if (!selectedQuest) {
      alert('먼저 퀘스트를 선택해주세요.');
      return;
    }

    if (socketRef.current) {
      // 이벤트만 전송 (서버에서 모든 로직 처리)
      socketRef.current.emit('activity:start');
      console.log('게임 시작 요청:', selectedQuest);
    }
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
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <IoSchool size={28} />
              강의실
            </h2>
            <p style={{ margin: '8px 0 0 0' }}>강의실 코드: {classroomCode}</p>
          </div>
          <button
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <IoExitOutline size={16} />
            나가기
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '20px' }}>
        <QuestList
          quests={questList}
          selectedQuest={selectedQuest}
          isManager={isManager}
          onQuestSelect={handleQuestSelect}
        />

        <QuestDetail
          selectedQuest={selectedQuest}
          roomCode={classroomCode}
          isManager={isManager}
          onGameStart={handleGameStart}
        />

        <div>
          <ParticipantList participants={Participants} />
          <Chat
            code={classroomCode}
            userName={userName}
            socket={socketRef.current} // 소켓 전달
          />
        </div>
      </div>
    </div>
  );
}
