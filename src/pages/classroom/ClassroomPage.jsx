/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { BsChevronBarLeft } from 'react-icons/bs';
import { Button, Container, Row, Col, Card, Form, ListGroup, InputGroup } from 'react-bootstrap';
import BlocklyEditor from '@modules/blockly/BlocklyEditor';
import { useClassroom } from '@/contexts/ClassroomContextProvider';

const ClassroomPage = () => {
  const [groups, setGroups] = useState([]); // 그룹 목록
  const [newGroupName, setNewGroupName] = useState(''); // 새 그룹 이름
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 왼쪽 패널 (처음엔 숨김)
  const blocklyEditorRef = useRef(null);

  const {
    socket,
    chat, // 채팅 관련 데이터
    participants, // 참가자 목록
    classroomInfo, // 강의실 정보
    setClassroomInfo, // 강의실 정보 설정 함수
    socketClose, // 소켓을 명시적으로 닫아야 할 때 사용
  } = useClassroom();

  const inviteCode = classroomInfo.classroom_code;

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

  // 강의실 나가기 처리
  const handleLeaveClass = () => {
    if (window.confirm('정말로 강의실을 나가시겠습니까?')) {
      alert('강의실을 나갔습니다.');
    }
  };

  // 그룹 생성 처리
  const handleCreateGroup = () => {
    if (newGroupName.trim() !== '') {
      setGroups((prevGroups) => {
        return [...prevGroups, newGroupName.trim()];
      });
      setNewGroupName('');
    }
  };

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

  return (
    <Container
      fluid
      className='vh-100'
    >
      <Row className='h-100'>
        {/* 왼쪽 패널: 학생 목록 + 그룹 (처음에 숨김 상태) */}
        {isSidebarOpen && (
          <Col
            md={2}
            className='bg-light d-flex flex-column justify-content-between p-3 position-relative'
          >
            <div>
              <div className='mb-5 mt-4'>
                <h4>학생 목록</h4>
                <ListGroup className='mt-3'>
                  {participants.map((student) => {
                    return <ListGroup.Item key={student}>{student}</ListGroup.Item>;
                  })}
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
                  {groups.map((group) => {
                    return <ListGroup.Item key={group}>{group}</ListGroup.Item>;
                  })}
                </ListGroup>
              </div>
            </div>

            {/* 왼쪽 패널 접기 버튼 */}
            <Button
              variant='secondary'
              onClick={() => {
                setIsSidebarOpen(false);
              }}
              style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000 }}
            >
              <BsChevronBarLeft />
            </Button>
          </Col>
        )}

        {/* 중앙 패널 */}
        <Col
          md={isSidebarOpen ? 8 : 10}
          className='p-4 bg-white d-flex flex-column align-items-center justify-content-center position-relative'
        >
          <h2 className='mb-4'>강의실</h2>

          <div
            className='editor-container'
            style={{ height: '500px', width: '80%', margin: '20px auto', border: '1px solid #ccc' }}
          >
            <BlocklyEditor
              readOnly={false} // 편집 가능 여부
              ref={blocklyEditorRef}
              // initialXml="<xml><block type='controls_if' x='50' y='50'></block></xml>" // 초기 블록 로드 (선택 사항)
              onWorkspaceChange={(xmlString) => {
                // 워크스페이스 변경 시마다 콜백 받기 (예: 실시간 공유를 위해 WebSocket으로 전송)
                console.log('Workspace changed (XML):', xmlString);
              }}
              blocklyOptions={blocklyEditorZoomOptions}
            />
          </div>

          {/* 왼쪽 패널 열기 버튼 (초기 표시됨) */}
          {!isSidebarOpen && (
            <Button
              variant='secondary'
              onClick={() => {
                setIsSidebarOpen(true);
              }}
              style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 1000 }}
            >
              <FaBars />
            </Button>
          )}
        </Col>

        {/* 오른쪽 패널: 초대 코드 */}
        <Col
          md={2}
          className='bg-light p-3'
        >
          <div>
            <div className='d-flex justify-content-between align-items-center'>
              <h4>초대 코드</h4>
              <Button
                variant='danger'
                size='sm'
                onClick={handleLeaveClass}
              >
                나가기
              </Button>
            </div>
            <Card className='mb-4'>
              <Card.Body className='text-center'>
                <Card.Text>{inviteCode}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ClassroomPage;
