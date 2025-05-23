/**
 * Base class for all stage objects
 */
export class BaseObject {
  constructor(id, type, x, y) {
    this.id = id;
    this.type = type;
    this.x = x;
    this.y = y;
    this.state = 'default';
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    if (this.isValidState(newState)) {
      this.state = newState;
      return true;
    }
    return false;
  }

  // eslint-disable-next-line no-unused-vars
  isValidState(state) {
    return true; // Base objects accept any state, override in subclasses
  }

  getImage() {
    return null; // Override in subclasses
  }

  getIcon() {
    return null; // Override in subclasses
  }

  // Method to serialize the object to JSON for saving to DB
  toJSON() {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      state: this.state,
    };
  }

  // Static method to create object from JSON data
  static fromJSON(data) {
    const obj = new this(data.id, data.type, data.x, data.y);
    obj.setState(data.state);
    return obj;
  }
}
