import { useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketContext } from '~/context/socket-context';
import { supabase } from '~/utils/supabase.client';

interface SocketProviderProps {
  children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const checkSession = async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setCurrentToken(session?.access_token || null);
      };

      checkSession();

      if (!currentToken) {
        console.log('[ClassroomPage] authenticateUser: 토큰이 없습니다.');
        alert('로그인이 필요합니다.');
        // main 으로 navigate
        navigate('/login');
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
