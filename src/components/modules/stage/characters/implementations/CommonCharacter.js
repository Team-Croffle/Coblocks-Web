import { BaseCharacter } from '@/components/modules/stage/characters/BaseCharacter';

export class CommonCharacter extends BaseCharacter {
  /**
   * @param {string} id - Unique identifier for the character
   * @param {number} x - X coordinate of the character
   * @param {number} y - Y coordinate of the character
   * @param {string} [state='idle'] - Current state of the character (e.g., 'idle', 'walking', 'running')
   * @param {string} [direction='down'] - Direction the character is facing (e.g., 'up', 'down', 'left', 'right')
   * @param {Array} [inventory=[]] - Inventory items the character has
   * @param {Array} playerCodes - Array of player codes associated with the character
   */
  constructor(id, x, y, state = 'idle', direction = 'down', inventory = [], playerCodes) {
    super(id, x, y, state, direction, inventory, playerCodes);

    this.playerColor = new Map([
      [1, '#FF6666'],
      [2, '#99FF99'],
      [3, '#EE99FF'],
      [4, '#99FFFF'],
    ]);
  }

  move(deltaX, deltaY) {
    const newPos = super.move(deltaX, deltaY);
    this.setPosition(newPos.x, newPos.y);
    return newPos;
  }

  pickUpObject(object) {
    if (object && object.collect) {
      object.collect();
      super.addToInventory(object);
      return true;
    }
    return false;
  }

  dropObject(objId, x, y) {
    const index = this.inventory.findIndex((item) => item.getId() === objId);
    const object = this.inventory[index];

    if (object) {
      object.drop(x, y);
      super.removeFromInventoryByIndex(index);
      return true;
    }
    return false;
  }

  getImage() {
    const color = this.playerColor.get(this.id);
    try {
      // eslint-disable-next-line
      const idleImage = require('@/assets/images/characters/idle.png');
      // eslint-disable-next-line
      const walkImage = require('@/assets/images/characters/walk.png');
      return this.state === 'idle' ? idleImage : walkImage;
    } catch (error) {
      console.warn('Error loading image:', error);
      return {
        style: {
          backgroundColor: color,
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '2px solid white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.81em',
          color: 'white',
          transition: 'all 0.3s ease',
        },
        text: this.id,
      };
    } // try-catch
  } // getImage
}
