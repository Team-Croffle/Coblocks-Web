import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { IoSchool, IoExitOutline } from 'react-icons/io5';
import QuestList, { Quest } from '~/components/QuestList';
import QuestDetail from '~/components/QuestDetail';
import ParticipantList from '~/components/ParticipantList';
import { Participants } from '../assets/dummy/classroomData';
import Chat from '~/components/Chat';

interface ClassroomPageProps {
  questList: Quest[];
}

export default function ClassroomPage({ questList }: ClassroomPageProps): JSX.Element {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  const classroomCode = '12345';
  const userName = '사용자';
  const isManager = true;

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 소켓 연결
    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    socket.on('connect', () => {
      // 방 참여
      socket.emit('joinRoom', { roomCode: classroomCode, userName });
    });

    return () => {
      if (socket.connected) {
        socket.emit('leaveRoom', { roomCode: classroomCode, userName });
        socket.disconnect();
      }
    };
  }, [classroomCode, userName]);

  const handleQuestSelect = (quest: Quest): void => {
    setSelectedQuest(quest);
    console.log('퀘스트 선택:', quest);

    // 퀘스트 선택 시 소켓 이벤트 전송
    if (isManager && socketRef.current) {
      socketRef.current.emit('activity:selectProblem', {
        roomCode: classroomCode,
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

    if (socketRef.current) {// 이벤트만 전송 (서버에서 모든 로직 처리)
      socketRef.current.emit('activity:start');
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
            roomCode={classroomCode}
            userName={userName}
            socket={socketRef.current} // 소켓 전달
          />
        </div>
      </div>
    </div>
  );
}
