import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';

const ClassroomLayoutPage = ({ role = 'student' }) => {
  // 학생 및 선생님 데이터 상태
  const [students] = useState([
    { id: 1, name: '학생1', group: 1, status: 'active' },
    { id: 2, name: '학생2', group: 2, status: 'active' },
    { id: 3, name: '학생3', group: 3, status: 'inactive' },
    { id: 4, name: '학생4', group: 4, status: 'active' },
  ]);

  const groups = [
    { id: 1, name: '1분단', position: 'top-left' },
    { id: 2, name: '2분단', position: 'top-right' },
    { id: 3, name: '3분단', position: 'bottom-left' },
    { id: 4, name: '4분단', position: 'bottom-right' },
  ];

  const roomInfo = {
    name: '수학 강의실',
    code: 'MATH101',
    teacher: '김선생님',
    time: '10:00 - 11:30',
  };

  // 실행하기 버튼 클릭 핸들러
  const handleExecute = () => {
    alert('학습 활동을 시작합니다!');
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <Badge
        bg='success'
        className='ms-2'
      >
        출석
      </Badge>
    ) : (
      <Badge
        bg='secondary'
        className='ms-2'
      >
        미출석
      </Badge>
    );
  };

  return (
    <Container
      fluid
      className='p-3'
    >
      <Row>
        {/* 왼쪽: 학생 배치도 */}
        <Col md={8}>
          <Card
            className='classroom-layout'
            style={{ height: '80vh' }}
          >
            <Card.Body className='d-flex flex-column'>
              {role === 'teacher' ? (
                // 선생님일 때 4등분 배치도
                <div
                  className='d-flex flex-column justify-content-between flex-grow-1'
                  style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                >
                  <div className='d-flex flex-grow-1 mb-2'>
                    <div
                      className='flex-fill me-1'
                      style={{ border: '1px solid #ddd', borderRadius: '6px', height: '100%' }}
                    >
                      {' '}
                    </div>
                    <div
                      className='flex-fill ms-1'
                      style={{ border: '1px solid #ddd', borderRadius: '6px', height: '100%' }}
                    >
                      {' '}
                    </div>
                  </div>
                  <div className='d-flex flex-grow-1 mt-2'>
                    <div
                      className='flex-fill me-1'
                      style={{ border: '1px solid #ddd', borderRadius: '6px', height: '100%' }}
                    >
                      {' '}
                    </div>
                    <div
                      className='flex-fill ms-1'
                      style={{ border: '1px solid #ddd', borderRadius: '6px', height: '100%' }}
                    >
                      {' '}
                    </div>
                  </div>
                </div>
              ) : (
                // 학생일 때 4등분 없는 배치도
                <div
                  className='d-flex flex-column justify-content-between flex-grow-1'
                  style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                >
                  <div className='d-flex flex-grow-1 mb-2'>
                    <div
                      className='flex-fill'
                      style={{ border: '1px solid #ddd', borderRadius: '6px', height: '100%' }}
                    >
                      {' '}
                    </div>
                  </div>
                </div>
              )}

              {/* 실행하기 버튼 */}
              <div className='d-flex justify-content-center mt-3'>
                <Button
                  variant='success'
                  className='px-5'
                  style={{ width: '200px' }}
                  onClick={handleExecute}
                >
                  실행하기
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 오른쪽: 방 정보 및 학생 목록 */}
        <Col md={4}>
          <Card
            className='mb-3'
            style={{ borderColor: 'orange' }}
          >
            <Card.Body>
              <h4>방 정보</h4>
              <div>강의명: {roomInfo.name}</div>
              <div>방 코드: {roomInfo.code}</div>
              <div>담당 교사: {roomInfo.teacher}</div>
              <div>수업 시간: {roomInfo.time}</div>
            </Card.Body>
          </Card>

          <Card style={{ borderColor: 'skyblue' }}>
            <Card.Body>
              <h4>학생 목록</h4>
              <ListGroup className='mt-3'>
                {students.map((student) => {
                  const groupName = groups.find((g) => g.id === student.group).name;
                  return (
                    <ListGroup.Item
                      key={student.id}
                      className='d-flex justify-content-between align-items-center'
                      style={{ borderColor: 'blue' }}
                    >
                      <div className='d-flex align-items-center'>
                        <span style={{ color: 'purple' }}>{student.name}</span>
                        <span className='ms-2'>({groupName})</span>
                      </div>
                      {getStatusBadge(student.status)}
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

ClassroomLayoutPage.propTypes = {
  role: PropTypes.oneOf(['student', 'teacher']), // 'student' or 'teacher'
};

export default ClassroomLayoutPage;
