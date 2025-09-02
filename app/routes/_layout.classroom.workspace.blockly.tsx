import {
  CodeSet,
  Direction,
  EntityDefinition,
  EntityType,
  ObjectData,
  StageCharacterData,
  TileData,
} from '@croffledev/coblocks-stage-core';
import { StageConfig } from '@croffledev/coblocks-stage-react';
import { BlocklyEditor } from '~/components/blockly/BlocklyEditor';
import { StageViewer } from '~/components/StageViewer';
import { StageDataSet } from '~/types/stages';

export default function WorkspaceEditor() {
  const stageConfig: StageConfig = {
    size: { width: 8, height: 6 },
    tileSize: 32,
    showGrid: true,
    backgroundColor: '#ffffff',
  };

  const definitions: EntityDefinition[] = [];

  definitions.push({
    entityType: EntityType.TILE,
    typeId: 'wall',
    color: '#333',
    isPassable: false,
  });

  definitions.push({
    entityType: EntityType.TILE,
    typeId: 'grass',
    color: '#4caf50',
    isPassable: true,
  });

  definitions.push({
    entityType: EntityType.OBJECT,
    typeId: 'key',
    isCollectible: true,
    isInteractable: false,
    isPassable: true,
  });

  definitions.push({
    entityType: EntityType.OBJECT,
    typeId: 'door',
    isCollectible: false,
    isInteractable: true,
    isPassable: false,
  });

  definitions.push({
    entityType: EntityType.OBJECT,
    typeId: 'coin',
    isCollectible: true,
    isInteractable: false,
    isPassable: true,
  });

  definitions.push({
    entityType: EntityType.CHARACTER,
    typeId: 'character',
    isPassable: false,
  });
  const objects: ObjectData[] = [];
  const characters: StageCharacterData[] = [];
  const tiles: TileData[] = [];

  for (let x = 0; x < stageConfig.size.width; x++) {
    for (let y = 0; y < stageConfig.size.height; y++) {
      let typeId;
      if (x === 0 || x === stageConfig.size.width - 1 || y === 0 || y === stageConfig.size.height - 1) {
        typeId = 'wall';
      } else {
        typeId = 'grass';
      }

      tiles.push({
        id: `tile_${x}_${y}`,
        entityType: EntityType.TILE,
        typeId,
        position: { x, y },
      });
    }
  }

  objects.push({
    id: 'key_1',
    entityType: EntityType.OBJECT,
    typeId: 'key',
    position: { x: 3, y: 4 },
    color: '#ffeb3b',
    state: 'default',
    relatedObjectIds: [],
  });

  objects.push({
    id: 'door_1',
    entityType: EntityType.OBJECT,
    typeId: 'door',
    position: { x: 6, y: 3 },
    color: '#795548',
    state: 'default',
    relatedObjectIds: ['key_1'],
  });

  objects.push({
    id: 'coin_1',
    entityType: EntityType.OBJECT,
    typeId: 'coin',
    color: '#ffee58',
    position: { x: 2, y: 2 },
    state: 'default',
    relatedObjectIds: [],
  });

  characters.push({
    entityType: EntityType.CHARACTER,
    id: 'player1',
    typeId: 'character',
    position: { x: 1, y: 1 },
    color: '#3333BB',
    state: 'default',
    partNumber: 1,
    direction: Direction.RIGHT,
    inventory: [],
  });
  const codeSet: CodeSet = {};

  // Player 1: 동전 수집하고 상자와 상호작용
  codeSet['player1'] = `
      yield api.move("front");
      yield api.turn("down");
      yield api.collect("front");
      yield api.turn("right");
      yield api.move("front");
      yield api.turn("down");
      yield api.move("front");
      yield api.move("front");
      yield api.collect("front");
      yield api.turn("right");
      yield api.move("front");
      yield api.move("front");
      yield api.interact();
      const p = api.isPassable({ x: 1, y: 1 });
      yield console.log("Is passable:", p);
      `;

  // For now, return mock data with the correct structure
  const stageDataSet: StageDataSet = {
    config: stageConfig,
    entityDefinitions: definitions,
    stageData: {
      characters: characters,
      objects: objects,
      tiles: tiles,
    },
    codes: codeSet,
  };

  return (
    <div className='grid grid-cols-7 p-4 gap-4'>
      <div
        className='col-span-5 border rounded-xl border-black overflow-hidden shadow-2xl'
        style={{ width: '100%', height: '600px' }}
      >
        <BlocklyEditor readOnly={false} />
      </div>
      <div className='col-span-2 flex flex-col p-2 gap-4 border-black border rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-transform duration-300'>
        <div className='text-2xl font-bold border border-green-400 rounded-lg py-2 px-4'>
          <StageViewer stageDataSet={stageDataSet} />
        </div>
        <div className='py-2 px-4 border-2 rounded-lg text-lg font-bold border-orange-500'>
          <p>내 캐릭터는 1번입니다.</p>
        </div>
        <div className='py-2 px-4 border-2 rounded-lg text-base border-sky-500'>
          <p>
            문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명문제설명
          </p>
        </div>
        <div className='flex justify-center border-t pt-4'>
          <button className='bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 w-full rounded-2xl'>
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
}
