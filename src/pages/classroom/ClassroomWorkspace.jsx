import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import BlocklyEditor from '@/components/modules/blockly/BlocklyEditor';
import BlocklyStage from '@/components/modules/blockly/BlocklyStage';
import StageTest from '@/data/StageTest.json';
import * as BlocklyJS from 'blockly/javascript';
import * as Blockly from 'blockly'; // Blockly 코어 모듈 임포트

const ClassroomWorkspace = ({ role = 'owner' }) => {
  const [editorShow, setEditorShow] = useState(false);
  const [blocklyCode, setBlocklyCode] = useState(''); // 제출된 코드를 저장
  const [savedWorkspaceState, setSavedWorkspaceState] = useState(null); // 워크스페이스 상태 저장
  const blocklyWorkspaceRef = useRef(null);
  const blocklyStageRef = useRef(null);

  const handleExecute = () => {
    if (!blocklyCode) {
      alert('제출된 코드가 없습니다. 먼저 코드를 작성하고 제출해주세요.');
      return;
    }

    // BlocklyStage의 runCode 메서드를 호출하여 코드 실행
    if (blocklyStageRef.current) {
      blocklyStageRef.current.executeCode();
    }
  };

  const handleSubmit = () => {
    if (!blocklyWorkspaceRef.current) {
      alert('워크스페이스가 준비되지 않았습니다.');
      return;
    }

    try {
      const code = BlocklyJS.javascriptGenerator.workspaceToCode(blocklyWorkspaceRef.current); // Blockly.Workspace 객체 전달
      setBlocklyCode(code); // 제출된 코드를 상태로 저장

      // 워크스페이스 상태 저장
      if (Blockly.serialization && Blockly.serialization.workspaces && blocklyWorkspaceRef.current) {
        const currentState = Blockly.serialization.workspaces.save(blocklyWorkspaceRef.current);
        setSavedWorkspaceState(currentState);
      }

      alert('코드가 성공적으로 제출되었습니다.');
      setEditorShow(false); // 에디터 닫기
    } catch (error) {
      console.error('코드 제출 중 오류 발생:', error);
      alert('코드 제출 중 오류가 발생했습니다.');
    }
  };

  const handleBlocklyEditorReady = useCallback((workspace) => {
    blocklyWorkspaceRef.current = workspace; // Blockly.Workspace 객체 저장
  }, []);

  const handleCoingBtn = () => {
    setEditorShow(true);
  };

  const renderStudentList = () => {
    return (
      <ListGroup.Item className='text-center'>
        <span style={{ color: 'gray' }}>학생이 없습니다.</span>
      </ListGroup.Item>
    );
  };

  const EditorCanvas = () => {
    return (
      <Container
        fluid
        className='m-0 p-0'
        style={{ width: '100%', height: '85vh' }} // width를 '100%'로 수정
      >
        <Row
          className='d-flex flex-row p-0 m-0 w-100'
          style={{ height: '5%' }}
        >
          <Card className='m-0'>
            <Button
              variant='primary'
              className='m-0 text-wrap'
              style={{ width: 'auto', minWidth: '150px', position: 'absolute', left: 0 }} // 너비 자동 조정 및 최소 너비 설정
              onClick={() => {
                // 워크스페이스 상태 저장
                if (Blockly.serialization && Blockly.serialization.workspaces && blocklyWorkspaceRef.current) {
                  const currentState = Blockly.serialization.workspaces.save(blocklyWorkspaceRef.current);
                  setSavedWorkspaceState(currentState);
                }
                setEditorShow(false);
              }}
            >
              {'< '}문제 크게 보기
            </Button>
            <Card.Body className='p-0 d-flex align-items-center justify-content-center'>
              <Card.Text className='m-0 p-0 fw-bold fs-3 text-center'>문제 풀기</Card.Text>
            </Card.Body>
          </Card>
        </Row>
        <Row
          className='d-flex flex-row p-2 m-0 w-100'
          style={{ width: '100%', height: '95%' }}
        >
          <Container className='d-flex flex-column w-25 h-100'>
            <Card className='m-0 h-25 p-0'>
              <Card.Body className='p-0'>
                <BlocklyStage
                  ref={blocklyStageRef}
                  initialStage={StageTest}
                  jsCode={blocklyCode}
                />
              </Card.Body>
            </Card>
            <Card className='m-0 mt-3 h-75'>
              <Card.Body>
                <Card.Text>문제 설명</Card.Text>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className='m-0 p-0'>
                <Button
                  variant='success'
                  className='m-0'
                  style={{ width: '100%', height: '100%' }}
                  onClick={handleSubmit}
                >
                  제출하기
                </Button>
              </Card.Body>
            </Card>
          </Container>
          <Container className='d-flex w-75'>
            <BlocklyEditor
              readOnly={false}
              onWorkspaceReady={handleBlocklyEditorReady}
              initialBlocks={savedWorkspaceState} // 저장된 워크스페이스 상태 전달
            />
          </Container>
        </Row>
      </Container>
    );
  };

  const MainClassroom = () => {
    return (
      <Container
        fluid
        className='p-3'
      >
        <Row>
          <Col md={8}>
            <Card
              className='classroom-layout'
              style={{ height: '80vh' }}
            >
              <Card.Body className='d-flex flex-column p-2'>
                <div
                  className='d-flex flex-column justify-content-between flex-grow-1 p-1'
                  style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                >
                  <div className='d-flex flex-grow-1 mb-2 h-50'>
                    <BlocklyStage
                      ref={blocklyStageRef}
                      initialStage={StageTest}
                      jsCode={blocklyCode}
                    />
                  </div>
                </div>
                {role === 'owner' && (
                  <div className='d-flex justify-content-center mt-3 mb-2'>
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
          <Col md={4}>
            <Card
              className='mb-3'
              style={{ borderColor: 'orange', height: '40vh' }}
            >
              <Card.Body>
                <h4>문제 설명</h4>
                <div>문제 설명입니다.</div>
              </Card.Body>
            </Card>
            <Card style={{ borderColor: 'skyblue' }}>
              <Card.Body>
                <h4>학생 목록</h4>
                <ListGroup className='mt-3'>{renderStudentList()}</ListGroup>
              </Card.Body>
            </Card>
            <Button
              variant='success'
              className='my-5'
              style={{ width: '100%' }}
              onClick={handleCoingBtn}
            >
              코딩하기
            </Button>
          </Col>
        </Row>
      </Container>
    );
  };

  return <>{editorShow ? <EditorCanvas /> : <MainClassroom />}</>;
};

ClassroomWorkspace.propTypes = {
  role: PropTypes.oneOf(['student', 'teacher']),
};

export default ClassroomWorkspace;
