export class Worker {
  constructor(characterId, stageTileFactory, stageObjectFactory, stageCharacterFactory, onActionCallback) {
    this.characterId = characterId;
    this.tileFactory = stageTileFactory;
    this.objectFactory = stageObjectFactory;
    this.characterFactory = stageCharacterFactory;
    this.onAction = onActionCallback; // (actionType, payload) => void
    this.character = this.characterFactory.getCharacter(this.characterId);
    this.actionQueue = [];
    this.isRunning = false;
    this.failed = false;
  }

  _logAction(message, isError = false) {
    console.error('test');
    console.log(`Worker (Char ${this.characterId}): ${message}`);
    if (this.onAction) {
      this.onAction('speak', { characterId: this.characterId, message, isError });
      this._delay(3000);
    }
  }

  async _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 외부에서 호출될 API 함수들
  async moveForward() {
    if (this.failed) return;
    if (!this.character) return;
    const { x, y, direction } = this.character.getPositionAndDirection();
    let dx = 0,
      dy = 0;
    if (direction === 'up') dy = -1;
    else if (direction === 'down') dy = 1;
    else if (direction === 'left') dx = -1;
    else if (direction === 'right') dx = 1;

    const nextX = x + dx;
    const nextY = y + dy;

    const bounds = this.tileFactory.getBounds();
    if (nextX < bounds.minX || nextX > bounds.maxX || nextY < bounds.minY || nextY > bounds.maxY) {
      this._logAction('맵의 가장자리에 도달하여 더 이상 앞으로 갈 수 없습니다.', true);
      this.failed = true; // 실패 상태로 설정
      return;
    }

    const targetTile = this.tileFactory.getTileAt(nextX, nextY);
    if (!targetTile || !targetTile.isStepable()) {
      this._logAction('앞에 길이 없어 앞으로 갈 수 없습니다.', true);
      this.failed = true; // 실패 상태로 설정
      return;
    }

    const objectsAtNextPos = this.objectFactory.getObjectsAt(nextX, nextY);
    for (const obj of objectsAtNextPos) {
      if (obj && !obj.isPassable(this.character)) {
        this._logAction(`${obj.type}이(가) 길을 막고 있어 앞으로 갈 수 없습니다.`, true);
        this.failed = true; // 실패 상태로 설정
        return;
      }
    }

    this.character.setState('walking');
    if (this.onAction) this.onAction('stateChange', { characterId: this.characterId, state: 'walking' });
    await this._delay(300);

    this.character.setPosition(nextX, nextY);
    this.character.setState('idle');
    if (this.onAction) {
      this.onAction('move', { characterId: this.characterId, x: nextX, y: nextY });
      this.onAction('stateChange', { characterId: this.characterId, state: 'idle' });
    }
  }

  async turnLeft() {
    if (this.failed) return;
    if (!this.character) return;
    const dirMap = { up: 'left', left: 'down', down: 'right', right: 'up' };
    const newDirection = dirMap[this.character.getDirection()];
    this.character.setDirection(newDirection);
    if (this.onAction) this.onAction('directionChange', { characterId: this.characterId, direction: newDirection });
    await this._delay(150);
  }

  async turnRight() {
    if (this.failed) return;
    if (!this.character) return;
    const dirMap = { up: 'right', right: 'down', down: 'left', left: 'up' };
    const newDirection = dirMap[this.character.getDirection()];
    this.character.setDirection(newDirection);
    if (this.onAction) this.onAction('directionChange', { characterId: this.characterId, direction: newDirection });
    await this._delay(150);
  }

