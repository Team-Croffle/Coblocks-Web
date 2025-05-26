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
const BlocklyStage = forwardRef(({ initialStage, isRun, activityInfo: parentActivityInfo }, ref) => {
  console.log('BlocklyStage props: isRun:', isRun, 'parentActivityInfo:', !!parentActivityInfo);
  const [cellSize, setCellSize] = useState(32);
  const [stageData, setStageData] = useState(initialStage);
  const stageContainerRef = useRef(null);

  useEffect(() => {
    if (initialStage && initialStage.col && initialStage.row) {
      setStageData(initialStage);

      function handleResize() {
        if (stageContainerRef.current && initialStage.col > 0 && initialStage.row > 0) {
          const containerWidth = stageContainerRef.current.clientWidth;
          const containerHeight = stageContainerRef.current.clientHeight;
          const cellWidthBasedOnContainer = Math.floor(containerWidth / initialStage.col);
          const cellHeightBasedOnContainer = Math.floor(containerHeight / initialStage.row);
          const smallerCellSize = Math.min(cellWidthBasedOnContainer, cellHeightBasedOnContainer);
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

  // isRun이 false로 변경될 때 스테이지 초기화
  useEffect(() => {
    if (!isRun && initialStage) {
      setStageData(initialStage); // 스테이지를 초기 상태로 리셋
    }
  }, [isRun, initialStage]);

  //eslint-disable-next-line no-unused-vars
  const handleStageChange = (newStageLayout) => {
    // console.log('Stage layout changed:', newStageLayout);
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
      <Stage
        cellSize={cellSize}
        stageData={stageData}
        onStageChange={handleStageChange}
        onStartButtonClicked={isRun}
        activityInfo={parentActivityInfo} // prop으로 받은 activityInfo를 직접 전달
      />
    </div>
  );
});

BlocklyStage.propTypes = {
  initialStage: PropTypes.shape({
    col: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
    tiles: PropTypes.array.isRequired,
    objects: PropTypes.array,
    players: PropTypes.array,
  }),
  isRun: PropTypes.bool,
  activityInfo: PropTypes.object,
};

BlocklyStage.defaultProps = {
  jsCode: '',
  initialStage: null,
  isRun: false,
  activityInfo: null,
};

export default BlocklyStage;
