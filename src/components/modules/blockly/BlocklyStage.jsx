import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import Phaser from 'phaser';
import StageScene from './StageScene';

const BlocklyStage = forwardRef(({ jsCode, initialStage }, ref) => {
  const gameContainerRef = useRef(null);
  const [game, setGame] = useState(null);
  const [stage, setStage] = useState(null);
  const [character, setCharacter] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // 스테이지 초기화 함수
  const initStage = (stageData) => {
    if (!gameContainerRef.current) return;

    // 기존 게임 인스턴스가 있으면 제거
    if (game) {
      game.destroy(true);
    }

    // 스테이지 데이터 설정
    setStage(stageData);

    // 캐릭터 초기화
    if (stageData.character) {
      setCharacter({
        x: stageData.character.x,
        y: stageData.character.y,
        direction: stageData.character.direction || 'right',
      });
    }

    // Phaser 게임 설정
    const gameConfig = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      width: gameContainerRef.current.clientWidth,
      height: gameContainerRef.current.clientHeight,
      backgroundColor: '#f5f5f5',
      scene: new StageScene(),
    };

    // 새 게임 인스턴스 생성
    const newGame = new Phaser.Game(gameConfig);

    // 씬 데이터 설정
    newGame.scene.getScene('StageScene').scene.start('StageScene', {
      stageData,
      onCharacterUpdate: (char) => setCharacter(char),
    });

    setGame(newGame);

    return newGame;
  };

  // 상위 컴포넌트에서 접근할 수 있도록 함수 노출
  useImperativeHandle(ref, () => ({
    initStage: (stageData) => {
      try {
        const parsedData =
          typeof stageData === 'string'
            ? stageData.trim().startsWith('<')
              ? parseXmlStage(stageData)
              : JSON.parse(stageData)
            : stageData;

        initStage(parsedData);
        return true;
      } catch (error) {
        console.error('스테이지 초기화 오류:', error);
        return false;
      }
    },
  }));

  // 초기 스테이지 설정
  useEffect(() => {
    if (!initialStage || !gameContainerRef.current) return;

    try {
      // JSON 또는 XML 형식의 초기 스테이지 데이터 파싱
      const stageData =
        typeof initialStage === 'string'
          ? initialStage.trim().startsWith('<')
            ? parseXmlStage(initialStage)
            : JSON.parse(initialStage)
          : initialStage;

      initStage(stageData);
    } catch (error) {
      console.error('스테이지 초기화 오류:', error);
    }

    // 컴포넌트 언마운트 시 게임 인스턴스 정리
    return () => {
      if (game) {
        game.destroy(true);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialStage]);

  // 창 크기 변경 시 게임 크기 조정
  useEffect(() => {
    const handleResize = () => {
      if (game && gameContainerRef.current) {
        game.scale.resize(gameContainerRef.current.clientWidth, gameContainerRef.current.clientHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [game]);

  // XML 형식의 스테이지 데이터 파싱
  const parseXmlStage = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // XML에서 스테이지 데이터 추출하는 로직
    const stageData = {
      width: parseInt(xmlDoc.getElementsByTagName('stage')[0]?.getAttribute('width') || 500),
      height: parseInt(xmlDoc.getElementsByTagName('stage')[0]?.getAttribute('height') || 500),
      grid: [],
      objects: [],
      character: null,
    };

    // 그리드 정보 파싱
    const gridElements = xmlDoc.getElementsByTagName('grid')[0]?.getElementsByTagName('cell');
    if (gridElements) {
      for (let i = 0; i < gridElements.length; i++) {
        const cell = gridElements[i];
        stageData.grid.push({
          x: parseInt(cell.getAttribute('x')),
          y: parseInt(cell.getAttribute('y')),
          type: cell.getAttribute('type'),
        });
      }
    }

    // 오브젝트 정보 파싱
    const objectElements = xmlDoc.getElementsByTagName('object');
    if (objectElements) {
      for (let i = 0; i < objectElements.length; i++) {
        const obj = objectElements[i];
        stageData.objects.push({
          id: obj.getAttribute('id'),
          type: obj.getAttribute('type'),
          x: parseInt(obj.getAttribute('x')),
          y: parseInt(obj.getAttribute('y')),
          state: obj.getAttribute('state') || 'default',
        });
      }
    }

    // 캐릭터 정보 파싱
    const characterElement = xmlDoc.getElementsByTagName('character')[0];
    if (characterElement) {
      stageData.character = {
        x: parseInt(characterElement.getAttribute('x')),
        y: parseInt(characterElement.getAttribute('y')),
        direction: characterElement.getAttribute('direction') || 'right',
      };
    }

    return stageData;
  };

  // 이동 가능 여부 확인 함수
  const canMoveTo = (x, y) => {
    if (!stage || !stage.grid) return false;

    // 스테이지 경계 확인
    if (x < 0 || y < 0 || x >= stage.width || y >= stage.height) return false;

    // 벽 확인
    const cell = stage.grid.find((c) => c.x === x && c.y === y && c.type === 'wall');
    if (cell) return false;

    // 닫힌 문 확인
    const door = stage.objects?.find((o) => o.x === x && o.y === y && o.type === 'door' && o.state === 'closed');
    if (door) return false;

    return true;
  };

  // 캐릭터 이동 함수
  const moveCharacter = (direction) => {
    if (!character || !stage || !game) return;

    const sceneInstance = game.scene.getScene('StageScene');
    if (!sceneInstance) return;

    setCharacter((prevChar) => {
      const newChar = { ...prevChar };

      // 방향 변경
      if (direction === 'left') {
        newChar.direction = 'left';
      } else if (direction === 'right') {
        newChar.direction = 'right';
      } else if (direction === 'up') {
        newChar.direction = 'up';
      } else if (direction === 'down') {
        newChar.direction = 'down';
      } else if (direction === 'forward') {
        // 현재 방향으로 전진
        switch (newChar.direction) {
          case 'up':
            if (canMoveTo(newChar.x, newChar.y - 1)) newChar.y -= 1;
            break;
          case 'down':
            if (canMoveTo(newChar.x, newChar.y + 1)) newChar.y += 1;
            break;
          case 'left':
            if (canMoveTo(newChar.x - 1, newChar.y)) newChar.x -= 1;
            break;
          case 'right':
            if (canMoveTo(newChar.x + 1, newChar.y)) newChar.x += 1;
            break;
        }
      } else if (direction === 'backward') {
        // 현재 방향의 반대로 후진
        switch (newChar.direction) {
          case 'up':
            if (canMoveTo(newChar.x, newChar.y + 1)) newChar.y += 1;
            break;
          case 'down':
            if (canMoveTo(newChar.x, newChar.y - 1)) newChar.y -= 1;
            break;
          case 'left':
            if (canMoveTo(newChar.x + 1, newChar.y)) newChar.x += 1;
            break;
          case 'right':
            if (canMoveTo(newChar.x - 1, newChar.y)) newChar.x -= 1;
            break;
        }
      }

      // Phaser 씬에서 캐릭터 업데이트
      sceneInstance.updateCharacter(newChar);

      return newChar;
    });
  };

  // 오브젝트와 상호작용 함수
  const interactWithObjects = () => {
    if (!character || !stage || !stage.objects || !game) return;

    const sceneInstance = game.scene.getScene('StageScene');
    if (!sceneInstance) return;

    // 캐릭터 앞에 있는 셀 좌표 계산
    let frontX = character.x;
    let frontY = character.y;

    switch (character.direction) {
      case 'up':
        frontY -= 1;
        break;
      case 'down':
        frontY += 1;
        break;
      case 'left':
        frontX -= 1;
        break;
      case 'right':
        frontX += 1;
        break;
    }

    // 앞에 있는 오브젝트 찾기
    const frontObject = stage.objects.find((obj) => obj.x === frontX && obj.y === frontY);

    if (frontObject) {
      // 오브젝트 상태 변경
      setStage((prevStage) => {
        const newStage = { ...prevStage };
        const objIndex = newStage.objects.findIndex((o) => o.id === frontObject.id);

        if (objIndex !== -1) {
          switch (newStage.objects[objIndex].type) {
            case 'button': {
              newStage.objects[objIndex].state = 'pressed';
              // Phaser 씬에서 버튼 상태 업데이트
              sceneInstance.updateObject(frontObject.id, 'pressed');

              // 버튼과 연결된 문 찾기
              const linkedDoor = newStage.objects.find((o) => o.type === 'door' && o.linkedTo === frontObject.id);
              if (linkedDoor) {
                const doorIndex = newStage.objects.findIndex((o) => o.id === linkedDoor.id);
                if (doorIndex !== -1) {
                  newStage.objects[doorIndex].state = 'open';
                  // Phaser 씬에서 문 상태 업데이트
                  sceneInstance.updateObject(linkedDoor.id, 'open');
                }
              }
              break;
            }
            case 'door': {
              if (newStage.objects[objIndex].state === 'closed') {
                // 문이 닫혀있으면 열기 시도
                const linkedButton = newStage.objects.find(
                  (o) => o.type === 'button' && o.state === 'pressed' && o.controls === frontObject.id,
                );
                if (linkedButton) {
                  newStage.objects[objIndex].state = 'open';
                  // Phaser 씬에서 문 상태 업데이트
                  sceneInstance.updateObject(frontObject.id, 'open');
                }
              }
              break;
            }
            // 다른 오브젝트 타입 처리
          }
        }

        return newStage;
      });
    }
  };

  // JS 코드 실행 함수
  useEffect(() => {
    if (!jsCode || !stage || !character || isRunning) return;

    const runCode = () => {
      try {
        setIsRunning(true);

        // 캐릭터 컨트롤을 위한 API 객체 생성
        const characterAPI = {
          moveForward: () => moveCharacter('forward'),
          moveBackward: () => moveCharacter('backward'),
          turnLeft: () => moveCharacter('left'),
          turnRight: () => moveCharacter('right'),
          turnUp: () => moveCharacter('up'),
          turnDown: () => moveCharacter('down'),
          interact: () => interactWithObjects(),
          // 필요한 추가 API 메서드
        };

        // 코드 실행 환경 생성 및 실행
        const executeCode = new Function(
          'character',
          `
          return (async function() {
            try {
              ${jsCode}
            } catch (e) {
              console.error('코드 실행 오류:', e);
            } finally {
              return true;
            }
          })();
        `,
        );

        executeCode(characterAPI)
          .then(() => setIsRunning(false))
          .catch((err) => {
            console.error('코드 실행 중 오류:', err);
            setIsRunning(false);
          });
      } catch (error) {
        console.error('코드 실행 오류:', error);
        setIsRunning(false);
      }
    };

    if (jsCode.trim()) {
      runCode();
    }
  }, [jsCode, stage, character, isRunning]);

  return (
    <div
      className='flex-fill me-1'
      style={{
        border: '1px solid #ddd',
        borderRadius: '6px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <div
        ref={gameContainerRef}
        style={{ width: '100%', height: '100%', borderRadius: '6px' }}
      />
      {isRunning && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
          }}
        >
          코드 실행 중...
        </div>
      )}
    </div>
  );
});

BlocklyStage.propTypes = {
  jsCode: PropTypes.string,
  initialStage: PropTypes.oneOfType([
    PropTypes.string, // JSON 문자열 또는 XML 문자열
    PropTypes.object, // 파싱된 객체
  ]),
};

BlocklyStage.defaultProps = {
  jsCode: '',
  initialStage: null,
};

export default BlocklyStage;
