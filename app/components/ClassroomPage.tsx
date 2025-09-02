import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { IoSchool, IoExitOutline } from 'react-icons/io5';
import QuestList, { Quest } from '~/components/QuestList';
import QuestDetail from '~/components/QuestDetail';
import ParticipantList from '~/components/ParticipantList';
import Chat from '~/components/Chat';
import { supabase } from '~/utils/supabase.client';

interface ClassroomPageProps {
  questList: Quest[];
}

// 서버 응답 타입 정의
interface ClassroomCreateResponse {
  success: boolean;
  message: string;
  classroom: { name: string; code: string };
  users: Array<{ userName: string; isManager: boolean }>;
  isManager: boolean;
  state: string;
}

interface ClassroomJoinResponse {
  success: boolean;
  message: string;
  classroom: { name: string; code: string };
  users: Array<{ userName: string; isManager: boolean }>;
  isManager: boolean;
  roomState: string;
  isGracePeriod: boolean;
}

interface Participant {
  userName: string;
  isManager: boolean;
}

export default function ClassroomPage({ questList }: ClassroomPageProps): JSX.Element {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // 로컬스토리지에서 받아올 상태들
  const [classroomName, setClassroomName] = useState<string>('');
  const [classroomCode, setClassroomCode] = useState<string>('');
  const [classroomId, setClassroomId] = useState<string>('');
  const [managerUserId, setManagerUserId] = useState<string>('');
  const [isManager, setIsManager] = useState<boolean>(false);

  const [userName, setUserName] = useState<string>('');

  const isConnected = useRef<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  // 로컬스토리지에서 사용자 정보 가져오는 함수 수정
  const loadUserInfoFromLocalStorage = (): void => {
    try {
      const savedClassroomName = localStorage.getItem('classroom_name') || '';
      const savedClassroomCode = localStorage.getItem('classroom_code') || '';
      const savedClassroomId = localStorage.getItem('classroom_id') || '';
      const savedManagerUserId = localStorage.getItem('manager_user_id') || '';
      const savedIsManager = localStorage.getItem('isManager') === 'true';

      setClassroomName(savedClassroomName);
      setClassroomCode(savedClassroomCode);
      setClassroomId(savedClassroomId);
      setManagerUserId(savedManagerUserId);
      setIsManager(savedIsManager);

      console.log('[ClassroomPage] 로컬스토리지에서 로드된 정보:', {
        classroomCode: savedClassroomCode,
        classroomName: savedClassroomName,
        isManager: savedIsManager,
      });
    } catch (error) {
      console.error('[ClassroomPage] 로컬스토리지 로드 오류:', error);
    }
  };

  // authenticateUser 함수 수정
  const authenticateUser = async (): Promise<string | null> => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('[ClassroomPage] 세션 가져오기 오류:', error);
        alert('세션을 가져오는 중 오류가 발생했습니다.');
        window.location.href = '/';
        return null;
      }

      const token = session?.access_token || null;

      if (!token) {
        console.log('[ClassroomPage] authenticateUser: 토큰이 없습니다.');
        alert('로그인이 필요합니다.');
        window.location.href = '/';
        return null;
      }

      return token;
    } catch (error) {
      console.error('[ClassroomPage] 토큰 파싱 오류:', error);
      alert('토큰이 손상되었습니다. 다시 로그인해주세요.');
      window.location.href = '/';
      return null;
    }
  };

  // 현재 없는 함수 - 추가 필요
  const extractUserInfoFromToken = async (): Promise<void> => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        console.error('[ClassroomPage] 세션 정보 없음:', error);
        return;
      }

      // 토큰에서 닉네임 추출
      const nickname = session.user.user_metadata?.nickname || '미식별자';
      setUserName(nickname);

      console.log('[ClassroomPage] 토큰에서 추출된 사용자 정보:', {
        userId: session.user.id,
        nickname: nickname,
        email: session.user.email,
      });
    } catch (error) {
      console.error('[ClassroomPage] 사용자 정보 추출 오류:', error);
      setUserName('미식별자');
    }
  };

  // 로컬스토리지 로드
  useEffect(() => {
    loadUserInfoFromLocalStorage();
  }, []);

