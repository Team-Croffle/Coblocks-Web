import { StepableTile } from '@/components/modules/stage/tiles/StepableTile';

export class Goal extends StepableTile {
  constructor(x, y) {
    super('goal', x, y);
  }

  getImage() {
    try {
      //eslint-disable-next-line no-undef
      const GrassImage = require('@/assets/images/tiles/goal.png');
      return GrassImage;
    } catch {
      return {
        style: {
          backgroundColor: '#FFD700',
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
