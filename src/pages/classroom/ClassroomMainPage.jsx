import React, { useState } from 'react';
import { Button, Container, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaRegPenToSquare } from 'react-icons/fa6'; // 강의실 개설 아이콘
import { MdExitToApp } from 'react-icons/md'; // 강의실 접속 아이콘 추가
import { FaSchool } from 'react-icons/fa'; // 강의실 아이콘 추가
import { useClassroom } from '@/contexts/ClassroomContextProvider';
import { useNavigate } from 'react-router-dom';
import socketEvents from '@/data/socketEvents';

const ClassroomPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classroomName, setClassroomName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(0);
  const [inviteCode, setInviteCode] = useState('');
  const navigate = useNavigate;
  // useClassroom 훅을 사용하여 ClassroomContext의 값들을 가져옵니다.
  const {
    socket,
    setClassroomInfo, // 소켓을 명시적으로 닫아야 할 때 사용
  } = useClassroom();

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setClassroomName('');
    setMaxParticipants(0);
  };

  const handleOpenJoinModal = () => {
    setShowJoinModal(true);
  };

  const handleCloseJoinModal = () => {
    setShowJoinModal(false);
    setInviteCode('');
  };

  const handleCreateClassroom = async () => {
    const supabase_access_token = localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_ID}-auth-token`);
    if (!supabase_access_token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_URL_API}/api/classrooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabase_access_token}`,
        },
        body: JSON.stringify({
          name: classroomName,
          max_participants: maxParticipants,
        }),
      });
      const data = await response.json();
      if (data.success && data.classroom) {
        const newClassroomInfo = data.classroom;
        localStorage.setItem('currentClassroomInfo', JSON.stringify(newClassroomInfo));
        setClassroomInfo();
        socket.setupSocket(); // 소켓을 설정합니다.
        socket.setupClassroom(newClassroomInfo); // 소켓에 강의실 정보를 설정합니다.
        socket.emit(socketEvents.JOIN_CLASSROOM, {
          classroomDetails: newClassroomInfo,
        }); // 강의실에 참여합니다.
      }
      navigate('/classroom');
      handleCloseCreateModal();
    } catch (error) {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.error('Error creating classroom:', error);
      }
      alert('강의실 생성 중 오류가 발생했습니다.');
    }
  };

  const handleJoinClassroom = async () => {
    setInviteCode((prev) => prev.trim().toUpperCase());
    if (!inviteCode) {
      alert('초대 코드를 입력하세요.');
      return;
    }
    const supabase_access_token = localStorage.getItem(`sb-${import.meta.env.VITE_SUPABASE_ID}-auth-token`);
    if (!supabase_access_token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_URL_API}/api/classrooms/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabase_access_token}`,
        },
        body: JSON.stringify({ inviteCode }),
      });
      const data = await response.json();
      if (response.ok && data.success && data.classroom) {
        const newClassroomInfo = data.classroom;
        localStorage.setItem('currentClassroomInfo', JSON.stringify(newClassroomInfo));
        setClassroomInfo();
        socket.setupSocket(); // 소켓을 설정합니다.
        socket.setupClassroom(newClassroomInfo); // 소켓에 강의실 정보를 설정합니다.
        socket.emit(socketEvents.JOIN_CLASSROOM, {
          classroomDetails: newClassroomInfo,
        }); // 강의실에 참여합니다.
      }
      navigate('/classroom');
      handleCloseJoinModal();
    } catch (error) {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.error('Error joining classroom:', error);
      }
      alert('강의실 접속 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container style={{ marginTop: '50px' }}>
      {/* 강의실 제목 박스 */}
      <Card
        className='text-center mb-4'
        style={{
          display: 'flex', // 박스를 flex 컨테이너로 설정
          justifyContent: 'center', // 수평 중앙 정렬
          alignItems: 'center', // 수직 중앙 정렬
          border: '2px solid #ccc',
          borderRadius: '10px',
          padding: '10px 20px', // 텍스트와 테두리 간의 여백 최소화
          backgroundColor: '#f9f9f9',
          width: 'fit-content', // 텍스트 크기에 맞게 박스 크기 조정
          margin: '0 auto', // 박스를 화면 중앙으로 정렬
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaSchool style={{ marginRight: '10px', fontSize: '24px', color: '#007bff' }} />
          <Card.Title style={{ fontSize: '20px', margin: 0 }}>강의실</Card.Title>
        </div>
      </Card>

      {/* 버튼 그룹 */}
      <Row className='justify-content-center mb-4'>
        <Col xs='auto'>
          <Button
            onClick={() => {
              handleOpenCreateModal();
            }}
            variant='primary'
            className='d-flex align-items-center gap-2'
          >
            <FaRegPenToSquare />
            강의실 개설
          </Button>
        </Col>
        <Col xs='auto'>
          <Button
            onClick={() => {
              handleOpenJoinModal();
            }}
            variant='success'
            className='d-flex align-items-center gap-2'
          >
            <MdExitToApp />
            강의실 접속
          </Button>
        </Col>
      </Row>

      {/* 강의실 개설 모달 */}
      <Modal
        show={showCreateModal}
        onHide={() => {
          handleCloseCreateModal();
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>강의실 개설</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='classroomName'>
              <Form.Label>강의실 이름</Form.Label>
              <Form.Control
                type='text'
                placeholder='강의실 이름을 입력하세요'
                value={classroomName}
                onChange={(e) => {
                  setClassroomName(e.target.value);
                }}
                required
              />
            </Form.Group>
            <Form.Group
              controlId='maxParticipants'
              className='mt-3'
            >
              <Form.Label>최대 인원</Form.Label>
              <Form.Control
                type='number'
                min='0'
                placeholder='최대 인원(개발 중)'
                onChange={(e) => {
                  setMaxParticipants(Number(e.target.value));
                }}
                disabled={true}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              handleCloseCreateModal();
            }}
          >
            취소
          </Button>
          <Button
            variant='primary'
            onClick={handleCreateClassroom}
          >
            생성
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 강의실 접속 모달 */}
      <Modal
        show={showJoinModal}
        onHide={() => {
          handleCloseJoinModal();
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>강의실 접속</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId='inviteCode'>
              <Form.Label>초대 코드 또는 URL</Form.Label>
              <Form.Control
                type='text'
                placeholder='초대 코드 또는 URL을 입력하세요'
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              handleCloseJoinModal();
            }}
          >
            취소
          </Button>
          <Button
            variant='primary'
            onClick={handleJoinClassroom}
            disabled={!inviteCode}
          >
            접속
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClassroomPage;
