export class StageCharacter {
  constructor(id, x, y, state = 'idle', direction = 'down', inventory = [], playerCodes) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.state = state;
    this.direction = direction;
    this.inventory = inventory;
    this.playerCodes = playerCodes;

    this.playerColor = new Map([
      [1, '#FF6666'],
      [2, '#99FF99'],
      [3, '#EE99FF'],
      [4, '#99FFFF'],
    ]);
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

  moveCharacter(x, y) {
    const newPos = {
      x: this.x + x,
      y: this.y + y,
    };
    this.x = newPos.x;
    this.y = newPos.y;
    return newPos;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  interactWithObject(object) {
    if (object.interactWithObject) {
      return object.interactWithObject();
    }
    return false;
  }

  getInventory() {
    return this.inventory;
  }

  addToInventory(item) {
    this.inventory.push(item);
  }

  removeFromInventoryByObjId(objId) {
    const index = this.inventory.findIndex((item) => item.getId() === objId);
    if (index > -1) {
      this.inventory.splice(index, 1);
    }
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