  async waitAndMove() {
    if (this.failed) return;
    if (!this.character) return;
    const { x, y, direction } = this.character.getPositionAndDirection();
    let dx = 0,
      dy = 0;
    if (direction === 'up') dy = -1;
    else if (direction === 'down') dy = 1;
    else if (direction === 'left') dx = -1;
    else if (direction === 'right') dx = 1;

    const nextX = x + dx;
    const nextY = y + dy;

    const bounds = this.tileFactory.getBounds();
    if (nextX < bounds.minX || nextX > bounds.maxX || nextY < bounds.minY || nextY > bounds.maxY) {
      this._logAction('맵의 가장자리에 도달하여 더 이상 앞으로 갈 수 없습니다.', true);
      this.failed = true; // 실패 상태로 설정
      return;
    }

    const targetTile = this.tileFactory.getTileAt(nextX, nextY);
    if (!targetTile || !targetTile.isStepable()) {
      this._logAction('앞에 길이 없어 앞으로 갈 수 없습니다.', true);
      this.failed = true; // 실패 상태로 설정
      return;
    }

    while (true) {
      let canPass = true;
      const objectsAtNextPos = this.objectFactory.getObjectsAt(nextX, nextY);
      for (const obj of objectsAtNextPos) {
        if (!obj) return; // 객체가 없으면 종료
        if (!obj.isPassable(this.character)) {
          this._logAction(`기다리는중`);
          canPass = false;
        }
      }
      if (canPass) {
        this._logAction('앞으로 갈 수 있습니다.');
        break;
      }
      await this._delay(1000);
    }

    this.character.setState('walking');
    if (this.onAction) this.onAction('stateChange', { characterId: this.characterId, state: 'walking' });
    await this._delay(300);

    this.character.setPosition(nextX, nextY);
    this.character.setState('idle');
    if (this.onAction) {
      this.onAction('move', { characterId: this.characterId, x: nextX, y: nextY });
      this.onAction('stateChange', { characterId: this.characterId, state: 'idle' });
    }
  }

  async interact() {
    if (this.failed) return;
    if (!this.character) return;
    const { x, y, direction } = this.character.getPositionAndDirection();
    let targetX = x,
      targetY = y;
    if (direction === 'up') targetY -= 1;
    else if (direction === 'down') targetY += 1;
    else if (direction === 'left') targetX -= 1;
    else if (direction === 'right') targetX += 1;

    const objectsAtTarget = this.objectFactory.getObjectsAt(targetX, targetY);
    if (objectsAtTarget.length === 0) {
      this._logAction('앞에 상호작용할 수 있는 것이 없습니다.', true);
      this.failed = true; // 실패 상태로 설정
      return;
    }

    let interacted = false;
    for (const obj of objectsAtTarget) {
      if (obj && typeof obj.interact === 'function') {
        if (obj.interact(this.character)) {
          // 객체의 interact 메서드 호출
          this._logAction(`${obj.type}와(과) 상호작용했습니다.`);
          interacted = true;
          if (this.onAction) this.onAction('objectUpdate', { objectId: obj.id, newState: obj.getState() });

          // 연결된 객체 자동 상호작용 (Button -> Door 등)
          const linkedId = obj.getLinkedObject ? obj.getLinkedObject() : null;
          if (linkedId) {
            const linkedObject = this.objectFactory.getObject(linkedId);
            if (linkedObject && typeof linkedObject.interact === 'function') {
              linkedObject.interact(obj); // 연결된 객체도 상호작용
              if (this.onAction)
                this.onAction('objectUpdate', { objectId: linkedObject.id, newState: linkedObject.getState() });
            }
          }
          break;
        }
      }
    }
    if (!interacted) {
      this._logAction('앞에 있는 것은 상호작용할 수 없습니다.', true);
    }
    await this._delay(200);
  }

  async pickUp() {
    if (this.failed) return;
    if (!this.character) return;
    const { x, y, direction } = this.character.getPositionAndDirection();
    let targetX = x,
      targetY = y;
    if (direction === 'up') targetY -= 1;
    else if (direction === 'down') targetY += 1;
    else if (direction === 'left') targetX -= 1;
    else if (direction === 'right') targetX += 1;

    const objectsAtTarget = this.objectFactory.getObjectsAt(targetX, targetY);
    let pickedUp = false;
    for (const obj of objectsAtTarget) {
      if (obj && typeof this.character.pickUpObject === 'function') {
        if (this.character.pickUpObject(obj)) {
          this._logAction(`${obj.type}을(를) 주웠습니다.`);
          pickedUp = true;
          if (this.onAction) this.onAction('objectCollected', { characterId: this.characterId, objectId: obj.id });
          if (this.onAction)
            this.onAction('inventoryUpdate', { characterId: this.characterId, inventory: this.character.inventory });
          break;
        }
      }
    }
    if (!pickedUp && objectsAtTarget.length > 0) {
      this._logAction('앞에 있는 것은 주울 수 없습니다.', true);
      this.failed = true; // 실패 상태로 설정
    } else if (!pickedUp) {
      this._logAction('앞에 주울 아이템이 없습니다.', true);
      this.failed = true; // 실패 상태로 설정
    }
    await this._delay(200);
  }

