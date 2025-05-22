import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import Phaser from 'phaser';
import StageScene from './StageScene';

/**
 * BlocklyStage 컴포넌트
 * @param {string} jsCode Blockly 코드
 * @param {object} initialStage 초기 스테이지 데이터
 * @returns {JSX.Element}
 *
 * @description
 * initialStage의 JSON 데이터 형식은 다음과 같습니다.
 * {
 *   "width": number,
 *   "height": number,
 *   "grid": [
 *     { "x": number, "y": number, "type": string }
 *     ...
 *     { "x": number, "y": number, "type": string }
 *   ],
 *   "objects": [
 *     { "type": string, "x": number, "y": number, "state": string },
 *     ...
 *     { "type": string, "x": number, "y": number, "state": string },
 *   ],
 *   "character": {
 *     "x": number,
 *     "y": number,
 *     "direction": string // "up", "down", "left", "right"
 *   }
 * }
 */
const BlocklyStage = forwardRef(({ jsCode, initialStage }, ref) => {
  
  return (
    
  );
});

BlocklyStage.defaultProps = {
  jsCode: '',
  initialStage: null,
};

export default BlocklyStage;
