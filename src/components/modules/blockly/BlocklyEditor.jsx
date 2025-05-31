import React, { useRef, useEffect } from 'react';
import { characterToolbox } from './toolbox';
import * as Blockly from 'blockly';
import 'blockly/javascript';
import 'blockly/msg/ko';

// 필요한 언어 제너레이터 임포트 (예: JavaScript)
// 실제 프로젝트에서는 필요한 제너레이터만 선택적으로 임포트합니다.

const BlocklyEditor = ({
  readOnly = false, // 읽기 전용 여부 (기본값 false)
  initialBlocks = null, // 초기 블록 상태 (XML 또는 JSON)
  onWorkspaceReady = () => {}, // 워크스페이스 생성 완료 시 호출될 콜백
  blocklyOptions = {}, // Blockly.inject에 추가로 전달할 옵션
}) => {
  const blocklyDiv = useRef(null); // Blockly를 주입할 div 요소 참조
  const workspace = useRef(null); // 생성된 Blockly 워크스페이스 인스턴스 참조

  // 워크스페이스 초기화 및 속성 변경 감지 useEffect
  useEffect(() => {
    // 워크스페이스 옵션 설정
    const options = {
      toolbox: characterToolbox,
      readOnly: readOnly,
      scrollbars: true,
      trashcan: true,
      renderer: 'zelos',
      ...blocklyOptions, // 부모로부터 전달받은 추가 옵션 병합
    };

    // 기존 워크스페이스가 있다면 상태 저장 후 제거
    let savedState = null;
    if (workspace.current) {
      try {
        savedState = Blockly.serialization.workspaces.save(workspace.current);
      } catch (e) {
        console.error('Failed to save Blockly state:', e);
        savedState = null;
      }

      workspace.current.dispose();
      workspace.current = null;
    }

    // 새로운 워크스페이스 생성 및 주입
    if (blocklyDiv.current) {
      const newWorkspace = Blockly.inject(blocklyDiv.current, options);
      workspace.current = newWorkspace;

      // 저장된 상태 또는 초기 블록 상태 로드
      const stateToLoad = savedState || initialBlocks;
      if (stateToLoad) {
        try {
          if (Blockly.serialization && Blockly.serialization.workspaces && typeof stateToLoad === 'object') {
            Blockly.serialization.workspaces.load(stateToLoad, newWorkspace);
          } else if (typeof stateToLoad === 'string') {
            const xml = Blockly.Xml.textToDom(stateToLoad);
            Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, newWorkspace);
          } else {
            console.warn('Initial blocks/saved state is not in a supported format (object or XML string).');
          }
        } catch (e) {
          console.error('Failed to load initial blocks/saved state:', e);
        }
      }

      // 부모 컴포넌트로 워크스페이스 인스턴스 전달
      // onWorkspaceReady 함수가 변경될 수 있으므로 의존성에 포함되어야 함.
      // 부모에서 이 함수를 useCallback으로 감싸는 것이 성능상 좋음.
      onWorkspaceReady(newWorkspace);

      // 컨테이너 크기 변경 감지를 위한 ResizeObserver 설정
      const resizeObserver = new ResizeObserver(() => {
        if (workspace.current) {
          Blockly.svgResize(workspace.current);
        }
      });

      resizeObserver.observe(blocklyDiv.current);

      // 컴포넌트 언마운트 시 클린업 함수
      return () => {
        if (workspace.current) {
          workspace.current.dispose();
          //workspace.current = null;
        }
        resizeObserver.disconnect();
      };
    }

    // blocklyDiv.current가 없을 경우 아무것도 하지 않음
    return () => {};

    // ESLint 경고 해결: 사용되는 모든 props를 의존성 배열에 포함
    // readOnly, toolbox, initialBlocks, blocklyOptions 값이 변경되면 워크스페이스를 새로 로드해야 함.
    // onWorkspaceReady 함수 참조가 변경되어도 이펙트는 재실행되어야 하지만,
    // 실제 앱에서는 onWorkspaceReady를 useCallback으로 감싸 불필요한 재실행을 막아야 함.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly, initialBlocks, onWorkspaceReady]);

  // Blockly가 주입될 DOM 요소를 렌더링
  return (
    <div
      ref={blocklyDiv}
      style={{ width: '100%', height: '100%' }}
    ></div>
  );
};

export default BlocklyEditor;
