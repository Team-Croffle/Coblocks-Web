import { StepableTile } from '@/components/modules/stage/tiles/StepableTile';

export class Path extends StepableTile {
  constructor(x, y) {
    super('path', x, y);
  }

  getImage() {
    try {
      //eslint-disable-next-line no-undef
      const PathImage = require('@/assets/images/tiles/path.png');
      return PathImage;
    } catch {
      return {
        style: {
          backgroundColor: '#D2B48C',
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
