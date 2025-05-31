import { InteractiveObject } from '../InteractiveObject';
import purpleButton from '@/assets/images/objects/purple-button.png';
import orangeButton from '@/assets/images/objects/orange-button.png';
import greenButton from '@/assets/images/objects/green-button.png';
import blueButton from '@/assets/images/objects/blue-button.png';
import pressedButton from '@/assets/images/objects/button-pressed.png';

export class Button extends InteractiveObject {
  constructor(id, x, y, color) {
    super(id, 'button', x, y);
    this.color = color || 'purple'; // 기본 색상
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
      `Button ${this.id} (color: ${this.color}) interacted by ${character ? character.id : 'N/A'}. State: ${previousState} -> ${this.state}`,
    );
    return true;
  }

  isPassable() {
    // 버튼은 항상 통과 가능하다고 가정합니다.
    return true;
  }

  getImage() {
    if (this.state === 'pressed') {
      return pressedButton;
    }
    // 색상에 따라 이미지 경로를 반환합니다.
    switch (this.color) {
      case 'purple':
        return purpleButton;
      case 'orange':
        return orangeButton;
      case 'green':
        return greenButton;
      case 'blue':
        return blueButton;
      default:
        return purpleButton; // 기본값으로 보라색 버튼 이미지 사용
    }
  }
}
