import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';

const ClassroomWorkspace = ({ role = 'student' }) => {
  // 학생 및 선생님 데이터 상태
  const [students] = useState([]);

  const groups = [
    { id: 1, name: '1분단', position: 'top-left' },
    { id: 2, name: '2분단', position: 'top-right' },
    { id: 3, name: '3분단', position: 'bottom-left' },
    { id: 4, name: '4분단', position: 'bottom-right' },
  ];

  const questInfo = '문제 설명입니다.';

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

  const renderStudentList = () => {
    if (students.length === 0) {
      return (
        <ListGroup.Item className='text-center'>
          <span style={{ color: 'gray' }}>학생이 없습니다.</span>
        </ListGroup.Item>
      );
    }
    students.map((student) => {
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
    });
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

              {/* 실행하기 버튼 */}
              {role === 'student' && (
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
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* 오른쪽: 방 정보 및 학생 목록 */}
        <Col md={4}>
          <Card
            className='mb-3'
            style={{ borderColor: 'orange', height: '40vh' }}
          >
            <Card.Body>
              <h4>문제 설명</h4>
              <div>{questInfo}</div>
            </Card.Body>
          </Card>

          <Card style={{ borderColor: 'skyblue' }}>
            <Card.Body>
              <h4>학생 목록</h4>
              <ListGroup className='mt-3'>{renderStudentList()}</ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

ClassroomWorkspace.propTypes = {
  role: PropTypes.oneOf(['student', 'teacher']), // 'student' or 'teacher'
};

export default ClassroomWorkspace;
