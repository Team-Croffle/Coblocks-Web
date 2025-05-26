import { InteractiveObject } from '../InteractiveObject';
import purpleDoor from '@/assets/images/objects/purple-door.png';
import purpleDoorOpen from '@/assets/images/objects/purple-door-open.png';
import blueDoor from '@/assets/images/objects/blue-door.png';
import blueDoorOpen from '@/assets/images/objects/blue-door-open.png';
import greenDoor from '@/assets/images/objects/green-door.png';
import greenDoorOpen from '@/assets/images/objects/green-door-open.png';
import orangeDoor from '@/assets/images/objects/orange-door.png';
import orangeDoorOpen from '@/assets/images/objects/orange-door-open.png';

export class Door extends InteractiveObject {
  constructor(id, x, y, color) {
    super(id, 'door', x, y);
    this.state = 'default'; // 'default'는 닫힌 상태
    this.color = color || 'purple'; // 기본 색상
  }

  isValidState(state) {
    return ['open', 'default'].includes(state);
  }

  interact(object = null) {
    if (this.state === 'default') {
      if (object) {
        console.log(object);
        if (object.inventory && typeof object.inventory.some === 'function') {
          const key = object.inventory.find((item) => item.type === 'key' && item.color === this.color);
          if (key) {
            this.setState('open');
            if (this.onAction) {
              this.onAction('doorOpened', { doorId: this.id });
            }
            return true;
          }
        } else if (object.type === 'button') {
          if (this.id === object.linkedTo) {
            this.setState('open');
            if (this.onAction) {
              this.onAction('doorOpened', { doorId: this.id });
            }
            return true;
          }
        }
      }
    }
    return false;
  }

  isPassable() {
    return this.state === 'open';
  }

  getImage() {
    if (this.state === 'open') {
      switch (this.color) {
        case 'purple':
          return purpleDoorOpen;
        case 'blue':
          return blueDoorOpen;
        case 'green':
          return greenDoorOpen;
        case 'orange':
          return orangeDoorOpen;
        default:
          return purpleDoorOpen; // 기본값
      }
    }
    switch (this.color) {
      case 'purple':
        return purpleDoor;
      case 'blue':
        return blueDoor;
      case 'green':
        return greenDoor;
      case 'orange':
        return orangeDoor;
      default:
        return purpleDoor; // 기본값
    }
  }
}
