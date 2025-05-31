# Character Sprite System

This document explains how to use the character sprite system in the application.

## Directory Structure

The character sprites are organized in the following directory structure:

```
src/assets/images/Characters/
├── Idle/           # Contains idle animation sprites
│   └── Idle (1).png, Idle (2).png, ..., Idle (15).png
└── Walk/           # Contains walking animation sprites
    └── Walk (1).png, Walk (2).png, ..., Walk (15).png
```

## Sprite Requirements

- All sprite images should be in PNG format with transparency
- Each animation (Idle and Walk) requires 15 frames
- Images should have consistent dimensions
- Character should be centered in each frame
- File naming must follow the convention: `Idle (N).png` or `Walk (N).png` where N is the frame number

## How the Sprite System Works

1. The `StageScene.js` file loads all sprite images during the `preload()` method
2. The `Character.js` class creates animations using these sprites
3. The animations are played based on character state (idle or walking)
4. The sprite is automatically flipped horizontally based on the character's direction

## Adding Custom Sprites

To add your own character sprites:

1. Create 15 frames for the idle animation and place them in the `src/assets/images/Characters/Idle/` directory
2. Create 15 frames for the walking animation and place them in the `src/assets/images/Characters/Walk/` directory
3. Make sure to follow the naming convention: `Idle (N).png` and `Walk (N).png`

## Error Handling

The system includes error handling for missing sprite images. If a sprite image cannot be loaded, a warning will be logged to the console. In a production environment, you should add fallback images to ensure the game still works even if some sprite images are missing.

## Technical Implementation

The sprite system uses Phaser.js for animation handling. The key components are:

- `StageScene.js`: Loads sprite images and creates the game scene
- `Character.js`: Creates and manages character animations

For more details, refer to the code documentation in these files.