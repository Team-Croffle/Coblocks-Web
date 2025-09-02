import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';
import { SupabaseAuthToken } from '~/types/supabase';

export const SocketContext = createContext<Socket | null>(null);

export function useSocket(): Socket {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }

  return socket;
}
