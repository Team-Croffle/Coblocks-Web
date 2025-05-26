import { CollectibleObject } from '@/components/modules/stage/objects/CollectibleObject';
import pupleKey from '@/assets/images/objects/purple-key.png';
import orangeKey from '@/assets/images/objects/orange-key.png';
import greenKey from '@/assets/images/objects/green-key.png';
import blueKey from '@/assets/images/objects/blue-key.png';

export class Key extends CollectibleObject {
  constructor(id, x, y, color) {
    super(id, 'key', x, y);
    this.color = color || 'purple'; // 기본 색상
  }

  getImage() {
    // 색상에 따라 이미지 경로를 반환합니다.
    switch (this.color) {
      case 'purple':
        return pupleKey;
      case 'orange':
        return orangeKey;
      case 'green':
        return greenKey;
      case 'blue':
        return blueKey;
      default:
        return pupleKey; // 기본값으로 보라색 키 이미지 사용
    }
  }

  getIcon() {
    // 아이콘도 이미지와 동일한 경로 규칙을 따른다고 가정합니다.
    switch (this.color) {
      case 'purple':
        return pupleKey;
      case 'orange':
        return orangeKey;
      case 'green':
        return greenKey;
      case 'blue':
        return blueKey;
      default:
        return pupleKey; // 기본값으로 보라색 키 아이콘 사용
    }
  }
}
