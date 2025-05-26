import { CollectibleObject } from '@/components/modules/stage/objects/CollectibleObject';

export class Box extends CollectibleObject {
  constructor(id, x, y) {
    super(id, 'box', x, y);
  }

  getImage() {
    try {
      //eslint-disable-next-line no-undef
      const boxImage = require('@/assets/images/objects/box.png');
      return boxImage;
    } catch {
      return '📦'; // Fallback
    }
  }

  getIcon() {
    try {
      //eslint-disable-next-line no-undef
      const boxIcon = require('@/assets/images/icons/box.png');
      return boxIcon;
    } catch {
      return '📦'; // Fallback
    }
  }
}
