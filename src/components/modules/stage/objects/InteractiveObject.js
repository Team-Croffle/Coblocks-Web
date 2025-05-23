import { BaseObject } from './BaseObject';

/**
 * Base class for objects that can be interacted with (e.g., buttons, levers)
 */
export class InteractiveObject extends BaseObject {
  constructor(id, type, x, y) {
    super(id, type, x, y);
    this.linkedTo = null;
  }

  setLinkedObject(objectId) {
    this.linkedTo = objectId;
  }

  getLinkedObject() {
    return this.linkedTo;
  }

  interact() {
    // Override in subclasses to define interaction behavior
    return false;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      linkedTo: this.linkedTo
    };
  }

  static fromJSON(data) {
    const obj = super.fromJSON(data);
    obj.setLinkedObject(data.linkedTo);
    return obj;
  }
}