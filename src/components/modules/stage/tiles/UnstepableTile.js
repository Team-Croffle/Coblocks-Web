import { BaseTile } from './BaseTile';

export class UnstepableTile extends BaseTile {
  constructor(type, x, y) {
    super(type, x, y);
  }

  getImage() {
    return null; // Override in subclasses
  }

  isStepable() {
    return false; // Unstepable tiles are never stepable
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
