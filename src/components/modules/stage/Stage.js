class Stage {
  /**
   * Stage 인스턴스를 생성합니다.
   * @param {object} stageInfo - 스테이지 기본 정보
   * @param {number} stageInfo.width - 스테이지 너비
   * @param {number} stageInfo.height - 스테이지 높이
   * @param {number} stageInfo.tileSize - 타일 크기
   * @param {string} stageInfo.title - 스테이지 제목
   * @param {number[][]} stageTileMap - 스테이지 타일맵 (0: 잔디, 1: 길, 2: 물 등)
   * @param {object[]} stageObjects - 스테이지 오브젝트 배열
   * @param {object[]} stageCharacters - 스테이지 캐릭터 배열
   * @throws {Error} 필수 매개변수가 없거나 유효하지 않은 경우
   */
  constructor(stageInfo, stageTileMap, stageObjects, stageCharacters) {
    // 필수 매개변수 검증
    if (!stageInfo || typeof stageInfo !== 'object') {
      throw new Error('유효한 stageInfo 객체가 필요합니다');
    }

    if (!Array.isArray(stageTileMap) || stageTileMap.length === 0) {
      throw new Error('유효한 stageTileMap 배열이 필요합니다');
    }

    this.stageInfo = { ...stageInfo };
    this.stageTileMap = stageTileMap.map((row) => [...row]);
    this.stageObjects = Array.isArray(stageObjects) ? stageObjects.map((obj) => ({ ...obj })) : [];
    this.stageCharacters = Array.isArray(stageCharacters) ? stageCharacters.map((char) => ({ ...char })) : [];

    // 읽기 전용 속성으로 변환 (개발 환경에서만 적용)
    if (import.meta.VITE_RUNNING_MODE !== 'production') {
      Object.freeze(this.stageInfo);
      this.stageTileMap.forEach((row) => Object.freeze(row));
      Object.freeze(this.stageTileMap);
      this.stageObjects.forEach((obj) => Object.freeze(obj));
      Object.freeze(this.stageObjects);
      this.stageCharacters.forEach((char) => Object.freeze(char));
      Object.freeze(this.stageCharacters);
    }
  }

  /**
   * 스테이지 기본 정보를 반환합니다.
   * @returns {object} 스테이지 정보 객체
   */
  getStageInfo() {
    return { ...this.stageInfo };
  }

  /**
   * 스테이지 타일맵을 반환합니다.
   * @returns {number[][]} 2차원 타일맵 배열
   */
  getStageTileMap() {
    return this.stageTileMap.map((row) => [...row]);
  }

  /**
   * 스테이지 오브젝트 목록을 반환합니다.
   * @returns {object[]} 오브젝트 배열
   */
  getStageObjects() {
    return this.stageObjects.map((obj) => ({ ...obj }));
  }

  /**
   * 스테이지 캐릭터 목록을 반환합니다.
   * @returns {object[]} 캐릭터 배열
   */
  getStageCharacters() {
    return this.stageCharacters.map((char) => ({ ...char }));
  }

  /**
   * 스테이지의 크기를 반환합니다.
   * @returns {{width: number, height: number}} 스테이지 크기
   */
  getStageSize() {
    const { width, height } = this.stageInfo;
    return { width, height };
  }

  /**
   * 특정 위치의 타일 타입을 반환합니다.
   * @param {number} x - x 좌표
   * @param {number} y - y 좌표
   * @returns {number|null} 타일 타입 (없으면 null)
   */
  getTileAt(x, y) {
    if (x < 0 || y < 0 || y >= this.stageTileMap.length || x >= (this.stageTileMap[0]?.length || 0)) {
      return null;
    }
    return this.stageTileMap[y][x];
  }
}
