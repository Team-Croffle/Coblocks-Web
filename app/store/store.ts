import { Session } from '@supabase/supabase-js';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface WorkspaceData {
  socket: Socket | null;
  isConnected: boolean;
  session: Session | null;
  classroom: any;
  questInfo: any;
  partNumber: number;
  assignment: Record<string, any>;
  participants: any[];
  setSocket: (newSocket: Socket) => void;
  setSession: (newSession: Session) => void;
  setQuestInfo: (q: any) => void;
  setPartnumber: (pn: number) => void;
  setParticipants: (p: any[]) => void;
  setAssignment: (a: Record<string, any>) => void;
  setIsConnected: (isConnected: boolean) => void;
  setClassroom: (c: any) => void;
  connectionSocket: () => void;
  disconnectSocket: () => void;
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

export const useWorkspace = create<WorkspaceData>((set, get) => ({
  socket: null,
  isConnected: false,
  session: null,
  classroom: null,
  questInfo: null,
  partNumber: 0,
  assignment: {},
  participants: [],
  setSocket: (newSocket: Socket) => set({ socket: newSocket }),
  setSession: (newSession: Session) => set({ session: newSession }),
  setClassroom: (c: any) => set({ classroom: c }),
  setQuestInfo: (q: any) => set({ questInfo: q }),
  setPartnumber: (pn: number) => set({ partNumber: pn }),
  setParticipants: (p: any[]) => set({ participants: p }),
  setAssignment: (a: Record<string, any>) => set({ assignment: a }),
  setIsConnected: (isConnected: boolean) => set({ isConnected }),
  connectionSocket: () => {
    if (get().socket || get().isConnected) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_SERVER_URL);

    newSocket.on('error', (err) => {
      console.log('[ClassroomPage] 소켓 오류:', err.message, err.data);
    });

    newSocket.on('activity:resData', (data) => {
      set({
        questInfo: data.questInfo,
        partNumber: data.myPartNumber,
        isConnected: true,
      });
    });

    newSocket.on('error', (err) => {
      console.log('[ClassroomPage] 소켓 오류:', err.message, err.data);
    });

    newSocket.on('connect', () => {
      console.log('[ClassroomPage] 소켓 연결 성공:', newSocket.id);
      const userName = get().session?.user.user_metadata.username;
      if (get().classroom.isManager) {
        const createPayload = {
          name: get().classroom.classroom_name,
          code: get().classroom.classroom_code,
          managerName: userName,
          id: get().classroom.classroom_id,
          managerId: get().classroom.manager_users_id,
        };

        newSocket.emit('classroom:create', createPayload, (res: ClassroomCreateResponse) => {
          if (res.success) {
            console.log('[ClassroomPage] 방 생성 성공:', res);
            const newParticipants = res.users.map((user) => ({
              userName: user.userName,
              isManager: user.isManager,
            }));
            set({ participants: newParticipants });
          } else {
            console.error('[ClassroomPage] 방 생성 실패:', res);
            alert('방 생성에 실패했습니다.');
          }
        });
      } else {
        const joinPayload = {
          code: get().classroom.classroom_code,
          userName,
        };

        newSocket.emit('classroom:join', joinPayload, (res: ClassroomJoinResponse) => {
          if (res.success) {
            console.log('[ClassroomPage] 방 참여 성공:', res);
            const newParticipants = res.users.map((user) => ({
              userName: user.userName,
              isManager: user.isManager,
            }));
            set({ participants: newParticipants });
          } else {
            console.error('[ClassroomPage] 방 참여 실패:', res);
            alert('방 참여에 실패했습니다.');
          }
        });
      }
    });

    // 실시간 참가자 변동 이벤트
    newSocket.on(
      'classroom:userJoined',
      (data: { userName: string; users: Array<{ userName: string; isManager: boolean }> }) => {
        console.log('[ClassroomPage] 새 참가자 입장:', data.userName);
        const updatedParticipants = data.users.map((user) => ({
          userName: user.userName,
          isManager: user.isManager,
        }));
        set({ participants: updatedParticipants });
      },
    );

    newSocket.on(
      'classroom:userLeft',
      (data: { userName: string; users: Array<{ userName: string; isManager: boolean }> }) => {
        console.log('[ClassroomPage] 참가자 퇴장:', data.userName);
        const updatedParticipants = data.users.map((user) => ({
          userName: user.userName,
          isManager: user.isManager,
        }));
        set({ participants: updatedParticipants });
      },
    );

    newSocket.on('disconnect', () => {
      console.log('[ClassroomPage] 연결 끊김');
      set({ isConnected: false });
    });

    newSocket.on('activity:finalSubmitted', (data) => {
      set({ assignment: data.finalSubmissions });
    });

    newSocket.on('classroom:list', (data) => {
      set({ participants: data.participants });
    });

    set({ socket: newSocket });

    const classroomStr = localStorage.getItem('classroom');
    if (classroomStr) {
      const classroom = JSON.parse(classroomStr);
      set({ classroom });
    }
    set({ isConnected: false });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));
