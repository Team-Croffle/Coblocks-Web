import React, { useState } from 'react';
import { Button, Container, Row, Col, Card, Form, ListGroup, InputGroup } from 'react-bootstrap';

const ClassroomPage = () => {
  const [groups, setGroups] = useState([]); // 그룹 목록
  const [newGroupName, setNewGroupName] = useState(''); // 새 그룹 이름
  const [students] = useState(['학생1', '학생2', '학생3']); // 학생 목록
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 왼쪽 패널 (처음엔 숨김)
  const inviteCode = 'ABC123'; // 초대 코드

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
                  {students.map((student) => {
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
              ◀
            </Button>
          </Col>
        )}

        {/* 중앙 패널 */}
        <Col
          md={isSidebarOpen ? 8 : 10}
          className='p-4 bg-white d-flex flex-column align-items-center justify-content-center position-relative'
        >
          <h2 className='mb-4'>강의실</h2>

          <Card className='w-100 h-75 d-flex align-items-center justify-content-center bg-light'>
            <Card.Body>
              <Card.Text className='text-center text-muted'>화면 공유 중...</Card.Text>
            </Card.Body>
          </Card>

          {/* 왼쪽 패널 열기 버튼 (초기 표시됨) */}
          {!isSidebarOpen && (
            <Button
              variant='secondary'
              onClick={() => {
                setIsSidebarOpen(true);
              }}
              style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 1000 }}
            >
              ▶
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
