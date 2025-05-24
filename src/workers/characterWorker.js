// characterWorker.js
// 게임 상태 및 캐릭터 관리
let gameState = null;
let isRunning = false;
let currentCode = '';
let currentCharacterId = null;

// 메시지 핸들러
self.onmessage = function(event) {
  const { type, gameState: newGameState, characterId, code } = event.data;

  switch (type) {
    case 'INIT':
      initializeGame(newGameState, characterId, code);
      break;
    case 'START':
      startExecution(characterId);
      break;
    case 'TICK':
      if (isRunning) {
        executeNextStep();
      }
      break;
    case 'STOP':
      isRunning = false;
      break;
  }
};

// 게임 초기화
function initializeGame(newGameState, characterId, code) {
  gameState = { ...newGameState };
  currentCode = code;
  currentCharacterId = characterId;
  isRunning = false;
  
  // 타일, 오브젝트, 캐릭터 초기화 로직은 실제 구현 시 추가
}

// 실행 시작
function startExecution(characterId) {
  if (!gameState || !gameState.players) {
    sendError('Game state not initialized properly');
    return;
  }
  
  isRunning = true;
  
  try {
    // 첫 단계 실행
    executeNextStep();
  } catch (error) {
    sendError(`Error starting execution: ${error.message}`);
  }
}

// 다음 단계 실행
function executeNextStep() {
  if (!isRunning || !currentCharacterId) {
    return;
  }
  
  try {
    // 여기서 코드 실행 로직 구현
    // 예시: 이동 명령 실행
    const result = simulateMove();
    
    if (!result) {
      // 모든 액션 완료
      isRunning = false;
      self.postMessage({ type: 'COMPLETE' });
      return;
    }
    
    // 결과 전송
    self.postMessage({
      type: 'ACTION_COMPLETE',
      characterId: currentCharacterId,
      result: result
    });
    
  } catch (error) {
    sendError(`Error executing step: ${error.message}`);
  }
}

// 이동 시뮬레이션 (실제 구현 시 확장 필요)
function simulateMove() {
  // 이 함수는 실제 구현 시 캐릭터의 다음 이동을 계산하고 검증합니다
  // 예시 코드:
  const player = findPlayer(currentCharacterId);
  if (!player) return null;
  
  // 이동 방향 결정 (실제로는 코드 실행 결과에 따라 결정됨)
  const direction = 'right'; // 예시
  const newX = player.x + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0);
  const newY = player.y + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0);
  
  // 이동 가능 여부 확인
  if (!isMovePossible(newX, newY)) {
    throw new Error(`Cannot move to position (${newX}, ${newY})`);
  }
  
  // 이동 적용
  player.x = newX;
  player.y = newY;
  
  return {
    characterUpdate: {
      id: player.id,
      x: newX,
      y: newY,
      direction: direction
    }
  };
}

// 플레이어 찾기
function findPlayer(id) {
  if (!gameState || !gameState.players) return null;
  
  const players = Array.isArray(gameState.players) ? gameState.players : [gameState.players];
  return players.find(p => p.id === id);
}

// 이동 가능 여부 확인
function isMovePossible(x, y) {
  // 경계 체크
  if (x < 0 || x >= gameState.col || y < 0 || y >= gameState.row) {
    return false;
  }
  
  // 타일 통과 가능 여부 체크 (실제 구현 시 타일 타입에 따라 결정)
  const tileType = gameState.tiles[y][x];
  if (tileType === 'wall' || tileType === 'water') {
    return false;
  }
  
  // 오브젝트 충돌 체크
  if (gameState.objects) {
    for (const obj of gameState.objects) {
      if (obj.x === x && obj.y === y) {
        // 문인 경우 상태 확인
        if (obj.type === 'door' && obj.state !== 'open') {
          return false;
        }
        // 다른 통과 불가능한 오브젝트
        if (['box', 'wall'].includes(obj.type)) {
          return false;
        }
      }
    }
  }
  
  return true;
}

// 에러 전송
function sendError(message) {
  isRunning = false;
  self.postMessage({
    type: 'ERROR',
    error: message
  });
}