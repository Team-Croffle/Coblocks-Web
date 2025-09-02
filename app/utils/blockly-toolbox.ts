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
        {
          kind: 'block',
          type: 'wait_and_move',
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
          type: 'is_passable',
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
      this.setTooltip('캐릭터를 왼쪽으로 회전시킵니다.');
    },
  };

  Blockly.Blocks['turn_right'] = {
    init: function () {
      this.appendDummyInput().appendField('오른쪽으로 회전');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('캐릭터를 오른쪽으로 회전시킵니다.');
    },
  };

  Blockly.Blocks['wait_and_move'] = {
    init: function () {
      this.appendDummyInput().appendField('대기 후 이동');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('캐릭터가 지나갈 수 있을 때까지 대기한 후 이동합니다.');
    },
  };

  Blockly.Blocks['interact'] = {
    init: function () {
      this.appendDummyInput().appendField('상호작용');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('캐릭터가 한 칸 앞에 있는 물체와 상호작용합니다.');
    },
  };

  Blockly.Blocks['collect_item'] = {
    init: function () {
      this.appendDummyInput().appendField('아이템 수집');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('캐릭터가 한 칸 앞에 있는 아이템을 수집합니다.');
    },
  };

  Blockly.Blocks['wait'] = {
    init: function () {
      this.appendDummyInput().appendField('대기');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('캐릭터가 대기합니다.');
    },
  };

  Blockly.Blocks['is_passable'] = {
    init: function () {
      this.appendDummyInput().appendField('이동 가능 여부');
      this.setOutput(true, 'Boolean');
      this.setColour(230);
      this.setTooltip('캐릭터가 한 칸 앞에 이동할 수 있는지 확인합니다.');
    },
  };
};

// JavaScript generator for custom blocks
export const characterBlocksGenerator = () => {
  javascriptGenerator.forBlock['move_forward'] = function (block) {
    // 'actions.move(gameState.player.direction)' 대신 'worker.moveForward()' 사용
    return `yield api.move('front');\n`;
  };

  javascriptGenerator.forBlock['turn_left'] = function (block) {
    return `yield api.turn('left');\n`;
  };

  javascriptGenerator.forBlock['turn_right'] = function (block) {
    return `yield api.turn('right');\n`;
  };

  javascriptGenerator.forBlock['wait_and_move'] = function (block) {
    return `do {
  yield api.wait();
} while (!api.isPassable(api.getPosition()));
yield api.move('front');\n`;
  };

  javascriptGenerator.forBlock['interact'] = function (block) {
    return `yield api.interact();\n`;
  };

  javascriptGenerator.forBlock['collect_item'] = function (block) {
    return `yield api.collect();\n`;
  };

  javascriptGenerator.forBlock['wait'] = function (block) {
    return `yield api.wait();\n`;
  };

  javascriptGenerator.forBlock['is_passable'] = function (block) {
    return `api.isPassable(api.getPosition());\n`;
  };
};
