/* eslint-disable no-unused-vars */
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript'; // JavaScript 생성기 명시적 임포트

export const characterToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: '이동',
      colour: '#4C97FF',
      contents: [
        {
          kind: 'block',
          type: 'move_forward',
        },
        {
          kind: 'block',
          type: 'turn_left',
        },
        {
          kind: 'block',
          type: 'turn_right',
        },
      ],
    },
    {
      kind: 'category',
      name: '상호작용',
      colour: '#40BF4A',
      contents: [
        {
          kind: 'block',
          type: 'interact',
        },
        {
          kind: 'block',
          type: 'collect_item',
        },
        {
          kind: 'block',
          type: 'drop_item',
        },
      ],
    },
    {
      kind: 'category',
      name: '제어',
      colour: '#FF6680',
      contents: [
        {
          kind: 'block',
          type: 'controls_repeat',
        },
        {
          kind: 'block',
          type: 'controls_if',
        },
        {
          kind: 'block',
          type: 'wait',
        },
      ],
    },
    {
      kind: 'category',
      name: '감지',
      colour: '#9966FF',
      contents: [
        {
          kind: 'block',
          type: 'is_wall_ahead',
        },
        {
          kind: 'block',
          type: 'is_object_ahead',
        },
        {
          kind: 'block',
          type: 'is_door_open',
        },
        {
          kind: 'block',
          type: 'has_item',
        },
      ],
    },
  ],
};

// Custom block definitions
export const characterBlocks = () => {
  Blockly.Blocks['move_forward'] = {
    init: function () {
      this.appendDummyInput().appendField('앞으로 이동');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('캐릭터를 한 칸 앞으로 이동합니다.');
    },
  };

  Blockly.Blocks['turn_left'] = {
    init: function () {
      this.appendDummyInput().appendField('왼쪽으로 회전');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('캐릭터를 왼쪽으로 90도 회전합니다.');
    },
  };

  Blockly.Blocks['turn_right'] = {
    init: function () {
      this.appendDummyInput().appendField('오른쪽으로 회전');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('캐릭터를 오른쪽으로 90도 회전합니다.');
    },
  };

  Blockly.Blocks['interact'] = {
    init: function () {
      this.appendDummyInput().appendField('상호작용하기');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('앞에 있는 오브젝트와 상호작용합니다.');
    },
  };

  Blockly.Blocks['collect_item'] = {
    init: function () {
      this.appendDummyInput().appendField('아이템 줍기');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('현재 위치의 아이템을 주웁니다.');
    },
  };

  Blockly.Blocks['drop_item'] = {
    init: function () {
      this.appendDummyInput().appendField('아이템 내려놓기');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('들고 있는 아이템을 현재 위치에 내려놓습니다.');
    },
  };

  Blockly.Blocks['wait'] = {
    init: function () {
      this.appendDummyInput().appendField('기다리기');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip('한 턴 기다립니다.');
    },
  };

  Blockly.Blocks['is_wall_ahead'] = {
    init: function () {
      this.appendDummyInput().appendField('앞이 벽인가?');
      this.setOutput(true, 'Boolean');
      this.setColour(210);
      this.setTooltip('앞에 벽이 있는지 확인합니다.');
    },
  };

  Blockly.Blocks['is_object_ahead'] = {
    init: function () {
      this.appendDummyInput().appendField('앞에 오브젝트가 있는가?');
      this.setOutput(true, 'Boolean');
      this.setColour(210);
      this.setTooltip('앞에 상호작용 가능한 오브젝트가 있는지 확인합니다.');
    },
  };

  Blockly.Blocks['is_door_open'] = {
    init: function () {
      this.appendDummyInput().appendField('문이 열려있는가?');
      this.setOutput(true, 'Boolean');
      this.setColour(210);
      this.setTooltip('앞에 있는 문이 열려있는지 확인합니다.');
    },
  };

  Blockly.Blocks['has_item'] = {
    init: function () {
      this.appendDummyInput().appendField('아이템을 들고 있는가?');
      this.setOutput(true, 'Boolean');
      this.setColour(210);
      this.setTooltip('캐릭터가 아이템을 들고 있는지 확인합니다.');
    },
  };
};

// JavaScript generator for custom blocks
export const characterBlocksGenerator = () => {
  javascriptGenerator.forBlock['move_forward'] = function (block) {
    return 'await actions.move(gameState.player.direction);\n';
  };

  javascriptGenerator.forBlock['turn_left'] = function (block) {
    return 'await actions.turn("left");\n';
  };

  javascriptGenerator.forBlock['turn_right'] = function (block) {
    return 'await actions.turn("right");\n';
  };

  javascriptGenerator.forBlock['interact'] = function (block) {
    return 'await actions.interact();\n';
  };

  javascriptGenerator.forBlock['collect_item'] = function (block) {
    return 'await actions.collect();\n';
  };

  javascriptGenerator.forBlock['drop_item'] = function (block) {
    return 'await actions.drop();\n';
  };

  javascriptGenerator.forBlock['wait'] = function (block) {
    return 'await actions.wait();\n';
  };

  javascriptGenerator.forBlock['is_wall_ahead'] = function (block) {
    return ['actions.isWallAhead()', javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['is_object_ahead'] = function (block) {
    return ['actions.isObjectAhead()', javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['is_door_open'] = function (block) {
    return ['actions.isDoorOpen()', javascriptGenerator.ORDER_FUNCTION_CALL];
  };

  javascriptGenerator.forBlock['has_item'] = function (block) {
    return ['actions.hasItem()', javascriptGenerator.ORDER_FUNCTION_CALL];
  };
};

characterBlocks();
characterBlocksGenerator();
