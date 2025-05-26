import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StageCharacterFactory } from './characters/StageCharacterFactory';
import { StageObjectFactory } from './objects/StageObjectFactory';
import { StageTileFactory } from './tiles/StageTileFactory';
import { Worker } from './Worker';

const Stage = ({ cellSize, stageData, onStageChange, onStartButtonClicked, activityInfo }) => {
  const [tileFactory] = useState(() => new StageTileFactory());
  const [objectFactory] = useState(() => new StageObjectFactory());
  const [playerFactory] = useState(() => new StageCharacterFactory());

  const workersRef = useRef({}); // 각 캐릭터 ID를 키로 하여 Worker 인스턴스 저장
  const executionStartedRef = useRef(false); // 실행 시작 여부를 추적하는 ref
  const [characterMessages, setCharacterMessages] = useState({});
  const [forceUpdate, setForceUpdate] = useState(0);

  const rerenderStage = () => setForceUpdate((prev) => prev + 1);

  const handleWorkerAction = useCallback(
    (actionType, payload) => {
      console.log('Worker Action:', actionType, payload);
      if (actionType === 'speak') {
        setCharacterMessages((prev) => ({
          ...prev,
          [payload.characterId]: { message: payload.message, id: payload.id || Date.now() }, // payload.id가 있으면 사용
        }));
        setTimeout(() => {
          setCharacterMessages((prev) => {
            const newMessages = { ...prev };
            // 메시지 ID를 기준으로 삭제 (동일 ID의 메시지가 여러번 표시되는 것 방지)
            if (
              newMessages[payload.characterId] &&
              newMessages[payload.characterId].id === (payload.id || Date.now())
            ) {
              delete newMessages[payload.characterId];
            }
            return newMessages;
          });
        }, 3000);
      }
      rerenderStage();
      if (onStageChange) {
        onStageChange({
          tiles: tileFactory.getAllTiles(),
          objects: objectFactory.getAllObjects(),
          players: playerFactory.getAllCharacters(),
        });
      }
    },
    [onStageChange, tileFactory, objectFactory, playerFactory],
  );

  useEffect(() => {
    if (stageData) {
      tileFactory.loadFromListValues(stageData.tiles, stageData.row, stageData.col);
      objectFactory.loadFromJSON(stageData.objects);
      playerFactory.loadFromJSON(stageData.players);
      rerenderStage();
      if (onStageChange) {
        onStageChange({
          tiles: tileFactory.getAllTiles(),
          objects: objectFactory.getAllObjects(),
          players: playerFactory.getAllCharacters(),
        });
      }
      executionStartedRef.current = false; // 스테이지 데이터가 새로 로드되면 실행 플래그 초기화
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageData]);

  useEffect(() => {
    // 실행 트리거가 활성화되었을 때의 처리
    if (onStartButtonClicked) {
      if (executionStartedRef.current) {
        console.log('Stage.jsx: Execution already started, skipping duplicate run.');
        return; // 이미 실행 시작됨, 중복 실행 방지
      }
      console.log('Stage.jsx: Execution triggered. Checking activity info...', {
        hasActivityInfo: !!activityInfo,
        hasAssignments: !!activityInfo?.allParticipantAssignments,
        hasSubmissions: !!activityInfo?.finalSubmissionsData,
      });

      // 필요한 데이터가 모두 있는지 확인
      if (!activityInfo || !activityInfo.allParticipantAssignments || !activityInfo.finalSubmissionsData) {
        console.warn('Stage.jsx: Missing required activity data for execution', {
          hasActivityInfo: !!activityInfo,
          hasAssignments: !!activityInfo?.allParticipantAssignments,
          hasSubmissions: !!activityInfo?.finalSubmissionsData,
        });
        return;
      }

      executionStartedRef.current = true; // 실행 시작 플래그 설정

      // 기존 Worker 인스턴스들 정리
      Object.values(workersRef.current).forEach((worker) => {
        if (worker && worker.terminate) {
          worker.terminate();
        }
      });
      workersRef.current = {};

      // 모든 참가자의 코드 실행 준비
      const executionPromises = activityInfo.allParticipantAssignments.map(async (assignment) => {
        const userId = assignment.userId;
        const submission = activityInfo.finalSubmissionsData[userId];

        if (!submission || !submission.content || !submission.partNumber) {
          console.warn(`Stage.jsx: No valid submission found for user ${userId}`);
          return null;
        }

        const characterPartNumber = submission.partNumber;
        const codeToRun = submission.content;
        const characterToRun = playerFactory.getCharacter(characterPartNumber);

        if (!characterToRun) {
          console.warn(`Stage.jsx: Character ${characterPartNumber} not found for user ${userId}`);
          return null;
        }

        // Worker 인스턴스 생성
        console.log(`Stage.jsx: Creating Worker for character ${characterPartNumber}`);
        workersRef.current[characterPartNumber] = new Worker(
          characterPartNumber,
          tileFactory,
          objectFactory,
          playerFactory,
          handleWorkerAction,
        );

        try {
          // 코드 실행
          console.log(`Stage.jsx: Running code for character ${characterPartNumber}`);
          await workersRef.current[characterPartNumber].runCode(codeToRun);
          return characterPartNumber;
        } catch (error) {
          console.error(`Stage.jsx: Error running code for character ${characterPartNumber}:`, error);
          return null;
        }
      });

      // 모든 코드 실행 완료 후 처리
      Promise.all(executionPromises)
        .then((results) => {
          const successfulExecutions = results.filter((result) => result !== null);
          console.log(
            `Stage.jsx: Code execution completed. Successfully executed for characters:`,
            successfulExecutions,
          );
          rerenderStage();
        })
        .catch((error) => {
          console.error('Stage.jsx: Error during code execution:', error);
        });
    } else {
      // onStartButtonClicked가 false가 되면 실행 플래그도 리셋
      executionStartedRef.current = false;
      // Worker 인스턴스 정리 (실행이 중지될 때)
      Object.values(workersRef.current).forEach((worker) => {
        if (worker && worker.terminate) {
          worker.terminate();
        }
      });
      workersRef.current = {};
    }
  }, [onStartButtonClicked, activityInfo, playerFactory, tileFactory, objectFactory, handleWorkerAction]);

  const tiles = tileFactory.getAllTiles();
  const objects = objectFactory.getAllObjects().filter((obj) => !(obj.isCollected && obj.state === 'collected'));
  const players = playerFactory.getAllCharacters();

  // cellSize를 단일 숫자로 처리
  const stageWidth = stageData && typeof cellSize === 'number' ? stageData.col * cellSize : 'auto';
  const stageHeight = stageData && typeof cellSize === 'number' ? stageData.row * cellSize : 'auto';

  return (
    <div
      className='stage'
      style={{
        position: 'relative',
        width: stageWidth,
        height: stageHeight,
        backgroundColor: '#CCC',
      }}
      data-force-update={forceUpdate}
    >
      {/* Tiles */}
      {tiles.map((tile) => {
        const image = tile.getImage();
        const containerStyle = {
          position: 'absolute',
          left: typeof cellSize === 'number' ? tile.x * cellSize : 0,
          top: typeof cellSize === 'number' ? tile.y * cellSize : 0,
          width: typeof cellSize === 'number' ? cellSize : 0,
          height: typeof cellSize === 'number' ? cellSize : 0,
          border: '1px solid #eee',
        };

        return typeof image === 'string' ? (
          <div
            key={`tile-${tile.x}-${tile.y}`}
            style={containerStyle}
          >
            <img
              src={image}
              alt={tile.type}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              draggable={false}
            />
          </div>
        ) : (
          <div
            key={`tile-${tile.x}-${tile.y}`}
            style={containerStyle}
          >
            <div style={image && image.style ? image.style : { width: '100%', height: '100%' }}></div>
          </div>
        );
      })}

      {/* Objects */}
      {objects.map((obj) => {
        const image = obj.getImage();
        const fontSize = typeof cellSize === 'number' ? Math.max(10, cellSize / 2) + 'px' : '10px';
        const containerStyle = {
          position: 'absolute',
          left: typeof cellSize === 'number' ? obj.x * cellSize + cellSize * 0.1 : 0,
          top: typeof cellSize === 'number' ? obj.y * cellSize + cellSize * 0.1 : 0,
          width: typeof cellSize === 'number' ? cellSize * 0.8 : 0,
          height: typeof cellSize === 'number' ? cellSize * 0.8 : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          fontSize: fontSize,
          transition: 'all 0.3s ease',
        };

        return (
          <div
            key={`obj-${obj.id}`}
            style={containerStyle}
          >
            <img
              src={image}
              alt={obj.type}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              draggable={false}
            />
          </div>
        );
      })}

      {/* Players & Messages */}
      {players.map((player) => {
        const imageInfo = player.getImage();
        const containerStyle = {
          position: 'absolute',
          left: typeof cellSize === 'number' ? player.x * cellSize : 0,
          top: typeof cellSize === 'number' ? player.y * cellSize : 0,
          width: typeof cellSize === 'number' ? cellSize : 0,
          height: typeof cellSize === 'number' ? cellSize : 0,
          transition: 'left 0.3s ease, top 0.3s ease, transform 0.2s ease',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        };

        // 캐릭터 컨테이너의 크기를 셀 사이즈의 70%로 설정
        const characterSize = typeof cellSize === 'number' ? cellSize * 0.7 : 0;
        const characterStyle = {
          width: characterSize,
          height: characterSize,
          position: 'relative', // 손을 부착하기 위해 relative로 설정
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        };

        // 손 스타일 - 캐릭터가 바라보는 방향에 따라 위치 조정
        const handSize = typeof cellSize === 'number' ? cellSize * 0.2 : 0; // 손 크기는 셀 사이즈의 12%

        // 손의 위치 설정 (방향에 따라 다름)
        let hand1Style = {
          position: 'absolute',
          width: handSize,
          height: handSize,
          backgroundColor: 'white',
          borderRadius: '50%',
          border: '1px solid #aaa',
          zIndex: 11,
        };

        let hand2Style = {
          position: 'absolute',
          width: handSize,
          height: handSize,
          backgroundColor: 'white',
          borderRadius: '50%',
          border: '1px solid #aaa',
          zIndex: 11,
        };

        // 손 위치 계산 (방향에 따라)
        if (player.direction === 'up') {
          hand1Style = {
            ...hand1Style,
            top: 0,
            left: 0,
          };
          hand2Style = {
            ...hand2Style,
            top: 0,
            right: 0,
          };
        } else if (player.direction === 'down') {
          hand1Style = {
            ...hand1Style,
            bottom: 0,
            left: 0,
          };
          hand2Style = {
            ...hand2Style,
            bottom: 0,
            right: 0,
          };
        } else if (player.direction === 'left') {
          hand1Style = {
            ...hand1Style,
            left: 0,
            top: 0,
          };
          hand2Style = {
            ...hand2Style,
            left: 0,
            bottom: 0,
          };
        } else if (player.direction === 'right') {
          hand1Style = {
            ...hand1Style,
            right: 0,
            top: 0,
          };
          hand2Style = {
            ...hand2Style,
            right: 0,
            bottom: 0,
          };
        }

        const message = characterMessages[player.id];
        const messageBubbleStyle = {
          position: 'absolute',
          bottom: '105%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '5px 10px',
          borderRadius: '8px',
          border: '1px solid #555',
          fontSize: typeof cellSize === 'number' ? Math.max(10, cellSize / 4) + 'px' : '10px',
          whiteSpace: 'nowrap',
          zIndex: 20,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        };

        return (
          <div
            key={`player-${player.id}`}
            style={containerStyle}
          >
            <div style={characterStyle}>
              {typeof imageInfo === 'string' ? (
                <img
                  src={imageInfo}
                  alt={`player ${player.id}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  draggable={false}
                />
              ) : (
                <div style={imageInfo && imageInfo.style ? imageInfo.style : { width: '100%', height: '100%' }}>
                  {imageInfo && imageInfo.text ? imageInfo.text : player.id}
                </div>
              )}

              {/* 손 추가 */}
              <div style={hand1Style}></div>
              <div style={hand2Style}></div>
            </div>

            {message && <div style={messageBubbleStyle}>{message.message}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default Stage;
