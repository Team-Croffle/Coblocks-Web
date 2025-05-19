import Phaser from 'phaser';
import Character from './Character';
import grassImg from '@images/Stages/grass.png';
import pathImg from '@images/Stages/path.png';
import wallImg from '@images/Stages/wall.png';

class StageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StageScene' });
    this.stageData = null;
    this.character = null;
    this.characterInstance = null;
    this.cellSize = { width: 0, height: 0 };
    this.onCharacterUpdate = null;
  }

  preload() {
    // 스테이지 이미지 로드
    this.load.image('grass', grassImg);
    this.load.image('path', pathImg);
    this.load.image('wall', wallImg);

    // 캐릭터 스프라이트 로드
    for (let i = 1; i <= 15; i++) {
      this.load.image(`idle_${i}`, `@images/Characters/Idle/Idle_${i}.png`);
      this.load.image(`walk_${i}`, `@images/Characters/Walk/Walk_${i}.png`);
    }

    // 이미지 로드 에러 처리
    this.load.on('loaderror', (fileObj) => {
      console.warn(`Error loading file: ${fileObj.src}`);

      // 기본 이미지로 대체 (실제 구현 시 기본 이미지 필요)
      if (fileObj.key.startsWith('idle_') || fileObj.key.startsWith('walk_')) {
        console.info(`Using fallback image for ${fileObj.key}`);
        // 실제 구현에서는 기본 이미지를 로드하는 코드 추가
      }
    });
  }

  create(data) {
    if (!data || !data.stageData) return;

    this.stageData = data.stageData;
    this.onCharacterUpdate = data.onCharacterUpdate;

    // 셀 크기 계산
    this.cellSize = {
      width: this.cameras.main.width / this.stageData.width,
      height: this.cameras.main.height / this.stageData.height,
    };

    // 그리드 그리기
    this.drawGrid();

    // 오브젝트 그리기
    this.drawObjects();

    // 캐릭터 생성
    if (this.stageData.character) {
      this.characterInstance = new Character(
        this,
        this.stageData.character.x,
        this.stageData.character.y,
        this.stageData.character.direction || 'right',
      );

      this.character = this.stageData.character;

      // 외부에서 접근할 수 있도록 캐릭터 상태 업데이트
      if (this.onCharacterUpdate) {
        this.onCharacterUpdate(this.character);
      }
    }
  }

  drawGrid() {
    // 기본 배경으로 잔디 채우기
    for (let y = 0; y < this.stageData.height; y++) {
      for (let x = 0; x < this.stageData.width; x++) {
        this.add
          .image(
            x * this.cellSize.width + this.cellSize.width / 2,
            y * this.cellSize.height + this.cellSize.height / 2,
            'grass',
          )
          .setDisplaySize(this.cellSize.width, this.cellSize.height);
      }
    }

    // 그리드 셀 그리기
    if (this.stageData.grid) {
      this.stageData.grid.forEach((cell) => {
        if (cell.type !== 'grass') {
          this.add
            .image(
              cell.x * this.cellSize.width + this.cellSize.width / 2,
              cell.y * this.cellSize.height + this.cellSize.height / 2,
              cell.type,
            )
            .setDisplaySize(this.cellSize.width, this.cellSize.height);
        }
      });
    }
  }

  drawObjects() {
    if (!this.stageData.objects) return;

    this.stageData.objects.forEach((obj) => {
      const x = obj.x * this.cellSize.width + this.cellSize.width / 2;
      const y = obj.y * this.cellSize.height + this.cellSize.height / 2;

      switch (obj.type) {
        case 'button': {
          const color = obj.state === 'pressed' ? 0xff0000 : 0x00ff00;
          const button = this.add.circle(x, y, this.cellSize.width / 4, color);
          button.setData('id', obj.id);
          button.setData('type', 'button');
          button.setData('state', obj.state);
          break;
        }
        case 'door': {
          const color = obj.state === 'open' ? 0xffffff : 0x8b4513;
          const door = this.add.rectangle(x, y, this.cellSize.width, this.cellSize.height, color);
          door.setStrokeStyle(2, 0x000000);
          door.setData('id', obj.id);
          door.setData('type', 'door');
          door.setData('state', obj.state);
          break;
        }
        // 다른 오브젝트 타입 추가
      }
    });
  }

  updateCharacter(newCharacter) {
    this.character = newCharacter;

    if (this.characterInstance) {
      // 캐릭터 방향 설정
      if (this.character.direction !== this.characterInstance.direction) {
        this.characterInstance.direction = this.character.direction;
        this.characterInstance.sprite.setFlipX(this.character.direction === 'left');
      }

      // 캐릭터 이동
      if (this.character.x !== this.characterInstance.x || this.character.y !== this.characterInstance.y) {
        let direction;

        if (this.character.x > this.characterInstance.x) direction = 'right';
        else if (this.character.x < this.characterInstance.x) direction = 'left';
        else if (this.character.y > this.characterInstance.y) direction = 'down';
        else if (this.character.y < this.characterInstance.y) direction = 'up';

        this.characterInstance.move(direction);
      }
    }

    // 외부 콜백 호출
    if (this.onCharacterUpdate) {
      this.onCharacterUpdate(this.character);
    }
  }

  updateObject(objectId, newState) {
    if (!this.stageData.objects) return;

    const objIndex = this.stageData.objects.findIndex((o) => o.id === objectId);
    if (objIndex === -1) return;

    this.stageData.objects[objIndex].state = newState;

    // 화면 업데이트를 위해 오브젝트 다시 그리기
    this.children.list
      .filter((child) => child.getData && child.getData('id') === objectId)
      .forEach((child) => {
        child.destroy();
      });

    const obj = this.stageData.objects[objIndex];
    const x = obj.x * this.cellSize.width + this.cellSize.width / 2;
    const y = obj.y * this.cellSize.height + this.cellSize.height / 2;

    switch (obj.type) {
      case 'button': {
        const color = obj.state === 'pressed' ? 0xff0000 : 0x00ff00;
        const button = this.add.circle(x, y, this.cellSize.width / 4, color);
        button.setData('id', obj.id);
        button.setData('type', 'button');
        button.setData('state', obj.state);
        break;
      }
      case 'door': {
        const color = obj.state === 'open' ? 0xffffff : 0x8b4513;
        const door = this.add.rectangle(x, y, this.cellSize.width, this.cellSize.height, color);
        door.setStrokeStyle(2, 0x000000);
        door.setData('id', obj.id);
        door.setData('type', 'door');
        door.setData('state', obj.state);
        break;
      }
      // 다른 오브젝트 타입 추가
    }
  }
}

export default StageScene;
