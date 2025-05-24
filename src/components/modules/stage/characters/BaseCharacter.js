export class BaseCharacter {
  /**
   *
   * @param {string} id - Unique identifier for the character
   * @param {number} x - X coordinate of the character
   * @param {number} y - Y coordinate of the character
   * @param {string} [state='idle'] - Current state of the character (e.g., 'idle', 'walking', 'running')
   * @param {string} [direction='down'] - Direction the character is facing (e.g., 'up', 'down', 'left', 'right')
   * @param {Array} [inventory=[]] - Inventory items the character has
   * @param {Array} playerCodes - Array of player codes associated with the character
   * @description
   * This is the base class for all characters in the stage.
   * It provides basic properties and methods that can be extended by specific character implementations.
   */
  constructor(id, x, y, state = 'idle', direction = 'down', inventory = [], playerCodes) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.state = state;
    this.direction = direction;
    this.inventory = inventory;
    this.playerCodes = playerCodes;
  }

  getInfo() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      state: this.state,
      direction: this.direction,
      inventory: this.inventory,
    };
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  getDirection() {
    return this.direction;
  }

  getState() {
    return this.state;
  }

  getPlayerCodes() {
    return this.playerCodes;
  }

  getImage() {
    return null; // Override in subclasses
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  setState(state) {
    this.state = state;
  }

  setPlayerCodes(playerCodes) {
    this.playerCodes = playerCodes;
  }

  interactWithObject(object) {
    if (object.interactWithObject) {
      return object.interactWithObject();
    }
    return false;
  }

  addToInventory(item) {
    this.inventory.push(item);
  }

  removeFromInventoryById(itemId) {
    const index = this.inventory.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      this.inventory.splice(index, 1);
      return true;
    }
    return false;
  }

  removeFromInventoryByIndex(index) {
    if (index >= 0 && index < this.inventory.length) {
      this.inventory.splice(index, 1);
      return true;
    }
    return false;
  }

  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      state: this.state,
      direction: this.direction,
      inventory: this.inventory,
      playerCodes: this.playerCodes,
    };
  }

  static fromJSON(data) {
    return new this(data.name, data.x, data.y, data.imageUrl);
  }
}
