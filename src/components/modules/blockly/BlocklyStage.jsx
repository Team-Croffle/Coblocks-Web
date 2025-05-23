import React, { useEffect, useState, useRef } from 'react';
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
 *   "tile": number[][] | string[][],
 *   "objects": [
 *     {id: string, type: string, x: number, y: number, state: string?, linkedTo: string?},
 *     ...
 *     {id: string, type: string, x: number, y: number, state: string?, linkedTo: string?},
 *   ],
 *   "players": {
 *     "x": number,
 *     "y": number,
 *     "direction": string // "up", "down", "left", "right"
 *   }
 * }
 */
const BlocklyStage = ({ initialStage }) => {
  const [cellSize, setCellSize] = useState({ width: 32, height: 32 });
  const stageRef = useRef(null);

  useEffect(() => {
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
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          tiles={initialStage.tiles}
        />
        <StageObjects
          cellSize={cellSize}
          objects={initialStage.objects}
        />
        <StagePlayers
          cellSize={cellSize}
          players={initialStage.players}
        />
      </div>
    </div>
  );
};

BlocklyStage.defaultProps = {
  jsCode: '',
  initialStage: null,
};

export default BlocklyStage;
