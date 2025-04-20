import React, { useState } from 'react';
import { Button, Container, Modal, Form } from 'react-bootstrap';

const ClassroomPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [classroomName, setClassroomName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleCreateClassroom = () => {
    setClassroomName(''); // 강의실 이름 초기화
    setMaxParticipants(''); // 최대 인원 초기화
    setIsPublic(true); // 공개 여부 초기화
    setModalTitle('강의실 개설');
    setShowModal(true);
  };

  const handleJoinClassroom = () => {
    setModalTitle('강의실 접속');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    alert(`강의실 이름: ${classroomName}\n최대 인원: ${maxParticipants}\n공개 여부: ${isPublic ? '공개' : '비공개'}`);
    setShowModal(false);
  };

  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>강의실</h1>
      <div style={{ marginTop: '20px' }}>
        <Button
          onClick={() => {
            handleCreateClassroom();
          }}
          variant='primary'
          style={{ margin: '10px', fontSize: '16px' }}
        >
          강의실 개설
        </Button>
        <Button
          onClick={() => {
            handleJoinClassroom();
          }}
          variant='success'
          style={{ margin: '10px', fontSize: '16px' }}
        >
          강의실 접속
        </Button>
      </div>

      <Modal
        show={showModal}
        onHide={() => {
          handleCloseModal();
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalTitle === '강의실 개설' && (
            <Form>
              <Form.Group className='mb-3' controlId='classroomName'>
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
              <Form.Group className='mb-3' controlId='maxParticipants'>
                <Form.Label>최대 인원</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='최대 인원을 입력하세요'
                  value={maxParticipants}
                  onChange={(e) => {
                    setMaxParticipants(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='isPublic'>
                <Form.Label>공개 여부</Form.Label>
                <Form.Check
                  type='radio'
                  label='공개'
                  name='isPublic'
                  checked={isPublic}
                  onChange={() => {
                    setIsPublic(true);
                  }}
                />
                <Form.Check
                  type='radio'
                  label='비공개'
                  name='isPublic'
                  checked={!isPublic}
                  onChange={() => {
                    setIsPublic(false);
                  }}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              handleCloseModal();
            }}
          >
            취소
          </Button>
          {modalTitle === '강의실 개설' && (
            <Button
              variant='primary'
              onClick={() => {
                handleSubmit();
              }}
            >
              생성
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClassroomPage;
