import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { useClassroom } from '@/contexts/ClassroomContext';
import { useNavigate } from 'react-router-dom';
import BlocklyEditor from '@/components/modules/blockly/BlocklyEditor';
import BlocklyStage from '@/components/modules/blockly/BlocklyStage';
import * as BlocklyJS from 'blockly/javascript';
import * as Blockly from 'blockly'; // Blockly 코어 모듈 임포트
import socketEvents from '@/services/socketEvents';

const ClassroomWorkspace = () => {
  const [editorShow, setEditorShow] = useState(false);
  const [blocklyCode, setBlocklyCode] = useState('');
  const [savedWorkspaceState, setSavedWorkspaceState] = useState(null);
  const [initialStageInfo, setInitialStageInfo] = useState({});
  const blocklyWorkspaceRef = useRef(null);
  const navigate = useNavigate();
  // const blocklyStageRef = useRef(null); // MainClassroom 내에서 사용됩니다.

  const {
    socket,
    participants,
    isManager,
    isRunTrigger, // 컨텍스트에서 제공 (FINAL_SUBMISSIONS_DATA 이벤트로 true가 됨)
    setIsRunTrigger, // UI 즉시 반응 또는 로컬 중지를 위해 필요할 수 있음
    questInfo,
    activityInfo, // 컨텍스트에서 제공 (제출 상태, 제출 코드 등 포함)
    // resetActivityStates, // 컨텍스트의 resetActivityStates를 직접 사용하지 않음
  } = useClassroom();

  // 실행 시도 상태를 관리하는 로컬 상태
  const [attemptingExecution, setAttemptingExecution] = useState(false);

  useEffect(() => {
    // questInfo가 유효한 객체일 때만 initialStageInfo 설정
    if (questInfo && Object.keys(questInfo).length > 0) {
      setInitialStageInfo(questInfo);
    }
  }, [questInfo]); // questInfo가 변경될 때만 실행

  // 이 useEffect는 이제 관리자에게 제출 상태를 알리거나,
  // 서버로부터 FINAL_SUBMISSIONS_DATA를 기다리는 동안의 UI 처리에 사용될 수 있습니다.
  // 직접 setIsRunTrigger(true)를 호출하는 로직은 제거합니다.
  useEffect(() => {
    if (attemptingExecution && isManager) {
      // 관리자에게만 알림
      if (activityInfo && activityInfo.summitted && typeof activityInfo.summitted === 'object') {
        const allSubmitted = Object.values(activityInfo.summitted).every((status) => status === true);
        if (!allSubmitted) {
          alert('아직 모든 학생이 제출하지 않았습니다. 학생 목록에서 제출 상태를 확인해주세요.');
          // 이 알림은 서버가 FINAL_SUBMISSIONS_DATA를 보내기 전에 관리자에게만 표시될 수 있습니다.
        }
      }
      // 실행 시도 상태는 서버 응답(FINAL_SUBMISSIONS_DATA 또는 오류) 후 초기화하는 것이 더 적절할 수 있습니다.
      // 여기서는 요청 후 바로 false로 설정합니다.
      setAttemptingExecution(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityInfo, attemptingExecution, isManager]); // setIsRunTrigger 의존성 제거

  const handleExecute = async () => {
    if (attemptingExecution) {
      alert('이미 실행 요청 처리 중입니다.');
      return;
    }

    if (!socket) {
      alert('서버와 연결되지 않았습니다.');
      return;
    }

    if (!isManager) {
      alert('관리자만 실행할 수 있습니다.');
      return;
    }

    setAttemptingExecution(true); // UI 표시용
    alert('모든 참여자의 최종 제출 현황을 서버에 요청합니다. 서버가 응답하면 모든 참여자의 코드가 실행됩니다.');
    socket.emit(socketEvents.REQUEST_FINAL_SUBMISSION);
    // 서버는 이 요청을 받고, 모든 제출 데이터를 취합한 후,
    // 모든 클라이언트에게 FINAL_SUBMISSIONS_DATA 이벤트를 보내야 합니다.
    // setIsRunTrigger(true)는 여기서 직접 호출하지 않고, ContextProvider에서 처리합니다.
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
      setEditorShow(false); // 에디터 닫기

      socket.emit(socketEvents.SUBMIT_SOLUTION, {
        submissionContent: code,
      });
    } catch (error) {
      console.error('코드 제출 중 오류 발생:', error);
      alert('코드 저장 중 오류가 발생했습니다.');
    }
  };

  const handleBlocklyEditorReady = useCallback((workspace) => {
    blocklyWorkspaceRef.current = workspace; // Blockly.Workspace 객체 저장
  }, []);

  const handleCodingBtn = () => {
    setEditorShow(true);
  };

  const handleStopBtn = async () => {
    if (socket) {
      // 서버에 활동 종료 요청
      await socket.emit(socketEvents.REQUEST_END_ACTIVITY);
    }
    // UI 즉시 반영을 위해 로컬에서 isRunTrigger를 false로 설정
    // 실제 상태 초기화는 서버로부터 ACTIVITY_ENDED 이벤트를 받아 컨텍스트에서 처리
    if (setIsRunTrigger) {
      setIsRunTrigger(false);
    }
    navigate('/classroom');
  };

  const handleResetBtn = async () => {
    if (socket) {
      // 스테이지 리셋을 위한 이벤트 발송
      await socket.emit(socketEvents.REQUEST_RESET_STAGE);
    }
    // 실행 상태와 시도 상태를 모두 초기화
    if (setIsRunTrigger) {
      setIsRunTrigger(false); // 실행 중지
    }
    setAttemptingExecution(false); // 실행 시도 상태 초기화
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
          <Card
            className='m-0 p-0'
            style={{ height: '100%', flexDirection: 'row' }}
          >
            <Button
              variant='primary'
              className='m-0 p-0 text-wrap'
              style={{ width: '10%', height: '100%', minWidth: '150px', left: 0, bottom: 0 }} // 너비 자동 조정 및 최소 너비 설정
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
              <Card.Text className='m-0 p-0 fw-bold fs-5 text-center'>문제 풀기</Card.Text>
            </Card.Body>
          </Card>
        </Row>
        <Row
          className='d-flex flex-row p-2 m-0 w-100'
          style={{ width: '100%', height: '95%' }}
        >
          <Container className='d-flex flex-column w-25 h-100 gap-2'>
            <Card className='m-0 h-30 p-0'>
              <Card.Body className='p-0'>
                <BlocklyStage
                  initialStage={initialStageInfo.default_stage}
                  isRun={isRunTrigger} // 컨텍스트에서 온 isRunTrigger 사용
                  activityInfo={activityInfo} // 컨텍스트에서 온 activityInfo 사용
                />
              </Card.Body>
            </Card>
            <Card
              className='m-0'
              style={{ borderColor: 'green' }}
            >
              <Card.Body>
                <Card.Text>내 캐릭터는 {activityInfo.activityPartNumber}번 입니다.</Card.Text>
              </Card.Body>
            </Card>
            <Card className='m-0 h-75'>
              <Card.Body>
                <Card.Text>문제 설명</Card.Text> {/* 실제 문제 설명 데이터 연동 필요 */}
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
    console.log('activityInfo:', activityInfo);
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
                      initialStage={initialStageInfo.default_stage}
                      isRun={isRunTrigger} // 컨텍스트에서 온 isRunTrigger 사용
                      activityInfo={activityInfo} // 컨텍스트에서 온 activityInfo 사용
                    />
                  </div>
                </div>
                <div className='d-flex justify-content-center align-items-center mt-3 mb-2 gap-2'>
                  {isManager === true && (
                    <div className='d-flex justify-content-center mt-3 mb-2 gap-2'>
                      <Button
                        variant='success'
                        className='px-5'
                        style={{ width: '200px' }}
                        onClick={handleExecute}
                        disabled={attemptingExecution} // 실행 요청 중에는 버튼 비활성화
                      >
                        {attemptingExecution ? '처리 중...' : '실행하기'}
                      </Button>
                      <Button
                        variant='danger'
                        className='px-5'
                        style={{ width: '200px' }} // '200 px' -> '200px'
                        onClick={handleResetBtn}
                      >
                        초기화
                      </Button>
                    </div>
                  )}
                  <div className='d-flex justify-content-center mt-3 mb-2'>
                    <Button
                      variant='success'
                      className='px-5'
                      style={{ width: '200px' }} // '200 px' -> '200px'
                      onClick={handleCodingBtn}
                    >
                      코딩하기
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className='mb-3'
              style={{ borderColor: 'green', height: '8vh' }}
            >
              <Card.Body>
                <Card.Text>내 캐릭터는 {activityInfo?.activityPartNumber}번 입니다.</Card.Text>
              </Card.Body>
            </Card>
            <Card
              className='mb-3'
              style={{ borderColor: 'orange' }}
            >
              <Card.Body>
                <h4>문제 설명</h4>
                <div>{questInfo?.quest_question}</div>
              </Card.Body>
            </Card>
            <Card style={{ borderColor: 'skyblue' }}>
              <Card.Body>
                <h4>학생 목록</h4>
                <ListGroup className='mt-3'>
                  {participants && participants.length > 0 ? (
                    participants.map((student) => {
                      const partInfoArray = activityInfo?.allParticipantAssignments?.filter(
                        (user) => user.userId === student.userId,
                      );
                      const partInfo = partInfoArray && partInfoArray.length > 0 ? partInfoArray[0] : null;
                      const isSubmitted =
                        partInfo && activityInfo?.summitted
                          ? activityInfo.summitted[partInfo.partNumber] === true
                          : false;
                      return (
                        <ListGroup.Item
                          key={student.userId || student} // student가 객체가 아닐 경우 대비
                          style={{ backgroundColor: isSubmitted ? 'limegreen' : 'white' }}
                        >
                          {student.username || student}
                          {isSubmitted && (
                            <Badge
                              bg='success'
                              className='ms-2'
                            >
                              제출
                            </Badge>
                          )}
                        </ListGroup.Item>
                      );
                    })
                  ) : (
                    <ListGroup.Item>참여한 학생이 없습니다.</ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
            <Button // 이 버튼의 기능이 '활동 끝내기'인지 '코딩하기'인지 명확히 해야 합니다. 현재 onClick={handleCodingBtn}
              variant='danger'
              className='my-5'
              style={{ width: '100%' }}
              onClick={handleStopBtn} // 현재 '코딩하기'로 연결되어 있음. '활동 끝내기' 기능이라면 별도 핸들러 필요
            >
              활동 끝내기
            </Button>
          </Col>
        </Row>
      </Container>
    );
  };

  return <>{editorShow ? <EditorCanvas /> : <MainClassroom />}</>;
};

export default ClassroomWorkspace;
