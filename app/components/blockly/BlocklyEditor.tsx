import { useEffect, useRef, useState } from 'react';
import { characterBlocks, characterBlocksGenerator, characterToolbox } from '~/utils/blockly-toolbox';
import * as Blockly from 'blockly';

interface BlocklyEditorProps {
  readOnly?: boolean;
  initialBlocks?: any[];
  onWorkspaceReady?: (workspace: any) => void;
  blocklyOptions?: any;
}

export function BlocklyEditor({ readOnly, initialBlocks, onWorkspaceReady, blocklyOptions }: BlocklyEditorProps) {
  const blocklyDiv = useRef(null); // Blockly를 주입할 div 요소 참조
  const [workspace, setWorkspace] = useState<Blockly.WorkspaceSvg | null>(null); // 생성된 Blockly 워크스페이스 인스턴스 참조
  const [currentCode, setCurrentCode] = useState<{ [key: string]: any } | null>(null); // 현재 코드 상태

  useEffect(() => {
    characterBlocks();
    characterBlocksGenerator();

    if (workspace) {
      const code = Blockly.JavaScript.workspaceToCode(workspace);
      setCurrentCode(code);

      workspace.dispose();
      setWorkspace(null);
    }

    const options = {
      toolbox: characterToolbox,
      readOnly: readOnly,
      scrollbars: true,
      trashcan: true,
      renderer: 'zelos',
      ...blocklyOptions, // 부모로부터 전달받은 추가 옵션 병합
    };

    const newWorkspace = Blockly.inject(blocklyDiv.current!, options);

    if (currentCode) {
      Blockly.serialization.workspaces.load(currentCode, newWorkspace);
    } else if (initialBlocks) {
      Blockly.serialization.workspaces.load(initialBlocks, newWorkspace);
    }

    setWorkspace(newWorkspace);

    const resizeObserver = new ResizeObserver(() => {
      if (workspace) {
        Blockly.svgResize(workspace);
      }
      resizeObserver.disconnect();
    });

    resizeObserver.observe(blocklyDiv.current!);

    return () => {
      newWorkspace.dispose();
      setWorkspace(null);
    };
  }, [readOnly, initialBlocks]);

  // Blockly가 주입될 DOM 요소를 렌더링
  return (
    <div
      id='blocklyDiv'
      ref={blocklyDiv}
      style={{ width: '100%', height: '100%' }}
    ></div>
  );
}
