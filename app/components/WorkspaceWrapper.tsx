import { CoblocksStage, StageRef } from '@croffledev/coblocks-stage-react';
import { useNavigate } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { StageDataSet } from '~/types/stages';

interface WorkspaceWrapperProps {
  stageDataSet: StageDataSet;
}

export const WorkspaceWrapper = ({ stageDataSet }: WorkspaceWrapperProps): JSX.Element => {
  const { config, entityDefinitions, stageData, codes } = stageDataSet;

  const stageRef = useRef<StageRef>(null);
  const nav = useNavigate();

  const [isMounted, setIsMounted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const stageWidth = config.size.width * (config.tileSize || 32) + 5;
  const stageHeight = config.size.height * (config.tileSize || 32) + 5;

  // 컴포넌트에 데이터 전달
  return (
    <>
      <div className='flex w-full grow items-center justify-center'>
        <CoblocksStage
          ref={stageRef}
          config={config}
          entityDefinitions={entityDefinitions}
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
    </>
  );
};
