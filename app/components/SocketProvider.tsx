import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketContext } from '~/context/socket-context';
import { SupabaseAuthToken } from '~/types/supabase';

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentToken, setCurrentToken] = useState<SupabaseAuthToken | null>(null);

  useEffect(() => {
    try {
      const tokenStr = localStorage.getItem('supabase');

      if (!tokenStr) {
        console.log('[ClassroomPage] authenticateUser: 토큰이 없습니다.');
        alert('로그인이 필요합니다.');
        // main 으로 navigate
        window.location.href = '/';
      } else {
        const token: SupabaseAuthToken = JSON.parse(tokenStr);
        setCurrentToken(token);
      }
    } catch (error) {
      return;
    }

    if (typeof window !== 'undefined') {
      const socketServerUrl = import.meta.env.VITE_SOCKET_SERVER_URL!;
      const newSocket = io(socketServerUrl, {
        auth: {
          token: currentToken,
        },
      });
      setSocket(newSocket);
    }
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
