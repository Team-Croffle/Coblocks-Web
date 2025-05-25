import { InteractiveObject } from '../InteractiveObject';

export class Button extends InteractiveObject {
  constructor(id, x, y) {
    super(id, 'button', x, y);
  }

  isValidState(state) {
    return ['default', 'pressed'].includes(state);
  }

  interact(character) {
    const previousState = this.state;
    if (this.state === 'default') {
      this.setState('pressed');
    } else {
      this.setState('default');
    }
    console.log(
      `Button ${this.id} interacted by ${character ? character.id : 'N/A'}. State: ${previousState} -> ${this.state}`,
    );
    return true;
  }

  getImage() {
    try {
      //eslint-disable-next-line no-undef
      const buttonDefaultImage = require('@/assets/images/objects/button_default.png');
      //eslint-disable-next-line no-undef
      const buttonPressedImage = require('@/assets/images/objects/button_pressed.png');
      return this.state === 'pressed' ? buttonPressedImage : buttonDefaultImage;
    } catch {
      return this.state === 'pressed' ? '⚪' : '⭕'; // Fallback
    }
  }
}
