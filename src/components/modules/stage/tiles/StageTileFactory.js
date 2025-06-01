import { Grass } from './implementations/Grass';
import { Path } from './implementations/Path';
import { Wall } from './implementations/Wall';
import { Water } from './implementations/Water';
import { Goal } from './implementations/Goal';

export class StageTileFactory {
  constructor() {
    this.tileTypes = new Map([
      [0, 'grass'],
      [1, 'path'],
      [2, 'wall'],
      [3, 'water'],
      [4, 'goal'],
    ]);
    this.tileFactories = new Map([
      ['grass', (x, y) => new Grass(x, y)],
      ['path', (x, y) => new Path(x, y)],
      ['wall', (x, y) => new Wall(x, y)],
      ['water', (x, y) => new Water(x, y)],
      ['goal', (x, y) => new Goal(x, y)],
    ]);
    this.tiles = [];
  }

  createTile(type, x, y) {
    if (typeof type === 'number') {
      type = this.tileTypes.get(type);
    }
    const factory = this.tileFactories.get(type);
    if (!factory) {
      throw new Error(`Unknown tile type: ${type}`);
    }

    return factory(x, y);
  }

  getTileAt(x, y) {
    return this.tiles.find((tile) => tile.x === x && tile.y === y);
  }

  getAllTiles() {
    return this.tiles;
  }

  getBounds() {
    return {
      minX: 0,
      minY: 0,
      maxX: this.cols - 1,
      maxY: this.rows - 1,
    };
  }

  static canStepOn(type) {
    const typeName = this.tileTypes.get(type);
    return typeName === 'grass' || typeName === 'path' || typeName === 'goal';
  }

  loadFromListValues(tilesData, rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.tiles = [];
    for (let y = 0; y < tilesData.length; y++) {
      for (let x = 0; x < tilesData[y].length; x++) {
        const tileData = tilesData[y][x];
        const tile = this.createTile(tileData, x, y);
        this.tiles.push(tile);
      }
    } // for
  } // loadFromListValues
}
