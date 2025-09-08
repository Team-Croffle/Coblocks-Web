import { CoblocksStage } from '@croffledev/coblocks-stage-react';
import { useEffect, useState } from 'react';
import { StageDataSet } from '~/types/stages';

interface StageViewerProps {
  stageDataSet: StageDataSet;
}

export function StageViewer({ stageDataSet }: StageViewerProps): JSX.Element {
  const { config, entityDefinitions, stageData, codes } = stageDataSet;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  const stageWidth = config.size.width * (config.tileSize || 32) + 5;
  const stageHeight = config.size.height * (config.tileSize || 32) + 5;

  return (
    <div className='flex w-full grow items-center justify-center'>
      <CoblocksStage
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
  );
}
