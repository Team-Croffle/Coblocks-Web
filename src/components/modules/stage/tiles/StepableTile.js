import { BaseTile } from './BaseTile';

export class StepableTile extends BaseTile {
  constructor(type, x, y) {
    super(type, x, y);
  }

  getImage() {
    return null; // Override in subclasses
  }

  isStepable() {
    return true; // StepableTile은 항상 걸을 수 있음
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