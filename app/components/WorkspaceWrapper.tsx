import { CoblocksStage, StageConfig, StageRef } from '@croffledev/coblocks-stage-react';
import { useNavigate } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { useWorkspace } from '~/store/store';
import { supabase } from '~/utils/supabase.client';
import ParticipantList from './ParticipantList';
import { CodeSet, EntityDefinition, StageData } from '@croffledev/coblocks-stage-core';
import { StageDataSet } from '~/types/stages';

export const WorkspaceWrapper = (): JSX.Element => {
  // const { config, entityDefinitions, stageData, codes }
  const [config, setConfig] = useState<StageConfig | null>(null);
  const [definitions, setDefinitions] = useState<EntityDefinition[]>([]);
  const [stageData, setStageData] = useState<StageData | null>(null);
  const [codes, setCodes] = useState<CodeSet>({});

  const { socket, questInfo, participants, setSession, connectionSocket } = useWorkspace();

  const stageRef = useRef<StageRef>(null);
  const nav = useNavigate();

  const [isMounted, setIsMounted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    connectionSocket();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session!);
    });

    socket?.emit('classroom:getList');

    if (questInfo) {
      const dataSet: StageDataSet = JSON.parse(questInfo.default_stage);

      setConfig(dataSet.config);
      setDefinitions(dataSet.entityDefinitions);
      setStageData(dataSet.stageData);
      setCodes(dataSet.codes);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setSession, connectionSocket]);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  function handleStart() {
    setIsRunning(true);
    if (stageRef.current) {
      stageRef.current.start();
    }
  }

  function handleReset() {
    setIsRunning(false);
    if (stageRef.current) {
      stageRef.current.reset();
    }
  }

  function handleGoToEditor() {
    nav('/classroom/workspace/blockly');
  }

  if (!config) {
    return <div>Loading config...</div>;
  }
  const stageWidth = config.size.width * (config.tileSize || 32) + 5;
  const stageHeight = config.size.height * (config.tileSize || 32) + 5;

  // 컴포넌트에 데이터 전달
  return (
    <>
      <div className='grid grid-cols-7 w-full p-4 grow'>
        <div className='flex col-span-5 flex-col border p-2 border-gray-500 rounded-2xl shadow-lg mr-2'>
          <div className='flex w-full grow items-center justify-center'>
            {config && stageData && stageData && (
              <CoblocksStage
                ref={stageRef}
                config={config}
                entityDefinitions={definitions}
                stageData={stageData}
                codes={codes}
                onExecutionComplete={function (): void {
                  throw new Error('Function not implemented.');
                }}
                onError={function (): void {
                  throw new Error('Function not implemented.');
                }}
                style={{
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  width: `${stageWidth}px`,
                  height: `${stageHeight}px`,
                }}
              />
            )}
          </div>
          <div className='flex h-16 items-center justify-evenly w-full border-t border-gray-400'>
            <button
              className='bg-green-500 hover:bg-green-400 text-white font-bold py-2 w-40 rounded-2xl disabled:bg-gray-400'
              disabled={isRunning}
              onClick={handleStart}
            >
              {isRunning ? '실행 중...' : '실행'}
            </button>
            <button
              className='bg-red-500 hover:bg-red-400 text-white font-bold py-2 w-40 rounded-2xl disabled:bg-gray-400'
              disabled={!isRunning}
              onClick={handleReset}
            >
              초기화
            </button>
            <button
              className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 w-40 rounded-2xl'
              onClick={handleGoToEditor}
            >
              문제풀러가기
            </button>
          </div>
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
    </>
  );
};
