import { InteractiveObject } from '../InteractiveObject';

export class Door extends InteractiveObject {
  constructor(id, x, y) {
    super(id, 'door', x, y);
    this.state = 'default';
  }

  isValidState(state) {
    return ['open', 'default'].includes(state);
  }

  interact() {
    if (this.state === 'default') {
      this.setState('open');
    } else {
      this.setState('default');
    }
    return true;
  }

  getImage() {
    try {
      //eslint-disable-next-line no-undef
      const doorOpenImage = require('@/assets/images/objects/door_open.png');
      //eslint-disable-next-line no-undef
      const doorClosedImage = require('@/assets/images/objects/door_closed.png');
      return this.state === 'open' ? doorOpenImage : doorClosedImage;
    } catch {
      return this.state === 'open' ? '▢' : '🚪'; // Fallback
    }
  }
}
