import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card, Button, ListGroup, Badge, Offcanvas } from 'react-bootstrap';
import BlocklyEditor from '@/components/modules/blockly/BlocklyEditor';
import BlocklyStage from '@/components/modules/blockly/BlocklyStage';
import StageTest from '@/data/StageTest.json';
import * as Blockly from 'blockly';
import * as BlocklyJS from 'blockly/javascript';

const ClassroomWorkspace = ({ role = 'owner' }) => {
  // 학생 및 선생님 데이터 상태
  const [students] = useState([]);
  const [editorShow, setEditorShow] = useState(false);
  const [blocklyCode, setBlocklyCode] = useState(null);
  const blocklyWorkspaceRef = useRef(null);

  const groups = [
    { id: 1, name: '1분단', position: 'top-left' },
    { id: 2, name: '2분단', position: 'top-right' },
    { id: 3, name: '3분단', position: 'bottom-left' },
    { id: 4, name: '4분단', position: 'bottom-right' },
  ];

  const questInfo = '문제 설명입니다.';

  // Worker instance for character execution
  const [worker, setWorker] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const tickIntervalRef = useRef(null);
  const blocklyStageRef = useRef(null);

  // Initialize worker when component mounts
  useEffect(() => {
    const newWorker = new Worker(new URL('../../workers/characterWorker.js', import.meta.url));
    newWorker.onmessage = handleWorkerMessage;
    setWorker(newWorker);

    return () => {
      if (newWorker) {
        newWorker.terminate();
      }
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
    };
  }, []);

  // Start/stop tick interval based on execution state
  useEffect(() => {
    if (isExecuting && worker) {
      // Start ticking
      tickIntervalRef.current = setInterval(() => {
        worker.postMessage({ type: 'TICK' });
      }, 100); // Tick every 100ms
    } else {
      // Stop ticking
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    }
  }, [isExecuting, worker]);

  // Handle messages from the worker
  const handleWorkerMessage = (event) => {
    // eslint-disable-next-line no-unused-vars
    const { type, characterId, result, error } = event.data;

    switch (type) {
      case 'ACTION_COMPLETE':
        // Update stage with new character/object positions
        if (result.characterUpdate && blocklyStageRef.current) {
          blocklyStageRef.current.updateCharacter(result.characterUpdate);
        }
        if (result.objectsUpdate && blocklyStageRef.current) {
          blocklyStageRef.current.updateObjects(result.objectsUpdate);
        }
        break;

      case 'ERROR':
        // Stop execution on error
        setIsExecuting(false);
        if (blocklyStageRef.current) {
          blocklyStageRef.current.resetStage();
        }
        alert(`Error executing code: ${error}`);
        break;

      case 'COMPLETE':
        // Code execution completed
        setIsExecuting(false);
        break;
    }
  };

  // 실행하기 버튼 클릭 핸들러
  const handleExecute = () => {
    if (!worker) return;

    if (isExecuting) {
      // Stop execution
      worker.postMessage({ type: 'STOP' });
      setIsExecuting(false);
    } else {
      // Check if workspace reference exists
      if (!blocklyWorkspaceRef.current) {
        alert('Workspace is not ready yet. Please try again.');
        return;
      }

      // Start execution
      const code = BlocklyJS.javascriptGenerator.workspaceToCode(blocklyWorkspaceRef.current);
      console.log('Executing code:', code);

      // Validate code exists
      if (!code || code.trim() === '') {
        alert('No code to execute. Please add some blocks to your workspace.');
        return;
      }

      // Reset stage to initial state
      if (blocklyStageRef.current) {
        blocklyStageRef.current.resetStage();
      }

      worker.postMessage({
        type: 'INIT',
        gameState: testData,
        characterId: Array.isArray(testData.players) ? testData.players[0].id : testData.players.id,
        code: code,
      });
      worker.postMessage({
        type: 'START',
        characterId: Array.isArray(testData.players) ? testData.players[0].id : testData.players.id,
      });
      setIsExecuting(true);
    }
  };

  const handleSubmit = () => {
    if (isExecuting) {
      worker.postMessage({ type: 'STOP' });
      setIsExecuting(false);
    }

    // 워크스페이스 참조 확인
    if (!blocklyWorkspaceRef.current) {
      alert('코드를 제출할 수 없습니다. 워크스페이스가 준비되지 않았습니다.');
      handleClose();
      return;
    }

    try {
      // 코드 저장
      const code = BlocklyJS.javascriptGenerator.workspaceToCode(blocklyWorkspaceRef.current);
      const blocklyState = Blockly.serialization.workspaces.save(blocklyWorkspaceRef.current);
      
      // 코드 상태 저장
      setBlocklyCode(blocklyState);

      // 여기에 제출 로직 추가 (서버에 저장 등)
      console.log('Submitting code:', code);
      console.log('Blockly state:', blocklyState);

      // 성공 메시지 표시
      alert('코드가 성공적으로 제출되었습니다.');
      
      // 에디터 닫기
      setEditorShow(false);
    } catch (error) {
      console.error('제출 중 오류 발생:', error);
      alert('코드 제출 중 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    // 워크스페이스 참조 확인 및 코드 저장
    if (blocklyWorkspaceRef.current) {
      try {
        const blocklyCode = Blockly.serialization.workspaces.save(blocklyWorkspaceRef.current);
        setBlocklyCode(blocklyCode);
      } catch (error) {
        console.error('Blockly 코드 저장 중 오류 발생:', error);
      }
    }
    
    // 에디터 닫기
    setEditorShow(false);
  };

  const handleCoingBtn = () => {
    // 에디터 열기
    setEditorShow(true);
    
    // 이전에 저장된 코드가 있으면 콘솔에 출력 (디버깅용)
    if (blocklyCode) {
      console.log('Loading saved blockly code:', blocklyCode);
    }
  };

  const handleBlocklyEditorReady = useCallback(
    (workspace) => {
      blocklyWorkspaceRef.current = workspace;
    },
    [blocklyWorkspaceRef],
  );

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <Badge
        bg='success'
        className='ms-2'
      >
        제출
      </Badge>
    ) : (
      <Badge
        bg='secondary'
        className='ms-2'
      >
        미제출
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

  const EditorCanvas = () => {
    return (
      <Container
        fluid
        className='m-0 p-0'
        style={{ width: '100', height: '85vh' }}
      >
        <Row
          className='d-flex flex-row p-0 m-0 w-100'
          style={{ height: '5%' }}
        >
          <Card className='m-0'>
            <Button
              variant='primary'
              className='m-0 text-wrap'
              style={{ width: '13%', position: 'absolute', left: 0 }}
              onClick={handleClose}
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
          {/* 문제 설명 */}
          <Container className='d-flex flex-column w-25 h-100 '>
            <Card className='m-0 h-25 p-0'>
              <Card.Body className='p-0'>
                <BlocklyStage
                  ref={blocklyStageRef}
                  initialStage={testData}
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
          {/* 코딩 에디터 컴포넌트 */}
          <Container className='d-flex w-75'>
            <BlocklyEditor
              ref={blocklyWorkspaceRef}
              readOnly={false}
              initialBlocks={blocklyCode}
              onWorkspaceReady={handleBlocklyEditorReady}
            />
          </Container>
        </Row>
      </Container>
    );
  };

  const testData = StageTest;
  const MainClassroom = () => {
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
              <Card.Body className='d-flex flex-column p-2'>
                <div
                  className='d-flex flex-column justify-content-between flex-grow-1 p-1'
                  style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                >
                  <div className='d-flex flex-grow-1 mb-2 h-50'>
                    <BlocklyStage
                      ref={blocklyStageRef}
                      initialStage={testData}
                    />
                  </div>
                </div>

                {/* 실행하기 버튼 */}
                {role === 'owner' && (
                  <div className='d-flex justify-content-center mt-3 mb-2'>
                    <Button
                      variant={isExecuting ? 'danger' : 'success'}
                      className='px-5'
                      style={{ width: '200px' }}
                      onClick={handleExecute}
                    >
                      {isExecuting ? '중지하기' : '실행하기'}
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
  role: PropTypes.oneOf(['student', 'teacher']), // 'student' or 'teacher'
};

export default ClassroomWorkspace;
