import { CommonCharacter } from './implementations/CommonCharacter';

export class StageCharacterFactory {
  constructor() {
    this.characters = new Map();
    this.characterFactories = new Map([
      ['player', (id, x, y, state, direction) => new CommonCharacter(id, x, y, state, direction, [], {})],
    ]);
  }

  // Create and add a new character
  create(type, id, x, y, state, direction) {
    const factory = this.characterFactories.get(type);
    if (!factory) {
      throw new Error(`Unknown character type: ${type}`);
    }

    const character = factory(id, x, y, state, direction);
    this.characters.set(id, character);
    return character;
  }

  // Get character by ID
  getCharacter(id) {
    return this.characters.get(id);
  }

  // Get all characters
  getAllCharacters() {
    return Array.from(this.characters.values());
  }

  // Load characters from JSON data
  loadFromJSON(charactersData) {
    this.characters.clear();
    charactersData.forEach((data) => {
      // data.type에 따라 다른 캐릭터 생성 가능, playerCodes도 data에서 받을 수 있음
      this.create(data.type || 'player', data.id, data.x, data.y, data.state || 'idle', data.direction || 'down');
      const character = this.getCharacter(data.id);
      if (character && data.playerCodes) {
        character.setPlayerCodes(data.playerCodes);
      }
      if (character && data.inventory) {
        // 초기 인벤토리 로드
        // inventory 데이터 형식에 따라 실제 객체로 변환 필요
        // 여기서는 BaseCharacter.fromJSON 등을 활용해야 할 수 있음
        // 지금은 CommonCharacter 생성자에서 inventory가 빈 배열로 초기화됨
      }
    });
  }

  // Save characters to JSON data
  saveToJSON() {
    return this.getAllCharacters().map((character) => character.toJson());
  }
}
