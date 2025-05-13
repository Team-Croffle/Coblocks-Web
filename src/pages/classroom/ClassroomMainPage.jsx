import React, { useState } from 'react';
import { Button, Container, Modal, Form, Row, Col, Card, Spinner } from 'react-bootstrap';
import { FaRegPenToSquare } from 'react-icons/fa6'; // 강의실 개설 아이콘
import { MdExitToApp } from 'react-icons/md'; // 강의실 접속 아이콘 추가
import { FaSchool } from 'react-icons/fa'; // 강의실 아이콘 추가
import { useNavigate } from 'react-router-dom';
import { getSupabaseAccessToken } from '@utils/supabase';

const ClassroomPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classroomName, setClassroomName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isConnectLoading, setIsConnectLoading] = useState(false);
  const navigate = useNavigate();

  // 강의실 개설 모달 열기
  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  // 강의실 개설 모달 닫기
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setClassroomName('');
  };

  // 강의실 접속 모달 열기
  const handleOpenJoinModal = () => {
    setShowJoinModal(true);
  };

  // 강의실 접속 모달 닫기
  const handleCloseJoinModal = () => {
    setShowJoinModal(false);
    setInviteCode('');
  };

  // 강의실 개설
  const handleCreateClassroom = async () => {
    setIsConnectLoading(true);
    try {
      // supabase_access_token 가져오기
      const supabase_access_token = await getSupabaseAccessToken();
      if (!supabase_access_token) {
        // supabase_access_token이 없으면 로그아웃 상태로 간주
        alert('로그인이 필요합니다.');
        // 로그인 페이지로 리다이렉트
        navigate('/login');
        return;
      }

      // api 요청 - 강의실 개설
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/classrooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabase_access_token}`,
        },
        body: JSON.stringify({
          classroom_name: classroomName,
        }),
      });

      // 응답 처리
      const data = await response.json();

      if (data.success && data.classroom) {
        // 강의실 생성 성공
        const newClassroomInfo = data.classroom;
        // 강의실 정보 저장
        localStorage.setItem('currentClassroomInfo', JSON.stringify(newClassroomInfo));
        handleCloseCreateModal();
        // 강의실 페이지로 이동
        navigate('/classroom');
      }
    } catch (error) {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.error('Error creating classroom:', error);
      }
      alert('강의실 생성 중 오류가 발생했습니다.');
    } finally {
      setIsConnectLoading(false);
    }
  };

  const handleJoinClassroom = async () => {
    setIsConnectLoading(true);
    try {
      // supabase_access_token 가져오기
      const supabase_access_token = await getSupabaseAccessToken();
      // 초대 코드 공백 제거 및 대문자로 변환
      setInviteCode((prev) => prev.trim().toUpperCase());

      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('inviteCode:', inviteCode);
        console.log('supabase_access_token:', supabase_access_token);
      }

      if (!inviteCode) {
        alert('초대 코드를 입력하세요.');
        return;
      }
      if (!supabase_access_token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }
      // api 요청 - 강의실 접속
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/classrooms/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabase_access_token}`,
        },
        body: JSON.stringify({
          inviteCode: inviteCode,
        }),
      });

      // 응답 처리
      const data = await response.json();

      if (response.ok && data.success && data.classroom) {
        const newClassroomInfo = data.classroom;
        localStorage.setItem('currentClassroomInfo', JSON.stringify(newClassroomInfo));
      }

      handleCloseJoinModal();

      // 실제 classroom으로 이동
      navigate('/classroom');
    } catch (error) {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.error('Error joining classroom:', error);
      }
      alert('강의실 접속 중 오류가 발생했습니다.');
    } finally {
      setIsConnectLoading(false);
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
                onChange={() => {
                  // setMaxParticipants(e.target.value);
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
            {/* 강의실 개설 버튼 */}
            {isConnectLoading ? (
              <Spinner
                animation='border'
                size='sm'
              />
            ) : (
              '강의실 개설'
            )}
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
            {/* 강의실 접속 버튼 */}
            {isConnectLoading ? (
              <Spinner
                animation='border'
                size='sm'
              />
            ) : (
              '접속'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClassroomPage;
