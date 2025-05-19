class Character {
  constructor(scene, x, y, direction = 'right') {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.sprite = null;
    this.currentAnimation = null;
    this.cellSize = scene.cellSize;

    this.createSprite();
  }

  createSprite() {
    // 캐릭터 스프라이트 생성
    const pixelX = this.x * this.cellSize.width + this.cellSize.width / 2;
    const pixelY = this.y * this.cellSize.height + this.cellSize.height / 2;

    // 기본 스프라이트 생성 (첫 번째 Idle 이미지 사용)
    this.sprite = this.scene.add.sprite(pixelX, pixelY, 'idle_1');
    this.sprite.setDisplaySize(this.cellSize.width * 0.8, this.cellSize.height * 0.8);

    // 방향에 따른 스프라이트 플립
    if (this.direction === 'left') {
      this.sprite.setFlipX(true);
    }

    // 애니메이션 생성
    this.createAnimations();

    // 기본 애니메이션 재생
    this.playAnimation('idle');
  }

  createAnimations() {
    // Idle 애니메이션이 없으면 생성
    if (!this.scene.anims.exists('idle')) {
      const idleFrames = [];
      for (let i = 1; i <= 15; i++) {
        idleFrames.push({ key: `idle_${i}` });
      }

      this.scene.anims.create({
        key: 'idle',
        frames: idleFrames,
        frameRate: 10,
        repeat: -1,
      });
    }

    // Walk 애니메이션이 없으면 생성
    if (!this.scene.anims.exists('walk')) {
      const walkFrames = [];
      for (let i = 1; i <= 15; i++) {
        walkFrames.push({ key: `walk_${i}` });
      }

      this.scene.anims.create({
        key: 'walk',
        frames: walkFrames,
        frameRate: 15,
        repeat: 0,
      });
    }
  }

  playAnimation(animName) {
    if (this.currentAnimation === animName) return;

    this.currentAnimation = animName;
    this.sprite.play(animName);
  }

  move(direction) {
    // 이동 전 위치 저장
    const prevX = this.x;
    const prevY = this.y;

    // 방향 변경
    if (direction === 'left' || direction === 'right') {
      this.direction = direction;
      this.sprite.setFlipX(direction === 'left');
    }

    // 이동 애니메이션 재생
    this.playAnimation('walk');

    // 이동 방향에 따른 위치 계산
    switch (direction) {
      case 'up':
        this.y -= 1;
        break;
      case 'down':
        this.y += 1;
        break;
      case 'left':
        this.x -= 1;
        break;
      case 'right':
        this.x += 1;
        break;
    }

    // 새 위치로 이동 애니메이션
    const newX = this.x * this.cellSize.width + this.cellSize.width / 2;
    const newY = this.y * this.cellSize.height + this.cellSize.height / 2;

    // 이동 트윈 생성
    this.scene.tweens.add({
      targets: this.sprite,
      x: newX,
      y: newY,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        // 이동 완료 후 Idle 애니메이션으로 전환
        this.playAnimation('idle');
      },
    });

    return { prevX, prevY, newX: this.x, newY: this.y };
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;

    const pixelX = this.x * this.cellSize.width + this.cellSize.width / 2;
    const pixelY = this.y * this.cellSize.height + this.cellSize.height / 2;

    this.sprite.setPosition(pixelX, pixelY);
  }

  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }
}

export default Character;
