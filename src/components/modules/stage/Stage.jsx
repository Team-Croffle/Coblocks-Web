import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StageCharacterFactory } from './characters/StageCharacterFactory';
import { StageObjectFactory } from './objects/StageObjectFactory';
import { StageTileFactory } from './tiles/StageTileFactory';
import { Worker } from './Worker';

const Stage = ({ cellSize, stageData, onStageChange, onStartButtonClicked, playerBlockCode, activePlayerId }) => {
  const [tileFactory] = useState(() => new StageTileFactory());
  const [objectFactory] = useState(() => new StageObjectFactory());
  const [playerFactory] = useState(() => new StageCharacterFactory());

  const workerRef = useRef(null);
  const [characterMessages, setCharacterMessages] = useState({});
  const [forceUpdate, setForceUpdate] = useState(0);

  const rerenderStage = () => setForceUpdate((prev) => prev + 1);

  const handleWorkerAction = useCallback(
    (actionType, payload) => {
      console.log('Worker Action:', actionType, payload);
      if (actionType === 'speak') {
        setCharacterMessages((prev) => ({
          ...prev,
          [payload.characterId]: { message: payload.message, id: Date.now() },
        }));
        setTimeout(() => {
          setCharacterMessages((prev) => {
            const newMessages = { ...prev };
            if (newMessages[payload.characterId] && newMessages[payload.characterId].id === payload.id) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageData]);

  useEffect(() => {
    if (onStartButtonClicked && playerBlockCode && activePlayerId) {
      const characterToRun = playerFactory.getCharacter(activePlayerId);
      if (characterToRun) {
        if (!workerRef.current || workerRef.current.characterId !== activePlayerId) {
          workerRef.current = new Worker(activePlayerId, tileFactory, objectFactory, playerFactory, handleWorkerAction);
        }
        workerRef.current.runCode(playerBlockCode).catch((err) => console.error('Error running code from Stage:', err));
      } else {
        console.warn(`Player ${activePlayerId} not found for running code.`);
      }
    }
  }, [
    onStartButtonClicked,
    playerBlockCode,
    activePlayerId,
    playerFactory,
    tileFactory,
    objectFactory,
    handleWorkerAction,
  ]);

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
            {typeof image === 'string' && image.length > 2 ? (
              <img
                src={image}
                alt={obj.type}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                draggable={false}
              />
            ) : (
              <div style={image && image.style ? image.style : { width: '100%', height: '100%' }}>
                {typeof image === 'string' ? image : ''}
              </div>
            )}
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

        if (player.direction === 'left') containerStyle.transform = 'scaleX(-1)';
        else if (player.direction === 'right') containerStyle.transform = 'scaleX(1)';

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