// 토큰 인증
useEffect(() => {
  const handleAuth = async () => {
    const token = await authenticateUser();
    console.log('[ClassroomPage] authenticateUser 결과:', !!token);

    if (token) {
      setCurrentToken(token);
      await extractUserInfoFromToken(); // 토큰에서 사용자명 추출
      console.log('[ClassroomPage] currentToken 설정 완료');
    } else {
      console.log('[ClassroomPage] 토큰이 없어서 설정하지 않음');
    }
  };
  handleAuth();
}, []);

  // 연결 useEffect
  useEffect(() => {
    console.log('[ClassroomPage] 소켓 연결 조건 체크:', {
      hasCurrentToken: !!currentToken,
      hasClassroomCode: !!classroomCode,
      hasUserName: !!userName,
      isConnectedCurrent: isConnected.current,
    });

    if (!currentToken) {
      console.log('[ClassroomPage] 토큰 대기 중... 소켓 연결 보류');
      return;
    }

    if (!classroomCode || !userName) {
      console.log('[ClassroomPage] 사용자 정보 대기 중... 소켓 연결 보류', {
        classroomCode: classroomCode,
        userName: userName,
      });
      return;
    }

    if (isConnected.current) {
      console.log('[ClassroomPage] 이미 연결됨, 중복 연결 방지');
      return;
    }

    isConnected.current = true;
    console.log('[ClassroomPage] 소켓 연결 시작...');

    // 소켓 연결
    const socket = io('https://coblocks-back.onrender.com/', {
      auth: {
        token: currentToken, // 토큰 객체에서 access_token 추출
      },
    });

    socketRef.current = socket;

    socket.on('error', (err) => {
      console.log('[ClassroomPage] 소켓 오류: ', err.message);
      console.log('[ClassroomPage] 소켓 DATA: ', err.data);
    });

    // join 전용 payload
    const joinPayload = {
      code: classroomCode,
      userName,
    };

    // create 전용 payload
    const createPayload = {
      name: classroomName,
      code: classroomCode,
      managerName: userName,
      id: classroomId,
      managerUserId: managerUserId,
    };

    socket.on('connect', () => {
      console.log('[ClassroomPage] 소켓 연결 성공:', socket.id);

      if (isManager) {
        socket.emit('classroom:create', createPayload, (res: ClassroomCreateResponse) => {
          if (res.success) {
            console.log('[ClassroomPage] 방 생성 성공:', socket.id, res);
            console.log('[ClassroomPage] 방 정보:', res.classroom);
            console.log('[ClassroomPage] 참가자 목록:', res.users);

            const newParticipants: Participant[] = res.users.map((user) => {
              return {
                userName: user.userName,
                isManager: user.isManager,
              };
            });
            setParticipants(newParticipants);
          } else {
            console.error('[ClassroomPage] 방 생성 실패:', res);
            alert('방 생성에 실패했습니다.');
          }
        });
      } else {
        socket.emit('classroom:join', joinPayload, (res: ClassroomJoinResponse) => {
          if (res.success) {
            console.log('[ClassroomPage] 방 참여 성공:', socket.id, res);
            console.log('[ClassroomPage] 방 정보:', res.classroom);
            console.log('[ClassroomPage] 참가자 목록:', res.users);

            const newParticipants: Participant[] = res.users.map((user) => {
              return {
                userName: user.userName,
                isManager: user.isManager,
              };
            });
            setParticipants(newParticipants);
          } else {
            console.error('[ClassroomPage] 방 참여 실패:', res);
            alert('방 참여에 실패했습니다.');
          }
        });
      }
    });

    // 실시간 참가자 변동 이벤트
    socket.on(
      'classroom:userJoined',
      (data: { userName: string; users: Array<{ userName: string; isManager: boolean }> }) => {
        console.log('[ClassroomPage] 새 참가자 입장:', data.userName);
        const updatedParticipants: Participant[] = data.users.map((user) => {
          return {
            userName: user.userName,
            isManager: user.isManager,
          };
        });
        setParticipants(updatedParticipants);
      },
    );

    socket.on(
      'classroom:userLeft',
      (data: { userName: string; users: Array<{ userName: string; isManager: boolean }> }) => {
        console.log('[ClassroomPage] 참가자 퇴장:', data.userName);
        const updatedParticipants: Participant[] = data.users.map((user) => {
          return {
            userName: user.userName,
            isManager: user.isManager,
          };
        });
        setParticipants(updatedParticipants);
      },
    );

    socket.on('disconnect', () => {
      console.log('[ClassroomPage] 연결 끊김');
      isConnected.current = false;
    });

    return () => {
      if (socket.connected) {
        socket.emit('leaveRoom', { code: classroomCode, userName });
        socket.disconnect();
      }
      isConnected.current = false;
    };
  }, [currentToken, classroomCode, userName, isManager]);

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
      window.location.href = '/classroom/workspace';
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
          <ParticipantList participants={participants} />
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
