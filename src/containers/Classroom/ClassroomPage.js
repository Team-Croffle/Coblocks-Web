import React, { useState } from 'react';
import { Button, Container, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import { FaRegPenToSquare } from 'react-icons/fa6'; // 강의실 개설 아이콘
import { MdExitToApp } from 'react-icons/md'; // 강의실 접속 아이콘 추가
import { FaSchool } from 'react-icons/fa'; // 강의실 아이콘 추가

const ClassroomPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classroomName, setClassroomName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(0);
  const [inviteCode, setInviteCode] = useState('');

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
              />
            </Form.Group>
            <Form.Group controlId='maxParticipants' className='mt-3'>
              <Form.Label>최대 인원</Form.Label>
              <Form.Control
                type='number'
                min='0'
                placeholder='최대 인원을 입력하세요'
                value={maxParticipants}
                onChange={(e) => {
                  setMaxParticipants(Number(e.target.value));
                }}
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
            onClick={() => {
              alert('강의실 생성');
            }}
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
            onClick={() => {
              alert(`입력된 초대 코드/URL: ${inviteCode}`);
            }}
          >
            접속
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClassroomPage;
