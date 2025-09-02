import { LoaderFunctionArgs } from '@remix-run/node';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { CoblocksStage, StageConfig } from '@croffledev/coblocks-stage-react';
import { useLoaderData } from '@remix-run/react';
import {
  CodeSet,
  Direction,
  EntityDefinition,
  EntityType,
  ObjectData,
  StageCharacterData,
  TileData,
} from '@croffledev/coblocks-stage-core';
import { WorkspaceWrapper } from '~/components/WorkspaceWrapper';
import { StageDataSet } from '~/types/stages';
import ParticipantList from '~/components/ParticipantList';
import { Participant } from '~/assets/dummy/classroomData';
import { useSocket } from '~/context/socket-context';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = createSupabaseServerClient({ request });

  // mock data
  const { data, error } = await supabase
    .from('notice')
    .select('notice_id, notice_name, notice_content')
    .order('notice_time', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch data: ${error.message}`);
  }

  // mock data
  const stageConfig: StageConfig = {
    size: { width: 8, height: 6 },
    tileSize: 50,
    showGrid: false,
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

  return Response.json(stageDataSet);
};

// 라우트 컴포넌트 - 데이터를 컴포넌트에 전달
export default function WorkspaceRoute(): JSX.Element {
  // mock data
  const stageDataSet = useLoaderData<typeof loader>();
  // const socket = useSocket();

  // mock data
  const participants: Participant[] = [];

  // 컴포넌트에 데이터 전달
  return (
    <div className='grid grid-cols-7 w-full p-4 grow'>
      <div className='flex col-span-5 flex-col border p-2 border-gray-500 rounded-2xl shadow-lg mr-2'>
        <WorkspaceWrapper stageDataSet={stageDataSet} />
      </div>
      <div className='col-span-2 ml-2'>
        <div className='flex flex-col w-full border border-gray-300 p-2 rounded-lg shadow-md gap-2'>
          <div className='text-2xl font-bold border border-green-400 rounded-lg py-2 px-4'>
            <p className='truncate'>제목제목제목제목제목제목제목제목제목제목제목</p>
          </div>
          <div className='flex-grow mb-4 p-2 border border-orange-500 rounded-lg overflow-y-auto'>
            설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명설명
          </div>
          <div className='flex-grow overflow-y-auto'>
            <ParticipantList participants={participants} />
          </div>
          <div>
            채팅
            <div>
              <input
                type='text'
                placeholder='메시지를 입력하세요...'
              />
              <button>전송</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
