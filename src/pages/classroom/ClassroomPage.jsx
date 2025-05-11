/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback, use } from 'react';
import { FaBars, FaSyncAlt } from 'react-icons/fa';
import { BsChevronBarLeft } from 'react-icons/bs';
import { Button, Container, Row, Col, Card, Form, ListGroup, InputGroup } from 'react-bootstrap';
import BlocklyEditor from '@modules/blockly/BlocklyEditor';
import { useClassroom } from '@/contexts/ClassroomContext';
import socketEvents from '@data/socketEvents'; // 소켓 이벤트 상수

const ClassroomPage = () => {
  const [groups, setGroups] = useState([]); // 그룹 목록
  const [newGroupName, setNewGroupName] = useState(''); // 새 그룹 이름
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 왼쪽 패널 (처음엔 숨김)
  const blocklyEditorRef = useRef(null);
  const chatInputRef = useRef(null); // 채팅 입력 필드 참조

  const {
    socket,
    chat, // 채팅 관련 데이터
    participants, // 참가자 목록
    classroomInfo, // 강의실 정보
    isManager, // 강의실 관리자 여부
    // setClassroomInfo, // 강의실 정보 설정 함수
    // socketClose, // 소켓을 명시적으로 닫아야 할 때 사용
  } = useClassroom();

  const inviteCode = classroomInfo?.classroom_code || '로딩 중...'; // 초대 코드 (로딩 중일 때는 '로딩 중...' 표시)

  const blocklyEditorZoomOptions = {
    zoom: {
      enabled: true,
      controls: false,
      wheel: true,
      startScale: 0.8,
      maxScale: 2.4,
      minScale: 0.3,
      scaleSpeed: 1.2,
    },
  };

  useEffect(() => {
    if (socket && classroomInfo?.classroom_id) {
      socket.emit(socketEvents.JOIN_CLASSROOM, {
        classroomDetails: classroomInfo,
      }); // 강의실에 참여합니다
    }

    if (import.meta.env.VITE_RUNNING_MODE === 'development') {
      console.log(`Attempting to join classroom: ${classroomInfo.classroom_id}`);
    } else {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        if (!socket) console.warn('Socket is not ready yet.');
        if (!classroomInfo?.classroom_id) console.warn('Classroom ID is not available yet.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, classroomInfo?.classroom_id]);

  // 강의실 나가기 처리
  const handleLeaveClass = () => {
    if (window.confirm('정말로 강의실을 나가시겠습니까?')) {
      socket.emit(socketEvents.LEAVE_CLASSROOM, {
        classroomId: classroomInfo.classroom_id,
      });
    }
  };

  // 그룹 생성 처리
  const handleCreateGroup = useCallback(() => {
    if (newGroupName.trim() !== '' && socket && classroomInfo?.classroom_id) {
      socket.emit(socketEvents.CREATE_GROUP, {
        classroomId: classroomInfo.classroom_id,
        groupName: newGroupName,
      });
      setNewGroupName('');
    }
  }, [socket, classroomInfo, newGroupName]);
  // 그룹 생성 후 서버에서 응답을 받으면 그룹 목록을 업데이트하는 로직이 필요합니다.

  // 학생 목록 새로고침 처리 함수
  const handleRefreshParticipants = useCallback(() => {
    if (socket && classroomInfo) {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('Requesting participants list refresh for classroom:', classroomInfo.classroom_id);
      }
      // 서버에 참여자 목록 갱신을 요청하는 이벤트 (이벤트명은 백엔드와 협의 필요)
      socket.emit(socketEvents.REQUEST_PARTICIPANTS_LIST, { classroomId: classroomInfo.classroom_id });
    }
  }, [socket, classroomInfo]);
  // 참가자 목록을 새로고침하는 로직은 서버에서 응답을 받으면 처리해야 합니다.

  const handleSave = () => {
    // ref.current를 통해 BlocklyEditor 컴포넌트의 함수에 접근
    const xml = blocklyEditorRef.current.getXml();
    console.log('Current Blockly XML:', xml);

    // Serialization 상태 가져오기 (최신 방식)
    const state = blocklyEditorRef.current.getSerializationState();
    console.log('Current Blockly State (Serialization):', JSON.stringify(state));

    // 이 XML 또는 state를 서버로 전송하거나 로컬 스토리지에 저장
  };

  const handleLoad = () => {
    // 저장된 XML 또는 상태 객체를 불러와 로드
    const savedXml = '<xml>...</xml>'; // 불러온 XML 문자열
    blocklyEditorRef.current.loadXml(savedXml);

    // 저장된 Serialization 상태 객체 (JSON 파싱된 상태)
    // const savedState = { ... };
    // blocklyEditorRef.current.loadSerializationState(savedState);
  };

  const handleSendChatMessage = useCallback(
    (messageText) => {
      if (messageText.trim() !== '' && socket && classroomInfo?.classroom_id) {
        socket.emit(socketEvents.CLASSROOM_MESSAGE, { message: messageText }); // Context와 동일한 이벤트 사용
        if (chatInputRef.current) {
          chatInputRef.current.value = ''; // 입력창 비우기
        }
      }
    },
    [socket, classroomInfo],
  );

  const LeftMenu = () => (
    <Col
      md={2}
      className='bg-light d-flex flex-column justify-content-between p-3 position-relative'
    >
      {/* 왼쪽 패널 접기 버튼 */}
      <Button
        variant='secondary'
        onClick={() => setIsSidebarOpen(false)}
        className='p-0' // 패딩 제거로 정사각형에 가깝게
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem', // 오른쪽에서 1rem
          width: '2rem',
          height: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10, // 다른 요소 위에 오도록 z-index 설정
        }}
      >
        <BsChevronBarLeft />
      </Button>
      <div className='d-flex flex-column mt-3'>
        <div className='mb-5 mt-4'>
          <div className='d-flex justify-content-between align-items-center'>
            <h4>학생 목록</h4>
            <Button
              variant='outline-secondary'
              size='sm'
              onClick={handleRefreshParticipants}
            >
              <FaSyncAlt /> {/* 새로고침 아이콘 */}
            </Button>
          </div>
          <ListGroup className='mt-3'>
            {participants && participants.length > 0 ? (
              participants.map((student) => (
                // student 객체에 고유 ID (예: student.userId)가 있다고 가정하고 key로 사용
                <ListGroup.Item key={student.userId || student}>
                  {student.username || student} {/* student 객체에 username 속성이 있다고 가정 */}
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>참여한 학생이 없습니다.</ListGroup.Item>
            )}
          </ListGroup>
        </div>

        <div>
          <h4 className='mt-4'>문제풀이 그룹</h4>
          <InputGroup className='mb-3 mt-3'>
            <Form.Control
              placeholder='그룹 이름'
              value={newGroupName}
              onChange={(e) => {
                setNewGroupName(e.target.value);
              }}
            />
            <Button
              variant='primary'
              onClick={handleCreateGroup}
            >
              생성
            </Button>
          </InputGroup>
          <ListGroup>
            {groups && groups.length > 0 ? (
              groups.map((group) => {
                return <ListGroup.Item key={group}>{group}</ListGroup.Item>;
              })
            ) : (
              <ListGroup.Item>생성된 그룹이 없습니다.</ListGroup.Item>
            )}
          </ListGroup>
        </div>
      </div>
    </Col>
  );

  const RightMenu = () => (
    <Col
      md={2}
      className='bg-light d-flex flex-column justify-content-between p-3'
    >
      <div>
        {isManager && (
          <>
            <h4>초대 코드</h4>
            <Card className='mb-4'>
              <Card.Body className='text-center'>
                <Card.Text>{inviteCode}</Card.Text>
              </Card.Body>
            </Card>
          </>
        )}
      </div>

      {/* 채팅 기능 */}
      <div>
        <h4>채팅</h4>
        <ListGroup className='mt-3'>
          {chat && chat.length > 0 ? (
            chat.map((msg, index) => (
              <ListGroup.Item key={index}>
                <strong>{msg.sender}:</strong> {msg.message} {/* Context의 데이터 구조에 맞게 message 사용 */}
                <small className='d-block text-muted'>{msg.timestamp}</small>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>채팅 내용이 없습니다.</ListGroup.Item>
          )}
        </ListGroup>
        <InputGroup className='mt-3'>
          <Form.Control
            ref={chatInputRef}
            placeholder='메시지 입력'
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                // 한글 입력 완료 후 Enter
                handleSendChatMessage(e.target.value);
              }
            }}
          />
          <Button
            variant='primary'
            onClick={() => handleSendChatMessage(chatInputRef.current.value)}
            disabled={!chatInputRef.current?.value} // 입력값이 없으면 비활성화
          >
            전송
          </Button>
        </InputGroup>
      </div>
      {/* 강의실 나가기 버튼 */}
      <Button
        variant='danger'
        className='mt-4'
        onClick={handleLeaveClass}
      >
        강의실 나가기
      </Button>
    </Col>
  );

  if (!classroomInfo?.classroom_id) {
    // classroom_id를 기준으로 로딩 상태 판단
    return (
      <Container
        fluid
        className='vh-100 d-flex justify-content-center align-items-center'
      >
        <div>강의실 정보를 불러오는 중이거나 유효하지 않은 강의실입니다...</div>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className='vh-100'
    >
      <Row className='h-100'>
        {/* 왼쪽 패널: 학생 목록 + 그룹 (처음에 숨김 상태) */}
        {isSidebarOpen && <LeftMenu />}

        {/* 중앙 패널 */}
        <Col
          md={isSidebarOpen ? 8 : 10}
          className='bg-white d-flex flex-column align-items-center position-relative'
        >
          {/* 왼쪽 패널 열기 버튼 (초기 표시됨) */}
          {!isSidebarOpen && (
            <Button
              variant='secondary'
              onClick={() => setIsSidebarOpen(true)}
              className='p-0 me-2' // 패딩 제거로 정사각형에 가깝게
              style={{
                width: '2rem',
                height: '2rem',
                zIndex: 10,
              }}
            >
              <FaBars />
            </Button>
          )}

          <h2 className='mt-5 mb-2'>{classroomInfo?.classroom_name || '정보없음'}</h2>

          <div
            className='editor-container flex-grow-1 w-100'
            style={{ border: '1px solid #ccc', overflow: 'hidden' }} // overflow hidden 추가
          >
            <BlocklyEditor
              ref={blocklyEditorRef}
              readOnly={isManager ? !isManager : false} // 편집 가능 여부 - 추후 !isManager로 변경
              // initialXml="<xml><block type='controls_if' x='50' y='50'></block></xml>" // 초기 블록 로드 (선택 사항)
              onWorkspaceChange={(xmlString) => {
                // 워크스페이스 변경 시마다 콜백 받기 (예: 실시간 공유를 위해 WebSocket으로 전송)
                console.log('Workspace changed (XML):', xmlString);
              }}
              blocklyOptions={blocklyEditorZoomOptions}
            />
          </div>
        </Col>

        {/* 오른쪽 패널: 초대 코드 */}
        <RightMenu />
      </Row>
    </Container>
  );
};

export default ClassroomPage;
