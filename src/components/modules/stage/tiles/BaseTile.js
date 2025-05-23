export class BaseTile {
  /**
   *
   * @param {number | string} type
   * @param {number} x
   * @param {number} y
   * @param {boolean} canStepOn default: true
   */
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
  }

  getImage() {
    return null; // Override in subclasses
  }

  toListValue() {
    return {
      type: this.type,
      x: this.x,
      y: this.y,
    };
  }

  static fromListValue(data) {
    return new this(data.type, data.x, data.y);
  }
}
