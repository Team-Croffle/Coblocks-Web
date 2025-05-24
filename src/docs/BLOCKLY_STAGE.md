# BlocklyStage initialStage Data Structure

This document explains the data structure required for the `initialStage` prop of the `BlocklyStage` component.

## Overview

The `initialStage` prop accepts data in three formats:
1. A JavaScript object with the stage data
2. A JSON string that can be parsed into a stage data object
3. An XML string that follows a specific format for stage data

## Stage Data Structure

The stage data object should have the following structure:

```javascript
{
  // Stage dimensions (in grid cells)
  "col": Number,       // number of the stage grid columns (required)
  "row": Number,      // number of the stage grid rows (required)
  
  // Grid cells - defines the type of each cell in the grid
  "tiles": [
    {
      "x": Number,       // X coordinate in the grid (0-based)
      "y": Number,       // Y coordinate in the grid (0-based)
      "type": String     // Cell type: "grass" (default), "path", "wall", etc.
    },
    // ... more cells
  ],
  
  // Objects placed on the stage
  "objects": [
    {
      "id": String,      // Unique identifier for the object
      "type": String,    // Object type: "button", "door", etc.
      "x": Number,       // X coordinate in the grid
      "y": Number,       // Y coordinate in the grid
      "state": String,   // Object state: "default", "pressed", "open", "closed", etc.
      "linkedTo": String // Optional: ID of a linked object (e.g., button linked to door)
    },
    // ... more objects
  ],
  
  // Character initial position and direction
  "players": {
    "id": Number,
    "x": Number,         // Initial X coordinate in the grid
    "y": Number,         // Initial Y coordinate in the grid
    "direction": String  // Initial direction: "up", "down", "left", "right" (default: "right")
  }
}
```

## Example Stage Data

Here's a complete example of a stage data object:

```javascript
{
  "col": 8,
  "row": 7,
  "tiles": [
    [2, 2, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  "objects": [
    {
      "id": "button1",
      "type": "button",
      "x": 2,
      "y": 1,
      "state": "default",
      "linkedTo": "door1"
    },
    {
      "id": "door1",
      "type": "door",
      "x": 4,
      "y": 5,
      "state": "default"
    }
  ],
  "players": [
    {
      "id": 1,
      "x": 0,
      "y": 1,
      "direction": "down"
    }
  ]
}
```

## Cell Types

The following cell types are supported:
- `"grass"`: Default cell type, walkable
- `"path"`: Walkable path
- `"wall"`: Non-walkable obstacle

## Object Types

The following object types are supported:
- `"button"`: A button that can be pressed to trigger actions
  - States: `"default"`, `"pressed"`
- `"door"`: A door that can be opened or closed
  - States: `"open"`, `"closed"`

## Character Directions

The character can face in one of four directions:
- `"up"`: Character faces upward
- `"down"`: Character faces downward
- `"left"`: Character faces left
- `"right"`: Character faces right (default)

## Usage in BlocklyStage

```jsx
import BlocklyStage from '@/components/modules/blockly/BlocklyStage';
import stageData from '@/data/StageTest.json';

// Using a JSON object
<BlocklyStage initialStage={stageData} />

// Using a JSON string
<BlocklyStage initialStage={JSON.stringify(stageData)} />
```