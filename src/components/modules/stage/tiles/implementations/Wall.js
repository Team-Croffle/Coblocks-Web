import { UnstepableTile } from '@/components/modules/stage/tiles/UnstepableTile';

export class Wall extends UnstepableTile {
  constructor(x, y) {
    super('wall', x, y);
  }

  getImage() {
    try {
      //eslint-disable-next-line no-undef
      const WallImage = require('@/assets/images/tiles/wall.png');
      return WallImage;
    } catch {
      return {
        style: {
          backgroundColor: '#808080',
          width: '100%',
          height: '100%',
        },
      };
    }
  }

  toListValue() {
    return {
      ...super.toListValue(),
    };
  }

  static fromListValue(data) {
    return new this(data.x, data.y);
  }
}
