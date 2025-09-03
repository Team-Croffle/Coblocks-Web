import { Session } from '@supabase/supabase-js';
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface WorkspaceData {
  socket: Socket | null;
  isConnected: boolean;
  session: Session | null;
  questInfo: any;
  partNumber: number;
  assignment: Record<string, any>;
  participants: any[];
  setSocket: (newSocket: Socket) => void;
  setSession: (newSession: Session) => void;
  setQuestInfo: (q: any) => void;
  setPartnumber: (pn: number) => void;
  setAssignment: (a: Record<string, any>) => void;
  connectionSocket: () => void;
  disconnectSocket: () => void;
}

export const useWorkspace = create<WorkspaceData>((set, get) => ({
  socket: null,
  isConnected: false,
  session: null,
  questInfo: null,
  partNumber: 0,
  assignment: {},
  participants: [],
  setSocket: (newSocket: Socket) => set({ socket: newSocket }),
  setSession: (newSession: Session) => set({ session: newSession }),
  setQuestInfo: (q: any) => set({ questInfo: q }),
  setPartnumber: (pn: number) => set({ partNumber: pn }),
  setAssignment: (a: Record<string, any>) => set({ assignment: a }),
  connectionSocket: () => {
    if (get().socket) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_SERVER_URL);

    newSocket.on('activity:resData', (data) => {
      set({
        questInfo: data.questInfo,
        partNumber: data.myPartNumber,
        isConnected: true,
      });
    });

    newSocket.on('activity:finalSubmitted', (data) => {
      set({ assignment: data.finalSubmissions });
    });

    newSocket.on('classroom:list', (data) => {
      set({ participants: data.participants });
    });

    set({ socket: newSocket });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));
