import { useState } from 'react';
import { ChatMessage } from '../assets/dummy/classroomData';

interface ChatProps {
  messages: ChatMessage[];
}

export default function Chat({ messages }: ChatProps): JSX.Element {
  const [chatMessage, setChatMessage] = useState<string>('');

  const handleSendMessage = (): void => {
    if (chatMessage.trim()) {
      console.log('메시지 전송:', chatMessage);
      setChatMessage('');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', border: '1px solid #ddd' }}>
      <h6 style={{ marginBottom: '10px' }}>💬 채팅</h6>
      {/* 채팅 메시지 목록 */}
      <div
        style={{
          height: '300px',
          overflowY: 'auto',
          marginBottom: '15px',
          border: '1px solid #eee',
          padding: '10px',
          borderRadius: '4px',
        }}
      >
        {messages.map((msg, index) => {
          return (
            <div
              key={index}
              style={{ marginBottom: '10px' }}
            >
              <small style={{ color: '#666' }}>{msg.timestamp}</small>
              <div style={{ color: msg.sender === 'System' ? '#17a2b8' : 'inherit' }}>
                <strong>{msg.sender}:</strong> {msg.message}
              </div>
            </div>
          );
        })}
      </div>

      {/* 채팅 입력 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type='text'
          placeholder='메시지를 입력하세요...'
          value={chatMessage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            return setChatMessage(e.target.value);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              return handleSendMessage();
            }
          }}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
          }}
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
