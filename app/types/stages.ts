import { CodeSet, EntityDefinition, StageData } from '@croffledev/coblocks-stage-core';
import { StageConfig } from '@croffledev/coblocks-stage-react';

export type StageDataSet = {
  config: StageConfig;
  entityDefinitions: EntityDefinition[];
  stageData: StageData;
  codes: CodeSet;
};
