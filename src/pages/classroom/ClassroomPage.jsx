/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import { Button, Container, Row, Col, Card, Form, ListGroup, InputGroup, Toast } from 'react-bootstrap';
import BlocklyEditor from '@modules/blockly/BlocklyEditor';
import { useClassroom } from '@/contexts/ClassroomContext';
import socketEvents from '@services/socketEvents'; // 소켓 이벤트 상수
import { useNavigate } from 'react-router-dom';
import * as Blockly from 'blockly';
import { getSupabaseAccessToken } from '@utils/supabase';

const ClassroomPage = () => {
  const [groups, setGroups] = useState([]); // 그룹 목록
  const [newGroupName, setNewGroupName] = useState(''); // 새 그룹 이름
  const [showToast, setShowToast] = useState(false);
  const blocklyEditorRef = useRef(null);
  const chatInputRef = useRef(null); // 채팅 입력 필드 참조
  const navigate = useNavigate();
  const workspaceRef = useRef(null); // Blockly 워크스페이스 인스턴스 저장

  const {
    socket,
    chat, // 채팅 관련 데이터
    participants, // 참가자 목록
    classroomInfo, // 강의실 정보
    isManager, // 강의실 관리자 여부
    // setClassroomInfo, // 강의실 정보 설정 함수ㄹ
    socketClose, // 소켓을 명시적으로 닫아야 할 때 사용
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
    //console.log('socket:', socket);
    //console.log('chat:', chat);
    //console.log('participants:', participants);
    console.log('classroomInfo:', classroomInfo);
    //console.log('isManager:', isManager);

    //if (socket && classroomInfo?.classroom_id) {
    //  socket.emit(socketEvents.JOIN_CLASSROOM, {
    //    classroomDetails: classroomInfo,
    //  }); // 강의실에 참여합니다
    //}

    if (import.meta.env.VITE_RUNNING_MODE === 'development') {
      //console.log(`Attempting to join classroom: ${classroomInfo.classroom_id}`);
    } else {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        if (!socket) console.warn('Socket is not ready yet.');
        if (!classroomInfo?.classroom_id) console.warn('Classroom ID is not available yet.');
      }
    }
    console.log(participants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 강의실 나가기 처리
  const handleLeaveClass = async () => {
    if (window.confirm('정말로 강의실을 나가시겠습니까?')) {
      const supabase_access_token = await getSupabaseAccessToken();
      // api를 통해 강의실 나가기 요청
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/classrooms/${classroomInfo.classroom_code}/leave`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${supabase_access_token}`,
            },
          },
        );
        if (import.meta.env.VITE_RUNNING_MODE === 'development') {
          console.log('강의실 나가기 요청:', res);
        }
        if (res.ok) {
          const data = await res.json();
          if (import.meta.env.VITE_RUNNING_MODE === 'development') {
            console.log('강의실 나가기 응답:', data);
          }
          localStorage.removeItem('currentClassroomInfo'); // 로컬 스토리지에서 강의실 정보 삭제
          alert('강의실에서 나갔습니다.');
          navigate('/classroom-main'); // 강의실 나가기 후 메인 페이지로 이동
        }
      } catch (error) {
        console.error('Error leaving classroom:', error);
        alert('강의실 나가기 중 오류가 발생했습니다.');
      }
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
        socket.emit(socketEvents.SEND_MESSAGE, { message: messageText }); // Context와 동일한 이벤트 사용
        if (chatInputRef.current) {
          chatInputRef.current.value = ''; // 입력창 비우기
        }
      }
    },
    [socket, classroomInfo],
  );

  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1000);
  };

  // 서버에서 받은 블록 상태를 적용하는 함수
  const applyWorkspaceState = useCallback((state) => {
    if (workspaceRef.current && Blockly && Blockly.serialization && Blockly.serialization.workspaces) {
      try {
        Blockly.serialization.workspaces.load(state, workspaceRef.current);
      } catch (e) {
        console.error('블록 상태 적용 실패:', e);
      }
    }
  }, []);

  // 소켓 이벤트 등록 (참여자용)
  useEffect(() => {
    if (!socket) return;
    const handleReceiveBlocks = (data) => {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('Received blockly state:', data);
      }
      if (data) {
        applyWorkspaceState(data);
      }
    };
    socket.on(socketEvents.EDITOR_STATE_SYNC, handleReceiveBlocks);
    return () => {
      socket.off(socketEvents.EDITOR_STATE_SYNC, handleReceiveBlocks);
    };
  }, [socket, applyWorkspaceState]);

  // 매니저가 블록을 변경할 때 서버로 전송
  const handleWorkspaceReady = useCallback(
    (workspace) => {
      workspaceRef.current = workspace;
      if (isManager && workspace) {
        workspace.addChangeListener((event) => {
          if (!event.isUiEvent && event.type !== Blockly.Events.VIEWPORT_CHANGE) {
            try {
              const state = Blockly.serialization.workspaces.save(workspace);
              if (import.meta.env.VITE_RUNNING_MODE === 'development') {
                console.log('Sending blockly state update:', state);
              }
              socket.emit(socketEvents.EDITOR_CONTENT_CHANGE, state);
            } catch (e) {
              console.error('블록 상태 전송 실패:', e);
            }
          }
        });
      }
    },
    [isManager, socket],
  );

  const LeftMenu = () => (
    <div className='d-flex flex-column mt-3'>
      <div className='mb-4'>
        <h5 className='fw-bold text-center'>{'강의실 이름: ' + (classroomInfo?.classroom_name || '정보없음')}</h5>
      </div>
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
            participants.map((student) => {
              console.log('학생:', student);
              // student 객체에 고유 ID (예: student.userId)가 있다고 가정하고 key로 사용
              return (
                <ListGroup.Item key={student.userId || student}>
                  {student.username || student} {/* student 객체에 username 속성이 있다고 가정 */}
                </ListGroup.Item>
              );
            })
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
  );

  const RightMenu = () => (
    <div
      className='d-flex flex-column'
      style={{ height: '100%' }}
    >
      <div>
        {isManager && (
          <>
            <h4>초대 코드</h4>
            <Card
              className='mb-4 cursor-pointer'
              onClick={handleCopyInviteCode}
              style={{ cursor: 'pointer' }}
            >
              <Card.Body
                className='text-center mt-3 p-0'
                style={{ cursor: 'pointer' }}
              >
                <Card.Text className='m-0 p-0'>{inviteCode}</Card.Text>
                <Card.Text
                  className='text-muted mb-1 p-0'
                  style={{ fontSize: '0.7rem' }}
                >
                  클릭 시 복사됩니다.
                </Card.Text>
              </Card.Body>
            </Card>
            <Toast
              show={showToast}
              onClose={() => setShowToast(false)}
              delay={1000}
              autohide
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000,
              }}
            >
              <Toast.Body>복사되었습니다!</Toast.Body>
            </Toast>
          </>
        )}
      </div>

      {/* 채팅 기능 */}
      <div
        className='flex-grow-1 d-flex flex-column'
        style={{ minHeight: 0, height: '100%' }}
      >
        <h4>채팅</h4>
        <Card
          className='flex-grow-1 d-flex flex-column mt-3'
          style={{ minHeight: 0 }}
        >
          <Card.Body
            className='d-flex flex-column p-0'
            style={{ minHeight: 0 }}
          >
            <div
              className='flex-grow-1 overflow-auto p-3'
              style={{ minHeight: 0 }}
            >
              {chat && chat.length > 0 ? (
                chat.map((msg, index) => (
                  <div
                    key={index}
                    className='mb-2'
                  >
                    <strong>{msg.sender}:</strong> {msg.message}
                    <small className='d-block text-muted'>{msg.timestamp}</small>
                  </div>
                ))
              ) : (
                <div className='text-muted'>채팅 내용이 없습니다.</div>
              )}
            </div>
            <div className='border-top p-0'>
              <InputGroup>
                <Form.Control
                  ref={chatInputRef}
                  placeholder='메시지 입력'
                  className='border-0'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                      handleSendChatMessage(e.target.value);
                    }
                  }}
                />
                <Button
                  variant='primary'
                  className='border-0'
                  style={{ borderRadius: '0 0 0.25rem 0' }}
                  onClick={() => handleSendChatMessage(chatInputRef.current.value)}
                >
                  전송
                </Button>
              </InputGroup>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* 강의실 나가기 버튼 */}
      <Button
        variant='danger'
        className='mt-3'
        onClick={handleLeaveClass}
      >
        강의실 나가기
      </Button>
    </div>
  );

  if (!classroomInfo?.classroom_id) {
    return (
      <Container
        fluid
        className='d-flex justify-content-center align-items-center p-0'
        style={{ height: 'calc(100vh - 120px)' }}
      >
        <div>강의실 정보를 불러오는 중이거나 유효하지 않은 강의실입니다...</div>
      </Container>
    );
  }

  return (
    <Container
      fluid
      className='p-0'
      style={{ height: 'calc(100vh - 120px)' }}
    >
      <Row
        className='g-0'
        style={{ height: '100%' }}
      >
        {/* 왼쪽 패널: 강의실 이름 + 학생 목록 + 그룹 */}
        <Col
          md={2}
          className='bg-light d-flex flex-column p-3 border-end shadow-sm'
          style={{ height: '100%' }}
        >
          <LeftMenu />
        </Col>

        {/* 중앙 패널 */}
        <Col
          md={8}
          className='d-flex flex-column align-items-center bg-white'
          style={{ height: '100%' }}
        >
          <div
            className='editor-container flex-grow-1 w-100 px-3 pt-3'
            style={{ border: '1px solid #ccc', overflow: 'hidden' }}
          >
            <BlocklyEditor
              ref={blocklyEditorRef}
              readOnly={!isManager}
              blocklyOptions={blocklyEditorZoomOptions}
              onWorkspaceReady={handleWorkspaceReady}
            />
          </div>
        </Col>

        {/* 오른쪽 패널: 초대 코드 + 채팅 */}
        <Col
          md={2}
          className='bg-light d-flex flex-column p-3 border-start shadow-sm'
          style={{ height: '100%' }}
        >
          <RightMenu />
        </Col>
      </Row>
    </Container>
  );
};

export default ClassroomPage;