  async drop() {
    if (this.failed) return;
    if (!this.character) return;
    if (!this.character.inventory || this.character.inventory.length === 0) {
      this._logAction('내려놓을 아이템이 없습니다.', true);
      this.failed = true; // 실패 상태로 설정
      return;
    }
    const itemToDrop = this.character.inventory[0]; // 첫 번째 아이템을 내려놓는다고 가정

    const { x, y, direction } = this.character.getPositionAndDirection();
    let targetX = x,
      targetY = y;
    if (direction === 'up') targetY -= 1;
    else if (direction === 'down') targetY += 1;
    else if (direction === 'left') targetX -= 1;
    else if (direction === 'right') targetX += 1;

    const bounds = this.tileFactory.getBounds();
    if (targetX < bounds.minX || targetX > bounds.maxX || targetY < bounds.minY || targetY > bounds.maxY) {
      this._logAction('맵 바깥에는 아이템을 내려놓을 수 없습니다.', true);
      this.failed = true; // 실패 상태로 설정
      return;
    }

    const targetTile = this.tileFactory.getTileAt(targetX, targetY);
    if (!targetTile || !targetTile.isStepable()) {
      this._logAction('아이템을 내려놓을 수 없는 장소입니다.', true);
      this.failed = true; // 실패 상태로 설정
      return;
    }
    if (this.objectFactory.getObjectsAt(targetX, targetY).filter((obj) => !obj.isCollected).length > 0) {
      this._logAction('이미 다른 물건이 있어 아이템을 내려놓을 수 없습니다.', true);
      this.failed = true; // 실패 상태로 설정
      return;
    }

    if (typeof this.character.dropObject === 'function') {
      if (this.character.dropObject(itemToDrop.id, targetX, targetY)) {
        this._logAction(`${itemToDrop.type}을(를) (${targetX}, ${targetY})에 내려놓았습니다.`);
        if (this.onAction)
          this.onAction('objectDropped', { characterId: this.characterId, object: itemToDrop.toJSON() }); // 객체 전체 정보 전달
        if (this.onAction)
          this.onAction('inventoryUpdate', { characterId: this.characterId, inventory: this.character.inventory });
      } else {
        this._logAction('아이템을 내려놓는데 실패했습니다.', true);
        this.failed = true; // 실패 상태로 설정
      }
    }
    await this._delay(200);
  }

  isDoorOpen() {
    if (this.failed) return;
    if (!this.character) return false;
    const { x, y, direction } = this.character.getPositionAndDirection();
    let targetX = x,
      targetY = y;
    if (direction === 'up') targetY -= 1;
    else if (direction === 'down') targetY += 1;
    else if (direction === 'left') targetX -= 1;
    else if (direction === 'right') targetX += 1;

    const objectsAtTarget = this.objectFactory.getObjectsAt(targetX, targetY);
    for (const obj of objectsAtTarget) {
      if (obj && obj.type === 'door' && typeof obj.isOpen === 'function') {
        return obj.isPassable();
      }
    }
    return false; // 문이 없거나 열려 있지 않음
  }

  isGoalReached() {
    if (this.failed) return;
    if (!this.character) return false;
    const { x, y } = this.character.getPositionAndDirection();
    const goalTile = this.tileFactory.getTileAt(x, y);
    return goalTile && goalTile.type === 'goal'; // 목표 타일인지 확인
  }

  // 코드 실행 로직
  // codeString은 사용자가 작성한 블록 코드가 변환된 JavaScript 문자열이라고 가정합니다.
  // 예: "await worker.moveForward(); await worker.turnLeft(); await worker.interact();"
  async runCode(codeString) {
    if (this.isRunning) {
      this._logAction('이미 코드가 실행 중입니다.', true);
      return;
    }
    if (!this.character) {
      this._logAction(`캐릭터 (ID: ${this.characterId})를 찾을 수 없습니다.`, true);
      return;
    }

    this.isRunning = true;

    try {
      // 'this'를 worker로 참조할 수 있도록 컨텍스트 제공
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      const func = new AsyncFunction('worker', codeString);
      await func(this); // 여기서 this는 Worker 인스턴스 자신
    } catch (error) {
      console.error('Worker code execution error:', error);
      this._logAction(`코드 실행 중 오류: ${error.message}`, true);
    } finally {
      this._delay(200);
      if (this.onAction) this.onAction('runComplete', { characterId: this.characterId });
      if (this.isGoalReached()) {
        this._logAction('목표에 도달했습니다! 축하합니다!');
      }
      this.isRunning = false;
      this.failed = false; // 코드 실행 후 실패 상태 초기화
    }
  }
}
