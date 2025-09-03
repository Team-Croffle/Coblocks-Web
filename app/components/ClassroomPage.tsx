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

interface Classroom {
  classroom_name: string;
  classroom_code: string;
  classroom_id: string;
  manager_users_id: string;
  isManager: boolean;
}

export default function ClassroomPage({ questList }: ClassroomPageProps): JSX.Element {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const isConnected = useRef<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  // 로컬스토리지에서 사용자 정보 가져오는 함수
  const loadUserInfoFromLocalStorage = (): Classroom | null => {
    try {
      const classroomData = JSON.parse(localStorage.getItem('classroom') || 'null');
      console.log('[ClassroomPage] 로컬스토리지에서 로드된 정보:', {
        classroomCode: classroomData?.classroom_code,
        classroomName: classroomData?.classroom_name,
        isManager: classroomData?.isManager,
      });
      return classroomData;
    } catch (error) {
      console.error('[ClassroomPage] 로컬스토리지 로드 오류:', error);
      return null;
    }
  };

  // 사용자 인증 및 정보 추출
  const authenticateAndExtractUser = async (): Promise<{ token: string; userName: string } | null> => {
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

      const token = session?.access_token;
      if (!token) {
        console.log('[ClassroomPage] 토큰이 없습니다.');
        alert('로그인이 필요합니다.');
        window.location.href = '/';
        return null;
      }

      const nickname = session.user.user_metadata?.nickname || '미식별자';

      console.log('[ClassroomPage] 인증 및 사용자 정보 추출 완료:', {
        userId: session.user.id,
        nickname: nickname,
        email: session.user.email,
      });

      return { token, userName: nickname };
    } catch (error) {
      console.error('[ClassroomPage] 인증 및 사용자 정보 추출 오류:', error);
      alert('토큰이 손상되었습니다. 다시 로그인해주세요.');
      window.location.href = '/';
      return null;
    }
  };

  // 소켓 연결 설정
  const setupSocketConnection = (token: string, classroomData: Classroom, userName: string) => {
    if (isConnected.current) {
      console.log('[ClassroomPage] 이미 연결됨, 중복 연결 방지');
      return;
    }

    isConnected.current = true;
    console.log('[ClassroomPage] 소켓 연결 시작...');

    const socket = io('https://coblocks-back.onrender.com/', {
      auth: { token },
    });

    socketRef.current = socket;

    // 소켓 이벤트 리스너 설정
    socket.on('error', (err) => {
      console.log('[ClassroomPage] 소켓 오류:', err.message, err.data);
    });

    socket.on('connect', () => {
      console.log('[ClassroomPage] 소켓 연결 성공:', socket.id);

      if (classroomData.isManager) {
        const createPayload = {
          name: classroomData.classroom_name,
          code: classroomData.classroom_code,
          managerName: userName,
          id: classroomData.classroom_id,
          managerId: classroomData.manager_users_id,
        };

        socket.emit('classroom:create', createPayload, (res: ClassroomCreateResponse) => {
          if (res.success) {
            console.log('[ClassroomPage] 방 생성 성공:', res);
            const newParticipants = res.users.map((user) => ({
              userName: user.userName,
              isManager: user.isManager,
            }));
            setParticipants(newParticipants);
          } else {
            console.error('[ClassroomPage] 방 생성 실패:', res);
            alert('방 생성에 실패했습니다.');
          }
        });
      } else {
        const joinPayload = {
          code: classroomData.classroom_code,
          userName,
        };

        socket.emit('classroom:join', joinPayload, (res: ClassroomJoinResponse) => {
          if (res.success) {
            console.log('[ClassroomPage] 방 참여 성공:', res);
            const newParticipants = res.users.map((user) => ({
              userName: user.userName,
              isManager: user.isManager,
            }));
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
        const updatedParticipants = data.users.map((user) => ({
          userName: user.userName,
          isManager: user.isManager,
        }));
        setParticipants(updatedParticipants);
      },
    );

    socket.on(
      'classroom:userLeft',
      (data: { userName: string; users: Array<{ userName: string; isManager: boolean }> }) => {
        console.log('[ClassroomPage] 참가자 퇴장:', data.userName);
        const updatedParticipants = data.users.map((user) => ({
          userName: user.userName,
          isManager: user.isManager,
        }));
        setParticipants(updatedParticipants);
      },
    );

    socket.on('disconnect', () => {
      console.log('[ClassroomPage] 연결 끊김');
      isConnected.current = false;
    });
  };

  // 통합된 초기화 useEffect
  useEffect(() => {
    const initializeClassroom = async () => {
      if (isInitialized) return;

      console.log('[ClassroomPage] 초기화 시작...');

      // 1. 로컬스토리지에서 강의실 정보 로드
      const classroomData = loadUserInfoFromLocalStorage();
      if (!classroomData?.classroom_code) {
        console.error('[ClassroomPage] 강의실 정보가 없습니다.');
        alert('강의실 정보가 없습니다.');
        window.location.href = '/';
        return;
      }

      // 2. 사용자 인증 및 정보 추출
      const authData = await authenticateAndExtractUser();
      if (!authData) return;

      // 3. 상태 설정
      setClassroom(classroomData);
      setCurrentToken(authData.token);
      setUserName(authData.userName);

      console.log('[ClassroomPage] 초기화 완료:', {
        classroomCode: classroomData.classroom_code,
        userName: authData.userName,
        isManager: classroomData.isManager,
      });

      // 4. 소켓 연결 설정
      setupSocketConnection(authData.token, classroomData, authData.userName);

      setIsInitialized(true);
    };

    initializeClassroom();

    // 정리 함수
    return () => {
      if (socketRef.current?.connected && classroom?.classroom_code) {
        socketRef.current.emit('leaveRoom', {
          code: classroom.classroom_code,
          userName,
        });
        socketRef.current.disconnect();
      }
      isConnected.current = false;
    };
  }, [isInitialized]); // isInitialized만 의존성으로 설정

  const handleQuestSelect = (quest: Quest): void => {
    setSelectedQuest(quest);
    console.log('퀘스트 선택:', quest);

    // 퀘스트 선택 시 소켓 이벤트 전송
    if (classroom?.isManager && socketRef.current) {
      socketRef.current.emit('activity:selectProblem', {
        code: classroom.classroom_code,
        questId: quest.quest_id,
      });
    }
  };

  // 게임 시작 함수
  const handleGameStart = (): void => {
    if (!classroom?.isManager) {
      alert('개설자만 게임을 시작할 수 있습니다.');
      return;
    }

    if (!selectedQuest) {
      alert('먼저 퀘스트를 선택해주세요.');
      return;
    }

    if (socketRef.current) {
      socketRef.current.emit('activity:start');
      console.log('게임 시작 요청:', selectedQuest);

      const quest = {
        quest_id: selectedQuest.quest_id,
      };
      localStorage.setItem('selectedQuest', JSON.stringify(quest));
      window.location.href = '/classroom/workspace';
    }
  };

  const handleQuit = (): void => {
    if (socketRef.current) {
      socketRef.current.emit('classroom:leave', { code: classroom?.classroom_code });
      socketRef.current.disconnect();
    }
    window.location.href = '/';
  };

  // 초기화가 완료되지 않았으면 로딩 표시
  if (!isInitialized || !classroom) {
    return (
      <div
        style={{
          minHeight: '85vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
        }}
      >
        <div>로딩 중...</div>
      </div>
    );
  }

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
            <p style={{ margin: '8px 0 0 0' }}>강의실 코드: {classroom.classroom_code}</p>
          </div>
          <button
            onClick={handleQuit}
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
          isManager={classroom.isManager}
          onQuestSelect={handleQuestSelect}
        />

        <QuestDetail
          selectedQuest={selectedQuest}
          roomCode={classroom.classroom_code}
          isManager={classroom.isManager}
          onGameStart={handleGameStart}
        />

        <div>
          <ParticipantList participants={participants} />
          <Chat
            code={classroom.classroom_code}
            userName={userName}
            socket={socketRef.current}
          />
        </div>
      </div>
    </div>
  );
}
