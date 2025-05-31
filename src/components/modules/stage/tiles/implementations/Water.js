import { UnstepableTile } from '@/components/modules/stage/tiles/UnstepableTile';

export class Water extends UnstepableTile {
  constructor(x, y) {
    super('water', x, y);
  }

  getImage() {
    try {
      //eslint-disable-next-line no-undef
      const WaterImage = require('@/assets/images/tiles/water.png');
      return WaterImage;
    } catch {
      return {
        style: {
          backgroundColor: '#33AAFF',
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
