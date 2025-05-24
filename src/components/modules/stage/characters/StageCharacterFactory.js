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
      this.create(data.type, data.id, data.x, data.y, 'idle', 'right');
    });
  }

  // Save characters to JSON data
  saveToJSON() {
    return this.getAllCharacters().map((character) => character.toJson());
  }
}
