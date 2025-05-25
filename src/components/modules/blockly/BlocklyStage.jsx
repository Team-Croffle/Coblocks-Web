import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import Stage from '../stage/Stage';

/**
 * BlocklyStage 컴포넌트
 * @param {string} jsCode Blockly 코드가 변환된 JavaScript 코드 문자열
 * @param {object} initialStage 초기 스테이지 데이터
 * @returns {JSX.Element}
 *
 * @description
 * initialStage의 JSON 데이터 형식은 다음과 같습니다.
 * {
 *   "col": number,
 *   "row": number,
 *   "tiles": number[][] | string[][],
 *   "objects": [
 *     {id: string, type: string, x: number, y: number, state: string?, linkedTo: string?},
 *     ...
 *   ],
 *   "players": [
 *     {id: string, type: string, x: number, y: number, state: string?, direction: string?, playerCodes: string?},
 *     ...
 *   ]
 * }
 */
const BlocklyStage = forwardRef(({ jsCode, initialStage }, ref) => {
  const [cellSize, setCellSize] = useState(32); // 단일 숫자 값으로 변경
  const [stageData, setStageData] = useState(initialStage);
  const stageContainerRef = useRef(null);

  const [activePlayerId, setActivePlayerId] = useState(null);
  const [runTrigger, setRunTrigger] = useState(false);

  useEffect(() => {
    if (initialStage && initialStage.col && initialStage.row) {
      setStageData(initialStage);
      if (initialStage.players && initialStage.players.length > 0) {
        setActivePlayerId(initialStage.players[0].id);
      }

      function handleResize() {
        if (stageContainerRef.current && initialStage.col > 0 && initialStage.row > 0) {
          const containerWidth = stageContainerRef.current.clientWidth;
          const containerHeight = stageContainerRef.current.clientHeight;

          // 가로에 맞춘 셀 크기
          const cellWidthBasedOnContainer = Math.floor(containerWidth / initialStage.col);
          // 세로에 맞춘 셀 크기
          const cellHeightBasedOnContainer = Math.floor(containerHeight / initialStage.row);

          // width와 height 중 더 작은 값을 선택하여 정사각형 셀 유지
          const smallerCellSize = Math.min(cellWidthBasedOnContainer, cellHeightBasedOnContainer);

          // 최소 크기 보장
          setCellSize(Math.max(10, smallerCellSize));
        }
      }

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [initialStage]);

  useImperativeHandle(ref, () => ({
    executeCode: () => {
      if (jsCode && activePlayerId) {
        setRunTrigger(true);
        // Stage 컴포넌트의 useEffect가 onStartButtonClicked를 감지하고 코드를 실행합니다.
        // 실행 후 트리거를 다시 false로 설정합니다.
        setTimeout(() => setRunTrigger(false), 100);
      } else {
        console.warn('실행할 코드(jsCode)가 없거나 활성 플레이어 ID(activePlayerId)가 없습니다.');
      }
    },
  }));

  //eslint-disable-next-line no-unused-vars
  const handleStageChange = (newStageLayout) => {
    // console.log('Stage layout changed:', newStageLayout);
    // 필요한 경우 부모 컴포넌트로 변경 사항을 전달하거나 상태를 업데이트합니다.
  };

  if (!stageData || !stageData.col || !stageData.row) {
    return (
      <div
        ref={stageContainerRef}
        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        스테이지 데이터를 불러오는 중...
      </div>
    );
  }

  return (
    <div
      className='stage-container'
      ref={stageContainerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#f0f0f0',
        display: 'flex', // 스테이지를 중앙 정렬하기 위한 스타일 추가
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 
        Stage 컴포넌트를 감싸는 div를 제거하고 Stage 컴포넌트 자체가 
        계산된 크기를 가지도록 합니다. 
        stage-container가 flex 컨테이너 역할을 하여 Stage를 중앙에 배치합니다.
      */}
      <Stage
        cellSize={cellSize} // 수정된 단일 cellSize 값 전달
        stageData={stageData}
        onStageChange={handleStageChange}
        onStartButtonClicked={runTrigger}
        playerBlockCode={jsCode}
        activePlayerId={activePlayerId}
      />
    </div>
  );
});

BlocklyStage.propTypes = {
  jsCode: PropTypes.string,
  initialStage: PropTypes.shape({
    col: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
    tiles: PropTypes.array.isRequired,
    objects: PropTypes.array,
    players: PropTypes.array,
  }),
};

BlocklyStage.defaultProps = {
  jsCode: '',
  initialStage: null,
};

export default BlocklyStage;
