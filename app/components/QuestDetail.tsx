import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { Quest } from './QuestList';

interface QuestDetailProps {
  selectedQuest: Quest | null;
  roomCode: string;
  isManager?: boolean; 
}

export default function QuestDetail({ 
  selectedQuest, 
  roomCode, 
  isManager = false // 기본값 false로 설정
}: QuestDetailProps): JSX.Element {
  
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Socket.IO 연결
    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  // ⭐ selectedQuest가 변경될 때마다 소켓으로 데이터 전송
  useEffect(() => {
    if (selectedQuest && isManager && socketRef.current) {
      console.log('📤 activity:selectProblem 이벤트 전송 (퀘스트 선택시):', {
        roomCode,
        questId: selectedQuest.quest_id
      });

      // 퀘스트 선택 시 자동으로 서버에 이벤트 전송
      socketRef.current.emit('activity:selectProblem', {
        roomCode: roomCode,
        questId: selectedQuest.quest_id
      });
    }
  }, [selectedQuest, roomCode, isManager]); // selectedQuest가 변경될 때마다 실행

  // ⭐ 게임 시작 이벤트 전송 함수
  const handleStartGame = () => {
    if (!isManager) {
      alert('개설자만 게임을 시작할 수 있습니다.');
      return;
    }

    if (!selectedQuest) {
      alert('먼저 퀘스트를 선택해주세요.');
      return;
    }

    if (socketRef.current) {
      console.log('📤 activity:start 이벤트 전송:', {
        roomCode
      });

      // 게임 시작 이벤트 전송
      socketRef.current.emit('activity:start', {
      });
    }
  };

  // 난이도 텍스트 변환 함수
  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "쉬움";
      case 2: return "보통";
      case 3: return "어려움";
      case 4: return "매우 어려움";
      default: return "알 수 없음";
    }
  };

  // 상태 텍스트 변환 함수
  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return "비공개";
      case 1: return "공개";
      case 2: return "해결됨";
      default: return "알 수 없음";
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', border: '1px solid #ddd' }}>
      <h5 style={{ marginBottom: '15px' }}>퀘스트 상세</h5>
      {selectedQuest ? (
        <div>
          <h4>{selectedQuest.quest_description}</h4>
          <p style={{ color: '#666' }}>유형: {selectedQuest.quest_type}</p>
          <div style={{ marginBottom: '15px' }}>
            <strong>난이도:</strong>
            <span
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '4px',
                marginLeft: '8px',
                fontSize: '12px',
              }}
            >
              {getDifficultyText(selectedQuest.quest_difficulty)}
            </span>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <strong>상태:</strong>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                color: 'white',
                marginLeft: '8px',
                backgroundColor:
                  selectedQuest.solve_status === 2
                    ? '#28a745'
                    : selectedQuest.solve_status === 1
                      ? '#ffc107'
                      : '#6c757d',
              }}
            >
              {getStatusText(selectedQuest.solve_status)}
            </span>
          </div>
          <hr />
          
          {/* ⭐ 이 문제로 시작 버튼 - isManager에 따라 활성화/비활성화 */}
          <button
            onClick={handleStartGame}
            disabled={!isManager}
            style={{
              backgroundColor: isManager ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isManager ? 'pointer' : 'not-allowed',
              width: '100%',
              transition: 'all 0.2s ease',
              boxShadow: isManager ? '0 2px 4px rgba(0, 123, 255, 0.2)' : '0 2px 4px rgba(108, 117, 125, 0.2)',
              opacity: isManager ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (isManager) {
                e.currentTarget.style.backgroundColor = '#0056b3';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (isManager) {
                e.currentTarget.style.backgroundColor = '#007bff';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 123, 255, 0.2)';
              }
            }}
            onMouseDown={(e) => {
              if (isManager) {
                e.currentTarget.style.transform = 'translateY(1px)';
              }
            }}
            onMouseUp={(e) => {
              if (isManager) {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
          >
            {isManager ? '🎯 이 문제로 시작' : '👑 개설자만 시작 가능'}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#666', padding: '50px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>📋</div>
          <p>퀘스트를 선택하세요</p>
          {isManager && (
            <p style={{ fontSize: '14px', color: '#999' }}>
              선택하면 자동으로 서버에 전송됩니다
            </p>
          )}
        </div>
      )}
    </div>
  );
}