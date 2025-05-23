import { BaseTile } from './BaseTile';

export class StepableTile extends BaseTile {
  constructor(type, x, y) {
    super(type, x, y);
  }

  getImage() {
    return null; // Override in subclasses
  }

  toListValue() {
    return {
      ...super.toListValue(),
    };
  }

  static fromListValue(date) {
    return new this(date.type, date.x, date.y);
  }
}
