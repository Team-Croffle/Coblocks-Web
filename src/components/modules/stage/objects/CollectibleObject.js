import { BaseObject } from './BaseObject';

/**
 * Base class for objects that can be collected into inventory
 */
export class CollectibleObject extends BaseObject {
  constructor(id, type, x, y) {
    super(id, type, x, y);
    this.isCollected = false;
  }

  collect() {
    this.isCollected = true;
    this.state = 'collected';
    return true;
  }

  drop(x, y) {
    this.isCollected = false;
    this.state = 'default';
    this.x = x;
    this.y = y;
    return true;
  }

  isValidState(state) {
    return ['default', 'collected'].includes(state);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      isCollected: this.isCollected,
    };
  }

  static fromJSON(data) {
    const obj = super.fromJSON(data);
    obj.isCollected = data.isCollected;
    return obj;
  }
}
