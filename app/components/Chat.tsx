import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

// 채팅 메시지의 타입을 정의
interface MessagePayload {
  message: string;
  username: string;
}

// 컴포넌트가 받을 Props의 타입을 정의합니다.
interface ChatProps {
  code: string;
  username: string; // 로그인 시 발급받은 JWT 토큰
}

export default function Chat({ code, username }: ChatProps) {
  const [chatMessage, setChatMessage] = useState<string>('');
  const [messages, setMessages] = useState<MessagePayload[]>([]);

  // 2. socket 인스턴스를 컴포넌트의 생명주기 동안 유지하기 위해 useRef 사용
  const socketRef = useRef<Socket | null>(null);

  // 3. 채팅 스크롤을 맨 아래로 유지하기 위한 ref
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 4. 컴포넌트가 마운트될 때 한 번만 소켓에 연결합니다.
    // 백엔드 주소와 함께, 인증을 위한 토큰을 'auth' 옵션으로 전달합니다.
    const socket = io('http://localhost:3001', {
      auth: {
          token: "your_jwt_token"
      },
    });

    socketRef.current = socket;

    // 방 참여 요청
    socket.emit('joinRoom', { code });

    // 6. 서버로부터 'message' 이벤트를 받으면, 메시지 목록 상태를 업데이트합니다.
    socket.on('message', (newMessage: MessagePayload) => {
      setMessages((prevMessages) => {
        return [...prevMessages, newMessage];
      });
    });

    // 유저 입장/퇴장 알림 등 다른 이벤트도 여기서 처리할 수 있습니다.
    socket.on('userJoined', (data) => {
      console.log(`${data.joinUser}님이 입장했습니다.`);
      // 필요하다면 입장 메시지를 messages 상태에 추가할 수 있습니다.
    });

    // 7. 컴포넌트가 언마운트될 때(사라질 때) 소켓 연결을 반드시 끊어야 합니다. (매우 중요!)
    return () => {
      socket.disconnect();
    };
  }, [code, username]); // code나 username이 바뀔 때만 재연결 (선택적)

  // 8. 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (): void => {
    if (chatMessage.trim() && socketRef.current) {
      // 9. 완성된 메시지 전송 로직
      socketRef.current.emit('sendMessage', {
        code: code,
        userName: username,
        message: chatMessage,
      });
      setChatMessage('');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', border: '1px solid #ddd' }}>
      <h6 style={{ marginBottom: '10px', marginTop: '0px', fontSize: '20px' }}>
        💬 채팅
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
        {/* 10. 저장된 메시지들을 화면에 렌더링 */}
        {messages.map((msg, index) => {
          return (
            <div key={index}>
              <strong>{msg.username}: </strong>
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
          }}
        >
          ✈️
        </button>
      </div>
    </div>
  );
}
