import React, { useState } from 'react';
import { Button, Container, Row, Col, Card, Form, ListGroup, InputGroup } from 'react-bootstrap';

const ClassroomPage = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [students] = useState(['학생1', '학생2', '학생3']);
  const inviteCode = 'ABC123';

  const handleLeaveClass = () => {
    if (window.confirm('정말로 강의실을 나가시겠습니까?')) {
      alert('강의실을 나갔습니다.');
    }
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim() !== '') {
      setGroups((prevGroups) => {
        return [...prevGroups, newGroupName.trim()];
      });
      setNewGroupName('');
    }
  };

  /*const Ex1 = () => {
    return (
      <div></div>
    )
  };*/

  return (
    <Container fluid className='vh-100'>
      <Row className='h-100'>
        {/* 왼쪽 사이드바 */}
        <Col md={2} className='bg-light d-flex flex-column justify-content-between p-3'>
          <div>
            <h4>초대 코드</h4>
            <Card className='mb-4'>
              <Card.Body className='text-center'>
                <Card.Text>{inviteCode}</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <Button variant='danger' onClick={handleLeaveClass}>
            강의실 나가기
          </Button>
        </Col>

        {/* 메인 화면 */}
        <Col md={8} className='p-4 bg-white d-flex flex-column align-items-center justify-content-center'>
          <h2 className='mb-4'>강의실</h2>
          <Card className='w-100 h-75 d-flex align-items-center justify-content-center bg-light'>
            <Card.Body>
              <Card.Text className='text-center text-muted'>화면 공유 중...</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* 오른쪽 사이드바 */}
        <Col md={2} className='bg-light p-3'>
          <div className='mb-5'>
            <h4>학생 목록</h4>
            <ListGroup>
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
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Button variant='primary' onClick={handleCreateGroup}>
                생성
              </Button>
            </InputGroup>
            <ListGroup>
              {groups.map((group) => (
                <ListGroup.Item key={group}>{group}</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ClassroomPage;
