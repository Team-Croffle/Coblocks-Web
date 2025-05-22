import React from 'react';

// Singleton 패턴을 사용하여 인스턴스를 1개로 제한
const stageObjectsImagesInstance = new StageObjectsImages();

export default class StageObjects {
  /**
   *
   * @param {string} id
   * @param {string} objType
   * @param {number} x
   * @param {number} y
   * @param {string} state
   * @param {boolean} isInteractable
   */
  constructor(id, objType, x, y, state, isInteractable) {
    this.id = id;
    this.objType = objType;
    this.x = x;
    this.y = y;
    this.state = state;
    this.isInteractable = isInteractable;
  }

  /**
   * 게임 오브젝트 생성
   * @returns {Object} 게임 오브젝트 정보
   */
  GameObject = () => {
    try {
      const obj = stageObjectsImagesInstance[this.objType][this.state];

      return {
        id: this.id,
        x: this.x,
        y: this.y,
        isInteractable: this.isInteractable,
        object: <div style={obj.style}>{obj.content}</div>,
      };
    } catch (error) {
      console.error(`오브젝트 생성 오류: ${this.objType}.${this.state}`, error);
      // 기본 대체 오브젝트 반환
      return {
        id: this.id,
        x: this.x,
        y: this.y,
        isInteractable: this.isInteractable,
        object: <div style={{ backgroundColor: '#FF0000', color: 'white' }}>❓</div>,
      };
    }
  };
}

/**
 * StageObjectsImages는 StageObjects의 이미지 정보를 관리하는 클래스입니다.
 * 각 객체의 상태에 따라 이미지를 설정하고, 이미지가 없을 경우 대체 콘텐츠를 반환합니다.
 * new StageObjectsImages()[objType][state]를 통해 이미지 정보를 가져올 수 있습니다.
 * 예시: new StageObjectsImages()['door']['closed']
 */
class StageObjectsImages {
  // 객체 정의를 구조화하여 유지보수성 향상
  static OBJECTS_CONFIG = {
    door: {
      closed: { color: '#8B4513', fallback: '🚪' },
      opened: { color: '#90EE90', fallback: '▢' },
    },
    button: {
      unpressed: { color: '#FF6347', fallback: '🔘' },
      pressed: { color: '#44FF44', fallback: '🔘' },
    },
    box: {
      closed: { color: '#8B4513', fallback: '📦' },
      opened: { color: '#90EE90', fallback: '▢' },
    },
    key: {
      now: { color: '#FF69B4', fallback: '🔑' },
    },
    goal: {
      empty: { color: '#FF69B4', fallback: '🎯' },
      filled: { color: '#32CD32', fallback: '✓' },
    },
  };

  constructor() {
    // 객체 타입별 초기화
    Object.entries(StageObjectsImages.OBJECTS_CONFIG).forEach(([objType, states]) => {
      this[objType] = {};

      // 각 상태별 객체 설정
      Object.entries(states).forEach(([state, config]) => {
        const imgName = `${objType}${state.charAt(0).toUpperCase() + state.slice(1)}`;
        this[objType][state] = this.setObject(imgName, config.color, config.fallback);
      });
    });
  } // constructor

  /**
   * @param {string} objType
   * @param {string} replace
   * @param {string} replaceColor
   * @returns {object} {style, content}
   * @description
   * - objType: 이미지 파일 이름 (확장자 제외)
   * - replace: 대체 콘텐츠 (이미지 대신 표시할 내용)
   * - replaceColor: 대체 콘텐츠의 배경색
   * - return 값 사용 예시: <div style={style}>{content}</div>
   */
  setObject(objType, replaceColor, replace = '') {
    try {
      // require로 이미지를 동기적으로 불러옴
      // eslint-disable-next-line no-undef
      const image = require(`@/assets/images/Stages/${objType}.png`);
      return {
        style: {
          backgroundImage: `url(${image})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundColor: replaceColor,
          color: 'white',
        },
        content: replace,
      };
    } catch (err) {
      // 개발 환경에서만 경고 표시
      if (import.meta.VITE_RUNNING_MODE !== 'production') {
        console.warn(`이미지를 찾을 수 없음: ${objType}.png - 대체 콘텐츠 사용: ${err}`);
      }

      return {
        style: {
          backgroundColor: replaceColor,
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        content: replace,
      };
    } //try-catch
  } // SetObject();
}
