import { CollectibleObject } from '@/components/modules/stage/objects/CollectibleObject';

export class Key extends CollectibleObject {
  constructor(id, x, y) {
    super(id, 'key', x, y);
  }

  getImage() {
    try {
      //eslint-disable-next-line no-undef
      const keyImage = require('@/assets/images/objects/key.png');
      return keyImage;
    } catch {
      return '🔑'; // Fallback
    }
  }

  getIcon() {
    try {
      //eslint-disable-next-line no-undef
      const keyIcon = require('@/assets/images/icons/key.png');
      return keyIcon;
    } catch {
      return '🔑'; // Fallback
    }
  }
}
