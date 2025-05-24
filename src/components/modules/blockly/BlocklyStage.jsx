import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import StageTiles from '@/components/modules/stage/StageTiles';
import StageObjects from '@/components/modules/stage/StageObjects';
import StagePlayers from '@/components/modules/stage/StagePlayers';

/**
 * BlocklyStage 컴포넌트
 * @param {string} jsCode Blockly 코드
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
 *     {id: string, type: string, x: number, y: number, state: string?, linkedTo: string?},
 *   ],
 *   "players": [
 *     {id: string, type: string, x: number, y: number, state: string?, direction: string?, playerCodes: string?},
 *     ...
 *   ]
 * }
 */
const BlocklyStage = forwardRef(({ initialStage }, ref) => {
  const [cellSize, setCellSize] = useState({ width: 32, height: 32 });
  const [stageData, setStageData] = useState({});
  const stageRef = useRef(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    updateCharacter: (characterUpdate) => {
      setStageData(prevData => ({
        ...prevData,
        players: prevData.players.map(player =>
          player.id === characterUpdate.id ? { ...player, ...characterUpdate } : player
        )
      }));
    },
    updateObjects: (objectsUpdate) => {
      setStageData(prevData => ({
        ...prevData,
        objects: objectsUpdate
      }));
    },
    resetStage: () => {
      setStageData(initialStage);
    }
  }));

  useEffect(() => {
    setStageData(initialStage);

    function handleResize() {
      if (stageRef.current) {
        const width = stageRef.current.clientWidth;
        const height = stageRef.current.clientHeight;
        setCellSize({
          width: Math.floor(width / initialStage.col),
          height: Math.floor(height / initialStage.row),
        });
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initialStage]);

  return (
    <div
      className='stage-container'
      ref={stageRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <div className='stage'>
        <StageTiles
          cellSize={cellSize}
          tiles={stageData.tiles}
        />
        <StageObjects
          cellSize={cellSize}
          objects={stageData.objects}
        />
        <StagePlayers
          cellSize={cellSize}
          players={stageData.players}
        />
      </div>
    </div>
  );
});

BlocklyStage.propTypes = {
  initialStage: PropTypes.shape({
    col: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
    tiles: PropTypes.arrayOf(PropTypes.array).isRequired,
    objects: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      state: PropTypes.string,
      linkedTo: PropTypes.string
    })),
    players: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      direction: PropTypes.string,
      state: PropTypes.string
    }))
  }).isRequired
};

BlocklyStage.defaultProps = {
  jsCode: '',
  initialStage: null,
};

export default BlocklyStage;