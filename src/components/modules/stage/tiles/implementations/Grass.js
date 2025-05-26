import { StepableTile } from '@/components/modules/stage/tiles/StepableTile';

export class Grass extends StepableTile {
  constructor(x, y) {
    super('grass', x, y);
  }

  getImage() {
    try {
      //eslint-disable-next-line no-undef
      const GrassImage = require('@/assets/images/tiles/grass.png');
      return GrassImage;
    } catch {
      return {
        style: {
          backgroundColor: '#4CAC00',
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
