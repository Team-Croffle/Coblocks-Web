import { useState, useEffect, useRef} from 'react';
import { Socket } from 'socket.io-client';
import { IoChatbubbleOutline, IoSend } from 'react-icons/io5';

// 채팅 메시지의 타입을 정의
interface MessagePayload {
  message: string;
  userName: string;
}

// 컴포넌트가 받을 Props의 타입을 정의합니다.
interface ChatProps {
  roomCode: string;
  userName: string; // 로그인 시 발급받은 JWT 토큰
  socket: Socket | null; // 부모로부터 소켓 받기
}

interface UserJoinedPayload {
  joinUser: string;
}

export default function Chat({ roomCode, userName, socket}: ChatProps) {
  const [chatMessage, setChatMessage] = useState<string>('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
  if (!socket) return;
    
  const handleChatMessage = (message: MessagePayload) => {
    setMessages((prevMessages) => {
      return [...prevMessages, message];
    });
  };

  const handleUserJoined = (data: UserJoinedPayload) => {
      console.log(`${data.joinUser}님이 입장했습니다.`);
      // 입장 메시지를 채팅에 추가 (선택적)
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          {
            userName: 'System',
            message: `[${data.joinUser}]님이 입장했습니다.`
          }
        ];
      });
    };

  // 이벤트 리스너 등록 (소켓 연결은 부모에서 관리)
  socket.on('chat:message', handleChatMessage);
  socket.on('userJoined', handleUserJoined);

  // 클린업: 이벤트 리스너만 제거 (소켓 연결 해제는 부모에서 관리)
  return () => {
    socket.off('chat:message', handleChatMessage);
    socket.off('userJoined', handleUserJoined);
  };
}, [socket]);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (): void => {
    if (chatMessage.trim() && socket) {
      // 부모에서 받은 소켓으로 메시지 전송
      socket.emit('chat:sendMessage', {
        roomCode: roomCode,
        userName: userName,
        message: chatMessage,
      });
      setChatMessage('');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', border: '1px solid #ddd' }}>
      <h6
        style={{
          marginBottom: '10px',
          marginTop: '0px',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <IoChatbubbleOutline size={20} />
        채팅
      </h6>

      {/* 채팅 메시지 목록 */}
      <div
        style={{
          height: '300px',
          overflowY: 'auto',
          marginBottom: '15px',
          border: '1px solid #eee',
          padding: '10px',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* 저장된 메시지들을 화면에 렌더링 */}
        {messages.map((msg, index) => {
          return (
            <div key={index}>
              {/* 입력 시간 추후에 결정 */}
              <strong>{msg.userName}: </strong>
              <span>{msg.message}</span>
            </div>
          );
        })}
        {/* 스크롤을 위한 빈 div */}
        <div ref={chatEndRef} />
      </div>

      {/* 채팅 입력 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type='text'
          placeholder='메시지를 입력하세요...'
          value={chatMessage}
          onChange={(e) => {
            setChatMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <IoSend size={16} />
        </button>
      </div>
    </div>
  );
}
